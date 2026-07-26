# 重返长征路（Cocos Creator 2.4.3 原版重建）

本工程从 APK `E:\APPs\cfczl100\cfczl3.apk` 的原始 Creator 2.4.3 构建内容重新恢复，不包含此前 Creator 3.8.8 复刻版的代码或资源。

原 APK 的 `assets/src/cocos2d-jsb.js` 明确记录 `cc.ENGINE_VERSION = "2.4.3"`。本工程保持原始场景结构、美术、音频、动画、配置和 JavaScript 游戏逻辑，不重新设计玩法。

## 固定工具链

- Cocos Creator：`E:\temp\CocosCreator-2.4.3\CocosCreator.exe`
- 原始引擎版本：2.4.3
- JDK：Temurin 8u492，`E:\temp\jdk8u492-b09`
- Android NDK：r20b / 20.1.5948944
- Android SDK：API 28 / Build Tools 28.0.3
- 业务逻辑：JavaScript（60 个从 APK 原始 Browserify 包恢复的模块）
- 目标 ABI：`armeabi-v7a`、`arm64-v8a`
- Android 包名：`com.game.longmarch.creator243`（避免覆盖模拟器中的原始 APK）

## 源文件恢复

原始脚本总包保存在 `recovery/original-main-index.js`。执行：

```powershell
node .\tools\recover-original-scripts.js
```

脚本会拆出 60 个 JavaScript 模块，使用 APK 中的 `cc._RF` 类 ID 还原 `.meta` UUID，并校验场景、预制体引用的全部自定义组件都有对应脚本。

资源恢复与完整性校验：

```powershell
node .\tools\restore-original-resources.js --verify
```

当前校验结果为 524 个原图集切片和 1513 个原始路径 UUID 全部匹配。恢复清单保存在 `recovery/original-scripts-manifest.json` 与 `recovery/original-resources-manifest.json`。

## Android 构建

从 Creator 工程生成 Android 工程并编译：

```powershell
.\tools\build-android.ps1
```

如果 `build/jsb-link` 已经由 Creator 生成，只做增量编译：

```powershell
.\tools\build-android.ps1 -SkipGenerate
```

脚本会固定 JDK 8、NDK r20b、API 28，通过临时短盘符规避 Windows 路径长度限制，并在复制 APK 前解包验证 ABI。最终产物：

`dist/chongfanchangzhenglu-armv7-arm64-debug.apk`

当前调试包大小为 161,838,753 字节，SHA-256：

`C6A3F53367A250C29E53794009907A8717B307016701051B0750B80ED203E094`

APK/AAB 属于可重复生成的构建产物，不提交到 Git；本地最终 APK 仍输出到 `dist/`。

## 操作方法

- 手机或模拟器：单击/轻触道路或地面，角色会走向点击位置。这是首关的主要移动方式。
- 键盘：`A` / `D` 或方向键左 / 右控制水平移动；在梯子上使用 `W` / `S` 或方向键上 / 下。
- 靠近可交互物后，点击右下角出现的操作按钮；世界空间的手势气泡也可直接点击。剧情强制等待期间不会响应移动。

## 已完成验证

- Creator 2.4.3 Web Mobile 构建成功，无资源缺失警告。
- Android 双 ARM 原生库与 APK 构建成功，APK 内无 x86/x86_64。
- 雷电模拟器安装、启动和触控成功；已用 ADB 点击与长按滑动回归验证角色移动及镜头跟随。
- 已使用 ADB 完整通关当前版本的三大章、七张地图；第三章结局会显示原作自带的“后续关卡正在开发中，敬请期待”，确认后可正常返回主菜单。
- 已修复运行时地图遮住 UI/触摸控制层的问题，并在首关实测点击地面后角色和镜头正常移动。
- 方向输入会跟踪仍按住的键，避免按键重复、多键切换、触摸取消或剧情短暂锁定时意外停止角色。
- 已修复 Android 原生端触点与世界气泡投影坐标缩放不一致的问题，物品气泡不再吞掉右侧大块道路点击，底部操作键和道路移动可同时正常使用。
- 已修复搬运物资时道路点击误触操作键、交互距离不足、旧 Spine `Slot.color` API 在新版原生运行时抛错或崩溃等问题。
- 已逐项验证拾取、搬运、投递、答题、收藏卡、跨图跟随、剧情跳过、章节结算和终局返回主菜单。
- `settings.js`、主资源包、ARM32/ARM64 原生库均已核验存在。
- 已通过 ADB 安装并启动最新 APK；地面触摸回归未再出现 JavaScript 异常。
- 世界空间的任务/物品引导卡片按新版原生视口缩放为 55%，避免遮挡附近的交互气泡。

代码、章节体验、稳定性、性能及正式发布门槛的综合结论见
[`docs/project/codebase-audit-2026-07-27.md`](docs/project/codebase-audit-2026-07-27.md)。

## 工程原则

- 场景、预制体、动画、配置、图片、音频、Spine 与 DragonBones 数据均来自 APK 原始资源。
- 不重新设计玩法，不使用此前复刻版 TypeScript 逻辑。
- 不编写 C++ 游戏逻辑；Android 原生包只使用 Creator 2.4.3 自带运行时。
- 构建时只启用 ARM32 与 ARM64。
