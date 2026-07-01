【学员版】工具安装手册（Mac）

> 📌 这份手册适合 **Mac 电脑**的学员。Windows 用户请看《学员版工具安装手册（Windows）》。

---

## ⚡ 一键安装（推荐）

交付包里有个 `【Mac专用】一键安装.sh`，能自动完成所有工具安装。

### 操作步骤

1. **打开终端**：按 `Command + 空格` → 输入「终端」或「Terminal」→ 回车
2. **进入交付包文件夹**：把交付包文件夹从 Finder **直接拖进终端窗口**，前面加上 `cd `（cd 后面有个空格），回车。比如：
   ```
   cd /Users/你的用户名/Downloads/999课程安装包
   ```
3. **运行脚本**：复制下面这行粘贴到终端，回车：
   ```bash
   chmod +x 【Mac专用】一键安装.sh && ./【Mac专用】一键安装.sh
   ```
4. **按回车开始**：脚本会显示安装清单，按回车开始
5. **等待安装**：脚本会依次安装 Homebrew、Obsidian、Claude Code、Node.js、6个插件，并导入知识库模板，全程约 5-10 分钟，**保持网络连接和梯子**
6. **选择知识库位置**：脚本会问你把知识库放哪里，直接**按回车**选默认即可
7. **看到 ✅ 安装全部完成 就成功了**

【本地截图①：【Mac专用】一键安装.sh 运行完成后显示「✅ 安装全部完成」的终端界面】

### 安装完成后（4 步手动操作）

1. **打开 Obsidian** → 首次打开会出现欢迎界面 → 点击左下角 **「打开」** 按钮 → 选 **「打开文件夹作为仓库」** → 找到脚本最后显示的知识库路径（比如 `~/Documents/我的知识库`）→ 点「选择文件夹」。**⚠️ 注意：不要选安装包里的 vault 文件夹，要选脚本提示的路径。** 如果不是首次打开（没有欢迎界面），点左下角保险柜图标 → 「打开文件夹作为仓库」
2. **设置中文**：如果界面是英文 → 左下角 ⚙️ 设置 → General → Language → 简体中文 → 重启
3. **启用插件**：设置 → 第三方插件 → 关闭安全模式 → 在「已安装插件」列表中逐个打开所有插件的开关（Claudian、Nano Banana、Web Clipper、BRAT）
4. **配置 API + AI 兜底检查**：先按下面「二、安装 Claudian 插件」的「四）开通 AI 服务」和「五）配置 Claudian」完成 API 配置，**配好后**在 Claudian 聊天框说「帮我安装」，AI 会扫描你的整个环境，告诉你哪些没装好、下一步该做什么

### 常见问题

- **提示「权限不够」？** 在终端输入 `chmod +x 【Mac专用】一键安装.sh` 回车，再重新运行
- **Homebrew 安装很慢？** 正常现象，Homebrew 首次安装需要下载较多文件，耐心等待
- **某一步安装失败？** 不影响其他步骤，脚本会继续跑完。失败的部分参照下面的手动安装步骤补装即可

> ❌ **完全跑不起来？** 没关系，往下看手动安装步骤，一步步来也很简单。

---

## 安装总览（手动安装）

你需要安装以下工具，**按顺序来**：

| 顺序 | 工具 | 用途 | 大约时间 |
|------|------|------|---------|
| 1 | **Obsidian** | 知识库主程序 | 5 分钟 |
| 2 | **Claudian 插件** | 让 Claude AI 住进知识库 | 15 分钟 |
| 3 | **Nano Banana 插件** | AI 自动生成手绘配图 | 5 分钟 |
| 4 | **Video Forge 插件** ⏸️ | AI 自动生成短视频（暂缓，先跳过） | — |
| 5 | **Web Clipper 插件** | 一键截图网页 | 5 分钟 |
| 6 | **导入知识库模板** | 导入文件夹结构 + AI 技能 | 5 分钟 |

---

# 一、安装 Obsidian

Obsidian 是你的知识库主程序，所有工具都运行在它里面。

## 一）下载安装包

打开 https://obsidian.md/download ，点击 **Download for macOS** 下载最新版。

> 💡 **GitHub 下载慢？** 用国内镜像：
> - 夸克网盘：https://pan.quark.cn/s/a996a3708b62
> - 123 网盘：https://www.123684.com/s/M5P0Vv-FKJ63（免费）

## 二）安装软件

1. 双击下载好的 `.dmg` 文件
2. 把 Obsidian 图标拖到 **Applications（应用程序）** 文件夹
3. 打开启动台（Launchpad），找到 Obsidian，点击打开

> ⚠️ 首次打开可能提示"无法验证开发者"，点击 **系统设置** → **隐私与安全性** → 找到 Obsidian，点 **"仍要打开"**。

【本地截图②：Mac 安装 Obsidian，将图标拖入 Applications 文件夹的界面】

## 三）创建知识库

首次打开 Obsidian 会提示你创建知识库：

1. 点击 **"新建知识库"**
2. 名称随便填，例如：`我的笔记库`
3. 位置选一个你找得到的地方，例如桌面或文稿文件夹
4. 点击 **"创建"**

> ⚠️ **记住知识库的位置**，后面装插件时会用到。

【本地截图③：Obsidian 新建知识库界面，展示名称输入框和位置选择按钮】

## 四）基础设置

**1）设置中文界面**（如果打开后是英文）

点击左下角 **⚙️ 设置** → **General** → **Language** → 选 **简体中文** → 重启 Obsidian

**2）开启第三方插件**（必须做，后面装插件都靠这个）

点击左下角 ⚙️ **设置** → **第三方插件** → **"关闭安全模式"** → 在弹出框再次确认

> ✅ 完成后页面出现"已安装插件"区域，说明成功了。

---

# 二、安装 Claudian 插件

Claudian 是让 Claude AI 住进 Obsidian 的核心插件。分两步：先装 Claude Code CLI，再装插件本体。

## 一）安装 Claude Code CLI

打开 **终端（Terminal）**：

> 按 `Command + 空格` 搜索"终端"，或在启动台里找到它

> ⚠️ **必须先开梯子（科学上网/VPN）！** Claude 是海外服务，国内网络直接访问会被拦截，安装脚本下载不下来。打开你的代理工具（如 Clash Verge、V2Ray 等），确认连接成功后再执行下面的命令。
>
> 💡 **梯子开了还是报错？** 很多代理工具默认只代理浏览器，终端不走代理。需要先在终端里执行以下两行（端口号换成你代理工具里显示的，一般是 7890）：
> ```
> export https_proxy=http://127.0.0.1:7890
> export http_proxy=http://127.0.0.1:7890
> ```
> 端口号在哪看：打开你的代理工具，在设置里找「HTTP 端口」或「混合端口」（常见端口：Clash 系列一般是 7890，V2Ray 一般是 10809，具体看你自己的工具设置）。

在终端中粘贴以下命令，回车执行：

```bash
curl -fsSL https://claude.ai/install.sh | sh
```

等待安装完成。安装过程中可能会提示输入 Mac 开机密码，输入即可（输入时屏幕不会显示字符，这是正常的）。

【本地截图④：Mac 终端窗口，显示安装命令正在执行】

## 二）验证 Claude Code 安装成功

安装完成后，在终端输入：

```bash
claude --version
```

看到版本号（例如 `1.x.x`）说明安装成功。

> ❌ 提示"找不到命令"？关闭终端，重新打开一个，再试一次。如果还是不行，重启 Mac 后再试。

## 三）安装 Claudian 插件（BRAT 方式）

**1）先安装 BRAT（插件安装器）**

1. 打开 Obsidian → **设置** → **第三方插件** → 点击 **"浏览"**
2. 搜索 `BRAT`，找到后点 **"安装"**，再点 **"启用"**

**2）用 BRAT 安装 Claudian**

1. **设置** → **第三方插件** → 找到 **BRAT** → 点旁边的 ⚙️ 图标
2. 点击 **"Add Beta Plugin"**，在输入框填入：

```
YishenTu/claudian
```

3. 点 **"Add Plugin"**，等待下载完成
4. 回到插件列表找到 **Claudian**，打开右边的开关启用

【本地截图⑤：BRAT 插件设置页面，Add Beta Plugin 对话框，输入了 YishenTu/claudian】

## 四）开通 AI 服务（二选一）

Claudian 需要接入 AI 才能使用，有两种方案：

| 方案                  | 费用                     | 特点                                                      |
| ------------------- | ---------------------- | ------------------------------------------------------- |
| **Claude 官方订阅**（推荐） | Max 月付（[闲鱼代充](https://m.tb.cn/h.idJgFWj?tk=lzJ6UvfqU0q)） | 效果最好，一次订阅全部模型无限用 |
| **第三方 API**         | 按量付费，费用更低              | 推荐 [openclaw-api.com](https://openclaw-api.com)，课程里会教配置方法 |

> 💡 **不知道选哪个？** 预算充足、想要最强效果 → 选方案A（Claude Max，闲鱼代充约 ¥785/月）；想先少花钱试试 → 选方案B（API按量付费，¥20 起步能用很久）。两种方案随时可以切换。

## 五）配置 Claudian

**1）填入 Claude Code 路径**

1. 打开终端，输入：

```bash
which claude
```

复制返回的路径（例如 `/usr/local/bin/claude`）。

2. Obsidian **设置** → **Claudian** → 在 **Claude CLI path** 粘贴路径 → 保存

**2）检查 Environment Variables（重要！）**

在 Claudian 设置页面找到 **Environment Variables** 区域：

**方案A：使用 Claude 官方订阅（Max 月付）**

Environment Variables 区域必须**完全空白**，一行都不填。保存后关闭设置。

然后需要在终端里完成一次 Claude Code 登录：

1. 打开终端（启动台 → 搜索"终端" → 打开）
2. 输入 `claude` 回车
3. 屏幕会提示你选择登录方式，选 **「Claude account with subscription」**（带订阅的 Claude 账号）
4. 浏览器会自动弹开一个授权页面，**直接点 Authorize（授权）** 即可
5. 授权后浏览器可能显示「localhost 连接被拒绝」或空白页——**这是正常的**，直接关掉浏览器页面
6. 回到终端，顶部应该显示类似 `Claude Code v2.x.x · Sonnet · Claude Max`，看到 **Claude Pro** 或 **Claude Max** 字样就说明登录成功
7. 输入 `/exit` 退出
8. **重启 Obsidian**（Cmd+Q 完全退出，再重新打开），然后在 Claudian 聊天框随便说句话测试

> ⚠️ **Claudian 报 403 错误？** 说明 Obsidian 没找到你本地的 Claude Code，按以下步骤排查：
> 1. 打开终端，输入 `which claude`，复制输出的路径（如 `/usr/local/bin/claude`）
> 2. 回到 Obsidian → 设置 → Claudian → 往下找到 **「Claude Code Path」**
> 3. 把刚才复制的路径粘贴进去，保存
> 4. 再次 Cmd+Q 完全退出 Obsidian 并重新打开，重试

> ⚠️ **以后如果需要重新登录**（比如换了账号），在 Claude Code 里输入 `/login` 即可重新走一遍上面的流程。

> 💡 **还没有 Claude 账号？** 先去闲鱼搜「Claude Max 代充」购买（[闲鱼链接](https://m.tb.cn/h.idJgFWj?tk=lzJ6UvfqU0q)），卖家会帮你开通好账号。拿到账号密码后，再回来执行上面的登录步骤。

**方案B：使用第三方 API（按量付费，更便宜）**

推荐 [openclaw-api.com](https://openclaw-api.com)，按量计费，用多少扣多少，新手建议充 ¥20（约 $60 额度）先体验。

**第一步：注册账号**

1. 浏览器打开 [https://openclaw-api.com/pricing](https://openclaw-api.com/pricing)
2. 页面底部找到 **「没有账户？注册」**，点击「注册」
3. 填写：**用户名**（随便起）、**密码**（8-20位）、**确认密码**
4. 点击橙色 **「注册」** 按钮，注册成功后自动跳到登录页
5. 输入刚才的用户名和密码，点 **「继续」** 登录

**第二步：充值**

1. 登录后，左侧菜单点 **「钱包管理」**
2. 页面显示「充值套餐」，有 $30/¥10、$60/¥20、$150/¥50 等多档
3. 新手建议先选 **$60（¥20）** 或 **$150（¥50）**，不够再买
4. 选好套餐后，底部选择 **「支付宝」** 付款
5. 弹出「充值确认」窗口，确认金额后点 **「确定」**，用支付宝扫码完成支付

**第三步：创建 API Key**

1. 左侧菜单点 **「令牌管理」**
2. 右上角点橙色按钮 **「+ 创建新令牌」**
3. 弹出窗口中：
   - **名称**：随便填，建议用日期命名（如 `20260310`）
   - **过期时间**：选 **「永不过期」**（默认就是）
   - **无限制额度**：保持开启（绿色开关）
4. 点 **「提交」**
5. 回到令牌列表，找到刚创建的令牌，**密钥** 列显示 `sk-Z857**********xDys` 这样的格式
6. 点密钥旁边的 **📋 复制按钮**，把完整的 Key 复制下来

> ⚠️ **Key 只显示一次缩略版**，但可以随时点复制按钮拿到完整值。如果复制不了就删掉重新创建一个。

**第四步：填入 Claudian 设置**

1. 回到 Obsidian，打开 **设置** → 左侧找到 **Claudian**
2. 往下滚到 **「环境」** 标签页，找到 **「自定义变量」**（Environment Variables）区域
3. 在文本框中 **逐行填入**（每行一个，格式为 `变量名=值`）：

```
ANTHROPIC_API_KEY=sk-你刚才复制的完整Key
ANTHROPIC_BASE_URL=https://openclaw-api.com
ANTHROPIC_MODEL=claude-opus-4-6
```

4. 填完后关闭设置窗口
5. 在 Claudian 聊天面板发一句话（比如"你好"），能收到回复就配置成功 ✅

> ⚠️ **常见错误**：
> - 填了官方订阅又填了 API Key → 冲突，报 401 错误。二选一，不能同时填
> - API Key 复制时多了空格或换行 → 粘贴后检查一下，删掉首尾空格
> - `ANTHROPIC_BASE_URL` 这里填 `https://openclaw-api.com`，**不需要** 加 `/v1`
> - `ANTHROPIC_MODEL` 可以不填，不填时使用默认模型；填了就会固定使用你指定的模型

## 六）验证 Claudian 安装成功

打开任意笔记，左侧边栏出现 **🤖 图标**，点击能打开聊天面板，说明装好了。

---

## 七）添加浏览器控制能力（Playwright MCP）

这一步让 Claudian 能帮你**自动操作浏览器**——打开网页、搜索信息、截图、采集数据，是很多高级技能的基础。

**1）确认 Node.js 已安装**

打开终端（Terminal），输入：

```
node -v
```

看到 `v18.x.x` 或更高版本号 → 直接下一步。

> ❌ 显示"command not found"？说明 Node.js 没装好。
> - 用了一键安装脚本的话，关闭终端重新打开再试
> - 还是不行，去 https://nodejs.org 下载安装 LTS 版本

**2）添加 Playwright MCP**

终端里输入这一行（整行复制粘贴）：

```
claude mcp add playwright -s user -- npx @playwright/mcp@latest
```

回车，看到成功提示即可。

**3）重启 Obsidian 并确认启用**

关掉 Obsidian，重新打开，然后去 **设置 → Claudian → 往下找到 MCP 服务器**，确认 `playwright` 那行的**眼睛图标是开启状态**（点一下即可切换）。

**4）验证**

在 Claudian 聊天框试试说：「帮我打开 baidu.com」或「截一张当前页面的图」。AI 能自动打开浏览器操作，就说明成功了。

> 💡 **这能干嘛？** 比如让 AI 帮你自动采集小红书数据、打开公众号后台发文、截图网页内容等。后续课程会详细教。

---

# 三、安装 Nano Banana 插件

Nano Banana 可以根据你的文案，自动生成手绘风格配图，一键出图。

> 📦 **用了一键安装脚本？** 这些插件已经自动装好了，直接跳到「启用插件」和「配置 API Key」步骤即可。下面的「复制插件文件夹」是给手动安装的同学看的。

## 一）找到 .obsidian 文件夹

你的知识库文件夹里有一个隐藏的 `.obsidian` 文件夹，Mac 默认不显示隐藏文件。

打开 **Finder**，进入你的知识库文件夹，按快捷键：

```
Command + Shift + .（句号）
```

隐藏文件就显示出来了。进入 `.obsidian` → `plugins` 文件夹。

> 💡 用完后可以再按一次 `Command + Shift + .` 把隐藏文件收起来。

## 二）复制插件文件夹

你拿到的插件文件里有一个叫 `nano-banana-image-generator` 的文件夹，把它整个复制到：

```
你的知识库路径/.obsidian/plugins/
```

【本地截图⑥：Mac Finder，展示 .obsidian/plugins/ 目录下的 nano-banana-image-generator 文件夹】

## 三）启用插件

1. 完全退出 Obsidian（菜单栏 → Obsidian → 退出），重新打开
2. **设置** → **第三方插件**，找到 **Nano Banana 🍌 手绘信息图生成器**，打开开关

## 四）配置 API Key

Nano Banana 需要一个 Gemini API Key 才能生成图片。这里推荐用第三方平台 **12API**（和 Claudian 的 openclaw-api 是不同平台，注意区分）。

**第一步：注册 12API 账号**

1. 浏览器打开 [https://cdn.12ai.org/](https://cdn.12ai.org/)
2. 页面底部找到 **「没有账户？注册」**，点击「注册」
3. 填写用户名或邮箱、密码，点击注册
4. 注册成功后登录

**第二步：充值**

1. 登录后，左侧菜单点 **「钱包管理」**
2. 页面显示「账户充值」，有 10¥、20¥、50¥、100¥ 等多档（1$ = 1¥）
3. 新手建议先充 **10¥** 体验，Nano Banana 生图消耗很少
4. 选择 **「支付宝」** 或 **「微信」** 付款，完成支付

**第三步：创建 API Key**

1. 左侧菜单点 **「令牌管理」**
2. 点 **「添加令牌」**
3. 弹出窗口中：
   - **名称**：随便填（如 `20260310`）
   - **令牌分组**：选 **「default - 默认(全模型推荐)」**，1x 倍率最划算
4. 点 **「提交」**
5. 回到令牌列表，找到刚创建的令牌，点密钥旁边的 **📋 复制按钮** 复制完整 Key

> Key 格式类似 `sk-EH0D**********BfGi`，以 `sk-` 开头。

**第四步：填入 Nano Banana 设置**

1. Obsidian **设置** → 左侧找到 **Nano Banana**
2. 找到 **Google Gemini API Key** 输入框，粘贴你刚复制的 Key
3. 找到 **自定义 API 地址** 输入框，填入：`https://cdn.12ai.org`
4. 关闭设置

## 五）验证安装成功

左侧边栏出现 **🍌 图标**，说明安装成功。打开任意笔记，点击 🍌 图标尝试生成一张图，能出图就配置成功 ✅

---

# 四、安装 Video Forge 插件

> ⏸️ **本插件暂未随安装包发放，目前请跳过整个第四章。** 插件正在做稳定性测试，通过后会在群里统一发放，届时再回来按步骤安装。

Video Forge 可以根据你的文案，自动生成短视频（带配音和字幕）。

> 📦 **用了一键安装脚本？** 插件文件和 Node.js 已经自动装好了，直接跳到「启用插件」和「配置 API Keys」步骤即可。但 **Remotion 依赖** 和 **API Keys** 仍需手动配置。

## 一）安装 Node.js（前置条件）

Video Forge 依赖 Node.js 才能运行，先装这个。

1. 打开 https://nodejs.org，点左边绿色 **LTS** 按钮下载（下载 `.pkg` 文件）
2. 双击安装，一路 **"继续"** 即可
3. 打开终端，输入 `node -v`，看到版本号说明装好了

【截图①：https://nodejs.org/en/download，Node.js 官网下载页面，绿色 LTS 下载按钮】

## 二）复制插件文件夹

你拿到的插件文件里有一个叫 `video-forge` 的文件夹，把它整个复制到：

```
你的知识库路径/.obsidian/plugins/
```

> 💡 找不到 `.obsidian` 文件夹？在 Finder 中按 `Command + Shift + .` 显示隐藏文件。

## 三）启用插件

1. 完全退出 Obsidian，重新打开
2. **设置** → **第三方插件**，找到 **Video Forge 🎬 视频锻造**，打开开关

## 四）安装 Remotion 依赖

`video-forge` 文件夹里已经自带了 Remotion 项目，只需要安装一下依赖包。

1. 打开终端
2. 输入以下命令（把"你的知识库路径"替换成你实际的路径）：

```bash
cd "你的知识库路径/.obsidian/plugins/video-forge/remotion-project"
npm config set registry https://registry.npmmirror.com
npm install
```

3. 等待安装完成（3–5 分钟，取决于网速），看到没有红色报错就说明成功了

> 💡 Remotion 只需装一次，以后每次生成视频都会复用。

## 五）安装本地 Whisper 字幕服务

Video Forge 使用本地 Whisper 生成字幕（免费，Apple Silicon 加速），需要安装 Python 环境和依赖。

**1）安装 Python**

Mac 自带的 Python 版本太旧，建议用 Homebrew 安装：

```bash
brew install python@3.11
```

> 💡 没装 Homebrew？先执行：`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

安装完输入 `python3 --version`，看到版本号说明装好了。

**2）安装 Whisper 依赖**

在终端中执行：

```bash
pip3 install flask faster-whisper
```

**3）设置开机自启**

让 Whisper 服务每次开机自动后台运行：

1. 在终端中执行以下命令（把"你的知识库路径"替换成实际路径）：

```bash
# 创建启动脚本
cat > ~/Library/LaunchAgents/com.videoforge.whisper.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.videoforge.whisper</string>
    <key>ProgramArguments</key>
    <array>
        <string>python3</string>
        <string>你的知识库路径/VideoForge/whisper-server.py</string>
        <string>--preload</string>
    </array>
    <key>WorkingDirectory</key>
    <string>你的知识库路径/VideoForge</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF
```

> ⚠️ 把命令中两处 `你的知识库路径` 替换成实际路径，比如 `/Users/yourname/ObsidianVaults/MyVault`

2. 加载服务：

```bash
launchctl load ~/Library/LaunchAgents/com.videoforge.whisper.plist
```

> 💡 首次启动会自动下载模型（约 3GB），需要等几分钟。以后开机会自动启动，不用再管。

**4）验证 Whisper 服务**

打开一个新终端窗口，执行：

```bash
curl http://localhost:5111/health
```

看到 `{"status":"ok"}` 说明服务正常运行。

## 六）配置 API Keys

**1）MiniMax API Key + 音色 ID**（配音用，必填）

1. 打开 https://platform.minimaxi.com，注册账号
2. 登录后进入控制台，左侧菜单找「API Keys」，创建并复制 Key
3. 在 Video Forge 设置中填入 MiniMax API Key、Group ID 和音色 ID

> 💡 MiniMax 新用户有免费额度，语音合成质量高、中文效果好。

**2）fal.ai API Key**（备选字幕引擎，可跳过）

> 默认用本地 Whisper 就够了。如果本地 Whisper 安装有问题，可以改用 fal.ai 云端生成。

1. 打开 https://fal.ai，注册账号（支持 Google 登录）
2. 登录后点右上角头像 → **Dashboard** → 左侧菜单找 **Keys**
3. 点 **"Create Key"**，复制生成的 Key

> 💡 新用户有免费额度，一个 2 分钟视频大约 ¥0.01。

**填入设置：**

打开 Obsidian **设置** → **Video Forge**，填入：
- TTS 引擎默认已选 **MiniMax**，填入 MiniMax API Key、Group ID 和音色 ID
- （可选）如需云端字幕，STT 引擎切换为 **fal.ai**，填入 fal.ai API Key

## 七）验证安装成功

左侧边栏出现 **🎬 图标**，说明安装成功。

---

# 五、安装 Web Clipper 插件

Web Clipper 可以自动截取网页截图，在你写文案时一键完成配图。

> 📦 **用了一键安装脚本？** 插件已经自动装好了，直接跳到「启用插件」即可。

## 一）复制插件文件夹

你拿到的插件文件里有一个叫 `web-clipper-obsidian-plugin` 的文件夹，把它整个复制到：

```
你的知识库路径/.obsidian/plugins/
```

## 二）启用插件

1. 完全退出 Obsidian，重新打开
2. **设置** → **第三方插件**，找到 **Web Clipper 📸 网页截图助手**，打开开关

## 三）验证安装成功

左侧边栏出现 **📷 图标**，说明安装成功。插件默认使用本地截图引擎，**无需额外配置 API Key**，开箱即用。

---

# 六、导入知识库模板

知识库模板包含两样东西：**完整的文件夹结构**（让 AI 知道去哪里找你的信息）和 **AI Skills**（AI 的工作手册）。

> 📦 **用了一键安装脚本？** 模板已经自动导入到知识库了，直接跳到「验证 Skills 加载成功」确认即可。

## 一）解压模板包

你拿到的插件文件里有一个叫 `AI内容创作系统-学员版.zip` 的文件，双击解压。

解压后你会看到以下文件夹和文件：

```
.claude/          ← AI 配置文件夹（含 AI Skills）
01.用户画像/
02.文案结构/
03.选题决策/
04.我的上下文/
05.开篇模板/
07.发布文案/
08.数据反馈/
09.经验沉淀/
README.md
```

## 二）复制到知识库根目录

**全选所有文件和文件夹**（Command + A），复制粘贴到你的 Obsidian 知识库根目录：

```
/Users/你的用户名/Documents/我的笔记库/        ← 直接放这里
```

> ⚠️ **放的位置非常重要！** 必须放在知识库**根目录**，不能多套一层文件夹：
>
> ❌ 错误：`我的笔记库/AI内容创作系统-学员版/01.用户画像/`
>
> ✅ 正确：`我的笔记库/01.用户画像/`

> 💡 **看不到 `.claude` 文件夹？** 它以点开头，默认隐藏。在 Finder 里按 `Command + Shift + .` 显示隐藏文件，就能看到了。复制时记得把它也一起选上。

【本地截图⑦：Mac Finder，展示知识库根目录下的 .claude 文件夹和 01.用户画像 等文件夹并列排列】

## 三）重启 Obsidian

复制完后，完全退出 Obsidian（菜单栏 → **Obsidian** → **退出 Obsidian**），重新打开，左侧文件列表里就能看到所有文件夹。

## 四）验证 Skills 加载成功

打开 Claudian 聊天面板（点左侧 🤖 图标），试试说：**「帮我写篇公众号爆款」**

AI 能识别并启动对应技能，说明 Skills 加载成功。

---

# 安装完成！

所有工具装好后，你的知识库文件夹结构大概长这样：

```
你的知识库/
├── .obsidian/
│   └── plugins/
│       ├── claudian/                        ← AI 助手
│       ├── nano-banana-image-generator/     ← 手绘配图
│       ├── video-forge/                     ← 视频生成
│       └── web-clipper-obsidian-plugin/     ← 网页截图
├── .claude/
│   ├── CLAUDE.md                            ← AI 配置
│   └── skills/                              ← AI 技能
├── 01.用户画像/
├── 02.文案结构/                              ← 各类文案框架
├── 03.选题决策/
├── 04.我的上下文/                            ← 你的个人信息
├── 05.开篇模板/
├── 07.发布文案/
├── 08.数据反馈/
└── 09.经验沉淀/
```

---

# 常见问题

**Q：打开 Obsidian 提示"无法验证开发者"？**
点击 **系统设置** → **隐私与安全性**，找到 Obsidian，点 **"仍要打开"**。

**Q：找不到 `.obsidian` 文件夹？**
在 Finder 中进入知识库文件夹，按 `Command + Shift + .` 显示隐藏文件。

**Q：安装 Claude Code 时跳转到 `app-unavailable-in-region` 页面？**
说明没开梯子，或者梯子开了但终端没走代理（浏览器能上谷歌不代表终端也能）。解决方法：
1. 先确认梯子已打开并连接成功
2. 在终端里**依次粘贴执行**以下两行（每行粘贴后按回车）：
   - `export https_proxy=http://127.0.0.1:7890`
   - `export http_proxy=http://127.0.0.1:7890`
3. 然后再重新执行安装命令

其中 `7890` 是端口号，不同代理工具端口不同（Clash 系列一般 7890，V2Ray 一般 10809），打开你的代理工具在设置里找「HTTP 端口」或「混合端口」确认。**整个安装和登录过程都要保持梯子开着。**

**Q：`claude --version` 提示找不到命令？**
关闭终端，重新打开再试。如果还是不行，重启 Mac。

**Q：Claudian 报 401 错误？**
Claudian 设置 → Environment Variables 区域是否有内容？如果用官方订阅，这里必须留空。

**Q：插件启用后左侧没有图标？**
完全退出 Obsidian（菜单栏 → Obsidian → 退出），重新打开，再去设置里确认插件已启用。

**Q：Node.js 装了但 `node -v` 找不到命令？**
关闭终端，重新打开一个，再试一次。

**Q：`npm install` 卡住不动？**
可能是网络问题。开启全局代理后再试，或者等几分钟，有时只是慢。

**Q：梯子开着但脚本提示 "no local proxy detected" 或下载失败？**
梯子默认只代理浏览器，终端不会自动走代理。需要手动设置：
1. 打开你的梯子软件，找到**本地HTTP端口号**（一般在设置里，比如 ClashX 默认是 7890）
2. 在终端里输入以下三行（把 7890 换成你的端口号）：
   ```
   export HTTPS_PROXY=http://127.0.0.1:7890
   export HTTP_PROXY=http://127.0.0.1:7890
   export ALL_PROXY=http://127.0.0.1:7890
   ```
3. 在同一个终端窗口里重新跑安装命令或脚本

**Q：BRAT 下载 Claudian 失败？**
需要能访问 GitHub。如果下载超时，开启代理后再试。或者改用手动安装方式：去 https://github.com/YishenTu/claudian/releases/latest 下载 `main.js`、`manifest.json`、`styles.css` 三个文件，放到 `.obsidian/plugins/claudian/` 文件夹里。

【截图⑤：https://github.com/YishenTu/claudian/releases/latest，Claudian GitHub Releases 页面，下载三个文件】

---

> 📝 安装遇到问题？装好 Claudian 后直接在聊天框说"帮我安装"，AI 会自动排查。也可以截图发到学员群找助手。
