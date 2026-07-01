---
name: wechat-local-wechat-cli
description: 当用户想通过本机 wechat-cli 读取、搜索、分析、总结、导出任意微信聊天记录时使用。包括但不限于：找微信群、读取群聊/私聊信息、工作总结群聊、总结某个群、搜索关键词、查看成员、导出聊天记录、提取待办、做日报周报复盘。不要局限于固定群聊；根据用户给出的群名、联系人名、关键词或任务目标动态定位。
---

# WeChat Local CLI Skill

## 定位

这是 Kunki 本机微信数据读取与分析 skill。使用已经配置成功的 `wechat-cli`，从本地微信数据库读取聊天记录、群信息、联系人、搜索结果，并根据用户目标完成总结、提炼、导出、分析等任务。

**核心原则：不要局限于任何一个固定群聊。** 之前成功验证过 `Kunki | AI 提效变现学习`，但它只是示例和排错参照。以后用户可能要求读取任何微信群、私聊、关键词、时间段或特定业务场景。

## 典型触发语

当用户说以下类似需求时，自动使用本 skill：

- “工作总结群聊”
- “帮我总结微信群”
- “帮我找一下某个群聊信息”
- “爬取/读取/查一下微信群聊天记录”
- “搜索微信里关于 XXX 的内容”
- “查一下 XXX 群最近在聊什么”
- “把某个群今天的内容总结一下”
- “看一下某个群有没有提到 XXX”
- “帮我导出某个群的聊天记录”
- “找某个人在群里的发言”
- “查看某群成员”
- “把微信群内容整理成日报/周报/复盘/待办”
- “牛马AI个体/学校直接变现/AI提效变现”等模糊群聊线索

## 已验证环境

- 工具：`wechat-cli`
- 当前命令路径：`/Library/Frameworks/Python.framework/Versions/3.12/bin/wechat-cli`
- 配置文件：`~/.wechat-cli/config.json`
- 密钥文件：`~/.wechat-cli/all_keys.json`
- 已验证基础命令：

```bash
wechat-cli sessions --limit 3
```

能返回 JSON 会话即表示可用。

## 当前关键配置经验

Kunki 电脑里曾有多个微信账号目录。出现过“密钥能提取，但读取报 file is not a database”的问题，原因是账号目录和密钥不匹配。

当前已验证可用目录曾是：

```text
/Users/kunki/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_n1bb38ckytkc22_cadd/db_storage
```

如果以后切换微信账号、重新登录、迁移数据或重新 init，这个目录可能变化。不要死记固定目录；遇到问题时按排错流程重新验证。

## 基础检查流程

每次执行实际读取前，如果不确定状态，先跑：

```bash
which wechat-cli
wechat-cli sessions --limit 3
```

如果成功返回会话，就继续。

如果失败，先清缓存：

```bash
rm -rf /tmp/wechat_cli_cache
wechat-cli sessions --limit 3
```

## 通用操作命令

### 1. 查看最近会话

用于快速发现最近活跃群聊/私聊：

```bash
wechat-cli sessions --limit 50
```

如果用户描述模糊，可以扩大：

```bash
wechat-cli sessions --limit 200
```

### 2. 按联系人/群名搜索

```bash
wechat-cli contacts --query "关键词"
```

示例：

```bash
wechat-cli contacts --query "牛马AI"
wechat-cli contacts --query "变现"
wechat-cli contacts --query "项目"
wechat-cli contacts --query "领航"
```

### 3. 全局搜索聊天内容

```bash
wechat-cli search "关键词" --limit 20
```

示例：

```bash
wechat-cli search "截止日期" --limit 50
wechat-cli search "工作总结" --limit 50
wechat-cli search "直接变现" --limit 50
```

### 4. 指定群/联系人搜索

如果已经知道群名：

```bash
wechat-cli search "关键词" --chat "群名" --limit 50
```

### 5. 读取聊天记录

```bash
wechat-cli history "群名或联系人名" --limit 100 --format text
```

常用：

```bash
wechat-cli history "群名" --limit 200 --format text
```

如果用户要求更多上下文，可以增加 limit，但注意输出长度：

```bash
wechat-cli history "群名" --limit 500 --format text
```

### 6. 查看群成员

```bash
wechat-cli members "群名"
```

### 7. 查看未读消息

```bash
wechat-cli unread
```

### 8. 查看增量新消息

```bash
wechat-cli new-messages
```

### 9. 导出聊天记录

若用户明确要求导出，优先导出到 workspace：

```bash
mkdir -p "/Users/kunki/ObsidianVaults/领航知识库/微信导出"
wechat-cli history "群名" --limit 500 --format text > "/Users/kunki/ObsidianVaults/领航知识库/微信导出/群名-聊天记录.txt"
```

注意最终产出必须保存到 workspace：

```text
/Users/kunki/ObsidianVaults/领航知识库
```

## 通用执行策略

### 用户给了明确群名/联系人名

1. 先直接读：

```bash
wechat-cli history "用户给的名称" --limit 100 --format text
```

2. 如果找不到，再搜联系人：

```bash
wechat-cli contacts --query "关键词"
```

3. 找到候选后再读。

### 用户给的是模糊线索

例如：“牛马AI个体，学校直接变现这个群”。

步骤：

1. 拆关键词：如 `牛马AI`、`个体`、`学校`、`变现`。
2. 分别搜索联系人/群名：

```bash
wechat-cli contacts --query "牛马AI"
wechat-cli contacts --query "个体"
wechat-cli contacts --query "学校"
wechat-cli contacts --query "变现"
```

3. 搜最近会话：

```bash
wechat-cli sessions --limit 200
```

4. 全局搜聊天内容：

```bash
wechat-cli search "关键词" --limit 50
```

5. 汇总候选群，让结果最匹配用户意图；如果候选过多且无法判断，再向用户确认。

### 用户只说“工作总结群聊”

不要默认只查某一个群。应先判断上下文：

1. 如果本轮或近期上下文已有目标群，使用该群。
2. 如果没有目标群，查看最近会话：

```bash
wechat-cli sessions --limit 30
```

3. 根据活跃度、群名、用户线索选候选；不确定时询问用户选择。

## 输出任务类型

根据用户需求选择输出形式。

### 群聊概览

```markdown
## 群聊概览：{群名}

- 时间范围：
- 消息数量：
- 主要参与者：
- 核心话题：
```

### 工作总结

```markdown
## 工作总结：{群名}

### 今日/本期进展
- ...

### 关键讨论
- ...

### 决策/结论
- ...

### 待办事项
- [ ] ...

### 风险与阻塞
- ...

### 建议下一步
- ...
```

### 关键词检索报告

```markdown
## 微信关键词检索：{关键词}

### 命中范围
- 群/联系人：
- 时间：

### 关键命中
1. ...
2. ...

### 结论
- ...
```

### 成员/关系分析

```markdown
## 群成员信息：{群名}

- 群人数：
- 群主：
- 活跃成员：
- 备注/身份特征：
```

## 已验证示例，不是限制

以下只是历史成功案例，不代表只能查这些群。

### 示例群：Kunki | AI 提效变现学习

曾验证信息：

```text
群名：Kunki | AI 提效变现学习
username：47336328896@chatroom
群人数：222
群主：我是林kunki
```

可用命令：

```bash
wechat-cli history "Kunki | AI 提效变现学习" --limit 100 --format text
wechat-cli members "Kunki | AI 提效变现学习"
```

### 示例群：牛马AI用户群

曾搜索到：

```text
A17牛马AI用户群 — 44404962734@chatroom
A10牛马AI用户群 — 45378950205@chatroom
```

可用命令：

```bash
wechat-cli history "A17牛马AI用户群" --limit 100 --format text
wechat-cli history "A10牛马AI用户群" --limit 100 --format text
```

## 排错手册

### 1. `file is not a database`

先清缓存：

```bash
rm -rf /tmp/wechat_cli_cache
wechat-cli sessions --limit 3
```

如果仍失败，检查配置和 key：

```bash
cat ~/.wechat-cli/config.json
python3 - <<'PY'
import json, os
p=os.path.expanduser('~/.wechat-cli/all_keys.json')
print('exists', os.path.exists(p), p)
if os.path.exists(p):
    d=json.load(open(p))
    print('keys:', len(d))
    print(list(d)[:10])
PY
```

问题通常是：当前 `db_dir` 和 `all_keys.json` 的密钥不匹配。

### 2. init 显示“提取到 0 个密钥”

不要只看最后一行。先测试：

```bash
wechat-cli sessions --limit 3
```

如果能返回会话，说明实际可用。

### 3. `task_for_pid failed`

需要重新签名微信并重启微信，或重新执行：

```bash
sudo wechat-cli init --force
```

执行后：

```bash
rm -rf /tmp/wechat_cli_cache
wechat-cli sessions --limit 3
```

### 4. 权限问题

`~/.wechat-cli` 可能是 root 拥有：

```bash
ls -la ~/.wechat-cli
```

修改配置可能要用 `sudo tee`。

## 隐私与安全

- 仅读取 Kunki 本机微信数据。
- 不发送微信消息。
- 不修改微信数据库。
- 若用户要求导出，最终文件保存到 workspace：

```text
/Users/kunki/ObsidianVaults/领航知识库
```
