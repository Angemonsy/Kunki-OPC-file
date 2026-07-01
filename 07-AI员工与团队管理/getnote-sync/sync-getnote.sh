#!/bin/bash

# 配置
OBSIDIAN_ROOT="/Users/kunki/ObsidianVaults/领航知识库"
GETNOTES_FOLDER="$OBSIDIAN_ROOT/00-inbox/020 GetNotes"

# 类型映射到文件夹
get_folder() {
  case "$1" in
    "class_audio") echo "01 语音记录" ;;
    "recorder_audio") echo "01 语音记录" ;;
    "meeting") echo "02 多人会议" ;;
    "plain_text") echo "03 纯文本记录" ;;
    "link") echo "04 链接同步摘抄" ;;
    "img_text") echo "04 链接同步摘抄" ;;
    *) echo "99 其他" ;;
  esac
}

echo "📥 开始同步所有 GetNote 笔记到 Obsidian..."
echo "目标文件夹: $GETNOTES_FOLDER"
echo ""

SYNCED=0
SKIPPED=0
TOTAL=0

while read -r NOTE_ID; do
  if [ -z "$NOTE_ID" ]; then
    continue
  fi

  TOTAL=$((TOTAL + 1))
  
  # Get note details in json
  NOTE_JSON=$(~/bin/getnote note "$NOTE_ID" -o json)
  if [ $? -ne 0 ]; then
    echo "❌ 获取笔记 $NOTE_ID 失败"
    continue
  fi
  
  # Parse with python
  PARSE_RESULT=$(python3 -c "
import json
data = json.loads('$NOTE_JSON')
note = data['data']['note']
print('-----')
print(note.get('title', ''))
print(note.get('type', ''))
print(note.get('created_at', ''))
print(note.get('content', ''))
print(note.get('url', ''))
import json
tags = note.get('tags', [])
print(json.dumps(tags))
")
  # 分割输出
  LINES=()
  IN_CONTENT=0
  CONTENT=""
  while IFS= read -r line; do
    if [ "$line" = "-----" ]; then
      continue
    fi
    if [ $IN_CONTENT -lt 4 ]; then
      LINES+=("$line")
      IN_CONTENT=$((IN_CONTENT + 1))
    elif [ $IN_CONTENT -eq 4 ]; then
      CONTENT="$line"
      IN_CONTENT=$((IN_CONTENT + 1))
    elif [ $IN_CONTENT -eq 5 ]; then
      CONTENT="$CONTENT"$'\n'"$line"
    else
      TAGS_LINE="$line"
    fi
  done <<< "$PARSE_RESULT"
  
  TITLE="${LINES[0]}"
  TYPE="${LINES[1]}"
  CREATED_AT="${LINES[2]}"
  URL=$(echo "$PARSE_RESULT" | tail -n 2 | head -n 1)
  TAGS=$(echo "$PARSE_RESULT" | tail -n 1)
  
  # 如果标题为空，使用 untitled-id
  if [ -z "$TITLE" ]; then
    TITLE="untitled-$NOTE_ID"
  fi
  
  # 安全文件名
  SAFE_TITLE=$(echo "$TITLE" | sed 's/[\\/*?:"<>|]/-/g' | sed 's/\s\+/ /g' | sed 's/ *$//')
  FOLDER=$(get_folder "$TYPE")
  TARGET_FOLDER="$GETNOTES_FOLDER/$FOLDER"
  FILE_PATH="$TARGET_FOLDER/$SAFE_TITLE.md"
  
  # 检查是否存在
  if [ -f "$FILE_PATH" ]; then
    SKIPPED=$((SKIPPED + 1))
    continue
  fi
  
  echo "✅ [$TOTAL] $SAFE_TITLE -> $FOLDER"
  
  # 生成 Markdown
  cat > "$FILE_PATH" << MARKER
---
getnote_id: $NOTE_ID
title: $TITLE
type: $TYPE
created_at: $CREATED_AT
url: https://biji.com/note/$NOTE_ID
tags:
MARKER

  # 添加标签
  echo "$TAGS" | python3 -c "
import json
import sys
tags = json.load(sys.stdin)
for tag in tags:
    print(f'  - {tag}')
" >> "$FILE_PATH"

cat >> "$FILE_PATH" << MARKER
---

# $TITLE

$CONTENT

来源: [得到大脑]($URL)
MARKER

  SYNCED=$((SYNCED + 1))
done < /tmp/getnote-ids.txt

echo ""
echo "🎉 同步完成！"
echo "   新增: $SYNCED 条笔记"
echo "   跳过: $SKIPPED 条（已存在）"
echo "   总计: $((SYNCED + SKIPPED)) / $TOTAL"
