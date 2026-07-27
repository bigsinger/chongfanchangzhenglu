'use strict';

const assert = require('assert');
const interaction = require('../assets/Scripts/GameplayInteractionQuery.js');
const persistence = require('../assets/Scripts/GameplayPersistence.js');

function interactiveNode(name, x, y, operation, events) {
  const component = {
    eventArr: events || [],
    itemConf: { lockCount: 0 },
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

console.log('Gameplay support modules: interaction selection, proximity scan, and persistence passed');
