#!/usr/bin/env python3
import asyncio
import sys
import os
from pathlib import Path
from x_reader.reader import UniversalReader

async def fetch_url(url):
    reader = UniversalReader()
    content = await reader.read(url)
    print(f"Title: {content.title}")
    print(f"Source: {content.source_name}")
    print(f"Platform: {content.source_type}")
    print(f"Content length: {len(content.content)}")
    return content

def save_to_file(content, output_dir: Path) -> Path:
    """Save content to individual markdown file."""
    # Create safe filename from title
    safe_title = "".join([c if c.isalnum() or c in '-_ ' else '_' for c in content.title])
    safe_title = safe_title.strip().replace(' ', '-')
    if not safe_title:
        safe_title = content.id

    filename = f"{safe_title}.md"
    filepath = output_dir / filename

    output_dir.mkdir(parents=True, exist_ok=True)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f"---\n")
        f.write(f"title: {content.title}\n")
        f.write(f"source_url: {content.url}\n")
        f.write(f"source_type: {content.source_type.value}\n")
        f.write(f"fetched_at: {content.fetched_at}\n")
        f.write(f"---\n\n")
        f.write(f"# {content.title}\n\n")
        f.write(content.content)

    print(f"\nSaved to: {filepath}")
    return filepath

async def main():
    if len(sys.argv) < 2:
        print("Usage: python fetch_wechat.py <url>")
        return 1

    url = sys.argv[1]
    content = await fetch_url(url)

    # 保存到output目录
    output_dir = Path("./03.参考资料库/公众号文章存档")
    saved_path = save_to_file(content, output_dir)
    return 0

if __name__ == "__main__":
    exit(asyncio.run(main()))
