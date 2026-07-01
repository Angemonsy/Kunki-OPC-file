---
name: social-content-fetcher
description: >
  抖音/小红书短视频一键爬取 + 数据提取 + 逐字稿转写。
  组合 Agent Reach 获取互动数据 + Social Transcriber 生成逐字稿，一站式输出完整内容。
triggers:
  - 爬取抖音/小红书视频
  - 获取点赞收藏 抖音 小红书
  - 抖音视频转逐字稿
  - 小红书视频转文字
  - social fetch
  - 提取视频内容 抖音 小红书
metadata:
  openclaw:
    homepage: https://github.com/MrCarlsama/mrcarlsama-social-transcriber-skill
    depends: [agent-reach, mrcarlsama-social-transcriber]
---

# Social Content Fetcher — 抖音/小红书内容一键抓取

> 组合工作流：**Agent Reach 获取互动数据** + **Social Transcriber 下载转写**，一站式输出完整内容。

## 工作原理

```
用户输入链接
  ↓
步骤1：Agent Reach / Jina Reader → 获取页面元数据
  - 提取标题、作者、发布时间
  - 获取点赞、收藏、评论、转发数据
  ↓
步骤2：Social Transcriber → 自动下载+转写
  - 下载视频到本地
  - 提取音频
  - faster-whisper 本地转写逐字稿
  - 提取平台正文和标签
  ↓
步骤3：AI聚合输出 → 结构化表格+正文+逐字稿
  - 整理数据表格
  - 输出可直接用的纯文本逐字稿
  - 可选择清理大文件节省空间
```

## 使用方法

在 Claude Code 中直接调用：

```
/social-content-fetcher <抖音或小红书链接>
```

示例：
```
/social-content-fetcher http://xhslink.com/o/9Be3xuaU13G
/social-content-fetcher https://v.douyin.com/iFjYwUy/
```

## 输出内容

| 内容 | 说明 |
|------|------|
| 互动数据 | 标题、作者、发布时间、点赞、收藏、评论、转发 |
| 平台正文 | 视频描述/笔记正文 + 话题标签 |
| 逐字稿 | ASR转写后的完整文字内容 |
| 统计信息 | 视频时长、字数、识别模型 |

## 依赖

需要先安装：
- `agent-reach` (已安装：`~/.claude/skills/agent-reach`)
- `mrcarlsama-social-transcriber` (已安装：`~/.claude/skills/mrcarlsama-social-transcriber`)

## 空间清理

默认处理完会保留正文和逐字稿，自动删除原视频和音频文件节省空间。如需保留原文件，添加 `--keep-media` 参数：

```
/social-content-fetcher --keep-media <链接>
```

## 支持链接格式

### 小红书
- `xiaohongshu.com/discovery/item/...`
- `xhslink.com/...` (短链接)

### 抖音
- `douyin.com/video/...`
- `v.douyin.com/...` (短链接)

## 作者

基于 Agent Reach 和 Social Transcriber 二次封装的组合工作流。
