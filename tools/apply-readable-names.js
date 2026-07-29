'use strict';

/**
 * 模块职责：执行脚本与资源的清单式可读命名迁移。
 * 关键约束：移动文件时保留 Cocos UUID 和旧路径别名，避免场景、配置及存档失效。
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const scriptsRoot = path.join(root, 'assets', 'Scripts');
const resourcesRoot = path.join(root, 'assets', 'resources');
const recoveredRoot = path.join(root, 'assets', 'recovered');
const bundlesRoot = path.join(root, 'assets', 'bundles');
const reportPath = path.join(root, 'docs', 'project', 'naming-migration.json');
const apply = process.argv.includes('--apply');
const verify = process.argv.includes('--verify');
const refreshCatalog = process.argv.includes('--refresh-catalog');

if ([apply, verify, refreshCatalog].filter(Boolean).length !== 1) {
  throw new Error('Specify exactly one of --apply, --verify, or --refresh-catalog.');
}

const scriptNames = {
  answerDialog: 'QuizDialogController',
  baseEvent: 'BaseEvent',
  blackDialog: 'BlackOverlayDialog',
  bullet: 'Projectile',
  camera_master: 'CameraController',
  cgDialog: 'CutsceneDialog',
  chapterDialog: 'ChapterSelectionDialog',
  checkDialog: 'ConfirmationDialog',
  cloud: 'CloudLayer',
  ConfManager: 'GameConfigManager',
  dialog: 'SpeechBubble',
  DragonBonesManager: 'DragonBonesAnimationManager',
  editorScene: 'LegacySceneEditor',
  enemy_ai: 'EnemyController',
  explodeBox: 'ExplosiveCrate',
  externalGame: 'PlatformBridge',
  fontFloating: 'FloatingText',
  GameData: 'GameState',
  gameendDialog: 'GameEndingDialog',
  gameEvent: 'GameplayEventController',
  gameScene: 'GameplaySceneController',
  gametipsDialog: 'TutorialDialog',
  GameUpdata: 'LegacyHotUpdate',
  HttpGame: 'LegacyHttpClient',
  image_sl: 'GrenadeCrate',
  itemBox: 'InteractiveObject',
  itemDrop: 'DroppedItem',
  itemEventObj: 'LegacyItemEventModel',
  itemObj: 'LegacyItemModel',
  loadScene: 'LoadingSceneController',
  loopDrop: 'LoopingDropEffect',
  mainScene: 'MainMenuController',
  node_cloud: 'CloudSpawner',
  node_cloud1: 'AmbientCloudSpawner',
  node_leaves1: 'LeafSpawner',
  node_netTip: 'LegacyNetworkTip',
  passDialog: 'ChapterCompleteDialog',
  pickupDialog: 'PickupDialog',
  plotDialog: 'StoryDialog',
  putOutFire: 'FireExtinguishMiniGame',
  roadView: 'RoadLayer',
  role_1: 'PlayerController',
  role_bg: 'PlayerBackdrop',
  setDialog: 'SettingsDialog',
  showhistoryDialog: 'HistoryCollectionDialog',
  showpropDialog: 'ItemCollectionDialog',
  showstoryDialog: 'StoryCollectionDialog',
  SoundManage: 'AudioManager',
  spineManager: 'SpineAnimationManager',
  timingEvent: 'TimingEvent',
  tipsDialog: 'HintDialog',
  ToolsManager: 'GameUtilities',
  transitionScene: 'ChapterTransitionController',
  unlockDialog: 'UnlockDialog',
  ViewManager: 'DialogManager',
};

const topLevelNames = {
  ani: 'animations',
  dialog: 'ui/dialogs',
  dragonBones: 'skeletons',
  gameConf: 'config',
  guide: 'tutorial',
  item: 'items',
  loading: 'ui/loading',
  prefab: 'prefabs',
  public: 'shared',
  role: 'characters',
  sound: 'audio',
  transition: 'ui/transitions',
};

const directoryNames = {
  map1: 'map-1',
  map2: 'map-2',
  map3: 'map-3',
  backdrop: 'background',
  houses: 'buildings',
  build: 'buildings',
  plant: 'vegetation',
  plants: 'vegetation',
  sever: 'terrain',
  Light: 'lighting',
  chapterval: 'chapter-summary',
  mainchapter: 'chapter-selection',
  showhistory: 'history-collection',
  showprop: 'item-collection',
  showstory: 'story-collection',
};

const curatedBasenames = {
  btn_xyx: 'button-new-game',
  btn_jxyx: 'button-continue-game',
  btn_fh: 'button-back',
  btn_tg1: 'button-skip',
  btn_qd: 'button-confirm',
  btn_qx: 'button-cancel',
  image_qdwz: 'text-confirm',
  image_qxwz: 'text-cancel',
  image_gb: 'button-close',
  image_wh: 'question-mark',
  gcdsrmddjx: 'communist-party-saves-the-people-slogan',
};

const curatedLegacyRoutes = {
  'sound/home.mp3': 'audio/main-menu-theme.mp3',
  'sound/loadbg.mp3': 'audio/loading-theme.mp3',
  'sound/cg/cgbgm.mp3': 'audio/cutscenes/opening-theme.mp3',
  'sound/gkbg/bgm1.mp3': 'audio/gameplay/main-theme.mp3',
  'sound/transitionBg/transition_1_0.mp3': 'audio/chapter-transitions/chapter-1-part-0.mp3',
  'sound/transitionBg/transition_1_1.mp3': 'audio/chapter-transitions/chapter-1-part-1.mp3',
  'sound/transitionBg/transition_1_2.mp3': 'audio/chapter-transitions/chapter-1-part-2.mp3',
  'sound/transitionBg/transition_1_3.mp3': 'audio/chapter-transitions/chapter-1-part-3.mp3',
  'sound/effect/walk.mp3': 'audio/effect/footsteps-walk.mp3',
  'sound/effect/run.mp3': 'audio/effect/footsteps-run.mp3',
  'sound/effect/chuihao.mp3': 'audio/effect/bugle-call.mp3',
  'sound/effect/hanyang.mp3': 'audio/effect/hanyang-rifle.mp3',
  'sound/effect/kaiqiang.mp3': 'audio/effect/rifle-shot.mp3',
  'sound/effect/zhongzheng.mp3': 'audio/effect/zhongzheng-rifle.mp3',
  'sound/effect/grenadeso.mp3': 'audio/effect/grenade-throw.mp3',
  'sound/effect/grenadebang.mp3': 'audio/effect/grenade-impact.mp3',
  'sound/effect/grenadeboom.mp3': 'audio/effect/grenade-explosion.mp3',
};

const tokenNames = {
  btn: 'button',
  image: 'illustration',
  img: 'illustration',
  bg: 'background',
  obj: 'prop',
  props: 'props',
  gras: 'grass',
  hose: 'house',
  nol: 'normal',
  tex: 'texture',
  eff: 'effect',
  role: 'character',
  near: 'foreground',
  during: 'midground',
  master: 'midground',
  walk: 'path',
};

const renameExtensions = new Set(['.png', '.jpg', '.jpeg', '.mp3', '.wav', '.ogg']);
const resourceExtensions = new Set([
  '.png', '.jpg', '.jpeg', '.mp3', '.wav', '.ogg', '.json', '.prefab',
  '.anim', '.atlas', '.labelatlas',
]);

function stableUuid(seed) {
  const chars = crypto.createHash('sha256').update(seed).digest('hex').slice(0, 32).split('');
  chars[12] = '4';
  chars[16] = '8';
  return `${chars.slice(0, 8).join('')}-${chars.slice(8, 12).join('')}-${chars.slice(12, 16).join('')}-${chars.slice(16, 20).join('')}-${chars.slice(20).join('')}`;
}

function slash(value) {
  return value.replace(/\\/g, '/');
}

function walkFiles(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walkFiles(absolute, output);
    else output.push(absolute);
  }
  return output;
}

function walkDirectories(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const absolute = path.join(directory, entry.name);
    output.push(absolute);
    walkDirectories(absolute, output);
  }
  return output;
}

function readUuid(metaPath) {
  if (!fs.existsSync(metaPath)) return '';
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8')).uuid || '';
  } catch {
    return '';
  }
}

function humanizeSegment(value) {
  if (directoryNames[value]) return directoryNames[value];
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^A-Za-z0-9\u4e00-\u9fff-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function humanizeBasename(value) {
  if (curatedBasenames[value]) return curatedBasenames[value];
  if (/^\d+$/.test(value)) return `asset-${Number(value)}`;
  let normalized = value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/sc(\d+)/gi, 'chapter_$1')
    .replace(/d(\d+)/gi, 'chapter_$1')
    .replace(/([A-Za-z])(\d+)/g, '$1_$2')
    .replace(/(\d+)([A-Za-z])/g, '$1_$2');
  const tokens = normalized.split(/[^A-Za-z0-9\u4e00-\u9fff]+/).filter(Boolean);
  normalized = tokens.map((token) => tokenNames[token.toLowerCase()] || token.toLowerCase()).join('-');
  return normalized.replace(/-{2,}/g, '-').replace(/^-|-$/g, '') || 'asset';
}

function routeLegacyPath(legacyPath, extension, renameFilename = true) {
  const exactRoute = curatedLegacyRoutes[slash(legacyPath)];
  if (exactRoute) {
    return {
      bundle: '',
      logical: exactRoute,
      destination: path.join(resourcesRoot, ...exactRoute.replace(/^audio\//, 'audio/').split('/')),
    };
  }
  const segments = slash(legacyPath).split('/');
  let bundle = '';
  let logicalSegments;
  let physicalRoot = resourcesRoot;
  let skeletonPayload = false;

  if (segments[0] === 'gk' && /^d[123]$/.test(segments[1] || '')) {
    const chapter = segments[1].slice(1);
    bundle = `chapter-${chapter}`;
    physicalRoot = path.join(bundlesRoot, bundle);
    logicalSegments = ['chapters', bundle, 'maps', ...segments.slice(2)];
  } else if (segments[0] === 'gk' && segments[1] === 'scenes_public') {
    logicalSegments = ['chapters', 'shared', ...segments.slice(2)];
  } else {
    const mappedTop = topLevelNames[segments[0]];
    logicalSegments = mappedTop ? [...mappedTop.split('/'), ...segments.slice(1)] : segments.slice();
    skeletonPayload = segments[0] === 'dragonBones';
  }

  const physicalSegments = bundle
    ? ['maps', ...segments.slice(2)]
    : logicalSegments.slice();

  for (let index = 0; index < logicalSegments.length - 1; index += 1) {
    if (!skeletonPayload) logicalSegments[index] = humanizeSegment(logicalSegments[index]);
  }
  for (let index = 0; index < physicalSegments.length - 1; index += 1) {
    if (!skeletonPayload) physicalSegments[index] = humanizeSegment(physicalSegments[index]);
  }

  const legacyBase = path.basename(logicalSegments[logicalSegments.length - 1], extension);
  const newBase = renameFilename && !skeletonPayload && renameExtensions.has(extension)
    ? humanizeBasename(legacyBase)
    : legacyBase;
  logicalSegments[logicalSegments.length - 1] = `${newBase}${extension}`;
  physicalSegments[physicalSegments.length - 1] = `${newBase}${extension}`;

  return {
    bundle,
    logical: logicalSegments.join('/'),
    destination: path.join(physicalRoot, ...physicalSegments),
  };
}

function routeLegacyDirectory(legacyPath) {
  const placeholder = `${slash(legacyPath)}/__directory__`;
  const routed = routeLegacyPath(placeholder, '', false);
  routed.logical = routed.logical.replace(/\/__directory__$/, '');
  routed.destination = routed.destination.replace(/[\\/]__directory__$/, '');
  return routed;
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function updateSpriteMetaName(metaPath, oldBase, newBase) {
  if (oldBase === newBase || !fs.existsSync(metaPath)) return;
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    return;
  }
  if (!meta.subMetas || !meta.subMetas[oldBase] || meta.subMetas[newBase]) return;
  const reordered = {};
  for (const [key, value] of Object.entries(meta.subMetas)) {
    reordered[key === oldBase ? newBase : key] = value;
  }
  meta.subMetas = reordered;
  fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
}

function moveFile(source, destination) {
  if (path.resolve(source) === path.resolve(destination)) return;
  ensureParent(destination);
  if (path.resolve(source).toLowerCase() === path.resolve(destination).toLowerCase()) {
    const temporary = `${source}.readable-name-tmp`;
    if (fs.existsSync(temporary)) throw new Error(`Temporary rename path already exists: ${temporary}`);
    fs.renameSync(source, temporary);
    fs.renameSync(temporary, destination);
    return;
  }
  if (fs.existsSync(destination)) {
    throw new Error(`Naming collision: ${destination}`);
  }
  fs.renameSync(source, destination);
}

function writeFolderMeta(metaPath, bundleName = '') {
  const value = {
    ver: '1.1.2',
    uuid: stableUuid(`longmarch-folder:${slash(path.relative(root, metaPath))}`),
    isBundle: Boolean(bundleName),
    bundleName,
    priority: bundleName ? 2 : 1,
    compressionType: {},
    optimizeHotUpdate: {},
    inlineSpriteFrames: {},
    isRemoteBundle: {},
    subMetas: {},
  };
  ensureParent(metaPath);
  fs.writeFileSync(metaPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function replaceScriptReferences(source) {
  let updated = source;
  for (const [oldName, newName] of Object.entries(scriptNames)) {
    updated = updated
      .replace(new RegExp(`require\\((["'])\\./${oldName}\\1\\)`, 'g'), `require("./${newName}")`)
      .replace(new RegExp(`(getComponent|addComponent)\\((["'])${oldName}\\2\\)`, 'g'), `$1("${
        newName
      }")`);
  }
  return updated;
}

function generateAssetCatalog(aliases) {
  const componentAliases = JSON.stringify(scriptNames, null, 4);
  const directoryAliases = JSON.stringify({
    'gk/scenes_public': 'chapters/shared',
    'gk/d1': 'chapters/chapter-1/maps',
    'gk/d2': 'chapters/chapter-2/maps',
    'gk/d3': 'chapters/chapter-3/maps',
    ...topLevelNames,
  }, null, 4);
  const resourceAliases = {};
  for (const entry of aliases) {
    if (entry.oldPath !== entry.newPath) resourceAliases[entry.oldPath] = entry.newPath;
  }
  const source = `'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
    value: !0
});

// 生成结果仍接受旧路径，因为场景配置和既有存档依赖稳定 ID。
var i = ${JSON.stringify(resourceAliases, null, 4)};
var n = ${componentAliases};
var r = ${directoryAliases};

function a(t) {
    return String(t || "").replace(/\\\\/g, "/").replace(/\\.(png|jpe?g|mp3|wav|ogg)$/i, "");
}

function s(t) {
    var e = a(t), o = i[e] || e;
    if (o === e) for (var n in r) if (e === n || 0 === e.indexOf(n + "/")) {
        o = r[n] + e.slice(n.length);
        break;
    }
    var c = o.match(/^chapters\\/(chapter-[123])\\/(.*)$/);
    return c ? {
        original: e,
        logical: o,
        bundle: c[1],
        path: c[2]
    } : {
        original: e,
        logical: o,
        bundle: "",
        path: o
    };
}

o.default = {
    resolve: s,
    componentName: function (t) {
        return n[t] || t;
    },
    aliases: i
};
`;
  const scriptPath = path.join(scriptsRoot, 'AssetCatalog.js');
  fs.writeFileSync(scriptPath, source, 'utf8');
  fs.writeFileSync(`${scriptPath}.meta`, `${JSON.stringify({
    ver: '1.0.8',
    uuid: stableUuid('longmarch-script:AssetCatalog'),
    isPlugin: false,
    loadPluginInWeb: true,
    loadPluginInNative: true,
    loadPluginInEditor: false,
    subMetas: {},
  }, null, 2)}\n`, 'utf8');
}

function updateRecoveryDestinations(fileMoves) {
  const replacements = new Map(fileMoves.map((entry) => [
    path.resolve(entry.source).toLowerCase(),
    path.resolve(entry.destination),
  ]));
  for (const relative of [
    'recovery/atlas-frame-jobs.json',
    'recovery/original-resources-manifest.json',
  ]) {
    const filePath = path.join(root, ...relative.split('/'));
    if (!fs.existsSync(filePath)) continue;
    const value = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const visit = (input) => {
      if (Array.isArray(input)) return input.map(visit);
      if (input && typeof input === 'object') {
        for (const key of Object.keys(input)) input[key] = visit(input[key]);
        return input;
      }
      if (typeof input === 'string') return replacements.get(path.resolve(input).toLowerCase()) || input;
      return input;
    };
    fs.writeFileSync(filePath, `${JSON.stringify(visit(value), null, 2)}\n`, 'utf8');
  }
}

function applyMigration() {
  if (fs.existsSync(reportPath)) throw new Error(`Naming migration already exists: ${reportPath}`);

  const resourceFiles = walkFiles(resourcesRoot)
    .filter((filePath) => !filePath.endsWith('.meta'))
    .filter((filePath) => resourceExtensions.has(path.extname(filePath).toLowerCase()));
  const aliases = [];
  const fileMoves = [];
  const destinations = new Set();

  for (const source of resourceFiles) {
    const extension = path.extname(source).toLowerCase();
    const legacy = slash(path.relative(resourcesRoot, source));
    const legacyWithoutExtension = legacy.slice(0, -extension.length);
    const routed = routeLegacyPath(legacy, extension);
    const newWithoutExtension = routed.logical.slice(0, -extension.length);
    const collisionKey = path.resolve(routed.destination).toLowerCase();
    if (destinations.has(collisionKey)) throw new Error(`Naming collision for ${routed.destination}`);
    destinations.add(collisionKey);
    aliases.push({
      oldPath: legacyWithoutExtension,
      newPath: newWithoutExtension,
      bundle: routed.bundle || 'resources',
      uuid: readUuid(`${source}.meta`),
    });
    fileMoves.push({ source, destination: routed.destination, extension });
  }

  const directoryMoves = walkDirectories(resourcesRoot)
    .map((source) => {
      const legacy = slash(path.relative(resourcesRoot, source));
      return { source, ...routeLegacyDirectory(legacy) };
    })
    .filter((entry) => entry.destination && path.resolve(entry.source) !== path.resolve(entry.destination))
    .sort((left, right) => right.source.length - left.source.length);

  // 先移动文件，使三个章节父目录的分配固定，不受文件系统重命名顺序影响。
  for (const entry of fileMoves) {
    const oldBase = path.basename(entry.source, entry.extension);
    const newBase = path.basename(entry.destination, entry.extension);
    const sourceMeta = `${entry.source}.meta`;
    const destinationMeta = `${entry.destination}.meta`;
    moveFile(entry.source, entry.destination);
    if (fs.existsSync(sourceMeta)) {
      moveFile(sourceMeta, destinationMeta);
      updateSpriteMetaName(destinationMeta, oldBase, newBase);
    }
  }

  for (const entry of directoryMoves) {
    const sourceMeta = `${entry.source}.meta`;
    const destinationMeta = `${entry.destination}.meta`;
    if (fs.existsSync(sourceMeta) && !fs.existsSync(destinationMeta)) moveFile(sourceMeta, destinationMeta);
  }

  // 规范仅以 UUID 命名的独立恢复图片，但不改变来源目录或序列化 UUID 引用。
  const recoveredMoves = [];
  for (const source of walkFiles(recoveredRoot).filter((item) => renameExtensions.has(path.extname(item).toLowerCase()))) {
    const extension = path.extname(source).toLowerCase();
    const oldBase = path.basename(source, extension);
    const newBase = humanizeBasename(oldBase);
    if (oldBase === newBase) continue;
    const destination = path.join(path.dirname(source), `${newBase}${extension}`);
    recoveredMoves.push({ source, destination, extension });
  }
  for (const entry of recoveredMoves) {
    const oldBase = path.basename(entry.source, entry.extension);
    const newBase = path.basename(entry.destination, entry.extension);
    moveFile(entry.source, entry.destination);
    if (fs.existsSync(`${entry.source}.meta`)) {
      moveFile(`${entry.source}.meta`, `${entry.destination}.meta`);
      updateSpriteMetaName(`${entry.destination}.meta`, oldBase, newBase);
    }
  }

  // 只删除上述明确移动后变空的目录，避免误删未列入清单的资源。
  const oldDirectories = walkDirectories(resourcesRoot).sort((left, right) => right.length - left.length);
  for (const directory of oldDirectories) {
    if (fs.existsSync(directory) && fs.readdirSync(directory).length === 0) fs.rmdirSync(directory);
  }
  const obsoleteGkMeta = path.join(resourcesRoot, 'gk.meta');
  if (fs.existsSync(obsoleteGkMeta)) fs.unlinkSync(obsoleteGkMeta);

  if (!fs.existsSync(bundlesRoot)) fs.mkdirSync(bundlesRoot, { recursive: true });
  if (!fs.existsSync(`${bundlesRoot}.meta`)) writeFolderMeta(`${bundlesRoot}.meta`);
  for (const bundleName of ['chapter-1', 'chapter-2', 'chapter-3']) {
    const bundleRoot = path.join(bundlesRoot, bundleName);
    if (!fs.existsSync(bundleRoot)) throw new Error(`Chapter bundle was not created: ${bundleRoot}`);
    writeFolderMeta(`${bundleRoot}.meta`, bundleName);
  }

  updateRecoveryDestinations([...fileMoves, ...recoveredMoves]);

  for (const [oldName, newName] of Object.entries(scriptNames)) {
    const source = path.join(scriptsRoot, `${oldName}.js`);
    const destination = path.join(scriptsRoot, `${newName}.js`);
    if (!fs.existsSync(source)) throw new Error(`Missing source script: ${source}`);
    moveFile(source, destination);
    moveFile(`${source}.meta`, `${destination}.meta`);
  }
  for (const scriptPath of walkFiles(scriptsRoot).filter((item) => item.endsWith('.js'))) {
    const source = fs.readFileSync(scriptPath, 'utf8');
    const updated = replaceScriptReferences(source);
    if (updated !== source) fs.writeFileSync(scriptPath, updated, 'utf8');
  }

  generateAssetCatalog(aliases);

  const report = {
    generatedAt: new Date().toISOString(),
    policy: {
      scripts: 'Descriptive PascalCase module/component names',
      resources: 'Domain folders plus lower-kebab-case standalone image/audio names',
      compatibility: 'Cocos UUIDs, scene IDs, event IDs, save keys, and skeleton animation contracts remain stable',
    },
    scriptRenames: scriptNames,
    resourceAliases: aliases.sort((left, right) => left.oldPath.localeCompare(right.oldPath)),
    bundleNames: ['chapter-1', 'chapter-2', 'chapter-3'],
  };
  ensureParent(reportPath);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Renamed ${Object.keys(scriptNames).length} scripts.`);
  console.log(`Catalogued ${aliases.length} resource paths and created 3 chapter bundles.`);
  console.log(`Naming manifest: ${reportPath}`);
}

function verifyMigration() {
  if (!fs.existsSync(reportPath)) throw new Error(`Naming report is missing: ${reportPath}`);
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const failures = [];
  const exactScriptFiles = new Set(fs.readdirSync(scriptsRoot));
  for (const [oldName, newName] of Object.entries(report.scriptRenames)) {
    if (oldName.toLowerCase() !== newName.toLowerCase() && fs.existsSync(path.join(scriptsRoot, `${oldName}.js`))) {
      failures.push(`Legacy script remains: ${oldName}.js`);
    }
    for (const filename of [`${newName}.js`, `${newName}.js.meta`]) {
      if (!exactScriptFiles.has(filename)) {
        failures.push(`Renamed script is missing: ${filename}`);
      }
    }
  }
  const expectedRoutes = new Map();
  for (const entry of report.resourceAliases) {
    const key = `${entry.bundle}\0${entry.newPath}`;
    expectedRoutes.set(key, (expectedRoutes.get(key) || 0) + 1);
  }
  for (const [key, expectedCount] of expectedRoutes) {
    const separator = key.indexOf('\0');
    const bundleName = key.slice(0, separator);
    const newPath = key.slice(separator + 1);
    const entry = { bundle: bundleName, newPath };
    const relative = entry.newPath.split('/');
    let fileRoot = resourcesRoot;
    let logical = relative;
    if (entry.bundle !== 'resources') {
      fileRoot = path.join(bundlesRoot, entry.bundle);
      logical = relative.slice(2);
    }
    const candidates = walkFiles(fileRoot).filter((filePath) => {
      if (filePath.endsWith('.meta')) return false;
      const extension = path.extname(filePath);
      return slash(path.relative(fileRoot, filePath.slice(0, -extension.length))) === logical.join('/');
    });
    if (candidates.length !== expectedCount) {
      failures.push(`Resource route has ${candidates.length}/${expectedCount} files: ${entry.newPath}`);
    }
  }
  for (const bundleName of report.bundleNames) {
    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(path.join(bundlesRoot, `${bundleName}.meta`), 'utf8'));
    } catch (error) {
      failures.push(`Invalid bundle meta ${bundleName}: ${error.message}`);
      continue;
    }
    if (!meta.isBundle || meta.bundleName !== bundleName) failures.push(`Bundle metadata mismatch: ${bundleName}`);
  }
  if (failures.length) throw new Error(`Naming verification failed (${failures.length}):\n${failures.slice(0, 50).join('\n')}`);
  console.log(`Naming verification: ${Object.keys(report.scriptRenames).length} scripts, ${report.resourceAliases.length} resources, 3 bundles.`);
}

if (apply) applyMigration();
else if (verify) verifyMigration();
else {
  if (!fs.existsSync(reportPath)) throw new Error(`Naming report is missing: ${reportPath}`);
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  generateAssetCatalog(report.resourceAliases);
  console.log(`Refreshed AssetCatalog from ${report.resourceAliases.length} readable resource aliases.`);
}
