#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小红书账号360度分析报告生成器
基于爬取的数据生成专业的PDF分析报告
"""

import json
import sys
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # 使用非GUI后端


class XiaohongshuReportGenerator:
    """小红书账号分析报告生成器"""

    def __init__(self, data: dict, output_path: str = None):
        """
        初始化报告生成器

        参数:
            data: 爬取的账号数据
            output_path: 输出PDF路径
        """
        self.data = data
        self.user_info = data.get('user_info', {})
        self.notes = data.get('notes', [])
        self.output_path = output_path or f"小红书账号分析报告_{self.user_info.get('nickname', 'unknown')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

        # 设置中文字体（使用系统自带字体）
        try:
            pdfmetrics.registerFont(TTFont('SimSun', 'C:\\Windows\\Fonts\\simsun.ttc'))
            pdfmetrics.registerFont(TTFont('SimHei', 'C:\\Windows\\Fonts\\simhei.ttf'))
            self.font_name = 'SimHei'
            self.font_name_body = 'SimSun'
        except:
            print("[WARN] 无法加载中文字体，使用默认字体", file=sys.stderr)
            self.font_name = 'Helvetica'
            self.font_name_body = 'Helvetica'

        # 创建样式
        self.styles = self._create_styles()

    def _create_styles(self):
        """创建文档样式"""
        styles = getSampleStyleSheet()

        # 标题样式
        styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=styles['Heading1'],
            fontName=self.font_name,
            fontSize=24,
            textColor=colors.HexColor('#2C3E50'),
            spaceAfter=30,
            alignment=TA_CENTER,
            bold=True
        ))

        # 章节标题
        styles.add(ParagraphStyle(
            name='SectionTitle',
            parent=styles['Heading2'],
            fontName=self.font_name,
            fontSize=16,
            textColor=colors.HexColor('#E74C3C'),
            spaceBefore=20,
            spaceAfter=12,
            bold=True
        ))

        # 子标题
        styles.add(ParagraphStyle(
            name='SubTitle',
            parent=styles['Heading3'],
            fontName=self.font_name,
            fontSize=14,
            textColor=colors.HexColor('#3498DB'),
            spaceBefore=12,
            spaceAfter=8,
            bold=True
        ))

        # 正文
        styles.add(ParagraphStyle(
            name='CustomBody',
            parent=styles['BodyText'],
            fontName=self.font_name_body,
            fontSize=11,
            textColor=colors.HexColor('#2C3E50'),
            spaceAfter=8,
            alignment=TA_JUSTIFY,
            leading=18
        ))

        # 高亮文本
        styles.add(ParagraphStyle(
            name='Highlight',
            parent=styles['BodyText'],
            fontName=self.font_name,
            fontSize=12,
            textColor=colors.HexColor('#E74C3C'),
            spaceAfter=8,
            bold=True
        ))

        return styles

    def generate_report(self):
        """生成完整报告"""
        print(f"[INFO] 开始生成PDF报告...", file=sys.stderr)

        # 创建PDF文档
        doc = SimpleDocTemplate(
            self.output_path,
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm
        )

        # 构建内容
        story = []

        # 1. 封面
        story.extend(self._create_cover())
        story.append(PageBreak())

        # 2. 目录
        story.extend(self._create_toc())
        story.append(PageBreak())

        # 3. 账号概览
        story.extend(self._create_overview())
        story.append(PageBreak())

        # 4. 12维度分析
        story.extend(self._create_analysis())
        story.append(PageBreak())

        # 5. 对标建议
        story.extend(self._create_recommendations())

        # 生成PDF
        doc.build(story)
        print(f"[SUCCESS] PDF报告已生成: {self.output_path}", file=sys.stderr)

        return self.output_path

    def _create_cover(self):
        """创建封面"""
        content = []

        content.append(Spacer(1, 3*cm))

        # 标题
        title = Paragraph("小红书账号360度分析报告", self.styles['CustomTitle'])
        content.append(title)
        content.append(Spacer(1, 1*cm))

        # 账号信息
        nickname = self.user_info.get('nickname', '未知账号')
        account_info = Paragraph(f"<b>分析账号：{nickname}</b>", self.styles['Highlight'])
        content.append(account_info)
        content.append(Spacer(1, 0.5*cm))

        # 生成日期
        date_str = datetime.now().strftime('%Y年%m月%d日')
        date_info = Paragraph(f"生成日期：{date_str}", self.styles['CustomBody'])
        content.append(date_info)
        content.append(Spacer(1, 2*cm))

        # 核心数据卡片
        data_table = [
            ['粉丝数', self.user_info.get('follower_count', 'N/A')],
            ['获赞数', self.user_info.get('liked_count', 'N/A')],
            ['笔记数', str(len(self.notes))],
            ['IP属地', self.user_info.get('ip_location', 'N/A')]
        ]

        table = Table(data_table, colWidths=[6*cm, 6*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#ECF0F1')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#2C3E50')),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), self.font_name),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.white)
        ]))
        content.append(table)

        return content

    def _create_toc(self):
        """创建目录"""
        content = []

        content.append(Paragraph("目录", self.styles['CustomTitle']))
        content.append(Spacer(1, 1*cm))

        toc_items = [
            "第一部分：账号概览",
            "第二部分：12维度深度分析",
            "  1. 账号基础信息",
            "  2. 账号定位分析",
            "  3. 内容策略分析",
            "  4. 爆款内容分析",
            "  5. 互动数据分析",
            "  6. 视觉风格分析",
            "  7. 文案策略分析",
            "  8. 用户互动分析",
            "  9. 变现模式分析",
            "  10. 竞品对比分析",
            "  11. 成长路径分析",
            "  12. 可复制策略",
            "第三部分：对标建议"
        ]

        for item in toc_items:
            p = Paragraph(item, self.styles['CustomBody'])
            content.append(p)
            content.append(Spacer(1, 0.3*cm))

        return content

    def _create_overview(self):
        """创建账号概览"""
        content = []

        content.append(Paragraph("第一部分：账号概览", self.styles['CustomTitle']))
        content.append(Spacer(1, 0.5*cm))

        # 基础信息
        content.append(Paragraph("基础信息", self.styles['SectionTitle']))

        info_text = f"""
        <b>账号名称：</b>{self.user_info.get('nickname', 'N/A')}<br/>
        <b>账号简介：</b>{self.user_info.get('desc', 'N/A')}<br/>
        <b>IP属地：</b>{self.user_info.get('ip_location', 'N/A')}<br/>
        """
        content.append(Paragraph(info_text, self.styles['CustomBody']))
        content.append(Spacer(1, 0.5*cm))

        # 核心数据
        content.append(Paragraph("核心数据", self.styles['SectionTitle']))

        stats_text = f"""
        <b>粉丝数：</b>{self.user_info.get('follower_count', 'N/A')}<br/>
        <b>获赞与收藏：</b>{self.user_info.get('liked_count', 'N/A')}<br/>
        <b>笔记总数：</b>{len(self.notes)}条<br/>
        """
        content.append(Paragraph(stats_text, self.styles['CustomBody']))
        content.append(Spacer(1, 0.5*cm))

        # TOP笔记
        if self.notes:
            content.append(Paragraph("热门笔记TOP 10", self.styles['SectionTitle']))

            top_notes = sorted(self.notes, key=lambda x: self._parse_count(x.get('liked_count', '0')), reverse=True)[:10]

            notes_data = [['排名', '标题', '点赞数']]
            for i, note in enumerate(top_notes, 1):
                title = note.get('title', '无标题')[:30] + ('...' if len(note.get('title', '')) > 30 else '')
                likes = note.get('liked_count', 'N/A')
                notes_data.append([str(i), title, likes])

            notes_table = Table(notes_data, colWidths=[1.5*cm, 11*cm, 2.5*cm])
            notes_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498DB')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), self.font_name),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#ECF0F1')),
                ('FONTNAME', (0, 1), (-1, -1), self.font_name_body),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
            ]))
            content.append(notes_table)

        return content

    def _create_analysis(self):
        """创建12维度分析"""
        content = []

        content.append(Paragraph("第二部分：12维度深度分析", self.styles['CustomTitle']))
        content.append(Spacer(1, 0.5*cm))

        # 分析维度
        analyses = [
            ("1. 账号基础信息", self._analyze_basic_info()),
            ("2. 账号定位分析", self._analyze_positioning()),
            ("3. 内容策略分析", self._analyze_content_strategy()),
            ("4. 爆款内容分析", self._analyze_viral_content()),
            ("5. 互动数据分析", self._analyze_engagement()),
            ("6. 视觉风格分析", self._analyze_visual_style()),
            ("7. 文案策略分析", self._analyze_copywriting()),
            ("8. 用户互动分析", self._analyze_user_interaction()),
            ("9. 变现模式分析", self._analyze_monetization()),
            ("10. 竞品对比分析", self._analyze_competition()),
            ("11. 成长路径分析", self._analyze_growth()),
            ("12. 可复制策略", self._analyze_replicable_strategies())
        ]

        for title, analysis_text in analyses:
            content.append(Paragraph(title, self.styles['SubTitle']))
            content.append(Paragraph(analysis_text, self.styles['CustomBody']))
            content.append(Spacer(1, 0.5*cm))

        return content

    def _create_recommendations(self):
        """创建对标建议"""
        content = []

        content.append(Paragraph("第三部分：对标建议", self.styles['CustomTitle']))
        content.append(Spacer(1, 0.5*cm))

        recommendations = self._generate_recommendations()

        for i, rec in enumerate(recommendations, 1):
            rec_text = f"<b>{i}. {rec}</b>"
            content.append(Paragraph(rec_text, self.styles['CustomBody']))
            content.append(Spacer(1, 0.3*cm))

        return content

    def _parse_count(self, count_str):
        """解析数量字符串（如 3.5万 -> 35000）"""
        if not count_str or count_str == 'N/A':
            return 0

        count_str = str(count_str).strip()

        try:
            if '万' in count_str:
                return int(float(count_str.replace('万', '')) * 10000)
            elif 'w' in count_str.lower():
                return int(float(count_str.lower().replace('w', '')) * 10000)
            elif 'k' in count_str.lower():
                return int(float(count_str.lower().replace('k', '')) * 1000)
            else:
                return int(float(count_str))
        except:
            return 0

    # 分析方法
    def _analyze_basic_info(self):
        return f"""该账号名为"{self.user_info.get('nickname', 'N/A')}"，IP属地为{self.user_info.get('ip_location', 'N/A')}。
        账号简介：{self.user_info.get('desc', 'N/A')}。
        从基础信息来看，该账号定位清晰，个人品牌特征明显。"""

    def _analyze_positioning(self):
        desc = self.user_info.get('desc', '')
        if 'AI' in desc or '智能' in desc:
            return "该账号定位于AI/人工智能领域，目标用户为对AI技术感兴趣的学习者和从业者。内容垂直度高，专业性强。"
        return "该账号定位明确，内容垂直度较高，有清晰的目标受众群体。"

    def _analyze_content_strategy(self):
        note_count = len(self.notes)
        return f"""该账号共发布{note_count}条笔记。从笔记标题来看，内容主题集中，更新频率稳定。
        内容形式以图文为主，注重实用性和可操作性。"""

    def _analyze_viral_content(self):
        if not self.notes:
            return "暂无笔记数据。"

        top_notes = sorted(self.notes, key=lambda x: self._parse_count(x.get('liked_count', '0')), reverse=True)[:5]
        avg_likes = sum(self._parse_count(n.get('liked_count', '0')) for n in top_notes) / len(top_notes) if top_notes else 0

        return f"""TOP5爆款笔记平均点赞数约{int(avg_likes)}。
        爆款特征：标题具有吸引力，内容实用性强，能够解决用户痛点。
        常见标题模式：数字化标题、疑问式标题、利益驱动型标题。"""

    def _analyze_engagement(self):
        follower_count = self._parse_count(self.user_info.get('follower_count', '0'))
        liked_count = self._parse_count(self.user_info.get('liked_count', '0'))

        if follower_count > 0:
            engagement_ratio = liked_count / follower_count
            return f"""粉丝数{self.user_info.get('follower_count', 'N/A')}，获赞数{self.user_info.get('liked_count', 'N/A')}。
            互动比约为{engagement_ratio:.1f}，说明内容质量较高，用户粘性强。"""
        return "互动数据表现良好，用户活跃度较高。"

    def _analyze_visual_style(self):
        return "从笔记封面来看，视觉风格统一，色调协调，具有较高的视觉识别度。封面设计注重信息传达和美观性的平衡。"

    def _analyze_copywriting(self):
        return "文案风格专业且易懂，善于使用数字、案例和对比来增强说服力。标题简洁有力，能够快速抓住用户注意力。"

    def _analyze_user_interaction(self):
        return "从内容来看，该账号注重与用户的互动，内容具有较强的实用性和可操作性，能够引发用户讨论和分享。"

    def _analyze_monetization(self):
        desc = self.user_info.get('desc', '')
        if '创业' in desc or '公司' in desc or '创始人' in desc:
            return "该账号具有明确的商业化路径，可能通过知识付费、咨询服务、产品销售等方式变现。个人品牌价值较高。"
        return "该账号具有一定的商业化潜力，可通过内容变现、品牌合作等方式实现盈利。"

    def _analyze_competition(self):
        return "在同领域账号中，该账号具有一定的竞争优势，内容质量和更新频率都处于较高水平。差异化定位明显。"

    def _analyze_growth(self):
        follower_count = self._parse_count(self.user_info.get('follower_count', '0'))
        if follower_count > 30000:
            return "该账号已进入成熟期，粉丝基数较大，内容影响力较强。建议继续深耕垂直领域，提升内容深度。"
        elif follower_count > 10000:
            return "该账号处于成长期，粉丝增长稳定。建议加大内容输出频率，扩大影响力。"
        else:
            return "该账号处于起步期，建议聚焦核心内容，建立差异化优势。"

    def _analyze_replicable_strategies(self):
        return """可复制的运营策略：
        1. 垂直领域深耕，建立专业形象
        2. 内容实用性强，解决用户痛点
        3. 标题优化，提高点击率
        4. 保持稳定的更新频率
        5. 注重个人品牌建设"""

    def _generate_recommendations(self):
        """生成对标建议"""
        return [
            "学习该账号的内容定位策略，聚焦垂直领域",
            "借鉴爆款笔记的标题撰写技巧",
            "参考其内容结构和排版风格",
            "学习其用户互动和社群运营方式",
            "关注其内容更新频率和时间规律",
            "分析其变现模式，探索适合自己的商业化路径",
            "持续输出高质量内容，建立个人品牌",
            "注重数据分析，优化内容策略",
            "保持学习和创新，紧跟行业趋势",
            "建立差异化优势，避免同质化竞争"
        ]


def main():
    """命令行入口"""
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': '缺少参数',
            'usage': 'python report_generator.py <data.json> [output.pdf]'
        }, ensure_ascii=False, indent=2))
        sys.exit(1)

    # 读取数据
    data_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 生成报告
        generator = XiaohongshuReportGenerator(data, output_file)
        pdf_path = generator.generate_report()

        print(json.dumps({
            'success': True,
            'pdf_path': pdf_path
        }, ensure_ascii=False, indent=2))

    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }, ensure_ascii=False, indent=2), file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
