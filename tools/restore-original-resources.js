'use strict';

/*
 * Reconstructs editable Cocos Creator 2.4.3 source assets from the APK's
 * compiled `resources` bundle.  The bundle may contain several asset records
 * with the same project path (for example Texture2D + SpriteFrame + Spine).
 * For that reason this tool reads every record by UUID instead of trusting a
 * path-based reverse-export, where later records overwrite earlier records.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const resourcesRoot = path.join(projectRoot, 'assets', 'resources');
const recoveryRoot = path.join(projectRoot, 'recovery');
const bundleRoot = path.resolve(process.env.CFCZL_APK_RESOURCES || 'E:\\temp\\cfczl3-apk\\assets\\assets\\resources');
const reverseRoot = path.resolve(process.env.CC_REVERSE_ROOT || 'E:\\temp\\cc-reverse');
const creatorRoot = path.resolve(process.env.COCOS_CREATOR_243_ROOT || 'E:\\temp\\CocosCreator-2.4.3');
const configPath = path.join(bundleRoot, 'config.json');
const jobsPath = path.join(recoveryRoot, 'atlas-frame-jobs.json');
const manifestPath = path.join(recoveryRoot, 'original-resources-manifest.json');
const verifyOnly = process.argv.includes('--verify');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(fs.existsSync(configPath), `APK resource config was not found: ${configPath}`);
assert(fs.existsSync(path.join(reverseRoot, 'src', 'core', 'cocos3x', 'bundleConfig.js')),
  `cc-reverse runtime was not found: ${reverseRoot}`);

const { parseBundleConfig, getImportPath } = require(path.join(reverseRoot, 'src', 'core', 'cocos3x', 'bundleConfig'));
const { rehydrateIFileData } = require(path.join(reverseRoot, 'src', 'core', 'cocos3x', 'rehydrate'));

const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const bundleConfig = parseBundleConfig(rawConfig, bundleRoot);
const knownConfigUuids = new Set(bundleConfig.uuids);

const entries = Object.entries(rawConfig.paths).map(([indexText, value]) => {
  const index = Number(indexText);
  return {
    index,
    path: String(value[0]),
    type: rawConfig.types[Number(value[1])],
    subAsset: value[2] === 1,
    uuid: bundleConfig.uuids[index],
    compressedUuid: rawConfig.uuids[index],
  };
});

const groups = new Map();
const entriesByUuid = new Map();
for (const entry of entries) {
  if (!groups.has(entry.path)) groups.set(entry.path, []);
  groups.get(entry.path).push(entry);
  entriesByUuid.set(entry.uuid, entry);
}

const packIndex = new Map();
for (const [packUuid, childUuids] of Object.entries(bundleConfig.packs)) {
  childUuids.forEach((uuid, position) => packIndex.set(uuid, { packUuid, position }));
}

const documentCache = new Map();
const packCache = new Map();

function decodeUuid(value) {
  if (!value || typeof value !== 'string') return value;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    return value.toLowerCase();
  }
  return value.length === 22 ? bundleConfig.uuids[rawConfig.uuids.indexOf(value)] || require(path.join(reverseRoot, 'src', 'utils', 'uuidUtils')).uuidUtils.decodeUuid(value) : value;
}

function expandUuidReferences(value) {
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    value.forEach(expandUuidReferences);
    return value;
  }
  if (typeof value.__uuid__ === 'string') value.__uuid__ = decodeUuid(value.__uuid__);
  Object.values(value).forEach(expandUuidReferences);
  return value;
}

function readCompiledDocument(uuid) {
  if (documentCache.has(uuid)) return documentCache.get(uuid);

  const directPath = getImportPath(bundleConfig, uuid, '.json');
  let document = null;
  if (fs.existsSync(directPath)) {
    document = JSON.parse(fs.readFileSync(directPath, 'utf8'));
  } else {
    const location = packIndex.get(uuid);
    assert(location, `No compiled import record or pack entry for ${uuid}`);
    let packed = packCache.get(location.packUuid);
    if (!packed) {
      const packedPath = getImportPath(bundleConfig, location.packUuid, '.json');
      assert(fs.existsSync(packedPath), `Missing pack file ${packedPath}`);
      packed = JSON.parse(fs.readFileSync(packedPath, 'utf8'));
      packCache.set(location.packUuid, packed);
    }
    const section = packed[5] && packed[5][location.position];
    assert(Array.isArray(section), `Missing pack section ${location.packUuid}#${location.position}`);
    document = [
      packed[0], packed[1], packed[2], packed[3], packed[4],
      section[0] || [], section[1] || 0, section[2] || null,
      section[3] || [], section[4] || [], section[5] || [],
    ];
  }

  let sourceDocument = document;
  try {
    if (Array.isArray(document) && document.length >= 6) sourceDocument = rehydrateIFileData(document);
  } catch (error) {
    throw new Error(`Unable to rehydrate ${uuid}: ${error.message}`);
  }
  expandUuidReferences(sourceDocument);
  documentCache.set(uuid, sourceDocument);
  return sourceDocument;
}

function findRecord(entry) {
  const document = readCompiledDocument(entry.uuid);
  const records = Array.isArray(document) ? document : [document];
  const record = records.find((candidate) => candidate && candidate.__type__ === entry.type);
  assert(record, `Compiled record ${entry.uuid} does not contain ${entry.type}`);
  return { document, record };
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeJson(filePath, value) {
  ensureParent(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeText(filePath, value) {
  ensureParent(filePath);
  fs.writeFileSync(filePath, String(value).replace(/\r?\n/g, '\r\n'), 'utf8');
}

function removeFile(filePath) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

function basePath(relativePath) {
  return path.join(resourcesRoot, ...relativePath.split('/'));
}

function updateMetaUuid(filePath, uuid, fallback) {
  let meta = fallback;
  if (fs.existsSync(filePath)) {
    try {
      meta = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      meta = fallback;
    }
  }
  meta = meta || { ver: '1.0.0', subMetas: {} };
  meta.uuid = uuid;
  if (!meta.subMetas) meta.subMetas = {};
  writeJson(filePath, meta);
}

function deterministicUuid(seed) {
  const hex = crypto.createHash('sha256').update(seed).digest('hex').slice(0, 32).split('');
  hex[12] = '4';
  hex[16] = '8';
  return `${hex.slice(0, 8).join('')}-${hex.slice(8, 12).join('')}-${hex.slice(12, 16).join('')}-${hex.slice(16, 20).join('')}-${hex.slice(20).join('')}`;
}

function walkFiles(directory, output = []) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, item.name);
    if (item.isDirectory()) walkFiles(absolutePath, output);
    else output.push(absolutePath);
  }
  return output;
}

const nativeRoot = path.join(bundleRoot, rawConfig.nativeBase || 'native');
const nativeFiles = walkFiles(nativeRoot);

function findNative(identifier, extensions) {
  const expanded = decodeUuid(identifier) || identifier;
  const candidates = nativeFiles.filter((filePath) => {
    const name = path.basename(filePath);
    if (!(name.startsWith(`${identifier}.`) || name.startsWith(`${expanded}.`))) return false;
    if (!extensions || extensions.length === 0) return true;
    return extensions.includes(path.extname(name).toLowerCase());
  });
  assert(candidates.length === 1,
    `Expected one native file for ${identifier}, found ${candidates.length}${candidates.length ? `: ${candidates.join(', ')}` : ''}`);
  return candidates[0];
}

function imageDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      if (offset + 4 > buffer.length) break;
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }
  throw new Error(`Unsupported image header: ${filePath}`);
}

function spriteContent(entry, fallbackDimensions) {
  if (!entry) {
    return {
      name: '', rect: [0, 0, fallbackDimensions.width, fallbackDimensions.height],
      offset: [0, 0], originalSize: [fallbackDimensions.width, fallbackDimensions.height],
      capInsets: [0, 0, 0, 0], rotated: false,
    };
  }
  const { record } = findRecord(entry);
  const content = record.content || {};
  const rect = content.rect || [0, 0, fallbackDimensions.width, fallbackDimensions.height];
  return {
    name: content.name || path.basename(entry.path),
    rect,
    offset: content.offset || [0, 0],
    originalSize: content.originalSize || [rect[2], rect[3]],
    capInsets: content.capInsets || [0, 0, 0, 0],
    rotated: Boolean(content.rotated || record.rotated),
    textureReference: record._textureSetter && record._textureSetter.__uuid__,
  };
}

function makeImageMeta(textureUuid, spriteEntry, content, imageSize) {
  const spriteUuid = spriteEntry && spriteEntry.uuid;
  const name = content.name || path.basename(spriteEntry.path);
  const width = Number(content.rect[2]);
  const height = Number(content.rect[3]);
  const rawWidth = Number(content.originalSize[0]);
  const rawHeight = Number(content.originalSize[1]);
  const offsetX = Number(content.offset[0] || 0);
  const offsetY = Number(content.offset[1] || 0);
  const capInsets = content.capInsets || [0, 0, 0, 0];
  return {
    ver: '2.3.5',
    uuid: textureUuid,
    type: 'sprite',
    wrapMode: 'clamp',
    filterMode: 'bilinear',
    premultiplyAlpha: false,
    genMipmaps: false,
    packable: true,
    width: imageSize.width,
    height: imageSize.height,
    platformSettings: {},
    subMetas: spriteUuid ? {
      [name]: {
        ver: '1.0.4',
        uuid: spriteUuid,
        rawTextureUuid: textureUuid,
        trimType: 'auto',
        trimThreshold: 1,
        rotated: false,
        offsetX,
        offsetY,
        trimX: (rawWidth - width) / 2 + offsetX,
        trimY: (rawHeight - height) / 2 - offsetY,
        width,
        height,
        rawWidth,
        rawHeight,
        borderTop: Number(capInsets[1] || 0),
        borderBottom: Number(capInsets[3] || 0),
        borderLeft: Number(capInsets[0] || 0),
        borderRight: Number(capInsets[2] || 0),
        subMetas: {},
      },
    } : {},
  };
}

function entryOf(group, type) {
  return group.find((entry) => entry.type === type);
}

function copyNative(entry, allowedExtensions) {
  const source = findNative(entry.uuid, allowedExtensions);
  const destination = `${basePath(entry.path)}${path.extname(source).toLowerCase()}`;
  ensureParent(destination);
  fs.copyFileSync(source, destination);
  return { source, destination };
}

function createBundleReader(name) {
  const root = path.join(path.dirname(bundleRoot), name);
  const raw = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
  const config = parseBundleConfig(raw, root);
  const packedLocations = new Map();
  for (const [packUuid, childUuids] of Object.entries(config.packs)) {
    childUuids.forEach((uuid, position) => packedLocations.set(uuid, { packUuid, position }));
  }
  const documents = new Map();
  const packs = new Map();
  const natives = walkFiles(path.join(root, raw.nativeBase || 'native'));

  function read(uuid) {
    if (documents.has(uuid)) return documents.get(uuid);
    const directPath = getImportPath(config, uuid, '.json');
    let document;
    if (fs.existsSync(directPath)) {
      document = JSON.parse(fs.readFileSync(directPath, 'utf8'));
    } else {
      const location = packedLocations.get(uuid);
      if (!location) return null;
      let packed = packs.get(location.packUuid);
      if (!packed) {
        const packedPath = getImportPath(config, location.packUuid, '.json');
        if (!fs.existsSync(packedPath)) return null;
        packed = JSON.parse(fs.readFileSync(packedPath, 'utf8'));
        packs.set(location.packUuid, packed);
      }
      const section = packed[5] && packed[5][location.position];
      if (!Array.isArray(section)) return null;
      document = [
        packed[0], packed[1], packed[2], packed[3], packed[4],
        section[0] || [], section[1] || 0, section[2] || null,
        section[3] || [], section[4] || [], section[5] || [],
      ];
    }
    try {
      if (Array.isArray(document) && document.length >= 6) document = rehydrateIFileData(document);
    } catch (error) {
      throw new Error(`Unable to rehydrate ${name}:${uuid}: ${error.message}`);
    }
    expandUuidReferences(document);
    documents.set(uuid, document);
    return document;
  }

  function native(identifier, extensions) {
    const expanded = decodeUuid(identifier) || identifier;
    const candidates = natives.filter((filePath) => {
      const filename = path.basename(filePath);
      if (!(filename.startsWith(`${identifier}.`) || filename.startsWith(`${expanded}.`))) return false;
      return !extensions || extensions.includes(path.extname(filename).toLowerCase());
    });
    assert(candidates.length === 1, `Expected one ${name} native for ${identifier}, found ${candidates.length}`);
    return candidates[0];
  }

  return { name, root, raw, config, read, native };
}

function recoverOrphanSpriteFrames(bundleNames) {
  const recoveredRoot = path.join(projectRoot, 'assets', 'recovered');
  if (fs.existsSync(recoveredRoot)) fs.rmSync(recoveredRoot, { recursive: true, force: true });
  const recovered = [];
  const skippedBuiltins = [];
  const builtinUuids = new Set();
  const builtinRoot = path.join(creatorRoot, 'resources', 'static', 'default-assets');
  assert(fs.existsSync(builtinRoot), `Creator 2.4.3 default assets were not found: ${builtinRoot}`);
  for (const metaPath of walkFiles(builtinRoot).filter((filePath) => filePath.endsWith('.meta'))) {
    try {
      collectMetaUuids(JSON.parse(fs.readFileSync(metaPath, 'utf8')), builtinUuids);
    } catch {
      // A malformed unrelated editor meta is not a recovery input.
    }
  }

  for (const bundleName of bundleNames) {
    const context = createBundleReader(bundleName);
    const namedUuids = new Set(Object.keys(context.config.paths));
    const sceneUuids = new Set(Object.values(context.config.scenes));
    for (const uuid of context.config.uuids) {
      if (namedUuids.has(uuid) || sceneUuids.has(uuid)) continue;
      const document = context.read(uuid);
      if (!document) continue;
      const records = Array.isArray(document) ? document : [document];
      const record = records.find((candidate) => candidate && candidate.__type__ === 'cc.SpriteFrame');
      if (!record) continue;

      const textureUuid = decodeUuid(record._textureSetter && record._textureSetter.__uuid__);
      assert(textureUuid, `Orphan SpriteFrame has no texture: ${bundleName}:${uuid}`);
      if (builtinUuids.has(uuid.toLowerCase()) || builtinUuids.has(textureUuid.toLowerCase())) {
        skippedBuiltins.push({ bundle: bundleName, spriteUuid: uuid, textureUuid, name: record.content && record.content.name });
        continue;
      }
      const source = context.native(textureUuid, ['.png', '.jpg', '.jpeg']);
      const extension = path.extname(source).toLowerCase();
      const content = record.content || {};
      const safeName = String(content.name || uuid).replace(/[<>:"/\\|?*]/g, '_');
      const destination = path.join(recoveredRoot, bundleName, uuid, `${safeName}${extension}`);
      ensureParent(destination);
      fs.copyFileSync(source, destination);
      const dimensions = imageDimensions(destination);
      const normalizedContent = {
        name: safeName,
        rect: content.rect || [0, 0, dimensions.width, dimensions.height],
        offset: content.offset || [0, 0],
        originalSize: content.originalSize || [dimensions.width, dimensions.height],
        capInsets: content.capInsets || [0, 0, 0, 0],
        rotated: Boolean(content.rotated),
      };
      assert(!normalizedContent.rotated, `Unexpected rotated standalone SpriteFrame: ${bundleName}:${uuid}`);
      writeJson(`${destination}.meta`, makeImageMeta(textureUuid, {
        uuid, path: `${bundleName}/${safeName}`,
      }, normalizedContent, dimensions));
      recovered.push({ bundle: bundleName, spriteUuid: uuid, textureUuid, name: safeName, destination });
    }
  }

  return { recovered, skippedBuiltins };
}

function prepare() {
  fs.mkdirSync(resourcesRoot, { recursive: true });
  const counts = {};
  const skipped = [];
  const reconstructedTextures = [];
  const jobs = [];

  const bump = (type) => { counts[type] = (counts[type] || 0) + 1; };

  for (const [relativePath, group] of groups) {
    const textureEntry = entryOf(group, 'cc.Texture2D');
    const spriteEntry = entryOf(group, 'cc.SpriteFrame');

    if (textureEntry) {
      const copied = copyNative(textureEntry, ['.png', '.jpg', '.jpeg']);
      const dimensions = imageDimensions(copied.destination);
      const content = spriteContent(spriteEntry, dimensions);
      writeJson(`${copied.destination}.meta`, makeImageMeta(textureEntry.uuid, spriteEntry, content, dimensions));
      for (const alternate of ['.png', '.jpg', '.jpeg']) {
        const candidate = `${basePath(relativePath)}${alternate}`;
        if (path.resolve(candidate) !== path.resolve(copied.destination)) {
          removeFile(candidate);
          removeFile(`${candidate}.meta`);
        }
      }
      bump('cc.Texture2D');
      if (spriteEntry) bump('cc.SpriteFrame.direct');
    } else if (spriteEntry) {
      const content = spriteContent(spriteEntry, { width: 0, height: 0 });
      assert(content.textureReference, `Packed SpriteFrame ${relativePath} has no source atlas reference`);
      const atlasSource = findNative(content.textureReference, ['.png', '.jpg', '.jpeg']);
      const destination = `${basePath(relativePath)}.png`;
      const textureUuid = deterministicUuid(`unpacked-texture:${spriteEntry.uuid}:${relativePath}`);
      assert(!knownConfigUuids.has(textureUuid), `Generated texture UUID collides with APK UUID: ${textureUuid}`);
      const outputSize = { width: Number(content.rect[2]), height: Number(content.rect[3]) };
      writeJson(`${destination}.meta`, makeImageMeta(textureUuid, spriteEntry, content, outputSize));
      jobs.push({
        path: relativePath,
        spriteUuid: spriteEntry.uuid,
        textureUuid,
        source: atlasSource,
        destination,
        x: Number(content.rect[0]),
        y: Number(content.rect[1]),
        width: Number(content.rect[2]),
        height: Number(content.rect[3]),
        rotated: content.rotated === true,
      });
      reconstructedTextures.push({ path: relativePath, spriteUuid: spriteEntry.uuid, textureUuid });
      bump('cc.SpriteFrame.unpacked');
    }

    for (const entry of group) {
      const outputBase = basePath(relativePath);
      if (entry.type === 'cc.AnimationClip') {
        const { document } = findRecord(entry);
        writeJson(`${outputBase}.anim`, document);
        updateMetaUuid(`${outputBase}.anim.meta`, entry.uuid, { ver: '2.1.0', subMetas: {} });
        bump(entry.type);
      } else if (entry.type === 'cc.Prefab') {
        const { document } = findRecord(entry);
        writeJson(`${outputBase}.prefab`, document);
        updateMetaUuid(`${outputBase}.prefab.meta`, entry.uuid, {
          ver: '1.2.9', optimizationPolicy: 'AUTO', asyncLoadAssets: false,
          readonly: false, subMetas: {},
        });
        bump(entry.type);
      } else if (entry.type === 'cc.AudioClip') {
        const copied = copyNative(entry, ['.mp3', '.ogg', '.wav', '.m4a']);
        updateMetaUuid(`${copied.destination}.meta`, entry.uuid, {
          ver: '2.0.1', downloadMode: 0, duration: 0, subMetas: {},
        });
        bump(entry.type);
      } else if (entry.type === 'cc.JsonAsset') {
        const { record } = findRecord(entry);
        writeJson(`${outputBase}.json`, record.json);
        writeJson(`${outputBase}.json.meta`, { ver: '1.0.0', uuid: entry.uuid, subMetas: {} });
        bump(entry.type);
      } else if (entry.type === 'cc.TextAsset') {
        const { record } = findRecord(entry);
        writeText(outputBase, record.text || '');
        writeJson(`${outputBase}.meta`, { ver: '1.0.1', uuid: entry.uuid, subMetas: {} });
        removeFile(`${outputBase}.json`);
        removeFile(`${outputBase}.json.meta`);
        bump(entry.type);
      } else if (entry.type === 'sp.SkeletonData') {
        const { record } = findRecord(entry);
        const skeleton = typeof record._skeletonJson === 'string' ? JSON.parse(record._skeletonJson) : record._skeletonJson;
        assert(skeleton && typeof skeleton === 'object', `Spine skeleton JSON is empty: ${relativePath}`);
        writeJson(`${outputBase}.json`, skeleton);
        const textures = (record.textures || []).map((reference) => decodeUuid(reference && reference.__uuid__)).filter(Boolean);
        writeJson(`${outputBase}.json.meta`, {
          ver: '1.2.2', uuid: entry.uuid, textures, scale: 1, subMetas: {},
        });
        bump(entry.type);
      } else if (entry.type === 'dragonBones.DragonBonesAsset') {
        const { record } = findRecord(entry);
        const dragonBones = typeof record._dragonBonesJson === 'string' ? JSON.parse(record._dragonBonesJson) : record._dragonBonesJson;
        writeJson(`${outputBase}.json`, dragonBones);
        writeJson(`${outputBase}.json.meta`, { ver: '1.0.1', uuid: entry.uuid, subMetas: {} });
        bump(entry.type);
      } else if (entry.type === 'dragonBones.DragonBonesAtlasAsset') {
        const { record } = findRecord(entry);
        const atlas = typeof record._atlasJson === 'string' ? JSON.parse(record._atlasJson) : record._atlasJson;
        writeJson(`${outputBase}.json`, atlas);
        writeJson(`${outputBase}.json.meta`, { ver: '1.0.1', uuid: entry.uuid, subMetas: {} });
        bump(entry.type);
      } else if (entry.type === 'cc.LabelAtlas') {
        const { record } = findRecord(entry);
        const dictionary = record._fntConfig && record._fntConfig.fontDefDictionary;
        const codes = Object.keys(dictionary || {}).map(Number).sort((left, right) => left - right);
        assert(codes.length > 0, `LabelAtlas has no glyphs: ${relativePath}`);
        const first = dictionary[String(codes[0])];
        const spriteUuid = decodeUuid(record.spriteFrame && record.spriteFrame.__uuid__);
        const labelSpriteEntry = entriesByUuid.get(spriteUuid);
        assert(labelSpriteEntry, `LabelAtlas SpriteFrame is not in bundle paths: ${spriteUuid}`);
        const texture = entryOf(groups.get(labelSpriteEntry.path), 'cc.Texture2D');
        assert(texture, `LabelAtlas texture is missing for ${labelSpriteEntry.path}`);
        writeJson(`${outputBase}.labelatlas`, { __type__: 'cc.LabelAtlas' });
        writeJson(`${outputBase}.labelatlas.meta`, {
          ver: '1.1.0', uuid: entry.uuid,
          itemWidth: Number(first.rect.width), itemHeight: Number(first.rect.height),
          startChar: String.fromCharCode(codes[0]), rawTextureUuid: texture.uuid,
          fontSize: Number(record.fontSize), subMetas: {},
        });
        removeFile(`${outputBase}.json`);
        removeFile(`${outputBase}.json.meta`);
        bump(entry.type);
      } else if (entry.type === 'cc.SpriteAtlas') {
        removeFile(`${outputBase}.json`);
        removeFile(`${outputBase}.json.meta`);
        skipped.push({ path: relativePath, type: entry.type, uuid: entry.uuid, reason: 'compiled auto-atlas artifact; source frames were reconstructed individually' });
      } else if (entry.type === 'cc.Asset') {
        removeFile(`${outputBase}.json`);
        removeFile(`${outputBase}.json.meta`);
        skipped.push({ path: relativePath, type: entry.type, uuid: entry.uuid, reason: 'stale source-meta backup embedded in the original resources folder' });
      }
    }

    const hasJsonSource = group.some((entry) => [
      'cc.JsonAsset', 'sp.SkeletonData', 'dragonBones.DragonBonesAsset',
      'dragonBones.DragonBonesAtlasAsset',
    ].includes(entry.type));
    if (spriteEntry && !hasJsonSource) {
      removeFile(`${basePath(relativePath)}.json`);
      removeFile(`${basePath(relativePath)}.json.meta`);
    }
  }

  const sceneRoot = path.join(projectRoot, 'assets', 'Scene');
  let normalizedSceneCount = 0;
  if (fs.existsSync(sceneRoot)) {
    for (const scenePath of walkFiles(sceneRoot).filter((filePath) => filePath.endsWith('.fire'))) {
      const scene = JSON.parse(fs.readFileSync(scenePath, 'utf8'));
      expandUuidReferences(scene);
      writeJson(scenePath, scene);
      normalizedSceneCount += 1;
    }
  }
  const orphanRecovery = recoverOrphanSpriteFrames(['resources', 'main']);
  const orphanSpriteFrames = orphanRecovery.recovered;

  writeJson(jobsPath, jobs);
  writeJson(manifestPath, {
    engine: 'Cocos Creator 2.4.3',
    sourceBundle: configPath,
    configUuidCount: bundleConfig.uuids.length,
    pathEntryCount: entries.length,
    counts,
    packedFrameCount: jobs.length,
    normalizedSceneCount,
    orphanSpriteFrames,
    skippedCreatorBuiltins: orphanRecovery.skippedBuiltins,
    reconstructedTextures,
    skipped,
  });

  console.log(`Prepared ${entries.length} UUID/path records from the APK bundle.`);
  console.log(`Generated ${jobs.length} original-atlas crop jobs.`);
  console.log(`Skipped ${skipped.length} non-source build artifacts.`);
  console.log(`Expanded compiled UUID references in ${normalizedSceneCount} scenes and all serialized resources.`);
  console.log(`Recovered ${orphanSpriteFrames.length} UUID-only SpriteFrames used outside named resource paths.`);
  console.log(`Reused ${orphanRecovery.skippedBuiltins.length} matching built-in SpriteFrames from Creator 2.4.3.`);
  console.log(`Run tools/extract-atlas-frames.ps1, then run this tool with --verify.`);
}

function collectMetaUuids(value, output = new Set()) {
  if (!value || typeof value !== 'object') return output;
  if (typeof value.uuid === 'string') output.add(value.uuid.toLowerCase());
  for (const child of Object.values(value)) collectMetaUuids(child, output);
  return output;
}

function verify() {
  assert(fs.existsSync(jobsPath), `Crop job manifest is missing: ${jobsPath}`);
  assert(fs.existsSync(manifestPath), `Resource manifest is missing: ${manifestPath}`);
  const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
  const failures = [];
  for (const job of jobs) {
    if (!fs.existsSync(job.destination)) {
      failures.push(`Missing extracted frame: ${job.path}`);
      continue;
    }
    const dimensions = imageDimensions(job.destination);
    if (dimensions.width !== job.width || dimensions.height !== job.height) {
      failures.push(`Wrong extracted size for ${job.path}: ${dimensions.width}x${dimensions.height}, expected ${job.width}x${job.height}`);
    }
  }

  const metaUuids = new Set();
  for (const filePath of walkFiles(path.join(projectRoot, 'assets')).filter((item) => item.endsWith('.meta'))) {
    try {
      collectMetaUuids(JSON.parse(fs.readFileSync(filePath, 'utf8')), metaUuids);
    } catch (error) {
      failures.push(`Invalid meta JSON ${filePath}: ${error.message}`);
    }
  }

  const expected = entries.filter((entry) => !['cc.SpriteAtlas', 'cc.Asset'].includes(entry.type));
  for (const entry of expected) {
    if (!metaUuids.has(entry.uuid.toLowerCase())) failures.push(`Original UUID is absent from source metas: ${entry.type} ${entry.path} ${entry.uuid}`);
  }

  assert(failures.length === 0, `Resource verification failed (${failures.length}):\n${failures.slice(0, 50).join('\n')}`);
  console.log(`Verified ${jobs.length} extracted atlas frames and ${expected.length} original path UUIDs.`);
}

if (verifyOnly) verify();
else prepare();
