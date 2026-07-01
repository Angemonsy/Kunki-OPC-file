# 🎬 从文案到视频：AI 语音克隆 + Remotion 自动化视频制作 SOP 手册  

> **适用人群**：零代码基础的小白用户  

> **最终效果**：输入一段文案 → 用你的声音生成配音 → 自动生成带字幕的视频  

> **预计耗时**：首次搭建约 2-3 小时，后续每次制作约 10 分钟  





1️⃣生成文案
2️⃣直接录音
3️⃣剪映剪辑+导出字幕和视频
4️⃣视频放进对应的文件夹中
5️⃣用提示词生成新的jrt文件，注意里面的视频名和背景音乐名要对应上，用ppt模板，可以让谷歌去出。
6️⃣修改Root文件，视频时长要对应上。
7️⃣命令符启动Remotion网页端
，先指定文件夹，再启动。
8️⃣看下字幕效果，没问题就导出，有问题继续让谷歌优化。
9️⃣有需要的话，导入剪映，加背景音乐，字幕，画面素材，封面。

最后导出最终的视频

---
## 📋 目录  

1. [环境准备：安装必要软件](#第一章-环境准备安装必要软件)

2. [安装 Coqui TTS：AI 语音克隆工具](#第二章-安装-coqui-ttsai-语音克隆工具)

3. [录制你的声音样本](#第三章-录制你的声音样本)

4. [用你的声音生成配音](#第四章-用你的声音生成配音)

5. [安装 Remotion：视频生成工具](#第五章-安装-remotion视频生成工具)

6. [制作视频：音频 + 字幕同步](#第六章-制作视频音频--字幕同步)

7. [导出成品视频](#第七章-导出成品视频)

8. [日常使用：快速制作新视频](#第八章-日常使用快速制作新视频)

9. [常见问题排查](#第九章-常见问题排查)

10. [【选读】进阶：全自动字幕生成（Whisper 方案）](#第十章-选读进阶全自动字幕生成whisper-方案)

---

## 第一章 环境准备：安装必要软件

本章需要安装 3 个软件，请严格按顺序操作。

### 1.1 安装 Node.js

Node.js 是运行 Remotion 视频工具的基础环境。

1. 打开浏览器，访问：https://nodejs.org/

2. 点击页面上的 **LTS（长期支持版）** 下载按钮

3. 双击下载的安装包，**一路点"下一步"**，全部默认即可

4. 安装完成后，验证是否成功：

   - 按 `Win + R`，输入 `cmd`，回车，打开命令行

   - 输入以下命令并回车：

     ```

     node --version

     ```

   - 如果显示类似 `v24.11.1` 的版本号，说明安装成功 ✅

### 1.2 安装 Python 3.11

> ⚠️ **重要提醒**：必须安装 **Python 3.11** 版本，不能用 3.12 或更新版本！Coqui TTS 只兼容 3.9-3.11。

1. 打开浏览器，访问：https://www.python.org/downloads/release/python-3119/

2. 往下滚动到 "Files" 部分，点击 **Windows installer (64-bit)** 下载

3. 双击运行安装包

4. **⚠️ 关键步骤**：在安装界面底部，**务必勾选 "Add python.exe to PATH"**

5. 点击 "Install Now"，等待安装完成

6. 验证安装：

   - 打开新的命令行窗口（按 `Win + R`，输入 `cmd`，回车）

   - 输入：

     ```

     py --list

     ```

   - 应该能看到 `Python 3.11` 在列表中 ✅

### 1.3 安装 Visual Studio Build Tools

> ⚠️ 这个工具体积较大（约 7GB），但它是让 TTS 正常编译安装的必要条件。

1. 打开浏览器，访问：https://aka.ms/vs/17/release/vs_BuildTools.exe

2. 下载完成后，双击运行

3. 在安装界面中，勾选 **"使用 C++ 的桌面开发"**（英文显示为 "Desktop development with C++"）

4. 点击右下角的 **"安装"** 按钮

5. 等待安装完成（约 15-30 分钟）

6. 安装完成后，**重启电脑**

---

## 第二章 安装 Coqui TTS：AI 语音克隆工具

重启电脑后，开始安装 TTS。

### 2.1 安装稳定版本组合

> ⚠️ **关键步骤**：必须按照以下顺序安装特定版本，否则会出现各种兼容性问题。这是踩了无数坑后总结出的稳定组合。

打开命令行（按 `Win + R`，输入 `cmd`，回车），**逐条**输入以下命令：

**第一条**（安装 PyTorch）：

```

py -3.11 -m pip install torch==2.1.0 torchaudio==2.1.0 --index-url https://download.pytorch.org/whl/cpu

```

等待安装完成（会显示 `Successfully installed ...`）。

**第二条**（安装 transformers）：

```

py -3.11 -m pip install transformers==4.33.0 tokenizers==0.13.3

```

等待安装完成。

**第三条**（安装 TTS）：

```

py -3.11 -m pip install TTS==0.21.0

```

等待安装完成。

> 💡 每条命令都要等到出现 `Successfully installed ...` 或者命令行重新出现 `PS C:\Users\你的用户名>` 后，再输入下一条。

### 2.2 验证安装

输入以下命令验证：

```

py -3.11 -c "from TTS.api import TTS; print('TTS 安装成功！')"

```

如果显示 `TTS 安装成功！` 就说明安装正确 ✅

> ❌ 如果报错 `No module named TTS`，说明安装失败，请回到 2.1 重新执行三条命令。

---

## 第三章 录制你的声音样本

声音样本的质量直接决定克隆效果，请认真录制。

### 3.1 录制要求

| 项目 | 要求 |

|------|------|

| 时长 | 30 秒 - 2 分钟（越长越好） |

| 格式 | WAV 格式 |

| 环境 | 安静无噪音 |

| 语速 | 用你正常说话的速度 |

| 内容 | 自然说话，包含不同语气和停顿 |

### 3.2 录制步骤

1. 按 Windows 键，搜索 **"录音机"**，打开 Windows 自带录音应用

2. 点击红色按钮开始录音

3. 自然地朗读以下文字（或者随便说 1-2 分钟的话）：

> 大家好，我是XXX。今天想和大家分享一些有趣的内容。人工智能技术正在改变我们的生活方式，从内容创作到自动化工作流，都变得越来越智能。我特别喜欢探索新工具，看看它们能帮我们做什么。希望通过这些分享，能给大家带来一些启发和帮助。

4. 录完后停止录音

5. 将文件保存为 WAV 格式，放到桌面，命名为 `my_voice.wav`

   - 最终路径应为：`C:\Users\你的用户名\Desktop\my_voice.wav`

> 💡 **提升克隆效果的技巧**：

> - 录制时尽量贴近你做视频时的说话风格

> - 如果你平时语速较快，录音时也保持快语速

> - 避免过于刻意朗读，自然说话效果最好

---

## 第四章 用你的声音生成配音

### 4.1 创建语音生成脚本

1. 打开命令行，输入：

   ```

   notepad C:\Users\你的用户名\my_tts.py

   ```

   > ⚠️ 把"你的用户名"替换成你电脑的实际用户名（比如 `86155`）

2. 弹出对话框问"是否创建新文件"，点 **"是"**

3. 在记事本中，**完整复制粘贴**以下代码：

```python

from TTS.api import TTS

print("加载模型中（首次运行需要下载 1.8GB 模型，请耐心等待）...")

tts = TTS('tts_models/multilingual/multi-dataset/xtts_v2')

# ========== 修改区：只需要改下面两个地方 ==========

# 1. 你的声音样本路径（改成你的实际路径）

speaker_wav = r"C:\Users\你的用户名\Desktop\my_voice.wav"

# 2. 你的文案（把内容替换成你要读的文案）

text = """很多人做自媒体失败的原因，百分之九十九是因为没有选题，更新太慢，以及没有办法持续出爆款。那无非就这些问题。过去几个月时间，我一直在思考一个问题：能不能把内容创作这件事，从靠灵感碰运气变成可复制的流水线？所以我花了三个月时间，搭建了一套完整的内容创作系统。"""

# ========== 修改区结束 ==========

print("生成音频中...")

tts.tts_to_file(

    text=text,

    speaker_wav=speaker_wav,

    language='zh-cn',

    file_path='output.wav'

)

print("完成！音频已保存为 output.wav")

```

4. **修改两个地方**：

   - 把 `你的用户名` 改成你电脑的实际用户名

   - 把文案内容改成你自己的文案

5. 按 `Ctrl + S` 保存，关闭记事本

### 4.2 运行生成配音

在命令行中输入：

```

py -3.11 C:\Users\你的用户名\my_tts.py

```

**首次运行会出现以下情况**：

1. 弹出许可协议提示，输入 `y` 然后回车

2. 开始下载 XTTS v2 模型（约 1.8GB），显示下载进度条

3. 下载完成后自动开始生成音频

4. 看到 `完成！` 字样说明生成成功

生成的音频文件在：`C:\Users\你的用户名\output.wav`

双击播放听听效果。

> 💡 第二次运行不需要重新下载模型，会快很多。

>

> ⚠️ **关于声音相似度**：XTTS v2 是开源模型，克隆效果可能不完美。如果对质量要求很高，可以考虑使用 ElevenLabs 等商业 API 服务。

---

## 第五章 安装 Remotion：视频生成工具

### 5.1 创建 Remotion 项目

打开**新的命令行窗口**（按 `Win + R`，输入 `cmd`，回车），输入：

```

npx create-video@latest my-video-project

```

安装过程中会问你几个问题，按以下选择：

| 提示 | 选择 |

|------|------|

| Ok to proceed? | 输入 `y` 回车 |

| Choose a template | 用方向键选 **Hello World (JavaScript)**，回车 |

| Add TailwindCSS? | 选 **No** |

| Add agent skills? | 选 **No** |

等待项目创建完成。

### 5.2 安装依赖并启动

依次输入以下命令：

```

cd my-video-project

npm i

npm run dev

```

浏览器会自动打开 Remotion Studio 界面（地址：`http://localhost:3000`），看到视频预览画面说明启动成功 ✅

> ⚠️ **注意**：运行 `npm run dev` 的这个命令行窗口不能关闭！关闭后 Studio 就停了。后续操作请打开新的命令行窗口。

---

## 第六章 制作视频：音频 + 字幕同步

### 6.1 准备音频文件

将你在第四章生成的 `output.wav` 复制到 Remotion 项目的 `public` 文件夹中，并重命名为 `audio.wav`。

**方法**：打开文件资源管理器，找到以下路径：

```

C:\Users\86155\my-video-project\public\

```

把 `output.wav` 复制到这个文件夹里，重命名为 `audio.wav`。

> 💡 如果你有背景音乐（mp3 格式），也一起复制到 `public` 文件夹中。

### 6.2 用剪映生成 SRT 字幕文件

SRT 文件包含每句话的精确时间戳，是字幕和音频同步的关键。

1. 打开**剪映**

2. 新建项目，导入你的 `audio.wav`

3. 点击 **文本** → **智能字幕** → **识别字幕**

4. 等识别完成后，点击 **导出字幕**

5. **⚠️ 格式选择 SRT（不要选 TXT！）**

6. 将导出的 `.srt` 文件也复制到 `public` 文件夹中

### 6.3 设置视频时长

用记事本打开 `src/Root.jsx` 文件：

```

notepad C:\Users\你的用户名\my-video-project\src\Root.jsx

```

找到这一行：

```jsx

durationInFrames={150}

```

改成你的音频秒数乘以 30。例如音频 39 秒就改成：

```jsx

durationInFrames={39 * 30}

```

> 💡 **怎么知道音频多少秒？** 右键点击 audio.wav → 属性 → 详细信息 → 查看"持续时间"。

按 `Ctrl + S` 保存，关闭记事本。

### 6.4 编写字幕视频代码

这是最关键的一步。你需要根据 SRT 文件中的时间戳来编写视频代码。

用记事本打开 `src/HelloWorld.jsx`：

```

notepad C:\Users\你的用户名\my-video-project\src\HelloWorld.jsx

```

**全选删除**原来的内容（`Ctrl + A` → `Delete`），然后粘贴以下模板代码：

```jsx

import {useCurrentFrame, useVideoConfig, Audio, staticFile} from 'remotion';

export const HelloWorld = () => {

  const frame = useCurrentFrame();

  const {fps} = useVideoConfig();

  const currentTime = frame / fps;

  // ========== 字幕区：根据你的 SRT 文件修改时间和文字 ==========

  const subtitles = [

    {start: 0.0, end: 2.633, lines: [

      {text: "第一句字幕", size: 72, type: 'normal'}

    ]},

    {start: 2.633, end: 6.2, lines: [

      {text: "次要文字", size: 48, type: 'sub'},

      {text: "重点关键词", size: 80, type: 'gradient'}

    ]},

    // 继续添加更多字幕...

  ];

  // ========== 字幕区结束 ==========

  const currentSub = subtitles.find(

    (s) => currentTime >= s.start && currentTime < s.end

  );

  const getEntryProgress = () => {

    if (!currentSub) return 0;

    const elapsed = currentTime - currentSub.start;

    return Math.min(elapsed / 0.3, 1);

  };

  const entryProgress = getEntryProgress();

  const getStyle = (line) => {

    const base = {

      fontFamily: '-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif',

      textAlign: 'center',

      fontWeight: '700',

      letterSpacing: '2px',

      lineHeight: 1.3,

    };

    switch (line.type) {

      case 'gradient':

        return {

          ...base,

          fontSize: line.size,

          fontWeight: '800',

          background: 'linear-gradient(90deg, #2997FF, #6FDFFF)',

          WebkitBackgroundClip: 'text',

          WebkitTextFillColor: 'transparent',

          letterSpacing: '4px',

        };

      case 'accent':

        return {

          ...base,

          fontSize: line.size,

          fontWeight: '800',

          color: '#FFFFFF',

          letterSpacing: '4px',

        };

      case 'sub':

        return {

          ...base,

          fontSize: line.size,

          fontWeight: '500',

          color: 'rgba(255,255,255,0.5)',

          letterSpacing: '1px',

        };

      default:

        return {

          ...base,

          fontSize: line.size,

          color: 'rgba(255,255,255,0.9)',

        };

    }

  };

  return (

    <div style={{

      flex: 1,

      backgroundColor: '#000000',

      justifyContent: 'center',

      alignItems: 'center',

      display: 'flex',

      flexDirection: 'column',

      padding: '0 120px',

    }}>

      <Audio src={staticFile('audio.wav')} />

      <div style={{

        display: 'flex',

        flexDirection: 'column',

        gap: '24px',

        alignItems: 'center',

        opacity: entryProgress,

        transform: `translateY(${(1 - entryProgress) * 20}px)`,

      }}>

        {currentSub ? currentSub.lines.map((line, i) => (

          <div key={i} style={getStyle(line)}>

            {line.text}

          </div>

        )) : null}

      </div>

    </div>

  );

};

```

### 6.5 如何填写字幕区

打开你的 SRT 文件（用记事本），你会看到类似这样的内容：

```

1

00:00:00,000 --> 00:00:02,633

很多人做自媒体失败的原因

2

00:00:02,633 --> 00:00:06,200

99%是因为没有选题更新太慢

```

对照 SRT 中的时间，填写代码中的 `subtitles` 数组。规则如下：

**时间转换**：`00:00:02,633` → 写成 `2.633`

**文字类型说明**：

| type | 效果 | 用途 |

|------|------|------|

| `'normal'` | 白色正文 | 普通句子 |

| `'sub'` | 灰色小字 | 次要信息、过渡句 |

| `'gradient'` | 蓝色渐变大字 | 核心关键词、重点 |

| `'accent'` | 白色加粗大字 | 强调内容 |

**示例**：SRT 中的一句 `99%是因为没有选题更新太慢`，可以拆成两行：

```jsx

{start: 2.633, end: 6.2, lines: [

  {text: "99%是因为", size: 48, type: 'sub'},

  {text: "没有选题  更新太慢", size: 80, type: 'gradient'}

]},

```

> 💡 **字号参考**：48-56 为小字，64-72 为正常，80-96 为大字强调。

### 6.6 添加背景音乐（可选）

如果你有背景音乐文件（比如 `bgm.mp3`），在代码中找到这一行：

```jsx

<Audio src={staticFile('audio.wav')} />

```

在它下面加一行：

```jsx

<Audio src={staticFile('bgm.mp3')} volume={0.15} />

```

> 💡 `volume={0.15}` 表示背景音乐音量为 15%。觉得太小就调大（最大 1），太大就调小。

### 6.7 预览效果

保存代码后，回到浏览器的 Remotion Studio 界面，页面会自动刷新。点击播放按钮预览效果。

如果字幕和音频不同步，调整 `subtitles` 数组中对应条目的 `start` 和 `end` 时间值。

> ⚠️ **中文引号注意事项**：代码中不能直接使用中文双引号 `""`，需要用 `「」` 替代。

> 例如：`从「靠灵感碰运气」变成流水线` ✅

> 而不是：`从"靠灵感碰运气"变成流水线` ❌

---

## 第七章 导出成品视频

### 7.1 通过 Studio 界面导出

1. 在 Remotion Studio 界面中，点击右上角的 **"Render"** 按钮

2. 在弹出的面板中，点击顶部的 **"视频"** 标签（不要选"仍然/Still"，那是导出图片的）

3. 确认设置：

   - Codec：**H.264**

   - 帧范围：**0 到最后一帧**

   - 输出名称：`out/HelloWorld.mp4`

4. 点击 **"Render video"** 按钮

5. 等待渲染完成

### 7.2 通过命令行导出（备选方法）

如果 Studio 界面的渲染按钮不好用，打开**新的命令行窗口**，输入：

```

cd C:\Users\你的用户名\my-video-project

npx remotion render HelloWorld out/video.mp4

```

### 7.3 找到成品视频

渲染完成后，视频文件位于：

```

C:\Users\你的用户名\my-video-project\out\HelloWorld.mp4

```

双击播放确认效果 ✅

---

## 第八章 日常使用：快速制作新视频

搭建完成后，以后每次制作新视频只需要以下步骤：

### 快速流程

```

第1步：写好文案

    ↓

第2步：修改 my_tts.py 中的文案内容，运行生成配音

    ↓

第3步：把生成的音频复制到 public 文件夹（命名为 audio.wav）

    ↓

第4步：用剪映识别字幕，导出 SRT 文件

    ↓

第5步：根据 SRT 时间戳，修改 HelloWorld.jsx 中的字幕数组

    ↓

第6步：修改 Root.jsx 中的视频时长（音频秒数 × 30）

    ↓

第7步：在 Studio 中预览，满意后点 Render 导出

```

### 日常操作的具体命令

**生成配音**（修改好 my_tts.py 中的文案后）：

```

py -3.11 C:\Users\你的用户名\my_tts.py

```

**启动 Remotion Studio**（如果关了的话）：

```

cd C:\Users\你的用户名\my-video-project

npm run dev

```

**导出视频**：

```

cd C:\Users\你的用户名\my-video-project

npx remotion render HelloWorld out/video.mp4

```

---

## 第九章 常见问题排查

### Q1：运行 `py -3.11` 提示找不到命令

**原因**：Python 3.11 没安装或没加入 PATH。

**解决**：重新安装 Python 3.11，安装时务必勾选 "Add python.exe to PATH"。

### Q2：TTS 安装报错 `Failed building wheel`

**原因**：没有安装 Visual Studio Build Tools。

**解决**：回到第一章 1.3，安装 Build Tools 后重启电脑再试。

### Q3：TTS 运行报错 `cannot import name 'BeamSearchScorer'`

**原因**：transformers 版本不对。

**解决**：

```

py -3.11 -m pip install transformers==4.33.0

```

### Q4：TTS 运行报错 `WeightsUnpickler error` 或 `weight_norm`

**原因**：PyTorch 版本不兼容。

**解决**：完全重装稳定版本组合：

```

py -3.11 -m pip uninstall TTS torch torchaudio transformers -y

py -3.11 -m pip install torch==2.1.0 torchaudio==2.1.0 --index-url https://download.pytorch.org/whl/cpu

py -3.11 -m pip install transformers==4.33.0 tokenizers==0.13.3

py -3.11 -m pip install TTS==0.21.0

```

### Q5：Remotion Studio 白屏

**原因**：代码有语法错误。

**解决**：

1. 查看启动 Remotion 的命令行窗口，找到红色的 `ERROR` 信息

2. 常见原因是代码中使用了中文双引号 `""`，改成 `「」`

3. 修复代码后保存，Studio 会自动刷新

### Q6：视频有画面但没声音

**检查清单**：

1. `audio.wav` 是否在 `public` 文件夹中？

2. 代码中是否有 `<Audio src={staticFile('audio.wav')} />` 这一行？

3. 浏览器是否静音了？检查播放栏的音量图标

4. 按 `Ctrl + Shift + R` 强制刷新浏览器

### Q7：字幕和音频对不上

**原因**：字幕时间戳不准确。

**解决**：

1. 重新用剪映识别字幕并导出 SRT

2. 对照 SRT 中的时间戳修改代码中 `subtitles` 数组的 `start` 和 `end` 值

3. 在 Studio 中拖动时间线逐句检查

### Q8：视频时长和音频不一致

**原因**：`Root.jsx` 中的 `durationInFrames` 设置不对。

**解决**：确保 `durationInFrames` = 音频秒数 × 30。例如 39 秒音频：

```jsx

durationInFrames={39 * 30}

```

### Q9：`npm run dev` 报错 `ENOENT: no such file or directory`

**原因**：没有进入项目目录。

**解决**：先执行 `cd C:\Users\你的用户名\my-video-project`，再执行 `npm run dev`。

### Q10：命令行窗口输入没反应

**原因**：当前窗口被 Remotion Studio 占用了。

**解决**：打开一个新的命令行窗口（按 `Win + R`，输入 `cmd`，回车）。

### Q11：用 Video Forge 插件生成新视频后，Remotion Studio 还是显示旧视频

**原因**：插件的输出路径和 Remotion Studio 的运行路径不一致。插件默认把文件写到库内的 `VideoForge/remotion-project/`，但 Remotion Studio 是从 `C:\remotion-project` 启动的。

**解决**：

1. 打开插件配置文件 `.obsidian/plugins/video-forge/data.json`
2. 把 `remotionProjectPath` 改成 `C:\\remotion-project`
3. 重启 Obsidian 让配置生效
4. 以后插件生成的文件会直接写到 `C:\remotion-project`，刷新浏览器即可看到新视频

**注意**：首次修改后需要手动把字体文件（`AlibabaPuHuiTi-3-45-Light.ttf` 和 `AlibabaPuHuiTi-3-55-Regular.ttf`）复制到 `C:\remotion-project\public\`，否则 Remotion 会报 NetworkError。字体文件只需复制一次，以后不用再管。

### Q12：Remotion Studio 报 NetworkError，页面崩溃

**常见原因**：`public` 文件夹里缺少字体文件。

**检查方法**：看浏览器控制台（F12），如果有 404 错误指向 `.ttf` 文件，说明字体缺失。

**解决**：找到字体文件复制到 `C:\remotion-project\public\`。字体文件可能在以下位置：
- `C:\Users\86155\Projects\VideoForge\remotion-project\public\`
- `03.参考资料库\03.工具资源\字体资源\` 目录下的 zip 包中

---

## 📁 项目文件结构参考

```

my-video-project/

├── public/                  ← 放音频和素材的地方

│   ├── audio.wav            ← 你的配音文件

│   ├── bgm.mp3              ← 背景音乐（可选）

│   └── subtitle.srt         ← 字幕文件（参考用）

├── src/

│   ├── HelloWorld.jsx       ← 视频内容代码（字幕、样式）

│   ├── Root.jsx             ← 视频配置（时长、分辨率）

│   └── index.js

├── out/                     ← 导出的视频在这里

│   └── HelloWorld.mp4

└── package.json

```

---

## 🔧 稳定版本速查表

以下是经过验证的稳定软件版本组合，遇到问题时可按此重装：

| 软件 | 版本 |

|------|------|

| Node.js | 18+ (LTS 推荐) |

| Python | **3.11**（不能用 3.12+） |

| PyTorch | **2.1.0** |

| torchaudio | **2.1.0** |

| transformers | **4.33.0** |

| tokenizers | **0.13.3** |

| TTS (Coqui) | **0.21.0** |

| TTS 模型 | xtts_v2 |

---

---

## 第十章 【选读】进阶：全自动字幕生成（Whisper 方案）

> 💡 本章是**可选内容**。如果你觉得第六章中手动对照 SRT 时间戳填写代码太麻烦，可以用本章的全自动方案替代第六章的 6.2-6.5 步骤。

>

> **效果**：一条命令，自动识别音频 → 自动生成带时间戳的字幕代码 → 直接写入项目，完全不需要手动操作。

### 10.1 安装 FFmpeg

Whisper 需要 FFmpeg 来读取音频文件。

在命令行中输入：

```

winget install Gyan.FFmpeg

```

- 如果提示"是否同意协议"，输入 `Y` 回车

- 等待下载安装完成（约 223MB）

- **安装完成后，关闭当前命令行窗口，打开一个新的**（这一步很重要，不然识别不到 ffmpeg）

验证安装：

```

ffmpeg -version

```

显示版本号即成功 ✅

### 10.2 安装 Whisper

在命令行中输入：

```

py -3.11 -m pip install openai-whisper

```

等待安装完成即可。

### 10.3 下载自动化脚本

将 `auto_video.py` 脚本放到 `C:\Users\你的用户名\` 目录下。

> 脚本下载地址：随本手册一起提供。

### 10.4 配置脚本

用记事本打开脚本：

```

notepad C:\Users\你的用户名\auto_video.py

```

只需要修改顶部**配置区**的 4 个参数：

```python

# 音频文件路径（改成你的实际路径）

AUDIO_PATH = r"C:\Users\你的用户名\my-video-project\public\audio.wav"

# Remotion 项目路径

PROJECT_PATH = r"C:\Users\你的用户名\my-video-project"

# 背景音乐文件名（不需要就留空 ""）

BGM_FILE = "你的背景音乐.mp3"

BGM_VOLUME = 0.15

```

修改完按 `Ctrl + S` 保存。

### 10.5 一键运行

```

py -3.11 C:\Users\你的用户名\auto_video.py

```

脚本会自动完成以下所有事情：

1. **加载 Whisper 模型**（首次运行需下载模型，约几百 MB，之后不用重新下载）

2. **识别音频**，精确到每句话的起止时间

3. **自动分配样式**：

   - 短句（6字以内）→ 蓝色渐变大字

   - 包含数字的句子 → 蓝色渐变大字

   - 包含问号的句子 → 白色大字强调

   - 中等长度句子 → 白色正文

   - 长句 → 较小白色正文

4. **自动生成 HelloWorld.jsx** 并写入你的 Remotion 项目

运行完成后会显示：

```

  ✅ 生成成功！

  📄 文件：...\src\HelloWorld.jsx

  🎬 字幕数：16 屏

  ⏱️  时长：约 40 秒

  👉 确认 Root.jsx 中 durationInFrames={40 * 30}

  👉 然后回到 Remotion Studio 预览效果

```

### 10.6 确认时长并预览

根据脚本提示，修改 `Root.jsx` 中的 `durationInFrames`，然后回到 Remotion Studio 预览。

如果满意就直接导出（参考第七章）。

### 10.7 使用全自动方案后的日常流程

```

第1步：写好文案

    ↓

第2步：修改 my_tts.py 中的文案内容，运行生成配音

    ↓

第3步：把音频复制到 public 文件夹（命名为 audio.wav）

    ↓

第4步：运行 py -3.11 auto_video.py（一键生成字幕代码）

    ↓

第5步：修改 Root.jsx 中的视频时长

    ↓

第6步：预览 → 导出

```

比基础流程少了"剪映识别 SRT"和"手动填写字幕代码"两个步骤，整体更快。

> ⚠️ **注意事项**：

> - Whisper 的 `base` 模型速度快但准确度一般，如果识别结果不理想，可以在配置区把 `WHISPER_MODEL` 改成 `"medium"` 或 `"large"`（但速度会慢很多）

> - 自动分配的样式可能不完全符合你的审美，可以在生成后手动微调 `HelloWorld.jsx` 中个别句子的 `type` 和 `size`

---

> 📝 **手册版本**：v1.0  

> **最后更新**：2026 年 2 月 14 日  

> **作者**：Ryanzh（Ouyang AI 运营团队）