import re

import execjs
import requests
import time

cookies = {
    'abRequestId': '79283a98-14b1-5bea-b467-052e5a089f6a',
    'xsecappid': 'xhs-pc-web',
    'a1': '198554a01cf7enzt7hym0o6ertr683h1g0fewk7g230000193196',
    'webId': '3509aa5d43b0a164cab500aa153c1536',
    'gid': 'yjY22408S2kjyjY22408y8TWSiWdIu9Wxv68ikJlKdF9Fdq8KYqxyE888yjqyjK80qfJK8qf',
    'webBuild': '4.75.3',
    'web_session': '040069b676d00b2558158510ac3a4b01051009',
    'unread': '{%22ub%22:%22689759d40000000004001076%22%2C%22ue%22:%22689958ae000000002500c290%22%2C%22uc%22:27}',
    'websectiga': '3633fe24d49c7dd0eb923edc8205740f10fdb18b25d424d2a2322c6196d2a4ad',
    'sec_poison_id': '288f6224-8475-4a73-9072-86247f9947e3',
    'acw_tc': '0a0bb16f17548818286266620e444b31613fabd36a5d8b32fad6f952bdad96',
    'loadts': '1754881836879',
}

headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json;charset=UTF-8',
    # 'cookie': 'abRequestId=79283a98-14b1-5bea-b467-052e5a089f6a; xsecappid=xhs-pc-web; a1=198554a01cf7enzt7hym0o6ertr683h1g0fewk7g230000193196; webId=3509aa5d43b0a164cab500aa153c1536; gid=yjY22408S2kjyjY22408y8TWSiWdIu9Wxv68ikJlKdF9Fdq8KYqxyE888yjqyjK80qfJK8qf; webBuild=4.75.3; web_session=040069b676d00b2558158510ac3a4b01051009; unread={%22ub%22:%22689759d40000000004001076%22%2C%22ue%22:%22689958ae000000002500c290%22%2C%22uc%22:27}; websectiga=3633fe24d49c7dd0eb923edc8205740f10fdb18b25d424d2a2322c6196d2a4ad; sec_poison_id=288f6224-8475-4a73-9072-86247f9947e3; acw_tc=0a0bb16f17548818286266620e444b31613fabd36a5d8b32fad6f952bdad96; loadts=1754881836879',
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
    # 'x-b3-traceid': '6c0285debd2cc53a',
    # 'x-s': 'XYS_2UQhPsHCH0c1PjhMHjIj2erjwjQhyoPTqBPT49pjHjIj2eHjwjQ+GnPW/MPjNsQhPUHCHfM1qAZlPebKL/Q9LrYFngzrzSzwPFlwP/8sPL8iL9QVy9+YLFz740pyLLlD8Mkwwn+3nL8HtMkxJrEdJdmH/AbTcSme+/4kyDQaNAQwn/YLJBH9t7iM8F4swnGAyrYSnB4hG9QzG9HULrk1pFRT/9Sjy/mB/BT9Lpkknnks8gpoPbSBPoS7zB8i2o4Dy9Th8M48LMStwLzMJFWI/fzI8BE7nnT+cAbx4AYznomfyMzfwLVjNsQh+sHCHfRjyfp04sQR',
    # 'x-s-common': '2UQAPsHCPUIjqArjwjHjNsQhPsHCH0rjNsQhPaHCH0c1PjhMHjIj2eHjwjQ+GnPW/MPjNsQhPUHCHdYiqUMIGUM78nHjNsQh+sHCH0c1+AL1PUHVHdWMH0ijP/Dh+/LFG/ZlG9G78nEC4e4i2nFIJA8SqdzU+0WAyebdPB8S49V78AHAPeZIPerEPArE+jHVHdW9H0ijHjIj2eqjwjHjNsQhwsHCHDDAwoQH8B4AyfRI8FS98g+Dpd4daLP3JFSb/BMsn0pSPM87nrldzSzQ2bPAGdb7zgQB8nph8emSy9E0cgk+zSS1qgzianYt8p+s/LzN4gzaa/+NqMS6qS4HLozoqfQnPbZEp98QyaRSp9P98pSl4oSzcgmca/P78nTTL0bz/sVManD9q9z18np/8db8aob7JeQl4epsPrzsagW3tF4ryaRApdz3agYDq7YM47HFqgzkanYMGLSbP9LA/bGIa/+nprSe+9LI4gzVPDbrJg+P4fprLFTALMm7+LSb4d+kpdzt/7b7wrQM498cqBzSpr8g/FSh+bzQygL9nSm7qSmM4epQ4flY/BQdqA+l4oYQ2BpAPp87arS34nMQyFSE8nkdqMD6pMzd8/4SL7bF8aRr+7+rG7mkqBpD8pSUzozQcA8Szb87PDSb/d+/qgzVJfl/4LExpdzQ4fRSy7bFP9+y+7+nJAzdaLp/2LSiz/Qz+F8pagYTLrRCJnRQyn+G8pm7zDS9yLPUc0mAzoi7q7Yn4BzQ408S8eq78pSxLdSQyaRS+S4Uz0Qc49kQyrkAP9RSqA8r4fpLLozwGML98LzM4ApQ4SSI2Db68p+M4F+dwnpA8Sm7tFDAJBbQ2BMVq7bFq9bc47SAqFYjaFc7q9zs8o+34gzSanS68nc6cnLAG9l+aLpO8nzj4d+nJFpaanTS8pzn4rMQyFzD4op7qrRl4F+QPFkSpopFzDS3P7+kqgzfanDA8p4c4F8tqg4Pwop7+FS9qSYQ2BDUzFQly/zQ4fpkLozianYHqDSk+fprpd40GSSbGFlpPo+gpaTLanSH/Fkl4bmTpd4MagGM8nTc4BD3zDTSpbSNqM8PqbkQz/mAPA4tq9Sc4rl1pd4sagG68nkn47pQyn4Sp0mnnDSe8Bp/wnRSL7bFcLSha7+nqgqlwBRVtFSbpFTQ4f4SL9QdqM8p87PInLbA8bmFJLSbLbYQ4diMNMmF8FShyMpQyA+A+D8rPF4p/7+x4gzYaLp+Pfpl4rPFanRALFMd8n8l4FRAqg47aLP3zDSkqDl1pd40qpmF/DS9+g+///pAygpFt7+n4FQQyLYH8M87yDSetFlY8SSAanYS8p+x8BprqAmApS8FLgSn47SQy7myag8m8/bc4F8Qy9pA8fMPnLSe/ru6/b4Ta/+88LSe8npxLo4k/bmF874c4r+QypH9aLpt8gW64d+3qgz3N9ETzLSeLgzcpd4HqbmFJDS3ynlQy9QzanT/yDSiafpnGDTA8fQVyg4n4rlQ4DIRHjIj2eDjw0rlPAL7w/qU+/rVHdWlPsHCPsIj2erlH0ijJfRUJnbVHdF=',
    'x-t': str(int(time.time()*1000)),
    'x-xray-traceid': 'cc4b8e132da75da85da2b8666fca9def',
}

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

x = "/api/sns/web/v1/feed"
data = json_data
cookie_a1 = cookies['a1']
x_s = ctx.call('seccore_signv2', x, data)
x_b3_traceid = ctx.call('generateTraceId')
traceId = ctx.call('traceId')
# x_s = rpc_token(x, data)


x_common = ctx2.call('get_x_common', cookie_a1)
print('x_s', x_s)
print('x_common', x_common)
print('x_b3_traceid', x_b3_traceid)
print('traceId', traceId)
headers['x-s'] = x_s
headers['x-b3-traceid'] = x_b3_traceid
headers['x-s-common'] =  x_common

json_data = {
    'source_note_id': '620a8f14000000000102b4b6',
    'image_formats': [
        'jpg',
        'webp',
        'avif',
    ],
    'extra': {
        'need_body_topic': '1',
    },
    'xsec_source': 'pc_search',
    'xsec_token': 'ABsAyXSjy-25HlfuRWGkMVwR5sXQYEU0xdGLDkWR9wxNA=',
}

response = requests.post('https://edith.xiaohongshu.com/api/sns/web/v1/feed', cookies=cookies, headers=headers, json=json_data)
print(response.json())