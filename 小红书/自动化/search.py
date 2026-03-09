import time

import requests
import json
import execjs
from DrissionPage import ChromiumOptions, Chromium,errors
from bs4 import BeautifulSoup

def get_detail(url):
    co = ChromiumOptions().set_local_port(1066).set_browser_path(r'/Applications/GPT Chrome.app/Contents/MacOS/GptBrowser')
    tab = Chromium(co)
    page = tab.get_tab()

    page.get(url)
    page.set.cookies(cookies)
    page.wait.doc_loaded()
    soup = BeautifulSoup(page.html,'html.parser')
    if soup.select_one('#detail-desc'):
        detail = soup.select_one('#detail-desc').get_text(strip=True)
    else:
        detail = None
    return detail

def get_ip(url):
    co = ChromiumOptions().set_local_port(1066).set_browser_path(
        r'/Applications/GPT Chrome.app/Contents/MacOS/GptBrowser')
    tab = Chromium(co)
    page = tab.get_tab()

    page.get(url)
    page.set.cookies(cookies)
    page.wait.doc_loaded()
    soup = BeautifulSoup(page.html, 'html.parser')
    if soup.select_one('span.user-IP'):
        ip = soup.select_one('span.user-IP').get_text(strip=True)
    else:
        ip = '无'
    return ip


cookies = {
    'abRequestId': '79283a98-14b1-5bea-b467-052e5a089f6a',
    'xsecappid': 'xhs-pc-web',
    'a1': '198554a01cf7enzt7hym0o6ertr683h1g0fewk7g230000193196',
    'webId': '3509aa5d43b0a164cab500aa153c1536',
    'gid': 'yjY22408S2kjyjY22408y8TWSiWdIu9Wxv68ikJlKdF9Fdq8KYqxyE888yjqyjK80qfJK8qf',
    'webBuild': '4.75.3',
    'acw_tc': '0a0b135b17548843767274116e83d649beef7173a8af3a5e7d8e7a0c07e8a1',
    'loadts': '1754885633536',
    'websectiga': 'cf46039d1971c7b9a650d87269f31ac8fe3bf71d61ebf9d9a0a87efb414b816c',
    'sec_poison_id': '824f805c-d8cb-4cb5-a85f-eb438d09a6fd',
    'web_session': '040069b676d00b2558151b27ac3a4b3a5e6433',
    'unread': '{%22ub%22:%22688c24a0000000002202324f%22%2C%22ue%22:%2268996f0f0000000003032ef6%22%2C%22uc%22:23}',
}
ctx = execjs.compile(open('../js/x-s.js', 'r', encoding='utf-8').read())
ctx2 = execjs.compile(open('../js/x-common.js', 'r', encoding='utf-8').read())

session = requests.Session()
headers = {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "access-control-request-headers": "content-type,x-b3-traceid,x-s,x-s-common,x-t,x-xray-traceid",
        "access-control-request-method": "POST",
        "cache-control": "no-cache",
        "origin": "https://www.xiaohongshu.com",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://www.xiaohongshu.com/",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
def first():

    url = 'https://edith.xiaohongshu.com/api/sns/web/v1/search/notes'
    # 发送GET请求
    response = session.options(url, headers=headers,cookies=cookies)

    print(response.text)

url = "https://edith.xiaohongshu.com/api/sns/web/v1/search/notes"

keyword = '癌症 倒计时'
headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json;charset=UTF-8',
    'origin': 'https://www.xiaohongshu.com',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://www.xiaohongshu.com/',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    # 'x-s': 'XYS_2UQhPsHCH0c1PjhlHjIj2erjwjQhyoPTqBPT49pjHjIj2eHjwjQ+GnPW/MPjNsQhPUHCHfM1qAZlPebKL/Q9LrYF/eGEaDWlGApN4f+18fRS/0ShcD8BnnbN/AL68MPA+BYIN7i3zok7aBbst7SF4p+Ynd4z+n+DJeclnrza+e8Snf+LySHIyopCJrD6NFGM8ep3G/Qc49SC40+SzgmNJSYO87Yd/DQxc9P64SHE/omMaLhIJDMDz9rEaFkSzSYrnB+1J/mo/gGh8n+aGfTwJgkwLMDF/DzPJBrl+/QizASaw/SrPAGjNsQh+sHCHfRjyfp04sQR',
    # 'x-s-common': '2UQAPsHCPUIjqArjwjHjNsQhPsHCH0rjNsQhPaHCH0c1PjhlHjIj2eHjwjQ+GnPW/MPjNsQhPUHCHdYiqUMIGUM78nHjNsQh+sHCH0c1+AH1PsHVHdWMH0ijP/DhPerF+eDM+nz6GfSTGgSjwgLMqeLU+gGM+gb6qfT6Jg+jG0z0PAqAPeZIPeL9w/WF+UHVHdW9H0ijHjIj2eqjwjHjNsQhwsHCHDDAwoQH8B4AyfRI8FS98g+Dpd4daLP3JFSb/BMsn0pSPM87nrldzSzQ2bPAGdb7zgQB8nph8emSy9E0cgk+zSS1qgzianYt8p+s/LzN4gzaa/+NqMS6qS4HLozoqfQnPbZEp98QyaRSp9P98pSl4oSzcgmca/P78nTTL0bz/sVManD9q9z18np/8db8aob7JeQl4epsPrzsagW3tF4ryaRApdz3agYDq7YM47HFqgzkanYMGLSbP9LA/bGIa/+nprSe+9LI4gzVPDbrJg+P4fprLFTALMm7+LSb4d+kpdzt/7b7wrQM498cqBzSpr8g/FSh+bzQygL9nSm7qSmM4epQ4flY/BQdqA+l4oYQ2BpAPp87arS34nMQyFSE8nkdqMD6pMzd8/4SL7bF8aRr+7+rG7mkqBpD8pSUzozQcA8Szb87PDSb/d+/qgzVJfl/4LExpdzQ4fRSy7bFP9+y+7+nJAzdaLp/2LSizgr3wLzpag8C2/zQwrRQynP7nSm7zDS9yLLFJURAzrlDqA8c4M8QcA4SL9c78ni620zQzg8S+DMc/gzn4MpQynzAP7P6q7Yy/fpkpdzjGMpS8pSn478Q4DF62jR68nzM47pPJjRAzb878LShJozQ2bk/J7p7/94n47mAJMzHLbqM8nG7/fp34g40aLp6qM+dJ9Ll/op+anSw8p4PPo+h8BWManStq7Yc4ASQybHEaSm7aSmM4b4Q40+SPp8FPLSk/dPlqgqManW6qMSl4b+oqg4EJgb7zrS9anTQc7mF/9k+LAz1+9phLoc7anYi2LSk8Bpr4gqFqSSza7mp8o+8qDMpanYT/Mml4F4A4g49a/+t8/8n4opzGA4SpbS9q9SBwrlQyB4AP9zwqAbl4r4ILo4YagG78/ml49SQyA8Sy9RP8LS9N9p8cDbSpM8FLFDA/7+h4gzfzA48qLSbyaTQc94Ay7Z9qAGEN9LIG08A8bmF2DS9+rSQyobV2Sm74rDAqLbQyFRSzB+VLDTfP9p3LozyanTa4Fll4rpozrbSPnH7qAml49pALoz6aL+LzrSip0FjNsQhwaHC+/rA+ALU+0ZUNsQhP/Zjw0ZVHdWlPaHCHfE6qfMYJsQR',
}
first()

x = '/api/sns/web/v1/search/notes'
import csv
f = open(f'{keyword}.csv','a',encoding='utf-8')
csv_f = csv.writer(f)
csv_f.writerow(['笔记id','作品类型','作者','发布时间','喜欢','收藏','评论','详情','标题','笔记链接','作者地址','图片链接'])
for i in range(1,26):
    time.sleep(1)
    data = {
        'keyword': keyword,
        'page': i,
        'page_size': 20,
        'search_id': '2f6i0m40cqfkww2dfvjb7@2f6i0p2qolweyd5dfbfmq',
        'sort': 'general',
        'note_type': 0,
        'ext_flags': [],
        'filters': [
            {
                'tags': [
                    'popularity_descending',
                ],
                'type': 'sort_type',
            },
            {
                'tags': [
                    '不限',
                ],
                'type': 'filter_note_type',
            },
            {
                'tags': [
                    '不限',
                ],
                'type': 'filter_note_time',
            },
            {
                'tags': [
                    '不限',
                ],
                'type': 'filter_note_range',
            },
            {
                'tags': [
                    '不限',
                ],
                'type': 'filter_pos_distance',
            },
        ],
        'geo': '',
        'image_formats': [
            'jpg',
            'webp',
            'avif',
        ],
    }
    response = requests.post(url, headers=headers, data=json.dumps(data),cookies=cookies)
    print(f'第{i}页----------------------------------------')

    # 检查响应
    if response.status_code == 200:
        result = response.json()
        print(response.text)
        # print(json.dumps(result, indent=2, ensure_ascii=False))
        for note in result['data']['items']:
            id = note['id']
            note_card = note.get('note_card')
            model_type = note.get('model_type')
            xsec_token = note.get('xsec_token')
            if note_card:
                display_title = note_card.get('display_title')
                nick_name = note_card['user']['nick_name']
                user_id = note_card['user']['user_id']
                publish_time = note_card['corner_tag_info'][0]['text']
                image_urls = []
                image_list = note_card['image_list']
                for image in image_list:
                    image_urls.append(image['info_list'][0]['url'])
                collected_count = note_card['interact_info']['collected_count']
                comment_count = note_card['interact_info']['comment_count']
                liked_count = note_card['interact_info']['liked_count']
                user_url = f'https://www.xiaohongshu.com/user/profile/{user_id}'
                note_url = f'https://www.xiaohongshu.com/explore/{id}?xsec_token={xsec_token}&xsec_source=pc_search&source=unknown'
                time.sleep(1)
                content = get_detail(note_url)
                user_addtress = get_ip(user_url)
                print(id,model_type,nick_name,publish_time,liked_count,collected_count,comment_count,display_title,user_url,note_url)
                csv_f.writerow(
                    [id, model_type, nick_name, publish_time, liked_count, collected_count, comment_count, content, display_title, note_url,
                     user_addtress, ','.join(image_urls)])

    else:
        print(f"请求失败，状态码: {response.status_code}")
        print(response.text)