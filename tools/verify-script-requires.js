'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const root = path.resolve(__dirname, '..');
const scriptsRoot = path.join(root, 'assets', 'Scripts');
let trackedScriptFiles = [];
try {
  trackedScriptFiles = childProcess
    .execFileSync('git', ['-C', root, 'ls-files', '-z', 'assets/Scripts/*.js'])
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .map((name) => path.basename(name));
} catch (_error) {}
const scriptNamesByLowerCase = new Map(
  trackedScriptFiles.map((name) => [name.toLowerCase(), name])
);
for (const name of fs.readdirSync(scriptsRoot).filter((entry) => entry.endsWith('.js'))) {
  if (!scriptNamesByLowerCase.has(name.toLowerCase())) {
    scriptNamesByLowerCase.set(name.toLowerCase(), name);
  }
}
const scriptFiles = [...scriptNamesByLowerCase.values()];
const exactNames = new Set(scriptFiles);
const byLowerName = new Map(scriptFiles.map((name) => [name.toLowerCase(), name]));
const failures = [];
let checked = 0;

for (const fileName of scriptFiles) {
  const source = fs.readFileSync(path.join(scriptsRoot, fileName), 'utf8');
  const requirePattern = /require\(["']\.\/([^"']+)["']\)/g;
  let match;
  while ((match = requirePattern.exec(source))) {
    checked++;
    const requestedName = `${match[1]}.js`;
    if (exactNames.has(requestedName)) continue;
    const actualName = byLowerName.get(requestedName.toLowerCase());
    failures.push(
      actualName
        ? `${fileName}: require("./${match[1]}") 大小写错误，实际为 "./${actualName.slice(0, -3)}"`
        : `${fileName}: require("./${match[1]}") 没有对应脚本`
    );
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`脚本依赖：${checked} 个相对 require 均存在且大小写精确`);
}
