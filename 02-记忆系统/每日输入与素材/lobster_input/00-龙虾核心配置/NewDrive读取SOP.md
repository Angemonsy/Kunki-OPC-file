# New Drive 读取 SOP

> 更新时间：2026-05-25
> 适用对象：OpenClaw / 小龙虾 / Hermes / Newmax

## 1. 不要再卡 profile

如果读取 profile 为空，不代表没有知识库。

正确处理：

```text
profile 为空
→ 读取 project: kunki-ai-one-person-company
→ 如果 get_project 失败，直接 read_file /projects/kunki-ai-one-person-company/context.md
→ 如果还是失败，search_memory 搜关键词
```

## 2. 标准读取顺序

### Step 1：读项目 context

```text
/projects/kunki-ai-one-person-company/context.md
```

### Step 2：读本地知识库索引

```text
/projects/kunki-ai-one-person-company/local-vault-index.md
```

### Step 3：读龙虾规则

```text
/projects/kunki-ai-one-person-company/lobster/00-main-rules.md
/projects/kunki-ai-one-person-company/lobster/01-agent-personas.md
/projects/kunki-ai-one-person-company/lobster/02-contenthelper-workflow.md
/projects/kunki-ai-one-person-company/lobster/03-newdrive-read-sop.md
```

### Step 4：按任务搜索

搜索关键词组合：

```text
林总 + 任务关键词
Kunki + 任务关键词
540学生法则 + 内容
内容助手 + 文案
小龙虾 + 工作流
OpenClaw + New Drive
```

## 3. 内容助手专用读取顺序

内容助手接到写作任务后，必须读：

```text
1. /projects/kunki-ai-one-person-company/context.md
2. /projects/kunki-ai-one-person-company/local-vault-index.md
3. /projects/kunki-ai-one-person-company/lobster/02-contenthelper-workflow.md
4. D-内容创作/04-文案框架/
5. D-内容创作/05-开篇模板/
6. C-记忆核心/03-经验沉淀/爆款方法论/
7. C-记忆核心/01-个人上下文/
8. E-产出交付/01-已发文案/
```

如果不能直接读本地文件，就通过 New Drive 搜索这些路径和关键词。

## 4. 任务判断

收到任务后先分类：

```text
内容创作
选题推荐
素材整理
学习雅思
商业合作
数据复盘
系统配置
每日总控
```

然后按分类读取对应路径。

## 5. 输出要求

每次输出前要能回答：

```text
我读了哪些资料？
我调用/参考了哪个 Skill？
我为什么用这个框架？
这份产出要保存到哪里？
林总需要确认什么？
```

如果回答不了，说明还没读够，不要开始生成。

## 6. 错误处理

### profile 为空

处理：读 project context，不要报错。

### project 找不到

处理：直接 read_file `/projects/kunki-ai-one-person-company/context.md`。

### 搜索没有结果

处理：换关键词：

```text
Kunki AI 一人公司知识库
New Drive 云端知识库
小龙虾内容助手
lobster_input
540学生法则
大学生用AI
```

### 不知道写到哪里

处理：默认写到对应智能体目录：

```text
C-记忆核心/02-每日输入/lobster_input/[智能体目录]/YYYY-MM-DD/
```

## 7. 禁止事项

1. 禁止 profile 空就停止。
2. 禁止没读 context 就回答。
3. 禁止没读框架就写文章。
4. 禁止没读林总个人上下文就写“个人 IP 文”。
5. 禁止只输出聊天，不落盘。
