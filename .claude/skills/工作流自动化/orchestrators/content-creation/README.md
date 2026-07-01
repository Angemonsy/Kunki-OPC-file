# 内容创作工作流编排器

## 概述

这是一个自动化的内容创作工作流，将 5 个独立技能串联起来，实现从热点分析到公众号发布的全流程自动化。

## 工作流程

```
用户输入热点事件
       ↓
┌──────────────────────────────────────┐
│  步骤1: 热点分析                  │
│  - 速判报告 (1000-1200字)          │
│  - 创作大纲 (1500-2000字)          │
│  - 素材库 (12000-15000字)          │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  步骤2: 文案生成                  │
│  - 基于素材报告生成视频文案         │
│  - 预计时长 6-8 分钟              │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  步骤3: 事实核查                  │
│  - 验证数据真实性                  │
│  - 检查信息准确性                  │
│  - 标注错误并提供修正              │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  步骤4: 标题生成                  │
│  - 生成 20 个爆款标题              │
│  - 适配不同平台调性                │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  步骤5: 公众号排版                │
│  - 提炼二级标题 (融入爆款元素)     │
│  - 优化段落结构                   │
│  - 保持原文内容不变                │
└──────────────────────────────────────┘
       ↓
    最终输出
```

## 快速开始

### 在 Claude Code 中使用

直接向 Claude Code 描述你的需求：

```
帮我创作一篇关于"AI大模型价格战"的内容，自动完成从热点分析到公众号排版的全部流程。
```

Claude Code 会自动识别并执行完整工作流。

### 手动调用编排器

```javascript
const { ContentCreationOrchestrator } = require('./orchestrator.js');

// 创建编排器实例
const orchestrator = new ContentCreationOrchestrator({
  maxRetries: 2,
  retryDelay: 1000
});

// 执行工作流
const result = await orchestrator.execute({
  hotspotEvent: 'AI大模型价格战：从免费到白菜价',
  duration: '6-8分钟',
  targetAudience: '创业者/职场人',
  distributionPlatform: '视频号',
  expectedBehavior: ['点赞', '收藏', '评论']
});

if (result.success) {
  console.log('工作流执行成功！');
  console.log('输出结果:', result.output);
} else {
  console.error('工作流执行失败:', result.error);
}
```

## 配置选项

### 工作流配置

```javascript
const orchestrator = new ContentCreationOrchestrator({
  // 工作流 schema 路径（可选，默认使用内置）
  schema: customSchema,

  // 技能根目录（可选）
  skillsPath: '/path/to/skills',

  // 最大重试次数（默认：2）
  maxRetries: 3,

  // 重试延迟（毫秒，默认：1000）
  retryDelay: 2000,

  // 自定义检查点存储（可选）
  checkpoints: customCheckpointStore
});
```

### 修改 workflow-schema.json

编辑 `workflow-schema.json` 来自定义工作流：

```json
{
  "workflowName": "content-creation-pipeline",
  "executionOrder": ["hotspot-analysis", "copywriting", "fact-check", "title-generation", "formatting"],
  "checkpointPolicy": {
    "enabled": true,
    "steps": ["hotspot-analysis", "copywriting"]
  }
}
```

## 输入输出说明

### 输入

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| hotspotEvent | string | 是 | 热点事件描述 |
| duration | string | 否 | 期待视频时长，默认"6-8分钟" |
| targetAudience | string | 否 | 目标用户，默认"创业者/职场人" |
| distributionPlatform | string | 否 | 分发平台，默认"视频号" |
| expectedBehavior | array | 否 | 期望用户行为 |

### 输出

```json
{
  "success": true,
  "workflowId": "wf-1234567890-abc123",
  "duration": 45000,
  "output": {
    "hotspot-analysis": {
      "phase1": { /* 速判报告 */ },
      "phase2": { /* 创作大纲 */ },
      "phase3": { /* 素材库 */ }
    },
    "copywriting": {
      "title": "视频标题",
      "content": "视频文案内容",
      "estimatedDuration": "6-8分钟"
    },
    "fact-check": {
      "verifiedCopywriting": "核查后的文案",
      "factCheckReport": { /* 核查报告 */ },
      "credibilityScore": 95
    },
    "title-generation": {
      "titles": ["标题1", "标题2", ...],
      "platformRecommendations": {
        "video": "推荐标题",
        "douyin": "推荐标题",
        "bilibili": "推荐标题",
        "xiaohongshu": "推荐标题",
        "wechat": "推荐标题"
      }
    },
    "formatting": {
      "formattedContent": "排版后的完整内容",
      "structure": { /* 结构信息 */ },
      "wordCount": 2500
    }
  },
  "executionLog": [
    /* 执行日志 */
  ]
}
```

## 检查点机制

工作流在关键步骤保存检查点，支持失败后恢复：

- **热点分析完成后**：保存完整的素材研究报告
- **文案生成完成后**：保存已生成的文案

从检查点恢复：

```javascript
// 检查点会自动检测和恢复
// 如需手动清除检查点：
rm -rf ./orchestrators/content-creation/.checkpoints
```

## 错误处理

### 自动重试

每个技能失败后会自动重试（默认 2 次），采用指数退避策略。

### 错误日志

所有错误都会记录在 `executionLog` 中：

```javascript
result.executionLog.forEach(entry => {
  if (entry.level === 'error') {
    console.error(entry.message, entry.data);
  }
});
```

## 工作流架构设计

### 设计模式

- **顺序工作流模式 (Sequential Workflow Pattern)**：步骤按顺序执行，每个输出成为下一个输入
- **检查点模式 (Checkpoint Pattern)**：在关键步骤保存状态，支持断点续传
- **适配器模式 (Adapter Pattern)**：统一不同技能的输入输出接口

### 可持久化执行

工作流具备可持久化执行特性：

1. ✅ **幂等性**：每次执行产生相同结果
2. ✅ **检查点**：关键步骤后保存状态
3. ✅ **超时控制**：每个技能有独立的超时设置
4. ✅ **错误处理**：自动重试 + 详细日志
5. ✅ **可观测性**：完整的执行日志

## 扩展工作流

### 添加新技能

1. 在 `workflow-schema.json` 中添加技能配置
2. 在 `skill-adapters.js` 中添加适配器
3. 在 `executionOrder` 中加入新步骤

### 修改执行顺序

编辑 `executionOrder` 数组：

```json
{
  "executionOrder": ["hotspot-analysis", "copywriting", "title-generation", "fact-check", "formatting"]
}
```

## 最佳实践

### ⚠️ 反模式警告

❌ **不要**跳过事实核查
- 风险：传播错误信息
- 建议：始终执行事实核查

❌ **不要**删除检查点
- 风险：长时间工作流失败后无法恢复
- 建议：保持检查点启用

❌ **不要**超时设置过短
- 风险：复杂任务被中断
- 建议：热点分析 ≥ 300秒，文案生成 ≥ 240秒

### ✅ 推荐做法

✅ **使用检查点**：在长时间运行的工作流中
✅ **设置合理的超时**：根据任务复杂度调整
✅ **监控执行日志**：及时发现异常
✅ **验证输出质量**：每个步骤后检查结果

## 故障排查

### 问题：工作流卡在某个步骤

**解决方案**：
1. 检查执行日志中是否有超时警告
2. 增加该技能的 `timeoutSeconds`
3. 确认技能是否正常响应

### 问题：从检查点恢复后继续执行所有步骤

**解决方案**：
这是正常行为，编排器会从最后一个检查点继续执行剩余步骤。

### 问题：输出格式不符合预期

**解决方案**：
1. 检查适配器 (`skill-adapters.js`) 是否正确
2. 确认技能输出格式是否发生变化
3. 调整适配器的解析逻辑

## 技术支持

遇到问题？检查：

1. **执行日志**：`result.executionLog`
2. **工作流状态**：`orchestrator.getStatus()`
3. **检查点目录**：`./.checkpoints/`

## 许可证

MIT License
