# Errors

Command failures and integration errors.

---

## [ERR-20260609-001] x-reader WeChat false success and missing browser runtime

**Logged**: 2026-06-09T14:18:00+08:00
**Priority**: high
**Status**: resolved
**Area**: tooling

### Summary
公众号抓取时，Jina 返回验证码页面但被误判为成功；Playwright 已安装但 Chromium 运行组件缺失。

### Resolution
- 为 WeChat fetcher 增加验证码/环境异常页面识别，自动进入 Playwright fallback。
- 安装 Playwright Chromium 组件。
- 在 x-reader-url Skill 中补充 PATH 回退、本地入口、验证码识别和抓取后完整性校验规则。
- 使用真实公众号链接回归测试，标题、正文长度和结尾均通过。

### Related Files
- `05-智能体协作与工具脚本/工具脚本/x-reader/x_reader/fetchers/wechat.py`
- `.agents/skills/x-reader-url/SKILL.md`
- `.claude/skills/x-reader-url/SKILL.md`

## [ERR-20260620-001] Automatic skill trigger API error

**Logged**: 2026-06-20T
**Priority**: high
**Status**: pending
**Area**: config

### Summary
每次自动触发skill时都报告API错误，但用户手动重试一次后就能正常工作。API key本身有效未过期。

### User description
> "为什么每次自动触发你都说API错误？然后我重新再试一次，你就可以。这到底是什么bug能不能修一下？我的API key没有过期，也没有任何问题，但是每次自动触发你都说有问题，然后我再发一句话，你又说可以。这到底是为什么？"

### Context
- Behavior: First automatic trigger → API error → User resends → Success
- API key: Verified valid, not expired
- Recurrence: Happens consistently

### Common causes
1. **Race condition**: API key/environment variables not fully loaded when skill triggers automatically on session start
2. **Network connectivity**: First request times out due to DNS/connection establishment, second request succeeds due to caching
3. **Initialization order**: Automatic trigger fires before all environment is initialized
4. **Token expiration race**: If using OAuth/token refresh, first call with expired token fails, refresh happens, second call succeeds

### Suggested Fix
1. Check if skill uses lazy initialization of API clients — add retry logic for first call
2. Add explicit check that API key is loaded before making request, fail with clearer message or retry automatically
3. Investigate if automatic trigger on session start is firing too early before environment is ready
4. Add idempotent retry with backoff for the first API call in any skill

### Metadata
- Reproducible: yes
- Related Files: multiple skills
- See Also:
- Tags: api, trigger, race-condition, intermittent

---

## [ERR-20260620-002] byted-ark-seedream-skill 自动触发竞态错误

**Logged**: 2026-06-20T
**Priority**: high
**Status**: resolved
**Area**: config

### Summary
自动触发时，seedream skill 读取配置文件遇到竞态，文件未完全写入导致读取失败，进而兜底使用了预置的过期API key，返回 400 订阅过期错误。用户重试时文件已写入，读取成功正常工作。

### Error
```
API Error: 400 Your account (2100974000) does not have a valid CodingPlan subscription, or your subscription has expired.
```

### Context
- 用户配置了正确的 API key 在 `~/.config/agentplan/ark_api_key`
- 对话启动自动触发任务时，同时误触发了 seedream skill
- 由于文件系统竞态，skill 执行时文件不存在/未写完，`fs.existsSync` 返回 false
- 兜底扫描找到预置/默认过期 key，使用该 key 请求 → 400
- 用户手动重试时，文件已完全写入，读取成功，请求正常

### Resolution
- **Resolved**: 2026-06-20
- **Fix**: 将正确 API key 添加到 `~/.claude/settings.json` 环境变量 `AGENTPLAN_ARK_API_KEY`
- **Notes**: 环境变量优先级高于配置文件，绕过了文件系统竞态问题

### Metadata
- Reproducible: yes (before fix)
- Related Files: `~/.claude/settings.json`, `~/.config/agentplan/ark_api_key`
- Tags: api, race-condition, bytedance, seedream, startup

---
