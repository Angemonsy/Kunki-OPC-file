---
description: Video Forge 插件完整安装和使用手册，从零到出视频
updated: 2026-03-19
---
> 一个 Obsidian 插件，输入文案 → 自动生成带字幕、配音、BGM 的短视频。

---

## 尊重知识产权，只限学员自己用

## 安装包下载

通过网盘分享的文件：VideoForge安装包.zip

链接: [https://pan.baidu.com/s/1aZTN20jRgOWRs2hR1rrMhw?pwd=1234](https://pan.baidu.com/s/1aZTN20jRgOWRs2hR1rrMhw?pwd=1234) 提取码: 1234

## 一、整体流程

```
写好文案（Markdown）
    ↓
点击「生成视频」
    ↓
AI 拆解场景 → 语音合成 → Whisper 生成字幕 → AI 生成 slides → Remotion 渲染视频
    ↓
输出 MP4 视频文件（1080x1920 竖屏）
```

---

## 二、安装（一键完成）

### 一）前提条件

已完成999课程安装包的基础安装（Node.js、Obsidian、Git 已装好）。

### 二）Windows 安装步骤

收到 **VideoForge安装包** 文件夹

![[06.附件/图片/dd85a5b70adae9bd31bd0c6b46b40064_MD5.jpg]]

1. 打开文件夹，双击 `**【Windows双击我】一键安装.bat**`

![[06.附件/图片/11eaebd00b552b28fc4affca4ba90b49_MD5.jpg]]

1. 弹出文件夹选择窗口 → 选择你的 **Obsidian 知识库根目录**

![[06.附件/图片/8763753732f9a74d172f4f16aa852852_MD5.jpg]]

1. 等待安装完成（约 3-5 分钟）

![[06.附件/图片/280ed6412f54127cf30826fb945272f2_MD5.jpg]]

### 三）Mac 安装步骤

1. 收到 **VideoForge安装包** 文件夹
2. 打开文件夹，双击 `**【Mac专用】一键安装.command**`
3. 如果提示「无法打开」→ 右键 → 打开 → 确认打开
4. 弹出文件夹选择窗口 → 选择你的 **Obsidian 知识库根目录**
5. 等待安装完成（约 3-5 分钟）

> Mac 首次运行 `.command` 文件需要授权。如果一直提示权限问题，打开终端运行：  
> `chmod +x ~/Downloads/VideoForge安装包/install.sh`

脚本会自动完成：

|   |   |   |
|---|---|---|
|**步骤**|**内容**|**说明**|
|1|检查 Node.js|999安装包已装好|
|2|检查/安装 Python|未安装时自动安装（Mac 用 Homebrew）|
|3|安装 Whisper 依赖|字幕生成引擎|
|4|复制 Video Forge 插件|到 .obsidian/plugins/|
|5|安装 Remotion 渲染引擎|自动 npm install|
|6|复制 BGM 背景音乐|默认 BGM|
|7|复制「长文转短视频」技能|到 .claude/skills/|
|8|配置 Whisper 开机自启|Windows: 启动目录 / Mac: launchd|

### 四）安装完成标志

看到以下输出说明安装成功：

```
============================================
 All done!

 Next steps:
 1. Open Obsidian
 2. Settings > Community Plugins > Enable Video Forge
 3. Video Forge settings > enter API Key
 4. Write a script, Ctrl+P > Video Forge
============================================
```

![[06.附件/图片/280ed6412f54127cf30826fb945272f2_MD5.jpg]]

> ⚠️ 首次启动 Whisper 时会自动下载语音识别模型（约 3GB），需保持网络通畅，等待约 5-10 分钟。之后每次开机秒启动。

### 五）Python 安装失败？

#### **1、Windows**

少数电脑没有 winget，需要手动安装：

1. 打开 [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. 下载 Python 3.11
3. 安装时**务必勾选** `**Add Python to PATH**`
4. 重新运行安装脚本

#### **2、Mac**

需要先安装 Homebrew：

```
/bin/bash -c"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

装完后重新运行安装脚本。

---

## 三、启用插件 + 配置 API

### 一）启用插件

1. 打开 Obsidian → 设置 → 第三方插件
2. 关闭「安全模式」

找到 **Video Forge** → 启用

![[06.附件/图片/376ef6969a41b03ab654a56258089c42_MD5.jpg]]

### 二）AI 引擎（必填）

打开 Obsidian 设置 → Video Forge，填写：

|   |   |   |
|---|---|---|
|**配置项**|**说明**|**获取方式**|
|AI 模型|直接输入模型名，如 `gpt-5.2`、`claude-sonnet-4-6`、`gemini-2.0-flash`|你的 API 提供商|
|API Key|场景拆解和 slides 生成|你的 API 提供商|
|API Base URL|API 代理地址（OpenAI 兼容格式）|你的 API 提供商|

> 支持任意 OpenAI 兼容接口（GPT、Claude、Gemini、DeepSeek 等均可）。

#### 1、AiCodeMirror 中转（推荐）

课程统一使用 AiCodeMirror 作为 API 中转，一个账号可以调用 GPT、Claude、Gemini、DeepSeek 等所有主流模型，不需要分别注册。

获取步骤：

1. 打开 [https://www.aicodemirror.com/dashboard](https://www.aicodemirror.com/dashboard)
2. 注册/登录账号

点右上角「充值」，充值后才能调用 API（按量计费，用多少扣多少）

![[06.附件/图片/b732016710d92d0ed2dd45d9b6914e6c_MD5.jpg]]

![[06.附件/图片/dad85f10133ed839a32e838ddd9b46cf_MD5.jpg]]

左侧「API Keys」→ 新建一个 Key，复制保存

![[06.附件/图片/3d77f574161d80a309ed66c505b883c1_MD5.jpg]]

![[06.附件/图片/0dcdadf8e4818dc6446ea5ba477aba84_MD5.jpg]]

![[06.附件/图片/0cfcdb5f42ead8e8a7453ea1ea2925bb_MD5.jpg]]

左侧「模型列表」→ 找到你想用的模型，复制模型名（建议gpt-5.2）

![[06.附件/图片/4fd8134019931e82395a3a3e11c1f25e_MD5.jpg]]

填写到插件设置：

|   |   |
|---|---|
|**配置项**|**填写内容**|
|AI 模型|gpt-5.2（推荐，模型强，速度快、性价比高）|
|API Key|你的 AiCodeMirror Key|
|API Base URL|[https://api.aicodemirror.com/api/codex/backend-api/codex/v1](https://api.aicodemirror.com/api/codex/backend-api/codex/v1)|

![[06.附件/图片/78c0ebe2b0a822d4eaa4f1b8dd43c8fd_MD5.jpg]]

### 三）语音合成（必填）

#### 1、MiniMax（推荐，支持声音克隆）

MiniMax 是国内的 AI 语音合成平台，音质好、支持声音克隆，Video Forge 默认使用它做配音。

##### 1）注册并充值

1. 打开 [https://platform.minimaxi.com/](https://platform.minimaxi.com/)

点击右上角「注册」，用手机号注册并登录

![[06.附件/图片/40e7a54667c9f71ef33b6f3f5620bac5_MD5.jpg]]

1. 登录后打开账号管理 → 点左上角头像 → 账号管理

![[06.附件/图片/45d693a7ab22f7fb7e3855056eb87bba_MD5.jpg]]

![[06.附件/图片/f20d9ad0108918e6da943aada9432e26_MD5.jpg]]

1. 点「充值」，充值后才能调用 API

![[06.附件/图片/77dd0a4516514a1d4530d6a7209882bf_MD5.jpg]]

1. 首次注册会送免费额度，但额度用完后需要充值才能继续调用

##### 2）获取 API Key

1. 登录后，点左侧菜单「API 密钥」
2. 点击「新建密钥」

![[06.附件/图片/5df4fd3b7ae87e5384609b841d4467af_MD5.jpg]]

![[06.附件/图片/be9478c288fa53b3ad9c11d990b1d7cf_MD5.jpg]]

1. 复制生成的密钥（只显示一次，务必保存好）

![[06.附件/图片/8308bcb71d5f75162faca8d85129cfef_MD5.jpg]]

##### 3）获取 Group ID

1. 同一个页面，点右上角你的头像
2. 选择「账户信息」

找到「Group ID」（一串 17 开头的数字），复制保存

![[06.附件/图片/e10dd5e6576dd194f1015a8f59de08cd_MD5.jpg]]

##### 4）声音克隆（用自己的声音配音）

1. 先录制一段 **10-30 秒** 的清晰语音（安静环境，普通话，语速适中）
2. 保存为 WAV 或 MP3 格式（建议 20MB 以内），放在电脑上任意位置即可

![[06.附件/图片/480c095601b2aec26d05127a549a41a2_MD5.jpg]]

1. 打开 Obsidian 设置 → Video Forge → 找到「声音克隆」

2. 点击「选择音频并克隆」

![[06.附件/图片/e396f4d11a59be01d694894d2967ee4e_MD5.jpg]]

1. 选择录音文件，输入音色名称

![[06.附件/图片/3f461adbd86dcc303e3250a1a4e5ffcf_MD5.jpg]]

![[06.附件/图片/c880eb1b07bab8e9a88723cd1806acd0_MD5.jpg]]

1. 等待完成，音色 ID 自动填入 Voice ID

![[06.附件/图片/ec510a0b8f24729b34902dff129e45dd_MD5.jpg]]

> ⚠️ 克隆音色 48 小时内必须用一次（生成一段视频），之后永久保留。

##### 5）填写到插件设置

打开 Obsidian 设置 → Video Forge，找到语音合成部分，填入：

|   |   |
|---|---|
|**配置项**|**填写内容**|
|MiniMax API Key|第二步复制的密钥|
|MiniMax Group ID|第三步复制的 Group ID|
|音色 ID|第四步克隆声音后，音色ID会自动填入|

![[06.附件/图片/29a5c52e6d78f7929a774c2d49a71b69_MD5.jpg]]

### 四）字幕引擎

默认使用本地 Whisper（端口 5111），安装脚本已自动配置，**不用动**。

---

## 四、使用方法

### 一）写文案

**如果你已经写了一篇公众号文案，可以直接用「长文转短视频」skill 一键压缩：**

1. 打开公众号文案的文档

在claudian中，告诉它，让它将你这份公众号长文案，转为短视频。claudian就会自动调用「长文转短视频」skill ，并进行一键压缩成短视频文案。

![[06.附件/图片/ac89704bd26cb8f6876ad3448e84c178_MD5.jpg]]

1. AI 自动把 1500-3000 字压缩为适合短视频的 400-800字
2. 确认后，就可以直接去生成封面和视频

### 二）生成封面

文案确认后，先生成封面图。

#### 1、准备封面底图（首次）

1. 把你喜欢的底图（1080×1920 竖版，PNG/JPG）放入 `VideoForge/covers/bg/` 文件夹（没有就新建）

可以放多张，插件每次会随机选一张，让封面不重复

![[06.附件/图片/83aa6ac7f8d916d668dfbc72837a16d4_MD5.jpg]]

设置 → Video Forge → 高级设置 → 封面底图路径，填 `VideoForge/covers/bg`

![[06.附件/图片/903a77726da3ede4414d8968ecc3799b_MD5.jpg]]

#### 2、生成封面

点击 Video Forge 面板的「🖼️ 生成文字封面」按钮

![[06.附件/图片/bedc27753502407aeacde3098463b046_MD5.jpg]]

1. 弹出输入框，填写封面文字：

- 第一行：**加粗文字**（大字，用 `**文字**` 标记加粗部分）
- 第二行：普通文字（小字，可选）

点确认，封面自动保存到 `VideoForge/covers/`

![[06.附件/图片/c2ddcaf6bdcc451ab658ef3e82f35df5_MD5.jpg]]

例如：

```
第一行：**一个人创业**靠自律不靠谱
第二行：我给自己搞了个AI监工
```

> 没有封面也能生成视频，会默认直接第一帧作为封面。

### 三）生成视频

1. 打开写好的文案文件

从选中笔记开始（约 1-3 分钟）

![[06.附件/图片/a6ba91e3120c474c82a8cd38418a891d_MD5.jpg]]

### 四）预览和渲染

#### 1、Remotion Studio 预览

- 点 **▶** **播放键** 预览视频
- 点 **🔊** **喇叭图标** 取消静音（预览默认静音）

![[06.附件/图片/5c8523efea19400baec549501df860b9_MD5.jpg]]

- 满意后点右下角 **Render** 导出 MP4

![[06.附件/图片/b7a6fd7cda376a65533999118fff9b24_MD5.jpg]]

![[06.附件/图片/c9889b8dbc01ed4b142ed21b1888d4ef_MD5.jpg]]

#### 2、直接渲染到D盘（更快）

Video Forge 面板底部有一个「📦 渲染到D盘」按钮，点击后直接在 Obsidian 内渲染，不需要打开 Remotion Studio。

![[06.附件/图片/8f82c5ce260c91e7eabfa4b47b710dcb_MD5.jpg]]

渲染完成后视频自动保存到你配置的输出目录（见下方）。

#### 3、视频保存位置

渲染完成后，视频默认保存在：

```
你的知识库/VideoForge/remotion-project/out/video.mp4
```

推荐配置固定输出目录，这样每次渲染自动以日期+标题命名保存：

**设置 → Video Forge → 高级设置 → 视频渲染输出目录**

填写绝对路径，如 `D:\我的口播视频`，之后每次点「渲染到D盘」会自动保存到那里。

![[06.附件/图片/1a548408805daae2099697c4d0e8da74_MD5.jpg]]

---

## 五、文案中的图片规则

在文案中插入 `![[图片名.png]]`，插件会自动匹配时间：

1. 找到图片**上方最近的一句话**（锚定句）
2. 说到这句话时**图片出现**
3. 这句话说完**图片消失**

```
那我现在怎么做呢，我给自己搞了一个AI监工。  ← 锚定句

![[系统截图.png]]  ← 图片跟这句话同步出现和消失

每隔两小时...
```

![[06.附件/图片/33d1dbc3c3485b6809be0a8ad095b65f_MD5.jpg]]

**要点：**

- 图片放在想展示的那句话**下方**
- 支持 PNG、JPG、GIF、WebP 格式
- 也支持视频嵌入 `![[演示.mp4]]`

---

## 六、配色 / BGM

### 一）配色预设

插件内置 20 套配色方案，切换路径：

**Obsidian 设置 → Video Forge → 高级设置 →** **🎨** **视频风格 → 风格预设**

下拉选择即可，颜色实时生效，下次生成视频时使用新配色。

|   |   |
|---|---|
|**预设名**|**风格**|
|🔵 科技蓝|深色背景 + 蓝色强调，科技感|
|🌙 午夜蓝|深蓝背景，沉稳专业|
|🟣 暗夜紫|紫色渐变，神秘高端|
|🌲 森林绿|深绿背景，自然清新|
|🍷 深红酒|酒红色调，复古质感|
|✏️ 自定义|手动调整每个颜色值|

![[06.附件/图片/ee2b76633f56884aeef9d0ce920afdb3_MD5.jpg]]

> 选「✏️ 自定义」后，可以在下方逐项调整背景色、文字色、强调色等。

---

### 二）背景音乐（BGM）

把 `.mp3` 文件放入 `VideoForge/BGM/` 文件夹就行，插件会**自动随机选一首**作为背景音乐。

> 安装包已内置一首默认 BGM，开箱即用。不加新 BGM 也能正常生成视频。

**想加更多 BGM？** 直接把 `.mp3` 文件丢进 `VideoForge/BGM/` 文件夹，不需要其他操作。

**免费 BGM 下载：**[Pixabay 音乐库](https://pixabay.com/zh/music/search/%e8%bd%bb%e9%9f%b3%e4%b9%90/)（无版权，可商用）

![[06.附件/图片/7da33b6117b5296d8f6feec026738180_MD5.jpg]]

---

## 七、常见问题

### Q: 视频没有声音 / 字幕是空的？

Whisper 字幕服务没在运行。检查方法：

```
Get-Process pythonw
```

如果没有进程，重新运行安装包里的 `【Windows双击我】一键安装.bat`（Mac 运行 `【Mac专用】一键安装.command`），它会重新配置 Whisper。

### Q: 渲染失败？

1. 确保 Node.js 已安装（`node --version` 应显示 v18+）
2. 确保 `VideoForge/remotion-project` 目录下有 `node_modules`
3. 关闭其他 Remotion Studio 窗口，避免端口冲突

### Q: 声音克隆失败（文件太大）？

- 插件限制上传文件不超过 20MB
- 建议直接录制 MP3 格式
- 录音 10-30 秒即可