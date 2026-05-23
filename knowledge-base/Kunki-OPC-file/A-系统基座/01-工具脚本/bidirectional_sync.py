#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
双向同步入口脚本
按照新闭环方案：
- 你本地更新 GitHub → GitHub → 飞书同步（飞书永远是镜像）
- 飞书AI员工更新 → 飞书 → GitHub同步（结果落回GitHub）
- 谁新更谁，双向闭环

Usage:
  python bidirectional_sync.py github-to-feishu  # GitHub → 飞书（每日自动）
  python bidirectional_sync.py feishu-to-github  # 飞书 → GitHub（AI做完后）
"""

import os
import sys
import subprocess
from pathlib import Path

# Force UTF-8 encoding
if sys.version_info >= (3, 7):
    os.environ["PYTHONIOENCODING"] = "utf-8"

# 取消代理
os.environ.pop('HTTPS_PROXY', None)
os.environ.pop('HTTP_PROXY', None)

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))

def run_github_to_feishu():
    """GitHub -> 飞书，以GitHub为准，更新飞书"""
    print("="*60)
    print("[START] GitHub -> Feishu Sync (GitHub is source, Feishu gets updated)")
    print("="*60)
    script = os.path.join(os.path.dirname(__file__), "github_to_feishu_sync.py")
    subprocess.run([sys.executable, script], check=False)

def run_feishu_to_github():
    """Feishu -> GitHub, Feishu AI output back to GitHub"""
    print("="*60)
    print("[START] Feishu -> GitHub Sync (Feishu AI output back to GitHub)")
    print("="*60)
    script = os.path.join(os.path.dirname(__file__), "feishu_incremental_sync.py")
    subprocess.run([sys.executable, script], check=False)

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "github-to-feishu":
        run_github_to_feishu()
    elif cmd == "feishu-to-github":
        run_feishu_to_github()
    else:
        print(f"未知命令: {cmd}")
        print(__doc__)
        sys.exit(1)

if __name__ == "__main__":
    main()
