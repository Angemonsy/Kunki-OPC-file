/**
 * 抖音图文自动发布脚本
 *
 * 使用方式：通过 Playwright MCP 的 browser_run_code 工具执行
 *
 * 参数说明（调用前替换）：
 *   TITLE     - 作品标题（20字以内）
 *   DESC      - 作品描述（含话题，格式：正文描述 #话题1 #话题2）
 *   IMG_PATHS - 图片路径数组（vault内绝对路径）
 *
 * 执行流程：
 *   1. 导航到抖音图文上传页
 *   2. 上传图片（触发表单展开）
 *   3. 等待页面跳转到发布页
 *   4. 填写标题
 *   5. 填写描述（含话题）
 *   6. 停止，等待用户确认后再点发布
 */

// ===================== 配置区 =====================
const CONFIG = {
  title: 'TITLE',           // 替换为实际标题
  description: 'DESC',      // 替换为实际描述（含 #话题）
  imagePaths: ['IMG_PATH'], // 替换为实际图片路径数组

  // 选择器（2026-03-08 验证）
  selectors: {
    uploadPage: 'https://creator.douyin.com/creator-micro/content/upload?default-tab=3',
    fileInput: 'input[type="file"]',
    titleInput: 'input[placeholder="添加作品标题"]',
    descEditor: 'div.editor-kit-container[contenteditable="true"]',
    publishBtn: 'button:has-text("发布"):not(:has-text("高清发布"))',
  }
};
// ===================== 配置区结束 =====================

async function douyinPublish(page) {
  const log = (msg) => console.log(`[抖音发布] ${msg}`);

  try {
    // 步骤1: 导航到上传页
    log('导航到抖音图文上传页...');
    await page.goto(CONFIG.selectors.uploadPage);
    await page.waitForTimeout(2000);

    // 步骤2: 上传图片
    log(`上传图片: ${CONFIG.imagePaths.join(', ')}`);
    const fileInput = await page.locator(CONFIG.selectors.fileInput).first();
    await fileInput.setInputFiles(CONFIG.imagePaths);

    // 步骤3: 等待页面跳转到发布页
    log('等待页面跳转...');
    await page.waitForURL('**/content/post/image**', { timeout: 15000 });
    await page.waitForTimeout(2000);
    log('已进入发布页');

    // 步骤4: 填写标题
    log(`填写标题: ${CONFIG.title}`);
    const titleInput = await page.locator(CONFIG.selectors.titleInput);
    await titleInput.click();
    await titleInput.fill(CONFIG.title);
    await page.waitForTimeout(500);

    // 步骤5: 填写描述（contenteditable div，需要用 click + type）
    log(`填写描述: ${CONFIG.description.substring(0, 20)}...`);
    const descEditor = await page.locator(CONFIG.selectors.descEditor).first();
    await descEditor.click();
    await page.waitForTimeout(300);

    // 清空现有内容后输入
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    await page.waitForTimeout(200);

    // 逐字输入，触发话题识别（#话题名 后加空格）
    await page.keyboard.type(CONFIG.description, { delay: 30 });
    await page.waitForTimeout(1000);

    // 步骤6: 截图确认，停在发布按钮前等待用户确认
    log('✅ 内容填写完成，截图确认中...');
    await page.screenshot({ path: 'douyin-ready-to-publish.png' });

    log('⏸️  已停在发布按钮前。请检查内容后回复"发布"继续，或"取消"放弃。');

    return {
      status: 'ready',
      message: '抖音图文内容已预填完成，等待确认发布',
      screenshotPath: 'douyin-ready-to-publish.png',
      title: CONFIG.title,
      description: CONFIG.description,
    };

  } catch (error) {
    log(`❌ 错误: ${error.message}`);
    await page.screenshot({ path: 'douyin-error.png' });
    throw error;
  }
}

// 执行
return await douyinPublish(page);
