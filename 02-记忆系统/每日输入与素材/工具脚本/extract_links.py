#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
提取低粉爆文页面所有文章链接
"""

import re
from bs4 import BeautifulSoup

# 读取HTML
with open('C-记忆核心/02-每日输入/aihot_lowfollower_html.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

# 查找所有文章卡片中的a标签
articles = []
article_cards = soup.find_all(class_='article-card')

for card in article_cards:
    a_tag = card.find('a')
    if a_tag and a_tag.get('href'):
        title = a_tag.get_text(strip=True)
        url = a_tag.get('href')
        # 提取粉丝点赞收藏信息
        text = card.get_text()
        fans_match = re.search(r'粉丝[:：]\s*(\d+)', text)
        like_match = re.search(r'赞[:：]\s*(\d+)', text)
        collect_match = re.search(r'藏[:：]\s*(\d+)', text)
        articles.append({
            'title': title,
            'url': url,
            'fans': int(fans_match.group(1)) if fans_match else None,
            'like': int(like_match.group(1)) if like_match else None,
            'collect': int(collect_match.group(1)) if collect_match else None
        })

print(f"找到 {len(articles)} 篇低粉爆文:")
print()
for i, art in enumerate(articles, 1):
    print(f"{i}. {art['title']}")
    print(f"   链接: {art['url']}")
    print(f"   粉丝: {art['fans']}, 点赞: {art['like']}, 收藏: {art['collect']}")
    print()

# 输出Markdown表格格式
with open('C-记忆核心/02-每日输入/lowfollower_links.md', 'w', encoding='utf-8') as f:
    f.write("| # | 爆文标题 | 粉丝 | 点赞 | 收藏 | 链接 |\n")
    f.write("|---|----------|------|------|------|------|\n")
    for i, art in enumerate(articles, 1):
        fans = art['fans'] if art['fans'] else '-'
        like = art['like'] if art['like'] else '-'
        collect = art['collect'] if art['collect'] else '-'
        f.write(f"| {i} | [{art['title']}]({art['url']}) | {fans} | {like} | {collect} | [链接]({art['url']}) |\n")

print(f"\n✓ 已保存到 C-记忆核心/02-每日输入/lowfollower_links.md")
