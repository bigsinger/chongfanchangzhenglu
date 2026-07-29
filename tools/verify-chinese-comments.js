'use strict';

/**
 * 模块职责：核验项目自维护代码都具备中文模块说明和关键约束。
 * 关键约束：恢复区保存原版生成物，保持逐字溯源，不把它误当成日常维护源码改写。
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const failures = [];

function filesIn(directory, extension) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.join(directory, entry.name));
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function requirePattern(file, pattern, message) {
  const content = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  if (!pattern.test(content)) failures.push(`${relative(file)}：${message}`);
}

const runtimeJs = filesIn(path.join(root, 'assets', 'Scripts'), '.js');
const toolJs = filesIn(path.join(root, 'tools'), '.js');
for (const file of runtimeJs.concat(toolJs)) {
  requirePattern(
    file,
    /\/\*\*[\s\S]*?模块职责：[\s\S]*?关键约束：[\s\S]*?\*\//,
    '缺少“模块职责/关键约束”中文模块注释'
  );
}

const powershellFiles = filesIn(path.join(root, 'tools'), '.ps1')
  .concat(filesIn(path.join(root, 'tests', 'manual', 'android-game'), '.ps1'));
for (const file of powershellFiles) {
  requirePattern(file, /<#([\s\S]*?[\u3400-\u9fff][\s\S]*?)#>/, '缺少中文帮助注释');
}

const pythonFiles = filesIn(path.join(root, 'tests', 'manual', 'android-game'), '.py');
for (const file of pythonFiles) {
  requirePattern(
    file,
    /^(?:#![^\n]*\n)?(?:\uFEFF)?"""[\s\S]*?[\u3400-\u9fff][\s\S]*?"""/,
    '缺少中文模块文档字符串'
  );
}

if (failures.length) {
  failures.forEach((failure) => console.error(`[comments] ${failure}`));
  process.exit(1);
}

console.log(
  `中文注释：${runtimeJs.length} 个运行时模块、${toolJs.length} 个工具模块、` +
  `${powershellFiles.length} 个 PowerShell 脚本、${pythonFiles.length} 个 Python 工具通过`
);
