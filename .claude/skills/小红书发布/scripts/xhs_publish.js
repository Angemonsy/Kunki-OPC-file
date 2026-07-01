/**
 * 小红书图文自动发布脚本
 *
 * 使用方式：通过 Playwright MCP 的 browser_run_code 工具执行
 *
 * 参数说明（调用前替换）：
 *   TITLE     - 笔记标题（建议20字以内，带emoji效果更好）
 *   CONTENT   - 正文内容（含话题，格式：正文 #话题1 #话题2）
 *   IMG_PATHS - 图片路径数组（vault内绝对路径，支持多图，最多9张）
 *
 * 执行流程：
 *   1. 导航到小红书图文发布页
 *   2. 切换到"上传图文"tab
 *   3. 上传图片（触发表单展开）
 *   4. 等待图片上传完成
 *   5. 填写标题
 *   6. 填写正文（含话题）
 *   7. 停止，等待用户确认后再点发布
 */

// ===================== 配置区 =====================
const CONFIG = {
  title: 'TITLE',           // 替换为实际标题（20字以内）
  content: 'CONTENT',      // 替换为实际正文（含 #话题）
  imagePaths: ['IMG_PATH'], // 替换为实际图片路径数组（最多9张）

  // 选择器（2026-03-08 验证）
  selectors: {
    publishPage: 'https://creator.xiaohongshu.com/publish/publish',
    imageTabText: '上传图文',
    fileInput: 'input[type="file"]',
    titleInput: 'input[placeholder="填写标题会有更多赞哦"]',
    contentEditor: 'div.tiptap.ProseMirror',
    publishBtn: 'button:has-text("发布")',
  }
};
// ===================== 配置区结束 =====================

async function xhsPublish(page) {
  const log = (msg) => console.log(`[小红书发布] ${msg}`);

  try {
    // 步骤1: 导航到发布页
    log('导航到小红书发布页...');
    await page.goto(CONFIG.selectors.publishPage);
    await page.waitForTimeout(2000);

    // 步骤2: 切换到"上传图文"tab（用JS点击，绕过viewport限制）
    log('切换到上传图文 tab...');
    await page.evaluate((tabText) => {
      const spans = Array.from(document.querySelectorAll('span.title'));
      const tab = spans.find(s => s.textContent.trim() === tabText);
      if (tab) tab.click();
      else {
        // 备选：找所有包含该文字的可点击元素
        const els = Array.from(document.querySelectorAll('*')).filter(
          el => el.children.length === 0 && el.textContent.trim() === tabText
        );
        if (els.length > 0) els[0].click();
      }
    }, CONFIG.selectors.imageTabText);
    await page.waitForTimeout(1500);

    // 步骤3: 上传图片
    log(`上传图片: ${CONFIG.imagePaths.join(', ')}`);
    const fileInput = page.locator(CONFIG.selectors.fileInput).first();
    await fileInput.setInputFiles(CONFIG.imagePaths);

    // 步骤4: 等待图片上传完成（等待标题框出现）
    log('等待图片上传完成...');
    await page.waitForSelector(CONFIG.selectors.titleInput, { timeout: 20000 });
    await page.waitForTimeout(1000);
    log('图片上传完成，表单已展开');

    // 步骤5: 填写标题
    log(`填写标题: ${CONFIG.title}`);
    const titleInput = page.locator(CONFIG.selectors.titleInput);
    await titleInput.click();
    await titleInput.fill(CONFIG.title);
    await page.waitForTimeout(500);

    // 步骤6: 填写正文（TipTap ProseMirror 富文本编辑器）
    log(`填写正文: ${CONFIG.content.substring(0, 20)}...`);
    const contentEditor = page.locator(CONFIG.selectors.contentEditor).first();
    await contentEditor.click();
    await page.waitForTimeout(300);

    // 清空并输入内容
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    await page.waitForTimeout(200);
    await page.keyboard.type(CONFIG.content, { delay: 30 });
    await page.waitForTimeout(1000);

    // 步骤7: 截图确认，停在发布按钮前
    log('✅ 内容填写完成，截图确认中...');
    await page.screenshot({ path: 'xhs-ready-to-publish.png' });

    log('⏸️  已停在发布按钮前。请检查内容后回复"发布"继续，或"取消"放弃。');

    return {
      status: 'ready',
      message: '小红书图文内容已预填完成，等待确认发布',
      screenshotPath: 'xhs-ready-to-publish.png',
      title: CONFIG.title,
      content: CONFIG.content,
    };

  } catch (error) {
    log(`❌ 错误: ${error.message}`);
    await page.screenshot({ path: 'xhs-error.png' });
    throw error;
  }
}

// 执行
return await xhsPublish(page);
