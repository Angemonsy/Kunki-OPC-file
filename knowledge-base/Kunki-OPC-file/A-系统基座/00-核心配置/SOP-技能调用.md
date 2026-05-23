# SOP：Skill技能调用规范

## 基本原则

1. **工具匹配**：不同任务用对应Skill，不混用
2. **先读再用**：调用Skill前先看索引和规范，确保调用方式正确
3. **权限合规**：需要用户授权的操作必须得到用户确认才能执行
4. **结果存档**：Skill处理后的重要结果保存到本地知识库对应文件夹

---

## 已安装Skill索引

参见 `SKILL-索引.md` - 这里只放调用规范。

---

## 常用Skill调用规范

### 1. x-reader 系列（链接内容读取）

#### `x-reader-url` - 网页/文章/公众号/小红书链接读取

**什么时候用**：用户发送网页URL链接，需要提取正文内容时自动触发。

**调用方式**：
```
mcp__skill-handler__Skill(skill="x-reader-url", args="URL")
```

**处理流程**：
1. 用户发送URL → 自动触发
2. 调用x-reader-url提取正文
3. 返回结构化整理结果
4. 如果内容重要，询问用户是否保存到 `03.参考资料库/`

#### `x-reader-video` - 视频/播客转文字+摘要

**什么时候用**：用户发送视频链接（B站/YouTube等）或播客链接。

**调用方式**：
```
mcp__skill-handler__Skill(skill="x-reader-video", args="URL")
```

**输出**：完整文字稿 + 核心要点摘要

#### `x-reader-analyzer` - 内容多维结构化分析

**什么时候用**：需要对获取到的内容做深度分析。

**调用方式**：
```
mcp__skill-handler__Skill(skill="x-reader-analyzer", args="分析要求|文件路径或文本内容")
```

---

### 2. 飞书lark-cli 操作

**什么时候用**：飞书云端文件操作、双向同步。

**调用要点**：
- 记住参数名：`--file-token` 不是 `--token`
- 记住身份：大部分操作要 `--as user`
- 删除要加：`--yes --type docx`

**常用命令模板**：
```bash
# 列文件
lark-cli drive files list --params '{"folder_token":"TOKEN"}' --as user

# 删除文件
lark-cli drive +delete --file-token TOKEN --as user --yes --type docx

# 导出下载
lark-cli drive +export --file-token TOKEN --type docx --as user
lark-cli drive +export-download --task-id TASK_ID --output ./path --as user
```

参见 `lark-cli-ai-skills.md` 完整文档。

---

### 3. convert-to-project 项目管理系列（长期任务放养）

**什么时候用**：用户说"转为长期放养"、"转成长期项目"、"拆解为任务"。

**调用流程**：
1. 先调用 `convert_to_project` 转换当前对话为项目
2. 然后调用 `create_tasks` 创建任务列表
3. 然后调用 `update_plan_document` 更新项目计划
4. 日常更新用 `update_task` / `mark_task_done` 跟踪进度

**调用模板**：
```
mcp__convert-to-project__convert_to_project(
  title="项目标题",
  plan_document="# 项目计划\n\n目标：...",
  generated_files=["path/to/file1", "path/to/file2"]
)
```

---

### 4. browser-use 浏览器控制

**什么时候用**：需要交互操作网页、抓取动态内容。

**操作原则**（严格遵守）：
1. 开始前先 `browser_list_profiles` 检查可用Profile
2. 多个Profile要询问用户选择哪个
3. **先读DOM，再看截图，最后才坐标点击**
4. 优先用 `browser_click_element` (CSS选择器)，不用坐标
5. 大数据量用 `browser_save_file` 直接存本地，不转参数传递
6. 完成后必须 `browser_close` 关闭，输出 `strategy` 执行策略

**效率工作流**：
```
browser_open(url, profile)
browser_eval(JS提取信息) → 了解页面结构
browser_click_element(selector) → 操作
browser_eval(提取结果)
（需要视觉确认才）browser_screenshot
browser_close
输出<strategy>...</strategy>
```

---

### 5. Agent 子代理调用

**什么时候用**：
- 复杂多步搜索探索代码库 → `subagent_type=Explore`
- 制定实施计划 → `subagent_type=Plan`
- 通用研究 → `subagent_type=general-purpose`

**调用模板**：
```
Agent(
  description="一句话描述任务",
  prompt="完整任务说明，给子代理的指令",
  subagent_type="Explore"
)
```

**原则**：
- 开放性探索用子代理，我直接拿结果
- 已知路径操作我自己来，不用子代理
- 多个独立任务可以并发调用

---

## 错误处理原则

1. **命令参数错了** → 看帮助文档 (`command --help`)，纠正参数重新来
2. **权限错了** → 换成 `--as user`，让用户完成授权
3. **API路径错了** → 用 `lark-cli drive files list` 这种高阶快捷命令，不用裸API
4. **调用错Skill** → 停下来看 `SKILL-索引.md`，选对Skill再试

---

## 我的（助手）记忆锚点

每次执行重要操作前，我会：
1. 先读 `00.系统配置/` 下对应的SOP
2. 确认调用方式正确
3. 再执行操作
4. 结果存档到对应文件夹
