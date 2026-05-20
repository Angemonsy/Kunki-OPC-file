# 🦞 OpenClaw 技能：创建 AI 员工

**一键创建 AI 员工（Agent/飞书机器人）**

完整的 7 步流程：创建工作空间、配置文件、OpenClaw 配置、Gateway 重启、测试验证。让一人公司军团快速扩展！

---

## 🚀 快速安装

### 方法 1：克隆仓库（推荐）

```bash
# 进入 OpenClaw 工作空间
cd ~/.openclaw/workspace

# 克隆技能仓库
git clone https://github.com/wjx2017/ai-skills.git

# 进入技能目录
cd ai-skills/create-ai-employee

# 查看文档
cat README.md
```

---

### 方法 2：直接下载

```bash
# 下载 ZIP 文件
curl -L https://github.com/wjx2017/ai-skills/archive/main.zip -o /tmp/skills.zip

# 解压
unzip /tmp/skills.zip -d ~/.openclaw/workspace/skills/

# 进入技能目录
cd ~/.openclaw/workspace/skills/ai-skills-main/create-ai-employee
```

---

## 📖 使用方法

### 快速创建（自动化脚本）

```bash
bash scripts/create-employee.sh <accountId> <name> <role> <studio> <appId> <appSecret>
```

**示例**（创建星文）：
```bash
bash scripts/create-employee.sh writer 星文 内容创作专家 内容工作室 cli_a93eb2a73778dbc6 lpNoLTOOEVPNyMncV8fWgcGzEQb7C7f7
```

---

### 手动创建（学习用）

**详细步骤参考**：`SKILL.md`

**7 步标准流程**：
1. 创建工作空间目录
2. 创建 5 个配置文件（SOUL/USER/IDENTITY/AGENTS/MEMORY）
3. 备份 openclaw.json
4. 配置 openclaw.json
5. 重启 Gateway
6. 测试验证
7. 完成

---

## 📋 文件结构

```
create-ai-employee/
├── SKILL.md                      # 技能文档（核心）
├── README.md                     # 使用说明
├── INSTALL.md                    # 安装说明（本文件）
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

## 🎯 使用场景

### 场景 1：创建内容创作员工

```bash
bash scripts/create-employee.sh writer 星文 内容创作专家 内容工作室 cli_xxx xxx
```

**职责**：朋友圈文案、公众号文章、自媒体文案

---

### 场景 2：创建运营员工

```bash
bash scripts/create-employee.sh operations 星运 运营专家 运营工作室 cli_xxx xxx
```

**职责**：社群运营、用户增长、数据分析

---

### 场景 3：创建市场员工

```bash
bash scripts/create-employee.sh marketing 星市 市场专家 市场工作室 cli_xxx xxx
```

**职责**：市场推广、品牌建设、渠道拓展

---

## ⚠️ 前置条件

**必须完成**：
1. ✅ OpenClaw 已安装并运行
2. ✅ 飞书开放平台已创建应用
3. ✅ 获取 appId 和 appSecret
4. ✅ 有管理员权限（可修改 openclaw.json）

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

## 📖 完整文档

**详细文档**：
- `SKILL.md` - 完整技能文档（功能/流程/配置/示例）
- `README.md` - 使用说明和最佳实践
- `examples/` - 实际创建示例

---

## 🤝 贡献指南

**欢迎提交 PR**：
- 添加新的配置文件模板
- 改进自动化脚本
- 补充故障排查文档
- 添加更多示例

**GitHub 仓库**：https://github.com/wjx2017/ai-skills

---

## 📞 支持

**遇到问题？**
1. 查看 `SKILL.md` 故障排查章节
2. 检查 openclaw.json 配置
3. 重启 Gateway
4. 提交 GitHub Issue

**GitHub Issues**：https://github.com/wjx2017/ai-skills/issues

---

## 📊 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0 | 2026-03-13 | 初始版本 - 完整的 7 步流程 + 自动化脚本 |

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

## 📚 相关资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [ClawHub 技能市场](https://clawhub.com)
- [飞书开放平台](https://open.feishu.cn/)

---

_技能版本：1.5 | 最后更新：2026-03-15 | 创建者：OpenClaw 社区_
