'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const dragonRoot = path.join(root, 'assets', 'resources', 'skeletons');
const maxDimension = 2048;
const changedImages = new Set();

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function insideProject(target) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(`${root}${path.sep}`)) throw new Error(`拒绝修改工作区外文件：${resolved}`);
  return resolved;
}

function resizePng(file, width, height) {
  file = insideProject(file);
  const temporary = `${file}.optimizing.png`;
  const result = spawnSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', file,
    '-vf', `scale=${width}:${height}:flags=lanczos`,
    '-frames:v', '1', temporary
  ], { stdio: 'inherit' });
  if (result.status !== 0 || !fs.existsSync(temporary)) throw new Error(`ffmpeg 缩放失败：${file}`);
  fs.renameSync(temporary, file);
  changedImages.add(file);
}

function scaleNumber(value, factor) {
  return Math.round(Number(value) * factor);
}

function updatePngMeta(file, targetWidth, targetHeight, factor) {
  const metaFile = `${file}.meta`;
  if (!fs.existsSync(metaFile)) return;
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  meta.width = targetWidth;
  meta.height = targetHeight;
  for (const sub of Object.values(meta.subMetas || {})) {
    for (const key of ['trimX', 'trimY', 'width', 'height', 'rawWidth', 'rawHeight', 'offsetX', 'offsetY']) {
      if (typeof sub[key] === 'number') sub[key] = scaleNumber(sub[key], factor);
    }
    sub.rawWidth = targetWidth;
    sub.rawHeight = targetHeight;
  }
  fs.writeFileSync(metaFile, `${JSON.stringify(meta, null, 2)}\n`);
}

function optimizeDragonBones(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const width = Number(data.width);
  const height = Number(data.height);
  if (!width || !height || Math.max(width, height) <= maxDimension || Number(data.scale) < 1) return 0;
  const factor = 0.5;
  const targetWidth = scaleNumber(width, factor);
  const targetHeight = scaleNumber(height, factor);
  for (const texture of data.SubTexture || []) {
    for (const key of ['x', 'y', 'width', 'height', 'frameX', 'frameY', 'frameWidth', 'frameHeight']) {
      if (typeof texture[key] === 'number') texture[key] = scaleNumber(texture[key], factor);
    }
  }
  data.width = targetWidth;
  data.height = targetHeight;
  data.scale = factor;
  const image = path.resolve(path.dirname(file), data.imagePath);
  resizePng(image, targetWidth, targetHeight);
  updatePngMeta(image, targetWidth, targetHeight, factor);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  return 1;
}

function optimizeSpineAtlas(file) {
  const eol = fs.readFileSync(file, 'utf8').includes('\r\n') ? '\r\n' : '\n';
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  let currentFactor = 1;
  let pageCount = 0;
  for (let index = 0; index < lines.length; index++) {
    if (/^\S.*\.png$/.test(lines[index]) && /^size:\s*\d+,\d+$/.test(lines[index + 1] || '')) {
      const match = /^size:\s*(\d+),(\d+)$/.exec(lines[index + 1]);
      const width = Number(match[1]);
      const height = Number(match[2]);
      currentFactor = Math.max(width, height) > maxDimension ? 0.5 : 1;
      if (currentFactor < 1) {
        const targetWidth = scaleNumber(width, currentFactor);
        const targetHeight = scaleNumber(height, currentFactor);
        const image = path.resolve(path.dirname(file), lines[index]);
        resizePng(image, targetWidth, targetHeight);
        updatePngMeta(image, targetWidth, targetHeight, currentFactor);
        pageCount++;
      }
      continue;
    }
    if (currentFactor < 1) {
      const match = /^(\s*)(size|xy|split|pad):\s*(-?\d+),\s*(-?\d+)(?:,\s*(-?\d+),\s*(-?\d+))?$/.exec(lines[index]);
      if (match) {
        const values = [match[3], match[4], match[5], match[6]]
          .filter((value) => value != null)
          .map((value) => scaleNumber(value, currentFactor));
        lines[index] = `${match[1]}${match[2]}: ${values.join(', ')}`;
      }
    }
  }
  if (pageCount) fs.writeFileSync(file, `${lines.join(eol).replace(/\s+$/, '')}${eol}`);
  return pageCount;
}

let atlasPages = 0;
let dragonAtlases = 0;
for (const file of walk(dragonRoot)) {
  if (file.endsWith('.atlas')) atlasPages += optimizeSpineAtlas(file);
  if (file.endsWith('_tex.json')) dragonAtlases += optimizeDragonBones(file);
}
console.log(`纹理优化：${atlasPages} 个 Spine 页面、${dragonAtlases} 个 DragonBones 图集降至 ${maxDimension}px 内`);
console.log(`已更新图片：${changedImages.size}`);
