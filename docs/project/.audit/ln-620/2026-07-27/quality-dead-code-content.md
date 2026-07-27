# 代码原则、代码质量、死代码与发布内容专项审计

审计日期：2026-07-27  
范围：`assets/Scripts`、`assets/resources/config`、三章七张发布地图及对应校验工具  
执行方式：只读审计，未修改生产代码

## 方法与评分

本轮按 `ln-623-code-principles-auditor`、`ln-624-code-quality-auditor`、
`ln-626-dead-code-auditor` 的两层检测要求执行：先以静态指标、符号引用、配置图和测试结果生成候选，
再结合 Cocos Creator 生命周期、序列化回调、恢复源码保留约束和发布裁剪规则逐项复核。

共享的 `audit_worker_core_contract.md`、`two_layer_detection.md`、`audit_scoring.md`、
`clean_code_checklist.md`、`audit_output_schema.md`、`ai_ready_architecture.md` 及报告模板在当前环境缺失；
依照 `context.json` 的明确许可，采用 evidence-first 等价证据表。评分中 10 表示当前未发现实质问题，
0 表示核心路径不可维护或不可用。

| 专项 | 得分 | 结论 |
|---|---:|---|
| 代码原则 | 5.8/10 | 核心事件执行器和场景控制器职责过度集中，反向巡逻逻辑存在大段镜像复制，静态单例的瞬态状态缺少完整生命周期边界。 |
| 代码质量 | 5.2/10 | 新档发布内容通过，但旧存档会绕过新增收藏迁移；配置图校验产生 440 条低信噪比警告，无法作为可靠回归门禁。 |
| 死代码 | 6.6/10 | 生产路径仍保留多组空方法、无效表达式、无消费者 API 和每帧空调用；恢复源码和编辑器专用模块已正确排除，不计为死代码。 |

## 当前仍存在的问题

### CQ-CONTENT-01（高）：旧存档恢复会绕过 `prop113` 注入，第三章仍可能停在 4/5

类别：代码质量、内容一致性、存档兼容性

证据：

- `assets/Scripts/ConfigRepair.js:36-104` 只在传入对象的 `confArr` 中补放
  `prop113`；基础 `scenes_d3_3` 原始配置有 24 个物件，修复后为 25 个。
- `assets/Scripts/GameConfigManager.js:44-50` 仅在加载基础 `czconfig` 时调用
  `repairScene`。
- `assets/Scripts/GameConfigManager.js:83-88` 原样返回 `tempData[map]`；
  `assets/Scripts/GameplaySceneController.js:302-313` 只要旧档中存在 `itemArr`，
  就优先使用它并跳过已修复的基础 `confArr`。
- 等价恢复模拟结果为：
  `rawHasProp113=false`、`repairedBaseHasProp113=true`、
  `resumeSelectsTempData=true`、`resumedHasProp113=false`。
- `tools/verify-published-content.js:47-49` 只验证“新鲜基础配置 + ConfigRepair”，
  没有构造旧 `tempData`/原子快照恢复用例。
- 当前文档 `docs/guides/player-walkthrough.md:221-224` 和
  `docs/testing/full-playthrough-test-process.md:527` 均声明第三章可到 5/5；
  该声明对新档成立，对升级前已经访问过 `scenes_d3_3` 的存档不成立。

影响：已有玩家继续旧进度时看不到红星报，且没有游戏内办法补齐第三章第五件收藏。
这也是“第三章 4/5 是否还应修复”的明确答案：**应修复，但修复目标是旧存档迁移，
不是再次修改新档地图位置或章节总数。**

最小修复：

1. 在恢复 `tempData.scenes_d3_3.itemArr` 及旧的单地图存储值时执行一次内容迁移；
   仅当数组没有 `prop113` 且永久 `itemData` 也没有 `prop113` 时加入该物件。
2. 将迁移后的 `tempData` 写回，并通过 `SaveManager` 提交原子快照。
3. 不要在每次读取时无条件向 `itemArr` 调用当前 `repairScene`：收藏拾取后本来会从场景数组移除，
   无条件补放会让已收藏物反复刷新。可采用“数组缺失 + 永久收藏缺失”的双重守卫，
   或保存内容迁移版本。

验证：

- 构造升级前的 `scenes_d3_3` 24 物件旧档，恢复后应恰好出现一个可拾取 `prop113`。
- 拾取后保存、杀进程、重启，`itemData.prop113` 保留且场景不再刷新红星报。
- 新档、已收藏旧档、坏档回退三组用例都应通过；在模拟器中从医疗点切入小学堂并验证 5/5。

### CP-01（高）：核心事件执行器违反 SRP/OCP，改动一个事件会影响整条游戏链

类别：代码原则、代码质量

证据：

- `assets/Scripts/GameplayEventController.js:314-791` 的 `triggerEvent` 单方法约
  478 行、包含 52 个 `case`，同时处理触发条件、角色对齐、动画、音效、弹窗、拾取、
  跨图、答题、延时、保存和事件续接。
- 同一静态类还保存 `gameManager`、`hero`、`cItem`、`interactNode`、碰撞栈和跨图事件等可变状态
  （`assets/Scripts/GameplayEventController.js:36-40,985-993`）。
- `assets/Scripts/GameplaySceneController.js` 当前约 1970 行/110 个函数，
  `PlayerController.js` 约 1100 行/68 个函数，`InteractiveObject.js` 约 837 行/55 个函数；
  输入、相机、地图生命周期、自动存档、投掷、HUD、角色移动和表现之间存在大量隐式调用。

影响：事件 ID 保持不变时，新增或修复单个结果类型仍需修改巨型分支；保存时机、操作锁和动画回调
容易出现跨功能回归，当前第三章任务链尤其依赖这些隐式顺序。

最小修复：保持恢复配置的事件 ID 和公开接口不变，将“事件解析/前置条件”和“结果执行”分开；
先把 52 个结果拆成按 ID 注册的处理器，再逐步把场景输入、相机、保存、投掷拆成小型协作者。
`GameplayEventController` 暂时保留为兼容门面，避免一次性重写。

验证：每次仅迁移一组结果 ID；运行 `npm test`，并用 ADB 检查拾取、物资投递、答题、
隐藏物揭示、跨图、后台恢复和章节结束检查点。

### CP-02（中）：地图切换没有完整清理事件单例的瞬态引用

类别：代码原则、稳定性

证据：

- `assets/Scripts/GameplayEventController.js:36-40` 的 `initGameEvent` 只重绑场景和角色，
  不重置 `cItem`、`interactNode`、`blockItem` 或碰撞数组。
- `assets/Scripts/GameplaySceneController.js:527` 切图只调用 `cleanStack()`；
  `assets/Scripts/GameplaySceneController.js:443-452` 随后销毁旧地图节点。
- `assets/Scripts/GameplayEventController.js:220-230` 的操作入口仍会对非空 `cItem`
  直接调用 `triggerEvent`。玩家在切图后第一次近场扫描前立即点击，可能访问旧场景节点。

影响：存在切图后交互无响应、访问已销毁组件或错误操作目标的竞态窗口。

最小修复：增加一个明确的 `resetTransientState()`，在切图开始、场景销毁和
`initGameEvent` 绑定新角色前统一清空目标引用、接触栈、操作模式和延迟掉落状态；
永久跨图事件只通过现有保存结构恢复。

验证：在可交互物高亮时立即过门，进入新图后连续点击操作键；重复正向/反向切图，
确认没有旧节点异常、错误气泡或操作按钮残留。

### CP-03（中）：敌人正向/反向巡逻为 151 行镜像复制

类别：代码原则（DRY）、维护性

证据：`assets/Scripts/EnemyController.js:454-528` 的 `moveSoldier` 与
`assets/Scripts/EnemyController.js:529-604` 的 `moveSoldierReverse` 结构近乎相同，
差异主要是方向判断、符号、灯光节点偏移和缩放方向。

影响：巡逻、灯光探测或动画时序修复必须同步修改两套分支；遗漏一侧会形成只在反向敌人出现的
场景特异 bug。

最小修复：合并为带 `directionSign`/布局参数的单一巡逻流程，把正反向坐标差异放入小型配置对象；
保留两个旧方法作为薄包装，避免配置和序列化引用变化。

验证：分别在 `m_reverse=false/true` 下检查巡逻端点、朝向、五个灯光区域、射击和死亡回调；
比较合并前后的节点轨迹。

### CQ-02（中）：配置图校验产生 440 条警告，回归信号不可用

类别：代码质量、测试可信度

证据：

- `node tools/validate-game-config.js` 输出 12 场景、1218 事件、802 跳转、
  0 错误、440 警告，并仍以退出码 0 通过 `npm test`。
- `tools/validate-game-config.js:58-61` 把每个物件的第一个事件当作唯一入口；
  `tools/validate-game-config.js:93-112` 用单值 `Map` 记录边；
  `tools/validate-game-config.js:116-130` 据此声明大量事件不可达。
- 运行时还存在触发类型入口、结果 0 的参数跳转、解锁/隐藏目标、跨图事件和延迟续接，
  当前图模型没有完整表达这些边，导致真实问题被大量噪声淹没。

影响：开发者无法判断新增警告是否为真实断链；配置回归门禁事实上只拦截硬引用错误，
不能可靠证明任务可通关。

最小修复：以多邻接集合建图，显式建模触发入口、`next`、结果 0 参数跳转、解锁/隐藏、
跨图和延迟续接；只扫描七张发布地图作为发布门禁，休眠恢复配置另列报告；
为已确认的历史例外建立带原因的精确白名单，而不是允许 440 条全量警告。

验证：基线应降到 0 条未解释警告；人工破坏一个隐藏收藏揭示边和一个跨图边时，
脚本必须非零退出并指向唯一断点。

### DC-01（中）：生产热路径仍执行空方法，且保留无消费者状态机残片

类别：死代码、性能微损耗

证据：

- `assets/Scripts/GameplaySceneController.js:1207,1927` 每帧调用空的 `checkEnemy()`。
- `assets/Scripts/GameplaySceneController.js:1259-1262` 维护 `dropCount`，
  最终调用 `assets/Scripts/GameplayEventController.js:213` 的空 `checkDrop()`。
- `assets/Scripts/PlayerController.js:84,143` 启动时调用空 `setGoSound()`。
- `assets/Scripts/GameplaySceneController.js:700` 的空 `checkCollision()` 无消费者；
  实际碰撞走 `PlayerController` 到 `GameplayEventController.checkCollision`。
- `assets/Scripts/GameplayEventController.js:119-126` 的 `addBlockStack/outBlockStack`
  没有调用者，因此 `blockStack` 的运行时分支无法被写入；`lastTime`、`lastCallBack`
  （`987-988`）也无读取者。
- `assets/Scripts/ChapterSelectionDialog.js:101` 的 `chapterCall()` 没有代码或资源引用。

影响：单次运行成本不大，但空的每帧调用、计数器和伪状态增加调试噪声，也会让维护者误判
敌人/坠落机制仍在此处生效。

最小修复：删除调用与定义成对确认的空路径；若计划恢复功能，先用失败测试表达行为再实现，
不要保留无语义占位。对 Cocos 生命周期或序列化事件先查 prefab/scene UUID 后再删。

验证：全局符号搜索无剩余消费者；运行语法、契约、七图内容测试，并检查敌人碰撞与坠落落地。

### DC-02（低）：多处纯属性读取语句没有任何效果

类别：死代码、可读性

证据：

- `assets/Scripts/CameraController.js:103`：`this.camera_ts.zoomRatio;`
- `assets/Scripts/GameplayEventController.js:523`：`this.hero_ts.walkingMode;`
- `assets/Scripts/GameplaySceneController.js:1265,1598,1611`：
  `this.operateDir;`、`this.hero_ts.isRight;`、`this.isCheck;`
- `assets/Scripts/InteractiveObject.js:427`：`this.eventArr.length;`
- `assets/Scripts/PlayerController.js:496`：`this.isDrop;`；同时 `setDrop/heroDrop`
  （`922-931`）没有外部消费者。

影响：这些语句既不校验也不改变状态，掩盖恢复代码中可能已经丢失的原始意图。

最小修复：确认不是反编译遗失的赋值或条件后删除；若原意是断言或副作用，改成有名字的显式逻辑。

验证：语法和玩法契约通过；定向检查相机跟随、投掷方向和角色坠落。

## 三章七图与全收藏结论

当前新档内容本身一致：

- `npm test` 通过语法、内容、玩法契约、命名和纹理预算检查。
- `tools/verify-published-content.js` 确认 7 张地图、13 件收藏、10 条史实、6 道答题；
  三章收藏总数分别为 4、4、5，史实总数分别为 3、3、4。
- 13 件收藏在修复后的七张发布地图中各出现一次。可见收藏直接拾取；
  隐藏收藏的揭示链为：
  - `prop105`：`27|5 -> 31|1 -> 31|2 -> 31|3 -> 35|2`
  - `prop108`：`17|5 -> 18|3 -> 36|2`
  - `prop111`：`8|4 -> 3|9 -> 3|29 -> 37|2`
  - `prop110`：`6|10 -> 29|1`，交互 `29|2 -> 29|5` 解锁物件 40
  - `prop112`：`21|3 -> 18|1 -> 19|1 -> 19|2`
  - `prop113`：`ConfigRepair.js:36-87` 在 `scenes_d3_3` 主线路径
    `(-250,-145)` 直接放置，非隐藏、非锁定、拾取触发为 6。

因此，新建存档路径没有发现当前收藏断链；唯一仍需修复的是
`CQ-CONTENT-01` 所述旧存档迁移。发布内容校验还应补充“隐藏物揭示链”和“旧档恢复后可达”
两类自动化断言，避免只验证数量与放置。

## 已排除的高内聚/单消费者误报

- `AssetCatalog.js` 虽约 1169 行，但属于静态资源/旧名兼容目录，并被
  `DialogManager`、`ResourceManager`、`InteractiveObject` 使用，不按 God Class 或死模块报告。
- `LegacySceneEditor`、`LegacyItemModel`、`LegacyItemEventModel`、
  `LegacyHttpClient`、`LegacyNetworkTip`、`LegacyHotUpdate` 是恢复源码/编辑器子系统；
  `tools/prune-production-bundle.js` 和 `tools/verify-production-bundle.js` 已证明生产包排除，
  不因“只有编辑器场景消费者”判死代码。
- `ConfigRepair` 虽只有一个运行时入口，但同时是运行时和离线校验的兼容边界，
  且必须保留恢复配置 ID，不属于 YAGNI。
- `ObjectiveManager` 只有 `GameplaySceneController` 一个直接消费者，但职责集中且每局持续使用，
  不属于死代码。
- `PlayerController.setState` 约 202 行/37 个分支，主要是高内聚的状态到动画映射；
  本报告没有把它单独重复计为复杂方法问题。报告的是 `PlayerController` 整体同时承担移动、
  物品、表现、提示、声音和碰撞的职责边界。
- `BaseEvent`、`BaseView` 的空生命周期/模板方法可能由 Cocos 或子类契约调用，
  未在无序列化证据时判死代码。

## 已执行验证

- `npm test`：退出码 0；其中配置图仍有 440 条警告，已作为 `CQ-02` 报告。
- `node tools/verify-production-bundle.js`：确认六个 Legacy 模块未进入生产包。
- 等价旧档恢复模拟：基础配置修复后含 `prop113`，旧 `itemArr` 恢复结果不含 `prop113`。
- 静态发布内容核对：七张 prefab 齐全，收藏/史实/答题数量与前三章 UI 总数一致。
