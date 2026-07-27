# 《重返长征路》审计实施报告

日期：2026-07-27

对应审计：[`codebase-audit-2026-07-27.md`](codebase-audit-2026-07-27.md)

## 结论

原审计中的 P0、P1、P2 工程内工作均已实施并通过自动门禁、Cocos Creator 构建和雷电
模拟器回归。唯一不能由当前环境替代的是“真实 ARM64 物理设备连续 30 分钟”外部设备
门禁；仓库已经提供 `-RequireArm64 -Minutes 30` 自动脚本，当前雷电设备为模拟器，不能
把 ARM 转译结果误报为真实硬件结果。

## P0 发布门槛

| 审计项 | 实施结果 | 主要证据 |
|---|---|---|
| 现代 Android release 工程 | 完成 | AGP 8.9.2、Gradle 8.11.1、JDK 17、API/target 36、minSdk 21、R8、正式签名、APK/AAB、双 ABI、`apksigner` 与 `zipalign` 自动核验 |
| 章节资源分包 | 完成 | `chapter-1`、`chapter-2`、`chapter-3` 三个 Asset Bundle；`ResourceManager` 支持 bundle 加载、引用计数和整包释放 |
| 大纹理治理 | 完成 | 12 张超预算纹理拆分/缩放，自动门禁保证普通 PNG 与骨骼页不超过 2048×2048 |
| 原子存档 | 完成 | `schemaVersion=2` 单记录完整快照，current/previous 两代校验和回退，过渡期兼容旧键双写 |

## P1 体验与内容

| 审计项 | 实施结果 |
|---|---|
| 事件驱动任务追踪 | 顶部显示目标、方向、携带物品和下一步动作；地图切换时刷新 |
| 第三章重复搬运 | 保留前两次完整教学，后续交付缩短重复路径并提供更明确的物资提示 |
| 烤红薯小游戏 | 增加生/熟/焦时机环与首次操作教学 |
| 答题反馈 | 错题显示正确答案和史实解释，只重试当前题 |
| 收藏与结局 | 增加缺失收藏区域提示及结局完成度摘要 |
| 操作按钮语义 | 按当前交互显示“拾取…”“交给…”等动作标签 |
| 卡片/弹窗尺寸 | 按原生可见区域约束任务、物品、对白卡片，不再遮住主要道路与操作区 |

## P2 维护与测试

| 审计项 | 实施结果 |
|---|---|
| 配置图校验 | 校验 12 场景、1218 事件、802 跳转；错误为 0，不可达历史分支作为警告输出完整报告 |
| 生产包裁剪 | 排除旧编辑器、旧热更新、旧 HTTP/网络提示等 9 个模块 |
| 统一日志 | `Logger` 在发布版关闭普通日志，错误附带章节、地图、事件上下文 |
| 自动契约 | 覆盖移动、拾取、送错/送对、弹窗阻断、切图、后台恢复、进程恢复、坏档回退和命名兼容 |
| 稳定性工具 | ADB 检查点、直达章节、重定位、后台、坏档和循环稳定性；只用 ADB 截图，本地压缩/OCR |
| Git 基线 | 建立可回滚基线并在 `codex/implement-full-audit` 分支分阶段提交 |

## 可读命名迁移

- 55 个历史脚本改为描述职责的 PascalCase 名称。
- 1179 个资源路径纳入命名清单；顶层按 `animations`、`audio`、`characters`、`config`、
  `items`、`prefabs`、`shared`、`skeletons`、`tutorial`、`ui` 等领域组织。
- 独立图片与音频使用 lower-kebab-case；骨骼导出三件套和动画名保持不变，避免破坏
  Spine/DragonBones 契约。
- 所有 `.meta` UUID、场景 ID、事件 ID、存档键保持稳定。`AssetCatalog` 在运行时把旧
  配置路径和旧组件名映射到新名称。
- 机器可读完整清单见 [`naming-migration.json`](naming-migration.json)，维护规则见
  [`naming-conventions.md`](naming-conventions.md)。

## 最终验证

- `npm test`：69 个脚本和全部 JSON 语法通过；配置错误 0；游戏契约、命名、纹理预算通过。
- UUID：524 个原图集帧、1513 个原始路径 UUID 通过。
- Android debug：`armeabi-v7a` 与 `arm64-v8a` 同包构建、安装、启动通过。
- 模拟器：第 1、2、3 章直达、ADB 移动输入、任务/对白卡片显示通过。
- 恢复：后台恢复、current 损坏回退 previous 通过。
- 完整通关：三章、七图、两组答题、九次医疗分发、战场演出和终局返回主菜单通过。
- 稳定性：9 个跨章节启动/后台/恢复循环无 JavaScript、Native fatal、ANR 或资源加载错误。
- 测试结束后恢复用户检查点：第 3 章、`role_erwa2`、current/previous 完整快照。

## 常用质量门禁

```powershell
npm test
node .\tools\restore-original-resources.js --verify
.\tools\build-android.ps1 -IncrementalGenerate
.\tests\manual\android-game\game-test.ps1 stability -Minutes 30 -RequireArm64
```

正式产物：

```powershell
.\tools\build-android-release.ps1 `
  -SigningProperties E:\安全目录\longmarch-signing.properties `
  -VersionCode 2026072701 `
  -VersionName 1.1.0
```

`dist/`、`*.apk`、`*.aab`、签名文件和属性文件均被 Git 忽略。
