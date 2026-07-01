#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
解析AI HOT四个板块完整数据，并根据林总的商业定位进行筛选
"""

import json
import re
from datetime import datetime

# 商业定位筛选关键词 - 保留（高相关）
KEEP_KEYWORDS = {
    # AI工具/模型/智能体 - 核心内容
    'AI', '模型', '大模型', 'GPT', 'Claude', 'Anthropic', 'OpenAI', 'Gemini',
    'Grok', 'DeepSeek', '混元', '豆包', 'SenseNova', 'LLM', 'Agent', '智能体',
    '插件', 'SDK', 'API', 'MCP', '工具', '工作流', 'OpenClaw',

    # 内容创作/自媒体 - 相关
    '内容', '创作', '自媒体', '公众号', '抖音', '视频', '文案', '提示词', 'prompt',

    # 创业/副业/一人公司 - 核心定位
    '创业', '副业', '一人公司', '变现', '赚钱', '商业', '产品', '定价', '流量',
    '获客', '私域', '转化', '分销', '陪跑', '社群', '训练营',

    # 大学/保研/学习 - 主线之一
    '大学', '学生', '保研', '绩点', '论文', '竞赛', '学习', '提效', '效率',

    # 技术/开源 - 有用
    '开源', 'GitHub', '代码', '编程', '开发', '部署', 'RAG', '检索增强',
    '训练', '推理', '蒸馏', 'LoRA', 'KV缓存', '算力', 'GPU', 'TPU',

    # 行业动态 - 需要了解
    '融资', '估值', '合作', '谷歌云', 'SpaceX', 'NVIDIA', 'Meta', 'Google'
}

# 过滤关键词 - 排除（低相关）
FILTER_KEYWORDS = {
    # 纯硬件制造/供应链
    '芯片', '台积电', '三星', '晶圆', '光刻', '半导体', '制程',

    # 纯监管政策
    '监管', '政策', '立法', '法案', '反垄断', '诉讼',

    # 纯财经并购
    '并购', '收购', '财报', '股价', '市值', 'PE', 'IPO', '分红',

    # 八卦娱乐
    '八卦', '绯闻', '离婚', '结婚', '马斯克'
}

def should_keep(item):
    """判断是否应该保留这条新闻，基于相关性"""
    text = (item['title'] + ' ' + item.get('summary', '')).lower()

    # 如果包含过滤关键词且不包含保留关键词，过滤
    has_filter = any(k.lower() in text for k in FILTER_KEYWORDS)
    has_keep = any(k.lower() in text for k in KEEP_KEYWORDS)

    # 精选热点全部保留，因为已经是大佬筛选过的
    if item.get('is_featured'):
        return True

    # 非精选，只有高相关才保留
    return has_keep

def parse_featured(text):
    """解析精选板块内容"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    items = []
    current = None
    state = 'date'  # date -> time -> source -> featured -> heat -> title -> content -> tags

    for line in lines:
        # 跳过导航
        if line in ['AI', 'HOT', '精选', '全部 AI 动态', 'AI 日报', '低粉爆文', '关于', '登录',
                   'AI 自动挑选的高价值内容', '筛选']:
            continue

        if re.match(r'^\d+月\d+日$', line) and state == 'date':
            if current and current.get('title'):
                if should_keep(current):
                    items.append(current)
            current = {'date': line, 'is_featured': True}
            state = 'time'
            continue

        if re.match(r'^\d+:\d+$', line) and state in ['date', 'time']:
            if current:
                current['time'] = line
            state = 'source'
            continue

        if state == 'source':
            if line == '精选':
                current['is_featured'] = True
                continue
            current['source'] = line
            # 检查下一行是不是精选
            state = 'check_featured'
            continue

        if state == 'check_featured':
            if line == '精选':
                current['is_featured'] = True
                state = 'heat'
            elif re.match(r'^\d+$', line):
                current['heat'] = int(line)
                state = 'title'
            else:
                current['title'] = line
                state = 'content'
            continue

        if state == 'heat':
            if re.match(r'^\d+$', line):
                current['heat'] = int(line)
                state = 'title'
            continue

        if state == 'title':
            current['title'] = line
            state = 'content'
            continue

        if state == 'content':
            if re.match(r'^\d+$', line) and not current.get('heat'):
                current['heat'] = int(line)
                continue
            if line == '精选':
                current['is_featured'] = True
                continue
            # 短行通常是标签
            if len(line) < 20 and (len(line.split()) <= 2 or line in ['产品更新', '行业动态', '开源生态']):
                if 'tags' not in current:
                    current['tags'] = []
                current['tags'].append(line)
                state = 'tags'
            else:
                if 'summary' not in current:
                    current['summary'] = ''
                current['summary'] += line + ' '
            continue

        if state == 'tags':
            if len(line) < 20 and (len(line.split()) <= 2 or not any(c in line for c in ['，', ',', '。'])):
                if line == '精选':
                    current['is_featured'] = True
                elif re.match(r'^\d+月\d+日$', line):
                    # 新日期，开始下一条
                    if current and current.get('title'):
                        if should_keep(current):
                            items.append(current)
                    current = {'date': line, 'is_featured': False}
                    state = 'time'
                else:
                    current['tags'].append(line)
            elif re.match(r'^\d+月\d+日$', line):
                if current and current.get('title'):
                    if should_keep(current):
                        items.append(current)
                current = {'date': line, 'is_featured': False}
                state = 'time'
            else:
                if 'summary' not in current:
                    current['summary'] = ''
                current['summary'] += line + ' '

    # 添加最后一条
    if current and current.get('title'):
        if should_keep(current):
            items.append(current)

    return items

def parse_low_follower(text):
    """解析低粉爆文板块"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    items = []
    current = None
    started = False

    for line in lines:
        if line in ['低粉爆文', '筛选']:
            continue
        if '低粉爆文' in line:
            started = True
            continue

        # 格式: 1. 标题 作者:xxx 点赞:xxx
        m = re.match(r'^\d+\.\s*(.+?)\s+作者:', line)
        if m:
            if current:
                if should_keep(current):
                    items.append(current)
            title = m.group(1)
            current = {'title': title, 'is_low_follower': True}
            continue

    if current and current.get('title'):
        if should_keep(current):
            items.append(current)

    return items

def main():
    # 读取JSON
    with open('C-记忆核心/02-每日输入/aihot_full_all_sections.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 解析各个板块
    result = {
        'featured': [],  # 🔥 精选热点 -> 全部保留
        'allAi': [],    # 📋 全部 AI 动态 -> 筛选
        'aiDaily': [],  # 📋 AI日报 -> 筛选
        'lowFollower': [] # 📈 低粉爆文 -> 筛选
    }

    # 解析精选
    if 'featured' in data:
        featured_text = data['featured']['text']
        result['featured'] = parse_featured(featured_text)
        print(f"[OK] 精选板块: 筛选后保留 {len(result['featured'])} 条")

    # 解析全部AI动态
    if 'allAi' in data:
        allai_text = data['allAi']['text']
        result['allAi'] = parse_featured(allai_text)
        print(f"[OK] 全部AI动态: 筛选后保留 {len(result['allAi'])} 条")

    # 解析低粉爆文
    if 'lowFollower' in data:
        low_text = data['lowFollower']['text']
        result['lowFollower'] = parse_low_follower(low_text)
        print(f"[OK] 低粉爆文: 筛选后保留 {len(result['lowFollower'])} 条")

    # 生成Markdown
    update_time = datetime.now().strftime('%Y-%m-%d %H:%M')

    md = f'# AI HOT 每日动态汇总\n\n'
    md += f'> 数据来源：https://aihot.virxact.com/\n'
    md += f'> 更新时间：{update_time}\n'
    md += f'> 根据「我是林kunki」商业定位智能筛选后结果\n\n'
    md += '---\n\n'

    # 🔥 精选热点 - 全部保留
    if result['featured']:
        md += '## 🔥 精选热点（AI HOT官方精选，全部保留）\n\n'
        md += '| # | 标题 | 一句话摘要 | 标签 |\n'
        md += '|---|------|------------|------|\n'
        for i, item in enumerate(result['featured'], 1):
            title = item['title']
            summary = item.get('summary', '').strip()[:100] + ('...' if len(item.get('summary', '')) > 100 else '')
            tags = ', '.join(item.get('tags', []))
            md += f'| {i} | {title} | {summary} | {tags} |\n'
        md += '\n---\n\n'

    # 📋 全部AI动态 - 筛选后
    if result['allAi']:
        md += '## 📋 全部 AI 动态（筛选后，保留高相关）\n\n'
        md += '*(按相关性筛选，只保留与「AI工具+一人公司+大学生成长」相关内容)*\n\n'
        for i, item in enumerate(result['allAi'], 1):
            title = item['title']
            summary = item.get('summary', '').strip()
            tags = ' '.join(f'`{tag}`' for tag in item.get('tags', []))
            md += f'{i}. **{title}**  \n'
            if summary:
                md += f'   {summary}  \n'
            if tags:
                md += f'   {tags}\n'
            md += '\n'
        md += '---\n\n'

    # 📈 低粉爆文 - 筛选后
    if result['lowFollower']:
        md += '## 📈 低粉爆文（筛选后）\n\n'
        for i, item in enumerate(result['lowFollower'], 1):
            md += f'{i}. **{item["title"]}**\n\n'
        md += '---\n\n'

    # AI日报需要重新解析，先暂时放这里
    md += '## 📋 AI日报\n'
    md += '*内容较长，下次更新完整解析*\n\n'

    md += f'---\n\n*数据抓取：{update_time} | 智能筛选规则基于「我是林kunki」商业定位*'

    # 保存
    output_file = 'C-记忆核心/02-每日输入/AI-HOT每日动态汇总.md'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(md)

    print(f"\n[DONE] 完成！输出已保存到 {output_file}")
    print(f"  精选: {len(result['featured'])} 条")
    print(f"  全部AI动态: {len(result['allAi'])} 条")
    print(f"  低粉爆文: {len(result['lowFollower'])} 条")

    # 输出统计
    total = len(result['featured']) + len(result['allAi']) + len(result['lowFollower'])
    print(f"  总计保留: {total} 条")

if __name__ == '__main__':
    main()
