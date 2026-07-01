# Errors

Command failures and integration errors.

---

## [ERR-20260503-001] lark-cli飞书文档更新

**Logged**: 2026-05-03T13:15:00+08:00
**Priority**: high
**Status**: resolved
**Area**: config

### Summary
多次参数错误才成功更新飞书文档，浪费用户时间和token。

### Error
多次错误尝试：
1. 错误尝试用x-reader读取飞书文档链接（应该用lark-cli）
2. 错误使用 `--format markdown` 参数（不存在）
3. 错误使用绝对路径，lark-cli只接受相对路径或stdin
4. 错误使用 `--as bot` 更新（bot没有写权限，必须用 `--as user`）
5. 环境变量代理设置方式不对，导致连接失败

### Context
- 操作：将本地更新后的选题官配置推送到飞书云端
- 正确命令：
```bash
cd D:\ObsidianVaults\MyVault && unset HTTPS_PROXY && unset HTTP_PROXY && cat [本地文件路径] | lark-cli docs +update --doc [飞书token] --as user --mode overwrite --markdown -
```

### Suggested Fix
- 严格遵循CLAUDE.md中已经记录的"踩坑记录与正确操作SOP"
- 用户明确说"用飞书插件改飞书" → 第一时间用lark-cli，绝对不要碰x-reader
- 使用标准命令模板一次写对，不要逐步试错

### Metadata
- Reproducible: yes
- Related Files: CLAUDE.md, 飞书同步/A01-AI bot设定与工作交付/lynn选题官定时任务格式设定.md
- See Also: LRN-20260503-001

---

