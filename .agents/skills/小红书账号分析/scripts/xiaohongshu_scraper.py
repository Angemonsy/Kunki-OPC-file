#!/usr/bin/env python3
"""
小红书账号数据爬取工具 - 增强版
支持多种爬取策略，自动突破反爬虫限制

特性：
1. 多层级爬取策略（API -> Playwright浏览器自动化）
2. 智能反反爬虫技术
3. 自动重试机制
4. 完整的错误处理

使用方法：
1. 作为 Python 模块: from xiaohongshu_scraper import XiaohongshuScraper
2. 命令行使用: python xiaohongshu_scraper.py <URL>
3. 在 Claude Code Skill 中调用
"""

import json
import requests
import re
import time
from urllib.parse import urlparse, parse_qs
from typing import Dict, Optional, List
import sys
import random

# 尝试导入可选依赖
try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False
    print("[WARN] Playwright未安装，浏览器自动化功能不可用", file=sys.stderr)

try:
    from fake_useragent import UserAgent
    FAKE_UA_AVAILABLE = True
except ImportError:
    FAKE_UA_AVAILABLE = False


class XiaohongshuScraper:
    """小红书账号数据爬取器 - 增强版"""

    def __init__(self):
        self.session = requests.Session()
        self.user_agent = self._get_user_agent()
        self.headers = self._build_headers()
        self.max_retries = 3

    def _get_user_agent(self) -> str:
        """获取随机User-Agent"""
        if FAKE_UA_AVAILABLE:
            try:
                ua = UserAgent()
                return ua.chrome
            except:
                pass

        # 备用User-Agent列表
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0'
        ]
        return random.choice(user_agents)

    def _build_headers(self) -> Dict[str, str]:
        """构建完整的请求头"""
        return {
            'User-Agent': self.user_agent,
            'Referer': 'https://www.xiaohongshu.com/',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Origin': 'https://www.xiaohongshu.com',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        }

    def extract_user_id(self, url: str) -> Optional[str]:
        """从URL中提取用户ID"""
        try:
            # 匹配模式: /user/profile/646f4ec9000000001c02af3f
            match = re.search(r'/user/profile/([a-zA-Z0-9]+)', url)
            if match:
                return match.group(1)

            # 备选: 从URL参数中提取
            parsed = urlparse(url)
            params = parse_qs(parsed.query)
            if 'user_id' in params:
                return params['user_id'][0]

            return None
        except Exception as e:
            return None

    def scrape_account(self, url: str, method: str = 'auto', cookies: str = None) -> Dict:
        """
        主函数：爬取小红书账号完整数据

        参数:
            url: 小红书账号链接
            method: 爬取方法 ('auto', 'api', 'playwright')
            cookies: 可选的Cookie字符串（用于绕过登录限制）

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
                'error': '无法从URL中提取用户ID，请检查链接格式',
                'solution': '请提供正确的小红书账号主页链接'
            }

        print(f"[INFO] 开始爬取用户: {user_id}", file=sys.stderr)
        print(f"[INFO] 使用策略: {method}", file=sys.stderr)
        if cookies:
            print("[INFO] 检测到Cookie，将使用Cookie进行认证", file=sys.stderr)

        # 策略1: 尝试 API 爬取（最快）
        if method in ['auto', 'api']:
            print("[INFO] 尝试策略1: API直接请求...", file=sys.stderr)
            result = self._try_api_method(user_id, cookies)
            if result['success']:
                print("[SUCCESS] API方法成功！", file=sys.stderr)
                return result
            print(f"[WARN] API方法失败: {result.get('error')}", file=sys.stderr)

        # 策略2: Playwright浏览器自动化
        if method in ['auto', 'playwright'] and PLAYWRIGHT_AVAILABLE:
            print("[INFO] 尝试策略2: Playwright浏览器自动化...", file=sys.stderr)
            result = self._try_playwright_method(url, user_id, cookies)
            if result['success']:
                print("[SUCCESS] Playwright方法成功！", file=sys.stderr)
                return result
            print(f"[WARN] Playwright方法失败: {result.get('error')}", file=sys.stderr)

        # 策略3: 返回引导信息
        return self._return_manual_guidance(user_id)

    def _try_api_method(self, user_id: str, cookies: str = None) -> Dict:
        """策略1: 尝试通过API爬取"""
        try:
            # 小红书Web API端点
            api_url = f"https://edith.xiaohongshu.com/api/sns/web/v1/user/{user_id}"

            # 如果提供了Cookie，添加到headers
            headers = self.headers.copy()
            if cookies:
                headers['Cookie'] = cookies

            for attempt in range(self.max_retries):
                try:
                    # 添加随机延迟，模拟人类行为
                    if attempt > 0:
                        time.sleep(random.uniform(2, 4))

                    response = self.session.get(
                        api_url,
                        headers=headers,
                        timeout=15
                    )

                    print(f"[DEBUG] API响应状态码: {response.status_code}", file=sys.stderr)

                    if response.status_code == 200:
                        data = response.json()

                        # 检查响应数据
                        if 'data' not in data:
                            print(f"[DEBUG] API响应: {json.dumps(data, ensure_ascii=False)[:200]}", file=sys.stderr)
                            if data.get('code') == -100:
                                return {
                                    'success': False,
                                    'error': '需要登录才能访问'
                                }

                        user_info = self._parse_user_data(data)

                        if user_info:
                            # 爬取笔记
                            print("[INFO] 正在爬取笔记列表...", file=sys.stderr)
                            notes = self._fetch_notes(user_id)

                            return {
                                'success': True,
                                'user_id': user_id,
                                'user_info': user_info,
                                'notes': notes,
                                'note_count': len(notes),
                                'method_used': 'api'
                            }

                    elif response.status_code == 403:
                        return {
                            'success': False,
                            'error': '访问被拒绝（反爬虫限制）'
                        }

                except requests.exceptions.Timeout:
                    if attempt == self.max_retries - 1:
                        return {
                            'success': False,
                            'error': '请求超时'
                        }
                except Exception as e:
                    print(f"[ERROR] 请求异常: {e}", file=sys.stderr)

            return {
                'success': False,
                'error': f'API请求失败'
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'API爬取异常: {str(e)}'
            }

    def _try_playwright_method(self, url: str, user_id: str, cookies: str = None) -> Dict:
        """策略2: 使用Playwright浏览器自动化爬取"""
        if not PLAYWRIGHT_AVAILABLE:
            return {
                'success': False,
                'error': 'Playwright未安装'
            }

        try:
            print("[INFO] 启动浏览器...", file=sys.stderr)

            with sync_playwright() as p:
                # 启动浏览器（使用chromium）
                browser = p.chromium.launch(
                    headless=True,  # 无头模式
                    args=[
                        '--disable-blink-features=AutomationControlled',
                        '--disable-dev-shm-usage',
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-web-security'
                    ]
                )

                # 创建上下文（模拟真实浏览器环境）
                context = browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent=self.user_agent,
                    locale='zh-CN',
                    timezone_id='Asia/Shanghai'
                )

                # 如果提供了Cookie，添加到上下文
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

                # 添加额外的反检测脚本
                context.add_init_script("""
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined
                    });
                    Object.defineProperty(navigator, 'plugins', {
                        get: () => [1, 2, 3, 4, 5]
                    });
                    Object.defineProperty(navigator, 'languages', {
                        get: () => ['zh-CN', 'zh', 'en']
                    });
                """)

                page = context.new_page()

                print(f"[INFO] 访问页面: {url}", file=sys.stderr)

                # 访问页面（增加超时时间）
                response = page.goto(url, wait_until='domcontentloaded', timeout=60000)

                if not response or response.status != 200:
                    browser.close()
                    return {
                        'success': False,
                        'error': f'页面加载失败，状态码: {response.status if response else "None"}'
                    }

                # 等待内容加载
                print("[INFO] 等待页面内容加载...", file=sys.stderr)
                time.sleep(5)

                # 提取页面数据
                print("[INFO] 提取页面数据...", file=sys.stderr)
                user_info = self._extract_user_info_from_page(page)
                notes = self._extract_notes_from_page(page)

                browser.close()

                if user_info:
                    return {
                        'success': True,
                        'user_id': user_id,
                        'user_info': user_info,
                        'notes': notes,
                        'note_count': len(notes),
                        'method_used': 'playwright'
                    }
                else:
                    return {
                        'success': False,
                        'error': '无法提取用户信息，可能需要登录或Cookie'
                    }

        except Exception as e:
            print(f"[ERROR] Playwright异常: {e}", file=sys.stderr)
            return {
                'success': False,
                'error': f'浏览器自动化失败: {str(e)}'
            }

    def _extract_user_info_from_page(self, page) -> Optional[Dict]:
        """从页面中提取用户信息"""
        try:
            # 等待页面关键元素加载
            try:
                page.wait_for_selector('body', timeout=10000)
            except:
                pass

            # 获取页面HTML用于调试
            page_content = page.content()
            print(f"[DEBUG] 页面标题: {page.title()}", file=sys.stderr)

            # 使用JavaScript在页面中提取数据
            user_info = page.evaluate("""() => {
                const result = {};

                // 多种选择器尝试提取昵称
                const nicknameSelectors = [
                    '.user-name',
                    '.username',
                    '[class*="nickname"]',
                    '[class*="UserName"]',
                    '[class*="user-name"]',
                    'h1',
                    '.name'
                ];

                for (const selector of nicknameSelectors) {
                    const el = document.querySelector(selector);
                    if (el && el.textContent.trim() && !result.nickname) {
                        result.nickname = el.textContent.trim();
                        break;
                    }
                }

                // 提取简介
                const descSelectors = [
                    '.user-desc',
                    '.description',
                    '[class*="desc"]',
                    '[class*="Desc"]',
                    '[class*="bio"]'
                ];

                for (const selector of descSelectors) {
                    const el = document.querySelector(selector);
                    if (el && el.textContent.trim() && !result.desc) {
                        const text = el.textContent.trim();
                        // 过滤掉错误信息
                        if (!text.includes('异常') && !text.includes('刷新')) {
                            result.desc = text;
                            break;
                        }
                    }
                }

                // 提取所有包含数字的元素（统计数据）
                const allElements = document.querySelectorAll('*');
                allElements.forEach(el => {
                    const text = el.textContent.trim();

                    // 匹配 "粉丝 123" 或 "123 粉丝" 格式
                    if (text.match(/粉丝|关注者/) && text.match(/\\d+/)) {
                        const match = text.match(/(\\d+\\.?\\d*[万kKwW]?)/);
                        if (match && !result.follower_count) {
                            result.follower_count = match[1];
                        }
                    }

                    if (text.match(/获赞|点赞/) && text.match(/\\d+/)) {
                        const match = text.match(/(\\d+\\.?\\d*[万kKwW]?)/);
                        if (match && !result.liked_count) {
                            result.liked_count = match[1];
                        }
                    }

                    if (text.match(/收藏/) && text.match(/\\d+/)) {
                        const match = text.match(/(\\d+\\.?\\d*[万kKwW]?)/);
                        if (match && !result.collected_count) {
                            result.collected_count = match[1];
                        }
                    }

                    if (text.match(/笔记/) && text.match(/\\d+/)) {
                        const match = text.match(/(\\d+\\.?\\d*[万kKwW]?)/);
                        if (match && !result.note_count) {
                            result.note_count = match[1];
                        }
                    }
                });

                // 提取IP属地
                const ipSelectors = ['[class*="ip"]', '[class*="location"]', '[class*="Location"]'];
                for (const selector of ipSelectors) {
                    const el = document.querySelector(selector);
                    if (el && el.textContent.trim() && !result.ip_location) {
                        result.ip_location = el.textContent.trim();
                        break;
                    }
                }

                return result;
            }""")

            print(f"[DEBUG] 提取到的用户信息: {json.dumps(user_info, ensure_ascii=False)}", file=sys.stderr)

            # 如果提取到了昵称或任何统计数据，就认为成功
            if user_info and (user_info.get('nickname') or user_info.get('follower_count')):
                return user_info

            return None

        except Exception as e:
            print(f"[ERROR] 提取用户信息失败: {e}", file=sys.stderr)
            return None

    def _extract_notes_from_page(self, page) -> List[Dict]:
        """从页面中提取笔记列表"""
        try:
            # 滚动页面加载更多内容
            page.evaluate("""() => {
                window.scrollTo(0, document.body.scrollHeight / 2);
            }""")
            time.sleep(2)

            page.evaluate("""() => {
                window.scrollTo(0, document.body.scrollHeight);
            }""")
            time.sleep(2)

            notes = page.evaluate("""() => {
                const noteElements = document.querySelectorAll('a[href*="/explore/"], section, article, [class*="note"], [class*="Note"], [class*="cover"], [class*="Cover"]');
                const notes = [];
                const seen = new Set();

                noteElements.forEach((el, index) => {
                    if (index >= 50) return; // 最多提取50条

                    const note = {};

                    // 提取标题
                    const titleSelectors = ['.title', '[class*="title"]', '[class*="Title"]', 'h3', 'h4'];
                    for (const selector of titleSelectors) {
                        const titleEl = el.querySelector(selector);
                        if (titleEl && titleEl.textContent.trim()) {
                            note.title = titleEl.textContent.trim();
                            break;
                        }
                    }

                    // 提取互动数据
                    const likeSelectors = ['[class*="like"]', '[class*="Like"]', '[class*="zan"]'];
                    for (const selector of likeSelectors) {
                        const likeEl = el.querySelector(selector);
                        if (likeEl) {
                            const match = likeEl.textContent.match(/(\\d+\\.?\\d*[万kKwW]?)/);
                            if (match) {
                                note.liked_count = match[1];
                                break;
                            }
                        }
                    }

                    // 提取封面
                    const imgEl = el.querySelector('img');
                    if (imgEl && imgEl.src) {
                        note.cover = imgEl.src;
                    }

                    // 提取链接
                    const linkEl = el.tagName === 'A' ? el : el.querySelector('a[href*="/explore/"]');
                    if (linkEl && linkEl.href) {
                        note.url = linkEl.href;
                    }

                    // 只添加有效的笔记（至少有标题或封面）
                    if ((note.title || note.cover) && note.url && !seen.has(note.url)) {
                        seen.add(note.url);
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

    def _fetch_notes(self, user_id: str, limit: int = 30) -> List[Dict]:
        """爬取用户笔记列表"""
        try:
            notes_url = "https://edith.xiaohongshu.com/api/sns/web/v1/user_posted"

            params = {
                'user_id': user_id,
                'cursor': '',
                'num': min(limit, 30),
            }

            response = self.session.get(
                notes_url,
                headers=self.headers,
                params=params,
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                return self._parse_notes_data(data)

            return []

        except Exception as e:
            print(f"[WARN] 爬取笔记失败: {e}", file=sys.stderr)
            return []

    def _parse_user_data(self, data: Dict) -> Optional[Dict]:
        """解析用户数据"""
        try:
            if 'data' not in data:
                return None

            user_data = data.get('data', {})
            basic_info = user_data.get('basic_info', {})
            interactions = user_data.get('interactions', {})

            if not basic_info:
                return None

            return {
                'user_id': basic_info.get('red_id', ''),
                'nickname': basic_info.get('nickname', ''),
                'desc': basic_info.get('desc', ''),
                'follower_count': interactions.get('follower_count', 0),
                'following_count': interactions.get('following_count', 0),
                'collected_count': interactions.get('collected_count', 0),
                'liked_count': interactions.get('liked_count', 0),
                'note_count': basic_info.get('note_count', 0),
                'ip_location': basic_info.get('ip_location', ''),
                'avatar': basic_info.get('images', ''),
            }
        except Exception as e:
            print(f"[ERROR] 解析用户数据失败: {e}", file=sys.stderr)
            return None

    def _parse_notes_data(self, data: Dict) -> List[Dict]:
        """解析笔记数据"""
        try:
            notes = []
            items = data.get('data', {}).get('notes', [])

            for item in items:
                note_data = item.get('note_card', {})
                interact_info = note_data.get('interact_info', {})

                note = {
                    'note_id': note_data.get('note_id', ''),
                    'type': note_data.get('type', ''),
                    'title': note_data.get('title', ''),
                    'desc': note_data.get('desc', ''),
                    'liked_count': interact_info.get('liked_count', 0),
                    'collected_count': interact_info.get('collected_count', 0),
                    'comment_count': interact_info.get('comment_count', 0),
                    'share_count': interact_info.get('share_count', 0),
                    'time': note_data.get('time', 0),
                    'cover': note_data.get('cover', {}).get('url', ''),
                }
                notes.append(note)

            return notes
        except Exception as e:
            print(f"[ERROR] 解析笔记数据失败: {e}", file=sys.stderr)
            return []

    def _return_manual_guidance(self, user_id: str) -> Dict:
        """返回手动输入引导"""
        return {
            'success': False,
            'error': '自动爬取失败，需要手动提供信息或Cookie',
            'user_id': user_id,
            'method_used': 'none',
            'alternative': {
                'message': '由于小红书的反爬虫限制，自动爬取失败。请选择以下方式之一：',
                'options': [
                    '方案1: 提供Cookie（推荐）',
                    '  - 在浏览器登录小红书',
                    '  - 按F12打开开发者工具',
                    '  - 访问账号主页',
                    '  - 在Network标签找到请求',
                    '  - 复制Cookie值',
                    '  - 使用命令: python xiaohongshu_scraper.py "<URL>" --cookie "<你的Cookie>"',
                    '',
                    '方案2: 手动提供账号信息',
                    '  - 粉丝数、笔记数、获赞数',
                    '  - 账号简介',
                    '  - 3-5篇代表性笔记数据',
                    '',
                    '方案3: 上传账号主页截图'
                ],
                'required_info': {
                    'nickname': '账号昵称',
                    'follower_count': '粉丝数',
                    'note_count': '笔记数',
                    'liked_count': '获赞数',
                    'desc': '账号简介',
                    'notes_sample': '3-5篇代表性笔记的标题和数据'
                }
            }
        }


def main():
    """命令行入口"""
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': '缺少参数',
            'usage': 'python xiaohongshu_scraper.py <小红书账号链接> [method] [--cookie <cookie_string>]',
            'example': 'python xiaohongshu_scraper.py https://www.xiaohongshu.com/user/profile/646f4ec9000000001c02af3f auto --cookie "a1=xxx; webId=xxx"',
            'methods': ['auto', 'api', 'playwright']
        }, ensure_ascii=False, indent=2))
        sys.exit(1)

    url = sys.argv[1]
    method = 'auto'
    cookies = None

    # 解析参数
    for i in range(2, len(sys.argv)):
        if sys.argv[i] == '--cookie' and i + 1 < len(sys.argv):
            cookies = sys.argv[i + 1]
        elif sys.argv[i] not in ['--cookie'] and not cookies:
            method = sys.argv[i]

    print(f"[INFO] 小红书账号爬取工具 - 增强版", file=sys.stderr)
    print(f"[INFO] URL: {url}", file=sys.stderr)
    print(f"[INFO] 方法: {method}", file=sys.stderr)
    print(f"[INFO] Cookie: {'已提供' if cookies else '未提供'}", file=sys.stderr)
    print(f"[INFO] Playwright可用: {PLAYWRIGHT_AVAILABLE}", file=sys.stderr)
    print("-" * 50, file=sys.stderr)

    scraper = XiaohongshuScraper()
    result = scraper.scrape_account(url, method, cookies)

    # 输出 JSON 格式结果到 stdout（Claude 可以读取）
    print(json.dumps(result, ensure_ascii=False, indent=2))

    # 返回状态码
    sys.exit(0 if result['success'] else 1)


if __name__ == '__main__':
    main()
