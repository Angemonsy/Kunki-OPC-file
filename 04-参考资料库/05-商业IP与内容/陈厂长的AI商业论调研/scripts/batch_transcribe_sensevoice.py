#!/usr/bin/env python3
import os
import sys
import requests
import subprocess
from pathlib import Path

SENSEVOICE_API = "http://127.0.0.1:18923/v1/audio/transcriptions"

def convert_to_wav(input_path, output_path):
    """Convert mp3 to 16kHz mono wav"""
    cmd = [
        'ffmpeg', '-y', '-i', str(input_path),
        '-vn', '-acodec', 'pcm_s16le',
        '-ar', '16000', '-ac', '1',
        str(output_path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ❌ 音频转换失败: {result.stderr}")
        return None
    return output_path

def transcribe_audio(audio_path, language='zh'):
    """调用本地SenseVoice API转写"""
    # Convert to wav if not wav
    if audio_path.suffix.lower() != '.wav':
        wav_path = audio_path.parent / (audio_path.stem + '.wav')
        result = convert_to_wav(audio_path, wav_path)
        if not result:
            return None
        audio_path = wav_path

    # Use absolute path
    abs_audio_path = audio_path.resolve()
    data = {
        'audioPath': str(abs_audio_path),
        'language': language
    }
    try:
        r = requests.post(SENSEVOICE_API, json=data, timeout=300)
        r.raise_for_status()
        result = r.json()
        return result.get('text', '')
    except Exception as e:
        print(f"  ❌ 转写失败: {e}")
        return None

def main():
    if len(sys.argv) != 3:
        print("Usage: python batch_transcribe_sensevoice.py <audio_dir> <output_dir>")
        sys.exit(1)
    
    audio_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # 获取所有mp3文件
    audio_files = sorted(list(audio_dir.glob("*.mp3")))
    
    print(f"🎯 开始批量转写，共 {len(audio_files)} 个音频文件")
    print(f"📍 输出目录: {output_dir}")
    print("-" * 60)
    
    success_count = 0
    fail_count = 0
    
    for audio_file in audio_files:
        # 检查是否已经转写完成
        num = audio_file.stem.split('-')[0]
        base_name = f"{num}_{num}-{audio_file.stem.split('-', 1)[1]}"
        output_md = output_dir / f"{base_name}.md"
        if output_md.exists():
            print(f"[{num}] 已存在，跳过")
            success_count += 1
            continue
        
        print(f"\n[{num}] 正在处理: {audio_file.name}")
        
        text = transcribe_audio(audio_file)
        if text is None:
            fail_count += 1
            continue
        
        # 输出三种格式：md, txt, srt
        md_path = output_dir / f"{base_name}.md"
        txt_path = output_dir / f"{base_name}.txt"
        srt_path = output_dir / f"{base_name}.srt"
        
        # Markdown
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(f"# {audio_file.stem}\n\n")
            f.write(text)
        
        # Plain text
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(text)
        
        # SRT (simple, just one segment)
        with open(srt_path, 'w', encoding='utf-8') as f:
            f.write("1\n")
            f.write("00:00:00,000 --> 99:59:59,000\n")
            f.write(text)
        
        success_count += 1
        print(f"  ✅ 完成: {len(text)} 字")
    
    print("\n" + "=" * 60)
    print(f"🏁 转写完成！成功: {success_count}, 失败: {fail_count}")
    print(f"📍 输出目录: {output_dir}")

if __name__ == "__main__":
    main()