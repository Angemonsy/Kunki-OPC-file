# 【学员版】多Agent飞书群组部署手册

> 版本：v1.0（学员版）
> 适用场景：在已有 OpenClaw + 飞书单账户的基础上，叠加多个飞书 Bot，实现多角色 AI 在同一群组协作
> 前置：Telegram 多 Agent 部署手册中的服务器已配置完毕
> 本手册基于实战经验整理，包含大量踩坑记录，建议配合课程第11-13节学习

---

## 一、整体架构

```
飞书群组「你的团队-内容创作组」
├── @管家   → 任务拆解、调度
├── @选题   → 热点追踪、选题
├── @写手   → 文章创作
├── @编辑   → 内容精修
└── @分发   → 多平台改写

每个 Bot = 一个飞书企业自建应用 = openclaw.json 里一个 account
```

**与 Telegram 方案的核心差异：**

| 对比项 | Telegram | 飞书 |
|--------|---------|------|
| 消息隔离机制 | Forum 话题（每个Bot独占话题） | @机器人名（requireMention） |
| 路由防冲突 | 各Bot只监听自己的 topic_id | 飞书平台只把@A的消息推给A |
| Bot创建 | BotFather，有限流 | 飞书开放平台，无限流 |
| 配对要求 | 无需配对 | 私聊首次需配对（可设open跳过） |

---

## 二、前置检查

### 2.1 确认现有配置不被破坏

你服务器上现有飞书配置（主助手）：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_你的AppID",
      "appSecret": "你的AppSecret",
      "domain": "feishu",
      "groupPolicy": "open"
    }
  }
}
```

这是**单账户扁平结构**。升级为多账户后，原账户迁入 `accounts.main`，原有功能不变。

### 2.2 角色规划（5个基础角色）

| 角色 | account ID | 飞书应用名 | 职责 |
|------|-----------|-----------|------|
| 🏠 管家 | steward | 你的品牌名-管家 | 任务拆解、调度协调 |
| 🔥 选题 | scout | 你的品牌名-选题 | 热点追踪、选题生成 |
| ✍️ 写手 | writer | 你的品牌名-写手 | 公众号文章创作 |
| 🔍 编辑 | editor | 你的品牌名-编辑 | 标题优化、内容精修 |
| 📢 分发 | distributor | 你的品牌名-分发 | 多平台改写适配 |

> 💡 先跑通这5个基础角色，熟练后再按需扩展更多角色（如数据、增长、顾问等）。

---

## 三、第一步：飞书开放平台创建应用（人工操作）

> ⚠️ **这部分需要你手动操作，每个角色重复一遍**

### 3.1 创建企业自建应用

1. 登录 [飞书开放平台](https://open.feishu.cn/app)
2. 点击「创建企业自建应用」
3. 填写应用名称（如「你的品牌名-管家」）、描述、图标
4. 点击创建

### 3.2 添加机器人能力

1. 左侧导航 → 「添加应用能力」
2. 选择「机器人」→ 点击添加

### 3.3 配置事件订阅

1. 左侧 → 「事件与回调」→「事件配置」
2. 订阅方式选「**长连接接收事件**」→ 保存

> ⚠️ 如果报错「应用未建立长连接」：先完成 3.5 的 App ID/Secret 配置，重启服务器上的 Gateway，再回来保存。

3. 点击「添加事件」，搜索并添加以下事件：
   - **接收消息**（必须）
   - 消息已读（群聊推荐）
   - 机器人进群（群聊推荐）
   - 机器人被移出群（群聊推荐）

4. 切换到「回调配置」标签 → 选「**使用长连接接收回调**」→ 保存

### 3.4 批量导入权限

1. 左侧 → 「权限管理」→ 点击「批量导入权限」
2. 替换为以下 JSON，点击下一步确认开通：

```json
{
  "scopes": {
    "tenant": [
      "aily:file:read",
      "aily:file:write",
      "application:application.app_message_stats.overview:readonly",
      "application:application:self_manage",
      "application:bot.menu:write",
      "cardkit:card:write",
      "contact:contact.base:readonly",
      "contact:user.employee_id:readonly",
      "corehr:file:download",
      "docs:document.content:read",
      "event:ip_list",
      "im:chat",
      "im:chat.access_event.bot_p2p_chat:read",
      "im:chat.members:bot_access",
      "im:chat:readonly",
      "im:message",
      "im:message.group_at_msg:readonly",
      "im:message.group_msg",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:message:send_as_bot",
      "im:resource",
      "sheets:spreadsheet",
      "wiki:wiki:readonly"
    ],
    "user": [
      "aily:file:read",
      "aily:file:write",
      "contact:contact.base:readonly",
      "im:chat.access_event.bot_p2p_chat:read"
    ]
  }
}
```

### 3.5 发布应用

1. 左侧 → 「版本管理与发布」→ 点击「创建版本」
2. 填写版本号（1.0.0）→ 保存 → 提交审批
3. 若你是管理员，直接通过审批

### 3.6 记录凭证

左侧 → 「凭据与基础信息」→ 复制保存：

```
你的品牌名-管家:
  App ID:     cli_你的管家AppID
  App Secret: 你的管家AppSecret

你的品牌名-选题:
  App ID:     cli_你的选题AppID
  App Secret: 你的选题AppSecret

你的品牌名-写手:
  App ID:     cli_你的写手AppID
  App Secret: 你的写手AppSecret

你的品牌名-编辑:
  App ID:     cli_你的编辑AppID
  App Secret: 你的编辑AppSecret

你的品牌名-分发:
  App ID:     cli_你的分发AppID
  App Secret: 你的分发AppSecret
```

**5个应用全部重复以上流程后，进入下一步服务器配置。**

---

## 四、第二步：服务器配置

### 4.1 备份现有配置

```bash
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup-$(date +%Y%m%d%H%M)
```

### 4.2 更新 openclaw.json

核心改动三处：

**① agents.list — 添加5个角色**

```json
"list": [
  { "id": "main", "default": true, "name": "主助手",
    "workspace": "/root/.openclaw/workspace" },
  { "id": "steward", "name": "管家",
    "workspace": "/root/.openclaw/workspace-steward",
    "identity": { "name": "管家", "emoji": "🏠" },
    "model": { "primary": "anthropic/claude-opus-4-6" } },
  { "id": "scout", "name": "选题",
    "workspace": "/root/.openclaw/workspace-scout",
    "identity": { "name": "选题", "emoji": "🔥" },
    "model": { "primary": "anthropic/claude-opus-4-6" } },
  { "id": "writer", "name": "写手",
    "workspace": "/root/.openclaw/workspace-writer",
    "identity": { "name": "写手", "emoji": "✍️" },
    "model": { "primary": "anthropic/claude-opus-4-6" } },
  { "id": "editor", "name": "编辑",
    "workspace": "/root/.openclaw/workspace-editor",
    "identity": { "name": "编辑", "emoji": "🔍" },
    "model": { "primary": "anthropic/claude-opus-4-6" } },
  { "id": "distributor", "name": "分发",
    "workspace": "/root/.openclaw/workspace-distributor",
    "identity": { "name": "分发", "emoji": "📢" },
    "model": { "primary": "anthropic/claude-opus-4-6" } }
]
```

**② channels.feishu — 单账户升级为多账户**

> ⚠️ 原来的 appId/appSecret 迁入 `accounts.main`，不要丢失

```json
"feishu": {
  "enabled": true,
  "domain": "feishu",
  "dmPolicy": "open",
  "groupPolicy": "mention",
  "accounts": {
    "main": {
      "appId": "cli_你的主助手AppID",
      "appSecret": "你的主助手AppSecret"
    },
    "steward": {
      "appId": "cli_你的管家AppID",
      "appSecret": "你的管家AppSecret"
    },
    "scout": {
      "appId": "cli_你的选题AppID",
      "appSecret": "你的选题AppSecret"
    },
    "writer": {
      "appId": "cli_你的写手AppID",
      "appSecret": "你的写手AppSecret"
    },
    "editor": {
      "appId": "cli_你的编辑AppID",
      "appSecret": "你的编辑AppSecret"
    },
    "distributor": {
      "appId": "cli_你的分发AppID",
      "appSecret": "你的分发AppSecret"
    }
  }
}
```

**③ bindings — 添加飞书路由规则**

```json
"bindings": [
  { "agentId": "main",        "match": { "channel": "feishu", "accountId": "main" } },
  { "agentId": "steward",     "match": { "channel": "feishu", "accountId": "steward" } },
  { "agentId": "scout",       "match": { "channel": "feishu", "accountId": "scout" } },
  { "agentId": "writer",      "match": { "channel": "feishu", "accountId": "writer" } },
  { "agentId": "editor",      "match": { "channel": "feishu", "accountId": "editor" } },
  { "agentId": "distributor", "match": { "channel": "feishu", "accountId": "distributor" } },
  ... 原有的 telegram bindings 保留不变 ...
]
```

> ⚠️ **bindings 是数组追加，不是替换！** 原来的 Telegram bindings 要保留。

**④ tools — Agent 间通信（已存在则跳过）**

```json
"tools": {
  "agentToAgent": {
    "enabled": true,
    "allow": ["main", "steward", "scout", "writer", "editor", "distributor"]
  },
  "sessions": { "visibility": "all" }
}
```

### 4.3 创建 workspace 目录

```bash
mkdir -p /root/.openclaw/workspace-steward
mkdir -p /root/.openclaw/workspace-scout
mkdir -p /root/.openclaw/workspace-writer
mkdir -p /root/.openclaw/workspace-editor
mkdir -p /root/.openclaw/workspace-distributor
```

### 4.4 写入 AGENTS.md 身份文件

用 Python 脚本执行（避免 bash heredoc 中文解析问题）：

```bash
cat > /tmp/write_feishu_agents.py << 'PYEOF'
roles = {
    "steward": ("管家", "负责任务拆解、调度派活、跨角色协调。是团队中枢，了解所有角色职责，能把任务分配给合适的角色。"),
    "scout":   ("选题", "负责热点追踪、选题生成、爆款潜力评估。能快速判断一个话题是否值得写，并给出选题方向。"),
    "writer":  ("写手", "负责公众号文章创作，包括初稿、结构搭建、内容填充。擅长教知识、聊观点、讲故事三种文体。"),
    "editor":  ("编辑", "负责标题优化、内容精修、去AI味、敏感词检测、公众号排版。内容质量的最终把关人。"),
    "distributor": ("分发", "负责将公众号文章改写适配其他平台：小红书图文、推特Thread、朋友圈文案等。"),
}
team_info = "- 管家：调度\n- 选题：找话题\n- 写手：写文章\n- 编辑：改文章\n- 分发：发内容"
for role_id, (name, desc) in roles.items():
    content = (
        f"# 角色身份\n\n你叫「{name}」，是你的团队内容团队的成员。\n\n"
        f"## 职责\n\n{desc}\n\n"
        f"## 团队\n\n{team_info}\n\n"
        f"## 原则\n\n- 用中文回复\n- 简洁专业\n- 超出职责建议找对应角色\n"
    )
    path = f"/root/.openclaw/workspace-{role_id}/AGENTS.md"
    with open(path, "w") as f:
        f.write(content)
    print(f"OK {role_id} -> {name}")
print("Done")
PYEOF
python3 /tmp/write_feishu_agents.py
```

### 4.5 重启 Gateway

```bash
pkill -f openclaw-gateway
sleep 2
nohup openclaw gateway start > ~/.openclaw/gateway.log 2>&1 &
sleep 5
ps aux | grep openclaw | grep -v grep
```

### 4.6 验证通道状态

```bash
openclaw channels status --probe
```

预期输出：

```
Feishu main:        enabled, configured, running, works ✅
Feishu steward:     enabled, configured, running, works ✅
Feishu scout:       enabled, configured, running, works ✅
Feishu writer:      enabled, configured, running, works ✅
Feishu editor:      enabled, configured, running, works ✅
Feishu distributor: enabled, configured, running, works ✅
```

---

## 五、第三步：飞书群组配置（人工操作）

### 5.1 创建群组

1. 飞书搜索框旁边的 **+** → 「创建群组」
2. 群名：「你的团队-内容创作组」
3. 创建完成

### 5.2 添加机器人

1. 进入群组 → 右上角「设置」
2. 点击「群机器人」→「添加机器人」
3. 搜索并依次添加你的5个机器人

### 5.3 使用方式

在群里通过 **@机器人名** 触发对应角色：

```
@管家 帮我把这个需求拆解一下：我想写一篇关于DeepSeek的文章
@选题 分析一下这个选题的爆款潜力
@写手 写一篇教知识类的文章，主题是XXX
@编辑 帮我优化这篇文章的标题
@分发 把这篇文章改成小红书版本
```

---

## 六、踩坑指南

### 坑一：长连接报错「应用未建立长连接」
**原因**：飞书开放平台在配置事件时，检查 OpenClaw Gateway 是否已经建立 WebSocket 连接。
**解决**：先在服务器配置好 AppID/AppSecret 并重启 Gateway，再回飞书保存事件配置。

### 坑二：机器人不回复群消息
**原因**：默认 `requireMention: true`，需要 @机器人 才响应。
**验证**：先在私聊里直接发消息测试，排除配置问题。

### 坑三：所有机器人都回复同一条消息
**原因**：OpenClaw 旧版本 mention 检查有 Bug（Issue #8692），只验证消息中"有 mention"但不验证"是不是 mention 当前 Bot"。
**解决**：
1. 始终用 `requireMention: true`（默认值，不要改成 false）
2. 飞书平台保证 @A 的消息只推送给 A 的 WebSocket 连接，平台层天然隔离

### 坑四：私聊需要配对（配对码流程）
**原因**：`dmPolicy` 默认是 `"pairing"`，首次私聊会弹出配对码。
**解决**：在配置中设置 `dmPolicy: "open"` 跳过配对，或者按提示在服务器终端执行配对命令。

### 坑五：单账户配置迁移丢失主助手
**原因**：将原来的 `appId/appSecret` 直接替换为 `accounts` 结构，忘记把原账户迁进去。
**解决**：原有配置迁入 `accounts.main`，原 `appId/appSecret` 字段删除，不能两者共存。

### 坑六：bindings 被覆盖，Telegram 路由失效
**原因**：更新配置时把 bindings 整体替换，原来的 Telegram binding 被删掉了。
**解决**：bindings 是数组，只追加新条目，原有条目保留。

### 坑七：应用发布后飞书里找不到机器人
**原因**：飞书企业应用发布需要管理员审批，审批没通过前搜不到。
**解决**：去「版本管理与发布」确认版本状态，若需审批找企业管理员通过。

### 坑八：群机器人面板没有「添加机器人」按钮
**原因**：页面首次加载失败（网络抖动）或权限问题，导致「群机器人」面板只显示已有 bot 列表，按钮缺失。

**解法一（手机 App，最简单，优先试）**：直接用手机飞书操作 → 进群 → 右上角「...」→「群机器人」→「添加机器人」，手机端渲染更完整，按钮几乎必出现。

**解法二（刷新网页端）**：退出群设置，重新进入群组 → 右上角设置 → 「群机器人」，在**已有机器人列表下方**翻找「添加机器人」按钮（有时需要滚动才能看到）。

**解法三（API，前两种都失效时用）**：
1. 在飞书群里随便发一条消息（如"test"）
2. 立刻去服务器捞 OpenClaw 日志，找到含 `chat_id` 的行：
   ```bash
   tail -f ~/.openclaw/gateway.log | grep chat_id
   ```
3. 拿到 `chat_id` 后，用飞书 API 批量把多个 bot 加入群组（可一次调用，无需逐个操作）
   - 接口：`POST https://open.feishu.cn/open-apis/im/v1/chats/{chat_id}/members`
   - 参数：`member_id_type: app_id`，`id_list: [appId1, appId2, ...]`

### 坑九：多账户配置后所有飞书bot全部串角色（核心坑）

**现象**：多个飞书bot无论哪个账号收到消息，全都回复同一个角色身份（比如都回「选题」）。

**根本原因**：OpenClaw v2026.3.1 飞书channel存在session dispatch bug——所有飞书消息在分发时，session统一写成 `agent:main:main`，不管binding路由到了哪个agent，都共用同一个session历史。binding配置本身没有问题，但session隔离没有生效。

**排查方法**：
```bash
# 查看最新session文件内容，确认是否所有飞书消息共用同一个session
ls -lt /root/.openclaw/agents/main/sessions/
tail -30 /root/.openclaw/agents/main/sessions/最新的.jsonl | grep '"role"'
# 如果看到所有飞书消息都在同一个jsonl文件里，说明命中此坑
```

**变通方案（已验证有效）**：利用飞书消息内自带的账号前缀做路由，在全局AGENTS.md实现多角色切换。

飞书消息格式发现：每条user消息开头都有 `Feishu[accountname]` 前缀，如：
```
Feishu[writer] DM from ou_xxx: 你是谁
Feishu[steward] DM from ou_xxx: 帮我拆解任务
```

**操作步骤**：

1. 将 `/root/.openclaw/workspace/AGENTS.md`（全局workspace）改写为多角色路由提示词：

```bash
cat > /tmp/write_global_agents.py << 'PYEOF'
content = """# 多角色路由系统

你是内容创作团队的AI员工系统。每条飞书消息开头都会标注是哪个账号收到的，格式为 `Feishu[账号名]`。

## 角色切换规则

收到消息时，先看消息开头的 `Feishu[xxx]` 标识，然后完全切换成对应角色：

| Feishu账号 | 你的角色 | 你的身份 |
|-----------|---------|---------|
| Feishu[steward] | 管家 | 团队的智能调度中枢，协调各AI角色 |
| Feishu[scout] | 选题 | 选题猎手，负责热点追踪、选题挖掘、爆款评估 |
| Feishu[writer] | 写手 | 核心产出者，写教知识/讲故事/聊观点类文案 |
| Feishu[editor] | 编辑 | 内容编辑，负责稿件审核、结构优化、内容打磨 |
| Feishu[distributor] | 分发 | 多平台内容适配和发布 |
| Feishu[main] | 总助手 | 团队AI助手，负责综合协调 |

## 执行规则

1. 每条消息先识别 `Feishu[xxx]` → 切换到对应角色
2. 用对应角色的身份、职责和语气回复
3. 如果没有 `Feishu[xxx]` 标识，以总助手身份回复
4. 回复简洁，像搭档不像秘书
"""
with open("/root/.openclaw/workspace/AGENTS.md", "w") as f:
    f.write(content)
print("Done")
PYEOF
python3 /tmp/write_global_agents.py
```

2. 清除旧session历史（必须，否则旧上下文会干扰角色切换）：
```bash
find /root/.openclaw/agents/main/sessions/ -name "*.jsonl" -delete
echo "sessions cleared"
```

3. 重启Gateway：
```bash
pkill -f openclaw-gateway && sleep 2
nohup openclaw gateway start > ~/.openclaw/gateway.log 2>&1 &
sleep 5
openclaw gateway status
```

4. 去飞书给不同bot各发"你是谁"，确认各自回复对应角色。

> ⚠️ **注意**：此方案下各角色共享同一个session历史（飞书平台层的bug所致），角色上下文不完全隔离。如果后续OpenClaw修复此bug，可恢复为各agent独立session的方案。

### 坑十：飞书allowFrom为空，私聊无法触发bot

**现象**：私聊bot时出现"access not configured"或bot无响应，WebUI能看到pairing code界面。

**原因**：openclaw.json中各飞书账号的 `allowFrom` 字段默认为空列表 `[]`，导致没有任何用户被授权与bot私聊。只有 `default` 账号默认为 `['*']`（允许所有人）。

**解决**：用Python脚本批量给所有账号的allowFrom添加你的飞书用户ID（`ou_xxx...`格式，可从"access not configured"页面复制）：

```bash
cat > /tmp/fix_allowfrom.py << 'PYEOF'
import json

config_path = "/root/.openclaw/openclaw.json"
your_feishu_id = "ou_替换为你的飞书用户ID"  # 替换为你的飞书ID

with open(config_path, "r") as f:
    config = json.load(f)

feishu = config["channels"]["feishu"]
accounts = feishu.get("accounts", {})

for account_id, account_data in accounts.items():
    if isinstance(account_data, dict):
        allow_from = account_data.get("allowFrom", [])
        if your_feishu_id not in allow_from:
            allow_from.append(your_feishu_id)
            account_data["allowFrom"] = allow_from
            print(f"Updated {account_id}: {allow_from}")

with open(config_path, "w") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)
print("Done - restart gateway to apply")
PYEOF
python3 /tmp/fix_allowfrom.py
# 改完重启Gateway
pkill -f openclaw-gateway && sleep 2
nohup openclaw gateway start > ~/.openclaw/gateway.log 2>&1 &
```

> 你的飞书用户ID（ou_xxx格式）可以从bot回复的"access not configured"页面找到，格式固定。

### 坑十一：agent独立workspace路径说明（无需config字段）

**背景**：在 `openclaw.json` 的 agent 列表里配置了 `workspace` 字段，但实测发现配置了 `workspacePath` 等无效字段会导致Gateway启动失败（`openclaw doctor --fix` 可自动修复）。

**正确的独立workspace约定路径**（OpenClaw自动识别，无需任何config字段）：
```
/root/.openclaw/agents/{agentId}/workspace/AGENTS.md
```

例如：
- 选题的身份文件：`/root/.openclaw/agents/scout/workspace/AGENTS.md`
- 写手的身份文件：`/root/.openclaw/agents/writer/workspace/AGENTS.md`

**验证**：在WebUI发消息 `agent:scout:test1 你是谁`，应该得到scout的角色回复（不是main的角色）。

> ⚠️ 注意：飞书channel存在session bug（见坑九），这些独立workspace对Telegram和WebUI有效，飞书需要用全局AGENTS.md路由方案。

### 坑十二：飞书 API 月调用额度被快速耗尽（多bot × 60秒轮询）

**现象**：收到报错「当月已使用：50000 / 当月总额度：50000，API 请求会被拒绝」。

**根本原因**：OpenClaw 网关每 60 秒调用一次 `/open-apis/bot/v3/info` 健康检查。多个 bot 的实际消耗公式：`bot数量 × 1次/分 × 43200分/月`，免费版 5 万次几天就烧完。

**不花钱的修复方案（推荐）**：给 `probe.ts` 加缓存，成功结果缓存 12 小时，失败结果缓存 1 分钟，调用量降 99%。

1. 查看当前文件：
   ```bash
   cat ~/.openclaw/extensions/feishu/src/probe.ts
   ```
2. 在探针函数顶部加缓存 Map：
   ```typescript
   const probeCache = new Map<string, { result: any; expiry: number }>();
   const SUCCESS_CACHE_TTL = 60 * 60 * 1000 * 12; // 12小时
   const FAILURE_CACHE_TTL = 60 * 1000;             // 1分钟
   ```
3. 每次 probe 调用前先查缓存，命中则直接返回，否则真实调用后写入缓存
4. 修改后重启 Gateway：
   ```bash
   pkill -f openclaw-gateway && sleep 2
   nohup openclaw gateway start > ~/.openclaw/gateway.log 2>&1 &
   ```

**如必须升级**：商业版不限 API 调用次数，官方定价 50元/人/月（仅真人账号算席位，bot 不占席位），1个人用全年 600 元。按年付费，无月付选项。

---

## 七、与 Telegram 方案对比总结

| 维度 | Telegram 方案 | 飞书方案 |
|------|-------------|---------|
| 隔离机制 | Forum 话题（每个Bot独占话题空间） | @机器人（飞书平台层路由） |
| 无需 @就响应 | 话题内配置 `requireMention: false` | 需申请 `im:message.group_msg` 敏感权限 |
| 创建 Bot 限速 | BotFather 有限流（5个/天） | 飞书开放平台无限制 |
| 配置复杂度 | 较高（需手动拿 topic_id） | 中等（飞书后台操作繁琐但有 UI） |
| 国内可用性 | 需要代理 | 直接可用 |
| 同一服务器共存 | 支持 | 支持（accounts 结构共存） |

---

## 八、执行清单

**你需要做的（飞书开放平台，逐个应用重复）：**

- [ ] 创建企业自建应用（5个）
- [ ] 每个应用：添加机器人能力
- [ ] 每个应用：事件配置 → 长连接 → 添加「接收消息」等事件
- [ ] 每个应用：回调配置 → 长连接
- [ ] 每个应用：批量导入权限 JSON
- [ ] 每个应用：创建版本并发布
- [ ] 记录5组 App ID + App Secret

**服务器端配置：**

- [ ] 更新 openclaw.json（agents + channels + bindings）
- [ ] 创建 workspace 目录并写入 AGENTS.md
- [ ] 重启 Gateway
- [ ] 验证通道状态

**飞书群组配置：**

- [ ] 创建群组
- [ ] 添加5个机器人进群
- [ ] 测试 @各角色

---

*本手册基于多 Agent 实战经验 + 飞书官方文档 + OpenClaw 深度调研整理，覆盖所有已知踩坑。*
