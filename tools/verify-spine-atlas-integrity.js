'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skeletonRoot = path.join(root, 'assets', 'resources', 'skeletons');
const expectedFile = path.join(root, 'tests', 'manual', 'android-game', 'expected', 'spine-atlas-sha256.json');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function pngDimensions(file) {
  const buffer = Buffer.alloc(24);
  const descriptor = fs.openSync(file, 'r');
  fs.readSync(descriptor, buffer, 0, buffer.length, 0);
  fs.closeSync(descriptor);
  assert.equal(buffer.toString('ascii', 1, 4), 'PNG', `不是 PNG：${file}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function pair(value) {
  const match = /^\s*(-?\d+),\s*(-?\d+)\s*$/.exec(value || '');
  return match ? [Number(match[1]), Number(match[2])] : null;
}

function validateAtlas(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  let page = null;
  let region = null;
  let pageCount = 0;
  let regionCount = 0;

  function validateRegion() {
    if (!region) return;
    const size = pair(region.size);
    const xy = pair(region.xy);
    const original = pair(region.orig);
    const offset = pair(region.offset);
    assert(size && xy && original && offset, `${file}: ${region.name} 缺少 size/xy/orig/offset`);
    assert(original[0] + 1 >= size[0] && original[1] + 1 >= size[1],
      `${file}: ${region.name} orig 小于 packed size`);
    assert(offset[0] >= 0 && offset[1] >= 0 &&
      offset[0] + size[0] <= original[0] + 1 &&
      offset[1] + size[1] <= original[1] + 1,
    `${file}: ${region.name} offset/size 超出 orig`);
    const rotated = region.rotate === 'true' || region.rotate === '90';
    const packedWidth = rotated ? size[1] : size[0];
    const packedHeight = rotated ? size[0] : size[1];
    assert(xy[0] >= 0 && xy[1] >= 0 &&
      xy[0] + packedWidth <= page.width + 1 &&
      xy[1] + packedHeight <= page.height + 1,
    `${file}: ${region.name} 超出图集页面 ${page.name}`);
    regionCount++;
    region = null;
  }

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (/^\S.*\.png$/.test(line) && /^size:\s*\d+,\s*\d+$/.test(lines[index + 1] || '')) {
      validateRegion();
      const pageSize = pair((lines[index + 1].split(':')[1] || '').trim());
      const image = path.join(path.dirname(file), line.trim());
      assert(fs.existsSync(image), `${file}: 页面图片不存在 ${line.trim()}`);
      const actual = pngDimensions(image);
      assert.deepEqual(actual, { width: pageSize[0], height: pageSize[1] },
        `${file}: 页面声明尺寸与 PNG 不一致 ${line.trim()}`);
      page = { name: line.trim(), width: pageSize[0], height: pageSize[1] };
      pageCount++;
      continue;
    }
    if (!page || !line.trim()) continue;
    if (/^\S/.test(line) && !/^(size|format|filter|repeat|pma):/.test(line)) {
      validateRegion();
      region = { name: line.trim() };
      continue;
    }
    if (region) {
      const property = /^\s+([A-Za-z]+):\s*(.*)$/.exec(line);
      if (property) region[property[1]] = property[2];
    }
  }
  validateRegion();
  return { pageCount, regionCount };
}

const expected = JSON.parse(fs.readFileSync(expectedFile, 'utf8'));
for (const [relative, digest] of Object.entries(expected)) {
  const file = path.join(root, relative);
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  assert.equal(actual, digest, `已修复 Spine atlas 与审核基准不一致：${relative}`);
}

let atlases = 0;
let pages = 0;
let regions = 0;
for (const file of walk(skeletonRoot).filter((entry) => entry.endsWith('.atlas'))) {
  const result = validateAtlas(file);
  atlases++;
  pages += result.pageCount;
  regions += result.regionCount;
}

console.log(`Spine 图集完整性：${atlases} 个 atlas、${pages} 个页面、${regions} 个附件；7 个缩放修复基准通过`);
