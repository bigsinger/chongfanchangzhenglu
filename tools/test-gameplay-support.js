'use strict';

const assert = require('assert');
const interaction = require('../assets/Scripts/GameplayInteractionQuery.js');
const persistence = require('../assets/Scripts/GameplayPersistence.js');
const objective = require('../assets/Scripts/ObjectiveManager.js').default;
const audioCatalog = require('../assets/Scripts/AudioCatalog.js').default;

assert.strictEqual(audioCatalog.effectPath('action/bucket_getwater.mp3'), 'audio/effect/fetch-water');
assert.strictEqual(audioCatalog.effectPath('walk.mp3'), 'audio/effect/footsteps-walk');
assert.strictEqual(audioCatalog.effectPath('shot_gun'), 'audio/effect/rifle-shot');
assert.strictEqual(audioCatalog.musicPath('gkbg/bgm1.mp3'), 'audio/gameplay/main-theme');

function interactiveNode(name, x, y, operation, events) {
  const component = {
    eventArr: events || [],
    itemConf: { lockCount: 0, name },
    getOpType: () => operation,
    getTempConf: () => ({ index: name, key: name })
  };
  return {
    name,
    x,
    y,
    activeInHierarchy: true,
    getComponent: (type) => type === 'InteractiveObject' ? component : null
  };
}

const hero = { x: 0, y: 0 };
const nearBox = interactiveNode('near-box', 100, 0, 2);
const receiver = interactiveNode('receiver', 300, 0, 3, [
  { isFinish: false, limit: 'prop_newspaper' }
]);
const ordinary = interaction.selectClosestOperation({
  hero,
  heldGoods: null,
  stack: [receiver, nearBox],
  maxDeltaX: 300,
  maxDeltaY: 300,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(ordinary.node, nearBox, '未持物时应选择最近交互物');

const carrying = interaction.selectClosestOperation({
  hero,
  heldGoods: { nameid: 'prop_newspaper' },
  stack: [nearBox, receiver],
  maxDeltaX: 300,
  maxDeltaY: 300,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(carrying.node, receiver, '携带任务物时应优先选择匹配接收者');

const nearbyDoor = interactiveNode('进图2门', 30, 0, 10, [
  { isFinish: false, trigger: 10 }
]);
const visibleCollectible = interactiveNode('红星报', 200, 0, 6, [
  { isFinish: false, trigger: 6 }
]);
const taskBeforeDoor = interaction.selectClosestOperation({
  hero,
  heldGoods: null,
  stack: [nearbyDoor, visibleCollectible],
  maxDeltaX: 300,
  maxDeltaY: 300,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(taskBeforeDoor.node, visibleCollectible, '循环地图门不得抢占附近任务或收藏交互');

const outsideCollider = interactiveNode('碰撞体外红星报', 301, 0, 6, [
  { isFinish: false, trigger: 6 }
]);
const strictOriginalRange = interaction.selectClosestOperation({
  hero,
  heldGoods: null,
  stack: [outsideCollider],
  nearby: [nearBox],
  maxDeltaX: 300,
  maxDeltaY: 300,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(strictOriginalRange.node, null, '原版 300 单位轴向范围之外不得出现交互');

const unreportedExchangeNpc = interactiveNode('未接触的兑换员', 100, 0, 2);
const colliderOnlySelection = interaction.selectClosestOperation({
  hero,
  heldGoods: null,
  stack: [],
  nearby: [unreportedExchangeNpc],
  maxDeltaX: 300,
  maxDeltaY: 300,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(colliderOnlySelection.node, null, '未进入物理碰撞栈的 NPC 不得远程交互');

const touchingExchangeNpc = interactiveNode('兑换员', 120, 0, 2);
const touchingExchangeSelection = interaction.selectClosestOperation({
  hero,
  heldGoods: null,
  stack: [touchingExchangeNpc],
  maxDeltaX: 300,
  maxDeltaY: 300,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(touchingExchangeSelection.node, touchingExchangeNpc, '物理接触兑换员后应可正常交互');

function objectiveNode(name, x, trigger, limit, param, events) {
  const component = {
    getConf: () => ({
      name,
      lockCount: 0,
      eventTrigger: events || [{ key: 1, trigger, limit, param, isFinish: false }]
    })
  };
  return {
    x,
    y: 0,
    activeInHierarchy: true,
    getComponent: (type) => type === 'InteractiveObject' ? component : null
  };
}

const shovelObjective = objective.describe({
  mapName: 'scenes_d1_1',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: { nameid: 'prop44', name: '铁锹' } },
  itemMap: { ruin: objectiveNode('废墟-铁铲', 100, 5, 'prop44') }
}, null);
assert.strictEqual(shovelObjective.objective, '用【铁锹】清理【废墟】');
assert.strictEqual(shovelObjective.action, '用【铁锹】清理【废墟】');

const rescueObjective = objective.describe({
  mapName: 'scenes_d1_1',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: null },
  itemMap: { erhu: objectiveNode('二虎触发', 100, 17) }
}, null);
assert.strictEqual(rescueObjective.action, '救出【二虎】');

const rawPotatoObjective = objective.describe({
  mapName: 'scenes_d1_1',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: { nameid: 'prop41', name: '红薯_生' } },
  itemMap: { fire: objectiveNode('烤红薯1', 100, 15, 'prop41') }
}, null);
assert.strictEqual(rawPotatoObjective.action, '翻烤【生红薯】');

const exitObjective = objective.describe({
  mapName: 'scenes_d1_1',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: null },
  itemMap: { exit: objectiveNode('门出口', 100, 23) }
}, null);
assert.strictEqual(exitObjective.action, '进入【相邻地图】');

const readableDoorObjective = objective.describe({
  mapName: 'scenes_d3_1',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: null },
  itemMap: { exit: objectiveNode('进图2门', 100, 10) }
}, null);
assert.strictEqual(readableDoorObjective.action, '进入【医疗点】');

const collectibleObjective = objective.describe({
  mapName: 'scenes_d2_1',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: null },
  itemMap: { collectible: objectiveNode('收藏品3', 100, 6, null, 'prop105') }
}, null);
assert.strictEqual(collectibleObjective.action, '拾取【20式82毫米迫击炮】');

const edgeCollectibleObjective = objective.describe({
  mapName: 'scenes_d3_3',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: null },
  itemMap: { collectible: objectiveNode('收藏品-红星报', 447, 6, null, 'prop113') }
}, null);
assert.strictEqual(edgeCollectibleObjective.action, '');

const exchangeBeforeOptionalCollection = objective.describe({
  mapName: 'scenes_d3_3',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: null },
  itemMap: {
    report: objectiveNode('收藏品-红星报', 100, 6, null, 'prop113'),
    exchange: objectiveNode('兑换员', 300, 2)
  }
}, null);
assert.strictEqual(exchangeBeforeOptionalCollection.objective, '操作【兑换员】  →');
assert.strictEqual(exchangeBeforeOptionalCollection.action, '操作【兑换员】');

const distantQueuedExchange = objective.describe({
  mapName: 'scenes_d3_3',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: null },
  itemMap: { exchange: objectiveNode('兑换员', 900, 2) }
}, null);
assert.strictEqual(distantQueuedExchange.action, '');

const storyNavigation = objective.describe({
  mapName: 'scenes_d2_1',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: null },
  itemMap: { ending: objectiveNode('结束2', -600, 1) }
}, null);
assert.strictEqual(storyNavigation.objective, '前往下一处剧情点  ←');
assert.strictEqual(storyNavigation.action, '');

const victoryObjective = objective.describe({
  mapName: 'scenes_d2_1',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: null },
  itemMap: { victory: objectiveNode('剧情胜利', 100, 2) }
}, null);
assert.strictEqual(victoryObjective.action, '观看【胜利剧情】');

const bambooObjective = objective.describe({
  mapName: 'scenes_d2_2',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: { nameid: 'prop22', name: '柴刀' } },
  itemMap: { bamboo: objectiveNode('砍竹子', 100, 3, 'prop22') }
}, null);
assert.strictEqual(bambooObjective.action, '用【柴刀】砍【竹子】');

const patientObjective = objective.describe({
  mapName: 'scenes_d3_2',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: { nameid: 'prop45', name: '中药药包' } },
  itemMap: { patient: objectiveNode('匹配物品1', 100, 3, 'prop45') }
}, null);
assert.strictEqual(patientObjective.action, '把【中药药包】交给【当前患者】');

const orderedDeliveryObjective = objective.describe({
  mapName: 'scenes_d3_2',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: { nameid: 'prop48', name: '银元' } },
  itemMap: {
    patient: objectiveNode('匹配物品2', 100, 3, null, null, [
      { key: 1, trigger: 3, limit: 'prop50', isFinish: false },
      { key: 1, trigger: 3, limit: 'prop48', isFinish: false }
    ])
  }
}, null);
assert.strictEqual(
  orderedDeliveryObjective.objective,
  '当前目标需要【衣物】，当前携带【银元】'
);
assert.strictEqual(orderedDeliveryObjective.action, '当前目标需要【衣物】');

const firstDistributionComplete = objective.describe({
  mapName: 'scenes_d3_2',
  hero: { x: 0, y: 0 },
  hero_ts: { goods: null },
  itemMap: {
    first: objectiveNode('匹配物品1', 900, 3, null, null, [
      { key: 1, trigger: 3, limit: 'prop45', isFinish: true },
      { key: 1, trigger: 3, limit: 'prop46', isFinish: true },
      { key: 1, trigger: 3, limit: 'prop47', isFinish: true },
      { key: 1, trigger: 3, limit: 'prop47', isFinish: true }
    ]),
    second: objectiveNode('匹配物品2', 900, 3, null, null, [
      { key: 1, trigger: 3, limit: 'prop50', isFinish: false },
      { key: 1, trigger: 3, limit: 'prop48', isFinish: false },
      { key: 1, trigger: 3, limit: 'prop46', isFinish: false },
      { key: 1, trigger: 3, limit: 'prop46', isFinish: false },
      { key: 1, trigger: 3, limit: 'prop50', isFinish: false }
    ]),
    doctor: objectiveNode('医生隐1', 600, 2)
  }
}, null);
assert(firstDistributionComplete.objective.includes('4/4'));
assert(!firstDistributionComplete.objective.includes('/9'));

const saved = [];
const persistedItems = persistence.saveScene({
  mapName: 'scenes_d3_3',
  itemMap: { box: nearBox },
  heroPosition: { x: 10, y: 20 },
  walkingMode: 'walk',
  heroController: {
    followMap: {},
    goods: null,
    m_path: 'hero',
    getTempConf: () => ({ index: 'hero', key: 'hero' })
  },
  configManager: {
    saveTempData: (...args) => saved.push(['temp', ...args]),
    saveHeroItem: (value) => saved.push(['goods', value]),
    saveHeroFollow: (value) => saved.push(['follow', value]),
    saveHeroSpine: (value) => saved.push(['spine', value])
  },
  gameState: {
    playData: { chapter: 3 },
    saveMapInfo: () => saved.push(['map'])
  },
  saveManager: {
    commit: (...args) => saved.push(['commit', ...args])
  }
});
assert.strictEqual(persistedItems.length, 1);
assert.strictEqual(saved[0][0], 'temp');
assert.deepStrictEqual(saved[saved.length - 1], ['commit', 'game-scene', { chapter: 3 }]);

console.log('Gameplay support modules: audio routing, collider-scoped interaction selection, and persistence passed');
