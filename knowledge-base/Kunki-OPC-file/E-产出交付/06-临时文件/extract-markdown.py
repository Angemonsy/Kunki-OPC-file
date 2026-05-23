#!/usr/bin/env python3
import json
import os

# 处理所有fetched文件
files = [
    ("A02-USER-fetched.md", "C-记忆核心/01-个人上下文/A02-USER.md"),
    ("A04-INVENTORY-fetched.md", "C-记忆核心/01-个人上下文/A04-INVENTORY.md"),
    ("B01-素材库-fetched.md", "D-内容创作/03-素材库/B01-素材库.md"),
    ("B02-选题决策-fetched.md", "D-内容创作/02-选题决策/B02-选题决策.md"),
    ("B04-数据反馈-fetched.md", "E-产出交付/03-数据反馈/B04-数据反馈.md"),
    ("B05-内容复盘与方法论-fetched.md", "D-内容创作/04-文案框架/B05-内容复盘与方法论.md"),
    ("B06-用户画像-fetched.md", "D-内容创作/01-用户画像/B06-用户画像.md"),
    ("B07-产品管理-fetched.md", "D-内容创作/06-产品管理/B07-产品管理.md"),
    ("B08-变现路径-fetched.md", "E-产出交付/02-变现路径/B08-变现路径.md"),
    ("B09-客户与社群运营-fetched.md", "E-产出交付/04-客户运营/B09-客户与社群运营.md"),
    ("B10-合作管理-fetched.md", "E-产出交付/05-合作管理/B10-合作管理.md"),
    ("B11-IP增长与商业复盘-fetched.md", "C-记忆核心/03-经验沉淀/B11-IP增长与商业复盘.md"),
    ("C01-目标院校库-fetched.md", "B-参考资料/保研资料/C01-目标院校库.md"),
    ("C02-个人材料库-fetched.md", "B-参考资料/保研资料/C02-个人材料库.md"),
    ("C03-学术素材库-fetched.md", "B-参考资料/保研资料/C03-学术素材库.md"),
    ("C04-面试准备-fetched.md", "B-参考资料/保研资料/C04-面试准备.md"),
    ("C05-时间线与进度-fetched.md", "B-参考资料/保研资料/C05-时间线与进度.md"),
]

def extract_markdown(input_path):
    """Extract markdown from the JSON output"""
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    try:
        data = json.loads(content)
        if 'data' in data and 'markdown' in data['data']:
            return data['data']['markdown']
    except:
        # If it's already markdown, return as is
        return content

    return content

def ensure_dir(file_path):
    directory = os.path.dirname(file_path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory)

updated = []
skipped = []

for fetched, target in files:
    fetched_path = f"E-产出交付/06-临时文件/{fetched}"
    target_path = target

    markdown = extract_markdown(fetched_path)

    # Check if target exists
    if os.path.exists(target_path):
        with open(target_path, 'r', encoding='utf-8') as f:
            current = f.read()
        if current.strip() == markdown.strip():
            skipped.append(target)
            continue

    ensure_dir(target_path)
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(markdown)
    updated.append(target)
    print(f"Updated: {target}")

print("\n=== Summary ===")
print(f"Updated: {len(updated)} files")
for f in updated:
    print(f"  - {f}")
print(f"\nSkipped (no change): {len(skipped)} files")
