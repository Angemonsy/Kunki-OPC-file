# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice

---

## [LRN-20260503-001] correction

**Logged**: 2026-05-03T13:15:00+08:00
**Priority**: critical
**Status**: promoted
**Area**: config

### Summary
飞书文档链接处理规则：飞书链接必须用lark-cli，禁止用x-reader。

### Details
用户明确给出飞书文档链接，并要求用飞书插件修改。但我一开始错误地尝试用x-reader读取，这完全不对：
- x-reader是用来读取**外部网页/公众号/小红书/推特**的
- 本系统中飞书文档已经有lark-cli配置，且本地已有同步缓存
- x-reader读取飞书会失败，还浪费token和时间

正确规则已经记录在CLAUDE.md第九节「踩坑记录与正确操作SOP」。

### Suggested Action
严格执行：
- 飞书文档链接（feishu.cn/docx/）→ 必须用 `lark-cli docs +fetch` 读取，`lark-cli docs +update` 更新
- 公众号/小红书/推特/外部文章 → 用x-reader
- 如果本地已有同步缓存，直接读本地

### Metadata
- Source: user_feedback
- Related Files: CLAUDE.md
- Tags:飞书, lark-cli, x-reader, 规则
- See Also: ERR-20260503-001
- Pattern-Key:飞书.link.rule
- Recurrence-Count: 1
- First-Seen: 2026-05-03
- Last-Seen: 2026-05-03

---

