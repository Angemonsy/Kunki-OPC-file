# New Drive 工作流说明（纯原生模式）

> 更新时间：2026-05-25

## 一、架构说明（纯 New Drive 原生）

在这个架构下：

- **New Drive = 唯一知识库 + 读写中枢**：小龙虾直接从 New Drive 读，写完直接回 New Drive
- **GitHub = 自动备份**：由 New Drive 自动完成，不需要小龙虾操作
- **不需要小龙虾碰 Git**：pull/push/commit 都省了

这是最简单干净的架构。

## 二、标准工作流程

### 1. 任务开始前

```
get_project("kunki-ai-one-person-company")
```

如果 profile 为空：

```
read_file("/projects/kunki-ai-one-person-company/context.md")
```

### 2. 读取知识库

执行 `kunki-knowledge-base`：

```text
第一步：读 New Drive 项目
→ 如果 profile 为空，读 /projects/kunki-ai-one-person-company/context.md
→ 按任务类型读取 New Drive 对应路径
→ 开始任务
```

**内容创作任务强制要求**：必须读完框架、模板、风格样本才能开始写。禁止不读资料直接乱写。

### 3. 写入产出

执行 `lobster-output-sync`：

```text
识别智能体身份
→ 写入 New Drive 的 lobster_input 对应目录
→ 更新总控日报
```

### 4. 完成

所有写入完成后，报告给林总：

- 哪些文件已写入 New Drive
- 今日关键产出是什么
- 需要林总确认什么事项

**GitHub 备份由 New Drive 自动处理，不需要小龙虾做任何事**。

## 三、冲突处理

如果路径已存在且有林总人工修改：

1. 停止覆盖。
2. 小龙虾产出保存为新版本，文件名加 `-v2`。
3. 报告冲突给林总。

## 四、安全检查

写入前检查禁止内容：

```text
.env
*.key
credentials.json
API Key
Token
Cookie
账号密码
```

发现敏感信息，停止写入并报告林总。

## 五、最终闭环

```text
林总下达任务
→ 小龙虾读 New Drive
→ kunki-knowledge-base 读取对应路径
→ 执行任务
→ lobster-output-sync 写入 New Drive
→ 总控虾生成日报
→ New Drive 自动备份到 GitHub
→ 林总本地同步
→ 林总复盘更新
→ 下次循环
```

就是这么简单干净。
