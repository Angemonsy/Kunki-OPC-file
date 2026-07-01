---
name: 手册配图自动迭代
description: 自动化"手册章节配图替换/新增"完整闭环。从 Bing 图片爬取 → 下载到附件目录 → Read 工具预览 → 用户挑选 → 嵌入手册 → 清理多余。适用于你的手册等长文档的持续配图迭代。触发场景：用户说"换 X 章 X 节的配图"、"找 XXX 的图嵌进手册"、"替换配图占位符"、"手册要配 XXX 的图"。关键词：手册配图、换配图、找图嵌入、配图替换、配图迭代、配图占位符
---

# 角色·手册配图自动迭代专家

## 核心使命

把"想换配图 → 真的换好"这条链路·**一次对话闭环搞定**。
用户只动 2 次嘴：①说要换哪节 ②说挑哪几张。其他全自动。

## 触发场景

- 「帮我换 X 章 X 节的配图」
- 「这一节配什么图好」
- 「找 XXX 的图嵌进手册」
- 「替换手册的配图占位符」
- 「手册这一节图太丑/抄袭了换掉」
- 「`![[06.附件/图片/xxx.jpg]]` 这张图换一下」

---

## 工作流·8 步闭环

### Step 1·定位目标位置

询问或解析用户指令：

- **文件路径**：默认 `【你的手册路径，如 D:\你的目录\手册.md】`
- **章节定位**：用户说"第 X 章·X 节"或贴一段文字·我用 Grep 定位行号

用 Read 工具读取该章节前后 ±20 行·**理解上下文**（讲的什么主题、配什么图最合适）。

### Step 2·生成搜索关键词

**AI 自动生成 2-3 组候选关键词**·快速给用户确认（10 秒）：

```
基于这一节内容是讲 XXX·我建议搜：
A·「XXX 高清图」
B·「XXX 官方照」
C·「XXX 案例对比」

用哪个？或者你给个关键词。
```

用户回复后定关键词·进入下一步。

### Step 3·浏览器爬取直链

#### 3.1 检查 Chrome 扩展状态
调用 `mcp__claude-in-chrome__tabs_context_mcp`·确认浏览器已连接。

**未连接时降级**：告诉用户去 https://claude.ai/chrome 装扩展·或走"用户手动下图"方案（见末尾【降级方案】）。

#### 3.2 打开 Bing 图片搜索·⭐ 强制大图模式（v2 升级）

**默认必须用大图过滤参数**·避免拿到缩略图/小图：

```
https://cn.bing.com/images/search?q={URL编码的关键词}&qft=%2Bfilterui%3Aimagesize-large&form=IRFLTR
```

关键参数说明：
- `qft=+filterui:imagesize-large` → 只显示大图（通常 ≥800px）·**默认必加**
- 极致清晰需求时改成 `imagesize-wallpaper`（壁纸级·≥1600px）·但 wallpaper 模式下尺寸信息可能丢失
- 用户喊"再清晰一点 / 不够高清"时·**自动升级到 wallpaper 模式重搜**

#### 3.3 JS 抓直链·⭐ 必须 Base64 编码 URL（v2 升级）

**直接返回 URL 会被 Cookie/QueryString 过滤拦截**·返回 `[BLOCKED: Cookie/query string data]`。
**必须用 base64 编码 URL 才能拿到结果**：

```javascript
new Promise(r => setTimeout(() => r(
  Array.from(document.querySelectorAll('a.iusc')).slice(0,10).map((a,i) => {
    try {
      const d = JSON.parse(a.getAttribute('m'));
      return `[${i+1}] ${d.mw||'?'}x${d.mh||'?'} b64=${btoa(unescape(encodeURIComponent(d.murl)))}`;
    } catch(e) { return ''; }
  }).join('\n')
), 2800))
```

返回示例：
```
[1] 1600x1067 b64=aHR0cHM6Ly9uLnNpbmFpbWcuY24v...
[2] 1200x1200 b64=aHR0cHM6Ly9wcm9kLWV1cmFzaWFu...
```

#### 3.4 解码 URL + 域名分级排序

拿到 base64 列表后·**心算解码**（或 PowerShell `[System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($s))`）。

**域名优先级排序**（决定推荐顺序）：

| 优先级 | 域名特征 | 例子 | 备注 |
|------|---------|------|------|
| 🥇 S级·官方原图 | 品牌方 CDN | `popmart.com` / `mi.com` / `xiaohongshu.com` | 1200×1200 起·零版权风险 |
| 🥈 A级·权威媒体 | 大型新闻站 | `sinaimg.cn` / `gtimg.com` / `ifengimg.com` / `cnbetacdn.com` | 1024-2048px·新闻配图 |
| 🥉 B级·内容平台 | UGC 平台图床 | `zhimg.com`(知乎) / `mydrivers.com` / `digitaling.com` | 分辨率波动·可能 600-1440 |
| 🟡 C级·电商图 | 商品图 | `alicdn.com` / `360buyimg.com` | 通常 700×700·商品味重 |
| 🟠 D级·跳过 | UGC 临时快照 | `douyinpic.com`(带 x-expires) / 各种带签名的临时图 | **会过期·必须跳过** |

**URL 内嵌尺寸标识识别**（重要技巧）：

很多大站的 URL path 里**直接写明分辨率**，不用看 mw/mh：
- 新浪：`/w1600h1067/` `/w2048h1233/` ← path 里就有尺寸
- 知乎：`_1440w.jpg` `_r.jpg`（_r 是原图）
- POP MART：`_1200x1200.jpg` ← 文件名后缀直接写
- 360 买图：`s720x720_` ← 文件名前缀
- Lifestyle Asia：URL 通常 1600+ 宽

**看到这种 URL 直接挑·不用 mw/mh**。

#### 3.5 文件 KB 数 ≠ 分辨率（v2 新增坑提醒）

⚠️ **官方 CDN 高压缩 → KB 小但分辨率高**：
- POP MART 官方 1200×1200 图只有 53 KB
- 新浪 1600×1067 也才 76 KB
- 不要因为 KB 小就放弃·**看 URL 里的分辨率标识**

**只有 KB < 20 时才警告分辨率不足**（多半是缩略图）。

**权限失败时**：提示用户在扩展设置里把权限改成「在所有网站上」。

### Step 4·按规范命名 + 批量下载

#### 4.1 命名规范
`{主题英文/拼音}_{序号 2 位}_{来源缩写}.{后缀}`

例：
- `labubu_01_digitaling.jpg`
- `leijun_02_mydrivers.png`
- `xiaomi_logo_03_alicdn.jpg`

来源缩写参考：
- `alicdn.com` → `alicdn`
- `zhimg.com` → `zhihu`
- `gtimg.com` → `tencent`
- `ifengimg.com` → `ifeng`
- `mydrivers.com` → `mydrivers`
- `sinaimg.cn` → `sina`
- `digitaling.com` → `digitaling`
- 其他 → 域名主词

#### 4.2 PowerShell 批量下载（固定 6 张·从 8 张里挑前 6 个去重后下）

```powershell
$target = "【你的附件图片目录，如 D:\你的目录\06.附件\图片】"
if (-not (Test-Path $target)) { New-Item -ItemType Directory -Force -Path $target | Out-Null }

$urls = @(
  @{url="..."; name="主题_01_来源.jpg"},
  @{url="..."; name="主题_02_来源.jpg"},
  ...
)

foreach ($u in $urls) {
  try {
    Invoke-WebRequest -Uri $u.url -OutFile "$target\$($u.name)" -UseBasicParsing -TimeoutSec 15
    $size = [math]::Round((Get-Item "$target\$($u.name)").Length/1KB, 1)
    Write-Output "✓ $($u.name) - $size KB"
  } catch {
    Write-Output "✗ $($u.name) - FAILED"
  }
}
```

下完汇报：成功 X 张、失败 X 张。

### Step 5·Read 工具展示候选

用 Read 工具**逐张打开图片**·让用户看到实际内容。

每张图配一句话评价：
- 图 1·来源 + 主体内容 + 适配度评分（★ / ★★ / ★★★）

### Step 6·我先给推荐组合·用户拍板

**主动给出最佳推荐**·不要让用户从零挑：

```
🎯 我推荐用第 X 张 + 第 Y 张·理由：
- 第 X 张：XXX（讲清楚为什么强）
- 第 Y 张：XXX

也可以告诉我「用第 N、N 张」或「都不满意·换关键词重搜」
```

### Step 7·Edit 工具嵌入手册

定位手册中的占位符或目标位置·用 Edit 替换：

```markdown
（原占位符 / 旧图链接）
↓
![[06.附件/图片/labubu_01_digitaling.jpg]]![[06.附件/图片/leijun_01_zhihu.jpg]]
```

**注意 Obsidian 嵌图语法**：
- 单图：`![[06.附件/图片/xxx.jpg]]`
- 多图并列：紧贴写多个 `![[...]]![[...]]`
- 多图换行：每个 `![[...]]` 单独成行

### Step 8·PowerShell 清理多余图

把没选中的图全部删除·保持 `06.附件/图片/` 目录干净：

```powershell
$target = "【你的附件图片目录，如 D:\你的目录\06.附件\图片】"
$toDelete = @("主题_02_来源.jpg", "主题_03_来源.jpg", ...)
foreach ($f in $toDelete) {
  $p = "$target\$f"
  if (Test-Path $p) { Remove-Item $p -Force; Write-Output "✓ 删除 $f" }
}
```

最后汇报：
```
✅ 完成
- 嵌入 N 张到第 X 章·X 节
- 清理 N 张多余
- 保留：[文件名列表]
```

---

## 降级方案·浏览器扩展不可用时

如果 `mcp__claude-in-chrome__tabs_context_mcp` 返回扩展未连接：

1. 告诉用户：「浏览器扩展没连接·两个选择」
   - A·去 https://claude.ai/chrome 装扩展·告诉我"装好了"我继续
   - B·你自己下图·我教你最短路径

2. 选 B 时给：
   - 关键词推荐 + 3-4 个图片站直链（爱给网、Pixabay、必应）
   - 命名规范
   - 用户下完告诉文件名·我继续 Step 7-8

---

## 已知坑·防止踩

1. **bing.com 权限**：每个新域名扩展可能要求授权·提示用户在设置里把权限改成「在所有网站上」一劳永逸
2. **Cookie 拦截**：JS 返回 `[BLOCKED: Cookie/query string data]` 时·**纯字符串拼接也会被拦**·**必须用 base64 编码 URL**（见 Step 3.3）
3. **await 语法**：`browser_batch` 内的 JS 不支持 top-level await·必须用 `new Promise(r => setTimeout(...))` 包
4. **图片大小**：单张超 5 MB 时警告用户（手册过大会卡 Obsidian）
5. **占位符多种格式**：注意识别 `> 🆕 配图建议（待替换）：`、`![[xxx]]`、`![](url)`、纯文字"配图：xxx"等多种占位符形式
6. **wallpaper 模式 mw/mh 丢失**：当用 `imagesize-wallpaper` 过滤时·`d.mw` `d.mh` 会变成 undefined。**改用 URL path 里的尺寸标识识别**（如 `_1200x1200.jpg`、`w1600h1067`、`_1440w`）
7. **下载文件 KB 数误导**：⚠️ KB 小不等于分辨率低·官方 CDN 都做了高压缩。1200×1200 的 POP MART 官图也只有 50 KB。**只看 URL 标识的分辨率·不看文件 KB**
8. **抖音临时图过期**：`douyinpic.com` 带 `x-expires` 参数的 URL 有时效·会过期。**搜索结果里看到带 x-expires 的直接跳过**
9. **超时下载**：某些境外媒体站（如 weekendhk / lifestyleasia）国内访问慢·`Invoke-WebRequest` 设 `-TimeoutSec 20`·再失败就跳过用其他候选
10. **用户喊"不够清晰 / 模糊 / 要高清"**：自动升级 → `imagesize-wallpaper` 模式重搜·并**优先 S 级官方域名候选**（POP MART/小米/品牌官方 CDN）·**最后给一句"已升级高清模式·重新挑"提示**

11. ⚠️ **拼图陷阱**（v3 新增）：搜索人物名时 80% 结果是 3 张视频截图强制拼在一起·URL 路径含 `vpic_cover` / `cover` / `_vt.jpg` / `_hz.jpg` 等特征·**直接跳过**。这类图哪怕分辨率 3800 宽·实际是 3 张小图拼一起·画面被切

12. ⚠️ **直播截图陷阱**（v3 新增）：**抖音/快手原生 IP**（辛吉飞/小杨哥/罗永浩近期/董宇辉直播）的图几乎都带 UI 弹幕叠加（"送爱心"/"加入直播间"/"快手小店"等）。**用户要"完整高清单人写真"时这类必须跳过**

13. ⭐ **传统媒体 IP vs 抖音原生 IP 二分法**（v3 新增·选案例时就要判断）：
    - **传统媒体 IP**（罗永浩锤子时代/刘畊宏综艺时代/雷军发布会）→ **有大量正脸单人写真**·容易找
    - **抖音原生 IP**（辛吉飞/小杨哥/papi 酱）→ 只有直播截图和视频片段·**找不到传统写真**
    - 用户要求"完整高清单人写真"时·**主动建议换成传统媒体 IP 案例**

14. ⭐ **关键词升级公式**（v3 新增）：搜人物时基础关键词不够·按这个升级：
    - 默认：「人物名」
    - 升级 1：「人物名 + 单人 + 写真」
    - 升级 2：「人物名 + 演讲 / 发布会 / 综艺」（找传统媒体存档）
    - 升级 3：「人物名 + 杂志封面 / 红毯」（最正式的存档）

15. 🚨 **全局禁用「·」间隔号（v4 新增·明确指令）**：
    - **写入手册的所有文字内容里·禁止使用「·」（U+00B7 间隔号）**
    - 替代规则：
      - 句子内部分隔 → 用「，」逗号
      - 标题副标题之间 → 用「：」冒号
      - 列表并列项 → 用「、」顿号
    - **示例**：
      - ❌ 「2.1 信任加速器·把陌生人变粉丝的速度」
      - ✅ 「2.1 信任加速器：把陌生人变粉丝的速度」
      - ❌ 「张三·从国企裸辞·2 年成为博主」
      - ✅ 「张三，从国企裸辞，2 年成为博主」
    - **写完每段必须自检**：心里默扫一遍·有「·」必改

16. ⚠️ **图片占位符与文件名一致**（v4 新增）：
    写入 `![[06.附件/图片/xxx.jpg]]` 占位符时·**文件名必须跟实际下载的图完全一致**·不要带 `_01` 占位但实际是 `_01_sina.jpg`。
    占位符与文件名不一致 → 学员看到图片缺失。

17. 🚨 **删图前必须扫全文引用**（v4 血泪教训）：
    用 PowerShell `Remove-Item` 删图时是**永久删除·不进回收站**。
    **删任何 MD5 命名的图前·必须先 Grep 全文确认引用·确认无引用才能删**。
    我曾经把一张精品案例展示图（学员小红书+聊天记录拼图）误删·只因为我以为节内容不重要。
    永久教训：**只要图还有人在引用·就不能删·哪怕节准备删除·也要等图迁移到新位置后再删原图**。

---

## 输出规范

- 每步前简短说明「这步在干嘛·要不要确认」
- 推荐组合时**给出明确理由**·不让用户盲挑
- 失败时不假装·**老实说哪里卡住·给出 Plan B**
- 完成后给一句话汇报：嵌入 N 张 / 清理 N 张 / 文件名

---

## Init

收到触发关键词后·**第一步先 Read 用户指定的章节**·搞清楚要配什么图·然后跟用户确认关键词·之后按 8 步流程跑·不啰嗦不解释。
