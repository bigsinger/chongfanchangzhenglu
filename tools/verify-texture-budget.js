'use strict';

/**
 * 模块职责：统计纹理尺寸与解码内存并执行预算门禁。
 * 关键约束：对骨骼图集保留原尺寸，对普通纹理限制单张解码峰值。
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const assetRoot = path.join(root, 'assets');
// 骨骼图集原始尺寸最高 4096 像素；缩放已打包图集会破坏真机 Mali 上的奇数网格 UV。
const maxAtlasDimension = 4096;
const maxDecodedBytes = 64 * 1024 * 1024;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function pngDimensions(file) {
  const buffer = Buffer.alloc(24);
  const descriptor = fs.openSync(file, 'r');
  fs.readSync(descriptor, buffer, 0, 24, 0);
  fs.closeSync(descriptor);
  if (buffer.toString('ascii', 1, 4) !== 'PNG') throw new Error(`不是 PNG：${file}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const pngs = walk(assetRoot).filter((file) => file.endsWith('.png')).map((file) => {
  const size = pngDimensions(file);
  return {
    file: path.relative(root, file),
    width: size.width,
    height: size.height,
    decodedBytes: size.width * size.height * 4
  };
}).sort((a, b) => b.decodedBytes - a.decodedBytes);

const atlasPages = new Set();
for (const file of walk(path.join(assetRoot, 'resources', 'skeletons')).filter((entry) => entry.endsWith('.atlas'))) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    if (/^\S.*\.png$/.test(lines[index]) && /^size:\s*\d+,\d+$/.test(lines[index + 1] || '')) {
      atlasPages.add(path.resolve(path.dirname(file), lines[index]));
    }
  }
}
for (const file of walk(path.join(assetRoot, 'resources', 'skeletons')).filter((entry) => entry.endsWith('_tex.json'))) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.imagePath) atlasPages.add(path.resolve(path.dirname(file), data.imagePath));
}

const oversizeAtlases = pngs.filter((entry) => atlasPages.has(path.join(root, entry.file)) &&
  Math.max(entry.width, entry.height) > maxAtlasDimension);
const overBudget = pngs.filter((entry) => entry.decodedBytes > maxDecodedBytes);
console.log(`纹理预算：${pngs.length} 张 PNG，${atlasPages.size} 个骨骼图集页面`);
for (const entry of pngs.slice(0, 8)) {
  console.log(`${entry.width}x${entry.height} ${(entry.decodedBytes / 1048576).toFixed(1)}MiB ${entry.file}`);
}
if (oversizeAtlases.length) {
  console.error(`超过 ${maxAtlasDimension}px 的骨骼图集：`, oversizeAtlases);
  process.exitCode = 1;
}
if (overBudget.length) {
  console.error('单张纹理解码内存超过 64MiB：', overBudget);
  process.exitCode = 1;
}
