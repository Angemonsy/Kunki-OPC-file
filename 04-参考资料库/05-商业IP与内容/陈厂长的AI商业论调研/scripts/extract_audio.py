#!/usr/bin/env python3
import subprocess
from pathlib import Path

VIDEO_DIR = Path("/Users/kunki/ObsidianVaults/领航知识库/outputs/wechat-channels-chenchangzhang/03-videos/decrypted")
AUDIO_DIR = Path("/Users/kunki/ObsidianVaults/领航知识库/outputs/wechat-channels-chenchangzhang/04-audio")

def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    video_files = sorted(list(VIDEO_DIR.glob("*.mp4")))
    
    print(f"Found {len(video_files)} videos to extract audio")
    
    for video_file in video_files:
        audio_file = AUDIO_DIR / f"{video_file.stem}.mp3"
        if audio_file.exists():
            print(f"Skipping {video_file.name}, already extracted")
            continue
            
        print(f"Extracting audio from {video_file.name}...")
        
        cmd = [
            "ffmpeg", "-y", "-i", str(video_file),
            "-vn", "-acodec", "libmp3lame", "-ac", "1", "-ar", "16000", "-q:a", "2",
            str(audio_file)
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error extracting {video_file.name}: {result.stderr}")
        else:
            print(f"Done: {audio_file.name}")
    
    print("\nAll done!")
    audio_files = list(AUDIO_DIR.glob("*.mp3"))
    print(f"Extracted {len(audio_files)} audio files")

if __name__ == "__main__":
    main()
