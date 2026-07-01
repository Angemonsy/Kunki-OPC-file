/**
 * 技能适配器 (Skill Adapters)
 *
 * 功能：统一不同技能的输入输出接口，处理数据转换
 *
 * @author Claude Code
 * @version 1.0.0
 */

/**
 * 技能适配器工厂
 */
const SkillAdapters = {
  /**
   * 热点分析技能适配器
   */
  hotspotAnalysis: {
    /**
     * 标准化输入
     */
    normalizeInput(rawInput) {
      return {
        hotspotEvent: rawInput.hotspotEvent || '',
        duration: rawInput.duration || '6-8分钟',
        targetAudience: rawInput.targetAudience || '创业者/职场人',
        distributionPlatform: rawInput.distributionPlatform || '视频号',
        expectedBehavior: rawInput.expectedBehavior || ['点赞', '收藏', '评论']
      };
    },

    /**
     * 标准化输出
     */
    normalizeOutput(rawOutput) {
      // 解析热点分析报告，提取关键信息
      const report = this.parseReport(rawOutput);

      return {
        phase1: report.phase1 || {}, // 速判报告
        phase2: report.phase2 || {}, // 创作大纲
        phase3: report.phase3 || {}, // 素材库
        extractedData: {
          hotspotName: report.hotspotName || '',
          framework: report.framework || '',
          elements: report.elements || [],
          antiCognition: report.antiCognition || ''
        }
      };
    },

    /**
     * 解析报告
     */
    parseReport(rawOutput) {
      // 实际实现中需要解析 Markdown 格式的报告
      // 这里返回结构化数据
      return {
        phase1: {
          worthDoing: true,
          emotionScore: 4,
          wowPoints: []
        },
        phase2: {
          framework: '未来预言型',
          structure: []
        },
        phase3: {
          materials: {}
        },
        hotspotName: '',
        framework: '',
        elements: [],
        antiCognition: ''
      };
    }
  },

  /**
   * 文案生成技能适配器
   */
  copywriting: {
    normalizeInput(rawInput) {
      return {
        hotspotEvent: rawInput.hotspotEvent || rawInput.hotspotReport?.extractedData?.hotspotName || '',
        duration: rawInput.duration || '6-8分钟',
        targetAudience: rawInput.targetAudience || '创业者/职场人',
        hotspotReport: rawInput.hotspotReport || {},
        framework: rawInput.hotspotReport?.extractedData?.framework || '',
        elements: rawInput.hotspotReport?.extractedData?.elements || []
      };
    },

    normalizeOutput(rawOutput) {
      return {
        title: rawOutput.title || '',
        content: rawOutput.content || rawOutput.copywriting || '',
        estimatedDuration: rawOutput.estimatedDuration || '',
        structure: rawOutput.structure || {}
      };
    }
  },

  /**
   * 事实核查技能适配器
   */
  factCheck: {
    normalizeInput(rawInput) {
      return {
        copywriting: rawInput.copywriting || rawOutput.content || '',
        checkDepth: rawInput.checkDepth || 'standard' // quick, standard, deep
      };
    },

    normalizeOutput(rawOutput) {
      return {
        verifiedCopywriting: rawOutput.verifiedCopywriting || rawOutput.optimizedCopywriting || '',
        factCheckReport: rawOutput.factCheckReport || {
          totalStatements: 0,
          verified: 0,
          issues: []
        },
        credibilityScore: rawOutput.credibilityScore || 0,
        issues: rawOutput.issues || []
      };
    }
  },

  /**
   * 标题生成技能适配器
   */
  titleGeneration: {
    normalizeInput(rawInput) {
      return {
        verifiedCopywriting: rawInput.verifiedCopywriting || '',
        hotspotEvent: rawInput.hotspotEvent || '',
        targetPlatforms: rawInput.targetPlatforms || ['video', 'douyin', 'bilibili', 'xiaohongshu', 'wechat'],
        elementPreference: rawOutput.elementPreference || '对比/对立'
      };
    },

    normalizeOutput(rawOutput) {
      return {
        titles: rawOutput.titles || [],
        platformRecommendations: {
          video: rawOutput.platformRecommendations?.video || '',
          douyin: rawOutput.platformRecommendations?.douyin || '',
          bilibili: rawOutput.platformRecommendations?.bilibili || '',
          xiaohongshu: rawOutput.platformRecommendations?.xiaohongshu || '',
          wechat: rawOutput.platformRecommendations?.wechat || ''
        },
        titleAnalysis: rawOutput.titleAnalysis || {}
      };
    }
  },

  /**
   * 公众号排版技能适配器
   */
  formatting: {
    normalizeInput(rawInput) {
      return {
        verifiedCopywriting: rawOutput.verifiedCopywriting || '',
        title: rawOutput.title || '',
        selectedTitle: rawOutput.selectedTitle || rawOutput.platformRecommendations?.wechat || '',
        style: rawOutput.style || 'default'
      };
    },

    normalizeOutput(rawOutput) {
      return {
        formattedContent: rawOutput.formattedContent || '',
        structure: rawOutput.structure || {
          headings: [],
          paragraphs: 0
        },
        wordCount: rawOutput.wordCount || 0
      };
    }
  },

  /**
   * 通用适配器工厂方法
   */
  getAdapter(skillId) {
    const adapters = {
      'hotspot-analysis': this.hotspotAnalysis,
      'copywriting': this.copywriting,
      'fact-check': this.factCheck,
      'title-generation': this.titleGeneration,
      'formatting': this.formatting
    };

    const adapter = adapters[skillId];
    if (!adapter) {
      throw new Error(`未找到技能适配器: ${skillId}`);
    }

    return adapter;
  }
};

module.exports = SkillAdapters;
