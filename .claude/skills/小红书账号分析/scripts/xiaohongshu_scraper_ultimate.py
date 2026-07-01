#!/usr/bin/env python3
"""
小红书账号数据爬取工具 - 终极版
使用最强反检测技术突破小红书安全验证

特性：
1. Playwright Stealth - 隐藏自动化特征
2. 真实浏览器指纹模拟
3. 可视化浏览器模式（可手动通过验证）
4. 完整的Cookie管理
5. 智能等待和重试机制
"""

import json
import re
import time
from urllib.parse import urlparse, parse_qs
from typing import Dict, Optional, List
import sys
import random

# 导入Playwright
try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False
    print("[ERROR] Playwright未安装", file=sys.stderr)
    sys.exit(1)

# 导入Stealth插件
try:
    from playwright_stealth import stealth_sync
    STEALTH_AVAILABLE = True
except ImportError:
    STEALTH_AVAILABLE = False
    print("[WARN] playwright-stealth未安装，反检测能力降低", file=sys.stderr)


class XiaohongshuScraperUltimate:
    """小红书账号数据爬取器 - 终极版"""

    def __init__(self, headless: bool = False):
        """
        初始化爬虫

        参数:
            headless: 是否使用无头模式（False=显示浏览器窗口，可手动通过验证）
        """
        self.headless = headless
        self.max_retries = 3

    def extract_user_id(self, url: str) -> Optional[str]:
        """从URL中提取用户ID"""
        try:
            match = re.search(r'/user/profile/([a-zA-Z0-9]+)', url)
            if match:
                return match.group(1)

            parsed = urlparse(url)
            params = parse_qs(parsed.query)
            if 'user_id' in params:
                return params['user_id'][0]

            return None
        except Exception as e:
            return None

    def scrape_account(self, url: str, cookies: str = None) -> Dict:
        """
        主函数：爬取小红书账号完整数据

        参数:
            url: 小红书账号链接
            cookies: 可选的Cookie字符串

        返回格式:
        {
            'success': bool,
            'user_info': {...},
            'notes': [...],
            'error': str (如果失败),
            'method_used': str
        }
        """
        user_id = self.extract_user_id(url)
        if not user_id:
            return {
                'success': False,
                'error': '无法从URL中提取用户ID，请检查链接格式'
            }

        print(f"\n{'='*60}", file=sys.stderr)
        print(f"[INFO] 小红书账号爬取工具 - 终极版", file=sys.stderr)
        print(f"[INFO] 用户ID: {user_id}", file=sys.stderr)
        print(f"[INFO] 模式: {'无头模式' if self.headless else '可视化模式（可手动通过验证）'}", file=sys.stderr)
        print(f"[INFO] Cookie: {'已提供' if cookies else '未提供'}", file=sys.stderr)
        print(f"[INFO] Stealth: {'已启用' if STEALTH_AVAILABLE else '未启用'}", file=sys.stderr)
        print(f"{'='*60}\n", file=sys.stderr)

        return self._scrape_with_playwright(url, user_id, cookies)

    def _scrape_with_playwright(self, url: str, user_id: str, cookies: str = None) -> Dict:
        """使用Playwright进行爬取"""
        try:
            print("[INFO] 启动浏览器...", file=sys.stderr)

            with sync_playwright() as p:
                # 启动浏览器
                browser = p.chromium.launch(
                    headless=self.headless,
                    args=[
                        '--disable-blink-features=AutomationControlled',
                        '--disable-dev-shm-usage',
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-web-security',
                        '--disable-features=IsolateOrigins,site-per-process',
                        '--disable-site-isolation-trials'
                    ]
                )

                # 创建上下文（模拟真实浏览器）
                context = browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    locale='zh-CN',
                    timezone_id='Asia/Shanghai',
                    permissions=['geolocation'],
                    geolocation={'latitude': 39.9042, 'longitude': 116.4074},  # 北京
                    color_scheme='light',
                    device_scale_factor=1,
                    has_touch=False,
                    is_mobile=False,
                    java_script_enabled=True
                )

                # 添加Cookie
                if cookies:
                    cookie_list = []
                    for cookie in cookies.split('; '):
                        if '=' in cookie:
                            name, value = cookie.split('=', 1)
                            cookie_list.append({
                                'name': name.strip(),
                                'value': value.strip(),
                                'domain': '.xiaohongshu.com',
                                'path': '/'
                            })
                    if cookie_list:
                        context.add_cookies(cookie_list)
                        print(f"[INFO] 已添加 {len(cookie_list)} 个Cookie", file=sys.stderr)

                page = context.new_page()

                # 应用Stealth技术
                if STEALTH_AVAILABLE:
                    print("[INFO] 应用Stealth反检测技术...", file=sys.stderr)
                    stealth_sync(page)

                # 添加额外的反检测脚本
                page.add_init_script("""
                    // 隐藏webdriver
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined
                    });

                    // 模拟真实的Chrome
                    Object.defineProperty(navigator, 'plugins', {
                        get: () => [1, 2, 3, 4, 5]
                    });

                    Object.defineProperty(navigator, 'languages', {
                        get: () => ['zh-CN', 'zh', 'en-US', 'en']
                    });

                    // 覆盖permissions
                    const originalQuery = window.navigator.permissions.query;
                    window.navigator.permissions.query = (parameters) => (
                        parameters.name === 'notifications' ?
                            Promise.resolve({ state: Notification.permission }) :
                            originalQuery(parameters)
                    );

                    // 添加Chrome对象
                    window.chrome = {
                        runtime: {}
                    };
                """)

                print(f"[INFO] 访问页面: {url}", file=sys.stderr)

                if not self.headless:
                    print("\n" + "="*60, file=sys.stderr)
                    print("[提示] 浏览器窗口已打开！", file=sys.stderr)
                    print("[提示] 如果出现安全验证，请手动完成验证", file=sys.stderr)
                    print("[提示] 验证完成后，脚本会自动继续抓取数据", file=sys.stderr)
                    print("="*60 + "\n", file=sys.stderr)

                # 访问页面
                try:
                    response = page.goto(url, wait_until='domcontentloaded', timeout=60000)

                    if not response or response.status != 200:
                        browser.close()
                        return {
                            'success': False,
                            'error': f'页面加载失败，状态码: {response.status if response else "None"}'
                        }
                except Exception as e:
                    print(f"[WARN] 页面加载异常: {e}", file=sys.stderr)

                # 等待页面加载
                print("[INFO] 等待页面内容加载...", file=sys.stderr)
                time.sleep(5)

                # 检查是否有安全验证
                page_title = page.title()
                page_content = page.content()

                if '安全验证' in page_title or '验证' in page_title:
                    print("\n" + "!"*60, file=sys.stderr)
                    print("[警告] 检测到安全验证页面！", file=sys.stderr)

                    if not self.headless:
                        print("[提示] 请在浏览器窗口中手动完成验证", file=sys.stderr)
                        print("[提示] 完成后按回车继续...", file=sys.stderr)
                        print("!"*60 + "\n", file=sys.stderr)
                        input()  # 等待用户完成验证

                        # 重新获取页面内容
                        time.sleep(2)
                        page_title = page.title()
                    else:
                        browser.close()
                        return {
                            'success': False,
                            'error': '触发安全验证，请使用非headless模式（--no-headless）手动通过验证'
                        }

                print(f"[INFO] 页面标题: {page_title}", file=sys.stderr)

                # 提取数据
                print("[INFO] 提取用户信息...", file=sys.stderr)
                user_info = self._extract_user_info(page)

                print("[INFO] 提取笔记列表...", file=sys.stderr)
                notes = self._extract_notes(page)

                browser.close()

                if user_info and (user_info.get('nickname') or user_info.get('follower_count')):
                    print("\n" + "="*60, file=sys.stderr)
                    print("[SUCCESS] 数据爬取成功！", file=sys.stderr)
                    print(f"[INFO] 账号: {user_info.get('nickname', 'N/A')}", file=sys.stderr)
                    print(f"[INFO] 粉丝: {user_info.get('follower_count', 'N/A')}", file=sys.stderr)
                    print(f"[INFO] 笔记数: {len(notes)}", file=sys.stderr)
                    print("="*60 + "\n", file=sys.stderr)

                    return {
                        'success': True,
                        'user_id': user_id,
                        'user_info': user_info,
                        'notes': notes,
                        'note_count': len(notes),
                        'method_used': 'playwright_ultimate'
                    }
                else:
                    return {
                        'success': False,
                        'error': '无法提取用户信息，可能需要登录或Cookie'
                    }

        except Exception as e:
            print(f"[ERROR] 爬取异常: {e}", file=sys.stderr)
            import traceback
            traceback.print_exc(file=sys.stderr)
            return {
                'success': False,
                'error': f'爬取失败: {str(e)}'
            }

    def _extract_user_info(self, page) -> Dict:
        """提取用户信息"""
        try:
            user_info = page.evaluate("""() => {
                const result = {};

                // 提取所有文本内容
                const allText = document.body.innerText;

                // 尝试多种选择器提取昵称
                const nicknameSelectors = [
                    'h1', '.user-name', '.username', '[class*="nickname"]',
                    '[class*="UserName"]', '[class*="user-name"]', '.name'
                ];

                for (const selector of nicknameSelectors) {
                    const el = document.querySelector(selector);
                    if (el && el.textContent.trim() && !result.nickname) {
                        const text = el.textContent.trim();
                        if (!text.includes('安全') && !text.includes('验证') && text.length < 50) {
                            result.nickname = text;
                            break;
                        }
                    }
                }

                // 提取简介
                const descSelectors = [
                    '.user-desc', '.description', '[class*="desc"]', '[class*="bio"]'
                ];

                for (const selector of descSelectors) {
                    const el = document.querySelector(selector);
                    if (el && el.textContent.trim() && !result.desc) {
                        const text = el.textContent.trim();
                        if (!text.includes('异常') && !text.includes('刷新') && !text.includes('验证')) {
                            result.desc = text;
                            break;
                        }
                    }
                }

                // 使用正则提取统计数据
                const followerMatch = allText.match(/粉丝[\\s\\n]*(\\d+\\.?\\d*[万kKwW]?)|([\\d\\.]+[万kKwW]?)[\\s\\n]*粉丝/);
                if (followerMatch) {
                    result.follower_count = followerMatch[1] || followerMatch[2];
                }

                const likedMatch = allText.match(/获赞[\\s\\n]*(\\d+\\.?\\d*[万kKwW]?)|([\\d\\.]+[万kKwW]?)[\\s\\n]*获赞/);
                if (likedMatch) {
                    result.liked_count = likedMatch[1] || likedMatch[2];
                }

                const noteMatch = allText.match(/笔记[\\s\\n]*(\\d+\\.?\\d*[万kKwW]?)|([\\d\\.]+[万kKwW]?)[\\s\\n]*笔记/);
                if (noteMatch) {
                    result.note_count = noteMatch[1] || noteMatch[2];
                }

                // 提取IP属地
                const ipMatch = allText.match(/IP属地[：:][\\s\\n]*([^\\s\\n]+)/);
                if (ipMatch) {
                    result.ip_location = ipMatch[1];
                }

                return result;
            }""")

            print(f"[DEBUG] 提取到的用户信息: {json.dumps(user_info, ensure_ascii=False)}", file=sys.stderr)
            return user_info

        except Exception as e:
            print(f"[ERROR] 提取用户信息失败: {e}", file=sys.stderr)
            return {}

    def _extract_notes(self, page) -> List[Dict]:
        """提取笔记列表"""
        try:
            # 滚动加载更多
            for i in range(3):
                page.evaluate(f"window.scrollTo(0, document.body.scrollHeight * {(i+1)/3})")
                time.sleep(1.5)

            notes = page.evaluate("""() => {
                const notes = [];
                const seen = new Set();

                // 查找所有可能的笔记元素
                const noteElements = document.querySelectorAll('a[href*="/explore/"], section, article');

                noteElements.forEach((el) => {
                    const note = {};

                    // 提取链接
                    const link = el.tagName === 'A' ? el.href : el.querySelector('a[href*="/explore/"]')?.href;
                    if (!link || seen.has(link)) return;
                    seen.add(link);
                    note.url = link;

                    // 提取标题
                    const titleEl = el.querySelector('[class*="title"], h3, h4');
                    if (titleEl) note.title = titleEl.textContent.trim();

                    // 提取封面
                    const img = el.querySelector('img');
                    if (img && img.src) note.cover = img.src;

                    // 提取互动数据
                    const text = el.textContent;
                    const likeMatch = text.match(/(\\d+\\.?\\d*[万kKwW]?)/);
                    if (likeMatch) note.liked_count = likeMatch[1];

                    if (note.url && (note.title || note.cover)) {
                        notes.push(note);
                    }
                });

                return notes;
            }""")

            print(f"[DEBUG] 提取到 {len(notes)} 条笔记", file=sys.stderr)
            return notes

        except Exception as e:
            print(f"[ERROR] 提取笔记失败: {e}", file=sys.stderr)
            return []


def main():
    """命令行入口"""
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': '缺少参数',
            'usage': 'python xiaohongshu_scraper_ultimate.py <URL> [--cookie <cookie>] [--no-headless]',
            'example': 'python xiaohongshu_scraper_ultimate.py https://www.xiaohongshu.com/user/profile/xxx --no-headless',
            'tips': [
                '使用 --no-headless 显示浏览器窗口，可手动通过安全验证',
                '使用 --cookie 提供登录Cookie提高成功率'
            ]
        }, ensure_ascii=False, indent=2))
        sys.exit(1)

    url = sys.argv[1]
    cookies = None
    headless = True

    # 解析参数
    for i in range(2, len(sys.argv)):
        if sys.argv[i] == '--cookie' and i + 1 < len(sys.argv):
            cookies = sys.argv[i + 1]
        elif sys.argv[i] == '--no-headless':
            headless = False

    scraper = XiaohongshuScraperUltimate(headless=headless)
    result = scraper.scrape_account(url, cookies)

    # 输出结果（处理编码问题）
    try:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except UnicodeEncodeError:
        # 如果遇到编码问题，使用ensure_ascii=True
        print(json.dumps(result, ensure_ascii=True, indent=2))
    sys.exit(0 if result['success'] else 1)


if __name__ == '__main__':
    main()
