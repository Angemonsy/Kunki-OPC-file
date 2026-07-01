# 公众号数据自动采集 SOP

> 适用场景：通过 OpenClaw data bot 自动采集公众号后台文章数据（阅读/点赞/分享/推荐/留言），写入数据监控中心，并自动同步到 OneDrive 知识库。
> **状态**：✅ 完全跑通（2026-03-08 更新）

---

## 一、环境依赖（已完成 ✅）

| 组件                    | 状态  | 说明                                                                                |
| --------------------- | --- | --------------------------------------------------------------------------------- |
| Playwright + Chromium | ✅   | 路径：`/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`               |
| VNC + XFCE4 桌面        | ✅   | 连接：`43.155.136.139:5901`，密码：`Lj123456`                                            |
| Firefox               | ✅   | 备用浏览器，已安装                                                                         |
| 防火墙 5901 端口           | ✅   | 腾讯云控制台已开放                                                                         |
| 公众号登录态目录              | ✅   | `/root/.playwright-wechat-data`                                                   |
| 视频号登录态目录              | ✅   | `/root/.playwright-channels-data`                                                 |
| 续登脚本                  | ✅   | `/root/renew-login.sh`（每5-7天VNC里跑一次）                                              |
| 数据报告目录                | ✅   | `/root/.openclaw/data-reports/`                                                   |
| rclone                | ✅   | v1.73.1，已配置 OneDrive remote                                                       |
| OneDrive 同步目标         | ✅   | `总库20251219/monitor/`（英文路径，避免rclone中文乱码）                                          |
| 数据监控中心文件              | ✅   | 服务器本地 `/root/.openclaw/data-reports/monitor.md`，同步到 OneDrive `monitor/monitor.md` |

---

## 二、首次登录（需手动，约5分钟）

### ⏸️ 以下步骤需要人工操作

1. 打开 RealVNC Viewer，连接 `43.155.136.139:5901`，密码 `Lj123456`
2. 在 VNC 桌面打开终端（Applications → System → Xfce Terminal）
3. 执行快捷脚本：
   ```bash
   /root/open-wechat.sh
   ```
   脚本内容：
   ```bash
   #!/bin/bash
   /root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome \
     --no-sandbox \
     --disable-dev-shm-usage \
     --user-data-dir=/root/.playwright-wechat-data \
     https://mp.weixin.qq.com
   ```
4. 微信扫码登录公众号后台
5. 登录成功后关闭 Chromium
6. 登录态保存在 `/root/.playwright-wechat-data`，Playwright 脚本可复用

### 视频号首次登录

同样在 VNC 终端执行：
```bash
/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome \
  --no-sandbox \
  --disable-dev-shm-usage \
  --user-data-dir=/root/.playwright-channels-data \
  https://channels.weixin.qq.com
```
扫码登录视频号后台，登录成功后关闭 Chromium。

### 登录态有效期
- 公众号：约 **7天**
- 视频号：约 **3-7天**
- 过期后需 VNC 重新扫码

### 一键续登脚本

登录态快过期时，VNC 终端执行：
```bash
/root/renew-login.sh
```
脚本会依次打开公众号和视频号后台，扫码登录后关闭即可。建议每 **5-7天** 跑一次。

---

## 三、采集脚本

### 脚本位置
`/root/.openclaw/workspace/wechat_data_collector.js`

### 执行命令
```bash
cd /root/.openclaw/workspace && DISPLAY=:1 node wechat_data_collector.js
```

### 脚本逻辑
```
→ 启动 Chromium（复用登录态，headless模式）
  → 访问公众号后台首页
    → 从 URL 中提取 token
  → 拼接发表记录 URL：
    /cgi-bin/appmsgpublish?sub=list&begin=0&count=20&token={TOKEN}
  → 页面加载后抓取数据
    → 文章行选择器：.weui-desktop-mass-media.weui-desktop-mass-appmsg
    → 数据选择器：.weui-desktop-mass-media__data-list（按索引与行一一对应）
    → textContent 格式："421 阅读人数 17 点赞人数 67 分享人数 3 推荐人数 3 留言条数"
    → ⚠️ 不用中文正则！用 \d+ 提取所有数字，按顺序对应：[阅读, 点赞, 分享, 推荐, 留言]
  → 日期解析：支持"今天/昨天/星期X/X月X日"四种格式
  → 自动计算互动率和收藏率，标记爆款
  → 更新本地 /root/.openclaw/data-reports/monitor.md（已有文章更新数据，新文章追加）
  → rclone 同步到 OneDrive（onedrive:总库20251219/monitor/）
```

### 已确认的关键选择器
| 数据 | 选择器/来源 |
|------|-----------|
| 文章行容器 | `.weui-desktop-mass-media.weui-desktop-mass-appmsg` ✅ |
| 文章标题 | 行容器内 `a` 标签的 textContent ✅ |
| 发布日期 | `row.parentElement.querySelector('em.weui-desktop-mass__time')` ✅（日期在行容器的父级里，不在行容器内部）|
| 文章数据（阅读/点赞/分享等） | `.weui-desktop-mass-media__data-list`（⚠️ 不在行容器内部，需用 `querySelectorAll` 按索引对应） ✅ |
| token | URL 参数中提取 ✅ |

> **关键踩坑1**：`em.weui-desktop-mass__time` 不在 `.weui-desktop-mass-appmsg` 内部，是其父元素的子节点，必须用 `row.parentElement.querySelector(...)` 才能找到。
>
> **关键踩坑2**：`.weui-desktop-mass-media__data-list` 也不在行容器内部！不能用 `row.querySelector('.weui-desktop-mass-media__data-list')`，必须用 `document.querySelectorAll('.weui-desktop-mass-media__data-list')` 然后按索引 `dataEls[i]` 与 `rows[i]` 一一对应。
>
> **关键踩坑3**：`page.evaluate()` 里中文正则会失败（页面编码问题）。`(\d+)\s*阅读人数` 匹配不到任何东西，导致数据全是0。**正确做法：用 `\d+` 提取所有数字，按顺序对应**：`nums[0]=阅读, nums[1]=点赞, nums[2]=分享, nums[3]=推荐, nums[4]=留言`。

### 已抓到的数据样例
```
元素1: 421 阅读人数 17 点赞人数 67 分享人数 3 推荐人数 3 留言条数
元素2: 707 阅读人数 31 点赞人数 149 分享人数 8 推荐人数 1 留言条数
元素3: 277 阅读人数 9 点赞人数 25 分享人数 1 推荐人数 0 留言条数
元素4: 469 阅读人数 15 点赞人数 35 分享人数 3 推荐人数 1 留言条数
```

---

## 四、rclone OneDrive 配置（一次性，已完成 ✅）

> 无头服务器无法直接走 OAuth 浏览器授权，需要在本地获取 token 后写入服务器配置文件。

### 步骤一：本地获取 token（在 Windows PowerShell 执行）

```powershell
# 找到本地 rclone 位置
Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter "rclone.exe" -Recurse | Select-Object FullName

# 执行授权（会弹出浏览器登录 OneDrive）
& "C:\Users\86155\AppData\Local\Microsoft\WinGet\Packages\Rclone.Rclone_Microsoft.Winget.Source_8wekyb3d8bbwe\rclone-v1.73.1-windows-amd64\rclone.exe" authorize "onedrive"
```

登录完成后终端输出一段 JSON token，复制备用。

### 步骤二：在服务器写入配置文件

```bash
# 先获取 drive_id（用 token 中的 access_token 查 Graph API）
curl -s -H "Authorization: Bearer <access_token>" \
  "https://graph.microsoft.com/v1.0/me/drive" | python3 -m json.tool | grep -E '"id"|"driveType"'

# 写入 rclone 配置文件
cat > ~/.config/rclone/rclone.conf << 'EOF'
[onedrive]
type = onedrive
token = <上面获取的完整 JSON token>
drive_id = <上面查到的 id>
drive_type = personal
EOF
```

### 步骤三：验证连通性

```bash
rclone lsd onedrive:
# 能看到 OneDrive 根目录文件夹列表即成功
```

### 注意事项
- **token 自动续期**：rclone 用 refresh_token 自动刷新，正常使用不需要重新授权
- **90天失效**：超过 90 天完全不用才会失效，重新走上面流程即可
- **drive_id 必填**：rclone v1.73+ 要求配置中必须有 `drive_id`，否则报错

---

## 五、自动同步到 OneDrive

采集脚本内嵌同步，每次采集完自动推送 `monitor.md` 和 `collect_YYYY-MM-DD.txt` 到 OneDrive。

### 同步路径
```
服务器本地：/root/.openclaw/data-reports/monitor.md
  ↓ rclone copy
OneDrive：总库20251219/monitor/monitor.md
  ↓ OneDrive客户端自动同步
Obsidian：monitor/monitor.md
```

> ⚠️ **为什么用英文路径**：rclone在服务器上处理中文路径会乱码（服务器locale不支持UTF-8），所以同步目标改为 `onedrive:总库20251219/monitor/`，全英文路径稳定可靠。

### 手动触发同步
```bash
rclone copy /root/.openclaw/data-reports/monitor.md "onedrive:总库20251219/monitor/" --progress
```

### 数据监控中心文件说明
- **服务器上**：`/root/.openclaw/data-reports/monitor.md`（每次采集自动更新，已有文章更新数据，新文章追加）
- **Obsidian里**：`monitor/monitor.md`（OneDrive自动同步，打开即看最新数据）
- **旧文件**：`06.数据监控中心/采集结果/数据监控中心.md`（手动维护的历史版本，可保留作参考）

---

## 六、cron 定时任务（已配置 ✅）

**每天**早上9点自动采集 + 同步，无需人工干预。

### 当前配置
```bash
# 查看当前 crontab
crontab -l
# 关键行（⚠️ 必须用完整node路径，cron没有nvm环境）：
0 9 * * * DISPLAY=:1 cd /root/.openclaw/workspace && /root/.nvm/versions/node/v22.22.0/bin/node wechat_data_collector.js >> /root/.openclaw/logs/cron.log 2>&1
```

### 日志查看
```bash
# 查看最近执行日志
tail -50 /root/.openclaw/logs/cron.log
```

### 手动触发（不等定时）
```bash
cd /root/.openclaw/workspace && DISPLAY=:1 node wechat_data_collector.js
```

### 注意
- cron 跑时微信登录态必须有效（约7天），过期会静默失败，需 VNC 重新扫码
- 日志文件在 `/root/.openclaw/logs/cron.log`，出问题先看日志

---

## 七、数据 bot 集成（已完成 ✅）

数据 bot（`/root/.openclaw/agents/数据/workspace/AGENTS.md`）已写入「公众号数据采集」skill。

**触发词**：采集数据 / 跑采集 / 采集一下 / 更新数据

**bot 执行逻辑**：
1. 用 bash_tool 执行 `cd /root/.openclaw/workspace && DISPLAY=:1 node wechat_data_collector.js`
2. 判断输出结果（成功/登录态过期/其他报错）
3. 回报格式：`采集完成，共 N 篇，最新：{标题}（{日期}）阅读X 点赞X，已同步到知识库 ✅`

**支持平台**：飞书、Telegram（任意有数据 bot 的入口均可触发）

---

## 八、待完成事项

- [x] 找到文章标题的正确选择器
- [x] 找到发布日期的正确选择器
- [x] 标题+日期+数据对应关系
- [x] rclone 配置 OneDrive 同步
- [x] 采集结果自动同步到知识库
- [x] 配置 cron 定时自动执行（每天 09:00 自动跑，2026-03-08改为每天）
- [x] 数据 bot 集成采集 skill（飞书/Telegram 发指令即可触发）
- [x] 扩展视频号：channels_data_collector.js（视频列表）+ statistic_collector.js（每日汇总），周一周四 9:00/9:15 自动跑（2026-03-03）
- [x] 采集数据自动写入 monitor.md 并同步 OneDrive（自动计算互动率/收藏率/爆款标记，2026-03-08）
- [x] 修复 page.evaluate 中文正则失效问题（改用 \d+ 按顺序提取，2026-03-08）
- [x] 修复数据元素选择器对应关系（按索引对应而非行容器内查找，2026-03-08）
- [x] rclone同步路径改为英文目录（避免中文乱码，2026-03-08）
- [ ] 扩展：小红书、B站、抖音

---

## 九、故障排查

| 问题 | 解决方案 |
|------|---------|
| 脚本提示"需要登录" | VNC 连上去跑 `/root/open-wechat.sh` 重新扫码 |
| 锁文件冲突 | `pkill -f "chrome-linux64/chrome"` 杀掉残留进程再跑 |
| token 获取失败 | 检查登录态是否过期（约7天） |
| 选择器失效 | 公众号改版了，需要重新调试选择器 |
| 终端乱码 | 正常现象，服务器终端不支持中文显示 |
| 视频号采集0数据 | 检查 `/root/.playwright-channels-data` 登录态是否过期 |
| chromium路径报错 | 确认实际版本号：`ls /root/.cache/ms-playwright/`，当前为 `chromium-1208` |
| rclone 同步失败 `unable to get drive_id` | 配置文件 `drive_id` 为空，执行步骤二补上 |
| rclone token 过期 | 超过90天未用，重新走本地授权流程（步骤一~二） |
| OneDrive 文件不出现在 Obsidian | OneDrive 客户端未同步，右下角托盘图标手动触发一次 |
| 采集到20篇但数据全是0 | 中文正则失效，改用 `\d+` 按顺序提取（见踩坑区） |
| 数据元素找不到（dataEl为null） | 数据元素不在行容器内部，改用 `querySelectorAll` 按索引对应 |
| rclone 中文路径乱码 | 同步目标改为英文路径 `onedrive:总库20251219/monitor/` |
| SingletonLock 锁文件冲突 | `rm -f /root/.playwright-wechat-data/SingletonLock` |

---

## 十、实操经验沉淀

> 记录调试过程中踩过的坑和发现的技巧，SOP 里没写的非标知识。

### 踩坑

**🕳️ /tmp 目录跑不了 Playwright**
- **现象**：`node /tmp/script.js` 报 `Cannot find module 'playwright'`
- **原因**：`require('playwright')` 向上找 node_modules，/tmp 下没有
- **解法**：脚本必须放 `/root/.openclaw/workspace/`
- **日期**：2026-03-03

**🕳️ OrcaTerm 粘贴大段 heredoc 卡死**
- **现象**：粘贴超长 `cat << 'EOF'` 内容时终端卡住，Ctrl+C 无效
- **解法**：改用 `python3 << 'PYEOF'` 写 Python 字符串到文件，再 node 执行
  ```bash
  python3 << 'PYEOF'
  code = r"""
  // JS 代码
  """
  with open('/root/.openclaw/workspace/script.js', 'w') as f:
      f.write(code)
  PYEOF
  ```
- **日期**：2026-03-03

**🕳️ Python heredoc 写入的 JS 关键词被截断**
- **现象**：`break` 变成 `brea;k`，导致 ReferenceError
- **解法**：`sed -i 's/brea;k/break/' script.js` 修复；写入后用 `grep -n 'break' script.js` 验证
- **日期**：2026-03-03

**🕳️ 视频号"单篇视频" tab 点击超时**
- **现象**：`sf.click('text=单篇视频')` Timeout 30000ms，找不到元素
- **原因**：tab 文字不匹配或 tab 在 iframe 外层
- **解法**：改抓"全部视频"概览表，默认展示最近7天数据，不需要切 tab，稳定性更高
- **日期**：2026-03-03

**🕳️ page.evaluate 里中文正则匹配失败**
- **现象**：`dataText.match(/(\d+)\s*阅读人数/)` 返回 null，所有数据都是0
- **原因**：`page.evaluate()` 在浏览器页面上下文中执行，页面编码与正则的中文字符不兼容
- **解法**：不用中文正则，改用 `dt.match(/\d+/g)` 提取所有数字，按顺序对应：`nums[0]=阅读, nums[1]=点赞, nums[2]=分享, nums[3]=推荐, nums[4]=留言`
- **验证方法**：用 `check_data.js`（见下方技巧）单独提取数据元素的textContent和数字，确认能拿到值
- **日期**：2026-03-08

**🕳️ 数据元素不在行容器内部**
- **现象**：`row.querySelector('.weui-desktop-mass-media__data-list')` 返回 null
- **原因**：`.weui-desktop-mass-media__data-list` 在DOM树中不是 `.weui-desktop-mass-appmsg` 的子节点
- **解法**：用 `document.querySelectorAll('.weui-desktop-mass-media__data-list')` 获取所有数据元素，然后用 `dataEls[i]` 按索引与 `rows[i]` 一一对应
- **前提**：`rows.length === dataEls.length`（已验证：都是20）
- **日期**：2026-03-08

**🕳️ rclone 处理中文路径乱码**
- **现象**：`rclone copy "onedrive:总库20251219/02.领域/..." /local/` 失败，路径被截断或乱码
- **原因**：服务器 locale 不支持 UTF-8（`LANG=en_US` 而非 `en_US.UTF-8`）
- **解法**：同步目标改为全英文路径 `onedrive:总库20251219/monitor/`，在 Obsidian 里通过 `monitor/monitor.md` 查看
- **日期**：2026-03-08

**🕳️ SingletonLock 残留导致浏览器启动失败**
- **现象**：`Failed to create /root/.playwright-wechat-data/SingletonLock: File exists`
- **原因**：上次 Playwright 进程异常退出，锁文件没清理
- **解法**：`rm -f /root/.playwright-wechat-data/SingletonLock`，在脚本启动前执行
- **日期**：2026-03-08

**🕳️ cron里用裸`node`导致采集静默失败**
- **现象**：cron.log里出现 `/bin/sh: line 1: node: command not found`，采集从不执行
- **原因**：cron环境没有nvm的PATH，`node`命令找不到
- **解法**：crontab里所有node调用必须用完整路径 `/root/.nvm/versions/node/v22.22.0/bin/node`
- **验证**：`crontab -l | grep -c "&& node "` 返回0表示全部修好
- **日期**：2026-03-09

**🕳️ Xvnc和Xvfb同时绑定DISPLAY=:1导致Chromium启动失败**
- **现象**：cron.log里出现 `Missing X server or $DISPLAY`、`The platform failed to initialize`
- **原因**：Xvnc(VNC桌面)和Xvfb(虚拟帧缓冲)都绑到`:1`，后启动的抢占了端口
- **解法**：只保留Xvnc（`kill <Xvfb_PID>`），或让Xvfb用`:2`
- **日期**：2026-03-09

### 技巧

**💡 快速验证数据元素内容**
- 在 `/root/.openclaw/workspace/` 创建 `check_data.js`，用Playwright打开文章列表页，输出前3个数据元素的textContent和提取的数字
- 是排查"数据全是0"问题的最快方法

**💡 OrcaTerm 看完整脚本输出**
- 终端滚不上去时：`DISPLAY=:1 node script.js > /tmp/out.txt 2>&1 && head -30 /tmp/out.txt`

**💡 Ant Design 表格采集方式**
- 视频号数据中心用 Ant Design，原生 `<table>` 选择器无效
- 正确写法：`.ant-table-tbody tr td`，用 `.filter(r => r.length >= 6)` 过滤空行

**💡 视频号 iframe 定位**
- frame name 是 `statistic`，不是 `content`
- 用 `for (const f of page.frames()) { if (f.name() === 'statistic') ... }` 找

---

## 十一、扩展其他平台

公众号跑通后，其他平台复用同一套框架：

| 平台 | 创作者后台 URL | 登录方式 | 登录态保持 |
|------|--------------|---------|-----------|
| 公众号 | mp.weixin.qq.com | 扫码 | ~7天 |
| 小红书 | creator.xiaohongshu.com | 扫码/手机号 | ~7-14天 |
| B站 | member.bilibili.com | 扫码/密码 | ~30天 |
| 视频号 | channels.weixin.qq.com | 扫码 | ~3-7天 |
| 抖音 | creator.douyin.com | 扫码 | ~1-3天 |

每个平台只需要：
1. VNC 里用对应 user-data-dir 启动 Chromium 登录一次
2. 复制 wechat_data_collector.js 改选择器
3. 加到 data bot 的定时任务里
