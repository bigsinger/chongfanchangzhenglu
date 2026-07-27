# Android 通关回归工具

这组脚本通过 ADB 控制雷电模拟器，不会抢占桌面鼠标和键盘。截图与日志保存在
`tests/manual/results/`，游戏检查点保存在应用私有目录
`files/checkpoints/`，重新安装 `-r` 构建后仍可恢复。

## 常用命令

```powershell
# 启动并抓取当前状态
.\tests\manual\android-game\game-test.ps1 smoke

# 保存/恢复关卡内部的完整状态
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d1_1_ruins
.\tests\manual\android-game\game-test.ps1 restore -Name d1_1_ruins
.\tests\manual\android-game\game-test.ps1 direct -Name d1_1_ruins

# 跳到指定大章/地图的初始状态
.\tests\manual\android-game\game-test.ps1 jump -Chapter 2 -Map 1

# 保留当前任务状态，只重定位角色后直接进入游戏
.\tests\manual\android-game\game-test.ps1 relocate -Chapter 3 -Map 2 -X 4249 -Y -291

# ADB 输入与取证
.\tests\manual\android-game\game-test.ps1 tap -X 1600 -Y 900
.\tests\manual\android-game\game-test.ps1 swipe -X 1400 -Y 800 -X2 600 -Y2 800 -DurationMs 800
.\tests\manual\android-game\game-test.ps1 screenshot -Name d1_1_after_move
.\tests\manual\android-game\game-test.ps1 inspect -Name d1_1_after_move
.\tests\manual\android-game\game-test.ps1 logs -Name d1_1_after_move

# 轮换全部七张已发布地图执行后台/恢复/日志/内存稳定性检查
.\tests\manual\android-game\game-test.ps1 stability -Name seven-map -Minutes 10
```

`inspect` 会先在本机生成压缩预览并执行 OCR，原始 ADB 截图不会上传。

## 通关范围

| 大章 | 地图资源 | 状态 |
|---|---|---|
| 1 | `scenes_d1_1`、`scenes_d1_2` | 已通关 |
| 2 | `scenes_d2_1`、`scenes_d2_2` | 已通关 |
| 3 | `scenes_d3_1`、`scenes_d3_2`、`scenes_d3_3` | 已通关并验证终局返回 |

每个关键交互点保存一个检查点；修复重装后恢复最近检查点继续，不从片头重跑。
当前版本只有三大章；第三章结束后原作明确提示后续关卡仍在开发。

完整的章节检查点、异常恢复、发布门禁和缺陷记录流程见
[`../../docs/testing/full-playthrough-test-process.md`](../../docs/testing/full-playthrough-test-process.md)。
