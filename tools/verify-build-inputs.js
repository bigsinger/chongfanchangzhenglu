'use strict';

/**
 * 模块职责：核验 Creator、NDK 与离线依赖等构建输入。
 * 关键约束：固定输入摘要用于阻止工具被无意替换后产出不可追溯安装包。
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const baseline = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'build-input-baseline.json'), 'utf8')
);
const argument = (name) => {
  const value = process.argv.find((entry) => entry.startsWith(`--${name}=`));
  return value && path.resolve(value.slice(name.length + 3));
};
const creatorRoot = argument('creator-root');
const ndkRoot = argument('ndk-root');
const archive = argument('archive');
const failures = [];

function sha256(file) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(file));
  return hash.digest('hex').toUpperCase();
}

function verifyFile(file, expectedHash, label) {
  if (!fs.existsSync(file)) {
    failures.push(`${label} 不存在：${file}`);
    return;
  }
  const actualHash = sha256(file);
  if (actualHash !== expectedHash.toUpperCase()) {
    failures.push(`${label} 哈希不匹配：${actualHash} != ${expectedHash}`);
  }
}

if (!creatorRoot || !ndkRoot) {
  throw new Error('用法：--creator-root=... --ndk-root=... [--archive=...]');
}
for (const [relativePath, expectedHash] of Object.entries(baseline.creator.files)) {
  verifyFile(
    path.join(creatorRoot, ...relativePath.split('/')),
    expectedHash,
    `Creator ${baseline.creator.version} ${relativePath}`
  );
}
const enginePackage = JSON.parse(
  fs.readFileSync(path.join(creatorRoot, 'resources', 'engine', 'package.json'), 'utf8')
);
if (enginePackage.version !== baseline.creator.version) {
  failures.push(`Creator 引擎版本 ${enginePackage.version} != ${baseline.creator.version}`);
}
verifyFile(
  path.join(ndkRoot, 'source.properties'),
  baseline.ndk.sourcePropertiesSha256,
  `Android NDK ${baseline.ndk.version}`
);
if (archive) {
  if (fs.existsSync(archive) && fs.statSync(archive).size !== baseline.creator.archiveSize) {
    failures.push(`Creator 压缩包大小不匹配：${fs.statSync(archive).size}`);
  }
  verifyFile(archive, baseline.creator.archiveSha256, 'Creator 官方压缩包');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `构建输入：Creator ${baseline.creator.version} / NDK ${baseline.ndk.version} 哈希验证通过`
  );
}
