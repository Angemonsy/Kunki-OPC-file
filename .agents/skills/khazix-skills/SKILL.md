---
name: khazix-skills
description: Khazix Skills 工具包总入口，包含横纵分析、写作和任务收尾同步等子 Skill。
---

# 🧰 Khazix Skills
我自己每天在用的一些 AI 技能和 Prompt，都开源在这里。都是在自己项目里跑通了一段时间，确实省事，才搬出来开源的。没什么花活，就是几个挺实用的东西。

- **Skills** — Agent 可直接加载的结构化指令集，遵循 [Agent Skills](https://agentskills.io) 开放标准，Claude Code、Codex、OpenCode、OpenClaw 都能安装
- **Prompts** — 可直接复制粘贴到任何对话AI使用，无需安装

---

## 📋 目录
### Skills
1. 🧹 **neat-freak（洁癖）**：干完活运行，自动同步本次修改到项目文档、CLAUDE.md、Agent 记忆
2. 🔭 **hv-analysis（横纵分析法）**：生成万字PDF研究报告，帮你搞懂产品/公司/概念
3. ✍️ **khazix-writer（卡兹克写作）**：让Agent用作者的口吻和节奏写公众号长文

### Prompts
1. 🔭 **横纵分析法（Prompt 版）**：横纵分析法Skill的轻量版，复制到Deep Research模型即可使用

---

## 📦 安装方式
在支持Skill的Agent中直接说：`帮我安装这个 skill：https://github.com/KKKKhazix/khazix-skills/tree/main/<skill-name>`，将`<skill-name>`替换为目标skill名称即可，Agent会自动完成安装。

---

## ✨ Skills
### 🧹 neat-freak（洁癖）
> "每次任务做完要退出窗口的时候，如果不跑一遍 /neat，我就浑身难受，如坐针毡如芒刺背如鲠在喉。"

每次在Agent完成任务后运行`/neat`，它会把本次会话修改的内容，和项目文档、CLAUDE.md/AGENTS.md、Agent记忆全部对齐，最后输出变更摘要。解决了"模型越用越笨"是因为信息过期的问题，会同步三层内容：
1. 项目根目录的CLAUDE.md / AGENTS.md（给当前AI看）
2. 项目的docs/ 和 README（给其他人员看）
3. Agent自己的记忆系统（给跨会话使用看）

支持触发方式：`/neat` | `整理一下` | `同步一下` | `sync up`，跨平台支持Claude Code、Codex、OpenCode、OpenClaw。

### 🔭 hv-analysis（横纵分析法）
> "纵向追时间深度，横向追同期广度，最终交汇出判断。"

想搞懂一个产品/公司/概念/人物，直接交给它即可：纵向梳理研究对象从诞生到当下的完整演变，横向对比同期所有主要竞品，交叉分析后输出排版精美的10000-30000字PDF研究报告。
- 适合：竞品调研、新概念调研、写作素材准备、从零入门新领域
- 不适合：简单名词查询、公众号文章写作

### ✍️ khazix-writer（卡兹克写作）
> "有见识的普通人在认真聊一件打动他的事。"

作者自用公众号写作Skill，安装后Agent会复刻作者的口吻、节奏和写作规则。
- 适合：喜欢作者「数字生命卡兹克」公众号风格，想让AI按这个风格产出长文
- 不适合：想要通用商业文笔，该Skill拒绝使用「赋能、抓手、闭环」等套话

它包含：完整写作风格规则、四层自检体系、风格示例对照库。

---

## 📝 Prompts
### 🔭 横纵分析法（Prompt 版）
hv-analysis Skill的轻量版，仅一段提示词，复制粘贴到任何支持Deep Research的模型就可以运行，半小时左右输出万字研究报告，无需安装，适合还没使用Skill系统Agent的用户体验该方法。

---

## 🌟 关于
我是数字生命卡兹克，公众号「数字生命卡兹克」、虚实传媒（Virxact）创始人，非程序员出身，这些都是我日常在用的工具，开源供大家使用，欢迎star，有问题可以提Issue。

MIT License，自由使用/修改/再分发
Made by [@KKKKhazix](https://github.com/KKKKhazix)
