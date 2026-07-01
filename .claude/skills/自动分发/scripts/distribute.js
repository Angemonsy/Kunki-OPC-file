/**
 * 多平台自动分发脚本（服务器端）
 *
 * 通过 CDP 连接服务器 Chrome，自动填写各平台发布页内容
 * 用户确认后才点发布
 *
 * 部署位置：/root/.openclaw/workspace/distribute.js
 * 调用方式：node distribute.js --platform=douyin --title="xxx" --desc="xxx" --images="/path/to/img1.jpg,/path/to/img2.jpg"
 */

const { chromium } = require('playwright');
const http = require('http');
const path = require('path');

// =================== 配置 ===================
const CDP_URL = 'http://127.0.0.1:9222';

// 各平台配置
const PLATFORMS = {
  douyin: {
    name: '抖音',
    uploadUrl: 'https://creator.douyin.com/creator-micro/content/upload?default-tab=3',
    postUrl: 'https://creator.douyin.com/creator-micro/content/post/image',
    selectors: {
      fileInput: 'input[type="file"]',
      titleInput: 'input[placeholder="添加作品标题"]',
      descEditor: 'div.editor-kit-container[contenteditable="true"]',
      publishBtn: 'button.primary-cECiOJ',
      publishBtnFallback: 'button:has-text("发布"):not(:has-text("高清发布"))',
    }
  },
  xiaohongshu: {
    name: '小红书',
    publishUrl: 'https://creator.xiaohongshu.com/publish/publish',
    selectors: {
      imageTabText: '上传图文',
      fileInput: 'input[type="file"]',
      titleInput: 'input[placeholder="填写标题会有更多赞哦"]',
      contentEditor: 'div.tiptap.ProseMirror',
      publishBtn: 'button:has-text("发布"):not(:has-text("发布笔记"))',
    }
  },
  bilibili: {
    name: 'B站',
    publishUrl: 'https://member.bilibili.com/platform/upload/text/edit',
    selectors: {
      titleInput: 'input[placeholder*="标题"], input[class*="title"]',
      contentEditor: 'div[contenteditable="true"]',
      publishBtn: 'button:has-text("发布"), span:has-text("发布")',
    }
  }
};

// =================== 核心函数 ===================

async function connectChrome() {
  const browser = await chromium.connectOverCDP(CDP_URL);
  const context = browser.contexts()[0];
  return { browser, context };
}

async function getOrCreatePage(context, url) {
  // 找已有tab
  const pages = context.pages();
  for (const page of pages) {
    if (page.url().includes(new URL(url).hostname)) {
      return page;
    }
  }
  // 没有就新建
  const page = await context.newPage();
  await page.goto(url);
  return page;
}

// ---------- 抖音 ----------
async function publishDouyin(context, { title, description, imagePaths }) {
  const config = PLATFORMS.douyin;
  console.log(`[${config.name}] 开始发布...`);

  const page = await getOrCreatePage(context, config.uploadUrl);
  await page.goto(config.uploadUrl);
  await page.waitForTimeout(2000);

  // 上传图片
  console.log(`[${config.name}] 上传图片: ${imagePaths.join(', ')}`);
  const fileInput = page.locator(config.selectors.fileInput).first();
  await fileInput.setInputFiles(imagePaths);

  // 等待跳转到发布页
  await page.waitForURL('**/content/post/image**', { timeout: 20000 });
  await page.waitForTimeout(2000);

  // 填标题
  console.log(`[${config.name}] 填写标题: ${title}`);
  const titleInput = page.locator(config.selectors.titleInput);
  await titleInput.click();
  await titleInput.fill(title);
  await page.waitForTimeout(500);

  // 填描述（contenteditable div）
  console.log(`[${config.name}] 填写描述...`);
  const descEditor = page.locator(config.selectors.descEditor).first();
  await descEditor.click();
  await page.waitForTimeout(300);
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');
  await page.keyboard.type(description, { delay: 30 });
  await page.waitForTimeout(1000);

  console.log(`[${config.name}] ✅ 预填完成，等待确认发布`);
  return { platform: 'douyin', status: 'ready', page };
}

// ---------- 小红书 ----------
async function publishXiaohongshu(context, { title, content, imagePaths }) {
  const config = PLATFORMS.xiaohongshu;
  console.log(`[${config.name}] 开始发布...`);

  const page = await getOrCreatePage(context, config.publishUrl);
  await page.goto(config.publishUrl);
  await page.waitForTimeout(2000);

  // 切到图文tab
  await page.evaluate((tabText) => {
    const spans = Array.from(document.querySelectorAll('span.title, span'));
    const tab = spans.find(s => s.textContent.trim() === tabText);
    if (tab) tab.click();
  }, config.selectors.imageTabText);
  await page.waitForTimeout(1500);

  // 上传图片
  console.log(`[${config.name}] 上传图片: ${imagePaths.join(', ')}`);
  const fileInput = page.locator(config.selectors.fileInput).first();
  await fileInput.setInputFiles(imagePaths);
  await page.waitForSelector(config.selectors.titleInput, { timeout: 20000 });
  await page.waitForTimeout(1000);

  // 填标题
  console.log(`[${config.name}] 填写标题: ${title}`);
  const titleInput = page.locator(config.selectors.titleInput);
  await titleInput.click();
  await titleInput.fill(title);
  await page.waitForTimeout(500);

  // 填正文
  console.log(`[${config.name}] 填写正文...`);
  const contentEditor = page.locator(config.selectors.contentEditor).first();
  await contentEditor.click();
  await page.waitForTimeout(300);
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');
  await page.keyboard.type(content, { delay: 30 });
  await page.waitForTimeout(1000);

  console.log(`[${config.name}] ✅ 预填完成，等待确认发布`);
  return { platform: 'xiaohongshu', status: 'ready', page };
}

// ---------- B站专栏 ----------
async function publishBilibili(context, { title, content, imagePaths }) {
  const config = PLATFORMS.bilibili;
  console.log(`[${config.name}] 开始发布...`);

  const page = await getOrCreatePage(context, config.publishUrl);
  await page.goto(config.publishUrl);
  await page.waitForTimeout(3000);

  // 填标题
  console.log(`[${config.name}] 填写标题: ${title}`);
  const titleInput = page.locator(config.selectors.titleInput).first();
  await titleInput.click();
  await titleInput.fill(title);
  await page.waitForTimeout(500);

  // 填正文
  console.log(`[${config.name}] 填写正文...`);
  const contentEditor = page.locator(config.selectors.contentEditor).first();
  await contentEditor.click();
  await page.waitForTimeout(300);
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');
  await page.keyboard.type(content, { delay: 30 });
  await page.waitForTimeout(1000);

  console.log(`[${config.name}] ✅ 预填完成，等待确认发布`);
  return { platform: 'bilibili', status: 'ready', page };
}

// ---------- 确认发布 ----------
async function confirmPublish(page, platform) {
  const config = PLATFORMS[platform];
  console.log(`[${config.name}] 用户确认，点击发布按钮...`);

  const publishBtn = page.locator(config.selectors.publishBtn || config.selectors.publishBtnFallback).first();
  await publishBtn.click();
  await page.waitForTimeout(3000);

  console.log(`[${config.name}] 🎉 已发布！`);
  return { platform, status: 'published' };
}

// =================== CLI入口 ===================
async function main() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    const [key, val] = arg.replace('--', '').split('=');
    args[key] = val;
  });

  const platform = args.platform;
  const title = args.title || '测试标题';
  const description = args.desc || args.content || '测试描述';
  const imagePaths = (args.images || '').split(',').filter(Boolean);

  if (!platform || !PLATFORMS[platform]) {
    console.log('用法: node distribute.js --platform=douyin|xiaohongshu|bilibili --title="标题" --desc="描述" --images="/path/img1.jpg,/path/img2.jpg"');
    console.log('支持平台:', Object.keys(PLATFORMS).join(', '));
    process.exit(1);
  }

  const { browser, context } = await connectChrome();

  try {
    let result;
    switch (platform) {
      case 'douyin':
        result = await publishDouyin(context, { title, description, imagePaths });
        break;
      case 'xiaohongshu':
        result = await publishXiaohongshu(context, { title, content: description, imagePaths });
        break;
      case 'bilibili':
        result = await publishBilibili(context, { title, content: description, imagePaths });
        break;
    }

    console.log(JSON.stringify({ ...result, page: undefined }));

    // 如果带 --confirm 参数，直接发布
    if (args.confirm === 'true' && result.page) {
      await confirmPublish(result.page, platform);
    }
  } catch (err) {
    console.error('错误:', err.message);
    process.exit(1);
  } finally {
    // 不关闭browser，保持连接
    await browser.close();
  }
}

// 导出供webhook调用
module.exports = { publishDouyin, publishXiaohongshu, publishBilibili, confirmPublish, connectChrome, PLATFORMS };

// CLI直接运行
if (require.main === module) {
  main();
}
