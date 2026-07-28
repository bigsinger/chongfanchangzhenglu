# 1.1.2 Spine、交互与镜头专项回归

日期：2026-07-28  
引擎：Cocos Creator 2.4.15  
测试设备：雷电模拟器 `emulator-5554`，横屏截图 1920×1080  
包名：`com.game.longmarch.creator243`

## 1. 范围与结论

本轮不是逐个修补单一场景，而是横向检查了所有 Spine 图集、动态附件入口、36 个剧情镜头
事件、交互距离/气泡投影以及七张发布地图。

结果：

- 开场 Spine 动画可完整播放并自然进入主菜单，不再用 6 秒看门狗提前截断；
- 7 个曾被缩放的图集已恢复附件原始尺寸和偏移，片头、红军/国民党 NPC 与章节过渡共用
  同一套完整性门禁；
- 空桶在待机、行走中间帧和停步后均持续显示；
- 兑换员隔着队伍和桌子时，角色靠近到 520 单位范围即可出现操作按钮并打开答题面板；
- 同图前后景门切到 1.6× 镜头并继续移动后，角色头、脚和道路保持完整可见；
- 七地图轮转 2 分钟、9 个周期通过，含 Home/恢复、内存记录和错误日志检查；
- 位置音效不再每 200ms 重复写同一个音量和日志。

## 2. 根因与通用修复

| 类别 | 根因 | 通用修复 |
|---|---|---|
| 片头、NPC、过渡角色碎裂 | 纹理优化脚本把 PNG、`size/xy/split/pad` 缩小 50%，但漏掉 Spine atlas 的 `orig/offset` | 修复 7 个受影响 atlas，并让优化脚本同步缩放 `orig/offset` |
| 片头不完整 | 片头骨骼曾被停用，且 6 秒看门狗会截断完整动画 | 恢复 `await` Spine 动画和完成监听；看门狗改为 65 秒且结束入口幂等 |
| 水桶等持有物消失 | `walk_z*` 等 Spine 时间线会把 `before/centre/after` 设为空，切换动画后旧运行时保留空附件 | 每次动作切换和完成时重新应用重物附件；所有身体、手、头和 DragonBones 插槽改为安全访问 |
| 兑换员够不到 | 操作距离 460 小于导航扫描 520，且队伍/桌子会阻止角色继续靠近 | 操作距离统一为 520；主线 NPC 优先于可选收藏目标 |
| 点中可见气泡却无效 | 世界气泡投影到屏幕后又除了一次 view scale | 去除二次缩放，直接使用摄像机投影矩形 |
| 门后只见上半场景 | 固定 `hero.y + 275` 与剧情镜头残留偏移在高缩放下把角色和道路推到下缘 | 所有镜头恢复统一使用缩放感知目标；纵向偏移限制为 `min(120, halfView / zoom × 0.28)`；自由输入清除剧情偏移 |
| 缩放边界错误 | 初始镜头在应用目标 zoom 前按旧 zoom 夹取位置 | 先设置初始 zoom，再计算横纵边界 |
| 环境音更新开销 | 每 200ms 重复设置相同的量化音量并打印日志 | 仅在有效音量变化时调用原生音频接口 |

## 3. 自动门禁

```powershell
npm test
node tools/restore-original-resources.js --verify
node tools/apply-runtime-fixes.js --verify
.\tools\build-android.ps1 -IncrementalGenerate -IncrementalNative
```

关键结果：

- 71 个脚本语法通过；
- 12 个场景、1218 个事件、802 条跳转，0 错误；
- 7 张发布地图、13 件收藏、10 条史实、6 道答题完整；
- 60 个 Spine atlas、69 个页面、1042 个附件完整；
- 7 个修复图集通过 SHA-256 精确基准；
- Android lint、arm64-v8a 与 armeabi-v7a 构建通过。

图集门禁由 `tools/verify-spine-atlas-integrity.js` 执行。它同时检查页面实际尺寸、区域边界、
`size/xy/orig/offset` 完整性以及修复图集哈希，防止再次只缩纹理而破坏骨骼附件几何。

## 4. 模拟器复测路径

截图一律使用 ADB 获取，再由 `analyze-screenshot.py` 在本地生成 960×540 预览和 OCR。
ADB 输入必须按原始 1920×1080 截图坐标操作，不能直接使用压缩预览坐标。

### 4.1 开场

1. 覆盖安装并保留数据；
2. 删除仅用于测试的 `codex_direct_scene`；
3. 启动后不点击跳过；
4. 检查动画帧中的地形、人物、标题、字幕和进度条；
5. 确认动画自然进入主菜单。

证据前缀：`feedback-opening-*`。

### 4.2 兑换员

使用已完成前置物资分发、尚未操作兑换员的构造状态：

1. 角色位于队伍障碍物外侧；
2. 点击兑换员附近道路；
3. 确认目标为“操作【兑换员】”；
4. 在约 520 单位内确认右下操作按钮出现；
5. 点击后确认“包里面有几枚二角硬币”答题面板打开。

证据：`feedback-exchange-synthetic-ready`、`feedback-exchange-near-blocker`、
`feedback-exchange-dialog-opened`。

### 4.3 持桶

在第一章开放道路构造 `prop20`：

1. 待机检查桶完整；
2. 点击远处道路并在行走中间帧截图；
3. 停步后再次检查；
4. 日志不得出现 `Spine attachment missing`。

证据：`feedback-bucket-road-idle-fixed`、`feedback-bucket-road-walk-mid-fixed`。

### 4.4 前后景门与镜头

在 `scenes_d1_1` 的门入口前构造合法前置状态：

1. 点击门图标的非重叠区域；
2. 日志确认交互命中、进入和解除强制等待；
3. 等待 1.6× 镜头完成；
4. 再点击道路移动；
5. 确认角色全身、脚下道路和交互区域仍在画面中。

证据：`feedback-camera-v112-door-entered`、`feedback-camera-v112-door-follow`。

### 4.5 七地图稳定性

```powershell
.\tests\manual\android-game\game-test.ps1 stability `
  -Name feedback-v112-sevenmaps -Minutes 2 -WaitSeconds 3
```

发布清单的七张地图全部被轮转覆盖，共完成 9 个周期；测试脚本自动保存并恢复测试前检查点。

## 5. APK

```text
versionName: 1.1.2
versionCode: 2026072801
APK: dist/chongfanchangzhenglu-armv7-arm64-debug.apk
SHA-256: B90E713B39AF8704F01F454DFEB11A82ED4FA8D07928B89426B91D20F82A0527
ABI: arm64-v8a, armeabi-v7a
minSdk/targetSdk: 21/36
permissions: 0
```

模拟器已用 `adb install -r -d` 覆盖安装并核对版本。真实 ARM64 手机仍需按玩家路径做最终发布
门禁，重点复核不同屏幕比例、外放音量和厂商后台恢复行为。
