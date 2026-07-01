# 小龙虾 New Drive 读取路径清单（纯原生模式）

> 更新时间：2026-05-25

## 一、第一步：New Drive 必读（必须成功，不能卡住）

**启动任务第一件事，先读 New Drive：**

```
get_project("kunki-ai-one-person-company")
```

如果 profile 为空或返回空：

```
read_file("/projects/kunki-ai-one-person-company/context.md")
read_file("/projects/kunki-ai-one-person-company/lobster/00-main-rules.md")
read_file("/projects/kunki-ai-one-person-company/lobster/01-agent-personas.md")
```

这一步必须完成，不能卡住。**这解决了之前 profile 为空就报错的老问题**。

## 二、第二步：顶层核心文件必读

New Drive 项目读完后，再从 New Drive 读取这些顶层文件：

```text
/projects/kunki-ai-one-person-company/A-系统基座/00-核心配置/CLAUDE.md
C-记忆核心/01-个人上下文/SOUL.md
C-记忆核心/01-个人上下文/A02-USER.md
C-记忆核心/01-个人上下文/A03-MEMORY.md
C-记忆核心/01-个人上下文/A04-INVENTORY.md
C-记忆核心/01-个人上下文/A05-周工作区.md
A-系统基座/00-核心配置/小龙虾系统/
C-记忆核心/02-每日输入/lobster_input/00-龙虾核心配置/
```

## 三、第三步：按任务类型读专项路径

### 1. 内容创作必读（选哥 + 内容助手）

```text
D-内容创作/01-用户画像/
D-内容创作/02-选题决策/
D-内容创作/03-素材库/
D-内容创作/04-文案框架/
D-内容创作/05-开篇模板/
C-记忆核心/03-经验沉淀/爆款方法论/
C-记忆核心/01-个人上下文/我的个人上下文/
C-记忆核心/02-每日输入/lobster_input/02-contenthelper-内容助手/_persona/
E-产出交付/03-数据反馈/
```

**⚠️ 内容助手强制要求**：必须读完上述文件才能开始写！**禁止不读资料直接乱写**。这是之前写得乱七八糟的根因。

### 2. 学业 / 雅思必读

```text
C-记忆核心/01-个人上下文/A02-USER.md
C-记忆核心/01-个人上下文/A03-MEMORY.md
C-记忆核心/01-个人上下文/A05-周工作区.md
C-记忆核心/02-每日输入/
C-记忆核心/02-每日输入/lobster_input/05-xuedadazi-学习搭子/
C-记忆核心/02-每日输入/lobster_input/08-yasige-雅思哥/
```

### 3. 商业 / 合作 / 产品必读

```text
D-内容创作/06-产品管理/
E-产出交付/02-变现路径/
E-产出交付/04-客户运营/
E-产出交付/05-合作管理/
C-记忆核心/01-个人上下文/A04-INVENTORY.md
```

### 4. 素材整理必读

```text
B-参考资料/
D-内容创作/03-素材库/
C-记忆核心/02-每日输入/lobster_input/06-sucai-素材整理大师/
```

### 5. 数据复盘必读

```text
E-产出交付/01-已发文案/
E-产出交付/03-数据反馈/
C-记忆核心/03-经验沉淀/爆款方法论/
D-内容创作/04-文案框架/
```

### 6. 总控日报必读

```text
C-记忆核心/02-每日输入/lobster_input/01-xuange-选哥/YYYY-MM-DD/
C-记忆核心/02-每日输入/lobster_input/02-contenthelper-内容助手/YYYY-MM-DD/
C-记忆核心/02-每日输入/lobster_input/03-cuihuo-催活助手/YYYY-MM-DD/
C-记忆核心/02-每日输入/lobster_input/04-gzhmonitor-公众号监控助手/YYYY-MM-DD/
C-记忆核心/02-每日输入/lobster_input/05-xuedadazi-学习搭子/YYYY-MM-DD/
C-记忆核心/02-每日输入/lobster_input/06-sucai-素材整理大师/YYYY-MM-DD/
C-记忆核心/02-每日输入/lobster_input/07-fupange-复盘哥/YYYY-MM-DD/
C-记忆核心/02-每日输入/lobster_input/08-yasige-雅思哥/YYYY-MM-DD/
```

## 四、读取策略

1. **第一步永远读 New Drive**：彻底解决 profile 为空问题。
2. 先读启动必读，再按任务类型读专项路径。
3. 如果路径不存在，不要报错中断；记录"该路径暂不存在"，继续读取同类可用资料。
4. 如果内容互相冲突，优先级为：

```text
用户最新明确指令 > New Drive project context > CLAUDE.md > A03-MEMORY.md > A02-USER.md > 其他历史资料 > 飞书临时输入
```

5. 任务输出必须说明主要参考了哪些文件。
