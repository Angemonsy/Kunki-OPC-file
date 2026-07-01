const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const ctx = await chromium.launchPersistentContext('/root/.playwright-wechat-data', {
    executablePath: '/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome',
    headless: false,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const page = await ctx.newPage();

  console.log('访问公众号首页...');
  await page.goto('https://mp.weixin.qq.com', { waitUntil: 'networkidle', timeout: 30000 });

  const url = page.url();
  console.log('当前URL:', url);

  const tokenMatch = url.match(/token=(\d+)/);
  if (!tokenMatch) {
    console.log('未找到token，请检查登录态');
    await ctx.close();
    return;
  }
  const token = tokenMatch[1];
  console.log('token:', token);

  const publishUrl = 'https://mp.weixin.qq.com/cgi-bin/appmsgpublish?sub=list&begin=0&count=10&token=' + token;
  console.log('访问发表记录...');
  await page.goto(publishUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const articles = await page.evaluate(() => {
    const results = [];

    // 获取所有文章行容器
    const rows = document.querySelectorAll('.weui-desktop-mass-media.weui-desktop-mass-appmsg');
    console.log('找到文章行:', rows.length);

    rows.forEach(function(row, i) {
      // 标题：行内第一个 <a> 标签的文字
      var titleEl = row.querySelector('a');
      var title = titleEl ? titleEl.textContent.trim() : '';

      // 日期：行内 em.weui-desktop-mass__time
      var dateEl = row.querySelector('em.weui-desktop-mass__time');
      var date = dateEl ? dateEl.textContent.trim() : '';

      // 数据：行内 .weui-desktop-mass-media__data-list
      var dataEl = row.querySelector('.weui-desktop-mass-media__data-list');
      var dataText = dataEl ? dataEl.textContent.trim() : '';

      var read = (dataText.match(/(\d+)\s*阅读人数/) || [])[1] || '0';
      var like = (dataText.match(/(\d+)\s*点赞人数/) || [])[1] || '0';
      var share = (dataText.match(/(\d+)\s*分享人数/) || [])[1] || '0';
      var recommend = (dataText.match(/(\d+)\s*推荐人数/) || [])[1] || '0';
      var comment = (dataText.match(/(\d+)\s*留言条数/) || [])[1] || '0';

      results.push({
        index: i + 1,
        title: title,
        date: date,
        read: read,
        like: like,
        share: share,
        recommend: recommend,
        comment: comment
      });
    });

    return results;
  });

  console.log('\n=== 采集结果 ===');
  articles.forEach(function(a) {
    console.log('[' + a.index + '] ' + a.title);
    console.log('    日期:' + a.date + ' 阅读:' + a.read + ' 点赞:' + a.like + ' 分享:' + a.share + ' 推荐:' + a.recommend + ' 留言:' + a.comment);
  });

  // 生成 Markdown 表格行
  var today = new Date().toISOString().split('T')[0];
  var lines = ['', '> 最后采集：' + today, ''];
  articles.forEach(function(a) {
    var r = parseInt(a.read) || 0;
    var l = parseInt(a.like) || 0;
    var s = parseInt(a.share) || 0;
    var rc = parseInt(a.recommend) || 0;
    var interactRate = r > 0 ? (((l + s + rc) / r) * 100).toFixed(1) + '%' : '-';
    var collectRate = l > 0 ? ((s / l) * 100).toFixed(0) + '%' : '-';
    var dateStr = a.date ? '2026-' + a.date.replace('月', '-').replace('日', '') : '';
    lines.push('| ' + dateStr + ' | ' + a.title + ' | 公众号 | 文章 | ' + a.read + ' | ' + a.like + ' | ' + a.share + ' | ' + a.recommend + ' | ' + interactRate + ' | ' + collectRate + ' | 待评估 |');
  });

  var outputPath = '/root/.openclaw/data-reports/采集结果_' + today + '.txt';
  fs.writeFileSync(outputPath, lines.join('\n'));
  console.log('\n结果已写入: ' + outputPath);

  await ctx.close();
})();
