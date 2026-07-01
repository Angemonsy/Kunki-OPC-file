#!/usr/bin/env python3
"""
Extract content from Feishu docx and save as markdown
"""

import sys
import requests
import json
import os
import argparse

def load_config():
    config_path = os.path.join(os.path.expanduser('~'), '.newmax/skills/feishu-doc-reader/reference/feishu_config.json')
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def get_access_token(app_id, app_secret):
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    headers = {"Content-Type": "application/json; charset=utf-8"}
    data = {
        "app_id": app_id,
        "app_secret": app_secret
    }
    response = requests.post(url, headers=headers, json=data)
    result = response.json()
    if result.get("code") == 0:
        return result.get("tenant_access_token")
    else:
        print(f"Error getting access token: {result}")
        return None

BLOCK_TYPE_MAP = {
    1: "page",
    2: "text",
    3: "heading1",
    4: "heading2",
    5: "heading3",
    6: "heading4",
    7: "bullet",
    8: "ordered",
    9: "code",
    10: "quote",
    11: "divider",
    12: "image",
    13: "table",
    14: "table_row",
    15: "table_cell",
    16: "iframe",
    17: "media",
    18: "box",
    19: "callout",
    20: "markdown",
}

def get_block_type(block_type_num):
    """Convert numeric block type to string name"""
    return BLOCK_TYPE_MAP.get(block_type_num, f"unknown_{block_type_num}")

def extract_content_from_elements(elements):
    """Extract text content from elements array"""
    content = ""
    for elem in elements:
        if "text_run" in elem:
            content += elem["text_run"].get("content", "")
    return content

def get_blocks(access_token, doc_token, block_id=None):
    """Get all blocks from document or specific block"""
    if block_id:
        url = f"https://open.feishu.cn/open-apis/docx/v1/documents/{doc_token}/blocks/{block_id}/children"
    else:
        url = f"https://open.feishu.cn/open-apis/docx/v1/documents/{doc_token}/blocks"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json; charset=utf-8"
    }
    response = requests.get(url, headers=headers)
    return response.json()

def process_block(access_token, doc_token, block, indent=0):
    """Recursively process a block and convert to markdown"""
    block_type_num = block.get("block_type")
    block_type = get_block_type(block_type_num)

    # Get the block data
    block_data = None
    for key in block:
        if key in ["block_id", "block_type", "children", "parent_id"]:
            continue
        block_data = block[key]
        break

    if not block_data:
        return ""

    markdown = ""

    # Extract content
    if "elements" in block_data:
        content = extract_content_from_elements(block_data["elements"])
    else:
        content = ""

    # Handle different block types
    if block_type == "heading1":
        markdown = f"# {content}\n\n"
    elif block_type == "heading2":
        markdown = f"## {content}\n\n"
    elif block_type == "heading3":
        markdown = f"### {content}\n\n"
    elif block_type == "heading4":
        markdown = f"#### {content}\n\n"
    elif block_type == "text":
        if content:
            markdown = f"{content}\n"
    elif block_type == "bullet":
        markdown = f"{'  ' * indent}- {content}\n"
    elif block_type == "ordered":
        markdown = f"{'  ' * indent}1. {content}\n"
    elif block_type == "divider":
        markdown = "---\n\n"
    elif block_type == "quote":
        markdown = f"> {content}\n\n"
    elif block_type == "code":
        # Code block content is in the elements
        markdown = f"```\n{content}\n```\n\n"
    elif block_type == "table_cell":
        # Table cell content
        markdown = f"{content}"
    elif block_type == "page":
        # Page is just a container, don't add content but process children
        pass
    else:
        # Other types (image, table, etc.) - for now just skip or add placeholder
        if block_type == "image":
            markdown = f"![Image](feishu-image)\n\n"
        pass

    # Check if this block has children stored directly
    if "children" in block and block["children"]:
        # Children are already listed, need to fetch each child separately
        for child_id in block["children"]:
            children_response = get_blocks(access_token, doc_token, child_id)
            if children_response.get("code") == 0 and "data" in children_response and "items" in children_response["data"]:
                for child in children_response["data"]["items"]:
                    markdown += process_block(access_token, doc_token, child, indent + 1)

    return markdown

def convert_to_markdown(access_token, doc_token, blocks_json):
    """Convert feishu blocks to markdown"""
    if blocks_json.get("code") != 0:
        return None, blocks_json.get("msg")

    markdown = ""
    if "data" in blocks_json and "items" in blocks_json["data"]:
        for block in blocks_json["data"]["items"]:
            markdown += process_block(access_token, doc_token, block)

    return markdown, None

def main():
    parser = argparse.ArgumentParser(description='Extract Feishu docx to markdown')
    parser.add_argument('--doc-token', required=True, help='Feishu docx token')
    parser.add_argument('--output', required=True, help='Output markdown file path')
    args = parser.parse_args()

    config = load_config()
    if not config:
        print("Error: Cannot load config")
        sys.exit(1)

    access_token = get_access_token(config["app_id"], config["app_secret"])
    if not access_token:
        print("Error: Cannot get access token")
        sys.exit(1)

    result = get_blocks(access_token, args.doc_token)
    markdown, error = convert_to_markdown(access_token, args.doc_token, result)

    if error:
        print(f"Error: {error}")
        sys.exit(1)

    if markdown is None:
        markdown = ""

    # Add frontmatter
    from datetime import datetime
    now = datetime.now().isoformat()
    final_content = f"---\ncreated_at: {now}\nsource: feishu\nfeishu_token: {args.doc_token}\n---\n\n{markdown}"

    with open(args.output, 'w', encoding='utf-8') as f:
        f.write(final_content)

    print(f"Saved to {args.output}")
    print(f"Length: {len(final_content)} characters")

if __name__ == "__main__":
    main()
