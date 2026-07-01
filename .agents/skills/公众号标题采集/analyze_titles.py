#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
微信公众号文章标题分析工具
功能：解析、统计、分析公众号文章标题
"""

import sys
import io
import re
import json
from datetime import datetime
from collections import Counter
from typing import List, Dict, Tuple

# Windows 控制台 UTF-8 支持
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

class WeChatTitleAnalyzer:
    """公众号标题分析器"""

    def __init__(self, account_name: str = "未知公众号"):
        self.account_name = account_name
        self.articles = []

    def parse_article_list(self, text: str) -> List[Dict]:
        """
        解析文章列表文本
        支持多种格式：
        1. 标题 - 日期
        2. 标题\n日期
        3. JSON 格式
        """
        articles = []

        # 尝试按行解析
        lines = text.strip().split('\n')
        for line in lines:
            # 格式1: 标题 - YYYY-MM-DD
            match = re.search(r'^(.+?)\s*[-–—]\s*(\d{4}-\d{2}-\d{2})', line)
            if match:
                title = match.group(1).strip()
                date = match.group(2)
                articles.append({
                    'title': title,
                    'date': date,
                    'length': len(title)
                })
                continue

            # 格式2: 仅标题（没有日期）
            if line.strip() and not re.match(r'^\d{4}-\d{2}-\d{2}', line):
                articles.append({
                    'title': line.strip(),
                    'date': None,
                    'length': len(line.strip())
                })

        self.articles = articles
        return articles

    def analyze_title_features(self) -> Dict:
        """分析标题特征"""
        if not self.articles:
            return {}

        titles = [a['title'] for a in self.articles]

        # 基础统计
        total_count = len(titles)
        avg_length = sum(a['length'] for a in self.articles) / total_count

        # 特殊字符统计
        with_numbers = sum(1 for t in titles if re.search(r'\d', t))
        with_question = sum(1 for t in titles if '？' in t or '?' in t)
        with_exclamation = sum(1 for t in titles if '！' in t or '!' in t)
        with_emoji = sum(1 for t in titles if re.search(r'[😀-🙏]', t))
        with_brackets = sum(1 for t in titles if '【' in t or '】' in t or '[' in t or ']' in t)

        # 高频词提取（简单版，只提取2-4字词）
        words = []
        for title in titles:
            # 简单分词：提取所有2-4字的连续中文
            words.extend(re.findall(r'[\u4e00-\u9fa5]{2,4}', title))

        word_freq = Counter(words).most_common(20)

        return {
            'total_count': total_count,
            'avg_length': round(avg_length, 1),
            'with_numbers_pct': round(with_numbers / total_count * 100, 1),
            'with_question_pct': round(with_question / total_count * 100, 1),
            'with_exclamation_pct': round(with_exclamation / total_count * 100, 1),
            'with_emoji_pct': round(with_emoji / total_count * 100, 1),
            'with_brackets_pct': round(with_brackets / total_count * 100, 1),
            'top_words': word_freq
        }

    def generate_markdown_report(self) -> str:
        """生成 Markdown 报告"""
        features = self.analyze_title_features()

        if not features:
            return "# 错误\n\n没有找到有效的文章数据。"

        # 按月份分组
        articles_by_month = {}
        for article in self.articles:
            if article['date']:
                month = article['date'][:7]
                if month not in articles_by_month:
                    articles_by_month[month] = []
                articles_by_month[month].append(article)

        # 生成报告
        report = f"""---
公众号: {self.account_name}
抓取时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
文章总数: {features['total_count']}
---

# {self.account_name} 文章标题分析报告

## 📊 基础数据

- **文章总数**: {features['total_count']} 篇
- **平均标题字数**: {features['avg_length']} 字
- **分析时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 🔍 标题特征分析

### 标题模式统计

| 特征 | 占比 |
|------|------|
| 包含数字 | {features['with_numbers_pct']}% |
| 包含问号 | {features['with_question_pct']}% |
| 包含感叹号 | {features['with_exclamation_pct']}% |
| 包含表情符号 | {features['with_emoji_pct']}% |
| 包含括号/书名号 | {features['with_brackets_pct']}% |

### 高频词汇 Top 20

"""
        for i, (word, count) in enumerate(features['top_words'], 1):
            report += f"{i}. **{word}** - 出现 {count} 次\n"

        report += "\n## 📝 文章列表\n\n"

        if articles_by_month:
            for month in sorted(articles_by_month.keys(), reverse=True):
                report += f"\n### {month}\n\n"
                for i, article in enumerate(articles_by_month[month], 1):
                    report += f"{i}. {article['title']} - {article['date']}\n"
        else:
            # 没有日期信息，直接列出
            for i, article in enumerate(self.articles, 1):
                report += f"{i}. {article['title']}\n"

        report += "\n## 💡 选题洞察\n\n"
        report += "### 高频主题\n\n"
        report += "根据标题关键词分析，该公众号主要聚焦以下主题：\n\n"

        top_5_words = [word for word, _ in features['top_words'][:5]]
        for word in top_5_words:
            report += f"- {word}\n"

        report += "\n### 标题风格特点\n\n"

        if features['with_numbers_pct'] > 30:
            report += "- ✓ 善用数字增强说服力\n"
        if features['with_question_pct'] > 20:
            report += "- ✓ 常用疑问句引发好奇\n"
        if features['with_exclamation_pct'] > 15:
            report += "- ✓ 使用感叹号营造情绪\n"
        if features['with_emoji_pct'] > 10:
            report += "- ✓ 适度使用表情符号\n"
        if features['with_brackets_pct'] > 25:
            report += "- ✓ 用括号/书名号强调重点\n"

        report += "\n---\n\n"
        report += "*本报告由 Claude 自动生成*\n"

        return report

def main():
    """命令行入口"""
    import sys

    if len(sys.argv) < 3:
        print("使用方法: python analyze_titles.py <输入文件> <输出文件> [公众号名称]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    account_name = sys.argv[3] if len(sys.argv) > 3 else "未知公众号"

    # 读取输入
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 分析
    analyzer = WeChatTitleAnalyzer(account_name)
    analyzer.parse_article_list(content)
    report = analyzer.generate_markdown_report()

    # 保存报告
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"✓ 报告已生成: {output_file}")
    print(f"✓ 共分析 {len(analyzer.articles)} 篇文章")

if __name__ == '__main__':
    main()
