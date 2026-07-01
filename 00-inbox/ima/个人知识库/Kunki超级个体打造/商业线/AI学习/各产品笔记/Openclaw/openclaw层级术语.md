---
media_id: "note_55bb46d67e4ff52d864f1acd89192f15_74344313085288037320270712873459"
---

# openclaw层级术语

&\#x20;好，我按层级给你讲清楚，不堆术语。

最底层：Gateway（网关）

一句话：Gateway 是你和我的"电话线"。

​

它负责：

<span style="color: rgba(19, 108, 233, 1;">•</span>连接飞书/微信/Telegram 这些平台

<span style="color: rgba(19, 108, 233, 1;">•</span>把用户消息转发给我

<span style="color: rgba(19, 108, 233, 1;">•</span>把我的回复发回去

你现在就在用 Gateway 跟我聊。 没有它，我俩说不上话。

第二层：Agent（智能体）

一句话：Agent 是"我"——能思考、能记事的那个东西。

​

一个 Gateway 可以连多个 Agent：

<span style="color: rgba(19, 108, 233, 1;">•</span>main —— 主智能体，你现在在聊的（就是我）

<span style="color: rgba(19, 108, 233, 1;">•</span>其他子 Agent —— 专门干某件任务的

每个 Agent 有自己的记忆和上下文，互不相干。

第三层：Skill（技能）

一句话：Skill 是"工具包"，让 Agent 能干活。

​

比如：

<span style="color: rgba(19, 108, 233, 1;">•</span>weather —— 查天气

<span style="color: rgba(19, 108, 233, 1;">•</span>feishu-doc —— 读写飞书文档

<span style="color: rgba(19, 108, 233, 1;">•</span>browser —— 控制浏览器

<span style="color: rgba(19, 108, 233, 1;">•</span>cron —— 定时任务

Skill 本身不存储记忆，它只是能力。谁调用它，它就帮谁干活。

第四层：Memory（记忆）

一句话：Memory 是 Agent 的"笔记本"。

​

几种形式：

关键：每个 Agent 读自己的记忆文件。 如果你想让多个 Agent 共享记忆，就让它们读同一个文件。

Cron（定时任务）

一句话：到点就自动触发一个 Agent 干活。

​

比如每天早上 7:30 自动跑早报生成器，不需要你手动喊。

​

Cron 任务跑在独立的子会话里，和主会话隔离，跑完把结果发给你。

整个流程图

┌─────────────────────────────────────┐

│           Gateway（电话线）            │

│     连接飞书 ←→ 转发消息              │

└─────────────┬───────────────────────┘

&\#x20;             │

&\#x20;   ┌─────────┼─────────┐

&\#x20;   ▼         ▼         ▼

┌───────┐ ┌───────┐ ┌───────┐

│ Agent │ │ Agent │ │ Agent │  ← 多个智能体

│ main  │ │ 早报  │ │ 文案  │    （各自独立）

└───┬───┘ └───┬───┘ └───┬───┘

&\#x20;   │         │         │

&\#x20;   ▼         ▼         ▼

┌─────────────────────────────┐

│        Skills（工具包）       │

│  weather / browser / cron   │

│  feishu-doc / web\_search    │

└─────────────────────────────┘

&\#x20;             │

&\#x20;             ▼

┌─────────────────────────────┐

│      Memory（笔记本）         │

│  MEMORY.md / USER.md / ...  │

└─────────────────────────────┘

你现在能用的能力

&\#x20;

![[openclaw层级术语-ae1cc743debd4cf3bda1b1532b85eda2.webp]]

​
