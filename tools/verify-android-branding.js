'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, 'native', 'android');
const generatedArgument = process.argv.find((value) => value.startsWith('--generated-root='));
const generatedRoot = generatedArgument && path.resolve(generatedArgument.slice('--generated-root='.length));
const expected = {
  mdpi: {
    width: 48,
    height: 48,
    sha256: '08E777AAEF3C9E65D3AED38A0B09CA791065446C19CB68BB4201206F296B20C0'
  },
  hdpi: {
    width: 72,
    height: 72,
    sha256: '591D8B502C567BF8EFFF56B4F26966FD7343995312D7E679325CC8E6955A74B5'
  },
  xhdpi: {
    width: 96,
    height: 96,
    sha256: '9428CB979BFF614EAF0531415561D35A4EB1CADEA5C578699950792939F17C41'
  },
  xxhdpi: {
    width: 144,
    height: 144,
    sha256: '3C943BBE4D3768F50A275241770200BE32ED4408EEE9A691E127A5E6B4F0082D'
  }
};

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

for (const [density, baseline] of Object.entries(expected)) {
  const relativePath = path.join(`mipmap-${density}`, 'ic_launcher.png');
  const sourcePath = path.join(sourceRoot, relativePath);
  if (!fs.existsSync(sourcePath)) {
    fail(`缺少原版 ${density} 启动图标：${sourcePath}`);
    continue;
  }

  const bytes = fs.readFileSync(sourcePath);
  const pngSignature = bytes.subarray(0, 8).toString('hex').toUpperCase();
  const width = bytes.length >= 24 ? bytes.readUInt32BE(16) : 0;
  const height = bytes.length >= 24 ? bytes.readUInt32BE(20) : 0;
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
  if (pngSignature !== '89504E470D0A1A0A' ||
      width !== baseline.width ||
      height !== baseline.height ||
      sha256 !== baseline.sha256) {
    fail(`原版 ${density} 启动图标与 APK 基线不一致`);
  }

  if (generatedRoot) {
    const generatedPath = path.join(generatedRoot, relativePath);
    if (!fs.existsSync(generatedPath) ||
        !bytes.equals(fs.readFileSync(generatedPath))) {
      fail(`Android 工程未使用原版 ${density} 启动图标：${generatedPath}`);
    }
  }
}

if (!process.exitCode) {
  console.log(
    `Android 品牌资源：原版 APK 四档图标通过${generatedRoot ? '，生成工程逐字节一致' : ''}`
  );
}
