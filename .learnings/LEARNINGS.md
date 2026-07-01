# Learnings

Corrections, insights, and knowledge gaps captured during development.

---

## [LRN-20260609-001] best_practice

**Logged**: 2026-06-09T14:18:00+08:00
**Priority**: high
**Status**: promoted
**Area**: tooling

### Summary
抓取公众号不能以“返回内容非空”作为成功标准，必须校验真实标题、正文长度和文章结尾。

### Details
微信公众号反爬页面本身包含文本，容易被通用 Reader 当成文章正文。可靠流程应检查阻断标记，必要时自动使用浏览器渲染，并对输出做首尾完整性验证。

### Suggested Action
以后公众号抓取固定使用 x-reader 的验证版流程，不直接接受 `Weixin Official Accounts Platform` 或包含“环境异常”的结果。

### Metadata
- Source: error
- Pattern-Key: harden.wechat_reader_validation
- Recurrence-Count: 1

---

## [LRN-20260610-001] best_practice

**Logged**: 2026-06-10T10:59:00+08:00
**Priority**: high
**Status**: pending
**Area**: workflow

### Summary
撰写知识库文档项目时，必须做好版本归档和目录整理。

### Details
用户要求：
1. 最新版本保存好并归档
2. 删除旧版、舍弃版文件，不保留废弃内容
3. 先在 `03-主题项目集/` 找到对应的母文件夹
4. 开启新的子文件夹存放本次产出
5. 保证每次产出整齐存放，便于后续查找

### Suggested Action
每次接手知识库文档撰写任务时，先定位到 `03-主题项目集/对应母文件夹/`，新建子文件夹存放新版产出，清理旧版废弃文件后再开始工作。

### Metadata
- Source: user_feedback
- Pattern-Key: workflow.knowledge_base_archiving
- Recurrence-Count: 1

---

## [LRN-20260610-002] correction

**Logged**: 2026-06-10T11:30:00+08:00
**Priority**: critical
**Status**: pending
**Area**: workflow

### Summary
每次新对话第一条回复前，必须严格按照规则读取四个核心记忆文件。

### Details
用户明确指出：CLAUDE.md 中规则要求"收到用户第一条消息时，先读取：1. 当前唯一真相.md 2. 当下每时每刻.md 3. 长期记忆.md 4. AI协作偏好.md"。但 AI 经常偷懒不读，或者记错路径读错，导致上下文错误。

### Suggested Action
- 必须严格执行强制启动协议：每次新对话收到第一条消息，第一步就是读取这四个文件
- 重编号后，记忆系统目录是 `02-记忆系统/`，记住新路径：
  - `02-记忆系统/当前唯一真相.md`
  - `02-记忆系统/当下每时每刻（持续更新）.md`
  - `02-记忆系统/长期记忆.md`
  - `02-记忆系统/AI协作偏好.md`
- 如果找不到文件，先 `find` 确认正确路径再读，不要报错就停住

### Metadata
- Source: user_feedback
- Pattern-Key: workflow.memory_loading_required
- Recurrence-Count: 1

---

## [LRN-20260610-003] best_practice

**Logged**: 2026-06-10T11:40:00+08:00
**Priority**: high
**Status**: pending
**Area**: workflow

### Summary
新建 Skill 必须同时同步到 Claude Code 和 Codex 两端。

### Details
用户要求：
- 创建新 Skill 后，不仅要安装到 `~/.claude/skills/`（用户本地 Claude 配置）
- 还要同步一份到知识库根目录的 `.agents/skills/`（知识库本身维护 Codex 版本）
- 保证两端内容一致，同时适配 Claude Code 和 Codex 两种使用方式

### Suggested Action
每次创建或更新 Skill 后：
1. 用户本地 `~/.claude/skills/` 安装完成
2. 立即同步完整内容到知识库 `.agents/skills/` 对应目录
3. 检查 `SKILL.md` 和脚本文件都复制完整

### Metadata
- Source: user_feedback
- Pattern-Key: workflow.skill_sync_both_ends
- Recurrence-Count: 1

## [LRN-20260619-001] correction

**Logged**: 2026-06-19T16:50:00+08:00
**Priority**: high
**Status**: pending
**Area**: docs

### Summary
不要把知识库最终产出默认写到根目录；写入前必须按主题选择已有分类路径。

### Details
用户纠正：跨境电商考试复习资料被默认写入知识库根目录，违反 AGENTS.md / CLAUDE.md 中“禁止根目录产出；课程考试复习资料统一放到 `03-主题项目集/02-学习求职系统/考试复习/`”的规则。根目录产出会破坏用户知识库秩序。

### Suggested Action
每次写入最终文件前执行“三步路径检查”：
1. 先判断内容类型和主题；
2. 在现有目录中选择匹配路径，考试复习资料默认进入 `03-主题项目集/02-学习求职系统/考试复习/`；
3. 找不到明确分类时必须询问用户，不得默认写入根目录。

### Metadata
- Source: user_feedback
- Related Files: AGENTS.md, CLAUDE.md
- Tags: obsidian, file-routing, root-directory, correction

---
