/**
 * 内容创作工作流编排器 (Content Creation Workflow Orchestrator)
 *
 * 功能：自动串联 热点分析 → 文案生成 → 事实核查 → 标题生成 → 公众号排版
 *
 * 工作流模式：顺序执行 (Sequential Workflow Pattern)
 *
 * @author Claude Code
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

/**
 * 工作流编排器类
 */
class ContentCreationOrchestrator {
  constructor(config = {}) {
    this.workflowSchema = config.schema || this.loadSchema();
    this.skillsPath = config.skillsPath || path.join(__dirname, '../../..');
    this.checkpoints = config.checkpoints || new Map();
    this.executionLog = [];
    this.maxRetries = config.maxRetries || 2;
    this.retryDelay = config.retryDelay || 1000; // ms
  }

  /**
   * 加载工作流 schema
   */
  loadSchema() {
    const schemaPath = path.join(__dirname, 'workflow-schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    return schema;
  }

  /**
   * 主执行方法
   * @param {Object} input - 初始输入
   * @returns {Promise<Object>} 最终输出
   */
  async execute(input) {
    const startTime = Date.now();
    const workflowId = this.generateWorkflowId();

    this.log('info', `工作流开始执行: ${this.workflowSchema.workflowName}`, { workflowId, input });

    try {
      // 检查是否有可恢复的检查点
      const recoveredState = this.checkCheckpoint();
      let context = recoveredState || { input, metadata: { workflowId } };

      // 按顺序执行每个技能
      for (const skillId of this.workflowSchema.executionOrder) {
        context = await this.executeSkill(skillId, context);

        // 检查点保存（如果配置了检查点）
        if (this.shouldSaveCheckpoint(skillId)) {
          this.saveCheckpoint(skillId, context);
        }
      }

      const duration = Date.now() - startTime;
      this.log('success', `工作流执行完成`, { workflowId, duration, steps: this.executionLog.length });

      return {
        success: true,
        workflowId,
        duration,
        output: context,
        executionLog: this.executionLog
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.log('error', `工作流执行失败: ${error.message}`, { workflowId, duration, error });

      return {
        success: false,
        workflowId,
        duration,
        error: error.message,
        executionLog: this.executionLog
      };
    }
  }

  /**
   * 执行单个技能（带重试）
   * @param {string} skillId - 技能ID
   * @param {Object} context - 上下文
   * @returns {Promise<Object>} 更新后的上下文
   */
  async executeSkill(skillId, context) {
    const skillConfig = this.workflowSchema.skills.find(s => s.id === skillId);
    if (!skillConfig) {
      throw new Error(`找不到技能配置: ${skillId}`);
    }

    this.log('info', `开始执行技能: ${skillConfig.name}`, { skillId });

    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const startTime = Date.now();
        const output = await this.invokeSkill(skillConfig, context);
        const duration = Date.now() - startTime;

        this.log('success', `技能执行完成: ${skillConfig.name}`, { skillId, attempt, duration });

        return {
          ...context,
          [skillId]: output
        };
      } catch (error) {
        lastError = error;
        this.log('warning', `技能执行失败 (尝试 ${attempt}/${this.maxRetries}): ${skillConfig.name}`, { skillId, error: error.message });

        if (attempt < this.maxRetries) {
          await this.sleep(this.retryDelay * attempt);
        }
      }
    }

    throw new Error(`技能 ${skillConfig.name} 执行失败: ${lastError.message}`);
  }

  /**
   * 调用技能（模拟调用 Claude Skill Tool）
   * @param {Object} skillConfig - 技能配置
   * @param {Object} context - 上下文
   * @returns {Promise<Object>} 技能输出
   */
  async invokeSkill(skillConfig, context) {
    // 实际实现中，这里会调用 Claude Skill Tool
    // 返回模拟数据用于演示
    return {
      skillId: skillConfig.id,
      skillName: skillConfig.name,
      timestamp: new Date().toISOString(),
      output: `[${skillConfig.name} 的输出结果]`
    };
  }

  /**
   * 检查是否需要保存检查点
   */
  shouldSaveCheckpoint(skillId) {
    return this.workflowSchema.checkpointPolicy.steps.includes(skillId);
  }

  /**
   * 保存检查点
   */
  saveCheckpoint(skillId, context) {
    const checkpointPath = path.join(__dirname, '.checkpoints', `${skillId}.json`);
    fs.mkdirSync(path.dirname(checkpointPath), { recursive: true });
    fs.writeFileSync(checkpointPath, JSON.stringify(context, null, 2));
    this.log('info', `检查点已保存: ${skillId}`, { skillId, checkpointPath });
  }

  /**
   * 检查并恢复检查点
   */
  checkCheckpoint() {
    const checkpointsDir = path.join(__dirname, '.checkpoints');
    if (!fs.existsSync(checkpointsDir)) {
      return null;
    }

    const files = fs.readdirSync(checkpointsDir);
    if (files.length === 0) {
      return null;
    }

    // 恢复最后一个检查点
    const lastCheckpoint = files[files.length - 1];
    const checkpointPath = path.join(checkpointsDir, lastCheckpoint);
    const state = JSON.parse(fs.readFileSync(checkpointPath, 'utf8'));

    this.log('info', `从检查点恢复: ${lastCheckpoint}`);
    return state;
  }

  /**
   * 生成工作流ID
   */
  generateWorkflowId() {
    return `wf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 日志记录
   */
  log(level, message, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    this.executionLog.push(entry);
    console.log(`[${level.toUpperCase()}] ${message}`, data);
  }

  /**
   * 延迟工具
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取工作流状态
   */
  getStatus() {
    return {
      workflowName: this.workflowSchema.workflowName,
      version: this.workflowSchema.version,
      executionMode: this.workflowSchema.executionMode,
      skills: this.workflowSchema.skills.map(s => ({
        id: s.id,
        name: s.name,
        timeout: s.timeoutSeconds
      })),
      checkpointPolicy: this.workflowSchema.checkpointPolicy
    };
  }
}

/**
 * 导出工厂函数
 */
module.exports = function createOrchestrator(config) {
  return new ContentCreationOrchestrator(config);
};

module.exports.ContentCreationOrchestrator = ContentCreationOrchestrator;
