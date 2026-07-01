---
created: 2026-02-25
tags: [工具, Obsidian, Claudian, 安装教程]
---

# Obsidian + Claudian 插件完整安装教程（保姆级 · Windows）

> 本教程面向零基础学员，从 Obsidian 软件安装开始，一步步教你配置好 Claudian 插件，让 Claude AI 成为你笔记库里的智能助手。
>
> 📎 Claudian 官方仓库：https://github.com/YishenTu/claudian

---

## 目录

1. [安装 Obsidian](#一安装-obsidian)
2. [创建知识库（Vault）](#二创建知识库vault)
3. [Obsidian 基础设置](#三obsidian-基础设置)
4. [安装 Claude Code CLI（前置条件）](#四安装-claude-code-cli前置条件)
5. [安装 Claudian 插件](#五安装-claudian-插件到-obsidian)
6. [配置 Claudian](#六首次配置-claudian)
7. [常见问题](#七常见问题)
8. [参考资源](#八参考资源)

---

## 一、安装 Obsidian

### 1.1 下载 Obsidian

直接点击下面的链接下载（复制到浏览器地址栏回车即可）：

```
https://github.com/obsidianmd/obsidian-releases/releases/download/v1.11.7/Obsidian-1.11.7.exe
```

> 💡 如果 GitHub 下载慢，可以使用国内镜像：
> - 夸克网盘：https://pan.quark.cn/s/a996a3708b62
> - 123 网盘：https://www.123684.com/s/M5P0Vv-FKJ63（免费，不用付费）
>
> ⚠️ 上面直链是当前最新版 v1.11.7（2026年2月），如需最新版可访问官网下载页：https://obsidian.md/download

### 1.2 安装 Obsidian

1. 双击下载好的 `Obsidian-x.x.x.exe` 安装文件
2. 选择 **"仅为我安装"**（推荐）
3. **修改安装路径**：建议不要装在 C 盘，改到其他盘，例如 `D:\Tools\Obsidian`
4. 勾选 **"创建桌面快捷方式"**（如果有这个选项）
5. 点击 **"安装"**，等待安装完成
6. 安装完成后，桌面上会出现 Obsidian 的图标

### 1.3 系统要求

| 要求 | 说明 |
|------|------|
| 操作系统 | Windows 10 及以上（Win7 需要使用旧版 v1.1.16） |
| 磁盘空间 | 安装包约 100MB，运行时占用较小 |
| 其他 | 无特殊要求，普通电脑即可运行 |

---

## 二、创建知识库（Vault）

首次打开 Obsidian 时，会提示你创建或打开一个知识库。

### 2.1 什么是知识库？

知识库（Vault）就是一个普通的文件夹，你的所有笔记都存放在里面。Obsidian 不会上传你的文件到云端，所有数据都在你本地。

### 2.2 创建新知识库

1. 打开 Obsidian
2. 点击 **"新建知识库"**（Create new vault）
3. 输入知识库名称，例如：`我的笔记库`
4. 选择存放位置，建议放在非 C 盘的位置，例如：`D:\ObsidianVaults\我的笔记库`
5. 点击 **"创建"**

> ⚠️ **重要提示**：请记住你的知识库路径，后面安装 Claudian 插件时会用到。

### 2.3 知识库的文件结构

创建完成后，你的知识库文件夹里会有一个隐藏的 `.obsidian` 文件夹，这就是存放所有设置和插件的地方：

```
我的笔记库/
├── .obsidian/           ← 设置和插件（隐藏文件夹）
│   ├── plugins/         ← 插件安装目录
│   ├── themes/          ← 主题目录
│   └── ...
├── 你的笔记1.md
├── 你的笔记2.md
└── ...
```

> 💡 如果看不到 `.obsidian` 文件夹，需要在文件资源管理器中开启"显示隐藏文件"：
> 点击文件资源管理器顶部的 **"查看"** → 勾选 **"隐藏的项目"**

---

## 三、Obsidian 基础设置

### 3.1 设置中文界面

如果 Obsidian 打开后是英文界面：

1. 点击左下角的 **⚙️ 齿轮图标**（Settings）
2. 在左侧菜单找到 **"General"**（通用）→ **"Language"**（语言）
3. 选择 **"简体中文"**
4. 重启 Obsidian 即可生效

### 3.2 开启第三方插件

Claudian 是一个第三方插件，需要先开启第三方插件功能：

1. 点击左下角 **⚙️ 设置**
2. 左侧菜单找到 **"第三方插件"**（Community plugins）
3. 点击 **"关闭安全模式"**（Turn on community plugins）
4. 在弹出的确认对话框中点击 **"关闭安全模式"**

> 这一步非常重要！不开启的话无法安装任何第三方插件。

### 3.3 熟悉基本操作

| 操作 | 快捷键 |
|------|--------|
| 新建笔记 | `Ctrl + N` |
| 打开命令面板 | `Ctrl + P` |
| 打开设置 | `Ctrl + ,` |
| 快速切换笔记 | `Ctrl + O` |
| 打开文件列表 | 点击左侧边栏的文件图标 |

---

## 四、安装 Claude Code CLI（前置条件）

> Claudian 插件依赖本地安装的 Claude Code CLI 才能运行，这是必须的前置条件。

### 前置条件清单

| 条件 | 说明 |
|------|------|
| **Obsidian** | v1.8.9 或更高版本（桌面版） |
| **Claude Code CLI** | 必须先安装好（下面详细教） |
| **API 认证** | Claude 官方订阅/API，或第三方服务商（Openrouter、Kimi、GLM、DeepSeek 等） |
| **操作系统** | 仅支持桌面端：Windows / macOS / Linux |

---

### 方式 A：原生安装（推荐 ⭐）

> 原生安装不需要 Node.js 环境，是一个独立的可执行文件，官方最推荐的方式。

**第 1 步：通过 WinGet 安装**

按 `Win + X`，选择 **"终端(管理员)"** 或 **"PowerShell(管理员)"**，运行：

```powershell
winget install Anthropic.ClaudeCode
```

等待安装完成。

**第 2 步：配置 PATH 环境变量**

安装完成后，需要把 Claude 的路径加到系统 PATH 中，否则终端找不到 `claude` 命令。

参考路径：

```
C:\Users\你的用户名\.local\bin
```

操作步骤：

1. 按 `Win + S`，搜索 **"环境变量"**，点击 **"编辑系统环境变量"**
2. 点击右下角的 **"环境变量"** 按钮
3. 在 **"用户变量"** 区域找到 `Path`，双击打开
4. 点击 **"新建"**，粘贴路径：`C:\Users\你的用户名\.local\bin`（把"你的用户名"替换成你电脑的实际用户名）
5. 一路点 **"确定"** 保存
6. **关闭所有终端窗口**，重新打开一个新的

**第 3 步：验证安装**

打开新的 PowerShell，输入：

```powershell
claude --version
```

如果能看到版本号，说明安装成功。如果提示"找不到命令"，检查 PATH 配置是否正确。

---

### 方式 B：NPM 安装（旧方式，方式 A 不行再用）

> ⚠️ NPM 安装方式已被官方标记为弃用（deprecated），但仍可使用。

**前置要求：**

- 安装 Node.js 18+：从 https://nodejs.org 下载 LTS 版本，安装时一路"下一步"即可
- Windows 上需要安装 **WSL** 或 **Git for Windows**（Claude Code 无法在原生 CMD/PowerShell 中直接运行）

**安装命令（在 WSL 或 Git Bash 中运行）：**

```bash
npm install -g @anthropic-ai/claude-code
```

验证：

```bash
claude --version
```

---

### 配置 API Key

**情况一：使用 Claude 官方订阅（Pro / Max）**

首次运行 `claude` 命令会引导你登录，直接按提示操作即可，不需要手动配置。

**情况二：使用第三方 API 服务商（国内中转等）**

找到或新建以下文件：

```
C:\Users\你的用户名\.claude\settings.json
```

> 💡 如果 `.claude` 文件夹不存在，先在终端运行一次 `claude` 命令，它会自动创建这个文件夹。

用记事本打开 `settings.json`，写入以下内容：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "你的API服务商地址",
    "ANTHROPIC_API_KEY": "你的API密钥（sk-开头）"
  }
}
```

保存后，重新打开终端运行 `claude`，验证是否能正常对话。

---

## 五、安装 Claudian 插件到 Obsidian

有三种安装方式，推荐方式 A。

---

### 方式 A：通过 BRAT 安装（推荐 ⭐，支持自动更新）

> BRAT（Beta Reviewers Auto-update Tester）可以直接从 GitHub 安装未上架社区商店的插件，还能自动检查更新。

**第 1 步：安装 BRAT 插件**

1. 打开 Obsidian
2. 进入 **设置**（`Ctrl + ,`）→ **第三方插件** → 点击 **"浏览"**
3. 在搜索框中输入 **BRAT**
4. 找到 **"BRAT"** 插件，点击 **"安装"**
5. 安装完成后，点击 **"启用"**

**第 2 步：通过 BRAT 添加 Claudian**

1. 回到 **设置** → **第三方插件** → 找到 **BRAT** → 点击它右边的 ⚙️ 齿轮图标
2. 点击 **"Add Beta Plugin"** 按钮
3. 在弹出的输入框中输入：

```
YishenTu/claudian
```

4. 点击 **"Add Plugin"**
5. 等待下载完成（可能需要几秒到十几秒）

**第 3 步：启用 Claudian**

1. 回到 **设置** → **第三方插件**
2. 在已安装的插件列表中找到 **Claudian**
3. 打开右边的开关启用它

> 💡 BRAT 会自动检查更新并通知你有新版本可用，非常方便。

---

### 方式 B：手动安装（从 GitHub Release 下载）

**第 1 步：下载插件文件**

直接点击下面的链接逐一下载（复制到浏览器地址栏回车即可）：

```
https://github.com/YishenTu/claudian/releases/download/1.3.65/main.js
https://github.com/YishenTu/claudian/releases/download/1.3.65/manifest.json
https://github.com/YishenTu/claudian/releases/download/1.3.65/styles.css
```

> ⚠️ 上面链接是当前最新版 v1.3.65，如需更新版本可访问：https://github.com/YishenTu/claudian/releases/latest，在 Assets 区域下载对应文件。

**第 2 步：创建插件文件夹**

打开你的知识库所在的文件夹，进入 `.obsidian/plugins/` 目录，新建一个名为 `claudian` 的文件夹。

完整路径示例：

```
D:\ObsidianVaults\我的笔记库\.obsidian\plugins\claudian\
```

**第 3 步：放入文件**

把下载的 3 个文件复制到 `claudian` 文件夹中：

```
claudian/
├── main.js
├── manifest.json
└── styles.css
```

> ⚠️ **注意**：文件夹名称必须是 **`claudian`**（全小写），和 `manifest.json` 里的 `id` 字段一致，否则 Obsidian 识别不到。

**第 4 步：启用插件**

1. 完全关闭 Obsidian，重新打开
2. 进入 **设置** → **第三方插件** → 找到 **Claudian** → 打开开关

---

### 方式 C：从源码编译安装（开发者用）

需要安装 Node.js 和 Git：

```bash
cd /你的知识库路径/.obsidian/plugins
git clone https://github.com/YishenTu/claudian.git
cd claudian
npm install
npm run build
```

然后在 Obsidian 中启用插件即可。

---

## 六、首次配置 Claudian

### 6.1 配置 Claude Code 路径

打开 PowerShell，运行以下命令查看 Claude Code 的安装路径：

```powershell
where claude
```

复制返回的路径（例如 `C:\Users\你的用户名\.local\bin\claude`）。

然后在 Obsidian 中：

1. 进入 **设置** → 左侧菜单找到 **Claudian**
2. 在 **Claude CLI path** 输入框中粘贴这个路径
3. 保存设置

> 💡 如果 `claude` 已经在系统 PATH 中，这一步可能可以跳过，Claudian 会自动发现。

### 6.1.1 ⚠️ 自定义环境变量（Environment Variables）必须留空

Claudian 设置页里有一个 **"Environment Variables"**（自定义环境变量）输入区域。

**重要：如果你用的是 Claude 官方订阅（Pro / Max），这里必须保持完全空白，不要填任何内容。**

原因：如果这里填了 `ANTHROPIC_API_KEY`、`ANTHROPIC_BASE_URL` 等变量（哪怕值是空的），Claudian 会用这些空值覆盖掉 Claude Code 的正常登录认证，导致报 401 认证错误。

正确做法：

- 打开 Claudian 设置，找到 Environment Variables 区域
- 确认里面是空的，一行都没有
- 如果有残留内容，全部删掉，保存

只有在使用**第三方 API 服务商**时，才需要在这里填入对应的 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_API_KEY`。

### 6.2 选择权限模式

在 Claudian 设置中可以切换权限模式：

| 模式 | 说明 | 适合谁 |
|------|------|--------|
| **YOLO** | 所有操作自动批准，不需要确认 | 信任 AI、追求效率的用户 |
| **Safe** | 每个工具调用都需要你手动审批 | 新手，想控制每一步 |

> 建议新手先用 **Safe 模式**，熟悉后再切换到 YOLO。

### 6.3 开始使用

安装配置完成后：

1. 打开任意笔记
2. 左侧边栏会出现一个 **🤖 机器人图标**，点击它打开 Claudian 聊天面板
3. 也可以按 `Ctrl + P` 打开命令面板，搜索 `Claudian: Open Chat`
4. 在聊天框中输入你的指令，例如："帮我总结当前笔记的要点"

**一些实用功能：**

- 输入 `@` 可以引用库中的其他文件
- 输入 `/` 可以使用斜杠命令
- 拖拽图片到聊天框可以让 Claude 分析图片
- 选中笔记中的文字，可以让 Claude 进行内联编辑

---

## 七、常见问题

**Q1：Obsidian 打开后是英文怎么办？**
设置 → General → Language → 选择 "简体中文" → 重启 Obsidian。

**Q2：看不到 .obsidian 文件夹？**
这是隐藏文件夹。在文件资源管理器中，点击顶部 **"查看"** → 勾选 **"隐藏的项目"** 即可看到。

**Q3：启用第三方插件后看不到 Claudian？**
尝试完全关闭 Obsidian 再重新打开。如果还是看不到，检查插件文件夹名称是否正确（必须是小写的 `claudian`）。

**Q4：提示 Claude Code CLI 找不到？**
确认 `claude` 命令在终端中可用（运行 `claude --version`）。如果可用但 Claudian 找不到，在 Claudian 设置中手动填写 Claude Code 的完整路径。

**Q5：API 报 429 余额不足错误？**
这说明你的 API 服务商账户余额不够了。登录你的 API 服务商后台充值，或者更换 API Key。

**Q6：能用国内的大模型替代吗？**
可以。Claudian 支持任何兼容 Anthropic API 格式的服务商，包括 Openrouter、Kimi（Moonshot）、GLM、DeepSeek 等。在 `settings.json` 中配置对应的 `ANTHROPIC_BASE_URL` 即可。

**Q7：如何更新 Claudian？**
- **BRAT 安装**：自动检查更新，收到通知后点击更新即可
- **手动安装**：重新去 GitHub Release 下载最新的 3 个文件，替换旧文件，重启 Obsidian

**Q8：Obsidian 官网打不开 / 下载慢？**
可以使用国内镜像下载，见上方 [1.1 下载 Obsidian](#11-下载-obsidian) 中的备用下载链接。

---

## 八、参考资源

| 资源 | 链接 |
|------|------|
| **Obsidian 官网下载** | https://obsidian.md/download |
| **Obsidian 中文帮助文档** | https://publish.obsidian.md/help-zh |
| **Claudian 官方仓库** | https://github.com/YishenTu/claudian |
| **Claudian 最新 Release** | https://github.com/YishenTu/claudian/releases/latest |
| **Claude Code 官方安装文档** | https://code.claude.com/docs/zh-CN/setup |
| **Claude Code 原生安装说明（知乎）** | https://zhuanlan.zhihu.com/p/1971897655538979982 |
| **WenHaoFree 安装配置指南** | https://blog.wenhaofree.com/en/posts/articles/obsidian-claudian-integration-guide/ |
| **菜鸟教程：Obsidian + Claude Code** | https://www.runoob.com/markdown/obsidian-claude-code.html |
| **Obsidian 新手避坑指南（腾讯云）** | https://cloud.tencent.com/developer/article/2500558 |

---

> 📝 本教程最后更新：2026 年 2 月
