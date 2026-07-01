# Obsidian 知识库美化

```yaml
名称: Obsidian知识库美化
触发词: 美化、知识库美化、Obsidian美化、vault美化、主题美化
描述: 一键完成Obsidian知识库视觉美化，包括主题、字体、Banner、看板样式、数据面板等
```

---

## 执行步骤

### Step 1: 环境检查

读取 `.obsidian/community-plugins.json`，检查以下必需插件是否已安装：

- `obsidian-minimal-settings`（Minimal Theme Settings）
- `obsidian-iconic`（Iconic）
- `obsidian-kanban`（Kanban）
- `dataview`（Dataview）
- `obsidian-charts`（Obsidian Charts）
- `obsidian-banners`（Banners）

检查 `.obsidian/snippets/` 目录是否存在，不存在则创建。

**如果缺少插件**，输出清单并暂停：

> 以下插件需要手动安装，请在 Obsidian 社区插件市场搜索安装后告诉我：
> - [缺少的插件列表]

等待用户确认后继续。

---

### Step 2: 主题配置

读取并修改 `.obsidian/appearance.json`：

```json
{
  "theme": "obsidian",
  "cssTheme": "Minimal",
  "baseFontSize": 16,
  "showRibbon": true,
  "enabledCssSnippets": [
    "vault-beautify"
  ]
}
```

操作说明：
- 将 `cssTheme` 设为 `"Minimal"`
- 保留已有的 `enabledCssSnippets`，确保 `vault-beautify` 在列表中
- `baseFontSize` 默认 16，用户指定其他值则使用用户值
- 保留其他已有字段不动

---

### Step 3: CSS Snippet 生成

创建或覆盖 `.obsidian/snippets/vault-beautify.css`，写入以下完整 CSS：

```css
/* ============================================
   Obsidian 知识库美化 - vault-beautify.css
   模块化设计，每个模块可独立开关
   ============================================ */

/* ===== 模块1: 字体设置（霞鹜文楷） ===== */
/* 如需关闭：删除或注释本模块，恢复默认字体 */
/* 前提：系统已安装「霞鹜文楷」(LXGW WenKai) 字体 */
body {
  --font-text-theme: "LXGW WenKai", "霞鹜文楷", var(--font-text-override), var(--font-default);
  --font-interface-theme: "LXGW WenKai", "霞鹜文楷", var(--font-interface-override), var(--font-default);
}

/* ===== 模块2: Frontmatter 隐藏 ===== */
.metadata-container {
  display: none !important;
}

/* ===== 模块3: 侧边栏活跃文件高亮 ===== */
.nav-file-title {
  position: relative;
}
.nav-file-title.is-active {
  background: rgba(155, 89, 182, 0.25) !important;
  color: var(--text-normal) !important;
  font-weight: 600;
  border-radius: 6px;
}
.nav-file-title.is-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #9b59b6;
  border-radius: 3px 0 0 3px;
}

/* ===== 模块4: 隐藏滚动条（保留滚动功能） ===== */
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: transparent;
}

/* ===== 模块5: 看板列颜色区分 ===== */
/* 草稿箱 - 橙黄色 */
.kanban-plugin__lane:nth-child(2) .kanban-plugin__lane-header-wrapper {
  background: rgba(230, 126, 34, 0.15) !important;
  border-bottom: 2px solid rgba(230, 126, 34, 0.5);
}
.kanban-plugin__lane:nth-child(2) {
  border-top: 3px solid #e67e22 !important;
}
/* 待发布 - 蓝色 */
.kanban-plugin__lane:nth-child(3) .kanban-plugin__lane-header-wrapper {
  background: rgba(52, 152, 219, 0.15) !important;
  border-bottom: 2px solid rgba(52, 152, 219, 0.5);
}
.kanban-plugin__lane:nth-child(3) {
  border-top: 3px solid #3498db !important;
}
/* 已发布 - 绿色 */
.kanban-plugin__lane:nth-child(4) .kanban-plugin__lane-header-wrapper {
  background: rgba(39, 174, 96, 0.15) !important;
  border-bottom: 2px solid rgba(39, 174, 96, 0.5);
}
.kanban-plugin__lane:nth-child(4) {
  border-top: 3px solid #27ae60 !important;
}

/* ===== 模块6: 表格样式美化 ===== */
.markdown-preview-view table {
  border-collapse: collapse;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}
.markdown-preview-view th {
  background: rgba(155, 89, 182, 0.2);
  padding: 8px 12px;
  font-weight: 600;
}
.markdown-preview-view td {
  padding: 7px 12px;
  border-bottom: 1px solid var(--background-modifier-border);
}
/* 斑马纹 */
.markdown-preview-view tr:nth-child(even) td {
  background: rgba(255, 255, 255, 0.02);
}
/* 悬浮高亮 */
.markdown-preview-view tr:hover td {
  background: rgba(155, 89, 182, 0.08);
}

/* ===== 模块7: Charts 图表容器样式 ===== */
.chart-container canvas {
  filter: brightness(1.2);
}
.chartjs-render-monitor {
  color: #ffffff !important;
}
.block-language-chart {
  color: var(--text-normal) !important;
}

/* ===== 基础排版优化 ===== */
.nav-folder-title {
  padding-top: 3px;
  padding-bottom: 3px;
  font-size: 13px;
  letter-spacing: 0.02em;
}
.nav-file-title {
  padding-top: 2px;
  padding-bottom: 2px;
  font-size: 12.5px;
}
.nav-folder-title-content {
  padding-left: 2px;
}
.markdown-preview-view {
  padding: 30px 40px;
}
.markdown-preview-view h1 {
  margin-top: 1.8em;
  margin-bottom: 0.6em;
  font-size: 1.8em;
}
.markdown-preview-view h2 {
  margin-top: 1.4em;
  margin-bottom: 0.5em;
  font-size: 1.4em;
}
.markdown-preview-view h3 {
  margin-top: 1.2em;
  margin-bottom: 0.4em;
}
.markdown-preview-view ul li,
.markdown-preview-view ol li {
  margin-bottom: 4px;
  line-height: 1.7;
}
.markdown-preview-view pre {
  border-radius: 8px;
  padding: 16px;
}
.workspace-tab-header {
  border-radius: 8px 8px 0 0;
}
.search-input-container input {
  border-radius: 8px;
}

/* ===== Callout 引用块美化 ===== */
.callout {
  border-radius: 10px;
  border-left-width: 4px;
  padding: 14px 18px;
}
.callout[data-callout="quote"] {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.15), rgba(52, 152, 219, 0.1));
  border-left-color: #9b59b6;
}
.markdown-preview-view blockquote {
  border-left: 3px solid #9b59b6;
  background: rgba(155, 89, 182, 0.08);
  border-radius: 0 8px 8px 0;
  padding: 10px 16px;
  margin: 12px 0;
  font-style: italic;
  color: var(--text-muted);
}
```

---

### Step 4: 核心页面 Banner 配置

检查以下三个文件的 frontmatter 中是否已有 `banner` 和 `banner_y` 字段：

| 文件 | 路径 | 默认 banner_y |
|------|------|---------------|
| 主页 | `主页.md` | 0.4 |
| 内容看板 | `02.领域/0.内容创作系统/📋 内容看板.md` | 0.5 |
| 数据面板 | `02.领域/0.内容创作系统/数据面板.md` | 0.5 |

**如果用户提供了图片路径**：用 Edit 修改 frontmatter 中的 `banner` 字段为用户提供的路径。

**如果用户没有提供图片**，检查是否已有 banner 配置：
- 已有则保持不动
- 没有则提示用户：

> 建议为三个核心页面各准备一张横向图片（推荐 1920x600 左右）：
> - **主页**：视觉冲击力强（推荐紫蓝/科幻风）
> - **看板**：深色极简工作台风格
> - **数据面板**：科技/数据感
>
> 把图片放到 `06.附件/` 目录后告诉我文件名，我来配置。

Banner frontmatter 格式：
```yaml
---
banner: "06.附件/你的图片文件名.jpg"
banner_y: 0.5
---
```

---

### Step 5: 看板卡片美化

读取 `02.领域/0.内容创作系统/📋 内容看板.md`，对看板中的 wikilink 进行简化：

**规则**：
- 将 `[[02.领域/0.内容创作系统/🔥02.发布文案/2026年/草稿/公众号/2026年3月5日-标题关键词]]`
- 替换为 `[[02.领域/0.内容创作系统/🔥02.发布文案/2026年/草稿/公众号/2026年3月5日-标题关键词|标题关键词]]`
- 去掉日期前缀（`YYYY年M月D日-`）和文件夹路径，只保留标题部分作为别名

使用 Edit 工具逐个替换。

---

### Step 6: 验证

完成所有步骤后，输出以下提示：

> 美化完成！请执行以下操作确认效果：
> 1. 在 Obsidian 中按 `Ctrl+P`，输入 `Reload app without saving`，回车刷新
> 2. 检查 设置 → 外观 → CSS代码片段，确认 `vault-beautify` 已启用（开关打开）
> 3. 打开主页、内容看板、数据面板，确认 Banner 和样式是否正常
> 4. 如果字体没生效，需要先安装霞鹜文楷字体：https://github.com/lxgw/LxgwWenKai/releases
>
> 截图发给我，我帮你检查有没有问题。

---

## 注意事项

- CSS snippet 需要在 **设置 → 外观 → CSS代码片段** 中启用（开关打开）
- Banner 插件（Obsidian Banners）需要单独安装
- 霞鹜文楷字体需要系统已安装，否则自动回退到默认字体，不会报错
- Chart.js 图表内部文字颜色受 JS 渲染控制，CSS 只能影响容器层
- 深色主题下部分第三方插件 UI 可能需要额外 CSS 适配
- 看板列颜色通过 `nth-child` 选择器匹配，如果看板列顺序变化需要调整 CSS
- 所有 CSS 模块有独立注释标记，可按需注释掉单个模块

---

## 参考：当前 vault-beautify.css 完整内容

以下是执行此 skill 前库中已有的 CSS 配置，作为基线参考：

```css
/* ===== 侧边栏文件夹间距 ===== */
.nav-folder-title {
  padding-top: 3px;
  padding-bottom: 3px;
  font-size: 13px;
  letter-spacing: 0.02em;
}

.nav-file-title {
  padding-top: 2px;
  padding-bottom: 2px;
  font-size: 12.5px;
}

/* ===== 文件夹图标间距 ===== */
.nav-folder-title-content {
  padding-left: 2px;
}

/* ===== 正文阅读区更呼吸 ===== */
.markdown-preview-view {
  padding: 30px 40px;
}

/* ===== 标题间距 ===== */
.markdown-preview-view h1 {
  margin-top: 1.8em;
  margin-bottom: 0.6em;
  font-size: 1.8em;
}

.markdown-preview-view h2 {
  margin-top: 1.4em;
  margin-bottom: 0.5em;
  font-size: 1.4em;
}

.markdown-preview-view h3 {
  margin-top: 1.2em;
  margin-bottom: 0.4em;
}

/* ===== 列表行间距 ===== */
.markdown-preview-view ul li,
.markdown-preview-view ol li {
  margin-bottom: 4px;
  line-height: 1.7;
}

/* ===== 代码块 ===== */
.markdown-preview-view pre {
  border-radius: 8px;
  padding: 16px;
}

/* ===== 标签页圆角 ===== */
.workspace-tab-header {
  border-radius: 8px 8px 0 0;
}

/* ===== 搜索框圆角 ===== */
.search-input-container input {
  border-radius: 8px;
}

/* ===== Callout 引用块美化 ===== */
.callout {
  border-radius: 10px;
  border-left-width: 4px;
  padding: 14px 18px;
}

.callout[data-callout="quote"] {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.15), rgba(52, 152, 219, 0.1));
  border-left-color: #9b59b6;
}

/* ===== 引用块（blockquote）美化 ===== */
.markdown-preview-view blockquote {
  border-left: 3px solid #9b59b6;
  background: rgba(155, 89, 182, 0.08);
  border-radius: 0 8px 8px 0;
  padding: 10px 16px;
  margin: 12px 0;
  font-style: italic;
  color: var(--text-muted);
}

/* ===== 表格美化 ===== */
.markdown-preview-view table {
  border-collapse: collapse;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.markdown-preview-view th {
  background: rgba(155, 89, 182, 0.2);
  padding: 8px 12px;
  font-weight: 600;
}

.markdown-preview-view td {
  padding: 7px 12px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.markdown-preview-view tr:hover td {
  background: rgba(255, 255, 255, 0.04);
}

/* ===== 隐藏 frontmatter 属性面板 ===== */
.metadata-container {
  display: none !important;
}

/* ===== 侧边栏活跃文件高亮 ===== */
.nav-file-title.is-active {
  background: rgba(155, 89, 182, 0.25) !important;
  color: var(--text-normal) !important;
  font-weight: 600;
  border-radius: 6px;
}
.nav-file-title.is-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #9b59b6;
  border-radius: 3px 0 0 3px;
}
.nav-file-title {
  position: relative;
}

/* ===== 隐藏滚动条（保留功能） ===== */
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: transparent;
}

/* ===== Charts 图表字体颜色 ===== */
.chart-container canvas {
  filter: brightness(1.2);
}
.chartjs-render-monitor {
  color: #ffffff !important;
}
/* 图表标签文字 */
.block-language-chart {
  color: var(--text-normal) !important;
}

/* ===== 看板列颜色区分 ===== */
/* 草稿箱 - 橙黄色 */
.kanban-plugin__lane:nth-child(2) .kanban-plugin__lane-header-wrapper {
  background: rgba(230, 126, 34, 0.15) !important;
  border-bottom: 2px solid rgba(230, 126, 34, 0.5);
}
.kanban-plugin__lane:nth-child(2) {
  border-top: 3px solid #e67e22 !important;
}

/* 待发布 - 蓝色 */
.kanban-plugin__lane:nth-child(3) .kanban-plugin__lane-header-wrapper {
  background: rgba(52, 152, 219, 0.15) !important;
  border-bottom: 2px solid rgba(52, 152, 219, 0.5);
}
.kanban-plugin__lane:nth-child(3) {
  border-top: 3px solid #3498db !important;
}

/* 已发布 - 绿色 */
.kanban-plugin__lane:nth-child(4) .kanban-plugin__lane-header-wrapper {
  background: rgba(39, 174, 96, 0.15) !important;
  border-bottom: 2px solid rgba(39, 174, 96, 0.5);
}
.kanban-plugin__lane:nth-child(4) {
  border-top: 3px solid #27ae60 !important;
}
```

---

## 当前核心页面 Banner 配置

| 页面 | banner 路径 | banner_y |
|------|-------------|----------|
| 主页 | `06.附件/576397f5e2230eb2a50fbba5fb2a4b56_MD5.jpg` | 0.4 |
| 内容看板 | `06.附件/7a3f9ebeee5b25dacf21155e8d456dca_MD5.jpg` | 0.5 |
| 数据面板 | `06.附件/bca2aa184edd7cf33fccf70d1d23780c_MD5.jpg` | 0.5 |

## 当前 appearance.json 配置

```json
{
  "theme": "obsidian",
  "showRibbon": true,
  "enabledCssSnippets": [
    "chat-grid-background",
    "iconic-fix",
    "vault-beautify"
  ]
}
```
