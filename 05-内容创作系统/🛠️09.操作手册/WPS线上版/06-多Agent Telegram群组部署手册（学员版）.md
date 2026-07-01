# 【学员版】多Agent Telegram群组部署手册

> 版本：v1.0（学员版）
> 适用场景：OpenClaw 多 Bot 接入 Telegram Forum 群组，实现多角色 AI 协作
> 本手册基于实战经验整理，包含25个踩坑记录，建议配合课程第11-13节学习

---

## 一、系统概览

### 框架与定位

- **框架**：OpenClaw + Telegram Forum 超级群组
- **服务器**：推荐海外节点的云服务器（如韩国、日本、新加坡），确保 Telegram API 可达
- **理念**：多个 AI Bot 分工协作，每个 Bot 负责一个专业角色，通过 Telegram Forum 群组实现团队化运作

### 角色设计（5个基础角色，可扩展更多）

| 角色 | Bot Username（自定义） | 话题 | 职责 |
|------|----------------------|------|------|
| 🏠 管家 | 你的品牌名+StewardBot | 管家 | 任务拆解、调度派活、跨角色协调 |
| 🔥 选题 | 你的品牌名+ScoutBot | 选题 | 热点追踪、选题生成、爆款评估 |
| ✍️ 写手 | 你的品牌名+WriterBot | 写手 | 公众号文章创作、初稿输出 |
| 🔍 编辑 | 你的品牌名+EditorBot | 编辑 | 标题优化、内容精修、去AI味、排版 |
| 📢 分发 | 你的品牌名+DistBot | 分发 | 多平台改写（小红书/推特/朋友圈） |

> 💡 5个基础角色足够覆盖内容创作全流程。后续可根据需要扩展更多角色，如：📊数据分析、📈增长运营、🧠战略顾问等。扩展方法与基础角色完全一致。

---

## 二、前置准备

### 2.1 服务端环境

- OpenClaw 已安装并可用（`openclaw --version` 验证）
- 模型配置（`~/.openclaw/.env` 或系统环境变量）：

```
ANTHROPIC_API_KEY=你的APIKey
ANTHROPIC_BASE_URL=你的API地址
ANTHROPIC_MODEL=你的模型名
```

> ⚠️ **踩坑①**：模型名必须和你的 API 供应商支持的模型名完全一致，否则会报 `HTTP 403: This token has no access to model`。
> ✅ 先确认供应商支持哪些模型名，再填入配置。

### 2.2 Telegram 准备清单

- [ ] 在 BotFather 创建所有 Bot，关闭 Privacy Mode（`/setprivacy` → `Disable`）
- [ ] 创建 Telegram 超级群组，开启 Topics（论坛）模式
- [ ] 在群组中为每个角色创建对应话题
- [ ] 将所有 Bot 添加进群组并设为管理员
- [ ] 记录：群组 ID、每个话题 ID、每个 Bot Token

> ⚠️ **踩坑②**：BotFather 限流，一次最多创建 5 个 Bot，超限后需等待约 24 小时。
> ✅ 解决：分批创建，5 个一组，隔天再建剩余的。

> ⚠️ **踩坑③**：如何获取话题 ID？在群组里建好话题后，发一条消息，Telegram API 返回的 `message_thread_id` 就是话题 ID。
> 也可以用 Bot Token 调用 `getUpdates` 获取。

---

## 三、配置文件结构（openclaw.json）

路径：`~/.openclaw/openclaw.json`

> ⚠️ 每次修改前务必备份：
> ```bash
> cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup-$(date +%Y%m%d%H%M)
> ```

### 3.1 完整结构示意

```json
{
  "agents": {
    "defaults": {
      "model": { "primary": "anthropic/你的模型名" }
    },
    "list": [ ... ]
  },
  "bindings": [ ... ],
  "tools": { ... },
  "channels": {
    "telegram": { ... }
  }
}
```

### 3.2 agents.list 配置

```json
"list": [
  { "id": "main", "default": true, "name": "默认助手" },
  {
    "id": "steward",
    "name": "管家",
    "workspace": "/root/.openclaw/workspace-steward",
    "identity": { "name": "管家", "emoji": "🏠" },
    "model": { "primary": "anthropic/你的模型名" }
  },
  {
    "id": "scout",
    "name": "选题",
    "workspace": "/root/.openclaw/workspace-scout",
    "identity": { "name": "选题", "emoji": "🔥" },
    "model": { "primary": "anthropic/你的模型名" }
  },
  {
    "id": "writer",
    "name": "写手",
    "workspace": "/root/.openclaw/workspace-writer",
    "identity": { "name": "写手", "emoji": "✍️" },
    "model": { "primary": "anthropic/你的模型名" }
  },
  {
    "id": "editor",
    "name": "编辑",
    "workspace": "/root/.openclaw/workspace-editor",
    "identity": { "name": "编辑", "emoji": "🔍" },
    "model": { "primary": "anthropic/你的模型名" }
  },
  {
    "id": "distributor",
    "name": "分发",
    "workspace": "/root/.openclaw/workspace-distributor",
    "identity": { "name": "分发", "emoji": "📢" },
    "model": { "primary": "anthropic/你的模型名" }
  }
]
```

### 3.3 bindings 配置

```json
"bindings": [
  { "agentId": "steward",     "match": { "channel": "telegram", "accountId": "steward" } },
  { "agentId": "scout",       "match": { "channel": "telegram", "accountId": "scout" } },
  { "agentId": "writer",      "match": { "channel": "telegram", "accountId": "writer" } },
  { "agentId": "editor",      "match": { "channel": "telegram", "accountId": "editor" } },
  { "agentId": "distributor", "match": { "channel": "telegram", "accountId": "distributor" } }
]
```

### 3.4 tools 配置

```json
"tools": {
  "agentToAgent": {
    "enabled": true,
    "allow": ["main", "steward", "scout", "writer", "editor", "distributor"]
  },
  "sessions": { "visibility": "all" }
}
```

### 3.5 channels.telegram 配置（关键！多踩坑处）

```json
"telegram": {
  "enabled": true,
  "streamMode": "block",
  "accounts": {
    "steward": {
      "botToken": "你的BotToken",
      "dmPolicy": "allowlist",
      "allowFrom": ["tg:你的用户ID"],
      "groups": {
        "你的群组ID": {
          "groupPolicy": "allowlist",
          "allowFrom": ["tg:你的用户ID"],
          "requireMention": true,
          "topics": {
            "管家话题ID":  { "requireMention": false },
            "选题话题ID":  { "requireMention": true, "groupPolicy": "disabled" },
            "写手话题ID": { "requireMention": true, "groupPolicy": "disabled" },
            "编辑话题ID": { "requireMention": true, "groupPolicy": "disabled" },
            "分发话题ID": { "requireMention": true, "groupPolicy": "disabled" }
          }
        }
      }
    },
    "scout": {
      "botToken": "你的BotToken",
      "dmPolicy": "allowlist",
      "allowFrom": ["tg:你的用户ID"],
      "groups": {
        "你的群组ID": {
          "groupPolicy": "allowlist",
          "allowFrom": ["tg:你的用户ID"],
          "requireMention": true,
          "topics": {
            "管家话题ID":  { "requireMention": true, "groupPolicy": "disabled" },
            "选题话题ID":  { "requireMention": false },
            "写手话题ID": { "requireMention": true, "groupPolicy": "disabled" },
            "编辑话题ID": { "requireMention": true, "groupPolicy": "disabled" },
            "分发话题ID": { "requireMention": true, "groupPolicy": "disabled" }
          }
        }
      }
    }
    // writer / editor / distributor 同理，每个 Bot 只在自己的话题 requireMention: false
    // 其他话题全部 groupPolicy: disabled
  }
}
```

> ⚠️ **踩坑④（最重要）**：`groups` 配置必须放在**每个 account 内部**，不能放在顶层 `telegram` 下。
>
> ❌ 错误写法（所有 Bot 共享一个 groups → 所有Bot都回复所有话题）：
> ```json
> "telegram": {
>   "groups": { "-100xxx": { ... } },   ← 错！
>   "accounts": { "steward": {...} }
> }
> ```
>
> ✅ 正确写法：groups 在每个 account 里单独配置，每个 Bot 只在自己话题自由回复，其他话题设为 disabled。

> ⚠️ **踩坑⑤**：`groups` 是对象（object），key 是群组 ID 字符串，不是数组。
>
> ❌ 错误：`"groups": [{ "id": "-100xxx", ... }]`
> ✅ 正确：`"groups": { "-100xxx": { ... } }`

> ⚠️ **踩坑⑥**：用户白名单格式是 `"tg:userId"`，不是纯数字数组。
>
> ❌ 错误：`"allowFrom": [7825541463]`
> ✅ 正确：`"allowFrom": ["tg:你的用户ID"]`

---

## 四、角色身份文件（AGENTS.md）

每个 Agent workspace 下放一个 `AGENTS.md`，Gateway 启动时会加载作为系统 prompt。

路径：`/root/.openclaw/workspace-{role_id}/AGENTS.md`

### 示例：管家

```markdown
# 角色身份

你叫「管家」，是你的团队的内容团队成员。

## 职责

负责任务拆解、调度派活、跨角色协调。是团队中枢，了解所有角色职责，能把任务分配给合适的角色。

## 团队

- 管家：调度
- 选题：找话题
- 写手：写文章
- 编辑：改文章
- 分发：发内容

## 原则

- 用中文回复
- 简洁专业
- 超出职责建议找对应角色
```

> ⚠️ **踩坑⑦**：在 bash heredoc 中直接写中文内容会被 shell 误解析（中文引号等特殊字符）。
>
> ✅ 解决方案：把内容写成 Python 脚本存到 `/tmp/write_agents.py`，再用 `python3 /tmp/write_agents.py` 执行写入。

---

## 五、启动与验证

### 5.1 启动 Gateway

```bash
# 前台运行（测试用）
openclaw gateway start

# 后台运行（生产用）
nohup openclaw gateway start > ~/.openclaw/gateway.log 2>&1 &

# 验证进程
ps aux | grep openclaw | grep -v grep
```

### 5.2 重启 Gateway（修改配置后）

```bash
pkill -f openclaw-gateway
sleep 2
nohup openclaw gateway start > ~/.openclaw/gateway.log 2>&1 &
```

### 5.3 验证各 Bot 状态

```bash
openclaw gateway status
```

应显示所有 Telegram accounts 均为 running 状态。

### 5.4 测试 Bot 回复

```python
python3 -c "
import urllib.request, json
token = '你的BotToken'
data = json.dumps({
    'chat_id': '你的群组ID',
    'message_thread_id': 你的话题ID,
    'text': '你是谁？你负责什么？'
}).encode()
req = urllib.request.Request(
    f'https://api.telegram.org/bot{token}/sendMessage',
    data=data,
    headers={'Content-Type': 'application/json'}
)
print(urllib.request.urlopen(req).read().decode())
"
```

> ℹ️ 发出后等 30-60 秒，Bot 会自动回复（模型响应需要时间）。

---

## 六、扩展更多角色

当5个基础角色不够用时，可以按以下步骤扩展：

1. 在 BotFather 创建新 Bot，关闭 Privacy Mode
2. 将新 Bot 加入群组并设为管理员
3. 在 Telegram 群组中创建新话题
4. 更新 openclaw.json（新增 agent + binding + agentToAgent + account 配置）
5. 创建新角色的 AGENTS.md 身份文件
6. 重启 Gateway，验证新 Bot 正常回复

> 💡 扩展角色的配置方式与基础角色完全一致，参照第三、四章的格式即可。

---

## 七、常见问题速查

| 问题 | 原因 | 解决 |
|------|------|------|
| `HTTP 403: no access to model` | 模型名不对 | 改为 API 供应商支持的模型名 |
| 所有Bot都回复同一条消息 | groups 配置放在顶层而非每个 account 内 | groups 移入每个 account，其他话题设 disabled |
| Bot 不回复 | Privacy Mode 未关闭 / Bot 不是管理员 | BotFather 关 Privacy Mode，群内设管理员 |
| Gateway 启动报错 schema | groups 写成了数组 | 改为以群组ID为 key 的对象 |
| 中文写入报 bash 语法错误 | shell 误解析中文引号 | 用 Python 脚本写文件，避开 heredoc |
| getUpdates 返回空 | Gateway 已接管轮询，update 被消费 | 正常现象，直接看 Telegram 群即可 |
| `401 Unauthorized - Invalid API Key` | API key 过期/被封，或 API 地址错误 | 参考下方「API切换排错」章节 |
| `model_not_found: No available channel` | API 供应商不支持该模型名 | 改为供应商支持的模型名 |
| `403 User ID temporarily suspended` | 旧 API key 被封禁 | 换新 key，更新全部三处配置 |

---

## 八、API切换排错

> **背景**：当你的 API 供应商出问题（key 被封、服务下线等），需要切换到新的供应商。切换时容易遗漏配置项，导致所有 Bot 报错。

### 8.1 核心教训：改API必须改三处

OpenClaw Gateway 的 API 配置分散在**三个位置**，缺一不可：

| 位置 | 路径 | 作用 |
|------|------|------|
| ① 系统环境变量 | `/root/.bashrc` | Gateway 启动时读取的默认值 |
| ② systemd 服务文件 | `~/.config/systemd/user/openclaw-gateway.service` | systemd 管理的服务环境变量（覆盖 .bashrc） |
| ③ 每个Agent的模型配置 | `~/.openclaw/agents/*/agent/models.json` | **每个Agent单独的API配置（优先级最高！）** |

> ⚠️ **踩坑⑧（血泪教训）**：只改了环境变量不够！`models.json` 里硬编码了 `baseUrl`、`apiKey` 和模型 `id`，Gateway 实际请求时**以 models.json 为准**。
>
> 这意味着：你改了 .bashrc 和 systemd 里的 key，但如果 models.json 里还是旧的 key，Bot 照样报 401。

### 8.2 完整切换步骤

**第一步：更新 .bashrc**

```bash
vim /root/.bashrc
# 找到并修改这三行：
export ANTHROPIC_API_KEY=你的新APIKey
export ANTHROPIC_BASE_URL=你的新API地址
export ANTHROPIC_MODEL=你的新模型名

source /root/.bashrc
```

**第二步：更新 systemd 服务文件**

```bash
vim ~/.config/systemd/user/openclaw-gateway.service
# 修改 [Service] 下的 Environment 行：
# Environment=ANTHROPIC_API_KEY=你的新APIKey
# Environment=ANTHROPIC_BASE_URL=你的新API地址
# Environment=ANTHROPIC_MODEL=你的新模型名

systemctl --user daemon-reload
```

**第三步：批量更新所有 Agent 的 models.json（最关键！）**

```bash
# 更新 baseUrl 和 apiKey
for f in /root/.openclaw/agents/*/agent/models.json; do
  python3 -c "
import json
d = json.load(open('$f'))
d['providers']['anthropic']['baseUrl'] = '你的新API地址'
d['providers']['anthropic']['apiKey'] = '你的新APIKey'
json.dump(d, open('$f', 'w'), indent=2)
print('updated', '$f')
"
done

# 更新模型名（API供应商可能不支持某些模型名！）
for f in /root/.openclaw/agents/*/agent/models.json; do
  python3 -c "
import json
d = json.load(open('$f'))
for m in d['providers']['anthropic']['models']:
    m['id'] = '你的新模型名'
    m['name'] = '你的新模型名'
json.dump(d, open('$f', 'w'), indent=2)
print('updated', '$f')
"
done
```

**第四步：重启 Gateway**

```bash
systemctl --user restart openclaw-gateway
# 验证启动
journalctl --user -u openclaw-gateway --no-pager -n 20
```

**第五步：验证**

```bash
# 1. 直接 curl 测试 API 连通性
curl -s 你的API地址/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: 你的APIKey" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model":"你的模型名","max_tokens":30,"messages":[{"role":"user","content":"say ok"}]}'

# 2. 验证 Gateway 进程环境变量确实是新的
cat /proc/$(pgrep -f openclaw-gateway | head -1)/environ | tr '\0' '\n' | grep ANTHROPIC

# 3. 验证 models.json 确实更新了
python3 -c "
import json
d = json.load(open('/root/.openclaw/agents/steward/agent/models.json'))
print('baseUrl:', d['providers']['anthropic']['baseUrl'])
print('model:', d['providers']['anthropic']['models'][0]['id'])
"

# 4. 去 Telegram 每个频道发 "说ok" 测试
```

### 8.3 排错技巧

> ⚠️ **踩坑⑨**：`models.json` 的结构是 `providers.anthropic.models[]`，不是顶层 `models[]`。批量脚本写错路径会静默失败。
>
> ⚠️ **踩坑⑩**：不同 API 供应商的模型名可能不一样。**切换供应商后一定要测试模型名是否可用。**
>
> ⚠️ **踩坑⑪**：OpenClaw 使用 `Authorization: Bearer` header（不是 `x-api-key`），验证时两种方式都测一下：
> ```bash
> # 用 x-api-key（Anthropic 官方方式）
> curl ... -H "x-api-key: 你的APIKey"
> # 用 Authorization Bearer（OpenClaw 实际使用的方式）
> curl ... -H "Authorization: Bearer 你的APIKey"
> ```
>
> ⚠️ **踩坑⑫（扩团必踩）**：新增 Bot 时漏配 `groupPolicy`，导致群消息被静默丢弃。
>
> **症状**：Bot 在私信能正常回复，但发到 Telegram 群里完全没反应，日志也无报错，像 Bot 不存在一样。
>
> **根因**：`openclaw.json` 的 `channels.telegram.accounts[botName]` 没有 `groupPolicy` 字段时，默认行为是拒收所有群消息。旧的 Bot 靠早期 wizard 引导时自动写入了该字段，后来手动补加的 Bot 没有。
>
> **排查方式**：
> ```python
> import json
> d = json.load(open("/root/.openclaw/openclaw.json"))
> a = d["channels"]["telegram"]["accounts"]
> for k, v in a.items():
>     if "groupPolicy" not in v:
>         print(f"❌ {k}: 缺少 groupPolicy")
> ```
>
> **修复方式**：为每个缺失的 Bot 补上 `"groupPolicy": "allowlist"`，然后重启 gateway。
>
> ⚠️ **踩坑⑬**：Gateway 重启命令不是 `systemctl`，用错命令无提示报错。
>
> **症状**：`systemctl restart openclaw-gateway` 返回 "Unit not found" 或无响应，但 Gateway 进程实际在运行。
>
> **根因**：OpenClaw Gateway 不是以 systemd service 方式管理的，进程名为 `openclaw-gateway`，用 pm2 或直接 shell 后台运行。
>
> **正确命令**：
> ```bash
> openclaw gateway start          # 启动/重启 gateway
> ps aux | grep -i gateway        # 确认进程是否在运行
> ```
>
> ⚠️ **踩坑⑭**：Forum 群组（Topics 超级群组）中，向 General 话题发消息，所有 Bot 都不回复。
>
> **症状**：在群里发消息没有回复，但单独私信 Bot 是正常的。
>
> **根因**：Telegram Forum 群组每个话题（Topic）是独立的消息线程，Bot 只监听自己配置的 `topics` 里的 thread ID。General 话题的 ID 通常是 0 或无 thread，不在任何 Bot 的监听范围。
>
> **正确操作**：必须进入对应 Bot 的专属话题（如"选题"话题）才能触发该 Bot 回复。发消息前确认左上角显示的是正确的话题名。
>
> ⚠️ **踩坑⑮**：`@call` 协作指令失效，Bot 收到指令但无法路由到目标 Bot。
>
> **症状**：选题 Bot 在自己的话题里回复了，并且输出了 `@call writer` 指令，但写手 Bot 没有任何反应，等待数分钟仍无回复。
>
> **根因**：OpenClaw 的 `@call` 路由依赖每个 Bot account 的 `topics` 配置。新增的 Bot 若 `topics` 是空数组 `[]`，框架不知道该把消息路由到哪个 thread，`@call` 静默失效。
>
> **排查方式**：
> ```python
> import json
> d = json.load(open("/root/.openclaw/openclaw.json"))
> a = d["channels"]["telegram"]["accounts"]
> for k, v in a.items():
>     topics = v.get("topics", [])
>     if not topics or topics == []:
>         print(f"❌ {k}: topics 为空，@call 无法路由")
> ```
>
> **修复方式**：为每个 Bot 配置其专属话题 ID（话题 ID 获取方式见踩坑③）。所有 Bot 的 topics 配好后重启 gateway，再测试 `@call` 链路。

> ⚠️ **踩坑⑯**：切换到非 Anthropic provider 时，模型名、provider 字段、api 字段都要对应修改，光换 key 不够。
>
> **要点**：从一个 provider 换到另一个时，models.json 除了 `baseUrl` 和 `apiKey`，还需要确认：
> - `"api": "openai-completions"` — 如果新供应商用 OpenAI 兼容格式需要设置
> - `"id"` — 模型名必须和供应商支持的一致
> - `"compat.supportsStore": false` — 部分模型不支持 prompt caching，需关闭
>
> **批量更新脚本**（更换 provider 时使用）：
> ```python
> import json, os, glob
> NEW_BASE_URL = "你的新API地址"
> NEW_API_KEY = "你的新APIKey"
> NEW_MODEL_ID = "你的新模型名"
> NEW_MODEL_NAME = "模型显示名称"
>
> for f in glob.glob(os.path.expanduser("~/.openclaw/agents/*/agent/models.json")):
>     d = json.load(open(f))
>     for pval in d.get("providers", {}).values():
>         if "baseUrl" in pval: pval["baseUrl"] = NEW_BASE_URL
>         if "apiKey" in pval: pval["apiKey"] = NEW_API_KEY
>         for m in pval.get("models", []):
>             m["id"] = NEW_MODEL_ID
>             if "name" in m: m["name"] = NEW_MODEL_NAME
>     json.dump(d, open(f, "w"), indent=2, ensure_ascii=False)
>     print(f"✅ {f.split('/agents/')[1].split('/')[0]}")
> ```
> 改完运行 `openclaw gateway start` 重启。

> ⚠️ **踩坑⑰**：**agentId 必须用英文，中文会导致 binding 完全失效。**
>
> **现象**：所有 Bot 全部回复"我是总助手"，日志显示所有消息路由到 `lane-session:agent:main:telegram`，binding 形同虚设。
>
> **根本原因**：OpenClaw 的 binding 匹配逻辑不兼容中文 agentId（如"管家""写手"），匹配失败后 fallback 到 `agent:main`。
>
> **修复**：把 `agents.list` 里每个 agent 的 `id` 改成英文，同时同步更新 `bindings` 里的 `agentId`。改完重启 Gateway 即生效。

---

## 九、Scout 热点推送配置（Brave Search + Cron 定时任务）

### 9.1 配置 Brave Search API

Scout 默认只能用 Google News RSS 等公开渠道搜索热点，信息质量有限。配置 Brave Search API 后，Scout 可以用 `web_search` 工具联网搜索，信息质量大幅提升。

**步骤：**

1. **注册 Brave Search API**
   - 访问 https://brave.com/search/api/
   - 注册账号，选择 Free 计划（$5/月免费额度，约1000次查询）
   - 进入 Dashboard → Keys → 创建 API Key

2. **在 OpenClaw 中配置**
   ```bash
   openclaw configure --section web
   ```
   交互式配置：
   - Where will the Gateway run? → **Local (this machine)**
   - Enable web_search (Brave Search)? → **Yes**（用左箭头切换到 Yes）
   - Brave Search API key → **粘贴你的 API Key**（不要留空直接回车，必须输入 key）
   - Enable web_fetch (keyless HTTP fetch)? → **Yes**

   > ⚠️ **踩坑⑱**：API key 输入框有默认提示 `BSA...`，容易误以为已填入而直接回车。实际上是空的，必须手动粘贴 key 再回车，否则会提示 "No key stored yet, so web_search will stay unavailable"。

3. **重启 Gateway 使配置生效**
   ```bash
   openclaw gateway restart
   ```

4. **验证**
   ```bash
   # 检查配置是否写入
   grep -i "brave\|web_search\|webSearch" ~/.openclaw/openclaw.json
   ```
   应该能看到 web search 相关配置。

### 9.2 配置 Cron 定时推送

Scout 通过 cron 定时任务自动搜索热点并推送到消息群。

**创建 cron 任务：**

```bash
# 早上9点推送
openclaw cron create \
  --name "每日选题巡查" \
  --cron "0 9 * * *" \
  --tz "Asia/Shanghai" \
  --message "[每日热点巡查]" \
  --to "你的消息群chat_id" \
  --session isolated \
  --session-key "agent:scout:feishu:scout" \
  --timeout-seconds 180
```

**参数说明：**
- `--to`：消息群的 chat_id（在开放平台 → 事件订阅中获取）
- `--session isolated`：使用独立 session，不污染主会话
- `--session-key`：路由到 scout agent 的 session
- `--timeout-seconds 180`：搜索+生成报告需要时间，设为3分钟

**管理 cron：**
```bash
# 查看所有定时任务
openclaw cron list

# 手动触发一次（测试用）
openclaw cron run <cron-id>

# 删除定时任务
openclaw cron delete <cron-id>
```

> ⚠️ **踩坑⑲**：`openclaw cron run` 的 CLI 会在约30秒后超时（显示 gateway timeout），但任务在后台继续运行（约1-2分钟完成），这是正常现象，不用管超时提示。

> ⚠️ **踩坑⑳**：没有 `openclaw cron update` 命令。如需修改 cron 配置（如改时间），只能删掉旧的再创建新的。

### 9.3 配置 HEARTBEAT.md（Scout 的行为指令）

HEARTBEAT.md 控制 Scout 收到 `[每日热点巡查]` 指令时的行为，包括搜索关键词、输出格式、评分规则等。

**文件位置：** `/root/.openclaw/workspace-scout/HEARTBEAT.md`

**关键配置项：**
- 搜索关键词分组（按你的领域分类）
- 重点关注的社媒账号
- 爆款元素评分规则
- 输出报告的完整模板格式
- 时效性规则

**修改后无需重启 Gateway**，下次 cron 触发时自动读取最新内容。

**调试技巧：**
```bash
# 修改 HEARTBEAT.md 后，清除 Scout 的 session 缓存再触发测试
rm -rf ~/.openclaw/sessions/*scout*
openclaw cron run <cron-id>
```

> ⚠️ **踩坑㉑**：修改 HEARTBEAT.md 后如果效果没变化，很可能是 Scout 的 session 缓存了旧指令。用上面的命令清除缓存后重新触发。

---

## 十、多 Agent 协作：sessions_spawn 派活

> **背景**：管家通过 `sessions_spawn` 工具唤醒其他 agent 执行任务，子 agent 完成后结果通过管家转发回群组。这是实现"用户发指令 → 管家拆解 → 子 agent 干活 → 结果回传"完整链路的核心机制。

### 10.1 openclaw.json 配置

在 `agents.list` 中给发起 spawn 的 agent（管家）配置 `subagents.allowAgents`，在 `agents.defaults` 中配置子 agent 的运行参数：

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxSpawnDepth": 2,
        "maxChildrenPerAgent": 5,
        "maxConcurrent": 8,
        "runTimeoutSeconds": 900,
        "archiveAfterMinutes": 60
      }
    },
    "list": [
      {
        "id": "steward",
        "subagents": {
          "allowAgents": ["scout","writer","editor","distributor"]
        }
      }
    ]
  }
}
```

**关键点：**
- `allowAgents` 必须放在 `agents.list` 里对应 agent 的 `subagents` 下
- `agents.defaults.subagents` 只放运行参数（超时、并发数等）
- `tools.subagents` 下只支持 `tools: { deny: ["gateway","cron"] }` 来限制子 agent 可用工具，**不支持 allow/allowAgents**

### 10.2 管家 AGENTS.md 派发协议

在管家的 `AGENTS.md` 中需要包含 sessions_spawn 的用法说明和 Agent ID 对照表：

```markdown
## 派活协议（sessions_spawn）

当需要其他角色执行任务时，使用 sessions_spawn 工具：

sessions_spawn({
  agentId: "writer",
  task: "【管家派活】请根据以下选题写一篇公众号文章：{具体内容}"
})

### Agent ID 对照表
steward=管家, scout=选题, writer=写手, editor=编辑, distributor=分发

### 注意
- 子 agent 的结果会回到管家，由管家转发到群组
- 子 agent 不能直接以自己的 bot 身份发消息（设计限制）
- 在任务描述中加标记（如"【管家派活】"），方便子 agent 识别来源
```

### 10.3 子 agent 回传协议

每个可能被派活的 bot 的 AGENTS.md 需要包含回传协议段落：

```markdown
## 回传协议

当收到【管家派活】任务时：
1. 完成任务
2. 用 message 工具把结果发回群组
   - channel: telegram
   - target: 你的群组ID
3. 消息开头加标记，如"✅ 【写手完成】"
```

### 10.4 踩坑记录

> ⚠️ **踩坑㉒**：`sessions_spawn` 报 `"agentId is not allowed (allowed: none)"`
>
> **错误做法**：把 `allowAgents` 放在 `tools.subagents` 或 `agents.defaults.subagents` 下。
> **正确做法**：在 `agents.list` 中给发起方 agent 加 `subagents.allowAgents`（见 10.1 配置示例）。

> ⚠️ **踩坑㉓**：修改 AGENTS.md 后旧 session 不生效
>
> AGENTS.md 在 session 创建时加载，已有 session 不会重新读取。
> **修复**：改完 AGENTS.md 后必须清 session：
> ```bash
> rm -rf ~/.openclaw/agents/{agentId}/sessions/*
> ```
> 然后重启 Gateway。

> ⚠️ **踩坑㉔**：子 agent 不能以自己的 bot 身份发 Telegram 消息
>
> 这是设计限制，不是 bug。sessions_spawn 的子 agent 结果只能回到父 agent（管家），子 agent 的 message 工具输出会合并到父 agent 的回复中。
> **应对**：在任务描述中加标记（如"✅【写手完成】"）来区分产出来源。

> ⚠️ **踩坑㉕**：`tools.subagents` 只支持 `tools.deny`，不支持 allow
>
> `tools.subagents` 下只能配 `tools: { deny: ["gateway","cron"] }` 来限制子 agent 可用的工具，不要在这里放 allow/allowAgents。

### 10.5 完整流程

```
用户在管家话题发消息
  → 管家 agent 收到消息，判断需要派活
  → 管家用 sessions_spawn(agentId: "writer", task: "...") 唤醒写手
  → 写手 agent 在独立 session 中执行任务
  → 写手完成后，结果回到管家
  → 管家将结果转发到群组
```

---

## 十一、关键信息备查（请自行填写）

```
群组 ID:    _______________
我的用户ID: _______________

话题 ID 对照：
  管家 → ___
  选题 → ___
  写手 → ___
  编辑 → ___
  分发 → ___
  （扩展角色自行添加）

Bot Token 对照：
  管家:    _______________
  选题:    _______________
  写手:    _______________
  编辑:    _______________
  分发:    _______________
  （扩展角色自行添加）

API 配置：
  供应商:   _______________
  API地址:  _______________
  API Key:  _______________
  模型名:   _______________
```

---

*本手册基于实战部署与排错经验整理，包含25个踩坑记录与修正方案。*
*v1.0（学员版）— 基础5角色版本，可按需扩展更多角色。*
