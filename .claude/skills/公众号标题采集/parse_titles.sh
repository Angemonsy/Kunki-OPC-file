#!/bin/bash
# 公众号文章标题解析脚本
# 用途：解析用户提供的文章列表，提取标题和时间信息

set -euo pipefail

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 使用说明
usage() {
    cat << EOF
使用说明:
  $0 <input_file> <output_file> [account_name]

参数:
  input_file    - 输入文件（用户提供的文章列表）
  output_file   - 输出 Markdown 文件路径
  account_name  - 公众号名称（可选）

示例:
  $0 articles.txt output.md "人民日报"
EOF
    exit 1
}

# 检查参数
if [ $# -lt 2 ]; then
    usage
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"
ACCOUNT_NAME="${3:-未知公众号}"

# 检查输入文件
if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}错误: 输入文件不存在: $INPUT_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}开始解析文章列表...${NC}"

# 统计信息
TOTAL_COUNT=0
CURRENT_DATE=$(date +%Y-%m-%d\ %H:%M:%S)

# 提取标题和时间（假设格式：标题 - 时间）
# 需要根据实际数据格式调整正则表达式
declare -a TITLES=()
declare -a DATES=()

while IFS= read -r line; do
    if [[ $line =~ ^(.+)[[:space:]]-[[:space:]]([0-9]{4}-[0-9]{2}-[0-9]{2}) ]]; then
        title="${BASH_REMATCH[1]}"
        date="${BASH_REMATCH[2]}"
        TITLES+=("$title")
        DATES+=("$date")
        ((TOTAL_COUNT++))
    fi
done < "$INPUT_FILE"

echo -e "${GREEN}找到 $TOTAL_COUNT 篇文章${NC}"

# 生成 Markdown 报告
cat > "$OUTPUT_FILE" << EOF
---
公众号: $ACCOUNT_NAME
抓取时间: $CURRENT_DATE
文章总数: $TOTAL_COUNT
---

# ${ACCOUNT_NAME} 文章标题分析报告

## 📊 基础数据

- 文章总数: $TOTAL_COUNT 篇
- 分析时间: $CURRENT_DATE

## 📝 文章列表

EOF

# 按月份分组输出
current_month=""
for i in "${!TITLES[@]}"; do
    title="${TITLES[$i]}"
    date="${DATES[$i]}"
    month="${date:0:7}"

    if [ "$month" != "$current_month" ]; then
        current_month="$month"
        echo "" >> "$OUTPUT_FILE"
        echo "### $month" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi

    echo "$((i+1)). $title - $date" >> "$OUTPUT_FILE"
done

# 添加统计分析
cat >> "$OUTPUT_FILE" << EOF

## 🔍 标题特征分析

### 基础统计

- 总文章数: $TOTAL_COUNT 篇

### 待深度分析

使用以下命令进行深度分析：
\`\`\`bash
# 分析标题长度
awk '{print length(\$0)}' articles.txt | awk '{sum+=\$1; n++} END {print "平均长度:", sum/n}'

# 提取高频词汇
cat articles.txt | tr ' ' '\n' | sort | uniq -c | sort -rn | head -20
\`\`\`

EOF

echo -e "${GREEN}✓ 报告已生成: $OUTPUT_FILE${NC}"
echo -e "${BLUE}提示: 使用 Obsidian 打开查看完整报告${NC}"
