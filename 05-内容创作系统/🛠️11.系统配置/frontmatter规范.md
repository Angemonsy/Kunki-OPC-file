---
description: 内容创作系统统一的frontmatter字段规范，所有文案skill输出必须遵循
version: 1.0
updated: 2026-02-27
---

# Frontmatter 统一规范

## 设计原则

1. **字段名全英文**：避免中英文混用导致 Dataview 查询困难
2. **必填/选填分明**：核心字段必须有，扩展字段按需添加
3. **枚举值固定**：status、type 等字段用固定枚举，方便筛选
4. **向后兼容**：新规范不要求回溯修改旧文案，但新产出必须遵循

---

## 必填字段（6个）

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `title` | string | 文章标题（最终发布标题） | `"用AI写了100篇文案后，我总结出5条精修规律"` |
| `type` | string | 文案类型，见下方枚举 | `教知识·方法论拆解` |
| `status` | string | 当前状态，见下方枚举 | `待发布` |
| `created` | date | 创建日期，格式 YYYY-MM-DD | `2026-02-27` |
| `tags` | list | 标签数组，统一用 YAML 列表格式 | 见下方示例 |
| `source_type` | string | 素材来源类型，见下方枚举 | `实战复盘` |

---

## 选填字段（按需添加）

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `framework` | string | 使用的文案框架，用 wikilink 引用 | `"[[薛辉-聊观点文案框架3.0]]"` |
| `opening_type` | string | 开篇模板来源 | `"[[聊观点类开篇库]]（痛点直击型）"` |
| `viral_score` | number | 爆款预测评分（0-100） | `92` |
| `source_url` | string/list | 素材原始链接 | `https://x.com/...` |
| `word_count` | number | 实际字数 | `2400` |
| `platforms` | list | 已发布/待发布平台 | `[公众号, 小红书, 视频号]` |
| `published_date` | date | 实际发布日期 | `2026-02-28` |
| `updated` | date | 最后修改日期 | `2026-02-27` |

---

## 枚举值定义

### status 状态流转

```
草稿 → 精修中 → 待发布 → 已发布 → 已归档
```

| 值 | 含义 |
|---|------|
| `草稿` | 初稿完成，未经自检 |
| `精修中` | 自检/精修中，可能有多个版本 |
| `待发布` | 自检通过，排版完成，等待发布 |
| `已发布` | 至少在一个平台已发布 |
| `已归档` | 已过时或不再推广 |

### type 文案类型

| 值 | 说明 |
|---|------|
| `教知识·方法论拆解` | 教方法论 |
| `教知识·避免踩坑型` | 教避坑 |
| `教知识·工具测评型` | 教工具 |
| `聊观点·行业导向型` | 行业观点 |
| `聊观点·趋势预判` | 趋势判断 |
| `聊观点·认知颠覆` | 颠覆认知 |
| `讲故事·个人经历` | 个人故事 |
| `讲故事·客户见证` | 客户案例 |
| `晒过程·系统展示` | 展示系统/工具 |
| `热点速评` | 热点快速评论 |

> 可组合使用，用 `+` 连接，如 `晒过程·系统展示+教知识·方法论拆解`

### source_type 素材来源

| 值 | 说明 |
|---|------|
| `实战复盘` | 自己的实战过程 |
| `热点借势` | 外部热点新闻 |
| `灵感碎片` | 碎片化想法 |
| `对话提炼` | AI对话/头脑风暴 |
| `用户提问` | 粉丝私信/评论区问题 |
| `社群精华` | 社群讨论 |
| `录音稿` | 课程/会议录音 |
| `爆款改写` | 别人的爆款拆解改写 |
| `爆款衍生` | 自己的爆款衍生 |
| `客户见证` | 客户案例素材 |

---

## 标准模板

```yaml
---
title: ""
type:
status: 草稿
created: {{date:YYYY-MM-DD}}
tags:
  -
source_type:
---
```

### 完整版模板（含选填字段）

```yaml
---
title: ""
type:
status: 草稿
created: {{date:YYYY-MM-DD}}
tags:
  -
source_type:
framework: ""
opening_type: ""
viral_score:
source_url:
word_count:
platforms: []
published_date:
---
```

---

## Dataview 常用查询示例

### 查看所有待发布文案

```dataview
TABLE title as 标题, type as 类型, created as 创建日期, viral_score as 爆款分
FROM "02.领域/0.内容创作系统/🔥02.发布文案"
WHERE status = "待发布"
SORT created DESC
```

### 按类型统计

```dataview
TABLE length(rows) as 数量
FROM "02.领域/0.内容创作系统/🔥02.发布文案"
GROUP BY type as 类型
SORT length(rows) DESC
```

### 弹药库视图：按状态看全貌

```dataview
TABLE title as 标题, status as 状态, type as 类型, platforms as 平台
FROM "02.领域/0.内容创作系统/🔥02.发布文案"
SORT status ASC, created DESC
```

---

## 迁移策略

- **新文案**：所有skill输出必须遵循本规范
- **旧文案**：不强制回溯，但可以批量脚本迁移（将中文字段名替换为英文）
- **过渡期**：Dataview 查询同时兼容新旧字段名
