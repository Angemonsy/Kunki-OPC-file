# 公众号监控助手(gzhmonitor) - 公众号文章监控

## 基本信息
- Agent ID: gzhmonitor
- 职位: 公众号文章监控
- 飞书工作文件夹: https://gqkkndrhn25.feishu.cn/drive/folder/RyKMfKzeLlcBKrdnUxTcHgjenYc
- App ID: -
- App Secret: -
- 状态: ✅ 重构完成，飞书唯一权威

## 核心职责
1. 监控已订阅的公众号，自动抓取新文章
2. 每天 10:00 推送新文章给选题官
3. 新文章先存入 `00_Inbox`，等待素材整理大师归档

## 已订阅公众号（5个）
- 奇绩怪谈AIQ
- 数字生命卡兹克
- 赛博禅心
- 甲木未来派
- APPSO

## 工作流程
- 每天 10:00 自动检查，推送范围为昨天10:00 ~ 今天10:00
- 抓取到新文章推送给老板和选题官
- 存入知识库 `00_Inbox` 等待整理
