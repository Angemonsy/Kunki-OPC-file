# -*- coding: utf-8 -*-
"""
WeChat article fetcher — two-tier fallback:

1. Jina Reader (fast, no deps)
2. Playwright headless (no login needed for public articles)
"""

import re
from loguru import logger
from typing import Dict, Any


def _proxy_wechat_images(content: str) -> str:
    """Replace WeChat image URLs with a proxy to bypass anti-hotlinking."""
    if not content:
        return content
    return re.sub(
        r'(https?://mmbiz\.qpic\.cn/[^\s\)]+)',
        r'https://wsrv.nl/?url=\1',
        content
    )


def _is_blocked_page(title: str, content: str) -> bool:
    """Detect WeChat verification/error pages that contain text but no article."""
    text = f"{title}\n{content}".lower()
    blocked_markers = (
        "weixin official accounts platform",
        "环境异常",
        "当前环境异常",
        "完成验证后即可继续访问",
        "requiring captcha",
        "去验证",
    )
    return any(marker.lower() in text for marker in blocked_markers)


async def fetch_wechat(url: str) -> Dict[str, Any]:
    """
    Fetch a WeChat public account article with fallback.

    Args:
        url: mp.weixin.qq.com article URL

    Returns:
        Dict with: title, content, author, url, platform
    """
    # Tier 1: Jina Reader
    try:
        logger.info(f"[WeChat] Tier 1 — Jina: {url}")
        from x_reader.fetchers.jina import fetch_via_jina

        data = fetch_via_jina(url)
        if data.get("content") and not _is_blocked_page(
            data.get("title", ""), data.get("content", "")
        ):
            return {
                "title": data["title"],
                "content": _proxy_wechat_images(data["content"]),
                "author": data.get("author", ""),
                "url": url,
                "platform": "wechat",
            }
        logger.warning(
            "[WeChat] Jina returned empty or blocked content, falling back to browser"
        )
    except Exception as e:
        logger.warning(f"[WeChat] Jina failed ({e}), falling back to browser")

    # Tier 2: Playwright headless (no session needed)
    try:
        logger.info(f"[WeChat] Tier 2 — Playwright headless: {url}")
        from x_reader.fetchers.browser import fetch_via_browser

        data = await fetch_via_browser(url)
        return {
            "title": data["title"],
            "content": _proxy_wechat_images(data["content"]),
            "author": data.get("author", ""),
            "url": url,
            "platform": "wechat",
        }
    except RuntimeError:
        # Playwright not installed — re-raise with original Jina error context
        raise
    except Exception as e:
        logger.error(f"[WeChat] Browser fetch also failed: {e}")
        raise RuntimeError(
            f"❌ All WeChat fetch methods failed.\n"
            f"   Last error: {e}"
        )
