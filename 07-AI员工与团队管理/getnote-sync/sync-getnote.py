#!/usr/bin/env python3
import json
import os
import subprocess
import sys

# 配置
OBSIDIAN_ROOT = '/Users/kunki/ObsidianVaults/领航知识库'
GETNOTES_FOLDER = os.path.join(OBSIDIAN_ROOT, '00-inbox', '020 GetNotes')

# 类型映射
TYPE_MAP = {
    'class_audio': '01 语音记录',
    'recorder_audio': '01 语音记录',
    'meeting': '02 多人会议',
    'plain_text': '03 纯文本记录',
    'link': '04 链接同步摘抄',
    'img_text': '04 链接同步摘抄',
}

def get_note_ids():
    """从 table 输出提取所有笔记 ID"""
    result = subprocess.run(['/Users/kunki/bin/getnote', 'notes', '--all'],
                          capture_output=True, text=True)
    ids = []
    for line in result.stdout.split('\n'):
        line = line.strip()
        if not line or line.startswith('─'):
            continue
        # 第一个 token 就是 ID
        parts = line.split()
        if parts and parts[0].isdigit():
            ids.append(parts[0])
    return ids

def get_note_detail(note_id):
    """获取笔记详情"""
    result = subprocess.run(['/Users/kunki/bin/getnote', 'note', note_id, '-o', 'json'],
                          capture_output=True, text=True)
    if result.returncode != 0:
        return None
    try:
        data = json.loads(result.stdout)
        return data['data']['note']
    except json.JSONDecodeError as e:
        print(f"❌ 解析笔记 {note_id} JSON 失败: {e}")
        return None

def format_content(note):
    """格式化 Markdown 内容"""
    note_id = note['id']
    title = note.get('title', f'untitled-{note_id}')
    content = note.get('content', '')
    note_type = note.get('type', '')
    created_at = note.get('created_at', '')
    url = note.get('url', f'https://biji.com/note/{note_id}')
    tags = note.get('tags', [])
    
    md = f'---\n'
    md += f'getnote_id: {note_id}\n'
    md += f'title: {title}\n'
    md += f'type: {note_type}\n'
    md += f'created_at: {created_at}\n'
    md += f'url: {url}\n'
    md += f'tags:\n'
    for tag in tags:
        md += f'  - {tag}\n'
    md += f'---\n\n'
    
    if title:
        md += f'# {title}\n\n'
    
    if content:
        md += f'{content}\n\n'
    
    md += f'来源: [得到大脑]({url})\n'
    return md

def safe_filename(title):
    """生成安全的文件名"""
    return title.replace('\\', '-').replace('/', '-').replace(':', '-') \
                .replace('*', '-').replace('?', '-').replace('"', '-') \
                .replace('<', '-').replace('>', '-').replace('|', '-') \
                .strip()

def main():
    print(f"📥 开始同步 GetNote 笔记到: {GETNOTES_FOLDER}")
    ids = get_note_ids()
    print(f"✅ 找到 {len(ids)} 条笔记")
    
    synced = 0
    skipped = 0
    
    for note_id in ids:
        note = get_note_detail(note_id)
        if not note:
            continue
        
        folder_name = TYPE_MAP.get(note.get('note_type'), '99 其他')
        target_folder = os.path.join(GETNOTES_FOLDER, folder_name)
        os.makedirs(target_folder, exist_ok=True)
        
        title = note.get('title', f'untitled-{note_id}')
        if not title or title.isspace():
            title = f'untitled-{note_id}'
        
        filename = safe_filename(title) + '.md'
        filepath = os.path.join(target_folder, filename)
        
        if os.path.exists(filepath):
            skipped += 1
            continue
        
        print(f"✅ 新增: {folder_name}/{filename}")
        content = format_content(note)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        synced += 1
    
    print(f"\n🎉 同步完成!")
    print(f"   新增: {synced} 条笔记")
    print(f"   跳过: {skipped} 条（已存在）")
    print(f"   总计: {synced + skipped} / {len(ids)}")

if __name__ == '__main__':
    main()
