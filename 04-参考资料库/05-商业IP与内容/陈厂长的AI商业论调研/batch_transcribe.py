#!/usr/bin/env python3
"""
批量本地语音转写脚本
使用 faster-whisper 本地模型转写视频音频
"""

from pathlib import Path
import json
import subprocess
from faster_whisper import WhisperModel


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


def extract_audio(video_path: Path, audio_output_path: Path) -> bool:
    """使用 ffmpeg 从视频提取音频为 mp3"""
    cmd = [
        "ffmpeg", "-y",
        "-i", str(video_path),
        "-vn",
        "-acodec", "libmp3lame",
        "-ab", "192k",
        "-ac", "1",
        str(audio_output_path)
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        return result.returncode == 0
    except Exception:
        return False


def transcribe_audio(audio: Path, output_dir: Path, meta_dir: Path, title: str, model_name: str = "small") -> dict:
    """使用 faster-whisper 转写音频"""
    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    segments_iter, info = model.transcribe(
        str(audio),
        language="zh",
        word_timestamps=True,
        vad_filter=True,
        beam_size=5,
    )

    raw_md_name = f"{title}.md"
    raw_txt_name = f"{title}.txt"
    subtitle_name = f"{title}.srt"
    words_name = f"{title}_words.json"

    md_lines = [f"# {title}", ""]
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

    output_dir.joinpath(raw_md_name).write_text("\n".join(md_lines) + "\n", encoding="utf-8")
    output_dir.joinpath(raw_txt_name).write_text("\n".join(txt_lines) + "\n", encoding="utf-8")
    output_dir.joinpath(subtitle_name).write_text("\n".join(srt_lines), encoding="utf-8")
    meta_dir.joinpath(words_name).write_text(
        json.dumps({"segments": segment_rows, "words": word_rows}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    return {
        "model": f"faster-whisper-{model_name}",
        "language": info.language,
        "language_probability": info.language_probability,
        "duration": info.duration,
        "segments": len(segment_rows),
        "words": len(word_rows),
        "files": {
            "raw_transcript_md": raw_md_name,
            "raw_transcript_txt": raw_txt_name,
            "subtitle_srt": subtitle_name,
            "words_json": words_name,
        },
    }


def main():
    # 配置
    base_dir = Path("/Users/kunki/ObsidianVaults/领航知识库/outputs/wechat-channels-chenchangzhang")
    videos_dir = base_dir / "03-videos" / "decrypted"
    audio_dir = base_dir / "04-audio"
    transcripts_dir = base_dir / "05-transcripts"
    meta_dir = base_dir / "05-transcripts" / "meta"
    model_name = "small"  # small 模型，平衡准确率和速度
    
    audio_dir.mkdir(exist_ok=True, parents=True)
    transcripts_dir.mkdir(exist_ok=True, parents=True)
    meta_dir.mkdir(exist_ok=True, parents=True)
    
    # 获取所有 mp4 视频
    video_files = sorted(list(videos_dir.glob("*.mp4")))
    print(f"找到 {len(video_files)} 个视频文件")
    
    # 记录进度
    results = []
    
    for i, video_path in enumerate(video_files, 1):
        # 序号和标题
        seq_num = video_path.name.split("-")[0]
        video_id = video_path.stem
        title = f"{seq_num}_{video_id}"
        
        print(f"\n[{i}/{len(video_files)}] 处理: {title}")
        
        # 提取音频
        audio_path = audio_dir / f"{video_id}.mp3"
        if not audio_path.exists():
            print(f"  提取音频...")
            success = extract_audio(video_path, audio_path)
            if not success:
                print(f"  ❌ 音频提取失败，跳过")
                results.append({"video": video_path.name, "success": False, "error": "extract audio failed"})
                continue
        else:
            print(f"  ⚠️ 音频已存在，跳过提取")
        
        # 检查转写是否已存在
        md_exists = (transcripts_dir / f"{title}.md").exists()
        if md_exists:
            print(f"  ⚠️ 转写已存在，跳过")
            results.append({"video": video_path.name, "success": True, "skipped": True})
            continue
        
        # 转写
        print(f"  开始转写...（这需要一些时间）")
        try:
            result = transcribe_audio(audio_path, transcripts_dir, meta_dir, title, model_name)
            result["video"] = video_path.name
            result["success"] = True
            results.append(result)
            print(f"  ✅ 完成: {result['segments']} 段落, {result['words']} 词, {result['duration']:.1f} 秒")
        except Exception as e:
            print(f"  ❌ 转写失败: {e}")
            results.append({"video": video_path.name, "success": False, "error": str(e)})
    
    # 保存汇总结果
    summary = {
        "total": len(video_files),
        "success": sum(1 for r in results if r.get("success")),
        "skipped": sum(1 for r in results if r.get("skipped")),
        "failed": sum(1 for r in results if not r.get("success")),
        "model": model_name,
        "results": results,
    }
    
    base_dir.joinpath("transcription_summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    
    print(f"\n===== 批量转写完成 =====")
    print(f"总计: {summary['total']}")
    print(f"成功: {summary['success']}")
    print(f"跳过: {summary['skipped']}")
    print(f"失败: {summary['failed']}")
    print(f"输出目录: {transcripts_dir}")


if __name__ == "__main__":
    main()
