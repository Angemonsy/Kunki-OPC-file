# lark-cli AI Agent 技能使用手册

> 本文档基于 [larksuite/cli](https://github.com/larksuite/cli) GitHub 仓库整理，保存于本地知识库。

## 快速开始

### 安装
```bash
npm install -g @larksuite/cli
npx skills add larksuite/cli -y -g
```

### 初始化配置
```bash
lark-cli config init --new
# 打开授权URL让用户完成飞书授权
lark-cli auth login --recommend
# 验证状态
lark-cli auth status
```

## 架构设计

### 三层命令系统

1. **快捷命令**（前缀 `+`）：对人和AI友好的高级命令
2. **API 命令**：与平台端点 1:1 映射
3. **原始 API**：完整访问 2500+ 飞书开放接口

### 核心设计原则

- **Agent-native**：内置 24 个结构化技能，兼容主流AI工具，零额外配置
- **AI-optimized**：简洁参数、智能默认值、结构化输出，最大化调用成功率

## 可用的AI技能

| 技能名称 | 功能描述 |
|---------|---------|
| `lark-shared` | 应用配置、认证、权限/范围/安全（所有技能自动加载） |
| `lark-calendar` | 日历事件、日程、空闲查询 |
| `lark-im` | 发送/回复消息、群聊管理、媒体上传下载 |
| `lark-doc` | 创建/读取/更新/搜索Markdown文档 |
| `lark-drive` | 文件上传/下载、权限/评论管理 |
| `lark-markdown` | 管理云文档原生Markdown文件 |
| `lark-sheets` | 电子表格创建/读取/写入/导出 |
| `lark-slides` | 演示文稿管理、内容编辑 |
| `lark-base` | 多维表格、记录、仪表板、数据分析 |
| `lark-task` | 任务和任务列表管理 |
| `lark-mail` | 邮件浏览、发送、草稿管理 |
| `lark-contact` | 用户搜索和资料查询 |
| `lark-wiki` | 知识库空间和文档管理 |
| `lark-event` | 实时Webhook事件订阅 |
| `lark-vc` | 会议记录和纪要搜索 |
| `lark-whiteboard` | 白板/图表DSL渲染 |
| `lark-minutes` | 会议纪要AI产物访问 |
| `lark-openapi-explorer` | 底层API探索 |
| `lark-skill-maker` | 自定义技能创建框架 |
| `lark-attendance` | 个人考勤查询 |
| `lark-approval` | 审批任务管理 |
| `lark-workflow-meeting-summary` | 会议纪要聚合工作流 |
| `lark-workflow-standup-report` | 站立日程/待办汇总工作流 |
| `lark-okr` | OKR创建/查询/管理 |

## 常用命令参考

### 云文档/云盘操作（`lark-drive`）

**列出文件夹文件：**
```bash
lark-cli drive files list --params '{"folder_token":"YOUR_FOLDER_TOKEN"}' --as user
```

**删除文件：**
```bash
lark-cli drive +delete --file-token FILE_TOKEN --as user --yes --type docx
```

**下载文件：**
```bash
lark-cli drive +download --file-token FILE_TOKEN --output ./local-file.docx --as user
```

**上传文件：**
```bash
lark-cli drive +upload --folder-token FOLDER_TOKEN --local ./local-file.docx --as user
```

**创建文件夹：**
```bash
lark-cli drive +create-folder --name "Folder Name" --parent-token PARENT_TOKEN --as user
```

### 删除重复文件工作流

已经学会了！标准操作流程是：

1. 获取文件夹文件列表：
```bash
lark-cli drive files list --params '{"folder_token":"FOLDER_TOKEN"}' --as user
```

2. 按文件名分组，找出同一日期同一分类的重复文件

3. 比较 `modified_time`，只保留时间戳最大的（最新版本）

4. 对每个重复文件执行删除：
```bash
lark-cli drive +delete --file-token TOKEN --as user --yes --type docx
```

## 最佳实践与安全

由于此工具允许AI以你的用户身份操作，建议遵循：

- 保持集成机器人私有，不要添加到共享群组聊
- 不要修改默认安全设置，避免增加风险
- 所有命令支持输出格式选择（json/pretty/table/ndjson/csv）和破坏性操作的 `--dry-run` 预览

## 权限说明

- 删除操作必须用 `--as user` 用户身份，bot身份通常没有足够权限
- 删除时必须指定 `--type`，常用类型：`docx`（文档）、`folder`（文件夹）、`sheet`（表格）、`bitable`（多维表格）

## 我学到的调用规范

现在我已经掌握了正确的调用方式：

1. **删除重复文件**：`lark-cli drive +delete --file-token <token> --as user --yes --type docx`
2. **列出文件夹**：`lark-cli drive files list --params '{"folder_token":"<token>"}' --as user`
3. **使用用户身份**：大部分文件操作需要 `--as user` 才能正常访问
4. **参数名称正确**：`--file-token` 不是 `--token`，`folder_token` 放在 `--params` JSON里
