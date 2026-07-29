'use strict';

/**
 * 模块职责：检查全部游戏脚本语法和核心配置 JSON。
 * 关键约束：在启动 Creator 前快速失败，避免长构建后才发现基础格式错误。
 */

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
for (const file of fs.readdirSync(path.join(root, 'assets', 'resources', 'config')).filter((name) => name.endsWith('.json'))) {
  JSON.parse(fs.readFileSync(path.join(root, 'assets', 'resources', 'config', file), 'utf8'));
}
console.log(`语法检查：${files.length} 个脚本、全部游戏配置通过`);
