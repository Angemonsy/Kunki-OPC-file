# 已安装Skill索引

> 记录当前系统已安装的所有Skill，以及各自的使用场景

| Skill名称 | 类型 | 功能 | 使用场景 | 调用方式 |
|----------|------|------|---------|---------|
| **x-reader-url** | MCP | 网页链接内容提取 | 用户发送任意URL链接，自动提取正文 | `mcp__skill-handler__Skill(skill="x-reader-url", args="URL")` |
| **x-reader-video** | MCP | 视频/播客转文字 | 视频链接需要提取字幕和摘要 | `mcp__skill-handler__Skill(skill="x-reader-video", args="URL")` |
| **x-reader-analyzer** | MCP | 内容结构化分析 | 对内容做多维分析 | `mcp__skill-handler__Skill(skill="x-reader-analyzer", args="要求|内容")` |
| **lark-cli** | CLI | 飞书API命令行 | 飞书云文档双向同步、文件操作 | `lark-cli <command>` |
| **convert-to-project** | MCP | 长期项目管理 | 对话转长期项目、任务拆解 | `mcp__convert-to-project__convert_to_project(...)` |
| **browser-use** | MCP | 浏览器自动化 | 网页交互、动态内容抓取 | `mcp__browser-use__browser_open(...)` 等 |
| **web_search** | MCP | 网络搜索 | 需要最新外部信息 | `mcp__web-search__web_search(query="...")` |

## MCP Server 列表

| Server | 提供功能 |
|--------|---------|
| **skill-handler** | 各类Skill（x-reader等） |
| **convert-to-project** | 长期项目任务管理 |
| **browser-use** | 浏览器控制 |
| **web-search** | 网络搜索 |

## 技能选择速查

当你要... → 用这个Skill：

| 需求 | Skill |
|------|-------|
| 用户发了一个网页链接 → | `x-reader-url` |
| 用户发了一个视频链接 → | `x-reader-video` |
| 需要分析内容结构 → | `x-reader-analyzer` |
| 操作飞书云文档 → | `lark-cli` (bash命令) |
| 转成长期项目跟踪 → | `convert-to-project` |
| 需要登录操作网页 → | `browser-use` |
| 需要查最新信息 → | `web_search` |

## 版本记录

- 2026-05-01：创建索引，整理现有Skill
