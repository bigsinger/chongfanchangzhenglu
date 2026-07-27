'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bundleArg = process.argv.find((arg) => arg.startsWith('--bundle='));
const requestedBundle = bundleArg && path.resolve(root, bundleArg.slice('--bundle='.length));
const mainDir = requestedBundle
  ? path.dirname(requestedBundle)
  : path.join(root, 'build', 'jsb-link', 'assets', 'main');
const bundleName = requestedBundle
  ? path.basename(requestedBundle)
  : fs.existsSync(mainDir) && fs.readdirSync(mainDir)
    .find((name) => /^index(?:\.[a-f0-9]+)?\.js$/i.test(name));
const bundle = bundleName && path.join(mainDir, bundleName);
const remove = new Set([
  'BaseScene',
  'GameInfo',
  'LegacyHotUpdate',
  'LegacyHttpClient',
  'LegacySceneEditor',
  'LegacyItemEventModel',
  'LegacyItemModel',
  'LegacyNetworkTip',
  'RoadLayer'
]);

if (!bundle || !fs.existsSync(bundle)) throw new Error(`生产脚本包不存在：${mainDir}`);
let source = fs.readFileSync(bundle, 'utf8');
const modulePattern = /(?:^|\n\s{0,2}|\(\{|],)([A-Za-z_$][\w$]*):\s*\[\s*function\([^)]*\)\s*\{/gm;
const modules = [...source.matchAll(modulePattern)].map((match) => ({
  name: match[1],
  start: match.index + match[0].lastIndexOf(match[1])
}));
const findEntry = (text) => {
  const matches = [...text.matchAll(/}\s*,\s*{}\s*,\s*\[/g)];
  return matches[matches.length - 1];
};
const originalEntry = findEntry(source);
const originalEntryStart = originalEntry && originalEntry.index;
let removedBytes = 0;
for (let index = modules.length - 1; index >= 0; index--) {
  const module = modules[index];
  if (!remove.has(module.name)) continue;
  const end = index + 1 < modules.length ? modules[index + 1].start : originalEntryStart;
  if (end <= module.start) throw new Error(`无法定位模块边界：${module.name}`);
  removedBytes += end - module.start;
  source = `${source.slice(0, module.start)}${source.slice(end)}`;
}

const entryMatch = findEntry(source);
const entryStart = entryMatch && entryMatch.index;
const entryArrayStart = entryMatch && entryStart + entryMatch[0].lastIndexOf('[');
const entryArrayEnd = source.indexOf(']);', entryArrayStart);
if (entryStart == null || entryArrayStart == null || entryArrayEnd < 0) {
  throw new Error('无法定位生产脚本入口列表');
}
const entries = [...source.slice(entryArrayStart, entryArrayEnd).matchAll(/"([^"]+)"/g)]
  .map((match) => match[1])
  .filter((name) => !remove.has(name));
const compact = !source.includes('\n');
const serializedEntries = compact
  ? `[${entries.map((name) => JSON.stringify(name)).join(',')}]`
  : `[ ${entries.map((name) => JSON.stringify(name)).join(', ')} ]`;
source = `${source.slice(0, entryArrayStart)}${serializedEntries}${source.slice(entryArrayEnd + 1)}`;

for (const name of remove) {
  if (new RegExp(`cc\\._RF\\.push\\([^)]*,\\s*"${name}"\\)`).test(source)) {
    throw new Error(`生产包仍含模块：${name}`);
  }
}
fs.writeFileSync(bundle, source);
console.log(`生产包裁剪：移除 ${remove.size} 个编辑器/热更新/旧网络模块，减少 ${(removedBytes / 1024).toFixed(1)}KiB`);
