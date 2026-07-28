# 1.1.3 真机/模拟器开场、交互与镜头专项回归

日期：2026-07-28  
引擎：Cocos Creator 2.4.15  
测试设备：

- 真机 `CEYXGMZXBM79SS8L`：Xiaomi 25060RK16C、Android 16、Mali-G925、
  物理 1280×2772、游戏横屏 2772×1280；
- 雷电模拟器 `emulator-5554`：横屏 1760×792。

包名：`com.game.longmarch.creator243`

## 1. 范围与结论

本轮不是逐个修补单一场景，而是横向检查了所有 Spine 图集、动态附件入口、36 个剧情镜头
事件、交互距离/气泡投影以及七张发布地图。

本报告取代同文件早先的 1.1.2 结论。恢复原分辨率图集只解决了被错误缩放的附件数据，
并不能让旧五页 Spine 片头在 Creator 2.4.15 原生渲染器上稳定播放；真机复测发现中后段仍会
产生黑块与碎片，模拟器完整录屏也复现了同样问题。

最终结果：

- 原生开场不再提交不兼容的旧 Spine 网格，改用完整横屏历史底图、标题、原配乐、原字幕
  和 52 秒时序；6 秒、20 秒、后段及自动进主菜单检查均无黑块，首次启动也可跳过；
- 9 组曾被破坏的 Spine/DragonBones 图集恢复原始分辨率并纳入哈希门禁，保证 NPC、持有物
  和章节过渡附件不再因破坏性纹理缩放而错位；
- 空桶在待机、行走中间帧和停步后持续显示；未使用的 `before/centre/after`、
  `body_prop/hand_prop` 槽位会清空，不再尝试加载不存在的 `centre0/prop0`；
- 兑换员前的旧档隐形阻挡自动迁移到 `x=710`、宽 30；普通操作距离为 650，当前任务 NPC
  为 1000；点击 NPC 身体或扩大的右下按钮均在模拟器实测打开答题面板；
- 同图前后景门切到 1.6× 镜头并继续移动后，角色头、脚和道路保持完整可见；
- 七地图轮转 2 分钟、9 个周期通过，含 Home/恢复、内存记录和错误日志检查；
- 位置音效不再每 200ms 重复写同一个音量和日志。

## 2. 根因与通用修复

| 类别 | 根因 | 通用修复 |
|---|---|---|
| NPC、持有物、过渡角色碎裂 | 纹理优化脚本把 PNG、`size/xy/split/pad` 缩小 50%，但遗漏 `orig/offset`，且部分超大原图无法安全缩放 | 恢复 9 组原始资源；优化脚本改为只验证、不再破坏性缩放骨骼图集 |
| 原生片头中后段碎裂 | 旧五页 Spine 大网格在 Creator 2.4.15 原生渲染器上仍会产生错误几何，真机与模拟器均可复现 | 原生平台关闭该 Spine renderer，保留历史底图、标题、原配乐、原字幕、跳过和完整 52 秒叙事时序；Web/编辑器仍可保留原动画 |
| 水桶等持有物消失/告警 | `walk_z*` 时间线会清空附件，且旧逻辑为未使用槽位强行加载 `centre0/prop0` | 每次动作切换重挂实际附件；未声明或编号为 0 的槽位调用 `setAttachment(null)` |
| 兑换员够不到 | 队伍末端的隐藏阻挡过宽，NPC 身体不是直接触摸目标，520 距离在宽屏和旧档位置下仍不够宽容 | 旧档迁移阻挡到 `x=710/width=30`；普通/当前任务距离提高到 650/1000；NPC 身体和操作按钮都扩大命中区 |
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
- 9 个修复图集通过 SHA-256 精确基准；
- Android lint、arm64-v8a 与 armeabi-v7a 构建通过。

图集门禁由 `tools/verify-spine-atlas-integrity.js` 执行。它同时检查页面实际尺寸、区域边界、
`size/xy/orig/offset` 完整性以及修复图集哈希，防止再次只缩纹理而破坏骨骼附件几何。

## 4. 模拟器复测路径

截图一律使用 ADB 获取，再由 `analyze-screenshot.py` 在本地生成压缩预览和 OCR。
ADB 输入必须按当前设备原始截图坐标操作，不能直接使用压缩预览坐标。本轮真机游戏画面为
2772×1280，模拟器为 1760×792。

### 4.1 开场

1. 覆盖安装并保留数据；
2. 删除仅用于测试的 `codex_direct_scene`；
3. 启动后先不点击跳过；
4. 在 6 秒、20 秒和后段分别检查横屏历史底图、标题、字幕和进度；
5. 确认没有黑块、骨骼附件散落或画面越界，并能自然进入主菜单；
6. 重新启动后点击“跳过”，确认首次运行也能立即进入主菜单。

证据：`v113-stable-opening-06s.preview.jpg`、
`v113-stable-opening-20s.preview.jpg`、`v113-stable-opening-38s.preview.jpg`。

### 4.2 兑换员

使用已完成前置物资分发、尚未操作兑换员的构造状态：

1. 查询存档，确认旧阻挡已经迁移为 `x=710/width=30`；
2. 将角色放在 `x=560,y=-210`，与兑换员相距约 203；
3. 确认目标为“操作【兑换员】”，右下操作按钮出现；
4. 点击操作按钮，确认“包里面有几枚二角硬币”答题面板打开；
5. 恢复同一检查点，直接点击兑换员身体，再次确认答题面板打开；
6. 从更远位置点击道路，确认角色能越过旧阻挡终点并触发前置小偷剧情。

普通交互扫描半径为 650；当前任务目标为 1000。最终 APK 证据：
`final-exchange-after-dialog.preview.jpg`、`final-exchange-button-open.png`、
`final-exchange-npc-ready3.png`、`final-exchange-npc-open.png`；道路推进证据为
`sim-d3-walked-to-exchange.preview.jpg`。

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
versionName: 1.1.3
versionCode: 2026072802
APK: dist/chongfanchangzhenglu-armv7-arm64-debug.apk
SHA-256: 5A1034C15C2916A68ED7EC294AEF153CDFC8B813365BB243736A30F6C80B19CB
ABI: arm64-v8a, armeabi-v7a
minSdk/targetSdk: 21/36
permissions: 0
```

最终 APK 已用 `adb install -r -d` 覆盖安装到模拟器，并完成开场和兑换员双路径验证。真机在
拔线前安装的较早 1.1.3 构建暴露了兑换员仍不易命中的问题；上面的阻挡迁移、650/1000
距离和 NPC 身体点击是此后加入的最终修复，因此必须重新安装本节 SHA-256 对应的 APK
才能生效。下一轮真机发布门禁仍应重点复核不同屏幕比例、外放音量和厂商后台恢复行为。

## 6. 真机与模拟器差异及最佳实践

- 模拟器的 `adb shell input` 通常可用；部分 Xiaomi/HyperOS 真机若未启用“USB 调试
  （安全设置）”会拒绝该命令。脚本会改用系统授权的 Monkey raw-event 精确回放。
- 横屏截图坐标不能直接当作真机面板坐标。旋转为 1 时，本轮设备使用
  `monkeyX=screenY`、`monkeyY=physicalHeight-screenX`；脚本会读取物理尺寸和旋转后转换。
- Android 16 真机可能没有系统 `sqlite3`。电脑端桥接会在停止游戏后导出主数据库和 WAL，
  不复制瞬态 SHM；写回使用 `adb push` 后由 `run-as cp` 原样复制，避免二进制管道截断。
- 每次构造状态前先保存应用私有数据库检查点，结束后恢复；直接跳关时同时删除旧 v2
  原子快照，避免启动时用旧快照覆盖测试状态。
- Mali 真机与模拟器的原生 Spine 网格表现可能不同。模拟器通过不能推翻真机失败，原生
  片头因两端均复现碎裂而采用稳定展示方案。
- 截图只通过 ADB 获取，先在本地压缩和 OCR；日志按应用 PID 过滤，避免把系统
  `AssetManager` 噪声误判成游戏错误。
