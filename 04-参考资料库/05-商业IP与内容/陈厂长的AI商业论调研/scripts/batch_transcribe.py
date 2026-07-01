#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from faster_whisper import WhisperModel

AUDIO_DIR = Path("/Users/kunki/ObsidianVaults/领航知识库/outputs/wechat-channels-chenchangzhang/04-audio")
OUTPUT_DIR = Path("/Users/kunki/ObsidianVaults/领航知识库/outputs/wechat-channels-chenchangzhang/05-transcripts")
META_DIR = Path("/Users/kunki/ObsidianVaults/领航知识库/outputs/wechat-channels-chenchangzhang/05-transcripts-meta")

def md_timestamp(seconds: float) -> str:
    total = int(max(0.0, seconds))
    minutes, sec = divmod(total, 60)
    hours, minutes = divmod(minutes, 60)
    if hours:
        return f"{hours:02d}:{minutes:02d}:{sec:02d}"
    return f"{minutes:02d}:{sec:02d}"

def srt_timestamp(seconds: float) -> str:
    ms_total = int(round(max(0.0, seconds) * 1000))
    hours, rem = divmod(ms_total, 3_600_000)
    minutes, rem = divmod(rem, 60_000)
    sec, ms = divmod(rem, 1000)
    return f"{hours:02d}:{minutes:02d}:{sec:02d},{ms:03d}"

def transcribe_one(audio_path: Path, video_index: str, model: WhisperModel) -> dict:
    segments_iter, info = model.transcribe(
        str(audio_path),
        language="zh",
        word_timestamps=True,
        vad_filter=True,
        beam_size=5,
    )

    title = f"{video_index}"
    raw_md_name = f"{video_index}.md"
    raw_txt_name = f"{video_index}.txt"
    subtitle_name = f"{video_index}.srt"
    words_name = f"{video_index}_words.json"

    md_lines = [f"# {video_index} 逐字稿", ""]
    txt_lines: list[str] = []
    srt_lines: list[str] = []
    segment_rows: list[dict] = []
    word_rows: list[dict] = []
    srt_index = 1

    for segment in segments_iter:
        text = segment.text.strip()
        if not text:
            continue
        md_lines.append(f"[{md_timestamp(segment.start)}] {text}")
        txt_lines.append(text)
        srt_lines.extend(
            [
                str(srt_index),
                f"{srt_timestamp(segment.start)} --> {srt_timestamp(segment.end)}",
                text,
                "",
            ]
        )
        srt_index += 1
        segment_rows.append({"start": segment.start, "end": segment.end, "text": text})
        for word in segment.words or []:
            word_text = (word.word or "").strip()
            if word_text:
                word_rows.append(
                    {
                        "start": word.start,
                        "end": word.end,
                        "word": word_text,
                        "probability": word.probability,
                    }
                )

    OUTPUT_DIR.joinpath(raw_md_name).write_text("\n".join(md_lines) + "\n", encoding="utf-8")
    OUTPUT_DIR.joinpath(raw_txt_name).write_text("\n".join(txt_lines) + "\n", encoding="utf-8")
    OUTPUT_DIR.joinpath(subtitle_name).write_text("\n".join(srt_lines), encoding="utf-8")
    META_DIR.joinpath(words_name).write_text(
        json.dumps({"segments": segment_rows, "words": word_rows}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    return {
        "video_index": video_index,
        "model": "faster-whisper-small",
        "language": info.language,
        "language_probability": info.language_probability,
        "duration": info.duration,
        "segments": len(segment_rows),
        "words": len(word_rows),
        "files": {
            "md": raw_md_name,
            "txt": raw_txt_name,
            "srt": subtitle_name,
            "words_json": words_name,
        },
    }

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    META_DIR.mkdir(parents=True, exist_ok=True)
    
    audio_files = sorted(list(AUDIO_DIR.glob("*.mp3")))
    print(f"Found {len(audio_files)} audio files to transcribe")
    
    # 使用small模型，平衡速度和准确率
    print("Loading faster-whisper small model...")
    model = WhisperModel("small", device="cpu", compute_type="int8")
    print("Model loaded, starting transcription...")
    
    results = []
    completed = 0
    
    for audio_file in audio_files:
        video_index = audio_file.stem
        
        # Check if already transcribed
        if (OUTPUT_DIR / f"{video_index}.md").exists():
            print(f"[{completed+1}/{len(audio_files)}] Skipping {video_index}, already transcribed")
            completed += 1
            continue
        
        print(f"[{completed+1}/{len(audio_files)}] Transcribing {video_index}...")
        result = transcribe_one(audio_file, video_index, model)
        results.append(result)
        completed += 1
        print(f"  Done: {result['segments']} segments, {result['words']} words, {result['duration']:.1f}s")
    
    # Save summary
    summary_file = OUTPUT_DIR.parent / "transcription_summary.json"
    summary = {
        "total": len(audio_files),
        "completed": completed,
        "results": results,
    }
    summary_file.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    
    print(f"\n=== Transcription Complete ===")
    print(f"Total: {len(audio_files)}")
    print(f"Completed: {completed}")
    total_duration = sum(r.get('duration', 0) for r in results)
    print(f"Total audio duration: {total_duration/60:.1f} minutes")

if __name__ == "__main__":
    main()
