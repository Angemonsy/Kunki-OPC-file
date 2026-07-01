#!/usr/bin/env python3
"""
飞书增量同步脚本
按照对比时间戳的方式进行增量更新
规则：
- 如果飞书上修改时间 > 本地文件修改时间 → 拉取更新覆盖本地
- 如果本地不存在 → 新建文件
- 如果飞书时间更早 → 不更新，保留本地
- 不删除本地已有文件
"""

import os
import sys
import subprocess
import time
import json
from pathlib import Path

# 取消代理
os.environ.pop('HTTPS_PROXY', None)
os.environ.pop('HTTP_PROXY', None)

# 核心文档同步映射表：飞书文档名 -> (本地路径, 飞书token)
CORE_MAPPING = {
    "A02-USER": ("C-记忆核心/01-个人上下文/A02-USER.md", "WXEhd7F6co1Js3xa5b8cey0AnXe"),
    "A03-MEMORY": ("C-记忆核心/04-迭代记忆/A03-MEMORY.md", "WU3qdlLfRo8lxnxZSlfcDvUZnWf"),
    "A04-INVENTORY": ("C-记忆核心/01-个人上下文/A04-INVENTORY.md", "Cp6ldTFqVoFWRUxeB6ocfYGAnOc"),
    "A05-周工作区": ("C-记忆核心/01-个人上下文/A05-周工作区.md", "NyNPdSZrpomUpkx6hmEcdW1XnRh"),
    "A06-每日复盘日志": ("C-记忆核心/01-个人上下文/A06-每日复盘日志.md", "CKnYdL8f0ot9bFxDpPscTnVKntg"),
    "B01-素材库": ("D-内容创作/03-素材库/B01-素材库.md", "EvbFdAS1gogWDGxUpYMc00jznR6"),
    "B02-选题决策": ("D-内容创作/02-选题决策/B02-选题决策.md", "Ed5sdJRVdoTsW9x12ijc7Iolnj6"),
    "B04-数据反馈": ("E-产出交付/03-数据反馈/B04-数据反馈.md", "U2ojd1EcJoivRRxwhjtcAts9nub"),
    "B05-内容复盘与方法论": ("D-内容创作/04-文案框架/B05-内容复盘与方法论.md", "C0Prd9t1IoFWBFxEowFcLMfWnTc"),
    "B06-用户画像": ("D-内容创作/01-用户画像/B06-用户画像.md", "Lfvvdtonco3E4QxYtGLc7VlEncc"),
    "B07-产品管理": ("D-内容创作/06-产品管理/B07-产品管理.md", "VXDsdYFv1ojO8Ox8jybck2kNn5f"),
    "B08-变现路径": ("E-产出交付/02-变现路径/B08-变现路径.md", "CIu9d3i24o1NwfxkNsNcSiKnn1c"),
    "B09-客户与社群运营": ("E-产出交付/04-客户运营/B09-客户与社群运营.md", "DkH3d26WqolhBoxNmckczW6inDe"),
    "B10-合作管理": ("E-产出交付/05-合作管理/B10-合作管理.md", "UVIodg9oponx2QxPi8gcOwVgnJc"),
    "B11-IP增长与商业复盘": ("C-记忆核心/03-经验沉淀/B11-IP增长与商业复盘.md", "NyJZdCom1ouE6uxxmgecuWPCn6E"),
    "C01-目标院校库": ("B-参考资料/保研资料/C01-目标院校库.md", "HIgoduBFMoffYUxGM3RcSaEqnSd"),
    "C02-个人材料库": ("B-参考资料/保研资料/C02-个人材料库.md", "JJJIdXIMqoSYe2xaYa0c5v6knQh"),
    "C03-学术素材库": ("B-参考资料/保研资料/C03-学术素材库.md", "VuEFdNLVaokSwrxSsKpcxCB5nw5"),
    "C04-面试准备": ("B-参考资料/保研资料/C04-面试准备.md", "I7NvdUoEho4nUXxc8vCcjks1nVh"),
    "C05-时间线与进度": ("B-参考资料/保研资料/C05-时间线与进度.md", "HGNmdvPCdozm8BxxXbucZwPonZf"),
}

# 动态文件夹映射
DYNAMIC_MAPPING = [
    {
        "feishu_folder_token": "QAJSftp5hleHpHdLseKcd93TnAe",  # kunki输入
        "local_folder": "C-记忆核心/02-每日输入/",
        "name_pattern": "YYYY-MM-DD"  # 按日期命名
    },
    {
        "feishu_folder_token": "IUWIfp3eKlEQk9dfzsNcphzknJi",  # kunki输出
        "local_folder": "E-产出交付/01-已发文案/",
        "has_subfolders": True  # 保持分类结构
    }
]

def get_feishu_file_metadata(doc_token):
    """获取飞书文件元数据"""
    cmd = [
        "C:\\Users\\Administrator\\.openclaw\\skills\\node24\\lark-cli.cmd", "drive", "metas", "get",
        "--params", json.dumps({"file_token": doc_token})
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        return None
    try:
        data = json.loads(result.stdout)
        if data.get("code") == 0 and "data" in data:
            return data["data"]
        return None
    except:
        return None

def fetch_feishu_markdown(doc_token, output_path):
    """从飞书获取markdown内容并保存到本地"""
    cmd = ["C:\\Users\\Administrator\\.openclaw\\skills\\node24\\lark-cli.cmd", "docs", "+fetch", "--doc", doc_token]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("  [FAIL] 获取失败: %s" % result.stderr)
        return False

    # 清理飞书格式残余，保存为标准markdown
    content = result.stdout

    # 确保父目录存在
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    return True

def list_feishu_folder(folder_token):
    """列出飞书文件夹中的所有文件"""
    cmd = [
        "C:\\Users\\Administrator\\.openclaw\\skills\\node24\\lark-cli.cmd", "drive", "files", "list",
        "--page-all",
        "--params", json.dumps({"folder_token": folder_token})
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("  [FAIL] 列出文件夹失败: %s" % result.stderr)
        return []
    try:
        data = json.loads(result.stdout)
        if data.get("code") == 0 and "data" in data and "files" in data["data"]:
            return data["data"]["files"]
        return []
    except Exception as e:
        print("  [FAIL] 解析失败: %s" % e)
        return []

def should_update(feishu_modified_ts, local_path):
    """判断是否需要更新：飞书时间 > 本地时间 或 本地不存在"""
    if not os.path.exists(local_path):
        return True
    local_mtime = os.path.getmtime(local_path)
    # 飞书返回的是秒级时间戳
    return feishu_modified_ts > local_mtime

def sync_core_docs(root_dir):
    """同步核心文档"""
    stats = {"added": 0, "updated": 0, "skipped": 0, "failed": 0}

    print("\n[CORE] 开始同步核心文档...")

    for name, (local_rel_path, token) in CORE_MAPPING.items():
        local_path = os.path.join(root_dir, local_rel_path)
        print("\n  %s -> %s" % (name, local_rel_path))

        metadata = get_feishu_file_metadata(token)
        if not metadata:
            print("    [FAIL] 获取元数据失败")
            stats["failed"] += 1
            continue

        feishu_modified = metadata.get("modified_time", 0)
        if not should_update(feishu_modified, local_path):
            print("    [SKIP] 跳过（本地已是最新）")
            stats["skipped"] += 1
            continue

        if os.path.exists(local_path):
            print("    [UPDATE] 更新（飞书更新）")
            stats["updated"] += 1
        else:
            print("    [NEW] 新增（本地不存在）")
            stats["added"] += 1

        success = fetch_feishu_markdown(token, local_path)
        if not success:
            stats["failed"] += 1

    return stats

def sync_dynamic_folder(root_dir, feishu_folder_token, local_base_folder, has_subfolders=False):
    """同步动态文件夹（kunki输入 和 kunki输出）"""
    stats = {"added": 0, "updated": 0, "skipped": 0, "failed": 0}

    files = list_feishu_folder(feishu_folder_token)
    print("  发现 %d 个文件" % len(files))

    for file in files:
        file_type = file.get("type")
        # 只处理docx文档，跳过文件夹
        if file_type != "docx":
            continue

        name = file.get("name", "")
        token = file.get("token", "")
        modified_time = file.get("modified_time", 0)

        if has_subfolders:
            # kunki输出/articles 保持分类结构
            local_rel_path = os.path.join(local_base_folder, name + ".md")
        else:
            # kunki输入 直接放根目录
            local_rel_path = os.path.join(local_base_folder, name + ".md")

        local_path = os.path.join(root_dir, local_rel_path)

        if not should_update(modified_time, local_path):
            print("    [SKIP] %s -> 跳过（本地已是最新）" % name)
            stats["skipped"] += 1
            continue

        if os.path.exists(local_path):
            print("    [UPDATE] %s -> 更新" % name)
            stats["updated"] += 1
        else:
            print("    [NEW] %s -> 新增" % name)
            stats["added"] += 1

        success = fetch_feishu_markdown(token, local_path)
        if not success:
            stats["failed"] += 1

        # 如果是文件夹且需要保留结构，递归处理
        if file_type == "folder" and has_subfolders:
            # 递归处理子文件夹
            sub_stats = sync_dynamic_folder(root_dir, token, os.path.join(local_base_folder, name), True)
            for k in stats:
                stats[k] += sub_stats[k]

    return stats

def main():
    """主函数"""
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
    print("[START] 开始飞书增量同步，根目录: %s" % root_dir)

    # 确保目录存在
    for _, (local_path, _) in CORE_MAPPING.items():
        full_path = os.path.join(root_dir, local_path)
        Path(full_path).parent.mkdir(parents=True, exist_ok=True)

    for dyn in DYNAMIC_MAPPING:
        full_path = os.path.join(root_dir, dyn["local_folder"])
        Path(full_path).mkdir(parents=True, exist_ok=True)

    # 同步核心文档
    core_stats = sync_core_docs(root_dir)

    # 同步动态文件夹
    print("\n[DYNAMIC] 开始同步动态文件夹...")

    total_stats = {
        "added": core_stats["added"],
        "updated": core_stats["updated"],
        "skipped": core_stats["skipped"],
        "failed": core_stats["failed"]
    }

    for dyn in DYNAMIC_MAPPING:
        print("\n  同步文件夹: %s" % dyn['local_folder'])
        dyn_stats = sync_dynamic_folder(
            root_dir,
            dyn["feishu_folder_token"],
            dyn["local_folder"],
            dyn.get("has_subfolders", False)
        )
        for k in total_stats:
            total_stats[k] += dyn_stats[k]

    # 输出最终结果
    print("\n" + "="*60)
    print("[DONE] 飞书增量同步完成！")
    print("  新增文件: %d" % total_stats['added'])
    print("  更新文件: %d" % total_stats['updated'])
    print("  跳过文件: %d" % total_stats['skipped'])
    print("  失败文件: %d" % total_stats['failed'])
    print("="*60)

    return total_stats

if __name__ == "__main__":
    main()
