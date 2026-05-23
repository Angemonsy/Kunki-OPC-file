# MEMORY.md - Long Term Memory

## Project: 奇绩怪谈AIQ

### 团队AI员工

| 姓名 | 职位 | agent ID | 飞书工作文件夹（含人设文档） | App ID | App Secret | 状态 |
|------|------|----------|------------------------------|--------|------------|------|
| 选哥 (xuanguan) | 选题官 | xuanguan | https://gqkkndrhn25.feishu.cn/drive/folder/ZAZVf6GbMlLmb3dmOWxcNeQ5nGb | cli_a9104b8a7278dbd3 | iyZRfzosPidkgsCa9eLLrf6IlO5fTehU | ✅ 重构完成，飞书唯一权威 |
| 内容助手 (contenthelper) | 内容初稿生成 | contenthelper | https://gqkkndrhn25.feishu.cn/drive/folder/Sy5WfsYEClKuiVdzXNrcnbWLnEc | cli_a934e10705b9dbb4 | InL80M3in7xV8RoWN156ociqGMPLAnrb | ✅ 重构完成，飞书唯一权威 |
| 催活助手 (cuihuo) | 任务扫描提醒 | cuihuo | https://gqkkndrhn25.feishu.cn/drive/folder/FgDkf7ca1lqzb3dTQdpcEQR3nLd | cli_a93036c82bb81bd9 | UmcgBiSTQ4iP4ENuSJmiwcyAq8m1gjVw | ✅ 重构完成，飞书唯一权威 |
| 公众号监控助手 (gzhmonitor) | 公众号文章监控 | gzhmonitor | https://gqkkndrhn25.feishu.cn/drive/folder/RyKMfKzeLlcBKrdnUxTcHgjenYc | - | - | ✅ 重构完成，飞书唯一权威 |
| 学习搭子 (xuedadazi) | 保研学习陪伴+答疑+进度提醒 | xuedadazi | https://gqkkndrhn25.feishu.cn/drive/folder/LIP9fZPCRlsdD8d3YaZcpuC7nKg | cli_a9233902c1f99cbb | iZTAVEk8fYQeWm6dMtpkldML5sWbwxlX | ✅ 创建完成，飞书唯一权威 |
| 素材整理大师 (sucai) | 每日素材整理价值提炼+创作/副业指导 | sucai | https://gqkkndrhn25.feishu.cn/docx/RycCdkzy7oW8BIxtacjcydf9n6e?from=from_copylink | cli_a9340980e1b8dbdb | dQju6fwmVhKkzDvubWk2LgoGdaK45u2r | ✅ 配置完成，飞书是唯一权威 |
| 复盘哥 (fupange) | 数据复盘专家，动态数据回流 | fupange | https://gqkkndrhn25.feishu.cn/drive/folder/[需要用户创建飞书工作文件夹后补充] | cli_a940ccf02eb85bde | W1On70vMgkQUpG5e6kjBDe5k3NiWFjgP | ✅ 配对完成，激活成功 |
| 雅思哥 (yasi) | 雅思学习助手，自动化帮助学习雅思整理资料 | yasi | [需要用户创建飞书工作文件夹后补充] | cli_a96982cd4579dcd2 | SFy158ptLIAdfeZJiQowecUnqyy2et35 | ✅ 配置完成，等待配对 |

### 用户信息

- 姓名：王坤馨
- 飞书 sender ID：`ou_c9723fa26199b12c31e9769b0c792a17`
- 项目定位：AI+学术 / AI副业，面向大学生、职场新人、普通想做AI副业的人
- 当前优先级：P1 保研冲刺，P2 AI自媒体商业项目

### 一人公司系统飞书文档

- 根文件夹：「AI一人公司系统」
- 链接：https://gqkkndrhn25.feishu.cn/drive/folder/EDWvfNDvSlxztQdmJxlcDWWzneb
- **核心规则**：所有AI员工必须以这个飞书文件夹里的文档内容为准，云服务器本地配置只是缓存副本，飞书文档是唯一权威

### 已配置技能

1. **wechat-watch** - 微信公众号文章订阅自动推送
   - 服务地址：`http://localhost:5000`
   - 服务状态：✅ 正常运行
   - 已订阅公众号（5个）：
     - 奇绩怪谈AIQ (`Mzk2NDc0OTEyOQ==`)
     - 数字生命卡兹克 (`MzIyMzA5NjEyMA==`)
     - 赛博禅心 (`MzkzNDQxOTU2MQ==`)
     - 甲木未来派 (`MzkxNjY0MzM1MA==`)
     - APPSO (`MjM5MjAyNDUyMA==`)
   - 定时任务：
     - 每天 **10:00** 自动检查推送：推送范围为 `昨天10:00 ~ 今天10:00` 的新文章
   - 数据库位置：`~/.agents/skills/wechat-watch/services/wechat-download-api/data/rss.db`
   - 推送记录：`~/.agents/skills/wechat-watch/data/pushed_articles.json`

### 定时任务配置（OpenClaw自带cron机制）

使用 `openclaw cron add` 添加，管理后台可见，支持：
- 指定agent执行
- 指定channel和推送目标
- 配置时区（Asia/Shanghai）
- 支持启用/禁用/删除，可维护性好

**当前已配置两个定时任务：**

1. **选题官每日热点推荐**
   - 时间：每天 6:55 (Asia/Shanghai)
   - 执行Agent：`xuanguan`
   - 推送目标：老板王坤馨 `ou_c9723fa26199b12c31e9769b0c792a17`

2. **公众号文章每日推送**
   - 时间：每天 10:00 (Asia/Shanghai)
   - 执行Agent：`xuanguan`
   - 推送目标：老板王坤馨 `ou_c9723fa26199b12c31e9769b0c792a17`

**最佳实践：** 始终使用OpenClaw自带cron机制添加定时任务，不要直接修改系统crontab。

### 关键路径

- 主agent工作区：`/home/18902684335_wy/openclaw/workspace`
- 子agent工作区：`~/.openclaw/workspace-<agent-id>/`
- 技能目录：`~/.agents/skills/`
- OpenClaw配置：`~/.openclaw/openclaw.json`

### 重要规则

- 每个子agent独立隔离：workspace、配置、内存独立
- skills全局共享，只安装一次
- exec默认自动批准，无需每次询问
- 公众号订阅请求间隔3秒，遵守微信风控
- IP定位要求：内容"critical but moderate"，克制不极端
- **架构原则：飞书云文档是唯一主数据源，云服务器OpenClaw是执行环境**
- **双向同步：main agent负责同步两边，任何修改都要保证飞书文档和云服务器配置一致**
  - 用户在飞书修改 → main agent读取最新内容，同步云服务器本地文件
  - 用户口头修改/main agent在云服务器修改 → main agent调用飞书API更新飞书文档，保证飞书始终是最新权威
- **用户习惯偏好记录规则**：任何subagent在对话中涉及用户的习惯、偏好、固定选择记录时，必须告知cuihuo催活subagent，由cuihuo前往指定飞书文档更新这部分内容，文档链接：https://gqkkndrhn25.feishu.cn/docx/WU3qdlLfRo8lxnxZSlfcDvUZnWf?from=from_copylink

### 创建新飞书subagent - 标准流程（2026-04-18 更新）

1. **创建工作区目录**：`mkdir -p ~/.openclaw/workspace-<agent-id>/`
2. **创建入口文件 `AGENTS.md`**：写入标准格式
   ```markdown
   你是【xx角色名称】，你需要调用飞书插件，在【飞书工作文件夹链接】里面查找文档和工作要求。
   所有配置、规则、上下文都以飞书文件夹内的文档为准，本地只是入口缓存。执行任务前，必须先读取飞书文件夹内的最新文档获取要求。
   ```
3. **复制agent目录结构**：`cp -r ~/.openclaw/agents/main/agent ~/.openclaw/agents/<agent-id>/`
4. **手动编辑 `~/.openclaw/openclaw.json`，在四个地方添加配置**：
   - ① `agents.list` → 添加agent基本信息（id、name、workspace、agentDir、model）
   - ② `channels.feishu.accounts` → 添加App ID和App Secret
   - ③ `bindings` → 添加路由绑定（type=route，agentId，channel=feishu，accountId）
   - ④ `tools.agentToAgent.allow` → 添加agent-id到允许列表
5. **重启gateway**：`openclaw gateway restart`
6. **配对批准**：用户发送消息获取配对码后，执行 `openclaw pairing approve feishu <配对码>`

✅ 完成！

### 已完成里程碑

- 2026-04-02：完成Feishu机器人配对，激活OpenClaw飞书集成
- 2026-04-02：创建xuanguan选题官AI员工，完成基础配置
- 2026-04-03：完成wechat-watch技能部署，成功登录微信公众号
- 2026-04-03：添加全部5个目标公众号订阅，完成定时任务配置
- 2026-04-17：完成核心架构重构，**所有子agent本地只保留入口，所有配置、人设、规则全部存放在飞书**，飞书是唯一权威，main agent负责双向同步
- 2026-04-17：开启飞书消息底部的耗时和状态展示

### TODO

- [ ] 实现选题官的每日热点推荐和全网搜索功能
- [ ] 内容助手、催活助手完成人设文档配置后配对激活
- [ ] 根据需求创建更多AI员工（脚本师、视频剪辑、文案编辑、产品经理等）
- [ ] 确认飞书机器人推送权限问题（飞书要求先收到用户消息才能主动推送）

### 经验总结

2026-04-18 创建学习搭子(xuedadazi)过程中踩坑总结：
- ❌ 不要用交互式命令 `openclaw agents create` 在非交互式环境创建，容易卡住
- ✅ 全程手动创建目录+修改配置，一次性完成，更可靠
- ✅ 必须在 `openclaw.json` 的四个地方都添加配置，缺一不可
- ✅ 配对需要用 `openclaw pairing approve feishu <配对码>` 批准
