# 《重返长征路》完整通关测试流程

版本：2026-07-29（适用 1.2.0）

适用工程：`F:\bigsinger\chongfanchangzhenglu`

适用包名：`com.game.longmarch.creator243`

目标读者：开发、测试、发布负责人

## 1. 文档目标

本流程用于验证当前发布范围内的三章主线、七张可玩地图，以及移动、拾取、投递、小游戏、
答题、收藏、剧情跳过、跨图状态、存档恢复、异常恢复和 Android 发布质量。

一次“完整通关通过”必须满足：

1. 从第一章开始，依次完成三章主线。
2. 七张已发布地图都能加载、移动、交互、跨图和恢复。
3. 第三章结束时出现收藏/史实完成度摘要和“可返回探索”说明，确认后返回主菜单。
4. 全程没有 JavaScript 异常、Native 崩溃、ANR、资源加载失败或无法继续的软锁。
5. 修复后的复测从最近检查点继续，不为了复测一个节点从片头重跑。

## 2. 测试范围与事实基线

### 2.1 已发布地图

| 章节 | 地图 | 资源键 | 主线重点 |
|---|---|---|---|
| 第一章 | 村庄主路 | `scenes_d1_1` | 救出二虎、找食物、烤红薯、取水、清除障碍 |
| 第一章 | 取水支路 | `scenes_d1_2` | 拾取空水桶、返回主路、沿途收藏 |
| 第二章 | 战场主路 | `scenes_d2_1` | 救助昏迷战士、战场演出、跟随队伍撤离 |
| 第二章 | 村屋水源 | `scenes_d2_2` | 老农答题、柴刀、竹筒、取水 |
| 第三章 | 白石渡主路 | `scenes_d3_1` | 蓝布包任务、参军换装、申请物资、最终结算 |
| 第三章 | 医疗点 | `scenes_d3_2` | 两轮共九次物资分发、送错提示、补给箱交付 |
| 第三章 | 小学堂兑换点 | `scenes_d3_3` | 揭露小偷、线索答题、领取物资箱、拾取红星报 |

`czconfig.json` 中还保留 `scenes_d1_3`、`scenes_d2_3`、`scenes_d3_4`、
`scenes_d3_5` 等历史编辑数据，但当前工程没有与它们一一对应的已发布地图预制体。它们
不能计入玩家可玩地图，也不能代替七张地图的发布回归。

### 2.2 必测交互合同

| 类别 | 必测结果 |
|---|---|
| 移动 | 点击道路、`A`/`D`、左右方向键有效；梯子上的 `W`/`S` 或上下方向键有效 |
| 音频 | 主菜单、片头、章节和游戏 BGM 连续；走/跑脚步声随移动启停；动作、武器、取水、UI 音效可辨认 |
| 横屏 | Android 强制横屏；16:9、20:9/21:9 下片头、主菜单、章节卡和游戏 HUD 不裁切、不重叠 |
| 镜头 | 人物处于地图边缘时，镜头仍显示可行动道路和必要交互，不把人物长期卡在画面边缘 |
| 交互 | 角色与目标碰撞接触后，右下操作按钮显示正确动作和目标；远处点击只移动、不执行任务；世界气泡可点击 |
| 拾取 | 物品被拾取、携带状态更新、任务追踪更新并自动保存 |
| 投递 | 正确物品推进任务并清空携带；错误物品不消耗，并说明“需要什么、当前拿着什么” |
| 弹窗 | 任务卡、物品卡、对白、答题和暂停弹窗不遮住关闭入口；弹窗打开时不得穿透移动 |
| 剧情 | 对白可加速；CG 可跳过；跳过后必须执行原完成回调，任务链不能中断 |
| 跨图 | 携带物、跟随角色、已完成事件和主角位置按设计保留 |
| 恢复 | 交互后后台、杀进程或覆盖安装，重新进入仍从最近有效状态继续 |
| 结算 | 收藏/史实摘要数据真实；终局确认后回主菜单，永久解锁和收藏不丢失 |

## 3. 环境准备

### 3.1 固定工具

- Cocos Creator：`E:\temp\CocosCreator-2.4.15\CocosCreator.exe`
- ADB：`D:\Android\Sdk\platform-tools\adb.exe`
- 默认设备：`emulator-5554`
- 调试 APK：`dist\chongfanchangzhenglu-arm64-debug.apk`
- ADB 工具：`tests\manual\android-game\game-test.ps1`
- 截图分析：`tests\manual\android-game\analyze-screenshot.py`
- 测试输出：`tests\manual\results\`

以下命令都从工程根目录执行。

```powershell
Set-Location F:\bigsinger\chongfanchangzhenglu
& D:\Android\Sdk\platform-tools\adb.exe devices
.\tests\manual\android-game\game-test.ps1 state
```

预期设备状态为 `device`，当前焦点或启动后的焦点包含
`com.game.longmarch.creator243`。

### 3.2 测试前门禁

```powershell
git status --short
npm test
node .\tools\restore-original-resources.js --verify
node .\tools\verify-android-branding.js
.\tools\build-android.ps1 -IncrementalGenerate
```

构建后用 `aapt dump badging` 确认 `native-code` 只包含 `arm64-v8a`，四档
`application-icon` 都指向 `ic_launcher.png`，且没有 `uses-permission`。图标门禁会把
源码和生成工程的四档 PNG 与原 APK 基准逐字节比较。

`npm test` 应同时通过：

- JavaScript 与 JSON 语法；
- 配置引用图；
- 七张地图、13 件收藏、10 条史实和 6 道答题的发布内容完整性；
- 移动、拾取、投递、弹窗、切图、存档与坏档恢复合同；
- 可读命名兼容；
- 2048×2048 纹理预算。

配置校验中的历史不可达分支是警告；新增断链、缺失引用和无效出口属于错误，不能放行。

### 3.3 保留当前用户进度

任何跳章、坏档或稳定性测试前，先保存当前数据库检查点：

```powershell
.\tests\manual\android-game\game-test.ps1 checkpoint -Name user-before-playthrough
```

检查点使用 SQLite 在线备份，包含 WAL 中尚未合并的数据，保存在应用私有目录
`files/checkpoints/`。使用 `adb install -r` 覆盖安装时仍可保留，但卸载应用会清除。

不要对用户正在使用的包执行 `pm clear`。需要验证“全新安装”时，应使用克隆模拟器、独立
测试设备或不同 applicationId 的测试包；当前用户包只做可恢复的检查点、覆盖安装和跳图。

### 3.4 调试包与正式包的职责

`game-test.ps1` 的检查点、直达、重定位、状态构造和坏档测试依赖 Android `run-as`，只适合
可调试测试包。测试分两层：

1. 可调试发布候选：完成白盒通关、七图直达、检查点续跑、坏档、状态构造和自动稳定性。
2. 最终签名 release：不使用 `run-as` 修改数据，按玩家正常入口完成升级安装、启动、
   移动、关键交互、前后台、终局和签名/ABI 黑盒验收。

正式包不是因为“白盒测试包已通过”就自动放行，至少要使用完全相同的 JavaScript、资源和
原生工程输入再做一次黑盒主线验收。

## 4. 高效率测试策略

### 4.1 三种进入方式

| 目的 | 命令 | 是否保留节点内进度 |
|---|---|---|
| 从地图初始状态检查 | `jump -Chapter n -Map n` | 否，会清理当轮临时状态 |
| 从已保存节点继续 | `direct -Name checkpoint` | 是，推荐修复后复测 |
| 只调整人物位置 | `relocate -Chapter n -Map n -X x -Y y` | 是，要求该地图已有存档 |
| 验证第二章结算出口 | `chapter2exit -WaitSeconds 7` | 否，构造最小合法出口状态 |

示例：

```powershell
.\tests\manual\android-game\game-test.ps1 jump -Chapter 3 -Map 2
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d3-2-before-silver
.\tests\manual\android-game\game-test.ps1 direct -Name d3-2-before-silver
.\tests\manual\android-game\game-test.ps1 relocate -Chapter 3 -Map 2 -X 4249 -Y -291
.\tests\manual\android-game\game-test.ps1 chapter2exit -WaitSeconds 7
```

使用原则：

1. `jump` 用于地图加载、初始布局和独立交互冒烟，不代表完整剧情前置条件已满足。
2. 主线节点复测优先使用 `direct`，因为它会恢复事件、物品、跨图、角色、章节和快照状态。
3. 人物被旧存档留在超远边缘时，先保存原检查点，再用 `relocate` 把人物移回目标附近。
4. 不直接手工拼接零散 LocalStorage 键；构造状态时使用脚本的事务写入和完整检查点。
5. `chapter2exit` 只替换第二章最终事件为可碰撞的等价出口，用于验证
   `2_3 → transitionScene → scenes_d3_1`；看到“点击任意位置继续”后必须点击并确认第三章
   实际可操作，不能只检查章节键已经变化。

### 4.2 玩家可见的七关任选入口

主菜单左侧“章节”现在列出七张已发布地图。拖动路线图可看到后半段卡片，点击卡片后右侧
必须显示准确的“第 N 章·第 M 关”和地图名，再点击“进入关卡”确认。至少回归：

1. 第一张 `1-1 村庄主路`；
2. 中间的 `2-2 村屋水源`；
3. 最后一张 `3-3 小学堂兑换点`；
4. 每次确认后经过章节过渡，最终存档章节/地图与所选卡片一致；
5. 章节面板首次触摸不得出现 `ScrollView.content` 空引用。

### 4.3 检查点命名

建议格式：

```text
d<章>-<图>-<before|after>-<节点>-<序号>
```

示例：

- `d1-1-before-rescue`
- `d1-1-before-potato`
- `d2-2-before-history-quiz`
- `d3-3-before-bag-quiz`
- `d3-2-after-first-distribution`
- `d3-2-before-silver`
- `d3-1-before-ending`

每完成一个高风险交互，就保存 `after` 检查点。修复代码、重装 APK 后，从最近的
`before` 检查点继续。

### 4.4 ADB 输入与无干扰取证

只通过 ADB 操作模拟器，不使用桌面鼠标，不抢占用户当前窗口。

```powershell
.\tests\manual\android-game\game-test.ps1 tap -X 1600 -Y 900
.\tests\manual\android-game\game-test.ps1 swipe `
  -X 1400 -Y 800 -X2 600 -Y2 800 -DurationMs 800
```

坐标必须以当前 ADB 截图分辨率为准。道路点击应避开顶部任务条、对白卡片、右下操作按钮
和系统导航区。

需要观察画面时优先执行：

```powershell
.\tests\manual\android-game\game-test.ps1 inspect -Name d2-2-before-water
```

`inspect` 的顺序是：

1. ADB `screencap`；
2. 拉取原图到本地；
3. 本地生成压缩预览；
4. 本地 OCR；
5. 仅在 OCR 无法判断布局时查看压缩预览。

不要直接上传原始截图。

## 5. 完整通关执行流程

### 5.1 阶段 A：安装与冒烟

```powershell
& D:\Android\Sdk\platform-tools\adb.exe -s emulator-5554 install -r -t `
  .\dist\chongfanchangzhenglu-armv7-arm64-debug.apk
.\tests\manual\android-game\game-test.ps1 smoke -Name install-smoke
```

检查：

- 应用前台启动；
- 主菜单、继续游戏或当前地图不黑屏；
- 任务条、对白卡、右下操作区完整；
- 日志没有脚本、Native、ANR 或加载错误；
- `longmarch_save_v2_current` 和 `previous` 至少有一个有效快照。

需要从主线初始状态执行时，先保存用户现场，再使用：

```powershell
.\tests\manual\android-game\game-test.ps1 jump -Chapter 1 -Map 1
```

这会清理当轮临时剧情状态，但保留永久收藏和解锁，适合重复通关回归。全新用户数据必须在
独立测试实例中验证。

### 5.2 阶段 B：第一章

#### 地图 `scenes_d1_1`

1. 验证片头/过场可正常播放并可跳过。
2. 使用点击道路与按键分别移动；持续移动时角色、镜头和场景加载范围同步。
3. 到土墙废墟触发二虎剧情；确认剧情锁定期间不能误操作，结束后立即恢复控制。
4. 拾取铁锹并对废墟使用；确认目标从“找工具”切换到后续任务。
5. 拾取生红薯，第一次点击火堆开始烤制，进入烤红薯小游戏。
6. 指针进入绿色“熟”区后再次点击。分别覆盖生、熟、焦三个结果；首次教学和时机区
   清晰，熟红薯能推进任务。
7. 给二虎食物；投递后携带状态清空并自动保存。
8. 进入 `scenes_d1_2`，拾取空水桶并返回。
9. 使用空桶取水，再对指定火堆/障碍连续泼水三次；相邻两次不得停顿超过 20 秒，否则
   火势会恢复一级。错误物品不得推进任务。
10. 继续到地图出口，确认障碍解除、道路可点击、章节结算能进入下一章。

重点回归：

- 角色从画面边缘开始时仍能看到道路和任务目标；
- 铁锹、红薯、水桶附近的世界气泡不会吞掉整片道路输入；
- 烤红薯卡片不会遮住操作按钮；
- 灭火连续操作能结束事件；等待超过 20 秒时火势恢复提示和动画一致；
- 快速连续点击拾取、投递不会重复结算；
- 四件收藏品可以正常弹卡并关闭。

#### 地图 `scenes_d1_2`

1. 地图从主路进入和返回都成功。
2. 空水桶可拾取，跨图后仍在手中。
3. `红军临时借谷证`收藏可获取，卡片关闭后恢复移动。
4. 地图边缘没有把角色卡出可见区域。

建议检查点：

```powershell
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d1-1-after-rescue
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d1-1-before-potato
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d1-2-before-bucket
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d1-1-before-ending
```

### 5.3 阶段 C：第二章

#### 地图 `scenes_d2_1`

1. 沿枪炮声方向推进，触发二虎和昏迷红军战士剧情。
2. 接到找水任务后，主目标应指向水源路径，不应继续显示上一章目标。
3. 从地图门进入 `scenes_d2_2`，完成答题和取水链。
4. 带装满水的竹筒返回，将水交给红军战士。
5. 跟随战场演出前进；需要玩家操作时按钮可用，自动演出时不会错误接受移动。
6. 验证迫击炮、敌人撤离、队伍冲锋和胜利对白顺序完整。
7. 战斗/演出结束后仍可移动到结算点，进入第三章。

#### 地图 `scenes_d2_2`

1. 与老农对话，完成三题历史问答。
2. 三题正确答案依次为：`1931年11月7日`、`5次`、`中国工农红军`。
3. 每道错题都显示正确答案和解释，只重试当前题，不重置整组。
4. 拾取柴刀，用柴刀砍竹子，拾取空竹筒。
5. 到水源处装水，物品从竹筒变为装满水的竹筒。
6. 返回主路后携带物仍存在，且只能交给正确目标。
7. 验证楼梯/高低层路径和枯树附近输入，不出现人物悬空或无法返回。

重点回归：

- 答题弹窗打开时道路点击不能穿透；
- 解释文字不溢出、关闭按钮始终可见；
- 柴刀、竹筒、装满水的竹筒状态不会重复拾取；
- 从支路返回后镜头正确跟随；
- 四件可达收藏和三条史实能记录。

建议检查点：

```powershell
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d2-1-before-find-water
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d2-2-before-history-quiz
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d2-2-after-filled-bamboo
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d2-1-before-battle-finale
```

### 5.4 阶段 D：第三章

#### 第一段：蓝布包

1. 在 `scenes_d3_1` 推进到哭泣大妈，记录蓝布包线索：
   - 四枚二角硬币；
   - 一张五元苏币；
   - 三张一元苏币。
2. 经 `scenes_d3_2` 到 `scenes_d3_3`，与小偷和兑换员交互。到兑换员前先确认旧档阻挡
   已迁移到 `x=710/width=30`，角色可以移动到柜台旁；分别用右下操作按钮和直接点击
   兑换员身体打开答题面板。
3. 三题答案依次为：`四枚`、`一张`、`三张`。
4. 故意错一题，确认只重试当前题；再答对并完成揭露小偷剧情。
5. 在小学堂主线路径拾取`红星报`，确认第三节五件收藏全部具有可达入口。
6. 返回 `scenes_d3_1`，确认大妈、二虎和王守仓后续对白解锁。
7. 完成参军换装；跨图后角色保持新服装。

#### 第二段：医疗点第一轮

1. 在 `scenes_d3_2` 与赵亦涵医生对话。
2. 按任务目标完成四次分发：
   - 中药药包 1 次；
   - 西药药瓶 1 次；
   - 绷带 2 次。
3. 每次从箱区取一件，只能交给当前需要它的人。
4. 故意拿错一次，确认物品不消失，提示同时包含所需物品和当前携带物。
5. 进度从 `0/4` 到 `4/4`，完成后返回 `scenes_d3_1`。

#### 第三段：补给和医疗点第二轮

1. 在 `scenes_d3_1` 与政委对话，取得追加物资任务。
2. 到 `scenes_d3_3` 拾取物资箱，跨图返回医疗点。
3. 把物资箱交给赵医生；交付后第二轮箱区和患者状态出现。
4. 完成五次分发：
   - 衣物 2 次；
   - 银元 1 次；
   - 西药药瓶 2 次。
5. 特别验证银元：
   - 拿错误物品交付时不消耗；
   - 拿银元交付时清空手持、推进对应分支并自动保存。
6. 进度达到 `5/5`，完成医生结尾对白。
7. 返回 `scenes_d3_1` 与王守仓交互，触发最终结算。
8. 确认摘要显示本节收藏/史实完成度，并说明可以返回第三节队伍驻地继续探索。
9. 点击“确定”后返回主菜单；收藏、史实和章节解锁仍然保留。

重点回归：

- 九次分发过程中任务条目标、方向、携带物和分母正确；
- 前两次保留完整教学，后续往返没有不必要的长距离；
- 密集箱区选择目标稳定，不会把“交给患者”错误裁决成“拾取附近箱子”；
- 补给箱、人物换装和医生进度跨图、后台和重启后都保留；
- 终局只清理当轮状态，不清除永久收藏、史实和章节解锁。

建议检查点：

```powershell
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d3-1-before-bag-clue
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d3-3-before-bag-quiz
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d3-2-before-first-distribution
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d3-2-after-first-distribution
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d3-3-before-supply-box
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d3-2-before-silver
.\tests\manual\android-game\game-test.ps1 checkpoint -Name d3-1-before-ending
```

## 6. 每个关键节点的固定检查

到达每个 `before` 检查点后，执行以下最小矩阵：

1. 点击人物左侧和右侧道路，角色均能朝目标移动。
2. 使用 `A`、`D` 或方向键验证持续输入和松键停止。
3. 打开当前弹窗，确认弹窗内操作有效、道路输入被阻断。
4. 关闭弹窗，确认移动和右下操作立即恢复。
5. 从普通交互距离 520 以外点击非任务目标，不得远程拾取或交付。
6. 当前任务 NPC 在 720 内应显示带实际目标名称的动作标签；普通目标进入 520 后才显示。
   右下操作按钮只接受可见圆形区域（84px 半径），按钮外道路点击必须移动而不能触发任务。
7. 完成交互后立刻按 Home，再恢复应用，结果仍存在。
8. 抓取 OCR 预览和日志。
9. 走、跑和停步各一次，确认脚步声及时开始、切换并停止；不得叠加成多路循环声。
10. 通过门、道路或楼梯进入另一层后，人物和当前层道路必须立即回到可视范围，镜头不能
    停留在前一个层级。

```powershell
.\tests\manual\android-game\game-test.ps1 background `
  -Name d3-2-after-delivery -WaitSeconds 5
.\tests\manual\android-game\game-test.ps1 inspect -Name d3-2-after-delivery
.\tests\manual\android-game\game-test.ps1 logs -Name d3-2-after-delivery
```

### 6.1 手机横屏、镜头与音频专项矩阵

每个发布候选至少覆盖以下比例：

| 设备比例 | 示例分辨率 | 必测界面 |
|---|---:|---|
| 16:9 | 1920×1080 | Android 启动画面、插画片头、主菜单、章节卡、游戏 HUD |
| 20:9 | 2400×1080 | 同上，并检查刘海/圆角安全边缘 |
| 21:9 或最宽目标机 | 2520×1080 | 标题、跳过、暂停、目标条和右下操作按钮 |

模拟器可以临时覆盖分辨率，但必须使用 `finally` 恢复，避免影响后续测试：

```powershell
$adb = 'D:\Android\Sdk\platform-tools\adb.exe'
try {
    & $adb -s emulator-5554 shell wm size 1080x2400
    .\tests\manual\android-game\game-test.ps1 stop
    .\tests\manual\android-game\game-test.ps1 launch
    Start-Sleep -Seconds 4
    .\tests\manual\android-game\game-test.ps1 inspect -Name startup-20x9
    .\tests\manual\android-game\game-test.ps1 logs -Name startup-20x9
} finally {
    & $adb -s emulator-5554 shell wm size reset
}
```

原生片头预期播放原版五页 Spine 横屏历史动画，同时显示标题、原配乐、历史字幕、进度条
和跳过按钮；若设备丢失 Spine 完成回调，65 秒幂等看门狗负责收束。回归玩家可以跳过，
但自动化不得以跳过代替完整时序验证。至少在 6 秒、20 秒和后段取证，不得出现附件散落、
黑块、标题越界或不能自然进入主菜单。检查 Android 工程的 Activity 清单包含
`android:screenOrientation="landscape"`。

镜头专项至少自然操作一次“同图前后景门”和一次“跨地图门”。进入后立即检查：

- 主角完整可见，且不贴在错误的上/下边缘；
- 当前道路、梯子或交互按钮处于画面内；
- 摄像机缩放后的边界按实际可视尺寸约束；
- 返回原层后仍跟随主角，不继承前一层的固定镜头。

音频专项不要只听一次。依次验证主菜单、片头、游戏 BGM，走路、跑步、取水、开门、拾取、
枪炮和 UI 音效，再在设置中把音效调整为 30%、100% 和关闭/开启。语音滑块不得连带静音
脚步与动作音效。Android 原生日志应能看到对应 MP3 被
`AudioPlayerProvider`/`AudioDecoder` 载入，不得出现“资源路径不存在”。

## 7. 异常与恢复测试

### 7.1 后台与进程恢复

至少在以下状态各测一次：

- 普通行走后；
- 刚拾取物品后；
- 刚正确投递后；
- 答题完成后；
- 跨图后；
- 第三章九次分发的中间进度。

```powershell
.\tests\manual\android-game\game-test.ps1 background `
  -Name recovery-after-pickup -WaitSeconds 5
```

恢复后检查章节、地图、人物位置、携带物、换装、任务事件和完成进度。

### 7.2 当前快照损坏

```powershell
.\tests\manual\android-game\game-test.ps1 corrupt `
  -Name d3-2-save-fallback -WaitSeconds 5
```

预期：

- `current` 校验失败后使用 `previous`；
- 应用仍能进入游戏；
- 不清除永久数据；
- 测试结束自动恢复原检查点。

### 7.3 旧版本关卡存档迁移

```powershell
.\tests\manual\android-game\game-test.ps1 oldsave `
  -Name d3-3-legacy-prop113 -WaitSeconds 12
```

脚本会从当前 `scenes_d3_3` 存档删除“红星报”和两代快照，模拟升级前旧档。预期启动后
精确补回 1 个 `prop113`；如果永久收藏中已经存在该物品则不得重生。测试无论通过或失败
都会恢复开始前的数据库检查点。

### 7.4 覆盖安装

在高价值节点保存检查点后：

1. `adb install -r -t` 安装新调试包；
2. `direct` 恢复检查点；
3. 从当前交互继续；
4. 验证 UUID、存档键和旧组件名兼容没有破坏。

禁止用“卸载再安装”代替升级测试，因为卸载会删除应用私有数据库，无法验证真实升级路径。

### 7.5 重复输入

对拾取、答题确认、对话继续、投递和地图门执行快速双击/连点：

- 同一事件只能结算一次；
- 不生成重复物品；
- 不重复解锁或重复换装；
- 不出现两层相同弹窗；
- 不因异步回调晚到而操作已销毁节点。

## 8. 性能与稳定性

### 8.1 模拟器循环

```powershell
.\tests\manual\android-game\game-test.ps1 stability `
  -Name release-candidate -Minutes 10
```

脚本会轮换全部七张已发布地图。模拟器循环用于尽早发现：

- 章节资源加载/释放错误；
- 后台恢复失败；
- 内存持续攀升；
- JavaScript、Native、ANR 和 tombstone；
- 快速切换后的空引用。

模拟器的 ARM 转译结果不能代替物理 ARM64 门禁。

### 8.2 真实 ARM64 发布门禁

```powershell
.\tests\manual\android-game\game-test.ps1 stability `
  -Name physical-arm64-30m -Minutes 30 -RequireArm64 `
  -Serial <真实设备序列号>
```

放行条件：

- 设备主 ABI 为 `arm64-v8a`；
- 连续 30 分钟无崩溃、ANR 和资源加载失败；
- 多轮前后台后仍能继续操作；
- 总 PSS 没有持续、单向、不可回收增长；
- 至少人工完成一次移动、拾取、投递、答题和跨图。

仅用 `gfxinfo` 无有效逐帧数据时，不得把它误报为帧率结论。应在支持的物理设备上结合
系统帧时间、Profiler 或 Perfetto 记录。

上述自动脚本应运行在可 `run-as` 的发布候选测试包。最终不可调试 release 包还要在同一台
真实设备上按玩家路径做至少 30 分钟黑盒运行；不得通过修改数据库跳过正式包的启动、升级
和自然存档路径。

## 9. 修复后的最短复测闭环

发现问题后按以下顺序处理：

1. 在故障发生前保存 `before` 检查点。
2. 执行 `inspect`、`logs` 和 `state`，记录实际章节、地图、携带物和画面。
3. 修复代码或资源。
4. 执行 `npm test`。
5. 执行 `build-android.ps1 -IncrementalGenerate`。
6. 用 `adb install -r -t` 覆盖安装。
7. 用 `direct -Name <before检查点>` 直接回到故障节点。
8. 复现原操作，保存 `after` 检查点和证据。
9. 补测相邻交互、同类交互和章节结束，避免局部修复产生回归。

不要从第一章重新跑到第三章的单个投递点。只有发布候选最终验收才要求从第一章完整跑到
终局。

## 10. 发布放行门禁

### 10.1 必须通过

- [ ] `npm test`
- [ ] 原始资源 UUID 完整性验证
- [ ] Creator 生成和 Android 双 ABI 调试构建
- [ ] 七张发布地图逐图加载和移动
- [ ] 三章主线完整通关
- [ ] 所有核心交互合同
- [ ] 16:9、20:9/21:9 横屏片头、主菜单、章节卡和 HUD
- [ ] 同图前后景门、跨图门和楼梯后的镜头重定位
- [ ] BGM、走/跑脚步、动作、枪炮、取水、开门和 UI 音效
- [ ] 音效/语音设置互不误伤，关闭与重新开启立即生效
- [ ] CG 跳过和对白加速
- [ ] 后台、覆盖安装、坏档回退
- [ ] 日志无 JavaScript、Native、ANR 和加载错误
- [ ] 终局返回主菜单且永久数据保留
- [ ] 真实 ARM64 设备 30 分钟稳定性
- [ ] 正式 APK/AAB 的签名、zipalign、R8、版本号和双 ABI 核验

### 10.2 内容完整性

- 当前主线完成不强制收藏满格，但前三节全部 13 件收藏都应可达。
- `npm run check:content` 统一校验七张地图清单、地图预制体、门目标、13 件收藏、10 条
  史实、6 道答题、章节统计和地图提示。
- 第三节的`红星报`已补放到小学堂兑换点主线路径，第三节可达到收藏 `5/5`。

## 11. 缺陷记录模板

```markdown
### [严重级别] 简短标题

- 构建：commit / versionName / versionCode / APK 文件名
- 设备：型号 / Android / ABI / 分辨率 / ADB serial
- 检查点：d3-2-before-silver
- 状态：chapter=3, mapIndex=2, 携带=西药药瓶, 进度=6/9
- 前置：从检查点 direct 进入并等待任务条出现
- 步骤：
  1. ...
  2. ...
- 预期：...
- 实际：...
- 频率：5/5
- 证据：压缩预览、OCR 文本、日志文件、state JSON
- 首个异常日志：...
- 修复验证：commit / after 检查点 / 相邻回归结果
```

严重级别建议：

- P0：崩溃、坏档、无法启动、主线软锁、正式包不可安装；
- P1：无法移动/拾取/投递、画面遮挡导致无法操作、章节无法结算；
- P2：提示错误、布局异常、重复劳动明显、音画或性能问题；
- P3：不影响完成任务的轻微文字和表现问题。

## 12. 结果归档

每个发布候选至少保留：

- Git commit 和工作区状态；
- APK/AAB 文件名、版本号、大小；
- `npm test` 输出；
- 七图检查表；
- 关键检查点名称；
- `smoke`、`background`、`corrupt`、`oldsave`、`stability` 结果；
- 终局 OCR/压缩预览；
- 真实 ARM64 设备记录；
- 未关闭问题及放行人。

APK、AAB、签名文件和测试原始截图不提交 Git。Markdown 结论、可复现命令和必要的脱敏
文本证据可以提交。

测试结束后恢复进入测试前保存的用户现场：

```powershell
.\tests\manual\android-game\game-test.ps1 direct -Name user-before-playthrough
```

恢复后再执行一次 `state` 和 `logs`，确认章节、地图、角色和快照无误。

## 13. 本流程的基线验证记录

2026-07-27 对本文流程执行了以下验证：

- `git diff --check` 通过；
- `game-test.ps1` PowerShell 语法解析通过；
- `npm test` 通过：71 个脚本及全部 JSON、配置图 0 错误、发布内容、游戏合同、命名和
  纹理预算通过；
- 从第一章到第三章终局的完整人工通关通过，九次医疗物资分发、两组答题、战场演出、
  红星报拾取和终局确认均实际操作；
- 雷电模拟器 2 分钟稳定性循环完成 9 个循环，覆盖全部七张已发布地图后又复测前两图；
- 循环中的启动、ADB 输入、Home/恢复、截图、内存记录和错误日志检查通过；
- 测试结束自动恢复原现场：第三章第 1 图、`role_erwa2`、解锁进度 2；
- `longmarch_save_v2_current` 与 `longmarch_save_v2_previous` 两代快照均存在；
- 恢复后的日志没有 JavaScript、Native fatal、ANR 或资源加载错误。
- 1.1.1 手机专项复测确认 Android 强制横屏；16:9 与 20:9 片头布局通过；片头和游戏
  BGM、跑步脚步声均由 Android 原生音频解码器实际载入和播放；同图门摄像机重定位及
  缩放边界已纳入自动合同。

完整记录见
[`full-playthrough-validation-2026-07-27.md`](full-playthrough-validation-2026-07-27.md)。
模拟器完整通关和稳定性循环仍不替代真实 ARM64 设备 30 分钟门禁。
