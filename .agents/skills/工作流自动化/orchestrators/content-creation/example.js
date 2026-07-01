/**
 * 内容创作工作流使用示例
 *
 * @author Claude Code
 * @version 1.0.0
 */

const { ContentCreationOrchestrator } = require('./orchestrator.js');

/**
 * 示例 1: 基本使用
 */
async function example1() {
  console.log('=== 示例 1: 基本使用 ===\n');

  const orchestrator = new ContentCreationOrchestrator();

  const result = await orchestrator.execute({
    hotspotEvent: 'AI大模型价格战：从免费到白菜价',
    duration: '6-8分钟',
    targetAudience: '创业者/职场人'
  });

  if (result.success) {
    console.log('✅ 工作流执行成功！');
    console.log(`📊 执行时长: ${result.duration}ms`);
    console.log(`🔍 工作流ID: ${result.workflowId}`);
    console.log(`📝 步骤数: ${result.executionLog.length}`);

    // 输出最终结果
    console.log('\n--- 最终输出 ---');
    console.log('标题:', result.output['title-generation'].titles[0]);
    console.log('公众号内容长度:', result.output.formatting.wordCount, '字');
    console.log('可信度评分:', result.output['fact-check'].credibilityScore);
  } else {
    console.error('❌ 工作流执行失败:', result.error);
  }
}

/**
 * 示例 2: 自定义配置
 */
async function example2() {
  console.log('\n=== 示例 2: 自定义配置 ===\n');

  const orchestrator = new ContentCreationOrchestrator({
    maxRetries: 3,
    retryDelay: 2000
  });

  const result = await orchestrator.execute({
    hotspotEvent: 'OpenAI 发布 GPT-4.5：推理能力提升 10 倍',
    duration: '3-4分钟',
    targetAudience: '程序员/技术爱好者',
    distributionPlatform: 'B站',
    expectedBehavior: ['点赞', '转发', '关注']
  });

  // 打印执行日志
  console.log('\n--- 执行日志 ---');
  result.executionLog.forEach((entry, index) => {
    const icon = entry.level === 'success' ? '✅' :
                entry.level === 'error' ? '❌' :
                entry.level === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${icon} [${entry.timestamp}] ${entry.message}`);
  });
}

/**
 * 示例 3: 获取工作流状态
 */
function example3() {
  console.log('\n=== 示例 3: 工作流状态 ===\n');

  const orchestrator = new ContentCreationOrchestrator();
  const status = orchestrator.getStatus();

  console.log('工作流名称:', status.workflowName);
  console.log('版本:', status.version);
  console.log('执行模式:', status.executionMode);
  console.log('\n技能列表:');
  status.skills.forEach(skill => {
    console.log(`  - ${skill.name} (超时: ${skill.timeout}秒)`);
  });
  console.log('\n检查点策略:');
  console.log(`  - 启用: ${status.checkpointPolicy.enabled}`);
  console.log(`  - 检查点步骤: ${status.checkpointPolicy.steps.join(', ')}`);
}

/**
 * 示例 4: 模拟真实场景（带错误处理）
 */
async function example4() {
  console.log('\n=== 示例 4: 真实场景模拟 ===\n');

  const orchestrator = new ContentCreationOrchestrator();

  try {
    const result = await orchestrator.execute({
      hotspotEvent: '苹果发布 Vision Pro 2：价格减半',
      duration: '5-6分钟',
      targetAudience: '数码爱好者'
    });

    if (result.success) {
      // 检查每个步骤的输出
      const outputs = [
        { id: 'hotspot-analysis', name: '热点分析' },
        { id: 'copywriting', name: '文案生成' },
        { id: 'fact-check', name: '事实核查' },
        { id: 'title-generation', name: '标题生成' },
        { id: 'formatting', name: '公众号排版' }
      ];

      console.log('\n--- 各步骤输出摘要 ---');
      for (const step of outputs) {
        const output = result.output[step.id];
        if (output) {
          console.log(`\n${step.name}:`);
          console.log(`  ✅ 完成`);
        } else {
          console.log(`\n${step.name}:`);
          console.log(`  ❌ 缺失输出`);
        }
      }

      // 输出平台推荐标题
      console.log('\n--- 平台推荐标题 ---');
      const titles = result.output['title-generation'].platformRecommendations;
      console.log(`📱 视频号: ${titles.video}`);
      console.log(`🎵 抖音: ${titles.douyin}`);
      console.log(`📺 B站: ${titles.bilibili}`);
      console.log(`📕 小红书: ${titles.xiaohongshu}`);
      console.log(`💬 公众号: ${titles.wechat}`);
    }
  } catch (error) {
    console.error('执行过程中发生错误:', error);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 内容创作工作流编排器 - 示例演示\n');
  console.log('=' .repeat(50));

  // 运行示例
  await example1();
  // await example2();
  // example3();
  // await example4();

  console.log('\n' + '=' .repeat(50));
  console.log('👋 演示完成！');
}

// 如果直接运行此文件，执行 main()
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  example1,
  example2,
  example3,
  example4
};
