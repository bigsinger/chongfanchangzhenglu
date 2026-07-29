'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = (name) => fs.readFileSync(path.join(root, 'assets', 'Scripts', name), 'utf8');
const releaseVersion = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;

class LocalStorage {
  constructor(seed = {}) {
    this.data = new Map(Object.entries(seed).map(([key, value]) => [key, String(value)]));
  }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}

const storage = new LocalStorage({
  longmarch: JSON.stringify({
    chapter: 2,
    chapterCur: 4,
    mapIndex: 2,
    itemData: { prop101: { nameid: 'prop101', xjid: '1' } },
    storyData: [],
    unlockchapters: 1,
    gametips: []
  }),
  tempData: JSON.stringify({ scenes_d2_2: { heroPos: { x: 300, y: 600 } } }),
  heroItem: JSON.stringify({ nameid: 'prop20' }),
  chapter: '2',
  mapIndex: '2',
  unlockchapters: '1'
});
global.cc = { sys: { localStorage: storage } };
const SaveManager = require(path.join(root, 'assets', 'Scripts', 'SaveManager.js')).default;

// Legacy migration and complete single-record snapshot.
const migrated = SaveManager.restoreOrMigrate({ chapter: 1, mapIndex: 1 });
assert.equal(migrated.chapter, 2);
let current = JSON.parse(storage.getItem(SaveManager.CURRENT_KEY));
assert(SaveManager.isValid(current));
assert.deepEqual(current.state.tempData.scenes_d2_2.heroPos, { x: 300, y: 600 });
assert.equal(current.state.heroItem.nameid, 'prop20');

// Foreground interaction then background save must advance an atomic revision.
const beforeRevision = current.revision;
storage.setItem('heroItem', JSON.stringify({ nameid: 'prop42' }));
storage.setItem('tempData', JSON.stringify({ scenes_d2_2: { heroPos: { x: 880, y: 610 }, events: { '9|2': 1 } } }));
SaveManager.commit('background', migrated);
current = JSON.parse(storage.getItem(SaveManager.CURRENT_KEY));
assert(current.revision > beforeRevision);
assert.equal(current.state.heroItem.nameid, 'prop42');

// A killed process restores the newest fully committed interaction.
storage.setItem('heroItem', 'null');
storage.setItem('tempData', '{}');
const restored = SaveManager.restoreOrMigrate({ chapter: 1, mapIndex: 1 });
assert.equal(restored.chapter, 2);
assert.equal(JSON.parse(storage.getItem('heroItem')).nameid, 'prop42');
assert.equal(JSON.parse(storage.getItem('tempData')).scenes_d2_2.events['9|2'], 1);

// Corrupted current generation falls back to previous and repairs current.
const previous = storage.getItem(SaveManager.PREVIOUS_KEY);
assert(previous, 'previous generation must exist');
storage.setItem(SaveManager.CURRENT_KEY, '{"truncated":');
SaveManager.restoreOrMigrate({ chapter: 1, mapIndex: 1 });
assert(SaveManager.isValid(JSON.parse(storage.getItem(SaveManager.CURRENT_KEY))));

// A checksum-valid snapshot with impossible shapes or unpublished map numbers
// must not be accepted as a restore source.
const semanticCorruption = JSON.parse(storage.getItem(SaveManager.CURRENT_KEY));
semanticCorruption.state.playData.itemData = [];
semanticCorruption.state.chapter = 999;
semanticCorruption.state.mapIndex = 999;
semanticCorruption.checksum = SaveManager.checksum(JSON.stringify(semanticCorruption.state));
assert.equal(SaveManager.isValid(semanticCorruption), false);

// Gameplay source-level contracts guard the integration points that are hard
// to instantiate without a running JSB engine.
const scene = source('GameplaySceneController.js');
const chapterTransition = source('ChapterTransitionController.js');
const loading = source('LoadingSceneController.js');
const event = source('GameplayEventController.js');
const interactionQuery = source('GameplayInteractionQuery.js');
const interactiveObject = source('InteractiveObject.js');
const dialogManager = source('DialogManager.js');
const popup = source('PopupView.js');
const resourceManagerSource = source('ResourceManager.js');
const saveManagerSource = source('SaveManager.js');
const menu = source('MainMenuController.js');
const chapterSelection = source('ChapterSelectionDialog.js');
const gameInfo = source('GameInfo.js');
const gameStateSource = source('GameState.js');
const cloudSources = source('CloudSpawner.js') + source('AmbientCloudSpawner.js');
const fireMiniGame = source('FireExtinguishMiniGame.js');
const timingMiniGame = source('TimingEvent.js');
const audioManager = source('AudioManager.js');
const settingsDialog = source('SettingsDialog.js');
const player = source('PlayerController.js');
const spine = source('SpineAnimationManager.js');
const camera = source('CameraController.js');
const displayAdapter = source('DisplayAdapter.js');
assert(
  /KEY_DOWN/.test(scene) &&
    /keyDirections/.test(scene) &&
    /case 1000:/.test(scene) &&
    /case 1001:/.test(scene) &&
    /case 1003:/.test(scene) &&
    /case 1004:/.test(scene),
  'web A/D/W/S and Creator Android DPAD keyboard movement contract'
);
assert(
  /only nodes reported by physics/.test(event) &&
    /maxDeltaX: 300/.test(event) &&
    /maxDeltaY: 300/.test(event) &&
    /this\.outStack\(e\)/.test(event) &&
    /pickEvent/.test(event),
  'original collider-scoped pickup contract'
);
assert(
  /GameplayInteractionQuery/.test(event) &&
    /selectClosestOperation/.test(interactionQuery) &&
    !/scanProximity/.test(interactionQuery) &&
    !/preferredReachSquared/.test(interactionQuery),
  'interaction selection must remain isolated and must not scan distant map objects'
);
assert(/showRequirementHint/.test(event) && /onRequiredItemDelivered/.test(event), 'wrong/right delivery contract');
assert(/require\("\.\/BaseEvent"\)/.test(fireMiniGame), 'fire mini-game must use the case-correct BaseEvent module path');
assert(/pauseGame|gameOperate/.test(popup + scene), 'modal input blocking contract');
assert(
  /this\.btn_story = this\.btn_story \|\| this\.node\.getChildByName\("btn_story"\)/.test(scene) &&
    /\[this\.btn_pass, this\.btn_tips, this\.btn_story, this\.btn_goods\]/.test(scene),
  'collection and history controls must use visible-area HUD placement and touch routing'
);
assert(
  /this\.isCheck && !o/.test(scene) &&
    /this\.second > this\.maxTime \+ 2/.test(timingMiniGame),
  'cooking timer action and bounded-time contract'
);
assert(/changeMap/.test(scene) && /saveItemConf/.test(scene), 'map transition save contract');
assert(
  /restoreCamera\(o\.cameraTargetForHero\(o\.hero\)/.test(scene) &&
    /cameraTargetForHero/.test(scene) &&
    /Math\.min\(120, o\.height \/ \(2 \* e\) \* \.28\)/.test(scene) &&
    /var r = this\.mapWidth \/ 2, c = this\.showWidth \/ \(2 \* i\)/.test(camera),
  'same-map doors and zoomed foreground/background views must keep hero and ground visible'
);
assert(
    /setFootstepSound/.test(player) &&
    /footsteps-walk/.test(player) &&
    /if \(this\.m_soundVal === e\) return/.test(player) &&
    !/=m_soundVal==/.test(player) &&
    /soundVolumes/.test(audioManager) &&
    /refreshSoundVolumes/.test(audioManager) &&
    /baseVolume \* numberInRange\(GameState\.default\.MUSIC_SOUND, 1\)/.test(audioManager) &&
    /l\.default\.refreshSoundVolumes\(\)/.test(settingsDialog) &&
    !/setEffectsVolume\(r\.default\.MUSIC_(?:SOUND|VOICE)\)/.test(settingsDialog) &&
    !/audio\/effect\/action\//.test(audioManager),
  'movement and authored animation sounds must use canonical, independently mixed effects'
);
assert(
  /ResolutionPolicy\.FIXED_HEIGHT/.test(displayAdapter) &&
    /ORIENTATION_LANDSCAPE/.test(displayAdapter) &&
    /DisplayAdapter/.test(scene + chapterTransition + menu),
  'all primary scenes must share fixed-height landscape adaptation'
);
assert(
  /this\.m_useStableOpening = !\(this\.cg && this\.cg\.skeletonData\)/.test(loading) &&
    /this\.cg\.node\.active = !this\.m_useStableOpening/.test(loading) &&
    /prepareStableOpening/.test(loading) &&
    /startStableOpening/.test(loading) &&
    /this\.cg\.setCompleteListener/.test(loading) &&
    /t\.m_useStableOpening \? 52 : 65/.test(loading) &&
    /finishOpeningGate/.test(loading),
  'startup must restore the original animated Spine opening, with a missing-data fallback and idempotent watchdog'
);
assert(
  /this\.hero_ts\.clearTaskGoods\(\)/.test(event) &&
    /prototype\.clearTaskGoods/.test(player) &&
    !/3 != d\.isthrow && "keepgoods"/.test(event) &&
    /cleanHeroItem\(\)/.test(scene) &&
    /e && -1 != o\.indexOf\(a\) \? this\.setAttachment\(a, a \+ i\) : this\.clearAttachment\(a\)/.test(spine),
  'successful task delivery must clear normal and bulky held props unless explicitly configured to keep them'
);
assert(
  /getPublishedLevels/.test(chapterSelection + gameStateSource) &&
    /if \(v && !v\.content\)/.test(chapterSelection) &&
    /v\.content = this\.pan_chapter/.test(chapterSelection) &&
    /initMapInfo\(e\.chapter, e\.map\)/.test(chapterSelection) &&
    /第" \+ e\.chapter \+ "章·第" \+ e\.map \+ "关/.test(chapterSelection) &&
    /publishedLevels = \[\{/.test(gameStateSource),
  'chapter dialog must expose every published chapter/map checkpoint'
);
assert(
  !/y = cc\.v2\(\(y\.x - s\.x\) \/ P/.test(scene) &&
    /点击命中交互气泡/.test(scene) &&
    /getCurrentInteractionTouch/.test(scene) &&
    /Math\.abs\(n\) > 300 \|\| Math\.abs\(a\) > 300/.test(scene) &&
    /revalidateInteractionStack/.test(scene) &&
    !/operationReachSquared/.test(scene) &&
    !/preferredReachSquared/.test(event) &&
    /x: 835/.test(source('ConfigRepair.js')) &&
    /p <= 84 \* 84/.test(scene) &&
    /i\.distance <= 300/.test(source('ObjectiveManager.js')),
  'touch routing must be precise while the exchange clerk remains physically reachable'
);
assert(
  /this\.layer_black\.color = cc\.color\(126, 25, 32\)/.test(chapterTransition) &&
    /历史坐标｜/.test(chapterTransition) &&
    /cc\.delayTime\(2\.6\), cc\.fadeOut\(\.4\)/.test(chapterTransition),
  'the original red date slate must read as an intentional historical transition instead of a rendering flash'
);
assert(
  /this\.setSwitchLoad\(this\.m_goods\)/.test(player) &&
    /Spine attachment missing/.test(source('SpineAnimationManager.js')) &&
    /prototype\.clearAttachment/.test(source('SpineAnimationManager.js')) &&
    /-1 != o\.indexOf\(a\) \? this\.setAttachment\(a, a \+ i\) : this\.clearAttachment\(a\)/.test(source('SpineAnimationManager.js')) &&
    !/this\.setAttachment\(this\.m_loadAry\[n\], this\.m_loadAry\[n\] \+ 0\)/.test(source('SpineAnimationManager.js')) &&
    /t \? this\.setAttachment\("body_prop", "prop\/prop" \+ t\) : this\.clearAttachment\("body_prop"\)/.test(source('SpineAnimationManager.js')) &&
    /t \? this\.setAttachment\("hand_prop", "prop\/prop" \+ t\) : this\.clearAttachment\("hand_prop"\)/.test(source('SpineAnimationManager.js')) &&
    /DragonBones slot missing/.test(source('DragonBonesAnimationManager.js')),
  'held buckets, supply boxes, and dynamic character slots must survive attachment timelines and missing assets'
);
assert(
  /prototype\.stopNodeRuntime/.test(scene) &&
    /this\.stopNodeRuntime\(this\.gameNode\)/.test(scene) &&
    /this\.gameNode\.active = !1;\s*u\.default\.resetTransientState\(\)/.test(scene) &&
    /m_chapterTransitionPending/.test(scene) &&
    /e\.goTransitionScene\(t\);\s*\}, \.05\)/.test(scene),
  'scene teardown must stop actions and detach physics before chapter transitions'
);
assert(
  /var transitionHost = this;/.test(scene) &&
    /m_transitionSceneLoadStarted/.test(scene) &&
    /saveMapInfo\(!0\)/.test(scene) &&
    /章节过场预加载超时/.test(scene),
  'chapter completion must persist its destination and recover from lost preload callbacks'
);
assert(
  /t\.node\.active = !1/.test(chapterTransition) &&
    /cc\.Director\.EVENT_AFTER_DRAW/.test(chapterTransition) &&
    /finishRightAnimation/.test(chapterTransition) &&
    /章节路线动画完成回调超时/.test(chapterTransition),
  'chapter transition renderers must detach for a full frame and tolerate lost animation callbacks'
);
assert(/EVENT_HIDE/.test(scene) && /应用进入后台/.test(scene), 'background persistence contract');
assert(/EVENT_SHOW/.test(scene) && /resetActiveInput/.test(scene), 'background input reset contract');
assert(/installLifecycle/.test(saveManagerSource) && /gameplay-hide/.test(scene), 'pending save flush contract');
assert(
  /_pendingMap/.test(dialogManager) && /_nodeKeyMap/.test(dialogManager) && /getScene/.test(dialogManager),
  'async dialog generation and alias contract'
);
assert(/releasePrefix\("gk\/d"\)/.test(menu), 'menu must release the active chapter scope');
assert(
  gameInfo.includes(`V_S_${releaseVersion}`) && gameStateSource.includes(`V_S_${releaseVersion}`),
  'main-menu display version must match the Android/package release version'
);
assert(/_releasedEpochs/.test(resourceManagerSource) && /_bundleInflight/.test(resourceManagerSource), 'late resource load cancellation contract');
assert(
  /releaseScopeDeferred/.test(resourceManagerSource) &&
    /releaseScopeDeferred\(this\.m_resourceScope\)/.test(source('SpineAnimationManager.js')),
  'shared Spine resources must receive a release grace period across scene switches'
);
assert(!/removeFromParent\(\)/.test(cloudSources) && /resetCloud/.test(cloudSources), 'cloud nodes must be recycled');
assert(
  /addComponent\(assetCatalog\.default\.componentName\(c\.param\)\)/.test(interactiveObject),
  'dynamic event components must resolve renamed class IDs'
);
assert(
  /getComponent\(assetCatalog\.default\.componentName\(/.test(dialogManager) &&
    !/var r = require\("\.\/ResourceManager"\), c = require\("\.\/AssetCatalog"\)/.test(dialogManager),
  'dialog components must resolve aliases without minified variable shadowing'
);

const AssetCatalog = require(path.join(root, 'assets', 'Scripts', 'AssetCatalog.js')).default;
assert.equal(
  AssetCatalog.componentName('putOutFire'),
  'FireExtinguishMiniGame',
  'legacy event component alias must remain available'
);

// A loadDir callback arriving after its owner was destroyed must release its
// unclaimed assets instead of recreating a permanently retained scope.
const releasedAssets = [];
const removedBundles = [];
global.cc.isValid = () => true;
global.cc.assetManager = {
  releaseAsset(asset) { releasedAssets.push(asset._uuid); },
  removeBundle(bundle) { removedBundles.push(bundle.name); }
};
global.cc.resources = { release() {} };
const ResourceManager = require(path.join(root, 'assets', 'Scripts', 'ResourceManager.js')).default;
const scope = ResourceManager.createScope('contract');
const epoch = ResourceManager.trackScopeRequest(scope, 'gk/d1', 'chapters/chapter-1', 'chapter-1');
ResourceManager.releaseScope(scope);
let releasedBundleCount = 0;
const lateBundle = { name: 'chapter-1', releaseAll() { releasedBundleCount++; } };
ResourceManager.register(
  scope,
  [{ _uuid: 'late-asset' }],
  'gk/d1',
  'chapter-1',
  lateBundle,
  'chapters/chapter-1',
  epoch
);
ResourceManager.finishScopeRequest(scope, epoch, 'chapter-1');
assert.deepEqual(releasedAssets, ['late-asset']);
assert.equal(releasedBundleCount, 1);
assert.deepEqual(removedBundles, ['chapter-1']);
assert.equal(ResourceManager._scopes[scope], undefined);
assert.equal(ResourceManager._scopeEpochs[scope], undefined);
assert.equal(
  AssetCatalog.resolve('gk\\d1\\scenes_d1_1').logical,
  'chapters/chapter-1/maps/scenes_d1_1',
  'Windows-style legacy asset paths must resolve after naming migration'
);

const ObjectiveManager = require(path.join(root, 'assets', 'Scripts', 'ObjectiveManager.js')).default;
const objective = ObjectiveManager.describe({
  mapName: 'scenes_d3_2',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: { nameid: 'prop45', name: '中药药包' } },
  itemMap: {}
}, {});
assert(objective.objective.includes('中药药包'), 'held item must appear in current objective');

console.log('游戏契约：移动、拾取、投递、弹窗阻断、切图、后台/进程恢复、坏档回退全部通过');
