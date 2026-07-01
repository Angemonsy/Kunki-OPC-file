---
name: x-reader-url
description: 读取公众号、小红书、X/Twitter 及普通网页链接并整理为结构化 Markdown。用户发送 URL 并要求提取内容时使用。
---

# x-reader-url Skill

> Universal URL Reader — fetch clean content from any URL (公众号/小红书/推特/文章) and output structured Markdown.

## Trigger

Auto-trigger when user sends any HTTP/HTTPS URL:
- WeChat 公众号 URL (`mp.weixin.qq.com/s/...`)
- Xiaohongshu 小红书 URL (`xiaohongshu.com`)
- Twitter / X URL (`x.com` / `twitter.com`)
- Any general article URL that needs content extraction

Don't trigger for:
- Feishu / Lark URL (`*.feishu.cn`) → use `lark-cli` instead (per system rules)
- YouTube / Bilibili video URL → use `x-reader-video` instead

## Pipeline

### Step 1: Detect Platform and Fetch

Use the installed `x-reader` Python CLI to fetch content:

```bash
x-reader [URL]
```

If `x-reader` is not available in `PATH`, use the vault-local entry:

```bash
python3 -m x_reader.cli [URL]
```

Working directory:

```text
05-智能体协作与工具脚本/工具脚本/x-reader
```

This automatically:
- Detects platform
- Uses Jina Reader for clean text extraction
- Fallbacks to Playwright for sites with anti-scraping
- Outputs unified Markdown format

### WeChat verification rules

For `mp.weixin.qq.com` links, do not treat a non-empty response as success by itself.

The following indicate a blocked verification page and must trigger Playwright fallback:

- Title is `Weixin Official Accounts Platform`
- Content contains `环境异常`
- Content contains `完成验证后即可继续访问`
- Content contains `requiring CAPTCHA`

If Playwright reports that Chromium is missing, run once:

```bash
python3 -m playwright install chromium
```

After fetching, verify all three:

1. The extracted title is the real article title.
2. The body has meaningful article length, not a few hundred characters of verification text.
3. The ending contains the article's real closing paragraph, not platform UI text.

### Step 2: Process Output

After fetching, format the output for the user:

```markdown
## 📖 Content Extracted: [Title]

**Source**: [URL]
**Platform**: [WeChat/Xiaohongshu/Twitter/Article]

---

[Cleaned content here]

---

*Fetched by x-reader-url*
```

### Step 3: Save (Optional)

If user asks to save or it's for content production:
- Save to `E-产出交付/06-临时文件/[title].md`
- Or to `D-内容创作/03-素材库/公众号文章存档/`

## Rules

1. **Don't rewrite unless asked** — just extract and clean, preserve original content
2. **Remove junk** — strip navigation, ads, related links, footer copyright
3. **Keep structure** — preserve headings, paragraphs, bullet points
4. **If fetch fails**: inform user, suggest checking URL or login session

## Supported Platforms

| Platform | Status |
|----------|--------|
| 微信公众号 | ✅ Jina + Playwright fallback |
| 小红书 | ✅ Jina + Playwright fallback |
| Twitter / X | ✅ Jina |
| Bilibili | ➡️ use x-reader-video |
| YouTube | ➡️ use x-reader-video |
| Any web article | ✅ Jina |
