# 可观测性、并发、生命周期与客户端运行性能专项审计

- 日期：2026-07-27
- 范围：当前可读化后的 Cocos Creator 2.4.3 JavaScript 与 Android 客户端
- 审计技能：`ln-627-observability-auditor`、`ln-628-concurrency-auditor`、`ln-629-lifecycle-auditor`
- 约束：只读审计；未修改生产代码
- 方法：共享审计契约、评分表和模板在已安装技能包中缺失，按 `context.json` 使用等价的 evidence-first 两层检测：文本候选检索后逐段确认真实执行路径，并用最小 Node/ADB 探针复现关键风险。

## 结论与评分

| 类别 | 得分 | 结论 |
|---|---:|---|
| 可观测性 | 6.0/10 | 已有发布日志门控和章节/地图/事件上下文，但缺少可持久化崩溃面包屑、全局异常捕获及统一字段化事件；健康检查、服务指标和分布式追踪对原生离线客户端不适用。 |
| 并发与异步安全 | 6.0/10 | 音频请求 token、资源 scope epoch/in-flight、并发 Bundle 请求合并、弹窗 request token、全局 hide flush 和双代快照是有效保护；跨场景弹窗归属、通用资源 owner 和极短崩溃窗口仍有边界竞态。 |
| 生命周期 | 5.5/10 | Gameplay 监听器、hide/show 输入复位、RenderTexture、目标 UI、资源晚到取消和多数 Cocos 定时器有明确清理；直接回主页的章节资源、场景音效和原生 `setTimeout` 所有权仍不完整。 |
| 客户端运行性能 | 6.0/10 | 云/道路已降到 30 Hz，过场 SpriteFrame 与相机位置对象已复用，静止相机不再反复写视差层；交互/目标扫描、同步 SQLite 写放大和环境节点重建仍有优化空间。 |
| 综合 | **5.9/10** | 当前功能契约可通过，但在快速操作、切场、异常终止和长时间连续游玩下仍有稳定性与内存风险。 |

严重度汇总：**HIGH 1，MEDIUM 8，LOW 2**。没有发现支付、认证或金融代码，因此无 CRITICAL 升级项。

## 已验证的正向控制

1. `assets/Scripts/Logger.js:12-36` 在发布构建关闭 `console.log/info`，并为 `warn/error` 添加上下文前缀。
2. `assets/Scripts/GameplaySceneController.js:267-271` 与 `assets/Scripts/GameplayEventController.js:348-353` 设置章节、地图和事件上下文。
3. `assets/Scripts/AudioManager.js:15-34,43-61,73-97` 合并同一音频加载，并用 BGM/音效请求 token 阻止晚到回调播放已取消声音。
4. `assets/Scripts/ResourceManager.js:23-49,63-96,154-179,191-219` 已建立 scope epoch；组件先销毁、资源后完成时不会再注册已释放 scope。
5. `assets/Scripts/DialogManager.js:11-30,54-97` 已统一弹窗 key，使用 request seed/pending Map 抑制快速双开，并支持按节点名反查关闭。
6. `assets/Scripts/ResourceManager.js:53-82,176-205,217-249` 已跟踪 scope pending 和 Bundle in-flight，并在最后一个回调结算后清除 epoch 墓碑。
7. `assets/Scripts/SaveManager.js:109-145,147-216` 校验存档结构和校验和，保留 current/previous 两代快照，并安装全局 `EVENT_HIDE` flush。
8. `assets/Scripts/GameplaySceneController.js:164-182,1149-1173` 在 hide/show 均复位瞬态输入并停止角色移动。
9. `assets/Scripts/GameplaySceneController.js:1090-1121` 显式解绑键盘、触摸、全局监听、hide/show，并解绑和销毁 RenderTexture/SpriteFrame。
10. `assets/Scripts/LeafSpawner.js:51-86` 对晚到预制体检查节点有效性，停用时取消定时器并销毁叶子。
11. `assets/Scripts/GameplaySceneController.js:131,784-832` 复用相机位置对象，并在相机未移动时跳过十个视差层的重复变换。
12. `assets/Scripts/GameplaySceneController.js:1177-1221` 一次邻近扫描同时产出 TOUCH 与最近交互候选，任务目标刷新已降为约 2 Hz。
13. `tools/verify-gameplay-contracts.js` 当前通过；全部 `assets/Scripts/*.js` 通过 `node --check`。

## 详细发现

### F-02 MEDIUM：弹窗 request token 已防双开，但 pending 请求仍没有场景归属

**类别：** 并发、生命周期、交互稳定性  
**位置：** `assets/Scripts/DialogManager.js:11-35,54-97`

**证据：**

- 当前实现已经用调用路径作为统一 key，并以 `_requestSeed/_pendingMap` 让快速重复 open 只允许最新请求实例化；`_nodeKeyMap` 也解决了按节点名 close 的映射问题。
- 剩余问题是 pending 只验证“是否最新请求”，不验证“是否仍属于发起它的场景/Canvas”。
- 如果资源加载期间发生场景切换且新场景没有再次打开/关闭同 key，晚到回调会执行 `cc.find("Canvas")` 并把旧场景请求挂到新 Canvas。
- DialogManager 是进程级静态单例，但没有 `closeAll(sceneToken)` 或场景 generation。

**最小修复（S-M）：**

1. open 时捕获当前 scene UUID/scene generation 和 Canvas 实例。
2. 完成回调除 request seed 外，再验证 scene 与 Canvas 仍和发起时一致。
3. 增加 `closeAll(sceneToken)`，在场景卸载时取消该场景所有 pending 并清理实例。

**验证：**

- 保留当前测试：50 ms 内连点同一弹窗两次，Canvas 中只能存在一个根节点。
- 新增：open 后立即切换场景，旧弹窗不得挂到新场景 Canvas，pending Map 应归零。

### F-03 HIGH：直接返回主页不会释放活动章节 Bundle/scope

**类别：** 生命周期、内存  
**位置：**

- `assets/Scripts/ChapterTransitionController.js:60-70,357-384,443-446`
- `assets/Scripts/ChapterCompleteDialog.js:65-73`
- `assets/Scripts/GameplaySceneController.js:569-614`
- `assets/Scripts/ResourceManager.js:217-270`

**证据：**

- 正常章节过渡会在新 `ChapterTransitionController.onLoad()` 根据 `Smallplot` 的旧章节调用 `releaseDirectory("gk/dX")`。
- 章节资源按 `"chapter:" + t` scope 整目录加载。
- 但章节完成弹窗、错误回退和结局路径可直接 `loadScene("mainScene")`，没有释放当前 `gk/dX`。
- 回到主页后再次选章会把 `Smallplot` 重设为 `0_x`；下一 Transition 只能看到旧章节号 0，无法补释放上一次活动章节。

这会让已销毁玩法节点对应的章节 Bundle 继续常驻，重复游玩可能累积多个章节。

**最小修复（M）：**

- ResourceManager 独立记录 `activeChapterScope/activeChapterId`，不要依赖 `Smallplot` 推断所有权。
- 统一所有离开 Gameplay 的出口。在新场景加载完成、旧 Gameplay 节点已销毁后，调用 `releaseActiveChapter()`。
- 正常相邻章节过渡也使用同一 API，保证幂等。

**验证：**

1. d1 → 主页 → d2 → 主页 → d3 → 主页。
2. 每次主页稳定后 `retainedBundles` 不应保留 chapter Bundle，PSS 不应按章节单调增长。
3. 再次进入旧章，资源应能重新加载且无丢图/骨骼空白。

### F-04 MEDIUM：全局 hide flush 已关闭正常后台窗口，但关键状态仍依赖 0 ms 延迟提交

**类别：** 并发、Android 生命周期、持久化  
**位置：**

- `assets/Scripts/SaveManager.js:147-216`
- `assets/Scripts/GameState.js:323-353`
- `assets/Scripts/GameConfigManager.js:73-149`
- `assets/Scripts/LoadingSceneController.js:49-55`

**证据：**

- 各业务 setter 先同步写 legacy key，再用 `setTimeout(..., 0)` 延迟写完整 v2 快照。
- `LoadingSceneController` 已安装进程级 `EVENT_HIDE -> SaveManager.flush()`；正常 HOME、来电和系统后台路径会提交 pending 快照。
- 剩余窗口是 critical legacy 更新后、0 ms timer/hide 事件前发生原生崩溃或强制终止。下一启动 `restoreOrMigrate()` 仍会优先选择旧的有效快照，并覆盖更新后的 legacy key。

最小进程重建探针：旧快照为第 1 章，legacy 已更新到第 2 章，但在 timer 提交前模拟进程死亡；重新加载 SaveManager 后结果为：

```json
{"restoredChapter":1,"legacyChapter":"1","snapshotChapter":1}
```

**最小修复（S-M）：**

1. 章节解锁、选章、重置进度等低频关键状态使用同步 `commit()`，不要只依赖 0 ms timer。
2. 或在快照增加 legacy generation/dirty marker；恢复时如果 legacy generation 更新，不能盲目用旧快照覆盖。

**验证：**

- 对 `scheduleCommit` 后、timer 前模拟进程终止，重启必须恢复新章节。
- 在主页选章后立即 HOME 再强杀进程，重启仍进入新章；该正常生命周期路径当前应通过。
- 注入 setter 后立即 native abort 的极端路径，关键章节/解锁状态不得回退。
- current 损坏仍可回退 previous；该现有契约必须继续通过。

### F-05 MEDIUM：通用资源回调缺少 owner/generation，错误分支还可能二次回调

**类别：** 并发、生命周期  
**位置：**

- `assets/Scripts/BaseView.js:64-80`
- `assets/Scripts/GameUtilities.js:29-43`
- `assets/Scripts/GameplaySceneController.js:285-390`
- `assets/Scripts/ChapterTransitionController.js:361-384`

**证据：**

- `BaseView.createPrefab/setSpriteFrame` 和 `GameUtilities.setSpriteFrame` 完成时没有统一验证发起组件、目标 Node/Sprite 或场景 generation。
- Gameplay 冷加载地图、主角和数十个物件时，回调直接访问 `layer_master`、`node` 等对象。
- `GameUtilities.createPrefab()` 在错误时调用 `e(null)` 后没有 return，随后仍执行 `cc.instantiate(o)`，可能抛错或二次回调。
- ChapterTransition 的加载完成回调同样直接写当前场景 UI。

**最小修复（S-M）：**

- 修复错误分支立即 return。
- `BaseView` 为每次加载捕获 owner generation；`onDestroy` 使其失效。
- 静态工具至少检查 `cc.isValid(target, true)`；更稳妥是要求调用者传 owner/token。
- 所有完成回调遵循“先检查 err，再检查 owner/token，再实例化/赋值”。

**验证：**

- 人工延迟资源回调，在地图加载中切回主页；不得出现 invalid native object、二次 callback 或旧地图节点。
- 资源加载失败回调只调用一次且参数为 null。

### F-07 MEDIUM：原生 `setTimeout` 导航没有组件所有权或重复触发门闩

**类别：** 并发、生命周期  
**位置：**

- `assets/Scripts/ChapterSelectionDialog.js:170-185`
- `assets/Scripts/ChapterTransitionController.js:417-432`
- `assets/Scripts/GameplaySceneController.js:569-614`
- `assets/Scripts/MainMenuController.js:89-95`
- `assets/Scripts/SettingsDialog.js:105-133`

**证据：** `setTimeout` 不受 Cocos Component scheduler 管理，组件销毁不会自动取消。部分入口也没有 navigation pending 标志；快速重复确认、切场或重启可能留下晚到的 `loadScene/restart`。

**最小修复（S）：**

- 可由组件管理的延迟统一改为 `scheduleOnce`。
- 必须使用原生 timer 时保存 handle，在 `onDestroy` 清除，并在回调检查 scene generation。
- 所有导航入口用全局/场景级 `transitionPending` 防双击。

**验证：**

- 50 ms 内连续点击确认 10 次，只允许一次场景切换。
- timer 启动后切到另一场景，旧 timer 不得再次跳转。

### F-08 MEDIUM：场景退出只停止 BGM，循环音效和音频缓存没有生命周期边界

**类别：** 生命周期、资源  
**位置：**

- `assets/Scripts/AudioManager.js:15-34,65-121`
- `assets/Scripts/GameplayEventController.js:640-666`
- `assets/Scripts/ChapterCompleteDialog.js:65-73`
- `assets/Scripts/GameplaySceneController.js:558-603`

**证据：**

- BGM 有明确 stop/token。
- 普通/循环音效保存在全局 `soundMap`，依赖剧情事件逐一 stop。
- 直接回主页路径只调用 `stopBGM()`，没有统一停止所有场景音效和使 pending sound token 失效。
- `audioCache` 为进程终身缓存，没有容量、章节范围或诊断。

当前音频目录有限，因此缓存是“有界常驻”而非无限泄漏；但中途离开章节时循环环境音可能跨场景继续播放。

**最小修复（S-M）：**

- 增加 `stopSceneSounds()`：停止所有有效 effect ID、递增全部 token、清空场景 soundMap/音量状态。
- Gameplay onDestroy/统一离场出口调用；应用 hide/show 采用 pause/resume。
- 对大音频或未来内容扩张增加 LRU/章节 scope；保留 UI 高频短音效常驻。

**验证：**

- 在流水、火焰等循环声区域直接回主页，主页不得继续播放环境音。
- 音效加载中回主页，晚到回调不得播放。

### F-09 MEDIUM：一次玩法存档仍执行约 9–10 次同步 SQLite 写及多次大对象序列化

**类别：** 阻塞 I/O、运行性能  
**位置：**

- `assets/Scripts/GameplaySceneController.js:495-517,1237-1262`
- `assets/Scripts/GameConfigManager.js:73-81,102-126`
- `assets/Scripts/GameState.js:67-72,323-329`
- `assets/Scripts/SaveManager.js:169-185`

**证据：** `saveItemConf()` 先同步写 8 个 legacy key，再同步写 previous/current 快照（首代少 previous）。每次还遍历全部物件并多次 `JSON.stringify`。移动与交互虽已分别延迟约 0.75/0.5 秒，但真正提交仍在游戏线程同步执行。

**最小修复（M）：**

- 内存中构建一次完整 state，一次序列化后写 current；legacy 镜像只在安全点或值变化时更新。
- 增加 dirty key/内容 hash，跳过未变化的大字段。
- 保留后台和关键剧情点同步强制提交；普通移动只合并。

**验证：**

- 调试包装 `localStorage.setItem` 计数；一次停步目标为 1 次完整快照写，兼容镜像不得每次全量重复。
- 在第二章最大 tempData 检查停步帧时间，不出现可感知尖峰。

### F-10 MEDIUM：交互与任务目标仍按固定频率扫描全图，静止时不会停

**类别：** 运行性能、GC  
**位置：**

- `assets/Scripts/GameplaySceneController.js:1177-1221`
- `assets/Scripts/GameplayEventController.js:69-106`
- `assets/Scripts/ObjectiveManager.js:55-111,166-174`

**证据：**

- 每 12 帧：`scanTouchProximity()` 遍历 itemMap，并把 520 范围内候选传给 `selectClosestItem()`；这已避免后者再次扫描完整 itemMap。
- 每 30 帧：ObjectiveManager 仍会独立遍历 itemMap；d3_2 的 `_distributionProgress()` 还会进行第二次遍历。
- 最大常用地图约 38–49 个物件。即使角色静止、事件未变化，每秒仍有约 5 次邻近全图扫描及 2 次目标全图扫描，并持续执行 `getComponent/getConf/getOpType` 和字符串/对象分配。

**最小修复（M）：**

- 建立统一 `InteractionSnapshot`，一次扫描同时产出触摸事件、最近操作物、任务候选和分发进度。
- 仅在英雄移动超过 12–20 单位，或物件创建、移除、解锁、事件切换时标 dirty。
- Objective 文本只有变化时才写 Label，避免重复 native bridge/排版。

**验证：**

- 静止 30 秒时 itemMap 扫描次数接近 0。
- 移动过程中每个更新周期最多一次扫描，拾取 320/420 距离与携带物资优先级契约保持不变。

### F-11 LOW：云层越界仍重建环境节点

**类别：** 运行性能  
**位置：**

- `assets/Scripts/CloudSpawner.js:56-73`
- `assets/Scripts/AmbientCloudSpawner.js:74-125`

**证据：**

- 相机跟随已改为复用 `m_cameraTrackPosition`，不再每帧创建 Vec2/对象。
- 云层虽已降到 30 Hz，但越界时仍 remove、splice、新建 Node/Sprite、异步设置 SpriteFrame；长期游玩持续产生 JS/native 对象。

**最小修复（S）：**

- 云节点越界后直接复位同一节点，必要时替换已缓存 SpriteFrame，不再 remove/new。

**验证：**

- 章节静置 15 分钟，Node/Sprite 数量稳定。
- 低端设备 GC 日志和帧时间尖峰减少，云速保持不变。

### F-12 MEDIUM：崩溃诊断上下文只存在于即时 logcat，没有持久化面包屑

**类别：** 可观测性  
**位置：**

- `assets/Scripts/Logger.js:12-56`
- `assets/Scripts/GameplaySceneController.js:267-271`
- `assets/Scripts/GameplayEventController.js:348-353`
- `assets/Scripts/ResourceManager.js:273-278`
- `assets/Scripts/SaveManager.js:227-234`

**证据：**

- warn/error 有 chapter/map/event 前缀，但没有全局 JS exception/unhandled error 捕获。
- 没有持久化最近事件、场景切换、弹窗、资源 scope、存档 revision。
- `ResourceManager.diagnostics()` 与 `SaveManager.getDiagnostics()` 已存在，却没有被组合到错误上下文。
- 原生崩溃或被系统杀后，用户现场通常无法保留 adb logcat。

**最小修复（M）：**

- Logger 增加固定容量内存 ring buffer，记录事件码和小型字段，不记录完整存档/隐私文本。
- 每个关键点记录：build/version、chapter/map/event、popup、resource diagnostics、save revision/reason、最近一次生命周期事件。
- 捕获 JS 全局异常并在下一启动展示/导出上一会话诊断；原生 tombstone/崩溃 SDK 可作为发布阶段扩展。

**验证：**

- 注入 JS 异常并重启，能读取异常前最后 50–100 条面包屑。
- 资源加载失败日志必须包含 logical path、bundle、scope、owner generation。

### F-13 LOW：Logger 尚未覆盖全部日志入口，事件上下文可能陈旧

**类别：** 可观测性、调试性能  
**位置：**

- `assets/Scripts/Logger.js:21-47`
- `assets/Scripts/DialogManager.js:21-23,47-53`
- `assets/Scripts/GameplayEventController.js:348-353`

**证据：**

- Logger 只包装 `console.*`，两个 `cc.log` 弹窗日志绕过发布门控。
- event context 在新事件时更新，但未看到事件完成时清空；后续无关错误可能附带旧事件 ID。
- 当前生产脚本约有 254 个 `console/cc.log` 调用；发布版大部分被关闭，但 debug 性能测试会受日志桥接影响。

**最小修复（S）：**

- 所有生产日志走统一 Logger，提供 debug/info/warn/error 和事件码。
- 事件结束/切图时显式清空 event。
- 性能验收使用 release-like 日志配置。

**验证：**

- 发布构建普通交互不输出 debug/info；warn/error 带正确且非陈旧的场景上下文。

## N/A 与误报排除

| 检查 | 结论 |
|---|---|
| HTTP health/readiness/liveness | N/A：这是原生离线游戏客户端，不监听服务端口。 |
| Kubernetes/进程信号 SIGTERM/SIGINT | N/A：Android Activity/Cocos 生命周期由 `EVENT_HIDE/SHOW` 和场景生命周期承载。 |
| Prometheus、请求 ID、分布式追踪 | N/A：无服务请求链；以 gameplay breadcrumb、资源 scope 和存档 revision 替代。 |
| Worker/共享内存线程安全 | 未发现 Worker、SharedArrayBuffer 或业务 Java 多线程共享状态；JS 业务主要在 Cocos 游戏线程。 |
| 锁顺序与死锁 | 未发现业务 mutex/lock；不报告死锁。 |
| 文件 TOCTOU | 未发现业务代码使用 exists-then-open 等文件竞争模式。 |
| 普通 Cocos `schedule/scheduleOnce` | Component 销毁时引擎会回收 scheduler target；只报告了不受组件管理的原生 `setTimeout` 和业务恢复状态。 |
| 模拟器 OpenGL 日志 | 最近 logcat 未见 FATAL，但持续出现 `HostConnection: glGetError exceeded`。该信息来自模拟器宿主连接，不能据此认定游戏 GL 错误；需真机复核。 |

## 运行证据与验收基线

- 当前模拟器进程：`com.game.longmarch.creator243`
- ADB 内存快照：TOTAL PSS 约 **168,927 KB**，Native Heap 约 **28,305 KB**，Unknown 约 **55,223 KB**。
- 最近 1200 行进程日志未发现 `FATAL EXCEPTION`、`Fatal signal` 或 `SIGSEGV`。
- 该快照只代表当前场景，不证明完整通关后无增长；章节释放必须采用重复路径差分验证。

建议按以下顺序验收：

1. 先增加四个确定性测试：资源取消晚到、弹窗双开、延迟存档杀进程、直接回主页释放章节。
2. ADB 自动执行“进章 → 回主页”三轮，记录 ResourceManager diagnostics 和 `dumpsys meminfo`；主页 PSS 不应按轮次单调增长，第三轮相对首轮建议控制在 +20 MiB 内。
3. 后台恢复矩阵：键盘、摇杆、地面移动、弹窗、资源加载、存档提交中分别 HOME/恢复/杀进程。
4. 性能矩阵：d1_1、d2_1、d3_1、d3_2 各静止和连续移动 60 秒；记录 itemMap 扫描次数、localStorage 写次数、GC 和帧尖峰。
5. 真机至少覆盖一台 Adreno 和一台 Mali；模拟器 `glGetError exceeded` 只作为排查线索。

## 推荐修复顺序

1. **F-03 统一活动章节离场释放**
2. **F-04 关键章节/解锁状态同步提交**
3. **F-02 弹窗增加场景 generation/closeAll**
4. **F-05 异步 owner/generation 防护**
5. **F-07 导航门闩与 timer 所有权**
6. **F-09/F-10 存档和交互扫描性能**
7. **F-08/F-11 音频、云与临时对象生命周期**
8. **F-12/F-13 崩溃面包屑和统一日志**
