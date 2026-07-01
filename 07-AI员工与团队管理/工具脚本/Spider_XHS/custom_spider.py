import json
import os
from loguru import logger
from apis.xhs_pc_apis import XHS_Apis
from xhs_utils.common_util import init
from xhs_utils.data_util import handle_note_info, download_note, save_to_xlsx

class Data_Spider():
    def __init__(self):
        self.xhs_apis = XHS_Apis()

    def spider_note(self, note_url: str, cookies_str: str, proxies=None):
        note_info = None
        try:
            success, msg, note_info = self.xhs_apis.get_note_info(note_url, cookies_str, proxies)
            if success:
                note_info = note_info['data']['items'][0]
                note_info['url'] = note_url
                note_info = handle_note_info(note_info)
        except Exception as e:
            success = False
            msg = e
        logger.info(f'爬取笔记信息 {note_url}: {success}, msg: {msg}')
        return success, msg, note_info

if __name__ == '__main__':
    cookies_str, base_path = init()
    data_spider = Data_Spider()
    
    # 爬取我们目标笔记
    note_url = 'https://www.xiaohongshu.com/discovery/item/6a1519cb00000000060304b5?source=webshare&xhsshare=pc_web&xsec_token=ABQnw1J0Z1tdgKxznegIbGq18suiUM1uQK22bSIw3xDrc=&xsec_source=pc_share'
    success, msg, note_info = data_spider.spider_note(note_url, cookies_str, None)
    
    print('\n========== 爬取结果 ==========')
    print(f'成功: {success}')
    print(f'消息: {msg}')
    if success and note_info:
        print(f'\n标题: {note_info.get("title", "无")}')
        print(f'\n描述: {note_info.get("desc", "无")}')
        print(f'\n是否视频: {note_info.get("is_video", False)}')
        if note_info.get("is_video", False):
            print(f'视频链接: {note_info.get("video_url", "无")}')
        # 保存JSON结果
        with open('/Users/kunki/Documents/我的知识库/E-产出交付/06-临时文件/xhs_note_result.json', 'w', encoding='utf-8') as f:
            json.dump(note_info, f, ensure_ascii=False, indent=2)
        print(f'\n结果已保存到 E-产出交付/06-临时文件/xhs_note_result.json')
