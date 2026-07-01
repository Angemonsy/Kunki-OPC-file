---
name: Frontend Slides
description: 创建或转换动画丰富的 HTML 演示文稿、幻灯片和网页式 PPT。用户要求制作 presentation、slides、deck 或将 PPTX 转成网页演示时使用。
---

# Frontend Slides — Codex Skill

Create beautiful, animation-rich HTML presentations from scratch or by converting PPTX.

## When to use this skill

Use this skill when:
- User wants to build a presentation/slides/deck for a talk, pitch, or project
- User wants to convert an existing PowerPoint (PPTX) file to a modern web presentation
- User wants better design than generic PowerPoint templates
- User needs to share slides via a live URL instead of sending files

## Key principles this skill enforces

1. **Zero dependencies** — Single HTML file with inline CSS/JS. No npm, no build step. Works forever.
2. **Progressive disclosure** — Start with asking about content, then feeling, then style preview, then full generation. Don't dump all options at once.
3. **Anti-AI-Slop** — Use curated style presets, not random gradients. Every style is inspired by real design references.
4. **Abstract shapes only** — No generic illustrations, no clipart. Keep it clean and modern.
5. **Full viewport slides** — Every slide fills the entire 16:9 viewport. **NO SCROLLING**.

## Workflow for new presentations

```
Phase 1: Understand content
→ Ask user: "What's the presentation about? Can you describe the slides you need (title, content for each slide)?"
→ Extract: title, subtitle/author, list of slides (each with title + key points). Confirm before proceeding.

Phase 2: Understand feeling
→ Ask user: "What feeling do you want the presentation to have? (e.g., professional/techy/playful/calm/elegant)"
→ Match feeling to appropriate preset candidates from STYLE_PRESETS.md.

Phase 3: Style preview
→ Generate 3 small (single-slide) HTML previews in 3 different styles that match the user's feeling
→ Show previews (screenshot or describe) and ask user to pick one
→ For example: "Which style appeals more to you? 1) Bold Signal 2) Neon Cyber 3) Swiss Modern"

Phase 4: Full generation
→ Using the chosen style, generate the full multi-slide HTML presentation
→ Include all the content from Phase 1
→ Follow the HTML structure from html-template.md
→ Include the mandatory viewport-base.css
→ Add staggered reveal animations matching the feeling (see animation-patterns.md)

Phase 5: Sharing options
→ Tell user they can:
  1. Open directly in browser (just open the HTML file)
  2. Deploy to a live URL: `bash scripts/deploy.sh <path-to-html>`
  3. Export to PDF: `bash scripts/export-pdf.sh <path-to-html>`
```

## Workflow for PPTX conversion

```
Phase 1: Extract content
→ Run: `python scripts/extract-pptx.py <input-file> <output-dir>`
→ Show extracted JSON to user for confirmation

Phase 2-5: Same as new presentation
→ Ask about feeling → 3 style previews → user picks → generate full HTML
```

## Rules for code generation

- **MUST** use the CSS custom properties pattern from `html-template.md`
- **MUST** include the entire `viewport-base.css` contents in the `<style>` tag
- **MUST** use `clamp()` for all font sizes and spacing (responsive by default)
- **MUST** import fonts from Fontshare (never system fonts, never Google Fonts if you can use Fontshare)
- **MUST** make every slide fill the entire viewport (100vh height, 100vw width)
- **MUST NOT** add external dependencies (no Tailwind, no React, nothing)
- **MUST** add comments explaining what each section does (kindness for future reader)
- **MUST** use the `reveal` class with staggered transition-delay for sequential animation
- **MUST** include the full SlidePresentation JS class from the template for navigation

## Included reference files

- `STYLE_PRESETS.md` — 12 curated visual styles (dark/light/specialty)
- `html-template.md` — base HTML structure with CSS/JS boilerplate
- `viewport-base.css` — mandatory responsive base styles
- `animation-patterns.md` — animation references by feeling
- `scripts/extract-pptx.py` — extract content from PPTX
- `scripts/deploy.sh` — deploy to Vercel for sharing
- `scripts/export-pdf.sh` — export to static PDF

---

Created by [@zarazhangrui](https://github.com/zarazhangrui) — https://github.com/zarazhangrui/frontend-slides
