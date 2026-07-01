# Skill 目录说明

> 更新日期：2026-06-07

## 当前结论

在当前知识库仓库内，` .claude/skills/ ` 是最完整的 Skill 目录，后续整理、索引、课程讲解时，以它作为仓库内 Skill 主目录参考。

## 本次统计

| 目录 | 一级子目录数 | SKILL.md / skill.md 数量 | 结论 |
| --- | ---: | ---: | --- |
| `.claude/skills/` | 41 | 62 | 当前最完整，作为仓库内主参考目录 |
| `.agents/skills/` | 40 | 61 | 与 `.claude/skills/` 高度重复，偏运行/历史镜像 |
| `05-智能体协作与工具脚本/skills-旧目录/` | 2 | 15 | 旧目录，不作为主目录 |

## 使用规则

1. 仓库内 Skill 资产以 `.claude/skills/` 为当前最完整来源。
2. `.agents/skills/` 暂不移动，避免影响历史脚本和运行时引用。
3. `05-智能体协作与工具脚本/skills-旧目录/` 只作为旧目录归档，后续可确认删除或合并。
4. 对外讲课和整理索引时，从 `.claude/skills/` 生成 Skill 清单。
5. 牛马AI新版用户 Skill 运行目录可能是 `~/.newmax/skills/`；如果要真正安装到运行环境，需要再单独同步。

## 后续待办

- 生成 `.claude/skills/` 的完整 Skill 索引。
- 对比 `.claude/skills/` 与 `.agents/skills/` 的差异。
- 把重复、旧版、压缩包、非 Skill 文件单独标记。
