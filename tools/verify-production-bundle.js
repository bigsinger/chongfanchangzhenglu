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
const found = forbidden.filter((name) => new RegExp(`cc\\._RF\\.push\\([^)]*,\\s*"${name}"\\)`).test(source));
if (found.length) throw new Error(`生产包含禁用模块：${found.join(', ')}`);
const entryMatches = [...source.matchAll(/}\s*,\s*{}\s*,\s*\[/g)];
const entryMatch = entryMatches[entryMatches.length - 1];
const entryStart = entryMatch && entryMatch.index;
const entryArrayStart = entryMatch && entryStart + entryMatch[0].lastIndexOf('[');
const entryArrayEnd = source.indexOf(']);', entryArrayStart);
if (entryStart == null || entryArrayStart == null || entryArrayEnd < 0) throw new Error('生产包入口数组缺失');
const entryArray = source.slice(entryArrayStart, entryArrayEnd + 1);
if (/\[\s*,|,\s*,|,\s*\]/.test(entryArray)) throw new Error('生产包入口数组包含空洞');
console.log(`生产包验证：已排除 ${forbidden.join(', ')}`);
