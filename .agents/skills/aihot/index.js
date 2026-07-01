/**
 * AI HOT Skill - 获取最新AI资讯
 * 从 aihot.virxact.com API 拉取最新AI热点资讯
 * 遵循官方路由规则：默认精选，仅明确说"日报"才走daily端点
 */

const https = require('https');

// User-Agent 必须带浏览器标识，否则会被403
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/**
 * 发送HTTP GET请求
 * @param {string} url
 * @returns {Promise<any>}
 */
function get(url) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    options.headers = {
      'User-Agent': UA,
      'Accept': 'application/json'
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`JSON parse error: ${e.message}, data: ${data.slice(0, 200)}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * ISO时间转中文相对时间
 * @param {string} isoStr
 * @returns {string}
 */
function formatTimeToRelative(isoStr) {
  const date = new Date(isoStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 转北京时间
  const beijingDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const month = beijingDate.getUTCMonth() + 1;
  const day = beijingDate.getUTCDate();
  const hours = beijingDate.getUTCHours().toString().padStart(2, '0');
  const minutes = beijingDate.getUTCMinutes().toString().padStart(2, '0');

  if (diffMin < 60) {
    return `${diffMin}分钟前`;
  } else if (diffHour < 24) {
    return `${diffHour}小时前`;
  } else if (diffDay < 7) {
    return `${diffDay}天前 · ${month}/${day} ${hours}:${minutes}`;
  } else {
    return `${month}/${day} ${hours}:${minutes}`;
  }
}

/**
 * 分类中文名称映射
 */
const categoryLabels = {
  'ai-models': '模型发布/更新',
  'ai-products': '产品发布/更新',
  'industry': '行业动态',
  'paper': '论文研究',
  'tip': '技巧与观点',
  'null': '其他'
};

/**
 * 按分类分组
 * @param {Array} items
 * @returns {Object}
 */
function groupByCategory(items) {
  const groups = {};
  items.forEach(item => {
    const cat = item.category || 'null';
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(item);
  });
  return groups;
}

/**
 * 生成精选列表输出
 * @param {Object} data
 * @param {string} sinceText
 * @returns {string}
 */
function formatSelectedOutput(data, sinceText) {
  const groups = groupByCategory(data.items);
  let counter = 1;
  let output = `**AI HOT 资讯精选${sinceText ? ` · ${sinceText}` : ''}**\n\n`;

  Object.keys(groups).forEach(cat => {
    const label = categoryLabels[cat] || cat;
    output += `## ${label}\n`;
    groups[cat].forEach(item => {
      const timeStr = item.publishedAt ? formatTimeToRelative(item.publishedAt) : '';
      const summary = item.summary ? item.summary : '';
      output += `${counter}. **${item.title}** — ${item.source}\n`;
      if (timeStr) output += `   ${timeStr}\n`;
      if (summary) output += `   ${summary}\n`;
      output += `   🔗 ${item.url}\n\n`;
      counter++;
    });
  });

  output += `\n数据来源：[AI HOT](https://aihot.virxact.com)`;
  return output;
}

/**
 * 格式化日报输出
 * @param {Object} data
 * @returns {string}
 */
function formatDailyOutput(data) {
  let counter = 1;
  let output = `**AI HOT 日报 · ${data.date}**\n\n`;

  if (data.lead && data.lead.leadParagraph) {
    output += `**${data.lead.title}**\n${data.lead.leadParagraph}\n\n`;
  }

  data.sections.forEach(section => {
    output += `## ${section.label}\n`;
    section.items.forEach(item => {
      output += `${counter}. **${item.title}** — ${item.sourceName}\n`;
      if (item.summary) {
        const shortSummary = item.summary.length > 60
          ? item.summary.slice(0, 57) + '...'
          : item.summary;
        output += `   ${shortSummary}\n`;
      }
      output += `   🔗 ${item.sourceUrl}\n\n`;
      counter++;
    });
  });

  if (data.flashes && data.flashes.length > 0) {
    output += `## 快讯\n`;
    data.flashes.forEach(flash => {
      const timeStr = formatTimeToRelative(flash.publishedAt);
      output += `- **${flash.title}** — ${flash.sourceName} (${timeStr})\n  🔗 ${flash.sourceUrl}\n`;
    });
    output += '\n';
  }

  output += `\n数据来源：[AI HOT](https://aihot.virxact.com)`;
  return output;
}

/**
 * 主函数
 * @param {Object} args
 * @returns {Promise<string>}
 */
async function main(args) {
  try {
    const query = args.query || args.q || '';
    const mode = args.mode || 'selected'; // selected / all
    const category = args.category || null;
    const days = args.days || null; // 最近N天
    const date = args.date || null; // 指定日期日报

    // 如果指定了日期，拉取指定日期日报
    if (date) {
      const url = `https://aihot.virxact.com/api/public/daily/${date}`;
      const data = await get(url);
      return formatDailyOutput(data);
    }

    // 如果用户明确说"日报"，拉取最新日报
    if (query && query.toLowerCase().includes('日报')) {
      const url = `https://aihot.virxact.com/api/public/daily`;
      const data = await get(url);
      return formatDailyOutput(data);
    }

    // 计算时间窗口
    let sinceText = '';
    let sinceParam = '';
    if (days) {
      const since = new Date();
      since.setDate(since.getDate() - days);
      sinceParam = `&since=${since.toISOString()}`;
      sinceText = `最近 ${days} 天`;
    } else if (query && (query.includes('今天') || query.includes('昨日') || query.includes('24小时'))) {
      const since = new Date();
      since.setHours(since.getHours() - 24);
      sinceParam = `&since=${since.toISOString()}`;
      sinceText = '最近 24 小时';
    }

    // 构建URL
    let url = `https://aihot.virxact.com/api/public/items?mode=${mode}&take=50${sinceParam}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (query && !query.includes('日报')) {
      url += `&q=${encodeURIComponent(query)}`;
    }

    const data = await get(url);

    if (data.count === 0) {
      return '没有找到匹配的AI资讯，请调整搜索条件试试。';
    }

    return formatSelectedOutput(data, sinceText);

  } catch (error) {
    return `获取AI资讯失败: ${error.message}\n\n请检查网络连接，或稍后重试。`;
  }
}

// 执行
if (require.main === module) {
  const args = {};
  // 解析命令行参数
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--query=')) args.query = arg.slice(8);
    if (arg.startsWith('--days=')) args.days = parseInt(arg.slice(7));
    if (arg.startsWith('--date=')) args.date = arg.slice(7);
    if (arg.startsWith('--mode=')) args.mode = arg.slice(7);
    if (arg.startsWith('--category=')) args.category = arg.slice(11);
  });
  main(args).then(result => {
    console.log(result);
    process.exit(0);
  }).catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = { main, get, formatSelectedOutput, formatDailyOutput };
