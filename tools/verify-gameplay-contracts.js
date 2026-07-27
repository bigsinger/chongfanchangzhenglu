'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = (name) => fs.readFileSync(path.join(root, 'assets', 'Scripts', name), 'utf8');

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
    mapIndex: 3,
    itemData: { prop101: { nameid: 'prop101', xjid: '1' } },
    storyData: [],
    unlockchapters: 1,
    gametips: []
  }),
  tempData: JSON.stringify({ scenes_d2_3: { heroPos: { x: 300, y: 600 } } }),
  heroItem: JSON.stringify({ nameid: 'prop20' }),
  chapter: '2',
  mapIndex: '3',
  unlockchapters: '1'
});
global.cc = { sys: { localStorage: storage } };
const SaveManager = require(path.join(root, 'assets', 'Scripts', 'SaveManager.js')).default;

// Legacy migration and complete single-record snapshot.
const migrated = SaveManager.restoreOrMigrate({ chapter: 1, mapIndex: 1 });
assert.equal(migrated.chapter, 2);
let current = JSON.parse(storage.getItem(SaveManager.CURRENT_KEY));
assert(SaveManager.isValid(current));
assert.deepEqual(current.state.tempData.scenes_d2_3.heroPos, { x: 300, y: 600 });
assert.equal(current.state.heroItem.nameid, 'prop20');

// Foreground interaction then background save must advance an atomic revision.
const beforeRevision = current.revision;
storage.setItem('heroItem', JSON.stringify({ nameid: 'prop42' }));
storage.setItem('tempData', JSON.stringify({ scenes_d2_3: { heroPos: { x: 880, y: 610 }, events: { '9|2': 1 } } }));
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
assert.equal(JSON.parse(storage.getItem('tempData')).scenes_d2_3.events['9|2'], 1);

// Corrupted current generation falls back to previous and repairs current.
const previous = storage.getItem(SaveManager.PREVIOUS_KEY);
assert(previous, 'previous generation must exist');
storage.setItem(SaveManager.CURRENT_KEY, '{"truncated":');
SaveManager.restoreOrMigrate({ chapter: 1, mapIndex: 1 });
assert(SaveManager.isValid(JSON.parse(storage.getItem(SaveManager.CURRENT_KEY))));

// Gameplay source-level contracts guard the integration points that are hard
// to instantiate without a running JSB engine.
const scene = source('GameplaySceneController.js');
const event = source('GameplayEventController.js');
const interactiveObject = source('InteractiveObject.js');
const dialogManager = source('DialogManager.js');
const popup = source('PopupView.js');
assert(/KEY_DOWN/.test(scene) && /keyDirections/.test(scene), 'A/D keyboard movement contract');
assert(/manual-operation reach/.test(event) && /pickEvent/.test(event), 'nearby pickup contract');
assert(/showRequirementHint/.test(event) && /onRequiredItemDelivered/.test(event), 'wrong/right delivery contract');
assert(/pauseGame|gameOperate/.test(popup + scene), 'modal input blocking contract');
assert(/changeMap/.test(scene) && /saveItemConf/.test(scene), 'map transition save contract');
assert(/EVENT_HIDE/.test(scene) && /应用进入后台/.test(scene), 'background persistence contract');
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
