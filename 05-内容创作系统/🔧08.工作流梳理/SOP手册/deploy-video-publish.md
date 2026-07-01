# 视频发布模块部署包

## 抖音DOM探索结论（2026-03-08）

- **文件input选择器**：`input[type=file]`（页面唯一一个，隐藏式）
- **accept**：`video/x-flv,video/mp4,video/x-m4v,video/*,.flv,.avi,.wmv,.webm,.ts,.mp4,.mpeg4,.mov,.m4v,.mpg,.mkv,.m4`
- **父容器class**：`container-drag-VAfIfu`
- **标题输入框**：`input[placeholder*="标题"]`（上传完成后出现）
- **描述区**：`.zone-container`
- **发布按钮**：`button:has-text("发布")`

---

## 部署命令（在服务器执行）

```bash
# 1. 备份旧版本
cp /root/.openclaw/workspace/distribute/distribute.js /root/.openclaw/workspace/distribute/distribute.js.bak

# 2. 下载新版本（部署后更新gist地址）
curl -sL https://gist.github.com/ouyanglinjie0712-alt/[新GIST_ID]/raw/distribute.js \
  -o /root/.openclaw/workspace/distribute/distribute.js

# 3. 重启服务
systemctl restart distribute-webhook

# 4. 查看日志
journalctl -u distribute-webhook -f
```

---

## publishDouyinVideo 函数代码

```javascript
async function publishDouyinVideo(browser, { title, content, videoPath, tags = [] }) {
  const ctx = browser.contexts()[0];
  const page = await ctx.newPage();
  try {
    await page.goto('https://creator.douyin.com/creator-micro/content/upload', {
      waitUntil: 'networkidle', timeout: 30000
    });
    await page.waitForTimeout(3000);

    // 上传视频文件（input[type=file] 是页面唯一的文件输入框）
    const fileInput = page.locator('input[type=file]').first();
    await fileInput.setInputFiles(videoPath);

    // 等待上传完成：标题输入框出现（最多等2分钟）
    await page.waitForSelector('input[placeholder*="标题"]', { timeout: 120000 });
    await page.waitForTimeout(2000);

    // 填写标题（抖音限55字）
    const titleInput = page.locator('input[placeholder*="标题"]').first();
    await titleInput.fill(title.substring(0, 55));

    // 填写描述正文
    const descArea = page.locator('.zone-container').first();
    if (await descArea.count() > 0) {
      await descArea.click();
      await page.keyboard.type(content.substring(0, 2200));
    }

    // 填写话题标签（最多5个）
    for (const tag of tags.slice(0, 5)) {
      await page.keyboard.type(' #' + tag);
      await page.waitForTimeout(800);
      const suggestion = page.locator('[class*="topicItem"]').first();
      if (await suggestion.count() > 0) {
        await suggestion.click();
        await page.waitForTimeout(500);
      }
    }

    // 点击发布按钮
    const publishBtn = page.locator('button:has-text("发布")').last();
    await publishBtn.click();
    await page.waitForTimeout(5000);

    return { success: true, platform: 'douyin', title };
  } catch (err) {
    await page.screenshot({ path: '/tmp/douyin_error.png' });
    throw err;
  } finally {
    await page.close();
  }
}
```

---

## publishXiaohongshuVideo 函数代码

（小红书DOM待探索，占位）

```javascript
async function publishXiaohongshuVideo(browser, { title, content, videoPath, tags = [] }) {
  // TODO: 探索小红书创作者中心视频上传页DOM
  // URL: https://creator.xiaohongshu.com/publish/publish
  throw new Error('小红书视频发布待实现');
}
```

---

## webhook 新增 videoPath 参数说明

`POST /distribute` 请求体新增字段：

```json
{
  "platform": "douyin",
  "title": "视频标题",
  "content": "视频描述文字",
  "videoPath": "/root/zongku20251219/02.领域/0.内容创作系统/🔥02.发布文案/视频待发布/xxx.mp4",
  "tags": ["AI副业", "自媒体"],
  "secret": "openclaw2026"
}
```

videoPath 是服务器上的绝对路径（知识库已同步到 `/root/zongku20251219/`）。

---

## distribute.js 完整更新要点

在现有代码基础上修改：

1. **`POST /distribute` 路由**：读取 `videoPath` 字段，传给发布函数
2. **`executePublish()` 函数**：根据 platform 分发到对应函数
3. **新增** `publishDouyinVideo()` 函数（见上方）
4. **修改** `publishDouyin()` 函数名为 `publishDouyinText()`（文字/图文）

路由分发逻辑：

```javascript
async function executePublish(task) {
  const { platform, videoPath } = task;
  if (videoPath) {
    // 视频发布模式
    if (platform === 'douyin') return publishDouyinVideo(browser, task);
    if (platform === 'xiaohongshu') return publishXiaohongshuVideo(browser, task);
  } else {
    // 图文发布模式（原有逻辑）
    if (platform === 'douyin') return publishDouyinText(browser, task);
    if (platform === 'xiaohongshu') return publishXiaohongshu(browser, task);
  }
}
```
