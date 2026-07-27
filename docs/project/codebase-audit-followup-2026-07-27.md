# 《重返长征路》第二轮代码审计与实施报告

日期：2026-07-27  
分支：`codex/implement-full-audit`  
范围：三章七张发布地图、存档兼容、异步与生命周期、运行性能、Android 构建供应链和设备回归。

## 结论

第二轮审计发现的高优先级、可在当前工程内安全验证的问题已经实施。最重要的结果是：

- 第三章缺失的“红星报”现已加入 `scenes_d3_3`，新档、旧档和已收集存档均有确定性迁移规则；
- 弹窗晚到、资源回调晚到、快速重复导航、章节资源和循环音效跨场景残留均增加所有权边界；
- 章节选择、章节解锁等低频关键进度改为同步原子提交，普通移动和交互仍合并写入；
- 近场交互只扫描一次并复用候选，云节点改为循环复位，重复 Label 和 SQLite 写入被抑制；
- 正式构建新增源码洁净度、Gradle 校验和、GitHub Action SHA、Android lint、零权限、
  旧 OkHttp/Okio 排除和构建清单门禁；
- ADB 稳定性轮转实际发现并修复了一处 `GameState` 模块变量被近场循环覆盖的
  `STATE_DRAG` 异常，随后在同一流程中复测通过。

本轮没有改写原作剧情、史实文本、场景 ID、事件 ID、资源 UUID 或旧存档键。

## 审计评分

下表是工程风险收敛指标，不等同于商店认证或真实设备兼容认证。初始分来自三个专项审计；
实施后分数依据已经落地且有自动化/设备证据的控制项重新评估。

| 类别 | 初始 | 实施后 | 主要变化 |
|---|---:|---:|---|
| 安全 | 8.8 | 9.2 | 正式包脚本排除旧网络栈、零权限断言、构建输入完整性校验 |
| 构建健康 | 7.5 | 8.8 | 测试后不再改源码、洁净树、lint、构建清单和 CI 固定版本 |
| 依赖与复用 | 6.5 | 7.6 | 移除未使用的易受攻击网络 JAR；Creator 2.4.3 生命周期风险仍在 |
| 代码原则 | 5.8 | 6.5 | 补齐事件单例生命周期，删除无效热路径；大控制器仍需渐进拆分 |
| 代码质量 | 5.2 | 8.0 | 发布内容门禁、旧档迁移、地图边界和新增警告阈值 |
| 死代码 | 6.6 | 7.5 | 删除空方法、空调用和无效果表达式 |
| 可观测性 | 6.0 | 7.5 | 持久化环形面包屑、上次会话诊断和全局 JS 异常捕获 |
| 并发/异步 | 6.0 | 8.5 | 弹窗场景归属、资源 epoch/tombstone、导航门闩、owner 有效性 |
| 生命周期 | 5.5 | 8.4 | hide/show 输入复位、资源/音频释放、关键存档 flush、云复用 |

完整初始证据位于：

- [安全、构建与依赖专项](.audit/ln-620/2026-07-27/security-build-dependencies.md)
- [代码原则、质量与内容专项](.audit/ln-620/2026-07-27/quality-dead-code-content.md)
- [可观测性、并发与生命周期专项](.audit/ln-620/2026-07-27/observability-concurrency-lifecycle.md)

## 已实施内容

### 发布内容与旧存档

- `ConfigRepair` 以幂等 placement 表补入 `prop113`，并以永久收藏状态阻止已收集物品重生。
- `GameConfigManager.getTempData()` 在读取旧关卡存档时应用相同迁移并自动保存。
- `verify-published-content.js` 将七图、13 件收藏、10 条史实、6 道答题和章节总数设为发布门禁。
- `published-maps.json` 成为内容门禁和 ADB 稳定性测试共用的机器清单。

### 存档与恢复

- 两代快照增加结构、章节、地图和校验和语义验证；损坏 current 仍可回退 previous。
- 章节选择、章节解锁改为同步关键提交，关闭 legacy key 已更新而快照尚未提交的极短回退窗口。
- Android `EVENT_HIDE` 和 Gameplay hide 都会停止输入、保存角色/事件状态并 flush。
- `writeIfChanged/removeIfPresent` 跳过没有变化的 SQLite 镜像写入。

### 异步、场景与资源生命周期

- 弹窗使用 request token、统一 key、场景引用和 Canvas 有效性验证；旧场景请求不能挂到新场景。
- 资源 scope 在请求前建立，以 epoch、released tombstone、pending 和 Bundle in-flight
  阻止晚到回调复活已释放资源。
- Gameplay 离场清空事件单例中的旧英雄、交互物、阻挡物和栈引用。
- 主菜单加载时统一释放 `gk/d*` 章节 scope；Gameplay 销毁停止场景音效并使晚到音频 token 失效。
- 主页和章节选择导航使用门闩与组件 scheduler，快速点击只触发一次切场。

### 操作与性能

- TOUCH、普通交互和最近候选由一次 `itemMap` 扫描产出，任务文本降频且只在变化时写 Label。
- 相机跟随位置对象复用；云越界时复位原节点，不再 remove/new。
- 删除每帧空方法、无消费者状态残片和无效果属性读取。
- ADB 稳定性测试发现近场候选循环覆盖压缩源码模块变量；已改为
  `candidateIndex/candidateNode/itemKey` 并增加静态回归契约。

### 构建、安全与可追溯性

- Gradle 8.11.1 wrapper 写入官方 SHA-256；GitHub Actions 固定到完整 commit SHA。
- 正式构建先以 `--verify` 检查运行时补丁，不允许测试后修改源码。
- 正式构建默认要求干净 Git 工作树，并执行 `lintRelease`。
- 离线正式变体排除 `Cocos2dxDownloader.java`、OkHttp、Okio，并从合并清单移除网络权限。
- 构建完成后记录 Git commit、dirty 状态、工具版本、APK/AAB/资源包哈希。

## 验证证据

| 验证 | 结果 |
|---|---|
| `npm test` | 67 个脚本、12 场景/1218 事件/802 跳转、发布内容、契约、命名和纹理预算全部通过 |
| 配置增量门禁 | 0 error；历史 440 warning 被设为上限，新增 warning 会失败 |
| Android 调试构建 | 双 ABI 成功；SHA-256 `C999D32309349DFBD6388BE5C9AE299AF129032474056911AE4E52470814C4C7` |
| Android 正式构建 | `lintRelease`、APK/AAB、zipalign、v1/v2/v3 签名、API 36、minSdk 21 和双 ABI 全部通过 |
| 正式包安全检查 | 系统权限 0；`Cocos2dxDownloader`/OkHttp/Okio DEX 匹配 0；构建来源为干净提交 `20216bc` |
| 正式包产物 | 测试签名 APK SHA-256 `A29F4D92A53A784B97111C5B53C22DC9E07EDD8E0AD5C8DE222C60EDA1985FB9`；AAB SHA-256 `F55EC6C7526E196E57BD54682EDF7DB1BD4227A1AC2338DE7399D1E7B0D1F71A` |
| 旧档设备迁移 | 测试前删除 `prop113`，启动后精确恢复 1 个；不会重复注入 |
| 收藏品交互 | ADB 重定位后显示“拾取（收藏品-红星报）”；点击打开可读卡片，关闭后物件从场景存档删除并写入永久收藏 |
| 后台恢复 | HOME 后恢复，前台状态与快照均有效，日志无 JS/Native 崩溃 |
| 稳定性复测 | 四轮发布地图切换、移动、后台和恢复通过；修复后的日志无 `STATE_DRAG`、TypeError、FATAL、ANR |

截图仅由 ADB 获取；分析使用本地压缩预览和 OCR，原图没有上传，也不会提交到 Git。

## 仍需后续推进

1. **引擎升级。** Creator 2.4.3 已停止维护，短期应在独立分支先验证 2.4.15，长期再按
   Creator 3.x/维护中运行时做分阶段迁移。不能把 Creator 的定制 JSB 工程当成普通
   Cocos2d-x 库直接替换。
2. **大控制器拆分。** `GameplayEventController` 和 `GameplaySceneController` 仍承担过多职责。
   后续应以事件类别、交互查询、持久化适配器为边界渐进拆分，每一步都通过七图契约。
3. **历史配置债务。** 当前 440 条不可达事件来自恢复的编辑数据，新增数量已被禁止；
   下一阶段应按“发布入口、剧情内部跳转、明确保留的编辑分支”建立精确基线。
4. **真实 ARM64 设备。** 雷电模拟器主 ABI 为 x86_64，虽运行双 ARM 包但不能代替
   Adreno/Mali 真机。发布前仍需至少两台真实 ARM64 设备完成 30 分钟轮转和后台矩阵。
5. **正式签名验收。** 本轮 release 使用 `LongMarch Test / Automated QA` 本地测试签名完成
   构建和静态验收。最终对外包仍应使用项目正式密钥，并在不清除用户数据的条件下完成
   正式签名包验收；测试签名包不能冒充生产发布包。

当前 Cocos 2.4 文档说明该产品线已结束更新并建议新项目使用 3.x；Asset Bundle 仍是
2.4 资源隔离的官方机制。Android 发布要求和性能验收应持续以官方 target API、
内存分配与 Android vitals 指南为准。

官方基线：

- [Cocos Creator 2.4 产品线状态](https://docs.cocos.com/creator/2.4/manual/en/)
- [Cocos Creator 2.4 Asset Bundle](https://docs.cocos.com/creator/2.4/manual/en/asset-manager/bundle.html)
- [Gradle 发布校验和](https://gradle.org/release-checksums/)
- [Google Play target API 要求](https://developer.android.com/google/play/requirements/target-sdk)
- [Android 游戏内存分配](https://developer.android.com/games/optimize/memory-allocation)
- [Android vitals](https://developer.android.com/topic/performance/vitals)
