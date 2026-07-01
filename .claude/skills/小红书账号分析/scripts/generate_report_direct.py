#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
直接生成小红书账号分析报告
"""

import sys
sys.path.append('C:\\Users\\86155\\Desktop\\skill-project\\.claude\\skills\\小红书账号分析\\scripts')

from report_generator import XiaohongshuReportGenerator

# 爬取到的数据
data = {
    "success": True,
    "user_id": "646f4ec9000000001c02af3f",
    "user_info": {
        "nickname": "清华鹏哥讲AI智能体",
        "desc": "Stay Hungry,Stay Foolish\n清华工科硕士丨研究方向神经网络预测\n🚩分享AI前沿玩法、国内外有意思的落地案例\n曾就职于中民投、昆吾九鼎等一线PE基金\nAgent公司创始人",
        "follower_count": "3.5万",
        "liked_count": "17.3万",
        "ip_location": "四川"
    },
    "notes": [
        {"url": "https://www.xiaohongshu.com/explore/6913f5180000000005039f15", "title": "颠覆式使用AI的方法，让AI主动追问效率MAX", "liked_count": "370"},
        {"url": "https://www.xiaohongshu.com/explore/6912e0550000000004017cd8", "title": "35岁，干土木工程的，现在想学AI，行吗？", "liked_count": "35"},
        {"url": "https://www.xiaohongshu.com/explore/691185160000000005033adc", "title": "混沌期，才是最大的红利期。", "liked_count": "32"},
        {"url": "https://www.xiaohongshu.com/explore/690f6c080000000004017967", "title": "有好奇心的人，只需三步训练AI智能体分身", "liked_count": "47"},
        {"url": "https://www.xiaohongshu.com/explore/690d9bcd00000000040283cd", "title": "2025年底了，AI领域明年的机会在哪里？", "liked_count": "2025"},
        {"url": "https://www.xiaohongshu.com/explore/690d6b880000000004011e8c", "title": "1个人没有团队，学AI先问三个问题", "liked_count": "1"},
        {"url": "https://www.xiaohongshu.com/explore/690b37ef0000000007032dad", "title": "现在AI赛道，像极了2000年互联网泡沫前夜?", "liked_count": "2000"},
        {"url": "https://www.xiaohongshu.com/explore/690a0d3c000000000700ebc8", "title": "1个方法瞬间看清选智能体还是选工作流", "liked_count": "1"},
        {"url": "https://www.xiaohongshu.com/explore/69088d4500000000070222a0", "title": "Dan Koe 数百万粉丝的五步内容创作心法", "liked_count": "49"},
        {"url": "https://www.xiaohongshu.com/explore/69071b370000000007001bdd", "title": "如何训练自己马上行动的超高执行力？", "liked_count": "27"},
        {"url": "https://www.xiaohongshu.com/explore/690566ef000000000700ffc8", "title": "利用AI能力「降维打击」你的同行", "liked_count": "32"},
        {"url": "https://www.xiaohongshu.com/explore/690344ae000000000700317b", "title": "现在开始提前规划2026，用AI赚点小钱", "liked_count": "2026"},
        {"url": "https://www.xiaohongshu.com/explore/6900c1d3000000000703b75e", "title": "原来学 AI 最猛的是老板，员工反而推不动", "liked_count": "32"},
        {"url": "https://www.xiaohongshu.com/explore/68ff06270000000007036191", "title": "人人都能理解的三个关键词，彻底拿捏AI", "liked_count": "49"},
        {"url": "https://www.xiaohongshu.com/explore/68fca07b000000000700a562", "title": "正因为你在草台班子，所以你才能学会AI", "liked_count": "71"},
        {"url": "https://www.xiaohongshu.com/explore/68fb62a8000000000301d57b", "title": "NBS调研报告：创造性任务用AI之后效率涨58%", "liked_count": "58"},
        {"url": "https://www.xiaohongshu.com/explore/68f9afe4000000000302f0fa", "title": "MIT报告：95%企业AI投资失败，用好AI有诀窍", "liked_count": "95"},
        {"url": "https://www.xiaohongshu.com/explore/68f786db0000000003023706", "title": "硅谷AI大佬炮轰智能体：遗忘比记忆更重要", "liked_count": "256"},
        {"url": "https://www.xiaohongshu.com/explore/68f63a0d00000000030134b9", "title": "敏锐的人已经察觉到这「十八种AI新红利」", "liked_count": "49"},
        {"url": "https://www.xiaohongshu.com/explore/68f4867c0000000003037a7b", "title": "一个人自学智能体，4种信息差和完整路线图", "liked_count": "4"},
        {"url": "https://www.xiaohongshu.com/explore/68f332b70000000005033924", "title": "杨振宁的人生建议：选对方向才是决定性的", "liked_count": "126"},
        {"url": "https://www.xiaohongshu.com/explore/68f2197a00000000050336ef", "title": "Manus VS Langchain：上下文工程实战经验", "liked_count": "207"},
        {"url": "https://www.xiaohongshu.com/explore/68f0fea90000000004007776", "title": "版图解密！顶级VC红杉用百亿赌这9个AI方向", "liked_count": "9"},
        {"url": "https://www.xiaohongshu.com/explore/68ef88650000000005002175", "title": "普通人通过AI实现「降维打击」的真正路径", "liked_count": "533"},
        {"url": "https://www.xiaohongshu.com/explore/68ee5947000000000400269e", "title": "麦肯锡智能体报告，归纳成了六个搭建关键点", "liked_count": "100"},
        {"url": "https://www.xiaohongshu.com/explore/68ecf196000000000402095e", "title": "一个人，怎么一边学AI，一边把钱赚到手", "liked_count": "61"},
        {"url": "https://www.xiaohongshu.com/explore/68eb8bdf000000000700d42d", "title": "会用的人在疯狂使用AI，不会的人一点不用", "liked_count": "53"},
        {"url": "https://www.xiaohongshu.com/explore/68e9a136000000000700cfcb", "title": "90%的创业想法，在投入市场前就已注定失败", "liked_count": "90"},
        {"url": "https://www.xiaohongshu.com/explore/68e886d300000000070085dd", "title": "每天锻炼600次，Telegram创始人4小时访谈", "liked_count": "600"},
        {"url": "https://www.xiaohongshu.com/explore/68e73ba10000000007038fff", "title": "一人公司，用AI来帮你做定位，思路瞬间清晰", "liked_count": "69"},
        {"url": "https://www.xiaohongshu.com/explore/68e694ca000000000700b661", "title": "关于sora2的十个"冷思考"", "liked_count": "2"},
        {"url": "https://www.xiaohongshu.com/explore/68e50f980000000007000c23", "title": "硅谷大佬亲测：99%的人都用错了AI创作", "liked_count": "99"}
    ],
    "note_count": 32,
    "method_used": "playwright_ultimate"
}

# 生成报告
output_path = "C:\\Users\\86155\\Desktop\\小红书账号分析报告_清华鹏哥讲AI智能体.pdf"
generator = XiaohongshuReportGenerator(data, output_path)
pdf_path = generator.generate_report()

print(f"✅ PDF报告已生成: {pdf_path}")
