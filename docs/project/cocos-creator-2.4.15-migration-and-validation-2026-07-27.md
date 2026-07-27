# Cocos Creator 2.4.15 迁移与完整验证报告

日期：2026-07-27  
分支：`codex/upgrade-cocos-2.4.15`  
迁移范围：Creator 2.4.3 → 2.4.15、Android 构建链、七张地图、交互、存档、后台恢复与正式产物。

## 结论

工程已完成 Cocos Creator 2.4.15 迁移，并保持原包名、项目 ID、资源 UUID、场景/事件 ID
和旧存档键不变。Creator 官方发布页记录 2.4.15 发布于 2025-04-03；官方 2.4 手册同时
说明 2.x 产品线已经停止更新，因此本次升级定位为旧项目维护基线，而不是继续扩展 2.x
生命周期。

迁移后的 Web Mobile、Android ARMv7/ARM64 调试构建和模拟器运行均已通过。正式 APK/AAB
的 Release、R8、lint、签名、zipalign、API、ABI 和离线安全检查在同一分支的干净提交上
执行，结果及产物哈希见本文“正式构建结果”。

官方参考：

- [Cocos Creator 2.4.15 发布记录](https://www.cocos.com/en/update)
- [Cocos Creator 2.4 手册与产品线状态](https://docs.cocos.com/creator/2.4/manual/en/)
- [Cocos Creator 安装说明](https://docs.cocos.com/creator/2.4/manual/en/getting-started/install.html)

## 可复现输入

| 输入 | 路径/版本 | SHA-256 |
|---|---|---|
| Creator 官方 Windows 压缩包 | `E:\temp\CocosCreator_v2.4.15_20250328_win.zip` | `B2E5A465E6E6074CAB0859DE67C6CF0F6442C8195D03E26FAC9B519B90BAFCE0` |
| Creator 可执行文件 | `E:\temp\CocosCreator-2.4.15\CocosCreator.exe` | `9EBC21345281D1975C6022B6EC8F5877E8AAEAA72558733B40EC262835C0EB6C` |
| Creator engine `package.json` | 2.4.15 | `34139E3F3D2AACCD266C08E98803754E90EEEA8607A2B9870267310DD3D4A444` |
| Creator `CocosAndroid.mk` | 2.4.15 | `952A085266AC5E63D0A61883BD6854D86657C9AE9FC67EFE34D9A02E8224A83B` |
| Android NDK | 20.1.5948944 | `source.properties`: `6AB1F3415CAF51EA55FBBFA7B9DA14E2BCB165E077007A1D4BC8D1FB0C99BAAA` |
| Android 构建链 | JDK 17 / AGP 8.9.2 / Gradle 8.11.1 | 由构建脚本和 Gradle wrapper 校验 |

`tools/build-input-baseline.json` 保存固定基线，`tools/verify-build-inputs.js` 在调试和正式
构建开始前验证这些输入。下载地址和哈希均不得由本机临时文件自动重写。

## 迁移内容

### Creator 资源数据库

第一次由 2.4.15 打开工程后，Creator 按其 2.4.15 importer schema 更新了场景、预制体、
脚本和纹理 `.meta` 的版本及 importer 字段。这些变更与资源 UUID 一同提交；没有重新生成
UUID，也没有改写剧情配置和存档标识。

`project.json` 的 Creator 版本更新为 2.4.15。项目 ID 和 Android 包名仍保留
`creator243` 标识，这是为了让已安装版本继续读取已有 SQLite/LocalStorage 数据，而不是
表示当前引擎仍为 2.4.3。

### Android 维护链

- 调试和正式构建统一使用 JDK 17、API/target 36、minSdk 21、AGP 8.9.2 和 Gradle 8.11.1。
- 原生库同时构建 `armeabi-v7a` 与 `arm64-v8a`；APK 不包含 x86/x86_64。
- 生成工程自动关闭旧 V8 Inspector TCP 监听，保留 Android debuggable 和本地符号能力。
- 项目没有联网需求；生成工程使用离线 `Cocos2dxDownloader` 兼容桩，排除 OkHttp/Okio，
  最终清单系统权限为 0。
- 构建脚本在 Creator 成功、失败和超时分支都会回收 Electron/Creator 进程树，避免下次
  构建读到未完成输出。

### 操作与运行时兼容

迁移验证实际发现并修复了四类只在新版原生运行时或 Android 输入链出现的问题：

1. 2.4.15 debug 原生运行时尝试绑定 V8 Inspector 6086 端口，在当前 Android 环境触发
   `SIGABRT`；生成工程现显式关闭远程 Inspector。
2. 完全删除旧下载器 Java 类会导致原生 ClassLoader 找不到
   `Cocos2dxDownloader`；改用不发起网络请求、没有 OkHttp/Okio 依赖的离线兼容桩。
3. 旧存档把 BGM 音量保存为字符串，新版原生音频绑定要求浮点数；`AudioManager` 现在先
   归一化为有限数值，再调用原生音频接口。
4. Android GL View 不直接转发 A/D/W/S，且 DPAD 到 Creator JS 的键码为
   `1000/1001/1003/1004`，与浏览器的 `37/39/38/40` 不同；原生 Activity 增加硬件键桥，
   游戏控制器同时接受两组键码。

## 自动门禁

| 门禁 | 结果 |
|---|---|
| JavaScript/配置语法 | 69 个脚本及全部游戏配置通过 |
| require 文件大小写 | 157 个相对依赖全部存在且大小写精确 |
| 配置图 | 12 场景、1218 事件、802 跳转、0 error |
| 历史警告 | 440 项精确基线，SHA-256 `935eddd552703f70284170dd968802e763aa9135a22e3aeeb6baa8d9aa7c2c08` |
| 发布内容 | 7 张地图、13 件收藏、10 条史实、6 道答题 |
| 游戏契约 | 移动、拾取、投递、弹窗阻断、切图、后台/进程恢复、坏档回退通过 |
| 可读命名 | 55 个脚本、1179 个资源、3 个章节 Bundle |
| 纹理预算 | 869 张 PNG、68 个骨骼图集页面，超限即失败 |
| 构建输入 | Creator/engine/NDK 固定哈希通过 |

Web Mobile 主业务包由 470,439 字节裁剪到 403,075 字节，减少 67,364 字节（14.3%）；
裁剪后交互查询、持久化和灭火小游戏模块均存在，生产包验证通过。

## 模拟器完整验证

设备：雷电模拟器 `emulator-5554`。截图只通过 ADB 获取，先在本地压缩/OCR；原图没有
上传，也不提交 Git。

| 场景 | 结果与证据 |
|---|---|
| 启动 | 日志明确输出 `Cocos Creator v2.4.15`，无 JS 异常、Native 崩溃、ANR 或 tombstone |
| 旧档升级 | 保留升级前 SQLite checkpoint；已有第三章进度可正常读取和继续 |
| 触摸道路移动 | 第三章地图 1 的 x 坐标 `619.8003 → 985.9024`，位移 `+366.1021` |
| A/D 硬件键移动 | D 键桥接回归后 x 坐标 `619.8003 → 625.6004`，位移 `+5.8001` |
| 拾取与卡片 | 第三章地图 3 显示“拾取（收藏品-红星报）”；点击后物件移除、永久收藏写入、卡片尺寸可操作 |
| 灭火小游戏 | 第一章地图 1 的水桶投递触发 `FireExtinguishMiniGame` 和泼水回调；每次泼水后按原玩法重新取水 |
| 后台恢复 | HOME → 前台恢复通过，输入、角色位置和快照有效 |
| 坏档回退 | 人为损坏 current 后正确回退 previous |
| 旧档内容迁移 | 新档/旧档的 `prop113` 注入规则通过，已收藏状态不会重复生成 |
| 七图稳定性 | 7 张发布地图轮转两轮，含移动、HOME、恢复；15 次循环、约 3 分钟日志无异常 |
| CG/跳转 | CG 可主动跳过并进入下一环节；测试 checkpoint 可直接跳到目标地图，不必重复跑前置剧情 |

调试 APK：

- 路径：`dist/chongfanchangzhenglu-armv7-arm64-debug.apk`
- 大小：136,293,439 字节
- SHA-256：`EFADC147EBCD71522540A266301F9DE3F22959E0277CFF368E8198ABEF4991C1`
- `versionCode=2026072703`，`versionName=1.1.0`，targetSdk 36，minSdk 21，双 ARM ABI，
  系统权限 0。

模拟器通过 Houdini 执行 ARM64 库，这能验证 Android/JSB 行为，但不等价于
Adreno/Mali 的真实 ARM64 硬件兼容认证。

## 正式构建结果

本节在干净源码提交上执行 `tools/build-android-release.ps1` 后补充。APK/AAB、签名配置、
keystore 和构建目录均在 Git 之外。

## 剩余外部发布门禁

工程内可自动化的中长期工作和 2.4.15 迁移项已经关闭。发布前只剩两个必须依赖项目外部
条件的验收项：

1. 使用项目正式生产 keystore 构建最终 APK/AAB，并按正式证书的升级链验证覆盖安装。
   本轮自动验证使用隔离的 QA 测试签名，不能代替生产密钥。
2. 至少两台真实 ARM64 设备（建议各一台 Adreno、Mali）完成 30 分钟七图轮转、后台、
   锁屏、低内存恢复、触摸与 A/D 外接键盘矩阵。

由于 Cocos Creator 2.x 已停止更新，后续新增大型功能应单独立项评估 Creator 3.x 或其他
仍维护的运行时；不应在当前兼容分支直接做不可逆的跨代重写。
