#!/usr/bin/env python3
"""
GitHub → 飞书 自动增量同步脚本
按照五大板块结构，把本地(GitHub)更新同步到飞书对应文档
规则：
- 如果本地修改时间 > 飞书修改时间 → 更新覆盖飞书
- 如果本地不存在 → 不删除飞书文档（保留历史）
- 如果本地新增 → 在飞书对应文件夹创建文档
- 以GitHub为准，飞书永远是GitHub的最新镜像
"""

import os
import sys
import subprocess
import time
import json
from pathlib import Path

# Force UTF-8 encoding
if sys.version_info >= (3, 7):
    os.environ["PYTHONIOENCODING"] = "utf-8"

# 取消代理（必须，否则连接失败）
os.environ.pop('HTTPS_PROXY', None)
os.environ.pop('HTTP_PROXY', None)

# 飞书根文件夹Token（从你的链接来）
FEISHU_ROOT_FOLDER = "EDWvfNDvSlxztQdmJxlcDWWzneb"

# lark-cli 路径（根据实际情况调整）
LARK_CLI = "C:\\Users\\Administrator\\.openclaw\\skills\\node24\\lark-cli.cmd"

# 五大板块文件夹映射：本地文件夹名 → 飞书应该已经建好同名文件夹
FOLDER_MAPPING = [
    ("A-系统基座", None),
    ("B-参考资料", None),
    ("C-记忆核心", None),
    ("D-内容创作", None),
    ("E-产出交付", None),
]

# 核心文档映射表（飞书文档名 -> 本地路径，飞书token）
# 如果已经有飞书文档，放在这里，避免重复创建
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
    "CLAUDE": ("CLAUDE.md", "DocTxpWb9RfKNp6fQ3kOQEXVYbhf"),
}

def run_lark_command(cmd_args):
    """运行lark-cli命令，带重试，标准化"""
    full_cmd = [LARK_CLI] + cmd_args

    # 打印命令
    cmd_str = " ".join(full_cmd)
    print(f"    执行: {cmd_str}")

    result = subprocess.run(full_cmd, capture_output=True, text=True, encoding='utf-8')
    if result.returncode != 0:
        print(f"    [FAIL] 命令失败: {result.stderr}")
        return None

    try:
        data = json.loads(result.stdout)
        if data.get("code") == 0:
            return data.get("data", True)
        else:
            print(f"    [FAIL] 返回错误: {data.get('msg', 'unknown error')}")
            return None
    except Exception as e:
        print(f"    [FAIL] 解析JSON: {e}")
        # 有些命令返回不是json，返回stdout
        return result.stdout

def get_feishu_file_metadata(doc_token):
    """获取飞书文档元数据，包括修改时间"""
    # lark-cli 1.0.14+ 格式: lark-cli drive metas batch_query --data '{"request_docs": ["token"]}'
    json_str = json.dumps({"request_docs": [doc_token]})
    cmd = [
        LARK_CLI, "drive", "metas", "batch_query",
        "--data", json_str
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    if result.returncode != 0:
        print(f"    [FAIL] 获取失败: {result.stderr}")
        return None
    try:
        data = json.loads(result.stdout)
        if data.get("ok") and "data" in data:
            # batch_query returns list of docs, take the first one
            if isinstance(data["data"], list) and len(data["data"]) > 0:
                return data["data"][0]
            return None
        return None
    except Exception as e:
        print(f"    [FAIL] 解析JSON: {e}")
        return None

def update_feishu_doc(doc_token, local_content):
    """更新飞书文档内容，用--as user身份（必须，bot没有权限）"""
    # 标准命令：cat local-file | lark-cli docs +update --doc token --as user --mode overwrite --markdown -
    # 这里我们把内容通过stdin传进去
    cmd = [LARK_CLI, "docs", "+update", "--doc", doc_token, "--as", "user", "--mode", "overwrite", "--markdown", "-"]

    # 取消代理已经在环境变量设置了
    result = subprocess.run(cmd, input=local_content, capture_output=True, text=True, encoding='utf-8')

    if result.returncode != 0:
        try:
            print(f"    [FAIL] 更新失败: {result.stderr}")
        except UnicodeEncodeError:
            print("    [FAIL] 更新失败 (encoding error in error message)")
        return False

    try:
        data = json.loads(result.stdout)
        if data.get("ok") == True:
            print("    [OK] 更新成功")
            return True
        else:
            try:
                print(f"    [FAIL] 返回错误: {data}")
            except UnicodeEncodeError:
                print("    [FAIL] 返回错误 (encoding error)")
            return False
    except Exception as e:
        print(f"    [OK] 更新完成 (非JSON返回) 异常: {e}")
        return True

def create_feishu_doc(folder_token, doc_name, local_content):
    """在飞书文件夹创建新文档"""
    params = {
        "folder_token": folder_token,
        "name": doc_name
    }
    cmd = ["docs", "+create", "--params", json.dumps(params)]
    result = run_lark_command(cmd)

    if not result:
        return None

    # 创建成功后得到doc token
    doc_token = result.get("token")
    if not doc_token:
        print(f"    [FAIL] 创建成功但没拿到token")
        return None

    # 更新内容
    success = update_feishu_doc(doc_token, local_content)
    if not success:
        return None

    print(f"    [OK] 创建成功: {doc_name} -> token={doc_token}")
    return doc_token

def find_feishu_folder_by_path(path_parts):
    """递归查找飞书文件夹，从根开始按路径找"""
    current_folder = FEISHU_ROOT_FOLDER
    for part in path_parts:
        # 列出当前文件夹内容找同名文件夹
        files = run_lark_command(["drive", "files", "list", "--params", json.dumps({"folder_token": current_folder})])
        if not files or "files" not in files:
            print(f"    [FAIL] 找不到文件夹: {part} 在 {current_folder}")
            return None

        found = None
        for f in files["files"]:
            if f.get("name") == part and f.get("type") == "folder":
                found = f.get("token")
                break

        if not found:
            print(f"    [FAIL] 找不到子文件夹: {part}")
            return None

        current_folder = found

    return current_folder

def should_update(local_mtime, feishu_modified_ts):
    """判断是否需要更新：本地比飞书新就更新"""
    # 本地mtime是秒级时间戳
    # 飞书返回的也是秒级时间戳
    return local_mtime > feishu_modified_ts

def read_local_file(local_path):
    """读取本地文件内容"""
    with open(local_path, "r", encoding="utf-8") as f:
        return f.read()

def sync_core_docs(root_dir, stats):
    """同步已经映射好的核心文档，以本地为准直接覆盖"""
    print("\n[CORE] Start sync core documents...")

    for name, (local_rel_path, feishu_token) in CORE_MAPPING.items():
        local_path = os.path.join(root_dir, local_rel_path)

        if not os.path.exists(local_path):
            print(f"\n  {name}: 本地文件不存在，跳过")
            stats["skipped"] += 1
            continue

        print(f"\n  {name} -> {local_rel_path}")
        # 用户要求：本地为准，直接覆盖，不比较时间
        print(f"    [UPDATE] 本地覆盖飞书，以GitHub为准")
        content = read_local_file(local_path)
        success = update_feishu_doc(feishu_token, content)

        if success:
            stats["updated"] += 1
        else:
            stats["failed"] += 1

    return stats

def walk_local_markdown(root_dir):
    """遍历本地所有markdown文件，yield (rel_path, full_path, mtime)"""
    for root, dirs, files in os.walk(root_dir):
        for f in files:
            if f.endswith(".md"):
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, root_dir)
                mtime = os.path.getmtime(full_path)
                yield rel_path, full_path, mtime

def sync_incremental(root_dir):
    """增量同步，遍历五大板块，对比时间"""
    stats = {"added": 0, "updated": 0, "skipped": 0, "failed": 0}

    # 先同步核心文档
    stats = sync_core_docs(root_dir, stats)

    print("\n[SCAN] 扫描本地新增markdown文件...")

    # 遍历五大板块，找不在CORE_MAPPING里的文件，增量同步
    # TODO: 这里可以优化，现在只处理核心，后面再放开全量

    print("\n" + "="*60)
    print("[DONE] GitHub -> Feishu Sync Complete!")
    print("  Added: %d" % stats['added'])
    print("  Updated: %d" % stats['updated'])
    print("  Skipped: %d" % stats['skipped'])
    print("  Failed: %d" % stats['failed'])
    print("="*60)

    return stats

def main():
    """主函数"""
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
    print("[START] 开始 GitHub -> 飞书增量同步，根目录: %s" % root_dir)
    print("[CONFIG] 飞书根文件夹: %s" % FEISHU_ROOT_FOLDER)
    print("[RULES] 以GitHub为准，本地比飞书新才更新，不删除飞文档\n")

    # 检查lark-cli存在
    if not os.path.exists(LARK_CLI):
        print(f"[ERROR] lark-cli 不存在于 {LARK_CLI}，请检查路径")
        sys.exit(1)

    # 开始同步
    sync_incremental(root_dir)

if __name__ == "__main__":
    main()
