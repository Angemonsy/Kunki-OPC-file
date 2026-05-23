#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用正则提取低粉爆文链接
"""

import re

# 读取HTML
with open('C-记忆核心/02-每日输入/aihot_lowfollower_html.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 匹配文章卡片
# 结构：<div class="article-card"> ... <a href="url">title</a> ... 粉丝: xxx 赞: xxx 藏: xxx
pattern = r'<div[^>]*article-card[^>]*>.*?<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>.*?粉丝[:：]\s*(\d+).*?赞[:：]\s*(\d+).*?藏[:：]\s*(\d+)'

matches = re.findall(pattern, html, re.DOTALL)
print(f"找到 {len(matches)} 篇文章:\n")

articles = []
for url, title, fans, like, collect in matches:
    title = re.sub(r'<[^>]+>', '', title).strip()
    articles.append({
        'title': title,
        'url': url,
        'fans': int(fans),
        'like': int(like),
        'collect': int(collect)
    })
    print(f"{len(articles)}. {title}")
    print(f"   链接: {url}")
    print(f"   粉丝: {fans}, 点赞: {like}, 收藏: {collect}\n")

# 输出Markdown
with open('C-记忆核心/02-每日输入/lowfollower_links.md', 'w', encoding='utf-8') as f:
    f.write("# 低粉爆文链接汇总\n\n")
    f.write("| # | 爆文标题 | 粉丝 | 点赞 | 收藏 | 链接 |\n")
    f.write("|---|----------|------|------|------|------|\n")
    for i, art in enumerate(articles, 1):
        f.write(f"| {i} | [{art['title']}]({art['url']}) | {art['fans']} | {art['like']} | {art['collect']} | [🔗打开]({art['url']}) |\n")

print("\nOK 已保存到 C-记忆核心/02-每日输入/lowfollower_links.md")
