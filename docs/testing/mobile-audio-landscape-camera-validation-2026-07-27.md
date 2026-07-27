# 1.1.1 手机音频、横屏与镜头专项验证

日期：2026-07-27

工程：`F:\bigsinger\chongfanchangzhenglu`

包名：`com.game.longmarch.creator243`

引擎：Cocos Creator / Cocos2d-x 2.4.15（原包 2.4.3）

## 1. 本轮结论

本轮反馈涉及的行走音、失效 BGM/音效、手机横屏布局、前后景门后的镜头位置，以及代码和
资源命名均已修复并纳入回归门禁。最终调试包完成双 ARM ABI 构建、覆盖安装、16:9 与
20:9 开场检查、七图稳定性循环、原生音频解码验证和存档恢复。

最终 APK：

```text
dist\chongfanchangzhenglu-armv7-arm64-debug.apk
versionName 1.1.1
versionCode 2026072704
minSdk 21
targetSdk 36
ABI arm64-v8a, armeabi-v7a
SHA-256 FC3BF1BF732DD8776376025E433E44EA8CDB9CCD9047B05D8E1C479AB220AC92
```

APK 是本地构建产物，不提交 Git。

## 2. 缺陷、原因与处理

| 反馈 | 根因 | 处理 |
|---|---|---|
| 角色走路没有声音 | 手动移动和脚本移动都没有管理脚步循环 | 走/跑分别使用 `footsteps-walk`、`footsteps-run`，移动开始播放、停步/禁用/销毁时停止 |
| BGM/动作音效失效 | 旧 `sound.json` 使用不存在的名称，Spine 事件又额外拼了不存在的 `action/` 目录 | 新增统一 `AudioCatalog`，把旧键路由到真实 MP3；修正 Spine 事件和章节 BGM |
| 某些音效很小或后续无声 | 一个全局位置音量泄漏到后续所有音效 | 每个音效独立保存基础音量，不再共享一次性状态 |
| 调整“语音”后脚步也变小 | 旧设置页把语音滑块写入全局 effects 总线 | effects 总线保持中性；脚步/动作音量按“自身基础音量 × 玩家音效音量”计算 |
| 手机开场和启动布局紊乱 | 多种 Canvas 设计尺寸混用；旧 2.4.3 Spine 片头附件在 2.4.15 原生宽屏下变换错位 | 所有主场景统一 fixed-height 横屏适配；停用不兼容骨骼，保留插画、标题、字幕、进度、音乐和跳过流程 |
| 门后只显示上半场景 | 同图传送只移动主角，没有把摄像机从旧前/后景重置 | 淡出移动后立即以主角位置恢复摄像机、重新对齐层并恢复跟随 |
| 缩放镜头边缘异常 | 边界按固定尺寸和 `sqrt(zoom)` 估算 | 按实际可视尺寸和 `halfView / zoom` 计算横纵边界 |
| Android 方向不稳定 | 生成工程使用 `sensorLandscape` | 生成和现代化脚本统一写入 `android:screenOrientation="landscape"` |

## 3. 静态门禁

`npm test` 结果：

- 71 个 JavaScript 脚本和全部游戏配置语法通过；
- 163 个相对 `require` 均存在且大小写精确；
- 12 个配置场景、1218 个事件、802 条跳转，0 错误；
- 440 条历史不可达分支与冻结基线完全一致，没有新增警告；
- 7 张发布地图、13 件收藏、10 条史实、6 道答题完整；
- 移动、拾取、投递、弹窗、切图、恢复、坏档回退合同通过；
- 音频路由、脚步混音、同图镜头重置和横屏适配合同通过；
- 869 张 PNG、68 个骨骼图集页面通过纹理预算。

命名门禁：

```text
Naming verification: 55 scripts, 1179 resources, 3 bundles.
```

历史配置仍可使用旧资源键，运行时由 `AssetCatalog` 解析到可读路径；Cocos `.meta` UUID、
场景/事件 ID、骨骼动作名和存档键保持不变。音频文件和目录已进一步物理改名为
`main-menu-theme`、`opening-theme`、`gameplay/main-theme`、`chapter-transitions`、
`footsteps-*`、`rifle-shot`、`grenade-*` 等职责名称。

## 4. Android 设备回归

### 4.1 横屏与开场

- 1920×1080：插画背景满屏，标题、进度条、历史字幕和跳过按钮完整；
- 2400×1080：同样通过，左右扩展区域无黑边，UI 没有越界；
- 两次日志均无 JavaScript、Native、ANR 或资源加载错误；
- 临时 `wm size` 覆盖在 `finally` 中恢复为物理 1080×1920；
- 最终 Android 清单确认强制 `landscape`。

本地压缩/OCR 证据：

```text
tests\manual\results\v111-final-16x9-startup.preview.jpg
tests\manual\results\v111-final-20x9-startup-rendered.preview.jpg
```

### 4.2 BGM、脚步与音量隔离

Android 原生日志确认：

- `cutscenes/opening-theme` 开始；
- `gameplay/main-theme` 的 UUID
  `e2e01a32-b668-4778-bc57-2b9b036a48c0` 被 `AudioPlayerProvider` 打开；
- 点击道路后跑步脚步 UUID
  `a7afae1c-0e39-4e0a-ac3a-92dd1bf9dc44` 被解码、重采样、播放，并在角色停下时停止；
- 构造 `MUSIC_VOICE=0`、`MUSIC_SOUND=1` 后重复移动，脚步仍正常播放，证明语音设置不再
  静音脚步与动作音效；
- 运行日志没有 `TypeError`、`ReferenceError`、fatal、ANR 或加载失败。

证据：

```text
tests\manual\results\v111-final-volume-isolation.log
tests\manual\results\v111-final-volume-isolation.preview.jpg
```

### 4.3 七图稳定性与镜头

雷电模拟器执行 2 分钟快速稳定性循环，共完成 9 轮，覆盖全部 7 张发布地图后又复测两图。
每轮包含直达、移动、Home、恢复、前台检查和内存记录。结果无脚本异常、Native 崩溃、
ANR 或资源加载失败。

同图门传送后的摄像机重置和缩放边界同时受自动合同保护；抽查截图中主角、所在层道路、
顶部目标、暂停和右侧操作区都在可视范围内。

证据：

```text
tests\manual\results\v111-final-stability.log
tests\manual\results\v111-final-stability-memory.log
tests\manual\results\v111-final-stability-0.png
tests\manual\results\v111-final-stability-5.png
```

模拟器主 ABI 是 `x86_64`，通过 Native Bridge 运行 ARM 库，因此没有把它误报为真实 ARM64
设备门禁。最终发布仍按完整测试流程在主 ABI 为 `arm64-v8a` 的物理手机执行 30 分钟黑盒
验收。

## 5. 存档恢复

所有跳图、比例和音量构造测试前均保存 SQLite 在线检查点。最终重新恢复
`user-before-audio-camera-fixes`，并确认：

```text
chapter 3
mapIndex 3
unlockchapters 2
heroSpine role_erwa1
current snapshot 91180 bytes
previous snapshot 91194 bytes
current objective 拾取【红星报】
```

恢复后的应用保持前台，截图和日志通过，没有清空、卸载或重置玩家进度。

## 6. 后续使用

- 开发完整通关与检查点流程：
  [`full-playthrough-test-process.md`](full-playthrough-test-process.md)
- 本版本已有完整通关记录：
  [`full-playthrough-validation-2026-07-27.md`](full-playthrough-validation-2026-07-27.md)
- 玩家任务顺序和答题答案：
  [`../guides/player-walkthrough.md`](../guides/player-walkthrough.md)
