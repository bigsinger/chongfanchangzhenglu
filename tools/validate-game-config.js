'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const confDir = path.join(root, 'assets', 'resources', 'config');
const read = (name) => JSON.parse(fs.readFileSync(path.join(confDir, name), 'utf8'));
const by = (rows, key) => new Map(rows.map((row) => [String(row[key]), row]));
const issues = [];
const issue = (severity, code, scene, detail) => issues.push({ severity, code, scene, detail });

const events = by(read('eventConf.json'), 'id');
const talks = by(read('talkConf.json'), 'txtid');
const goods = by(read('goodsConf.json'), 'nameid');
const doors = by(read('doorConf.json'), 'id');
const stories = by(read('story.json'), 'id');
const answers = by(read('answer.json'), 'id');
const chapters = by(read('chapterConf.json'), 'id');
const scenes = read('czconfig.json');
const sceneNames = new Set(scenes.map((row) => row.name));
const ConfigRepair = require(path.join(root, 'assets', 'Scripts', 'ConfigRepair.js')).default;

for (const door of doors.values()) {
  if (door.map && !chapters.has(String(door.map))) {
    issue('error', 'DOOR_MAP_MISSING', 'doorConf', `门 ${door.id} 指向不存在的地图 ${door.map}`);
  }
}
for (const chapter of chapters.values()) {
  if (!sceneNames.has(chapter.nameid)) {
    issue('error', 'CHAPTER_SCENE_MISSING', 'chapterConf', `章节 ${chapter.id} 指向不存在的场景 ${chapter.nameid}`);
  }
}

let parsedSceneCount = 0;
let eventNodeCount = 0;
let nextEdgeCount = 0;

for (const row of scenes) {
  if (!/^scenes_d\d+_\d+$/.test(row.name)) {
    issue('warning', 'NON_PRODUCTION_SCENE', row.name, '不是正式章节命名，生产构建应排除');
    continue;
  }
  let content;
  try {
    content = JSON.parse(row.content);
    ConfigRepair.repairScene(row.name, content);
  } catch (error) {
    issue('error', 'SCENE_JSON_INVALID', row.name, error.message);
    continue;
  }
  parsedSceneCount++;
  const items = new Map((content.confArr || []).map((item) => [Number(item.index), item]));
  const nodeKeys = new Set();
  const edges = new Map();
  const roots = new Set();

  for (const item of content.confArr || []) {
    const triggers = Array.isArray(item.eventTrigger) ? item.eventTrigger : [];
    if (triggers.length) roots.add(`${item.index}|${triggers[0].index}`);
    for (const trigger of triggers) {
      const nodeKey = `${item.index}|${trigger.index}`;
      nodeKeys.add(nodeKey);
      eventNodeCount++;
      if (!events.has(String(trigger.key))) {
        issue('error', 'EVENT_TYPE_MISSING', row.name, `${nodeKey} 使用不存在的事件类型 ${trigger.key}`);
        continue;
      }
      const eventType = events.get(String(trigger.key));
      const result = Number(eventType.result);
      const param = String(trigger.param == null ? '' : trigger.param);
      if (result === 1 && param && !talks.has(param)) {
        issue('error', 'TALK_MISSING', row.name, `${nodeKey} 引用不存在的对话 ${param}`);
      }
      if (result === 4 && param && !goods.has(param)) {
        issue('error', 'GOODS_MISSING', row.name, `${nodeKey} 引用不存在的物品 ${param}`);
      }
      if (result === 13 && param) {
        const chapterMatch = /^scenes_d(\d+)_/.exec(row.name);
        const targetScene = chapterMatch && `scenes_d${chapterMatch[1]}_${param}`;
        if (!targetScene || !sceneNames.has(targetScene)) {
          issue('error', 'MAP_MISSING', row.name, `${nodeKey} 指向不存在的场景 ${targetScene || param}`);
        }
      }
      if (result === 35 && param && !stories.has(param)) {
        issue('error', 'STORY_MISSING', row.name, `${nodeKey} 引用不存在的史实 ${param}`);
      }
      if (result === 46 && param) {
        for (const answer of param.split('|')) {
          if (!answers.has(answer)) issue('error', 'ANSWER_MISSING', row.name, `${nodeKey} 引用不存在的答题项 ${answer}`);
        }
      }
      const next = String(trigger.next || '');
      if (next) {
        const match = /^(\d+)\|(\d+)$/.exec(next);
        if (!match) {
          issue('error', 'NEXT_FORMAT_INVALID', row.name, `${nodeKey} 的 next=${next} 格式错误`);
        } else {
          const targetItem = Number(match[1]);
          const targetEvent = Number(match[2]);
          if (targetItem !== 10001) {
            const target = items.get(targetItem);
            const found = target && (target.eventTrigger || []).some((entry) => Number(entry.index) === targetEvent);
            if (!found) issue('error', 'NEXT_TARGET_MISSING', row.name, `${nodeKey} 指向不存在的 ${next}`);
          }
          edges.set(nodeKey, next);
          nextEdgeCount++;
        }
      }
      if (result === 0 && /^(\d+)\|(\d+)$/.test(param)) {
        edges.set(nodeKey, param);
      }
    }
  }

  // An authored item is an interaction entry point, so its first event is a
  // graph root. Follow explicit next links to reveal disconnected tail events.
  const reached = new Set();
  const stack = [...roots];
  while (stack.length) {
    const current = stack.pop();
    if (reached.has(current) || !nodeKeys.has(current)) continue;
    reached.add(current);
    const next = edges.get(current);
    if (next && nodeKeys.has(next)) stack.push(next);
  }
  for (const nodeKey of nodeKeys) {
    if (!reached.has(nodeKey)) {
      issue('warning', 'UNREACHABLE_EVENT', row.name, `${nodeKey} 无法从任一交互入口到达`);
    }
  }

  // Detect a closed cycle: every node in the cycle has a next edge and no
  // event can leave it. These are usually accidental infinite scene locks.
  for (const start of nodeKeys) {
    const order = [];
    const position = new Map();
    let cursor = start;
    while (nodeKeys.has(cursor) && edges.has(cursor) && !position.has(cursor)) {
      position.set(cursor, order.length);
      order.push(cursor);
      cursor = edges.get(cursor);
    }
    if (position.has(cursor)) {
      const cycle = order.slice(position.get(cursor));
      if (cycle.length && start === cycle[0]) {
        issue('warning', 'CLOSED_EVENT_LOOP', row.name, cycle.join(' -> '));
      }
    }
  }
}

const errors = issues.filter((entry) => entry.severity === 'error');
const warnings = issues.filter((entry) => entry.severity === 'warning');
const report = {
  generatedAt: new Date().toISOString(),
  scenes: parsedSceneCount,
  eventNodes: eventNodeCount,
  nextEdges: nextEdgeCount,
  errors: errors.length,
  warnings: warnings.length,
  issues
};

const reportArg = process.argv.find((arg) => arg.startsWith('--report='));
const maxWarningsArg = process.argv.find((arg) => arg.startsWith('--max-warnings='));
const warningBaselineArg = process.argv.find((arg) => arg.startsWith('--warning-baseline='));
const maxWarnings = maxWarningsArg ? Number(maxWarningsArg.slice('--max-warnings='.length)) : null;
if (reportArg) {
  const reportPath = path.resolve(root, reportArg.slice('--report='.length));
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(`配置图：${parsedSceneCount} 场景，${eventNodeCount} 事件，${nextEdgeCount} 条跳转`);
console.log(`结果：${errors.length} 错误，${warnings.length} 警告`);
for (const entry of issues.slice(0, 16)) {
  console.log(`[${entry.severity}] ${entry.code} ${entry.scene}: ${entry.detail}`);
}
if (issues.length > 16) console.log(`其余 ${issues.length - 16} 项已省略，可使用 --report=... 输出完整报告`);
if (errors.length) process.exitCode = 1;
if (Number.isFinite(maxWarnings) && warnings.length > maxWarnings) {
  console.error(`警告数 ${warnings.length} 超过已审核基线 ${maxWarnings}，请检查新增配置断链`);
  process.exitCode = 1;
}
if (warningBaselineArg) {
  const baselinePath = path.resolve(root, warningBaselineArg.slice('--warning-baseline='.length));
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const warningSignatures = warnings
    .map((entry) => [entry.code, entry.scene, entry.detail].join('\0'))
    .sort();
  const actualSignature = crypto
    .createHash('sha256')
    .update(warningSignatures.join('\n'), 'utf8')
    .digest('hex');
  if (baseline.schemaVersion !== 1 ||
      baseline.warningCount !== warnings.length ||
      baseline.signatureSha256 !== actualSignature) {
    console.error(
      `历史警告精确基线不匹配：当前 ${warnings.length}/${actualSignature}，` +
      `基线 ${baseline.warningCount}/${baseline.signatureSha256}`
    );
    console.error('请用 --report=... 审核 code/scene/detail 差异；确认是有意变更后再替换基线');
    process.exitCode = 1;
  } else {
    console.log(`历史警告精确基线：${warnings.length} 项，SHA-256 ${actualSignature}`);
  }
}
