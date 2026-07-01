---
name: x-reader-video
description: 提取 YouTube、Bilibili、播客等视频音频的字幕、逐字稿与摘要。
---

# x-reader-video Skill

> Video/Podcast Reader — fetch transcript from video/podcast and output full text + summary.

## Trigger

Auto-trigger when user sends a video/podcast URL:
- YouTube URL (`youtube.com` / `youtu.be`)
- Bilibili URL (`bilibili.com`)
- 小宇宙 podcast URL (`xiaoyuzhoufm.com`)
- Apple Podcasts URL (`podcasts.apple.com`)

## Pipeline

### Step 1: Use x-reader to get metadata

```bash
x-reader [URL]
```

Gets title, description, basic info.

### Step 2: Extract transcript

For YouTube:
- Try to get built-in subtitles via yt-dlp
- If no subtitles, transcribe audio via Whisper (Groq API)

For Bilibili:
- Get subtitle via API
- If none, transcribe

For podcast:
- Download audio file → transcribe via Whisper

### Step 3: Format output

```markdown
## 🎥 Video Transcript: [Title]

**Source**: [URL]
**Duration**: [duration if available]
**Platform**: [YouTube/Bilibili/Podcast]

---

### 📋 Summary

[2-5 sentence summary of key points]

---

### 🔤 Full Transcript

[full transcript here]

---

*Transcribed by x-reader-video*
```

### Step 4: Auto-analyze (optional)

After transcription, auto-trigger `x-reader-analyzer` for multi-dimensional analysis if content is substantive.

## Rules

1. **Keep full transcript** unless user asks for summary only
2. **Timestamp optional** — remove if not needed for readability
3. **Clean up filler words** — remove "um", "ah", repeated phrases in transcription
4. **Save transcript** to `E-产出交付/06-临时文件/` for future reference

## Dependencies

- Requires `x-reader` Python package installed
- Requires `yt-dlp` and `ffmpeg` for video
- Requires `GROQ_API_KEY` for Whisper transcription
