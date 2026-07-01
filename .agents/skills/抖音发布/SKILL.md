# 抖音图文自动发布

通过 Playwright MCP 连接本地 Chrome（CDP模式），自动填写抖音创作者中心图文发布页所有字段，停在发布按钮等待用户确认。

**核心原则（来自孟建方案）**：
- CDP 预填所有内容（标题、描述、话题、封面图、图文内容）
- 停在发布按钮，推送飞书消息等用户确认
- 用户说"发"后才点发布，Claude 绝不自动发布

## 触发场景

当用户说"发布到抖音"、"抖音图文发布"、"帮我发抖音"时调用。

## 前提条件

1. Chrome 以 CDP 调试模式启动（端口9222）
2. 用户已在 Chrome 中登录抖音创作者中心
3. 图片文件在 vault 目录内（Playwright 文件访问限制）

**启动 Chrome CDP 模式（Win+R → 粘贴）**：
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\Users\86155\AppData\Local\Google\Chrome\User Data"
```

## 发布页字段选择器（已验证）

| 字段 | 选择器 / 方式 |
|------|-------------|
| 标题 | `input[placeholder="添加作品标题"]` |
| 描述+话题 | `div.editor-kit-container[contenteditable="true"]` |
| 话题触发 | 在描述框输入 `#话题名 `（空格结尾触发） |
| 图片上传 | `input[type="file"]`（第一个，hidden） |
| 发布按钮 | `button.primary-cECiOJ` |

**发布页 URL**：
- 入口：`https://creator.douyin.com/creator-micro/content/upload?default-tab=3`
- 上传图片后跳转：`https://creator.douyin.com/creator-micro/content/post/image`

## 执行步骤

按照 `scripts/douyin_publish.js` 执行。

## 注意事项

- 描述框是 `contenteditable div`，不能用 `fill()`，要用 `click()` + `type()`
- 话题在描述框内用 `#话题名 ` 方式嵌入，不是独立 input
- 图片路径必须是 vault 内的绝对路径
- 文件上传用 `setInputFiles()`，不用 `browser_file_upload`
- **发布按钮类名含哈希（`primary-cECiOJ`），如选择器失效改用文本匹配**：`button:has-text("发布")`
