#!/bin/bash
# Social Content Fetcher - 组合工作流
# Agent Reach + Social Transcriber 一键爬取抖音/小红书

set -e

# 默认配置
KEEP_MEDIA=false

# 解析参数
while [[ $# -gt 0 ]]; do
  case $1 in
    --keep-media)
      KEEP_MEDIA=true
      shift
      ;;
    *)
      URL="$1"
      shift
      ;;
  esac
done

if [ -z "$URL" ]; then
  echo "错误：请提供抖音或小红书链接"
  echo "用法: ./workflow.sh [--keep-media] <URL>"
  exit 1
fi

echo "=== Social Content Fetcher ==="
echo "链接: $URL"
echo "保持媒体文件: $KEEP_MEDIA"
echo ""

# 步骤1: 用Agent Reach/Jina Reader获取元数据和互动数据
echo "▶️  步骤1: 获取页面元数据..."
FULL_URL=$(echo "$URL" | sed 's/xhslink.com:\/\/?/https:\/\/xhslink.com\//')
curl -s "https://r.jina.ai/$FULL_URL" > /tmp/social-fetch-$$.md
echo "✓ 元数据获取完成"
echo ""

# 步骤2: 调用Social Transcriber下载转写
echo "▶️  步骤2: Social Transcriber 下载并转写..."
export PATH="$HOME/.local/bin:$PATH"
cd /tmp
uv run --script ~/.claude/skills/mrcarlsama-social-transcriber/scripts/run_one.py "$URL"
echo "✓ 转写完成"
echo ""

echo "=== 处理完成，请AI聚合输出结果 ==="
echo "元数据保存在: /tmp/social-fetch-$$.md"
