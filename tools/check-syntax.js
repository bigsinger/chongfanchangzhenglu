'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const scriptDir = path.join(root, 'assets', 'Scripts');
const files = fs.readdirSync(scriptDir).filter((name) => name.endsWith('.js')).sort();
for (const file of files) {
  const text = fs.readFileSync(path.join(scriptDir, file), 'utf8');
  new vm.Script(text, { filename: file });
}
for (const file of fs.readdirSync(path.join(root, 'assets', 'resources', 'gameConf')).filter((name) => name.endsWith('.json'))) {
  JSON.parse(fs.readFileSync(path.join(root, 'assets', 'resources', 'gameConf', file), 'utf8'));
}
console.log(`语法检查：${files.length} 个脚本、全部游戏配置通过`);
