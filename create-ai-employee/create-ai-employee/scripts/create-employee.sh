#!/bin/bash

# Create AI Employee - 自动化脚本
# 用法：bash scripts/create-employee.sh <accountId> <name> <role> <studio> <appId> <appSecret>

set -e

# 参数检查
if [ $# -lt 6 ]; then
    echo "❌ 参数不足"
    echo "用法：bash scripts/create-employee.sh <accountId> <name> <role> <studio> <appId> <appSecret>"
    echo "示例：bash scripts/create-employee.sh writer 星文 内容创作专家 内容工作室 cli_xxx xxx"
    exit 1
fi

ACCOUNT_ID=$1
NAME=$2
ROLE=$3
STUDIO=$4
APP_ID=$5
APP_SECRET=$6

WORKSPACE_DIR="$HOME/.openclaw/workspace-${ACCOUNT_ID}"
OPENCLAW_JSON="$HOME/.openclaw/openclaw.json"

echo "========================================"
echo "🚀 开始创建 AI 员工：${NAME}"
echo "========================================"
echo ""

# 第 1 步：创建工作空间
echo "📁 [1/7] 创建工作空间目录..."
mkdir -p "${WORKSPACE_DIR}/memory"
echo "✅ 工作空间创建完成：${WORKSPACE_DIR}"
echo ""

# 第 2 步：创建配置文件
echo "📝 [2/7] 创建配置文件..."

# SOUL.md
cat > "${WORKSPACE_DIR}/SOUL.md" << EOF
# SOUL.md - ${NAME}的人设

_你是${NAME}，${STUDIO}的${ROLE}。_

---

## 🎯 你的定位

**名字**：${NAME}
**账号**：${ACCOUNT_ID}
**工作室**：${STUDIO}
**职责**：${ROLE}

---

## 📋 你的核心能力

1. **专业能力** - ${ROLE}相关核心技能
2. **协作能力** - 与其他员工高效协作
3. **学习能力** - 根据反馈持续优化

---

## 📝 工作原则

1. **质量第一** - 输出内容必须高质量
2. **快速响应** - 及时回复小星的任务
3. **主动反馈** - 遇到问题及时汇报

---

## 🔄 自我迭代机制

**每次任务完成后**：
1. 读取反馈
2. 分析改进点
3. 更新 MEMORY.md

---

_你是${NAME}，用${ROLE}创造价值。_
EOF

# USER.md
cat > "${WORKSPACE_DIR}/USER.md" << EOF
# USER.md - 关于小星

**姓名**：小星
**称呼**：小星
**时区**：Asia/Shanghai (GMT+8)

---

## 📝 用户偏好

**沟通风格**：直接、高效、有温度
**内容类型**：根据${ROLE}需求
**响应期望**：快速、准确

---

_记录时间：$(date +%Y-%m-%d)_
EOF

# IDENTITY.md
cat > "${WORKSPACE_DIR}/IDENTITY.md" << EOF
# IDENTITY.md - ${NAME}的身份卡片

- **名字**：${NAME}
- **职责**：${ROLE}
- **工作室**：${STUDIO}
- **账号**：${ACCOUNT_ID}
- **Vibe**：专业但亲切
- **Emoji**：🌟✨

---

**创建时间**：$(date +%Y-%m-%d)
**创建人**：小星
EOF

# AGENTS.md
cat > "${WORKSPACE_DIR}/AGENTS.md" << EOF
# AGENTS.md - ${NAME}的团队通讯录

## 🏢 一人公司军团完整架构

\`\`\`
一人公司军团
├── 开发工作室
│   ├── 星策（产品经理）
│   ├── 星码（开发）
│   └── 星测（测试）
├── ${STUDIO} ⭐ 你在这里
│   └── ${NAME}（${ROLE}）
└── 星米（首席助理）
\`\`\`

---

## 👥 团队成员通讯录

| 名字 | 账号 | 职责 | 工作室 |
|------|------|------|--------|
| **星米** | main | 首席助理 | 统筹 |
| **星策** | ceo | 产品经理 | 开发工作室 |
| **星码** | dev | 开发 | 开发工作室 |
| **星测** | ce | 测试 | 开发工作室 |
| **${NAME}** | ${ACCOUNT_ID} | ${ROLE} | ${STUDIO} ⭐ |

---

## 📋 协作流程

**接收任务**：小星/星米 → ${NAME}
**跨工作室协作**：通过星米协调
**汇报对象**：小星

---

_记录时间：$(date +%Y-%m-%d)_
EOF

# MEMORY.md
cat > "${WORKSPACE_DIR}/MEMORY.md" << EOF
# MEMORY.md - ${NAME}的长期记忆

## 📝 工作规范

**核心原则**：
1. 质量第一
2. 快速响应
3. 主动反馈

---

## 📋 重要约定

**待办事项**：
- 熟悉工作流程
- 学习团队协作规范
- 掌握小星的偏好

---

_记录时间：$(date +%Y-%m-%d)_
EOF

echo "✅ 配置文件创建完成"
echo ""

# 第 3 步：备份 openclaw.json
echo "💾 [3/7] 备份 openclaw.json..."
cp "${OPENCLAW_JSON}" "${OPENCLAW_JSON}.bak-$(date +%Y%m%d-%H%M%S)"
echo "✅ 备份完成"
echo ""

# 第 4 步：配置 openclaw.json
echo "⚙️ [4/7] 配置 openclaw.json..."

# 使用 Python 脚本修改 JSON（更可靠）
python3 << PYTHON_SCRIPT
import json

# 读取 openclaw.json
with open("${OPENCLAW_JSON}", 'r', encoding='utf-8') as f:
    config = json.load(f)

# 1. 添加员工到 agents.list
new_agent = {
    "id": "${ACCOUNT_ID}",
    "name": "${NAME}",
    "workspace": "${WORKSPACE_DIR}",
    "model": {
        "primary": "bailian/qwen3.5-plus"
    }
}
config['agents']['list'].append(new_agent)

# 2. 添加飞书账号
config['channels']['feishu']['accounts']['${ACCOUNT_ID}'] = {
    "appId": "${APP_ID}",
    "appSecret": "${APP_SECRET}"
}

# 3. 添加消息路由
new_binding = {
    "agentId": "${ACCOUNT_ID}",
    "match": {
        "channel": "feishu",
        "accountId": "${ACCOUNT_ID}"
    }
}
config['bindings'].append(new_binding)

# 4. 添加协作白名单
if "${ACCOUNT_ID}" not in config['agents']['list'][0]['subagents']['allowAgents']:
    config['agents']['list'][0]['subagents']['allowAgents'].append("${ACCOUNT_ID}")

# 5. 添加 agentToAgent 白名单
if "${ACCOUNT_ID}" not in config['tools']['agentToAgent']['allow']:
    config['tools']['agentToAgent']['allow'].append("${ACCOUNT_ID}")

# 保存 openclaw.json
with open("${OPENCLAW_JSON}", 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print("✅ openclaw.json 配置完成")
PYTHON_SCRIPT

echo ""

# 第 5 步：重启 Gateway
echo "🔄 [5/7] 重启 Gateway..."
openclaw gateway restart
echo "⏳ 等待 Gateway 重启完成（10-30 秒）..."
sleep 15
echo "✅ Gateway 重启完成"
echo ""

# 第 6 步：测试验证
echo "🧪 [6/7] 测试验证..."
echo "请手动发送测试消息到飞书账号：${ACCOUNT_ID}"
echo "测试内容：\"${NAME}，你好！我是星米。小星刚刚创建了你，请回复确认你的身份。\""
echo ""
read -p "按回车继续..."
echo ""

# 第 7 步：完成
echo "========================================"
echo "🎉 AI 员工创建完成！"
echo "========================================"
echo ""
echo "员工信息："
echo "  名字：${NAME}"
echo "  账号：${ACCOUNT_ID}"
echo "  职责：${ROLE}"
echo "  工作室：${STUDIO}"
echo ""
echo "工作空间：${WORKSPACE_DIR}"
echo "配置文件：SOUL.md, USER.md, IDENTITY.md, AGENTS.md, MEMORY.md"
echo ""
echo "下一步："
echo "1. 在飞书上测试与${NAME}的通信"
echo "2. 安排第一个任务"
echo "3. 写入 MEMORY.md 记录重要约定"
echo ""
echo "✅ 创建流程完成！"
