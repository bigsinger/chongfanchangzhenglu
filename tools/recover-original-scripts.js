'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { applyRuntimeFixes } = require('./apply-runtime-fixes');

const projectRoot = path.resolve(__dirname, '..');
const bundlePath = path.resolve(process.argv[2] || path.join(projectRoot, 'recovery', 'original-main-index.js'));
const outputDirectory = path.resolve(process.argv[3] || path.join(projectRoot, 'assets', 'Scripts'));
const assetsRoot = path.resolve(process.argv[4] || path.join(projectRoot, 'assets'));
const manifestPath = path.join(projectRoot, 'recovery', 'original-scripts-manifest.json');

const BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const BASE64_VALUES = new Array(123).fill(64);
for (let index = 0; index < 64; index += 1) {
  BASE64_VALUES[BASE64_KEYS.charCodeAt(index)] = index;
}

const HEX_CHARS = '0123456789abcdef'.split('');
const UUID_TEMPLATE = ['', '', '', '', '', '', '', '', '-', '', '', '', '', '-', '', '', '', '', '-', '', '', '', '', '-', '', '', '', '', '', '', '', '', '', '', '', ''];
const UUID_INDICES = UUID_TEMPLATE.map((value, index) => value === '-' ? Number.NaN : index).filter(Number.isFinite);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeUuid22(base64) {
  assert(base64.length === 22, `Expected a 22-character UUID, received ${base64}`);
  const template = UUID_TEMPLATE.slice();
  template[0] = base64[0];
  template[1] = base64[1];
  for (let sourceIndex = 2, targetIndex = 2; sourceIndex < 22; sourceIndex += 2) {
    const left = BASE64_VALUES[base64.charCodeAt(sourceIndex)];
    const right = BASE64_VALUES[base64.charCodeAt(sourceIndex + 1)];
    template[UUID_INDICES[targetIndex++]] = HEX_CHARS[left >> 2];
    template[UUID_INDICES[targetIndex++]] = HEX_CHARS[((left & 3) << 2) | (right >> 4)];
    template[UUID_INDICES[targetIndex++]] = HEX_CHARS[right & 15];
  }
  return template.join('');
}

function classId23ToUuid(classId) {
  assert(classId.length === 23, `Expected a 23-character class id, received ${classId}`);
  const header = classId.slice(0, 5);
  const encodedTail = classId.slice(5);
  let paddedTail = encodedTail;
  if (encodedTail.length % 3 === 1) paddedTail += '==';
  else if (encodedTail.length % 3 === 2) paddedTail += '=';
  const longUuid = header + Buffer.from(paddedTail, 'base64').toString('hex');
  const rawHex = longUuid.slice(2).replace(/-/g, '') + 'f';
  const bytes = [];
  for (let index = 0; index < rawHex.length - 1; index += 2) {
    bytes.push(Number.parseInt(rawHex.slice(index, index + 2), 16));
  }
  const uuid22 = (longUuid.slice(0, 2) + Buffer.from(bytes).toString('base64')).slice(0, 4) + encodedTail;
  return decodeUuid22(uuid22);
}

function uuidToClassId23(uuid) {
  const header = uuid.slice(0, 5);
  const rawHex = uuid.slice(5).replace(/-/g, '') + 'f';
  const bytes = [];
  for (let index = 0; index < rawHex.length - 1; index += 2) {
    bytes.push(Number.parseInt(rawHex.slice(index, index + 2), 16));
  }
  const encoded = Buffer.from(bytes).toString('base64');
  return header + encoded.slice(0, encoded.length - 2);
}

function exposeBrowserifyModules(source) {
  const opening = 'window.__require = function t(e, o, i) {';
  assert(source.includes(opening), 'The APK main bundle does not have the expected Browserify wrapper');
  let instrumented = source.replace(opening, `${opening} window.__modules = e;`);
  const tailPattern = /\},\s*\{\},\s*\[[\s\S]*?\]\);\s*$/;
  assert(tailPattern.test(instrumented), 'The APK main bundle does not have the expected entry-point list');
  instrumented = instrumented.replace(tailPattern, '}, {}, []);');

  const sandbox = { window: {} };
  vm.runInNewContext(instrumented, sandbox, { filename: bundlePath, timeout: 3000 });
  assert(sandbox.window.__modules && typeof sandbox.window.__modules === 'object', 'Unable to expose Browserify modules');
  return sandbox.window.__modules;
}

function dedent(source) {
  const lines = source.replace(/^\s*\n/, '').replace(/\s+$/, '').split(/\r?\n/);
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length);
  const minimum = Math.min(...indents);
  return lines.map((line) => line.slice(Math.min(minimum, line.length))).join('\n');
}

function recoverModule(moduleName, moduleDefinition) {
  const moduleFunction = moduleDefinition[0];
  const dependencies = moduleDefinition[1] || {};
  const functionSource = moduleFunction.toString();
  const signature = functionSource.match(/^function\s*\(([^)]*)\)/);
  assert(signature, `Cannot read module parameters for ${moduleName}`);
  const parameters = signature[1].split(',').map((value) => value.trim());
  assert(parameters.length === 3, `Unexpected module signature for ${moduleName}`);
  const [requireName, moduleNameAlias, exportsName] = parameters;

  let body = functionSource.slice(functionSource.indexOf('{') + 1, functionSource.lastIndexOf('}'));
  const registrationPattern = /cc\._RF\.push\(\s*[^,]+,\s*["']([^"']+)["'],\s*["']([^"']+)["']\s*\)\s*;/;
  const registration = body.match(registrationPattern);
  assert(registration, `Missing cc._RF registration for ${moduleName}`);
  const classId = registration[1];
  const className = registration[2];
  assert(classId.length === 23, `Unexpected class id ${classId} for ${moduleName}`);
  body = body.replace(registrationPattern, '');
  body = body.replace(/cc\._RF\.pop\(\)\s*;/g, '');
  body = body.replace(/^\s*["']use strict["'];\s*/, '');

  for (const [request, target] of Object.entries(dependencies)) {
    const requestPattern = new RegExp(`\\b${escapeRegExp(requireName)}\\s*\\(\\s*(["'])${escapeRegExp(request)}\\1\\s*\\)`, 'g');
    body = body.replace(requestPattern, `require("./${target}")`);
  }

  const unresolvedRequire = new RegExp(`\\b${escapeRegExp(requireName)}\\s*\\(\\s*["']`);
  assert(!unresolvedRequire.test(body), `Unresolved Browserify dependency remains in ${moduleName}`);

  const uuid = classId23ToUuid(classId);
  assert(uuidToClassId23(uuid) === classId, `UUID round-trip failed for ${moduleName}`);
  const source = [
    "'use strict';",
    '',
    `var ${moduleNameAlias} = module;`,
    `var ${exportsName} = exports;`,
    '',
    dedent(body),
    '',
  ].join('\n');
  const meta = {
    ver: '1.0.5',
    uuid,
    isPlugin: false,
    loadPluginInWeb: true,
    loadPluginInNative: true,
    loadPluginInEditor: false,
    subMetas: {},
  };
  return { moduleName, className, classId, uuid, dependencies, source, meta };
}

function collectSerializedClassIds(rootDirectory) {
  const componentTypes = new Set();
  const eventTargets = new Set();
  const extensions = new Set(['.fire', '.prefab', '.anim']);
  function visitValue(value) {
    if (Array.isArray(value)) {
      value.forEach(visitValue);
      return;
    }
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (key === '__type__' && typeof child === 'string' && child.length === 23 && !child.startsWith('cc.')) {
        componentTypes.add(child);
      }
      if (key === '_componentId' && typeof child === 'string' && child.length === 23 && !child.startsWith('cc.')) {
        eventTargets.add(child);
      }
      visitValue(child);
    }
  }
  function walk(directory) {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (extensions.has(path.extname(entry.name))) visitValue(JSON.parse(fs.readFileSync(fullPath, 'utf8')));
    }
  }
  walk(rootDirectory);
  return {
    componentTypes: [...componentTypes].sort(),
    eventTargets: [...eventTargets].sort(),
  };
}

const originalBundle = fs.readFileSync(bundlePath, 'utf8');
const modules = exposeBrowserifyModules(originalBundle);
const recovered = Object.entries(modules).map(([name, definition]) => recoverModule(name, definition));
assert(recovered.length === 60, `Expected 60 original modules, recovered ${recovered.length}`);

fs.mkdirSync(outputDirectory, { recursive: true });
for (const script of recovered) {
  fs.writeFileSync(path.join(outputDirectory, `${script.moduleName}.js`), script.source, 'utf8');
  fs.writeFileSync(path.join(outputDirectory, `${script.moduleName}.js.meta`), `${JSON.stringify(script.meta, null, 2)}\n`, 'utf8');
}

const runtimeFixes = applyRuntimeFixes(projectRoot);

const serializedClassIds = collectSerializedClassIds(assetsRoot);
const recoveredClassIds = new Set(recovered.map((item) => item.classId));
const missingClassIds = serializedClassIds.componentTypes.filter((classId) => !recoveredClassIds.has(classId));
const staleEventTargetIds = serializedClassIds.eventTargets.filter((classId) => !recoveredClassIds.has(classId));
assert(missingClassIds.length === 0, `Serialized assets reference missing script classes: ${missingClassIds.join(', ')}`);

const manifest = {
  engineVersion: '2.4.3',
  source: path.relative(projectRoot, bundlePath).replace(/\\/g, '/'),
  sourceSha256: crypto.createHash('sha256').update(originalBundle).digest('hex').toUpperCase(),
  moduleCount: recovered.length,
  serializedComponentClassIds: serializedClassIds.componentTypes,
  serializedEventTargetClassIds: serializedClassIds.eventTargets,
  missingClassIds,
  staleEventTargetIds,
  modules: recovered.map(({ moduleName: name, className, classId, uuid, dependencies }) => ({ name, className, classId, uuid, dependencies })),
};
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(`Recovered ${recovered.length} original modules into ${outputDirectory}`);
console.log(`Applied runtime input fixes: ${runtimeFixes.files.join(', ')}`);
console.log(`Validated ${serializedClassIds.componentTypes.length} serialized custom component types; missing: ${missingClassIds.length}`);
console.log(`Preserved ${staleEventTargetIds.length} original stale click-event class id(s): ${staleEventTargetIds.join(', ') || 'none'}`);
console.log(`Bundle SHA-256: ${manifest.sourceSha256}`);
