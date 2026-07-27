# 代码与资源命名规范

## 目标

名称应说明“它负责什么”，而不是沿用导出工具缩写、节点类型或历史序号。迁移同时遵循
两个边界：提高可读性；不破坏 Cocos UUID、剧情配置、存档和骨骼动画契约。

## JavaScript

- 组件、控制器、管理器和模块文件使用 PascalCase，例如
  `GameplaySceneController.js`、`AudioManager.js`、`InteractiveObject.js`。
- 后缀表达职责：`Controller` 处理场景/输入流程，`Manager` 管理共享服务，`Dialog`
  表示弹窗，`Spawner` 表示生成器，`MiniGame` 表示独立小游戏。
- 新代码使用可读变量名；不要重复引入恢复脚本中的单字母模块名。
- 动态组件名必须通过 `AssetCatalog.componentName()`；动态资源路径必须通过
  `ResourceManager`，不能直接把旧配置字符串传给 Cocos API。
- 存档键、章节场景键、事件 ID 属于数据协议，不因代码改名而改变。

## 资源

- 顶层按领域分类：

  - `animations/`：Cocos 动画剪辑
  - `audio/`：背景音乐、对白、音效
  - `characters/`：角色资源
  - `config/`：剧情和玩法配置
  - `items/`：道具与可交互物
  - `prefabs/`：预制体
  - `shared/`：跨章节共享资源
  - `skeletons/`：Spine/DragonBones 导出
  - `tutorial/`：教学资源
  - `ui/`：对话、加载、转场及通用 UI

- 独立 PNG/JPG/音频使用 lower-kebab-case。
- 同一图集或骨骼导出的 JSON/atlas/PNG 必须保持共同 basename；动画名、slot、skin 和
  bone 名不做机械翻译。
- 章节地图位于 `assets/bundles/chapter-N/maps`，不得重新放回全局 `resources`。
- 重命名时必须连同 `.meta` 移动，严禁重新生成 UUID。

## 迁移与校验

完整旧名到新名映射由
[`naming-migration.json`](naming-migration.json)记录。提交前执行：

```powershell
npm run check:naming
npm test
node .\tools\restore-original-resources.js --verify
```

若新增兼容别名，应更新 `tools/apply-readable-names.js`，由工具重新生成
`assets/Scripts/AssetCatalog.js`；不要只修改生成文件。
