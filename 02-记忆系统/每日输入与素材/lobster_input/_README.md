# lobster_input 小龙虾每日产出工作区

> 更新时间：2026-05-24

这里是小龙虾 / OpenClaw 云端智能体的每日产出回流区。

## 定位

```text
远程 AI 员工产出的本地镜像区 + 每日复盘区 + 调度区 + 素材池
```

小龙虾在云服务器完成任务后，必须把产出写入这里，并通过 GitHub 回流。林总本地 Obsidian `git pull` 后即可看到。

## 权威规则

1. GitHub / Obsidian 主库是一号权威知识库。
2. 飞书是轻工作台，不是完整主库。
3. 云服务器本地目录不是最终归档。
4. 所有长期有效产出必须回流 GitHub。
5. 未发布草稿不能放入 `E-产出交付/01-已发文案/`。

## 目录说明

```text
01-xuange-选哥/                # 选题官：热点、选题、内容方向
02-contenthelper-内容助手/      # 内容初稿：文案、口播稿、公众号草稿
03-cuihuo-催活助手/             # GitHub同步、关键任务提醒
04-gzhmonitor-公众号监控助手/    # 公众号素材雷达
05-xuedadazi-学习搭子/           # 港科广、保研、学习答疑
06-sucai-素材整理大师/           # 链接素材、外部资料整理
07-fupange-复盘哥/               # 发布后数据复盘
08-yasige-雅思哥/                # IELTS学习计划和记录
09-zongkongxia-总控虾/           # 每日总控日报
```

## 普通产出路径

```text
C-记忆核心/02-每日输入/lobster_input/[智能体目录]/YYYY-MM-DD/[文件名].md
```

## 总控日报路径

```text
C-记忆核心/02-每日输入/lobster_input/09-zongkongxia-总控虾/YYYY-MM-DD-小龙虾每日总控日报.md
```

## 小龙虾必读 Skill

```text
.claude/skills/kunki-knowledge-base/SKILL.md
.claude/skills/lobster-output-sync/SKILL.md
```

## 系统配置文档

```text
A-系统基座/00-核心配置/小龙虾系统/
```

## 8个智能体分工

| 文件夹 | 智能体 | 核心职责 |
|---|---|---|
| 01-xuange-选哥 | 选哥 / xuange | 基于 GitHub 主库生成选题、热点推荐、选题评分 |
| 02-contenthelper-内容助手 | 内容助手 / contenthelper | 根据选题生成符合林总风格的内容初稿 |
| 03-cuihuo-催活助手 | 催活助手 / cuihuo | GitHub 同步、关键任务提醒、回流检查 |
| 04-gzhmonitor-公众号监控助手 | 公众号监控助手 / gzhmonitor | 监控公众号新文章，沉淀可拆解素材 |
| 05-xuedadazi-学习搭子 | 学习搭子 / xuedadazi | 港科广、保研、学业申请答疑 |
| 06-sucai-素材整理大师 | 素材整理大师 / sucai | 处理链接素材，提炼价值沉淀 |
| 07-fupange-复盘哥 | 复盘哥 / fupange | 发布后数据复盘，总结可复用经验 |
| 08-yasige-雅思哥 | 雅思哥 / yasige | IELTS 6.5 目标推进、学习记录和备考提醒 |
| 09-zongkongxia-总控虾 | 总控虾 / zongkongxia | 汇总当日所有产出，生成总控日报 |

## 复利机制工作流

```text
云端产出
→ 按智能体 + 日期自动归档
→ 总控虾汇总日报
→ GitHub commit / push
→ 林总本地 git pull
→ Obsidian 看到结果
→ Main Agent / 林总二次复盘沉淀到正式资产区
```

## 统一底层规则

1. 所有小龙虾执行前先读取 GitHub 主库。
2. 产出只允许放到本目录对应子目录，不乱跑。
3. 不确定就新建文件，不直接覆盖旧文件。
4. 遇到 Git 冲突不要强推，先报告林总。
5. 禁止提交密钥、Cookie、Token、账号密码。
