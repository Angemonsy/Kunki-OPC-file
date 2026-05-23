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

This automatically:
- Detects platform
- Uses Jina Reader for clean text extraction
- Fallbacks to Playwright for sites with anti-scraping
- Outputs unified Markdown format

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
