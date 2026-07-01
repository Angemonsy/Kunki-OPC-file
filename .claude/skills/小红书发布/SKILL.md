# 小红书图文自动发布

通过 Playwright MCP 连接本地 Chrome（CDP模式），自动填写小红书创作服务平台图文发布页所有字段，停在发布按钮等待用户确认。

**核心原则（来自孟建方案）**：
- 预填所有内容（标题、正文、话题、图片）
- 停在发布按钮，推送飞书消息等用户确认
- 用户说"发"后才点发布，绝不自动发布

## 触发场景

当用户说"发布到小红书"、"小红书图文发布"、"帮我发小红书"时调用。

## 前提条件

1. Chrome 以 CDP 调试模式启动（端口9222）
2. 用户已在 Chrome 中登录小红书创作服务平台（`creator.xiaohongshu.com`）
   - 注意：此域名与 `www.xiaohongshu.com` 登录态独立，需单独登录
3. 图片文件在 vault 目录内

**启动 Chrome CDP 模式（Win+R → 粘贴）**：
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\Users\86155\AppData\Local\Google\Chrome\User Data"
```

## 发布页字段选择器（已验证 2026-03-08）

| 字段 | 选择器 / 方式 |
|------|-------------|
| 图片上传 | `input[type="file"]`（第一个） |
| 标题 | `input[placeholder="填写标题会有更多赞哦"]` |
| 正文+话题 | `div.tiptap.ProseMirror[contenteditable="true"]` |
| 话题触发 | 在正文框末尾输入 `#话题名 `（空格结尾） |
| 发布按钮 | `button.d-button-default:has-text("发布")` 或 `button:has-text("发布")` |

**发布页 URL**：`https://creator.xiaohongshu.com/publish/publish?from=tab_switch`

**切换到图文 Tab**：用JS点击 `span.title` 中文字为"上传图文"的元素

## 注意事项

- 正文区是 **TipTap ProseMirror** 富文本编辑器，用 `click()` + `keyboard.type()` 输入
- 话题在正文框末尾输入 `#话题名 `（空格触发选择）
- `creator.xiaohongshu.com` 需要单独登录，不共享主站 Cookie
- 图片上传后表单才展开，必须先上传图片再填文字
- 有提示"未绑定手机号"属正常，不影响发布（该账号为斯坦森）
- 发布按钮 class 含哈希，备选用文本匹配：`button:has-text("发布")`

## 执行步骤

按照 `scripts/xhs_publish.js` 执行。
