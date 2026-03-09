import re
import time
import execjs
import requests

cookies = {
    'abRequestId': '79283a98-14b1-5bea-b467-052e5a089f6a',
    'a1': '198554a01cf7enzt7hym0o6ertr683h1g0fewk7g230000193196',
    'webId': '3509aa5d43b0a164cab500aa153c1536',
    'gid': 'yjY22408S2kjyjY22408y8TWSiWdIu9Wxv68ikJlKdF9Fdq8KYqxyE888yjqyjK80qfJK8qf',
    'web_session': '040069b676d00b2558157048aa3a4bb5b99006',
    'xsecappid': 'xhs-pc-web',
    'acw_tc': '0a4a3e3517553131668941865e0b72c36c61e9015adc7fa67bdd96e11d80e0',
    'websectiga': '2845367ec3848418062e761c09db7caf0e8b79d132ccdd1a4f8e64a11d0cac0d',
    'sec_poison_id': 'a8502c80-3a24-4425-9361-3f574286bae8',
    'webBuild': '4.75.3',
    'unread': '{%22ub%22:%2268930b02000000002501ac3c%22%2C%22ue%22:%22689e2273000000001b037274%22%2C%22uc%22:24}',
    'loadts': '1755313348116',
}
headers = {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'access-control-request-headers': 'content-type,x-b3-traceid,x-s,x-s-common,x-t,x-xray-traceid',
    'access-control-request-method': 'POST',
    'cache-control': 'no-cache',
    'origin': 'https://www.xiaohongshu.com',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://www.xiaohongshu.com/',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
}
session = requests.Session()
res = requests.options('https://edith.xiaohongshu.com/api/sns/web/v1/homefeed', headers=headers)
print(res.text)

file_path = "js/env.js"
new_a1_value = cookies['a1']
with open(file_path, 'r') as f:
    js_content = f.read()


updated_js_content = re.sub(r'a1=[^;]+;', f'a1={new_a1_value};', js_content)
with open(file_path, 'w') as f:
    f.write(updated_js_content)

ctx = execjs.compile(open('js/x-s.js', 'r', encoding='utf-8').read())
ctx2 = execjs.compile(open('js/x-common.js', 'r', encoding='utf-8').read())
json_data = {
    "cursor_score": "",
    "num": 30,
    "refresh_type": 1,
    "note_index": 29,
    "unread_begin_note_id": "",
    "unread_end_note_id": "",
    "unread_note_count": 0,
    "category": "homefeed_recommend",
    "search_key": "",
    "need_num": 10,
    "image_formats": [
        "jpg",
        "webp",
        "avif"
    ],
    "need_filter_image": False
}

x = "/api/sns/web/v1/homefeed"
cookie_a1 = cookies['a1']
x_data = ctx.call('seccore_signv2', x, json_data)
x_b3_traceid = ctx.call('generateTraceId')
traceId = ctx.call('traceId',x_data['x-t'])
# x_s = rpc_token(x, data)


x_common = ctx2.call('get_x_common', cookie_a1)
print('x_data', x_data)
print('x_common', x_common)
print('x_b3_traceid', x_b3_traceid)
print('traceId', traceId)
headers['x-s'] = x_data['x-s']
headers['x-b3-traceid'] = x_b3_traceid
headers['x-xray-traceid'] = traceId
headers['x-s-common'] =  x_common
headers['x-t'] =  str(x_data['x-t'])
response = session.post('https://edith.xiaohongshu.com/api/sns/web/v1/homefeed', cookies=cookies, headers=headers, json=json_data)
print(response.text)

data = response.json()['data']['items']
for item in data:
    id = item['id']
    display_title = item['note_card']['display_title']
    username = item['note_card']['user']['nickname']
    print(id, display_title, username)
