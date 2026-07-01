---

> 2026-06-08 更新：本地 Obsidian 运行时唯一记忆系统为 `01-记忆系统/`，旧 `C-记忆核心` 路径只作为历史 New Drive 术语。
name: kunki-knowledge-base
description: 旧版 New Drive 知识库读取与任务上下文路由，仅在用户明确要求使用旧 New Drive 架构时使用。
---

# kunki-knowledge-base

> Kunki 一人公司系统 - New Drive 原生知识库读取入口。让小龙虾 / OpenClaw 云端智能体直接从 New Drive 读取所有信息，彻底解决 profile 为空找不到项目的问题，确保基于知识库干活不瞎编。

## 作用

这个 Skill 解决的问题是：

> 小龙虾接到任务后，必须知道应该从 New Drive 读取哪些信息，再基于这些信息交付任务。解决 New Drive profile 为空、找不到项目的老问题。

它只负责"读什么、为什么读、基于什么工作"。产出落盘、总控日报交给 `lobster-output-sync`。

## 新架构信息（纯 New Drive 原生模式）

- **New Drive 云端知识库 = 唯一权威**：所有核心配置、项目上下文、长期记忆、文件都在这里
- **项目名称**：`kunki-ai-one-person-company`
- **GitHub = 自动备份**：New Drive 会自动备份到 GitHub，不需要小龙虾操作
- **五大板块结构**：`A-系统基座 / B-参考资料 / 01-记忆系统 / D-内容创作 / E-产出交付` 都在 New Drive 上

## 最高规则（纯 New Drive 原生）

1. **第一步永远读 New Drive**：先从 New Drive 读取项目 `kunki-ai-one-person-company`。
2. **New Drive profile 为空不要慌**：直接读取文件：`/projects/kunki-ai-one-person-company/context.md`。
3. **所有文件都从 New Drive 读取**：不需要 git pull，不需要克隆 GitHub。
4. **飞书是轻工作台**：用于任务输入、摘要展示、协作入口，不再作为完整知识库主库。
5. **小龙虾不能只在内存干活**：所有长期有效产出必须写回 New Drive 对应目录。
6. 未发布草稿只能放入 `D-内容创作/08-草稿库/` 或 `01-记忆系统/每日输入与复盘/lobster_input/`，不能放入 `E-产出交付/01-已发文案/`。

## 标准启动流程（纯 New Drive）

每次执行任务，按这个顺序读：

### 第一步：读 New Drive 项目

```
get_project("kunki-ai-one-person-company")
```

如果返回空或 profile 为空，**强制读取**：

```
read_file("/projects/kunki-ai-one-person-company/context.md")
read_file("/projects/kunki-ai-one-person-company/lobster/00-main-rules.md")
```

这一步必须成功，不能卡住。

### 第二步：读取顶层核心文件

然后从 New Drive 读取以下顶层文件。若某个文件不存在则跳过，但必须读取存在的同类文件：

```text
/projects/kunki-ai-one-person-company/A-系统基座/00-核心配置/AGENTS.md
01-记忆系统/AI协作偏好.md
01-记忆系统/长期记忆.md
01-记忆系统/长期记忆.md
01-记忆系统/长期记忆.md
01-记忆系统/当下每时每刻（持续更新）.md
A-系统基座/00-核心配置/小龙虾系统/
01-记忆系统/每日输入与复盘/lobster_input/00-龙虾核心配置/
```

## 任务类型识别与读取路径

### 1. 选题 / 热点 / 内容方向任务

触发词：选题、热点、今天写什么、内容方向、账号选题、爆款方向。

必须从 New Drive 读取：

```text
01-记忆系统/长期记忆.md
01-记忆系统/长期记忆.md
01-记忆系统/长期记忆.md爆款方法论/
D-内容创作/01-用户画像/
D-内容创作/02-选题决策/
D-内容创作/03-素材库/
E-产出交付/03-数据反馈/
01-记忆系统/每日输入与复盘/lobster_input/01-xuange-选哥/
```

输出交给 `lobster-output-sync` 的 `01-xuange-选哥`。

### 2. 文案初稿 / 短视频口播 / 公众号草稿任务

触发词：写文案、初稿、口播稿、公众号、短视频、改写、爆款拆解。

必须从 New Drive 读取：

```text
01-记忆系统/长期记忆.md
01-记忆系统/长期记忆.md
01-记忆系统/
01-记忆系统/长期记忆.md爆款方法论/
D-内容创作/03-素材库/
D-内容创作/04-文案框架/
D-内容创作/05-开篇模板/
D-内容创作/08-草稿库/
01-记忆系统/每日输入与复盘/lobster_input/02-contenthelper-内容助手/_persona/
E-产出交付/01-已发文案/
```

**⚠️ 强制要求**：必须读完上述所有相关文件才能开始写。**禁止不读资料直接乱写**。这是内容助手写得好的关键。

输出交给 `lobster-output-sync` 的 `02-contenthelper-内容助手`。

### 3. 雅思 / 港科广 / 保研 / 学业任务

触发词：雅思、IELTS、港科广、保研、暨大、数字经济、申请、学习计划。

必须从 New Drive 读取：

```text
01-记忆系统/长期记忆.md
01-记忆系统/长期记忆.md
01-记忆系统/当下每时每刻（持续更新）.md
01-记忆系统/每日输入与复盘/
01-记忆系统/每日输入与复盘/lobster_input/05-xuedadazi-学习搭子/
01-记忆系统/每日输入与复盘/lobster_input/08-yasige-雅思哥/
```

输出交给 `05-xuedadazi-学习搭子` 或 `08-yasige-雅思哥`。

### 4. 商业合作 / OPC / BNI / 产品 / 变现任务

触发词：OPC、BNI、合作、商业闭环、产品、代充、智能体、明安科技、客户、成交。

必须从 New Drive 读取：

```text
01-记忆系统/长期记忆.md
01-记忆系统/长期记忆.md
01-记忆系统/长期记忆.md
D-内容创作/06-产品管理/
E-产出交付/02-变现路径/
E-产出交付/04-客户运营/
E-产出交付/05-合作管理/
```

输出按任务类型交给内容助手、素材整理大师、复盘哥或总控虾。

### 5. 链接素材 / 外部资料整理任务

触发词：链接、文章、资料、报告、小红书、公众号、视频、素材整理。

必须从 New Drive 读取：

```text
B-参考资料/
D-内容创作/03-素材库/
01-记忆系统/每日输入与复盘/lobster_input/06-sucai-素材整理大师/
```

输出交给 `06-sucai-素材整理大师`。

### 6. 发布后数据复盘任务

触发词：复盘、数据、阅读量、点赞、转化、为什么爆、为什么扑。

必须从 New Drive 读取：

```text
E-产出交付/01-已发文案/
E-产出交付/03-数据反馈/
01-记忆系统/长期记忆.md爆款方法论/
D-内容创作/04-文案框架/
01-记忆系统/每日输入与复盘/lobster_input/07-fupange-复盘哥/
```

输出交给 `07-fupange-复盘哥`。

### 7. 每日总控日报任务

触发词：总控、日报、汇总、今天小龙虾做了什么。

必须从 New Drive 读取当日目录：

```text
01-记忆系统/每日输入与复盘/lobster_input/01-xuange-选哥/YYYY-MM-DD/
01-记忆系统/每日输入与复盘/lobster_input/02-contenthelper-内容助手/YYYY-MM-DD/
01-记忆系统/每日输入与复盘/lobster_input/03-cuihuo-催活助手/YYYY-MM-DD/
01-记忆系统/每日输入与复盘/lobster_input/04-gzhmonitor-公众号监控助手/YYYY-MM-DD/
01-记忆系统/每日输入与复盘/lobster_input/05-xuedadazi-学习搭子/YYYY-MM-DD/
01-记忆系统/每日输入与复盘/lobster_input/06-sucai-素材整理大师/YYYY-MM-DD/
01-记忆系统/每日输入与复盘/lobster_input/07-fupange-复盘哥/YYYY-MM-DD/
01-记忆系统/每日输入与复盘/lobster_input/08-yasige-雅思哥/YYYY-MM-DD/
```

输出交给 `09-zongkongxia-总控虾`。

## 输出原则

1. 回答和产出必须基于已读取资料，不确定就标注"不确定 / 待林总确认"。
2. **必须先读 New Drive，再干活**，profile 为空不要放弃，直接读 `context.md`。
3. 不要把飞书当完整知识库主库。
4. 内容创作任务**必须**读取内容框架、开篇模板、林总风格样本，不能乱写。
5. 产出完成后必须执行 `lobster-output-sync` 的写入规则。

## 快速交接话术

如果小龙虾不知道怎么干，直接告诉它：

> 先运行 `kunki-knowledge-base`：第一步读 New Drive 项目 `kunki-ai-one-person-company`，profile 为空就读 `/projects/kunki-ai-one-person-company/context.md`；然后按任务类型从 New Drive 读取对应路径上下文；产出后运行 `lobster-output-sync`，写入 `01-记忆系统/每日输入与复盘/lobster_input/` 对应智能体目录，更新总控日报。New Drive 会自动备份到 GitHub，不需要你操作 Git。
