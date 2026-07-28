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
  stack: [nearBox],
  nearby: [nearBox, receiver],
  reachSquared: 420 * 420,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(ordinary.node, nearBox, '未持物时应选择最近交互物');

const carrying = interaction.selectClosestOperation({
  hero,
  heldGoods: { nameid: 'prop_newspaper' },
  stack: [nearBox],
  nearby: { receiver },
  reachSquared: 420 * 420,
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
  stack: [nearbyDoor],
  nearby: [nearbyDoor, visibleCollectible],
  reachSquared: 420 * 420,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(taskBeforeDoor.node, visibleCollectible, '循环地图门不得抢占附近任务或收藏交互');

const edgeCollectible = interactiveNode('红星报', 447, 0, 6, [
  { isFinish: false, trigger: 6 }
]);
const edgeTaskBeforeDoor = interaction.selectClosestOperation({
  hero,
  heldGoods: null,
  stack: [nearbyDoor],
  nearby: [nearbyDoor, edgeCollectible],
  reachSquared: 460 * 460,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(edgeTaskBeforeDoor.node, edgeCollectible, '可见任务边缘的收藏品应可操作且优先于地图门');

const accessibleNpc = interactiveNode('兑换员', 640, 0, 2);
const accessibleNpcSelection = interaction.selectClosestOperation({
  hero,
  heldGoods: null,
  nearby: [accessibleNpc],
  reachSquared: 650 * 650,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(accessibleNpcSelection.node, accessibleNpc, '被障碍挡住但仍可见的 NPC 应在 650 单位内可交互');

const queuedExchangeNpc = interactiveNode('兑换员', 900, 0, 2);
const queuedExchangeSelection = interaction.selectClosestOperation({
  hero,
  heldGoods: null,
  nearby: [nearBox],
  preferredNode: queuedExchangeNpc,
  preferredOperation: 2,
  reachSquared: 650 * 650,
  preferredReachSquared: 1000 * 1000,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(queuedExchangeSelection.node, queuedExchangeNpc, '队伍或阻挡后的当前任务 NPC 应在 1000 单位内优先可交互');

const restoredObjectiveOnly = interactiveNode('存档修复后的红星报', 447, 0, null, []);
const restoredTaskBeforeDoor = interaction.selectClosestOperation({
  hero,
  heldGoods: null,
  stack: [nearbyDoor],
  nearby: [nearbyDoor],
  preferredNode: restoredObjectiveOnly,
  preferredOperation: 6,
  reachSquared: 460 * 460,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.strictEqual(restoredTaskBeforeDoor.node, restoredObjectiveOnly, '存档修复后的目标事件应与操作按钮保持一致');
assert.strictEqual(restoredTaskBeforeDoor.operation, 6);

const touchNode = interactiveNode('touch', 200, 0, 1, [
  { isFinish: false, key: 100, trigger: 7 }
]);
const proximity = interaction.scanProximity({
  hero,
  itemMap: { touch: touchNode, receiver },
  previousTouchActive: {},
  touchOperation: 7,
  touchReachSquared: 320 * 320,
  operationReachSquared: 520 * 520,
  resolveComponent: (node) => node.getComponent('InteractiveObject')
});
assert.deepStrictEqual(Object.keys(proximity.touchActive), ['touch']);
assert.strictEqual(proximity.touchEntries.length, 1);
assert.strictEqual(proximity.nearby.length, 2);

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
assert.strictEqual(edgeCollectibleObjective.action, '拾取【红星报】');

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
assert.strictEqual(distantQueuedExchange.action, '操作【兑换员】');

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

console.log('Gameplay support modules: audio routing, interaction selection, proximity scan, and persistence passed');
