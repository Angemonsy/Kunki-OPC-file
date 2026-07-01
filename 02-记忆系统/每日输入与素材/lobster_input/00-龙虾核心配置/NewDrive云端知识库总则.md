# New Drive 云端知识库总则

> 更新时间：2026-05-25
> 适用对象：OpenClaw / 小龙虾 / Hermes / Newmax / 所有云端 AI 员工

## 1. 最新架构决策

林总已经把 GitHub 和飞书从“云端知识库中枢”的位置搬掉。

以后跨端知识读取与文件互导的优先中枢是：

```text
New Drive
```

这意味着：

```text
本地 Obsidian 知识库
→ 通过 New Drive 建索引、写核心上下文、同步关键文件
→ 云端 OpenClaw / 小龙虾读取 New Drive
→ 云端产出再通过 New Drive / 本地同步回流
```

## 2. 三层知识库关系

### 第一层：本地 Obsidian 主库

林总本地长期知识库，路径：

```text
/Users/kunki/Documents/我的知识库
```

作用：完整资产库、写作素材库、历史沉淀、交付归档。

### 第二层：New Drive 云端知识库

项目名：

```text
kunki-ai-one-person-company
```

核心 context：

```text
/projects/kunki-ai-one-person-company/context.md
```

作用：云端服务器和不同 AI 工具读取林总知识库的统一入口。

### 第三层：OpenClaw / 小龙虾执行现场

云服务器工作目录：

```text
/home/18902684335_wy/openclaw/workspace
```

作用：执行任务、运行智能体、生成中间产物。

注意：执行现场不是最终记忆源。长期有效内容必须写回 New Drive / 本地知识库。

## 3. 读取优先级

小龙虾执行任务时，按这个顺序读取：

```text
1. New Drive project context
2. New Drive memory / search_memory 检索结果
3. New Drive 中同步的本地知识库索引
4. 本地 Obsidian / GitHub 文件副本（如果可用）
5. 用户当前输入
```

如果 profile 为空，不要停。

必须改读：

```text
/projects/kunki-ai-one-person-company/context.md
```

并搜索关键词：

```text
Kunki AI 一人公司知识库
小龙虾
OpenClaw
New Drive
内容助手
540学生法则
lobster_input
```

## 4. 核心原则

1. New Drive 是云端知识库中枢。
2. 本地 Obsidian 是完整资产库。
3. 飞书不再作为完整主库，只能作为轻工作台。
4. GitHub 可作为版本同步工具，但不是小龙虾读取的唯一入口。
5. 小龙虾不能凭空写，必须先读取上下文。
6. 内容助手写文章前必须读取资料、框架、风格和对应 Skill。
7. 产出必须落到可追踪文件，而不是只停留在对话。

## 5. 本地知识库要上传到 New Drive 的方式

不要把所有文件一次性无脑塞进 profile。

正确方式是：

```text
先写总索引
→ 再写关键规则
→ 再写智能体人设
→ 再按任务类型同步必要文档
→ 最后让小龙虾按索引检索读取
```

推荐同步到 New Drive 的内容：

```text
/projects/kunki-ai-one-person-company/context.md
/projects/kunki-ai-one-person-company/local-vault-index.md
/projects/kunki-ai-one-person-company/lobster/00-main-rules.md
/projects/kunki-ai-one-person-company/lobster/01-agent-personas.md
/projects/kunki-ai-one-person-company/lobster/02-contenthelper-workflow.md
/projects/kunki-ai-one-person-company/lobster/03-newdrive-read-sop.md
```

## 6. 内容助手重点纠偏

林总明确反馈：内容助手写文章“一笔屌糟”。根因是：

```text
没有找相应信息
没有调用相应 Skill
没有读文案框架
没有读风格样本
没有读个人经历
直接通用 AI 味开写
```

以后内容助手必须按固定流水线执行：

```text
识别内容类型
→ 读取 New Drive 项目 context
→ 读取本地知识库索引
→ 读取用户画像 / 选题 / 素材 / 框架 / 开篇模板 / 风格样本
→ 匹配对应 Skill
→ 生成结构大纲
→ 自检是否有林总个人印记
→ 生成初稿
→ 保存到内容助手目录
→ 等林总确认
```

## 7. 禁止事项

1. 禁止 profile 为空就说“找不到项目”。
2. 禁止不读 context 就开始回答。
3. 禁止内容助手直接写通用文案。
4. 禁止把未发布草稿写进已发文案。
5. 禁止只在 OpenClaw 本地保存，不回流 New Drive / 本地知识库。
