'use strict';

const fs = require('fs');
const path = require('path');

const mainDir = path.resolve(__dirname, '..', 'build', 'jsb-link', 'assets', 'main');
const bundleName = fs.existsSync(mainDir) && fs.readdirSync(mainDir)
  .find((name) => /^index(?:\.[a-f0-9]+)?\.js$/i.test(name));
const bundle = bundleName && path.join(mainDir, bundleName);
if (!bundle || !fs.existsSync(bundle)) throw new Error(`生产脚本包不存在：${mainDir}`);
const source = fs.readFileSync(bundle, 'utf8');
const forbidden = [
  'LegacyHotUpdate',
  'LegacyHttpClient',
  'LegacySceneEditor',
  'LegacyItemEventModel',
  'LegacyItemModel',
  'LegacyNetworkTip',
  'RoadLayer',
];
const found = forbidden.filter((name) => new RegExp(`cc\\._RF\\.push\\([^\\n]+, "${name}"\\)`).test(source));
if (found.length) throw new Error(`生产包含禁用模块：${found.join(', ')}`);
const entryStart = source.lastIndexOf('}, {}, [');
const entryArrayStart = source.indexOf('[', entryStart);
const entryArrayEnd = source.indexOf(']);', entryArrayStart);
if (entryStart < 0 || entryArrayStart < 0 || entryArrayEnd < 0) throw new Error('生产包入口数组缺失');
const entryArray = source.slice(entryArrayStart, entryArrayEnd + 1);
if (/\[\s*,|,\s*,|,\s*\]/.test(entryArray)) throw new Error('生产包入口数组包含空洞');
console.log(`生产包验证：已排除 ${forbidden.join(', ')}`);
