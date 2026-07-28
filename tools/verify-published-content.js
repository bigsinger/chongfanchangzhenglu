'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const configDir = path.join(root, 'assets', 'resources', 'config');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const readConfig = (name) => readJson(path.join(configDir, name));
const fail = (message) => {
  console.error(`[published-content] ${message}`);
  process.exitCode = 1;
};

const manifestPath = path.join(root, 'tests', 'manual', 'android-game', 'published-maps.json');
const manifest = readJson(manifestPath);
const sceneRows = new Map(readConfig('czconfig.json').map((row) => [row.name, row]));
const goods = readConfig('goodsConf.json');
const stories = readConfig('story.json');
const answers = readConfig('answer.json');
const chapterUi = readConfig('chapterUi.json');
const tips = readConfig('gametips.json');
const ConfigRepair = require(path.join(root, 'assets', 'Scripts', 'ConfigRepair.js')).default;
const SaveManager = require(path.join(root, 'assets', 'Scripts', 'SaveManager.js')).default;

if (!Array.isArray(manifest) || manifest.length !== 7) {
  fail(`发布地图应为 7 张，实际为 ${Array.isArray(manifest) ? manifest.length : '非数组'}`);
}

const derivedMapCounts = {};
for (const entry of manifest) {
  derivedMapCounts[entry.chapter] = Math.max(derivedMapCounts[entry.chapter] || 0, Number(entry.map));
}
if (JSON.stringify(derivedMapCounts) !== JSON.stringify(SaveManager.PUBLISHED_MAP_COUNTS)) {
  fail(
    `存档地图边界与发布清单不一致：${JSON.stringify(SaveManager.PUBLISHED_MAP_COUNTS)} / ` +
    JSON.stringify(derivedMapCounts)
  );
}

const publishedScenes = new Set();
const sceneContents = new Map();
for (const entry of manifest) {
  const expectedScene = `scenes_d${entry.chapter}_${entry.map}`;
  if (entry.scene !== expectedScene) {
    fail(`地图清单编号与资源键不一致：${JSON.stringify(entry)}`);
  }
  if (publishedScenes.has(entry.scene)) fail(`地图清单重复：${entry.scene}`);
  publishedScenes.add(entry.scene);

  const row = sceneRows.get(entry.scene);
  if (!row) {
    fail(`缺少地图配置：${entry.scene}`);
    continue;
  }
  const prefab = path.join(root, 'assets', 'resources', 'prefabs', 'view', `${entry.scene}.prefab`);
  if (!fs.existsSync(prefab)) fail(`缺少发布地图预制体：${entry.scene}`);

  const content = JSON.parse(row.content);
  ConfigRepair.repairScene(entry.scene, content);
  sceneContents.set(entry.scene, content);
}

const placedCollectibles = new Map();
const placedStories = new Set();
for (const [sceneName, content] of sceneContents) {
  for (const item of content.confArr || []) {
    for (const event of item.eventTrigger || []) {
      if (item.key === 'collection' && String(event.key) === '5' && event.param) {
        const placements = placedCollectibles.get(event.param) || [];
        placements.push(`${sceneName}:${item.index}`);
        placedCollectibles.set(event.param, placements);
      }
      if (String(event.key) === '35' && event.param) placedStories.add(String(event.param));
      if (String(event.key) === '13' && event.param) {
        const match = /^scenes_d(\d+)_/.exec(sceneName);
        const target = match && `scenes_d${match[1]}_${event.param}`;
        if (!target || !publishedScenes.has(target)) {
          fail(`${sceneName}:${item.index}|${event.index} 的门指向未发布地图 ${target || event.param}`);
        }
      }
    }
  }
}

const publishedSections = new Set(manifest.map((entry) => String(entry.chapter)));
const expectedCollectibles = goods.filter((item) => publishedSections.has(String(item.xjid)));
for (const item of expectedCollectibles) {
  const placements = placedCollectibles.get(item.nameid) || [];
  if (placements.length !== 1) {
    fail(`收藏 ${item.nameid}（${item.name}）应放置一次，实际 ${placements.length} 次：${placements.join(', ')}`);
  }
  const imagePath = path.join(
    root,
    'assets',
    'resources',
    'items',
    'items',
    `${String(item.imgname).replace(/^item/, 'item-')}.png`
  );
  if (!fs.existsSync(imagePath)) fail(`收藏 ${item.nameid} 缺少小图：${imagePath}`);
}
for (const [nameId, placements] of placedCollectibles) {
  if (!expectedCollectibles.some((item) => item.nameid === nameId)) {
    fail(`发布地图放置了未纳入前三章统计的收藏 ${nameId}：${placements.join(', ')}`);
  }
}

const expectedStories = stories.filter((item) => publishedSections.has(String(item.xjid)));
for (const story of expectedStories) {
  if (!placedStories.has(String(story.id))) {
    fail(`史实 ${story.id}（${story.history_name}）没有发布地图入口`);
  }
}

for (const section of publishedSections) {
  const row = chapterUi.find((entry) => String(entry.id) === section);
  if (!row) {
    fail(`缺少章节 UI：${section}`);
    continue;
  }
  const storyTotal = expectedStories.filter((item) => String(item.xjid) === section).length;
  const itemTotal = expectedCollectibles.filter((item) => String(item.xjid) === section).length;
  const expectedTotal = `${storyTotal}|${itemTotal}`;
  if (row.chapter_prop !== expectedTotal) {
    fail(`章节 ${section} 统计应为 ${expectedTotal}，实际 ${row.chapter_prop}`);
  }
}

// Upgrading a player who already visited chapter 3 must add the missing
// newspaper exactly once, while a player who already collected it must never
// see it respawn from the compatibility repair.
const chapterThreeBase = sceneRows.get('scenes_d3_3');
if (chapterThreeBase) {
  const oldSave = JSON.parse(chapterThreeBase.content);
  const added = ConfigRepair.repairScene('scenes_d3_3', oldSave, {});
  const newspaperCount = oldSave.confArr.filter((item) =>
    (item.eventTrigger || []).some((event) => event.param === 'prop113')
  ).length;
  if (!added || newspaperCount !== 1) fail(`旧档迁移后红星报应恰好出现一次，实际 ${newspaperCount}`);
  const exchangeBlocker = oldSave.confArr.find((item) => item.index === 13 && item.name === '阻挡');
  if (!exchangeBlocker || exchangeBlocker.x !== 710 || !exchangeBlocker.box || exchangeBlocker.box.width !== 30) {
    fail('第三章兑换员前的旧档阻挡应迁移到 x=710 且宽度缩小为 30');
  }

  const collectedSave = JSON.parse(chapterThreeBase.content);
  ConfigRepair.repairScene('scenes_d3_3', collectedSave, { prop113: { nameid: 'prop113' } });
  const respawnCount = collectedSave.confArr.filter((item) =>
    (item.eventTrigger || []).some((event) => event.param === 'prop113')
  ).length;
  if (respawnCount !== 0) fail('已收藏旧档不应重新生成红星报');
}

if (answers.length !== 6) fail(`当前发布答题应为 6 道，实际 ${answers.length}`);
for (const answer of answers) {
  const right = Number(answer.right);
  if (![1, 2, 3].includes(right) || !answer[`answer${right}`]) {
    fail(`答题 ${answer.id} 的正确选项无效`);
  }
  if (!String(answer.explanation || '').trim()) fail(`答题 ${answer.id} 缺少解释`);
}

for (let index = 1; index <= manifest.length; index++) {
  const tip = tips.find((entry) => String(entry.id) === String(index));
  if (!tip || !String(tip.ms || '').trim()) fail(`发布地图 ${index} 缺少任务提示`);
  if (tip && /老奶奶过马路/.test(tip.ms)) fail(`发布地图 ${index} 仍使用占位提示`);
}

if (!process.exitCode) {
  console.log(
    `发布内容：${manifest.length} 张地图、${expectedCollectibles.length} 件收藏、` +
    `${expectedStories.length} 条史实、${answers.length} 道答题，配置与预制体完整`
  );
}
