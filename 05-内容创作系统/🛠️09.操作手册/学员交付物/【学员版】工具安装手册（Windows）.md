【学员版】工具安装手册（Windows）

> 📌 这份手册适合 **Windows 电脑**的学员。Mac 用户请看《学员版工具安装手册（Mac）》。

---

## ⚡ 一键安装（推荐）

交付包里有个 `【Windows双击我】一键安装.bat`，能自动完成所有工具安装。

### 操作步骤

1. **找到文件**：打开交付包文件夹，找到 `【Windows双击我】一键安装.bat`（Mac用户请用另一个sh文件）
2. **双击运行**：直接双击这个文件
3. **安全提示**：如果弹出「Windows 已保护你的电脑」蓝色窗口 → 点「更多信息」→ 点「仍要运行」（没弹出就跳过这步）
4. **按任意键开始**：黑色窗口会显示安装清单，按任意键开始安装
5. **等待安装**：脚本会依次安装 Obsidian、Claude Code、Node.js、6个插件，并导入知识库模板，全程约 5-10 分钟，**保持网络连接和梯子**
6. **选择知识库位置**：脚本会问你把知识库放哪里，直接**按回车**选默认即可
7. **看到 DONE 就成功了**：按任意键关闭窗口

[[06.附件/f7b74a3e56e13941499f8a09681fbecc_MD5.jpg|Open: Pasted image 20260307012836.png]]
![[06.附件/f7b74a3e56e13941499f8a09681fbecc_MD5.jpg]]
[[06.附件/2751169dd4c069c61940a74e4cb4e693_MD5.jpg|Open: Pasted image 20260307013204.png]]
![[06.附件/2751169dd4c069c61940a74e4cb4e693_MD5.jpg]]
[[06.附件/428aeec73c7824972de6a0e71a21c6d1_MD5.jpg|Open: Pasted image 20260307013131.png]]
![[06.附件/428aeec73c7824972de6a0e71a21c6d1_MD5.jpg]]
[[06.附件/ec48c0b11295dfde4268a03e6ce6bca7_MD5.jpg|Open: Pasted image 20260307012938.png]]
![[06.附件/ec48c0b11295dfde4268a03e6ce6bca7_MD5.jpg]]

### 安装完成后（4 步手动操作）

1. **打开 Obsidian** → 首次打开会出现欢迎界面 → 点击左下角 **「打开」** 按钮 → 选 **「打开文件夹作为仓库」** → 找到脚本最后显示的知识库路径（比如 `D:\ObsidianVaults\MyVault` 或 `C:\Users\你的用户名\Documents\MyVault`）→ 点「选择文件夹」。**⚠️ 注意：不要选安装包里的 vault 文件夹，要选脚本提示的路径。** 如果不是首次打开（没有欢迎界面），点左下角保险柜图标 → 「打开文件夹作为仓库」
2. **设置中文**：如果界面是英文 → 左下角 ⚙️ 设置 → General → Language → 简体中文 → 重启
3. **启用插件**：设置 → 第三方插件 → 关闭安全模式 → 在「已安装插件」列表中逐个打开所有插件的开关（Claudian、Nano Banana、Web Clipper、BRAT）
4. **配置 API + AI 兜底检查**：先按下面「二、安装 Claudian 插件」的「四）开通 AI 服务」和「五）配置 Claudian」完成 API 配置，**配好后**在 Claudian 聊天框说「帮我安装」，AI 会扫描你的整个环境，告诉你哪些没装好、下一步该做什么

### 常见问题

- **双击没反应？** 右键这个文件 → 选「以管理员身份运行」
- **窗口一闪就关？** 右键交付包文件夹空白处 → 选「在终端中打开」→ 输入 `.\【Windows双击我】一键安装.bat` 回车，这样能看到报错信息
- **某一步安装失败？** 不影响其他步骤，脚本会继续跑完。失败的部分参照下面的手动安装步骤补装即可
- **Claudian 显示「Claude CLI not found」？** 说明 Claude Code 没装上。打开 PowerShell（按 Win 键输入 `powershell` 回车），粘贴下面这行命令回车：`npm install -g @anthropic-ai/claude-code`，全程保持梯子开着。装完后关掉 Obsidian 重新打开即可
- **插件显示 0 个？** 确认你打开的是脚本提示的知识库路径（比如 `D:\ObsidianVaults\MyVault`），不是安装包里的 vault 文件夹。打错了的话：左下角保险柜图标 → 「打开文件夹作为仓库」→ 选正确路径

> ❌ **完全跑不起来？** 没关系，往下看手动安装步骤，一步步来也很简单。

---

## 安装总览（手动安装）

你需要安装以下工具，**按顺序来**：

| 顺序  | 工具                 | 用途                | 大约时间  |
| --- | ------------------ | ----------------- | ----- |
| 1   | **Obsidian**       | 知识库主程序            | 5 分钟  |
| 2   | **Claudian 插件**    | 让 Claude AI 住进知识库 | 15 分钟 |
| 3   | **Nano Banana 插件** | AI 自动生成手绘配图       | 5 分钟  |
| 4   | **Video Forge 插件** ⏸️ | AI 自动生成短视频（暂缓，先跳过） | —     |
| 5   | **Web Clipper 插件** | 一键截图网页            | 5 分钟  |
| 6   | **导入知识库模板**        | 导入文件夹结构 + AI 技能   | 5 分钟  |

---

# 一、安装 Obsidian

Obsidian 是你的知识库主程序，所有工具都运行在它里面。

## 一）下载安装包

打开 https://obsidian.md/download ，点击 **Download for Windows** 下载最新版。

> 💡 **官网下载慢？** 用国内镜像：
> - 夸克网盘：https://pan.quark.cn/s/a996a3708b62
> - 123 网盘：https://www.123684.com/s/M5P0Vv-FKJ63（免费）

## 二）安装软件

1. 双击下载好的安装文件（`.exe`）
2. 选择 **"仅为我安装"**
3. 修改安装路径到非 C 盘，例如 `D:\Tools\Obsidian`（C 盘空间小的话建议这样做）
4. 点击 **"安装"**，等待完成

## 三）创建知识库

首次打开 Obsidian 会提示你创建知识库：

1. 点击 **"新建知识库"**
2. 名称随便填，例如：`我的笔记库`
3. 位置选非 C 盘，例如 `D:\ObsidianVaults\我的笔记库`
4. 点击 **"创建"**

> ⚠️ **记住知识库的位置**，后面装插件时会用到。

【本地截图③：Obsidian 新建知识库界面，展示名称输入框和位置选择按钮】

## 四）基础设置

**1）设置中文界面**（如果打开后是英文）

点击左下角 **⚙️ 设置** → **General** → **Language** → 选 **简体中文** → 重启 Obsidian

【本地截图④：Obsidian 设置界面，左侧选中 General，右侧 Language 下拉框选择"简体中文"】

**2）开启第三方插件**（必须做，后面装插件都靠这个）

点击左下角 ⚙️ **设置** → **第三方插件** → **"关闭安全模式"** → 在弹出框再次确认

[[06.附件/762f081130dde41fede74f31d4f75c83_MD5.jpg|Open: Pasted image 20260307013739.png]]
![[06.附件/762f081130dde41fede74f31d4f75c83_MD5.jpg]]

> ✅ 完成后页面出现"已安装插件"区域，说明成功了。

---

# 二、安装 Claudian 插件

Claudian 是让 Claude AI 住进 Obsidian 的核心插件。分两步：先装 Claude Code CLI，再装插件本体。

## 一）安装 Claude Code CLI

> ⚠️ **必须先开梯子（科学上网/VPN）！** Claude 是海外服务，国内网络直接访问会被拦截。打开你的代理工具（如 Clash Verge、V2Ray 等），确认连接成功后再执行下面的命令。**整个安装和登录过程都要保持梯子开着。**

1. 打开 PowerShell：按 `Win + X`，选择 **"终端"** 或 **"PowerShell"**（普通权限即可，不需要管理员）
2. 粘贴以下命令，回车执行：

```powershell
winget install Anthropic.ClaudeCode
```

3. 等待安装完成（会显示进度条）

> ❌ **提示 winget 不是命令？** 你的系统缺少"应用安装程序"。打开 **Microsoft Store**，搜索 **"App Installer"**，点安装/更新，装完后关闭 PowerShell 重新打开再试。

【本地截图⑥：PowerShell 窗口，显示 winget install 命令正在执行的进度】

## 二）验证 Claude Code 安装成功

安装完成后，**关闭 PowerShell 窗口，重新打开一个**，输入：

```powershell
claude --version
```

看到版本号（例如 `1.x.x`）说明安装成功。

> ❌ 提示"找不到命令"？关闭所有 PowerShell 窗口，重新打开再试。如果还不行，重启电脑后再试。

## 三）安装 Claudian 插件（BRAT 方式）

**1）先安装 BRAT（插件安装器）**

1. 打开 Obsidian → **设置** → **第三方插件** → 点击 **"浏览"**
2. 搜索 `BRAT`，找到后点 **"安装"**，再点 **"启用"**

【本地截图⑧：Obsidian 第三方插件浏览页面，搜索框输入 BRAT，搜索结果中显示 BRAT 插件和安装按钮】

**2）用 BRAT 安装 Claudian**

1. **设置** → **第三方插件** → 找到 **BRAT** → 点旁边的 ⚙️ 图标
2. 点击 **"Add Beta Plugin"**，在输入框填入：

```
YishenTu/claudian
```

3. 点 **"Add Plugin"**，等待下载完成
4. 回到插件列表找到 **Claudian**，打开右边的开关启用

> ❌ **BRAT 下载失败？** 需要能访问 GitHub。如果超时，开启代理后再试。或者改用手动安装：去 https://github.com/YishenTu/claudian/releases/latest 下载 `main.js`、`manifest.json`、`styles.css` 三个文件，在 `.obsidian/plugins/` 下新建 `claudian` 文件夹，把三个文件放进去。

![[web-clipper-images/clip-1772817961709-1.png]]

【本地截图⑨：BRAT 插件设置页面，Add Beta Plugin 对话框，输入了 YishenTu/claudian】

## 四）开通 AI 服务（二选一）

Claudian 需要接入 AI 才能使用，有两种方案：

| 方案                  | 费用                     | 特点                                                        |
| ------------------- | ---------------------- | --------------------------------------------------------- |
| **Claude 官方订阅**（推荐） | Max 月付（[闲鱼代充](https://m.tb.cn/h.idJgFWj?tk=lzJ6UvfqU0q)） | 效果最好，一次订阅全部模型无限用   |
| **第三方 API**         | 按量付费，费用更低              | 推荐 [openclaw-api.com](https://openclaw-api.com)，课程里会教配置方法 |

> 💡 **不知道选哪个？** 预算充足、想要最强效果 → 选方案A（Claude Max，闲鱼代充约 ¥785/月）；想先少花钱试试 → 选方案B（API按量付费，¥20 起步能用很久）。两种方案随时可以切换。

## 五）配置 Claudian

**1）填入 Claude Code 路径**

1. 打开 PowerShell，输入 `where claude`，会返回类似 `C:\Users\你的用户名\.local\bin\claude.exe` 的路径，**选中整行右键复制**
2. 打开 Obsidian → 左下角 **⚙️ 设置** → 左侧菜单往下找到 **Claudian** → 在 **Claude CLI path** 输入框里粘贴刚才复制的路径 → 保存

**2）检查 Environment Variables（重要！）**

在 Claudian 设置页面找到 **Environment Variables** 区域：

**方案A：使用 Claude 官方订阅（Max 月付）**

Environment Variables 区域必须**完全空白**，一行都不填。保存后关闭设置。

然后需要在 PowerShell 里完成一次 Claude Code 登录：

1. 打开 PowerShell（按 `Win + X` → 选带"终端"或"PowerShell"字样的选项）
2. 输入 `claude` 回车
3. 屏幕会提示你选择登录方式，选 **「Claude account with subscription」**（带订阅的 Claude 账号）
4. 浏览器会自动弹开一个授权页面，**直接点 Authorize（授权）** 即可
5. 授权后浏览器可能显示「localhost 连接被拒绝」或空白页——**这是正常的**，直接关掉浏览器页面
6. 回到 PowerShell，顶部应该显示类似 `Claude Code v2.x.x · Sonnet · Claude Max`，看到 **Claude Pro** 或 **Claude Max** 字样就说明登录成功
7. 输入 `/exit` 退出
8. **重启 Obsidian**（右上角关闭后，在任务栏托盘也右键退出，再重新打开），然后在 Claudian 聊天框随便说句话测试

> ⚠️ **Claudian 报 403 错误？** 说明 Obsidian 没找到你本地的 Claude Code，按以下步骤排查：
> 1. 打开 PowerShell，输入 `where.exe claude`，复制输出的路径（如 `C:\Users\你的用户名\.local\bin\claude.exe`）
> 2. 回到 Obsidian → 设置 → Claudian → 往下找到 **「Claude Code Path」**
> 3. 把刚才复制的路径粘贴进去，保存
> 4. 再次完全退出 Obsidian 并重新打开，重试

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

## 六）验证安装成功

打开任意笔记，左侧边栏出现 **🤖 图标**，点击能打开聊天面板，说明装好了。

【本地截图⑩：Obsidian 左侧边栏，箭头指向 Claudian 的🤖图标，右侧打开了聊天面板】

---

## 七）添加浏览器控制能力（Playwright MCP）

这一步让 Claudian 能帮你**自动操作浏览器**——打开网页、搜索信息、截图、采集数据，是很多高级技能的基础。

**1）确认 Node.js 已安装**

打开 PowerShell，输入：

```
node -v
```

看到 `v18.x.x` 或更高版本号 → 直接下一步。

> ❌ 显示"不是可识别的命令"？说明 Node.js 没装好。
> - 用了一键安装脚本的话，重启 PowerShell 再试一次
> - 还是不行，去 https://nodejs.org 下载安装 LTS 版本

**2）添加 Playwright MCP**

PowerShell 里输入这一行（整行复制粘贴）：

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

## 一）复制插件文件夹

你拿到的插件文件里有一个叫 `nano-banana-image-generator` 的文件夹，把它整个复制到：

```
你的知识库路径\.obsidian\plugins\
```

例如：`D:\ObsidianVaults\我的笔记库\.obsidian\plugins\nano-banana-image-generator\`

> 💡 **找不到 `.obsidian` 文件夹？** 它是隐藏文件夹。打开文件资源管理器 → 顶部点 **"查看"** → 勾选 **"隐藏的项目"** 就能看到了。

【本地截图⑪：文件资源管理器，展示 .obsidian/plugins/ 目录下的 nano-banana-image-generator 文件夹】

## 二）启用插件

1. 完全关闭 Obsidian（任务栏右下角也要右键退出），重新打开
2. 点击左下角 **⚙️ 设置**
3. 左侧菜单往下滚，找到 **第三方插件**
4. 在「已安装插件」列表里找到 **Nano Banana 🍌 手绘信息图生成器**
5. 点右边的**开关**，变成蓝色表示已启用

【本地截图⑫：Obsidian 第三方插件页面，已安装插件列表中 Nano Banana 的开关处于开启状态】

> ❌ **列表里找不到？** 说明插件文件没放对位置，回上一步检查文件夹路径。

## 三）配置 API Key

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

## 四）验证安装成功

左侧边栏出现 **🍌 图标**，说明安装成功。打开任意笔记，点击 🍌 图标尝试生成一张图，能出图就配置成功 ✅

---

# 四、安装 Video Forge 插件

> ⏸️ **本插件暂未随安装包发放，目前请跳过整个第四章。** 插件正在做稳定性测试，通过后会在群里统一发放，届时再回来按步骤安装。下面的内容先留着，等插件发放时参考。

---

Video Forge 可以根据你的文案，自动生成短视频（带配音和字幕）。

> 📦 **用了一键安装脚本？** 插件文件和 Node.js 已经自动装好了，直接跳到「启用插件」和「配置 API Keys」步骤即可。但 **Remotion 依赖** 和 **API Keys** 仍需手动配置。

## 一）安装 Node.js（前置条件）

Video Forge 依赖 Node.js 才能运行，先装这个。

1. 打开 https://nodejs.org，点左边绿色 **LTS** 按钮下载
2. 双击安装，一路 **"下一步"** 即可
3. 打开 PowerShell，输入 `node -v`，看到版本号说明装好了

![[web-clipper-images/clip-1772817961709-2.png]]

## 二）复制插件文件夹

你拿到的插件文件里有一个叫 `video-forge` 的文件夹，把它整个复制到：

```
你的知识库路径\.obsidian\plugins\
```

> 💡 找不到 `.obsidian` 文件夹？打开文件资源管理器 → 顶部点 **"查看"** → 勾选 **"隐藏的项目"**。

## 三）启用插件

1. 完全关闭 Obsidian（任务栏右下角也要右键退出），重新打开
2. 点击左下角 **⚙️ 设置** → 左侧找到 **第三方插件**
3. 在「已安装插件」列表里找到 **Video Forge 🎬 视频锻造**，点右边开关启用

> ❌ **列表里找不到？** 说明插件文件没放对位置，回上一步检查文件夹路径。

## 四）安装 Remotion 依赖

`video-forge` 文件夹里已经自带了 Remotion 项目，只需要安装一下依赖包。

1. 打开 PowerShell
2. 输入以下命令，把 `你的知识库路径` 换成你的实际路径：

```powershell
cd "你的知识库路径\.obsidian\plugins\video-forge\remotion-project"
npm config set registry https://registry.npmmirror.com
npm install
```

> 💡 **举个例子**：如果你的知识库在 `D:\ObsidianVaults\MyVault`，那命令就是：
> ```
> cd "D:\ObsidianVaults\MyVault\.obsidian\plugins\video-forge\remotion-project"
> ```

3. 等待安装完成（3–5 分钟，取决于网速），看到没有红色报错就说明成功了

> 💡 Remotion 只需装一次，以后每次生成视频都会复用。

## 五）安装本地 Whisper 字幕服务

Video Forge 使用本地 Whisper 生成字幕（免费，GPU 加速），需要安装 Python 环境和依赖。

**1）安装 Python**

1. 打开 https://www.python.org/downloads/，点 **Download Python 3.11.x**
2. 安装时 **务必勾选** 底部的 `Add Python to PATH`
3. 一路 Next 完成安装
4. 打开 PowerShell，输入 `python --version`，看到版本号说明装好了

**2）安装 Whisper 依赖**

在 PowerShell 中执行：

```powershell
pip install flask faster-whisper
```

> 💡 如果你有 NVIDIA 独立显卡，再装 CUDA 加速（可选，速度快 5-10 倍）：
> ```powershell
> pip install nvidia-cublas-cu12 nvidia-cudnn-cu12
> ```

**3）设置开机自启**

让 Whisper 服务每次开机自动后台运行，省得每次手动启动：

1. 右键 PowerShell → **以管理员身份运行**
2. 依次粘贴执行以下命令：

```powershell
$action = New-ScheduledTaskAction -Execute "你的知识库路径\VideoForge\start-whisper.bat"
$trigger = New-ScheduledTaskTrigger -AtLogon
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0
Register-ScheduledTask -TaskName "WhisperServer" -Action $action -Trigger $trigger -Settings $settings -Description "Video Forge 本地 Whisper 服务" -RunLevel Highest
```

> ⚠️ 把命令中的 `你的知识库路径` 替换成你实际的知识库完整路径，比如 `D:\ObsidianVaults\MyVault`

3. 看到 `State: Ready` 说明注册成功
4. 首次需要手动启动一次：双击知识库内 `VideoForge\start-whisper.bat`

> 💡 首次启动会自动下载模型（约 3GB），需要等几分钟。以后开机会自动启动，不用再管。

**4）验证 Whisper 服务**

打开一个新的 PowerShell 窗口，执行：

```powershell
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
你的知识库路径\.obsidian\plugins\
```

## 二）启用插件

1. 完全关闭 Obsidian（任务栏右下角也要右键退出），重新打开
2. 点击左下角 **⚙️ 设置** → 左侧找到 **第三方插件**
3. 在「已安装插件」列表里找到 **Web Clipper 📸 网页截图助手**，点右边开关启用

> ❌ **列表里找不到？** 说明插件文件没放对位置，回上一步检查文件夹路径。

## 三）验证安装成功

左侧边栏出现 **📷 图标**，说明安装成功。插件默认使用本地截图引擎，**无需额外配置 API Key**，开箱即用。

---

# 六、导入知识库模板

知识库模板包含两样东西：**完整的文件夹结构**（让 AI 知道去哪里找你的信息）和 **AI Skills**（AI 的工作手册）。

> 📦 **用了一键安装脚本？** 模板已经自动导入到知识库了，直接跳到「验证 Skills 加载成功」确认即可。

## 一）解压模板包

你收到的文件包里有一个叫 `AI内容创作系统-学员版.zip` 的文件，右键 → **"解压到当前文件夹"**。

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

**全选所有文件和文件夹**（Ctrl + A），复制粘贴到你的 Obsidian 知识库根目录：

```
D:\ObsidianVaults\我的笔记库\        ← 直接放这里
```

> ⚠️ **放的位置非常重要！** 必须放在知识库**根目录**，不能多套一层文件夹：
>
> ❌ 错误：`我的笔记库\AI内容创作系统-学员版\01.用户画像\`
>
> ✅ 正确：`我的笔记库\01.用户画像\`

> 💡 **看不到 `.claude` 文件夹？** 它以点开头，默认隐藏。打开文件资源管理器 → 顶部 **"查看"** → 勾选 **"隐藏的项目"**，就能看到了。复制时记得把它也一起选上。

复制完后，你的知识库根目录应该长这样：

```
我的笔记库\
├── .claude\          ← AI 配置（隐藏文件夹）
├── .obsidian\        ← Obsidian 配置（隐藏文件夹）
├── 01.用户画像\
├── 02.文案结构\
├── 03.选题决策\
├── 04.我的上下文\
├── 05.开篇模板\
├── 07.发布文案\
├── 08.数据反馈\
├── 09.经验沉淀\
└── README.md
```

## 三）重启 Obsidian

复制完后，完全关闭 Obsidian（任务栏右键也要退出），重新打开，左侧文件列表里就能看到所有文件夹。

## 四）验证 Skills 加载成功

打开 Claudian 聊天面板（点左侧 🤖 图标），试试说：**「帮我写篇公众号热点爆款文章」**

AI 能识别并启动对应技能，说明 Skills 加载成功。

[[06.附件/894b6910a65d9823c085fcb68a84bbc0_MD5.jpg|Open: Pasted image 20260307015031.png]]
![[06.附件/894b6910a65d9823c085fcb68a84bbc0_MD5.jpg]]

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

**Q：看不到 `.obsidian` 文件夹？**
打开文件资源管理器 → 顶部点 **"查看"** → 勾选 **"隐藏的项目"**。

**Q：`winget` 命令不存在？**
两种解决办法：
- **方法1**：打开 Microsoft Store，搜索 **「App Installer」**（应用安装程序），点安装或更新。装完后关闭 PowerShell 重新打开再试
- **方法2**：跳过 winget，改用 npm 安装（需要先装好 Node.js）：`npm install -g @anthropic-ai/claude-code`

**Q：安装 Claude Code 时跳转到 `app-unavailable-in-region` 页面？**
说明没开梯子。打开代理工具（Clash Verge、V2Ray 等），连接成功后重新执行安装命令。**整个安装和登录过程都要保持梯子开着。**

**Q：`claude --version` 提示找不到命令？**
关闭所有 PowerShell 窗口，重新打开再试。如果还不行，重启电脑后再试。

**Q：Claudian 报 401 错误？**
Claudian 设置 → Environment Variables 区域是否有内容？如果用官方订阅，这里必须留空。

**Q：插件启用后左侧没有图标？**
完全关闭 Obsidian（任务栏也要退出），重新打开，再去设置里确认插件已启用。

**Q：Node.js 装了但 `node -v` 找不到命令？**
关闭所有 PowerShell 窗口，重新打开一个，再试一次（PATH 需要重新加载）。

**Q：`npm install` 报错或卡住？**
可能是网络问题。开启全局代理后再试。也可以先切换 npm 镜像源：在 PowerShell 里输入 `npm config set registry https://registry.npmmirror.com` 再重新执行 `npm install`。

**Q：梯子开着但脚本提示 "no local proxy detected" 或下载失败？**
梯子默认只代理浏览器，终端（PowerShell/cmd）不会自动走代理。需要手动设置：
1. 打开你的梯子软件，找到**本地HTTP端口号**（一般在设置里，比如 Clash 默认是 7890）
2. 在 PowerShell 里输入以下两行（把 7890 换成你的端口号）：
   ```
   $env:HTTPS_PROXY="http://127.0.0.1:7890"
   $env:HTTP_PROXY="http://127.0.0.1:7890"
   ```
3. 在同一个窗口里重新跑安装命令或脚本

---

> 📝 安装遇到问题？装好 Claudian 后直接在聊天框说"帮我安装"，AI 会自动排查。也可以截图发到学员群找助手。
