
import sys
import requests
import json

url = "https://gqkkndrhn25.feishu.cn/drive/folder/EDWvfNDvSlxztQdmJxlcDWWzneb?from=from_copylink"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

try:
    response = requests.get(url, headers=headers)
    print(f"Status code: {response.status_code}")
    print(f"URL: {url}")
    with open('feishu_page.html', 'w', encoding='utf-8') as f:
        f.write(response.text)
    print("Saved to feishu_page.html")
except Exception as e:
    print(f"Error: {e}")
