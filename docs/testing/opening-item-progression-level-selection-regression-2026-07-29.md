# 1.1.4 动态片头、道具回收、章节出口与关卡任选回归

日期：2026-07-29
引擎：Cocos Creator 2.4.15
设备：雷电模拟器 `emulator-5554`，横屏 1760×792
包名：`com.game.longmarch.creator243`

## 结论

本轮四项反馈全部通过 Android 原生运行验证：

- 恢复 APK 原版 `dengluCG` 五页 Spine 动态片头，不再在原生平台强制切换静态文字版；
- 任务物品交付后同时清理运行时附件和持久化 `heroItem`，重物姿势恢复待机；
- 第二章结算能进入第三章路线演出，点击继续后实际进入 `scenes_d3_1`；
- 主菜单“章节”可拖动并任选三章七张已发布地图，已实测最后一张 `3-3` 进入成功。

## 修复要点

### 原版动态片头

旧实现把所有 Android 设备都设为稳定静态片头，导致动画完全消失。现在仅当
`dengluCG.skeletonData` 真正缺失时才回退到静态叙事；正常资源走原版 Spine 动画、原字幕、
原配乐和跳过流程，同时保留 65 秒幂等看门狗。

ADB 压缩预览 `opening-animated-06s.preview.jpg` 显示瑞金路线、行军人物和
“1933年9月”字幕；后续 `opening-animated-20s.preview.jpg`/主菜单检查证明片头可正常结束。
所有截图均由 ADB 获取，仅在本地压缩和 OCR。

### 任务道具

首次修复虽然把角色逻辑中的 `goods` 设为空，但 `switchLoad(false)` 仍尝试挂载不存在的
`before0`，旧箱子附件因此留在画面；LocalStorage 中的 `heroItem` 也可能让它在重进后恢复。

现在卸载重物时直接清空 `before/centre/after` 三个槽位，并在交付回调中删除持久化
`heroItem`、请求原子进度保存。使用 `prop25` 完整执行“小学堂拿物资箱 → 跨图到医疗点 →
交给赵亦涵医生”：

- 交付前：`task-item-v114-ready-to-deliver.preview.jpg`，角色持箱；
- 交付后：`task-item-v114-delivered-cleared.preview.jpg`，角色双手和身体前方无箱子；
- SQLite 查询不再返回 `heroItem`；
- 日志包含 `delivered task item and cleared carry state: prop25`，没有 `before0` 缺失告警。

### 第二章出口

测试工具新增 `chapter2exit`，从第二章最终事件构造最小合法检查点，不重跑前置剧情：

```powershell
.\tests\manual\android-game\game-test.ps1 chapter2exit `
  -Serial emulator-5554 `
  -Adb D:\Android\platform-tools\adb.exe `
  -WaitSeconds 7
```

出口触发后先持久化目标 `chapter=3 / mapIndex=1`，再加载章节场景；预加载回调和章节 Spine
完成回调均有幂等超时兜底。`chapter2-exit-transition-v114.preview.jpg` 显示第二章到第三章
路线演出，点击“任意位置继续”后
`chapter3-gameplay-after-chapter2.preview.jpg` 显示第三章人物、道路和任务条均可操作。

### 七关任选

关卡卡片不再把历史 11 节误当成 11 个章节，而是映射实际发布清单：

`1-1`、`1-2`、`2-1`、`2-2`、`3-1`、`3-2`、`3-3`。

升级后发现旧预制体的 `ScrollView.content` 在 2.4.15 JSB 中可能为空，首次触摸会抛
`getContentSize of undefined`。控制器启动时现会显式绑定内容节点。实测路线图能拖到末端，
选择 `3-3 小学堂兑换点` 后，确认框、章节过渡、地图加载和存档值全部正确。证据：

- `selector-late-levels-repaired.preview.jpg`
- `selector-chapter3-map3-selected.preview.jpg`
- `selector-map3-confirm-dialog.preview.jpg`
- `selector-chapter3-map3-gameplay.preview.jpg`

## 自动门禁与发布要求

`npm test` 通过：71 个脚本、163 个相对依赖、12 场景/1218 事件/802 跳转、七张地图、
60 个 Spine atlas/69 个页面/1042 个附件，配置错误为 0。Android Debug 构建、lint、
arm64-v8a 与 armeabi-v7a 均通过。

最终交付版本为 `1.1.4 (2026072901)` 的不可调试 Release APK；APK 不纳入 Git，也不计算
交付哈希。
