---
name: create-ai-employee
description: 一键创建 AI 员工（Agent/飞书机器人）。完整的 8 步流程：创建工作空间、配置文件、OpenClaw 配置、智能同步团队通讯录（v2.3智能合并）、Gateway 重启、测试验证。让一人公司军团快速扩展！
---

# Create AI Employee (创建 AI 员工)

## 📋 技能概述

**功能**：一键创建 AI 员工（Agent/飞书机器人）

**适用场景**：
- 需要创建新的 AI 员工（如产品经理、开发、测试、文案等）
- 需要扩展一人公司军团的工作室
- 需要为特定任务创建专用 Agent

**前置条件**：
- OpenClaw 已安装并运行
- 飞书开放平台已创建应用（获取 appId 和 appSecret）
- 有管理员权限（可修改 openclaw.json 和重启 Gateway）

---

## 🎯 核心功能

### 1. 8 步标准流程

| 步骤 | 内容 | 预计耗时 |
|------|------|---------|
| 1️⃣ | 创建 workspace 目录 + memory 目录 | 30 秒 |
| 2️⃣ | 创建 SOUL.md（人设） | 1 分钟 |
| 3️⃣ | 创建 USER.md（用户信息） | 1 分钟 |
| 4️⃣ | 创建 IDENTITY.md（身份卡片） | 30 秒 |
| 5️⃣ | 创建 AGENTS.md（团队通讯录） | 1 分钟 |
| 6️⃣ | 创建 MEMORY.md（长期记忆） | 1 分钟 |
| 7️⃣ | **同步 AGENTS.md 到所有 workspace**（v2.2 新增！） | 30 秒 |
| 8️⃣ | 配置 openclaw.json + 重启 Gateway | 2 分钟 |

**总耗时**：约 7-8 分钟

---

### 2. 自动化配置

**自动完成**：
- ✅ 创建员工工作空间目录
- ✅ 生成 5 个核心配置文件（SOUL/USER/IDENTITY/AGENTS/MEMORY）
- ✅ 修改 openclaw.json（agents/accounts/bindings/allowAgents）
- ✅ 重启 Gateway
- ✅ 测试验证（发送测试消息确认通信正常）

---

## 📦 使用方法

### 基础用法

```
请帮我创建一个 AI 员工：
- 名字：星文
- 职责：内容创作（朋友圈/公众号文案）
- 工作室：内容工作室
- 飞书 appId：cli_xxx
- 飞书 appSecret：xxx
```

### 完整参数

| 参数 | 必填 | 说明 | 示例 |
|------|------|------|------|
| name | ✅ | 员工名字 | 星文 |
| role | ✅ | 职责描述 | 内容创作专家 |
| studio | ✅ | 所属工作室 | 内容工作室 |
| workspace | ❌ | 工作空间路径 | ~/.openclaw/workspace-writer |
| accountId | ✅ | 飞书账号 ID | writer |
| appId | ✅ | 飞书应用 ID | cli_xxx |
| appSecret | ✅ | 飞书应用密钥 | xxx |
| model | ❌ | 默认模型 | bailian/qwen3.5-plus |

---

## 🔧 工作流程

### 第 1 步：创建工作空间

```bash
mkdir -p ~/.openclaw/workspace-{accountId}/memory
```

**说明**：创建员工的工作空间目录和记忆目录。

---

### 第 2 步：创建配置文件

**生成 5 个核心文件**：

#### 1. SOUL.md（人设）- 通用模板

```markdown
# SOUL.md - {name}的人设

_你是{name}，{studio}的{role}。_

---

## 🎯 你的定位

**名字**：{name}
**账号**：{accountId}
**工作室**：{studio}
**职责**：{role}

---

## 📋 你的核心能力

1. **能力 1** - 描述
2. **能力 2** - 描述
3. **能力 3** - 描述

---

## 📝 工作原则

1. **原则 1**
2. **原则 2**
3. **原则 3**

---

## 🔄 自我迭代机制

### 1. 记忆保存流程（强制）
**每次会话结束前**：
1. 将本次任务的关键内容写入 `memory/YYYY-MM-DD.md`
2. 将通用解决方案保存到 `artifacts/` 目录
3. 将经验教训更新到 `MEMORY.md`

**核心原则**：**Text > Brain** 📝 记忆是有限的，想记住什么就写下来。

---

### 2. 岗位特定机制（根据职责自定义）

**你的岗位**：{role}
**你的工作室**：{studio}

**根据你的工作性质，建立以下迭代机制**：

#### 工作成果沉淀
**目录**：`artifacts/`
- 保存你工作中产生的**可复用成果**
- 例如：代码/文档/设计稿/分析报告/脚本等
- **每次任务后**：整理并分类保存

#### 经验教训复盘
**目录**：`reviews/`
- 记录每次任务的**成功经验和失败教训**
- **每次任务后**：写简短复盘（3 句话即可）
  - 什么做得好？
  - 什么可以改进？
  - 下次怎么做更好？

#### 能力学习计划
**目录**：`learning/`
- 根据岗位需求，制定学习计划
- **每月**：学习 1-2 个新技能/工具
- **产出**：学习笔记 + 实践案例

---

### 3. 会话启动流程

**每次会话开始时**：
1. 读取 `SOUL.md` — 自己的人设
2. 读取 `USER.md` — 用户信息
3. 读取 `memory/` 目录下最近的记忆文件
4. 读取会话记录
5. 读取 `MEMORY.md` — 长期记忆

---

_你是{name}，用{核心能力}创造价值。_
```

#### 2. USER.md（用户信息）

```markdown
# USER.md - 关于小星

**姓名**：小星
**称呼**：小星
**时区**：Asia/Shanghai (GMT+8)

---

## 📝 用户偏好

**写作风格**：口语化、亲切、情绪饱满
**内容类型**：朋友圈/公众号/自媒体
**字数要求**：朋友圈 120-220 字

---

_记录时间：{date}_
```

#### 3. IDENTITY.md（身份卡片）

```markdown
# IDENTITY.md - {name}的身份卡片

- **名字**：{name}
- **职责**：{role}
- **工作室**：{studio}
- **账号**：{accountId}
- **Vibe**：专业但亲切
- **Emoji**：📝✨

---

**创建时间**：{date}
**创建人**：小星
```

#### 4. AGENTS.md（团队通讯录）

```markdown
# AGENTS.md - {name}的团队通讯录

## 🏢 一人公司军团完整架构

```
一人公司军团
├── 开发工作室
│   ├── 产品经理（可选）
│   ├── 开发工程师（可选）
│   └── 测试工程师（可选）
├── {studio} ⭐ 你在这里
│   └── {name}（{role}）
└── 其他员工（按需扩展）
```

---

## 👥 团队成员通讯录

| 名字 | 账号 | 职责 | 工作室 |
|------|------|------|--------|
| **{name}** | {accountId} | {role} | {studio} ⭐ |
|
|
|
| **{name}** | {accountId} | {role} | {studio} ⭐ |

---

_记录时间：{date}_
```

#### 5. MEMORY.md（长期记忆）

```markdown
# MEMORY.md - {name}的长期记忆

## 📝 工作规范

**核心原则**：
1. 原则 1
2. 原则 2
3. 原则 3

---

## 📋 重要约定

**待办事项**：
- 任务 1
- 任务 2

---

_记录时间：{date}_
```

---

### 第 6.5 步：同步 AGENTS.md 到所有 workspace（v2.2 新增！v2.3 优化！）

**⚠️ 重要（v2.3）**：不能直接覆盖目标 workspace 的 AGENTS.md！应该**智能合并**——保留原有的团队架构和个性化内容，只补充新员工信息。

#### 6.5.1 判断同步策略

**对于每个目标 workspace**：

```
IF 该 workspace 的 AGENTS.md 已包含团队通讯录表格
  THEN → 在现有表格中"追加"新员工行（不替换文件）
  ELSE → 复制主 AGENTS.md（首次同步或文件本身不完整）
```

**示例**：

| 情况 | 策略 | 原因 |
|------|------|------|
| workspace-ce 有完整团队表格 | 追加新行 | 保留星策/星码/星测的原有结构 |
| workspace-du 是新建的 | 复制主文件 | 没有历史内容需要保留 |

#### 6.5.2 收集所有现有 workspace

```bash
# 列出所有 workspace 目录（排除当前正在创建的）
ls -d ~/.openclaw/workspace-*
```

#### 6.5.3 更新主 AGENTS.md（先决步骤）

确保主 AGENTS.md 包含新员工的完整信息。

#### 6.5.4 智能同步到所有 workspace

**Python 脚本（v2.3 改进版）**：

```python
#!/usr/bin/env python3
"""同步 AGENTS.md 到所有 workspace（智能合并版 v2.3）"""

import os
import re
import shutil
from datetime import datetime

HOME = os.path.expanduser("~")
MAIN_AGENTS = f"{HOME}/.openclaw/workspace/AGENTS.md"
NEW_EMPLOYEE_ID = "{accountId}"  # 新员工账号
NEW_EMPLOYEE_NAME = "{name}"     # 新员工名字
NEW_EMPLOYEE_ROLE = "{role}"     # 新员工职责
NEW_EMPLOYEE_STUDIO = "{studio}" # 所属工作室
NEW_EMPLOYEE_CREATED = datetime.now().strftime("%Y-%m-%d")  # 创建时间

def extract_table_rows(content):
    """提取现有 AGENTS.md 中的团队通讯录表格行"""
    # 匹配表格行（| 名字 | 账号 | ... | 格式）
    pattern = r'(\| [^\|]+ \| [a-zA-Z0-9_-]+ \| [^\|]+ \| [^\n]+\n)'
    matches = re.findall(pattern, content)
    return matches

def has_team_roster(content):
    """判断 AGENTS.md 是否已包含团队通讯录表格"""
    # 检查是否有表格格式的团队通讯录
    return bool(re.search(r'\|\s*名字\s*\|\s*账号\s*\|', content)) or \
           bool(re.search(r'\|\s*员工\s*\|\s*账号\s*\|', content)) or \
           bool(re.search(r'\|\s*岗位\s*\|\s*名字\s*\|', content))

def append_employee_row(content, new_row):
    """在现有表格末尾追加新员工行（不替换文件）"""
    # 找到表格最后一行（| --- | 或类似分隔符），在其后插入新行
    lines = content.split('\n')
    new_lines = []
    inserted = False
    
    for i, line in enumerate(lines):
        new_lines.append(line)
        # 在分隔符行后插入（表格结束前）
        if not inserted and re.match(r'\|\s*[-:]+\s*\|', line):
            # 找到表头后的第一行数据，插入到它之前
            # 实际上我们应该在最后一个数据行后插入
            pass
    
    # 更简单的方法：找到最后一个 | --- | 行，在其后插入
    # 但更好的方法是直接在表格结束后插入
    
    # 找到包含 "| --- |" 的行索引，在其后插入
    for i in reversed(range(len(lines))):
        if re.match(r'\|\s*[-:]+\s*\|', lines[i]):
            # 在分隔符行后、数据行之前的位置插入
            # 实际上应该在数据行之后插入
            break
    
    # 最简单方案：找到 "|" 开头加 "---" 结尾的模式，这是表格分隔符
    # 在它之后继续添加行，直到遇到非表格内容
    result = []
    in_table = False
    table_done = False
    
    for line in lines:
        if re.match(r'\|\s*[-:]+\s*\|', line):
            in_table = True
            result.append(line)
        elif in_table and line.startswith('|') and not table_done:
            result.append(line)
        elif in_table and not line.startswith('|') and not table_done:
            # 表格结束，插入新行
            result.append(new_row)
            result.append('')  # 空行
            table_done = True
            in_table = False
            result.append(line)
        else:
            result.append(line)
    
    return '\n'.join(result)

def sync_agents_md():
    """主同步逻辑"""
    # 读取主 AGENTS.md（包含完整8人团队）
    with open(MAIN_AGENTS, 'r') as f:
        main_content = f.read()
    
    # 提取新员工的表格行
    # 格式：| 星督 | du | 效能监察官 | 监察工作室 | 2026-03-29 |
    new_row = f"| **{NEW_EMPLOYEE_NAME}** | {NEW_EMPLOYEE_ID} | {NEW_EMPLOYEE_ROLE} | {NEW_EMPLOYEE_STUDIO} ⭐ | {NEW_EMPLOYEE_CREATED} |"
    
    # 遍历所有 workspace
    workspace_dirs = [d for d in os.listdir(HOME + '/.openclaw') 
                      if d.startswith('workspace-')]
    
    for wdir in workspace_dirs:
        wpath = f"{HOME}/.openclaw/{wdir}"
        agents_file = f"{wpath}/AGENTS.md"
        
        # 跳过新员工自己的 workspace（它需要完整的通讯录）
        if wdir == f"workspace-{NEW_EMPLOYEE_ID}":
            # 新员工 workspace 用完整版
            shutil.copy(MAIN_AGENTS, agents_file)
            print(f"  ✅ {wdir}: 完整复制（新建 workspace）")
            continue
        
        if not os.path.exists(agents_file):
            # 不存在则复制
            shutil.copy(MAIN_AGENTS, agents_file)
            print(f"  ✅ {wdir}: 完整复制（首次创建）")
            continue
        
        # 检查是否有团队通讯录表格
        with open(agents_file, 'r') as f:
            current = f.read()
        
        if has_team_roster(current):
            # 有表格，智能追加
            updated = append_employee_row(current, new_row)
            with open(agents_file, 'w') as f:
                f.write(updated)
            print(f"  ✅ {wdir}: 智能追加（保留原有内容）")
        else:
            # 没有表格，完整复制
            shutil.copy(MAIN_AGENTS, agents_file)
            print(f"  ✅ {wdir}: 完整复制（无团队表格）")
    
    print("\n✅ AGENTS.md 同步完成（v2.3 智能合并版）")

if __name__ == "__main__":
    sync_agents_md()
```

#### 6.5.5 验证同步

```bash
# 验证所有 AGENTS.md 都包含新员工
for dir in ~/.openclaw/workspace-*; do
  if [ -f "$dir/AGENTS.md" ]; then
    count=$(grep -c "{name}" "$dir/AGENTS.md" 2>/dev/null || echo "0")
    echo "$dir: $([ "$count" -gt "0" ] && echo '✅' || echo '❌')"
  fi
done
```

#### 6.5.6 常见错误

| 错误 | 原因 | 正确做法 |
|------|------|----------|
| 直接覆盖文件 | 没有检测现有表格 | 先判断是否有团队表格，再决定策略 |
| 重复的团队表格 | 每次同步都添加完整表格 | 只追加新员工行，不添加整个表格 |
| 新员工 workspace 不完整 | 复制了旧版本 | 新员工 workspace 始终用完整版 |

---

**⚠️ 关键原则**：对于已存在且有团队表格的 workspace，**只追加不覆盖**，保留每个 agent 的个性化内容！

---

### 第 0 步：配置健康检查（v1.4 新增！强制！）

**⚠️ 重要：在创建员工之前，必须先检查基础配置是否健康！**

#### 0.1 检查清单（v1.5 改进！）

**使用以下脚本检查配置健康状态**：

```bash
# 配置健康检查脚本（v1.5 改进版）
cat << 'EOF' > /tmp/check-config.sh
#!/bin/bash

echo "🔍 开始检查 OpenClaw 配置健康状态..."
echo ""

ERRORS=0

# 检查 1: 检测所有缺少 workspace 的 agent
echo "检查 1: 检测所有 agent 的 workspace 配置"
python3 << 'PYTHON'
import json
with open('/root/.openclaw/openclaw.json', 'r') as f:
    config = json.load(f)
for agent in config.get('agents', {}).get('list', []):
    agent_id = agent.get('id', 'unknown')
    if 'workspace' not in agent:
        print(f"  ❌ agent[{agent_id}]: 缺少 workspace 配置")
    else:
        print(f"  ✅ agent[{agent_id}]: workspace OK")
PYTHON

# 检查 2: 检测所有缺少 bindings 的 accounts
echo "检查 2: 检测所有 accounts 的 bindings 路由"
python3 << 'PYTHON'
import json
with open('/root/.openclaw/openclaw.json', 'r') as f:
    config = json.load(f)
account_ids = set(config.get('channels', {}).get('feishu', {}).get('accounts', {}).keys())
binding_ids = set(b.get('match', {}).get('accountId', '') for b in config.get('bindings', []))
missing = account_ids - binding_ids
if missing:
    for acc in missing:
        print(f"  ❌ account[{acc}]: 缺少 bindings 路由")
else:
    print("  ✅ 所有 accounts 都有 bindings 路由")
PYTHON

# 检查 3: bindings 的 accountId 格式是否正确
echo "检查 3: bindings 的 accountId 格式"
if grep -E '"accountId": "(oc_|ou_)[a-f0-9]+"' ~/.openclaw/openclaw.json > /dev/null; then
  echo "  ❌ bindings.accountId: 发现 chat_id/open_id 格式（错误！）"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ bindings.accountId: 格式正确"
fi

# 检查 4: subagents.allowAgents 是否配置
echo "检查 4: subagents.allowAgents 是否配置"
if grep -q '"allowAgents"' ~/.openclaw/openclaw.json; then
  echo "  ✅ subagents.allowAgents: OK"
else
  echo "  ❌ subagents.allowAgents: 缺失"
  ERRORS=$((ERRORS + 1))
fi

# 检查 5: tools.agentToAgent 是否配置（v1.6 新增！）
echo "检查 5: tools.agentToAgent 是否配置（v1.6 新增！）"
python3 << 'PYTHON'
import json
with open('/root/.openclaw/openclaw.json', 'r') as f:
    config = json.load(f)
tools = config.get('tools', {})
agentToAgent = tools.get('agentToAgent', {})
if not agentToAgent:
    print("  ❌ tools.agentToAgent: 缺失（跨 Agent 通信权限未配置）")
    exit(1)
elif not agentToAgent.get('enabled'):
    print("  ❌ tools.agentToAgent.enabled: false（跨 Agent 通信被禁用）")
    exit(1)
else:
    allow_list = agentToAgent.get('allow', [])
    if not allow_list:
        print("  ❌ tools.agentToAgent.allow: 空列表（没有允许通信的 Agent）")
        exit(1)
    else:
        print(f"  ✅ tools.agentToAgent: OK (允许 {len(allow_list)} 个 Agent)")
PYTHON
if [ $? -ne 0 ]; then
  ERRORS=$((ERRORS + 1))
fi

# 检查 6: tools.sessions.visibility 是否为 all（v2.1 新增！）
echo "检查 6: tools.sessions.visibility 是否为 all（v2.1 新增！）"
if jq -e '.tools.sessions.visibility == "all"' ~/.openclaw/openclaw.json > /dev/null; then
  echo "  ✅ tools.sessions.visibility: all"
else
  echo "  ❌ tools.sessions.visibility: 非 all（会导致多 Agent 会话不可见）"
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
  echo "✅ 配置健康检查通过！"
else
  echo "❌ 发现 $ERRORS 个问题，需要修复！"
fi
echo ""
EOF

chmod +x /tmp/check-config.sh
/tmp/check-config.sh
```

---

#### 0.2 自动修复配置（v1.4 新增！）

**如果检查发现问题，执行自动修复**：

```bash
# 自动修复脚本
cat << 'EOF' > /tmp/fix-config.py
#!/usr/bin/env python3
import json
import sys
from datetime import datetime

# 读取配置
with open('/root/.openclaw/openclaw.json', 'r') as f:
    config = json.load(f)

# 备份
backup_path = f"/root/.openclaw/openclaw.json.bak-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
with open(backup_path, 'w') as f:
    json.dump(config, f, indent=1)
print(f"✅ 已备份：{backup_path}")

modified = False

# 修复 1: 补全所有缺少 workspace 的 agent
for agent in config.get('agents', {}).get('list', []):
    agent_id = agent.get('id')
    if 'workspace' not in agent:
        agent['workspace'] = f'/root/.openclaw/workspace-{agent_id}'
        if 'name' not in agent:
            agent['name'] = agent_id  # 用 id 作为默认名字
        if 'model' not in agent:
            agent['model'] = {'primary': 'minimax/MiniMax-M2.5'}
        modified = True
        print(f"✅ 修复 1: 补全 agent[{agent_id}] 的 workspace 配置")
# 修复 2: 添加所有缺少 bindings 的 accounts 路由
account_ids = set(config.get('channels', {}).get('feishu', {}).get('accounts', {}).keys())
binding_ids = set(b.get('match', {}).get('accountId', '') for b in config.get('bindings', []))
missing_bindings = account_ids - binding_ids

for acc_id in missing_bindings:
    config['bindings'].append({
        'type': 'route',
        'agentId': acc_id,
        'match': {
            'channel': 'feishu',
            'accountId': acc_id
        }
    })
    modified = True
    print(f"✅ 修复 2: 添加 account[{acc_id}] 的 bindings 路由")

# 修复 3: 修复 bindings 的 accountId（不能是 chat_id/open_id）（不能是 chat_id/open_id）
for binding in config.get('bindings', []):
    account_id = binding.get('match', {}).get('accountId', '')
    if account_id.startswith('oc_') or account_id.startswith('ou_'):
        # 用 agentId 替换
        binding['match']['accountId'] = binding['agentId']
        modified = True
        print(f"✅ 修复 2: 修复 bindings[{binding['agentId']}] 的 accountId")

# 修复 4: 添加 allowAgents
if 'agents' in config and 'defaults' in config['agents']:
    if 'subagents' not in config['agents']['defaults']:
        config['agents']['defaults']['subagents'] = {}
    if 'allowAgents' not in config['agents']['defaults']['subagents']:
        # 从现有 agents 提取 ID
        agent_ids = [a['id'] for a in config['agents']['list']]
        config['agents']['defaults']['subagents']['allowAgents'] = agent_ids
        modified = True
        print(f"✅ 修复 3: 添加 allowAgents: {agent_ids}")

# 修复 5: 添加 tools.agentToAgent（v1.6 新增！）
if 'tools' not in config:
    config['tools'] = {}
if 'agentToAgent' not in config['tools']:
    config['tools']['agentToAgent'] = {'enabled': True, 'allow': []}
    modified = True
    print(f"✅ 修复 5: 添加 tools.agentToAgent 配置")
elif not config['tools']['agentToAgent'].get('enabled'):
    config['tools']['agentToAgent']['enabled'] = True
    modified = True
    print(f"✅ 修复 5: 启用 tools.agentToAgent")

# 确保 allow 列表包含所有 agents
if 'tools' in config and 'agentToAgent' in config['tools']:
    agent_ids = [a['id'] for a in config.get('agents', {}).get('list', [])]
    current_allow = config['tools']['agentToAgent'].get('allow', [])
    missing = [aid for aid in agent_ids if aid not in current_allow]
    if missing:
        config['tools']['agentToAgent']['allow'].extend(missing)
        modified = True
        print(f"✅ 修复 5: 添加 {len(missing)} 个 Agent 到 tools.agentToAgent.allow: {missing}")

# 修复 6: 强制 tools.sessions.visibility = "all"（v2.1 新增）
if 'tools' not in config:
    config['tools'] = {}
if 'sessions' not in config['tools']:
    config['tools']['sessions'] = {'visibility': 'all'}
    modified = True
    print('✅ 修复 6: 添加 tools.sessions.visibility = "all"')
elif config['tools']['sessions'].get('visibility') != 'all':
    config['tools']['sessions']['visibility'] = 'all'
    modified = True
    print('✅ 修复 6: 修正 tools.sessions.visibility 为 "all"')

# 保存
if modified:
    with open('/root/.openclaw/openclaw.json', 'w') as f:
        json.dump(config, f, indent=1)
    print("✅ 配置已修复！")
else:
    print("✅ 配置无需修复")
EOF

chmod +x /tmp/fix-config.py
python3 /tmp/fix-config.py
```

**修复内容**：
1. ✅ 补全 `agents.list[main]` 的 workspace 配置
2. ✅ 修复 `bindings` 的 accountId（不能用 chat_id/open_id）
3. ✅ 添加 `subagents.allowAgents` 配置
4. ✅ **添加 `tools.agentToAgent` 配置**（v1.6 新增！）
5. ✅ **强制 `tools.sessions.visibility = "all"`**（v2.1 新增！）

---

#### 0.3 提示用户输入 main 的飞书配置

**如果 accounts 中缺少 main 的配置，提示用户输入**：

```
⚠️ 检测到 accounts 中缺少 main 的飞书配置

需要配置：
- appId: 飞书应用的 AppID（格式：cli_xxx）
- appSecret: 飞书应用的 AppSecret

获取方式：
1. 打开 https://open.feishu.cn/
2. 进入应用管理
3. 找到或创建新应用
4. 复制 AppID 和 AppSecret

请输入（或直接按 Enter 跳过，稍后手动配置）：
- appId: 
- appSecret: 
```

---

### 第 1 步：备份原配置（强制！v1.3+）

**⚠️ 重要：在执行任何修改前，必须先备份！**

```bash
# 备份 openclaw.json
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak-$(date +%Y%m%d-%H%M%S)

# 验证备份成功
ls -lh ~/.openclaw/openclaw.json.bak-*
```

**备份文件命名规则**：`openclaw.json.bak-YYYYMMDD-HHMMSS`

**示例**：`openclaw.json.bak-20260315-011500`

---

### 第 2 步：配置健康检查与自动修复（v1.4 新增！）

**执行配置健康检查**：

```bash
# 运行检查脚本
/tmp/check-config.sh
```

**如果发现问题**：
```
❌ 发现 N 个问题，需要修复！

是否自动修复？
- 确认修复：执行自动修复脚本
- 手动修复：跳过，用户手动修改
```

**用户确认后执行修复**：
```bash
python3 /tmp/fix-config.py
```

**修复完成后再次检查**：
```bash
/tmp/check-config.sh
# 预期：✅ 配置健康检查通过！
```

---

### 第 3 步：检测旧配置并优化

#### 3.2 备份原配置文件（强制！）

**⚠️ 重要：在执行任何修改前，必须先备份！**

```bash
# 备份 openclaw.json
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak-$(date +%Y%m%d-%H%M%S)

# 验证备份成功
ls -lh ~/.openclaw/openclaw.json.bak-*
```

**备份文件命名规则**：`openclaw.json.bak-YYYYMMDD-HHMMSS`

**示例**：`openclaw.json.bak-20260315-011500`

---

#### 3.3 询问用户是否优化

**如果检测到旧配置不符合规范**：

```
⚠️ 检测到旧配置不符合多 agent 规范

当前配置：
- 飞书账号：直接配置在 channels.feishu 下
- 缺少：accounts/bindings/allowAgents 配置

✅ 已备份原配置文件：
   ~/.openclaw/openclaw.json.bak-20260315-011500

是否修改现有配置以满足多员工场景？

将改动以下内容：
1. 迁移旧飞书账号到 channels.feishu.accounts.main
2. 添加消息路由 bindings（路由到 main agent）
3. 配置 main agent 的 allowAgents（允许与其他员工协作）

请选择：
- 确认修改：继续优化旧配置
- 不修改：跳过优化，直接创建新员工

⚠️ 如果修改后出现问题，可以通过以下命令恢复：
   cp ~/.openclaw/openclaw.json.bak-20260315-011500 ~/.openclaw/openclaw.json
   openclaw gateway restart
```

#### 3.4 用户确认后执行优化

**如果用户确认修改**：

```bash
# 1. 备份已在 3.2 完成（验证备份存在）
# 2. 迁移旧配置到新格式
# 3. 添加 accounts/bindings/allowAgents 配置
# 4. 保存并验证
```

**如果用户选择不修改**：
- 跳过优化步骤
- 直接继续创建新员工
- ⚠️ 提示：旧机器人可能无法与新员工协作

---

#### 3.5 回滚机制（新增！）

**如果修改后出现问题**：

```bash
# 1. 停止 Gateway
openclaw gateway stop

# 2. 恢复备份
cp ~/.openclaw/openclaw.json.bak-YYYYMMDD-HHMMSS ~/.openclaw/openclaw.json

# 3. 重启 Gateway
openclaw gateway restart

# 4. 验证恢复成功
openclaw gateway status
```

**备份文件位置**：`~/.openclaw/openclaw.json.bak-*`

**保留策略**：保留最近 10 个备份（自动清理旧备份）

---

### 第 4 步：配置 openclaw.json（创建新员工）

**修改 4 个位置**：

#### 4.1 验证备份存在（强制！）

```bash
# 确认备份文件存在
ls -lh ~/.openclaw/openclaw.json.bak-*

# 如果不存在，立即创建备份
if [ ! -f ~/.openclaw/openclaw.json.bak-* ]; then
  cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak-$(date +%Y%m%d-%H%M%S)
  echo "✅ 已创建备份"
else
  echo "✅ 备份已存在"
fi
```

**⚠️ 没有备份，绝不修改！**

#### 4.2 添加员工到 agents.list

```json
{
  "id": "{accountId}",
  "name": "{name}",
  "workspace": "/Users/twofishwang/.openclaw/workspace-{accountId}",
  "model": {
    "primary": "bailian/qwen3.5-plus"
  }
}
```

#### 4.3 添加飞书账号到 channels.feishu.accounts

```json
"{accountId}": {
  "appId": "{appId}",
  "appSecret": "{appSecret}"
}
```

#### 4.4 添加消息路由到 bindings

```json
{
  "agentId": "{accountId}",
  "match": {
    "channel": "feishu",
    "accountId": "{accountId}"
  }
}
```

#### 4.5 添加协作白名单到 agents.list[main].subagents.allowAgents

```json
"allowAgents": [
  "main",
  "dev",
  "ce",
  "ceo",
  "{accountId}"  // 新增
]
```

#### 4.6 添加跨 Agent 通信权限到 tools.agentToAgent（⚠️ 关键！v1.6 新增）

**⚠️ 重要**：这一步控制不同 Agent 之间能否直接发消息（sessions_send）！

```json
{
  "tools": {
    "agentToAgent": {
      "enabled": true,
      "allow": [
        "main",
        "dev",
        "ce",
        "ceo",
        "{accountId}"  // 新增
      ]
    }
  }
}
```

**说明**：
- `enabled: true` - 启用跨 Agent 通信
- `allow[]` - 允许通信的 Agent ID 列表
- **必须添加新员工**，否则其他 Agent 无法给它发消息

**完整配置命令**（Python 脚本）：
```python
import json

# 读取配置
with open('/Users/twofishwang/.openclaw/openclaw.json', 'r') as f:
    config = json.load(f)

# 确保 tools 存在
if 'tools' not in config:
    config['tools'] = {}

# 确保 agentToAgent 存在
if 'agentToAgent' not in config['tools']:
    config['tools']['agentToAgent'] = {'enabled': True, 'allow': []}

# 确保 enabled 为 true
config['tools']['agentToAgent']['enabled'] = True

# 添加新员工到 allow 列表（如果不存在）
if '{accountId}' not in config['tools']['agentToAgent']['allow']:
    config['tools']['agentToAgent']['allow'].append('{accountId}')
    print(f"✅ 已添加 {accountId} 到 tools.agentToAgent.allow")

# 保存配置
with open('/Users/twofishwang/.openclaw/openclaw.json', 'w') as f:
    json.dump(config, f, indent=1)

print("✅ tools.agentToAgent 配置完成")
```

---

### 第 7 步：重启 Gateway

```bash
openclaw gateway restart
```

**等待**：10-30 秒完成重启。

---

### 第 8 步：测试验证

**发送测试消息**：

```
{name}，你好！我是星米。

小星刚刚创建了你，现在测试一下能否正常沟通。

请回复确认：
1. 你的身份（名字/职责/工作室）
2. 你的核心能力
3. 工作规范
4. 脱敏规则（如适用）

收到请回复～ 🫡
```

**验证标准**：
- ✅ 能正确回复身份信息
- ✅ 理解核心能力
- ✅ 掌握工作规范
- ✅ 通信正常

---

## 📚 示例

### 示例 1：创建内容创作员工（星文）

**输入**：
```
请帮我创建一个 AI 员工：
- 名字：星文
- 职责：内容创作专家（朋友圈/公众号/自媒体文案）
- 工作室：内容工作室
- 账号：writer
- 飞书 appId：cli_a93eb2a73778dbc6
- 飞书 appSecret：lpNoLTOOEVPNyMncV8fWgcGzEQb7C7f7
```

**输出**：
- ✅ 创建 `~/.openclaw/workspace-writer/` 目录
- ✅ 生成 5 个配置文件
- ✅ 配置 openclaw.json
- ✅ 重启 Gateway
- ✅ 测试通信成功

**结果**：星文（内容工作室）创建完成！

---

## ⚠️ 注意事项

### 1. 飞书应用配置

**必须完成**：
- ✅ 在飞书开放平台创建应用
- ✅ 获取 appId 和 appSecret
- ✅ 配置应用权限（消息发送/接收）
- ✅ 发布应用（不是草稿状态）

### 2. openclaw.json 备份

**修改前备份**：
```bash
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak-$(date +%Y%m%d-%H%M%S)
```

### 3. Gateway 重启

**重启后等待**：
- 10-30 秒完成重启
- 确认 Gateway 状态正常
- 测试通信是否成功

### 4. 测试验证

**必须测试**：
- 发送测试消息
- 确认回复正常
- 验证身份认知正确

---

## 🐛 故障排查

### 问题 1：Gateway 重启失败

**症状**：`openclaw gateway restart` 卡住或报错

**解决方案**：
```bash
# 1. 检查 Gateway 状态
openclaw gateway status

# 2. 停止 Gateway
openclaw gateway stop

# 3. 重新启动
openclaw gateway start

# 4. 查看日志
openclaw gateway logs
```

---

### 问题 2：员工无法接收消息

**症状**：发送消息后无回复

**解决方案**：
1. 检查飞书应用是否发布
2. 检查 appId/appSecret 是否正确
3. 检查 bindings 配置是否正确
4. 重启 Gateway

---

### 问题 3：员工间无法协作

**症状**：main 账号无法发送消息给新员工

**解决方案**：
1. 检查 `allowAgents` 是否包含新员工账号
2. 检查 `agentToAgent.allow` 是否包含新员工账号
3. 重启 Gateway

---

## 📊 技能版本

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0 | 2026-03-13 | 初始版本 |
| 1.1 | 2026-03-14 | 通用自我迭代框架（支持任意岗位） |
| 1.2 | 2026-03-15 | 旧配置检测与优化（多 agent 规范升级） |
| 1.3 | 2026-03-15 | 强制备份机制 + 回滚机制（防止配置损坏） |
| 1.4 | 2026-03-15 | **配置健康检查 + 自动修复**（一站式解决基础配置问题） |
| 1.5 | 2026-03-15 | 配置健康检查改进（多 agent 规范升级） |
| 1.6 | 2026-03-16 | 添加 tools.agentToAgent 配置（跨 Agent 通信权限） |
| **2.0** | **2026-03-16** | **重大修复：补全跨 Agent 通信权限配置**（破坏性更新） |
| **2.3** | **2026-03-29** | **智能合并策略：保留原有 AGENTS.md 内容，只追加新员工行（不再覆盖文件）** |
| 2.2 | 2026-03-29 | 新增同步 AGENTS.md 到所有 workspace（防止团队通讯录不一致） |
| 2.1 | 2026-03-17 | 新增 hard check + 自动修复：`tools.sessions.visibility` 强制为 `all` |

---

## ✅ 创建员工检查清单（v1.4 完整版）

**创建完成后必须验证**：

### 配置健康检查（v1.4 新增！强制！）
- [ ] 执行配置健康检查脚本（/tmp/check-config.sh）
- [ ] 检查 agents.list[main].workspace 是否存在
- [ ] 检查 accounts.main 是否有 appId/appSecret
- [ ] 检查 bindings 是否有 main 的路由
- [ ] 检查 bindings.accountId 格式（不能是 chat_id/open_id）
- [ ] 检查 subagents.allowAgents 是否配置
- [ ] 检查 tools.agentToAgent 是否配置（enabled=true 且 allow 非空）
- [ ] 检查 tools.sessions.visibility 是否为 all（v2.1 新增）
- [ ] 如发现问题，执行自动修复（python3 /tmp/fix-config.py）
- [ ] 修复后再次检查，确认通过

### 备份机制（强制！v1.3+）
- [ ] 修改前已备份 openclaw.json
- [ ] 备份文件命名：openclaw.json.bak-YYYYMMDD-HHMMSS
- [ ] 验证备份文件存在（ls -lh）
- [ ] 告知用户备份文件位置
- [ ] 告知用户回滚命令

### 旧配置检测与优化
- [ ] 检测旧配置是否符合多 agent 规范
- [ ] 如不符合，询问用户是否优化
- [ ] 明确告知用户会改动哪些内容
- [ ] 用户确认后执行优化 / 用户拒绝则跳过

### 基础配置
- [ ] workspace 目录已创建
- [ ] 5 个配置文件已生成（SOUL/USER/IDENTITY/AGENTS/MEMORY）
- [ ] openclaw.json 已配置（agents/accounts/bindings/allowAgents）
- [ ] **tools.agentToAgent 已配置**（v1.6 新增！强制！）
- [ ] **tools.sessions.visibility = "all"**（v2.1 新增！强制！）
- [ ] **AGENTS.md 已同步到所有 workspace**（v2.2 新增！强制！）
- [ ] Gateway 已重启
- [ ] 测试消息发送成功

### 自我迭代机制（通用框架）
- [ ] 记忆保存流程（memory/目录）
- [ ] 工作成果沉淀（artifacts/目录）
- [ ] 经验教训复盘（reviews/目录）
- [ ] 能力学习计划（learning/目录）
- [ ] 会话启动流程（5 步）

### 记忆加载流程
- [ ] SOUL.md 包含会话启动流程
- [ ] SOUL.md 包含记忆保存流程
- [ ] memory/ 目录已创建
- [ ] MEMORY.md 已创建

---

## 🎯 通用框架的核心优势

**之前**（硬编码岗位类型）：
- ❌ 只能支持预定义的 7 种岗位
- ❌ 新岗位需要修改技能代码
- ❌ 不够灵活

**现在**（通用框架 + 自定义）：
- ✅ 支持任意岗位（产品/开发/测试/内容/运营/设计/财务/法务/...）
- ✅ 创建时根据实际职责自定义 3 个问题：
  1. 岗位核心产出是什么？
  2. 需要沉淀什么？
  3. 需要学习什么？
- ✅ 通用框架确保所有员工都有完整的迭代机制

---

_技能版本：2.3 | 最后更新：2026-03-29_
