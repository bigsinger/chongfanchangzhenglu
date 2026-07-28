'use strict';

/*
 * Skeleton texture safety gate.
 *
 * Spine and DragonBones atlases are authored together with mesh UVs, trim
 * offsets and attachment geometry. Resizing their already-packed PNG pages
 * independently is unsafe: odd dimensions have to be rounded and native GPU
 * drivers do not all tolerate the resulting UV seams in the same way.
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skeletonRoot = path.join(root, 'assets', 'resources', 'skeletons');
const maxAuthoredDimension = 4096;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function pngDimensions(file) {
  const buffer = Buffer.alloc(24);
  const descriptor = fs.openSync(file, 'r');
  fs.readSync(descriptor, buffer, 0, buffer.length, 0);
  fs.closeSync(descriptor);
  if (buffer.toString('ascii', 1, 4) !== 'PNG') throw new Error(`不是 PNG：${file}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function assertDimension(file, width, height) {
  if (Math.max(width, height) > maxAuthoredDimension) {
    throw new Error(
      `骨骼图集 ${path.relative(root, file)} 为 ${width}x${height}，超过 ` +
      `${maxAuthoredDimension}px；请重新打包为多页面图集，禁止直接缩放 PNG。`
    );
  }
}

let spinePages = 0;
for (const atlas of walk(skeletonRoot).filter((file) => file.endsWith('.atlas'))) {
  const lines = fs.readFileSync(atlas, 'utf8').split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    if (!/^\S.*\.png$/.test(lines[index]) ||
        !/^size:\s*\d+,\s*\d+$/.test(lines[index + 1] || '')) continue;
    const page = path.join(path.dirname(atlas), lines[index].trim());
    const dimensions = pngDimensions(page);
    assertDimension(page, dimensions.width, dimensions.height);
    spinePages++;
  }
}

let dragonBonesPages = 0;
for (const textureData of walk(skeletonRoot).filter((file) => file.endsWith('_tex.json'))) {
  const data = JSON.parse(fs.readFileSync(textureData, 'utf8'));
  if (!data.imagePath) continue;
  const page = path.join(path.dirname(textureData), data.imagePath);
  const dimensions = pngDimensions(page);
  assertDimension(page, dimensions.width, dimensions.height);
  dragonBonesPages++;
}

console.log(
  `骨骼纹理安全门禁：${spinePages} 个 Spine 页面、${dragonBonesPages} 个 ` +
  'DragonBones 页面保持原始分辨率（不执行破坏性缩放）'
);
