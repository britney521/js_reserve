import requests
import time
import execjs
from urllib.parse import urlencode


# 自定义拼接查询字符串
def custom_urlencode(params):
    # 按照键的顺序排序（可选，如果不排序，顺序会根据字典的插入顺序）
    sorted_params = sorted(params.items(), key=lambda item: item[0])

    # 拼接查询字符串
    query_string = "&".join([f"{key}={value}" for key, value in sorted_params])
    return query_string



headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Pragma': 'no-cache',
    'Referer': 'https://www.nmpa.gov.cn/datasearch/search-result.html',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
    'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'token': 'false',
    "Cookie": "ariauseGraymode=false; arialoadData=true; ariawapChangeViewPort=true; visualdevice=pc; token=; STEP_TIPS_INDEX=true; acw_tc=276aede917491143032528059e043fa109ec647fb26ecad22dfc3d863b36a3; STEP_TIPS_RESULT=true"
}

for i in range(1,100):
    timestamp = int(time.time()*1000)
    # 药品  ff80808183cad75001840881f848179f
    params = {
        'itemId': 'ff8080818046502f0180f934f6873f78',
        'isSenior': 'N',
        'searchValue': '葡萄糖',
        'pageNum': str(i),
        'pageSize': '10',
        'timestamp': f'{timestamp}',
    }
    encoded_params = custom_urlencode(params)
    ctx = execjs.compile(open('search/search.js','r',encoding='utf-8').read())
    sign = ctx.call('get_sign',encoded_params)
    print('sign,',sign,encoded_params)
    headers['sign'] = sign
    headers['timestamp'] = f'{timestamp}'
    response = requests.get('https://www.nmpa.gov.cn/datasearch/data/nmpadata/search', params=params,  headers=headers)

    print(response.text)