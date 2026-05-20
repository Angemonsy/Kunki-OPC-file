# Create AI Employee Skill

**一键创建 AI 员工（Agent/飞书机器人）**

完整的 7 步流程：创建工作空间、配置文件、OpenClaw 配置、Gateway 重启、测试验证。让一人公司军团快速扩展！

---

## 📋 功能特性

- ✅ **7 步标准流程** - 标准化、可复制
- ✅ **自动化配置** - 一键完成所有配置
- ✅ **完整文档** - SKILL.md + 脚本 + 示例
- ✅ **测试验证** - 自动测试通信是否正常
- ✅ **易于扩展** - 支持创建任意数量的员工

---

## 🚀 快速开始

### 方法 1：使用自动化脚本

```bash
# 克隆技能到你的 OpenClaw 工作空间
cd ~/.openclaw/workspace
git clone https://github.com/wjx2017/ai-skills.git

# 进入技能目录
cd ai-skills/create-ai-employee

# 运行创建脚本
bash scripts/create-employee.sh <accountId> <name> <role> <studio> <appId> <appSecret>
```

**示例**：
```bash
bash scripts/create-employee.sh writer 星文 内容创作专家 内容工作室 cli_a93eb2a73778dbc6 lpNoLTOOEVPNyMncV8fWgcGzEQb7C7f7
```

---

### 方法 2：手动创建（学习用）

**按照 SKILL.md 中的 7 步流程逐步执行**：

1. 创建工作空间目录
2. 创建 5 个配置文件（SOUL/USER/IDENTITY/AGENTS/MEMORY）
3. 备份 openclaw.json
4. 配置 openclaw.json（agents/accounts/bindings/allowAgents）
5. 重启 Gateway
6. 测试验证
7. 完成

---

## 📦 文件结构

```
create-ai-employee/
├── SKILL.md                      # 技能文档（核心）
├── README.md                     # 使用说明
├── scripts/
│   ├── create-employee.sh        # 自动化脚本
│   └── test-communication.sh     # 测试脚本
├── assets/
│   └── templates/                # 配置文件模板
└── examples/
    ├── example-writer.md         # 星文示例
    └── example-operations.md     # 星运示例
```

---

## 📖 详细文档

### SKILL.md

完整的技能文档，包含：
- 功能概述
- 使用方法
- 工作流程
- 配置示例
- 故障排查
- 注意事项

### 自动化脚本

**create-employee.sh**：
- 自动创建所有目录和文件
- 自动配置 openclaw.json
- 自动重启 Gateway
- 提供测试验证指引

**用法**：
```bash
bash scripts/create-employee.sh <accountId> <name> <role> <studio> <appId> <appSecret>
```

---

## 🎯 使用场景

### 场景 1：创建内容创作员工

```bash
bash scripts/create-employee.sh writer 星文 内容创作专家 内容工作室 cli_xxx xxx
```

**职责**：
- 朋友圈文案
- 公众号文章
- 自媒体文案

---

### 场景 2：创建运营员工

```bash
bash scripts/create-employee.sh operations 星运 运营专家 运营工作室 cli_xxx xxx
```

**职责**：
- 社群运营
- 用户增长
- 数据分析

---

### 场景 3：创建市场员工

```bash
bash scripts/create-employee.sh marketing 星市 市场专家 市场工作室 cli_xxx xxx
```

**职责**：
- 市场推广
- 品牌建设
- 渠道拓展

---

## ⚠️ 注意事项

### 1. 飞书应用配置

**必须完成**：
- ✅ 在飞书开放平台创建应用
- ✅ 获取 appId 和 appSecret
- ✅ 配置应用权限（消息发送/接收）
- ✅ 发布应用（不是草稿状态）

**飞书开放平台**：https://open.feishu.cn/

---

### 2. openclaw.json 备份

**修改前务必备份**：
```bash
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak-$(date +%Y%m%d-%H%M%S)
```

---

### 3. Gateway 重启

**重启后等待**：
- 10-30 秒完成重启
- 确认 Gateway 状态正常
- 测试通信是否成功

**检查状态**：
```bash
openclaw gateway status
```

---

### 4. 测试验证

**必须测试**：
- 发送测试消息
- 确认回复正常
- 验证身份认知正确

**测试消息示例**：
```
{name}，你好！我是星米。

小星刚刚创建了你，现在测试一下能否正常沟通。

请回复确认：
1. 你的身份（名字/职责/工作室）
2. 你的核心能力
3. 工作规范

收到请回复～ 🫡
```

---

## 🐛 故障排查

### Gateway 重启失败

```bash
# 检查状态
openclaw gateway status

# 停止
openclaw gateway stop

# 重新启动
openclaw gateway start

# 查看日志
openclaw gateway logs
```

---

### 员工无法接收消息

**检查清单**：
1. ✅ 飞书应用是否发布
2. ✅ appId/appSecret 是否正确
3. ✅ bindings 配置是否正确
4. ✅ Gateway 是否重启

---

### 员工间无法协作

**检查清单**：
1. ✅ `allowAgents` 是否包含新员工账号
2. ✅ `agentToAgent.allow` 是否包含新员工账号
3. ✅ Gateway 是否重启

---

## 📊 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0 | 2026-03-13 | 初始版本 - 完整的 7 步流程 + 自动化脚本 |

---

## 🤝 贡献指南

**欢迎提交 PR**：
- 添加新的配置文件模板
- 改进自动化脚本
- 补充故障排查文档
- 添加更多示例

**GitHub 仓库**：https://github.com/wjx2017/ai-skills

---

## 📖 相关资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [ClawHub 技能市场](https://clawhub.com)
- [飞书开放平台](https://open.feishu.cn/)
- [一人公司军团实战](https://github.com/wjx2017/ai-skills)

---

## 💡 最佳实践

### 1. 命名规范

**员工命名**：
- 格式：星 + 单字（星文、星运、星市）
- 含义：与职责相关（文=内容、运=运营、市=市场）

**工作室命名**：
- 格式：{职责} + 工作室（内容工作室、运营工作室、市场工作室）
- 清晰表达工作室职能

---

### 2. 配置文件

**SOUL.md**：
- 明确人设和定位
- 定义核心能力
- 制定工作原则

**MEMORY.md**：
- 记录重要约定
- 跟踪待办事项
- 持续更新迭代

---

### 3. 测试验证

**必测项目**：
- 身份认知（名字/职责/工作室）
- 核心能力理解
- 工作规范掌握
- 跨员工通信

---

## 🎉 成功案例

### 案例 1：星文（内容创作专家）

**创建时间**：2026-03-13  
**工作室**：内容工作室  
**职责**：朋友圈/公众号/自媒体文案

**成果**：
- ✅ 创建完成并测试通过
- ✅ 已输出多条文案
- ✅ 脱敏规范执行良好

---

### 案例 2：星运（运营专家）

**创建时间**：待创建  
**工作室**：运营工作室  
**职责**：社群运营/用户增长/数据分析

**预期**：
- 自动化社群管理
- 数据分析报告
- 用户增长策略

---

## 📞 支持

**遇到问题？**
1. 查看 SKILL.md 故障排查章节
2. 检查 openclaw.json 配置
3. 重启 Gateway
4. 提交 GitHub Issue

**GitHub Issues**：https://github.com/wjx2017/ai-skills/issues

---

_技能版本：1.5 | 最后更新：2026-03-15 | 创建者：OpenClaw 社区_
