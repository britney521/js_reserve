import requests
import execjs
import time

ctx = execjs.compile(open('js/token.js','r',encoding='utf-8').read())



headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json',
    'Origin': 'https://www.tianyancha.com',
    'Pragma': 'no-cache',
    'Referer': 'https://www.tianyancha.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    # 'X-AUTH-TOKEN': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNzMxNTIzMTU5NiIsImlhdCI6MTc1Mzk0NDk5MCwiZXhwIjoxNzU2NTM2OTkwfQ.MSCa4msojCmBNolEP__rtJSAzo6CXwvMuePC2n_7XAPA8DHIr8cS7tEKeo3RZcMxqlGOY5m2XtbCwa9g8fHXoA',
    # 'X-TYCID': '5ccbc9506ddb11f0b23e394b70bc8fcc',
    'eventId': 'i246',
    'page_id': 'SearchResult',
    'pm': '451',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'spm': 'i246',
}

params = {
    '_': str(int(time.time()*1000)),
}
X_TYCID = ctx.call('get_token','TYCID')
auth_token = ctx.call('get_token','auth_token')
headers['X-AUTH-TOKEN'] = auth_token
headers['X-TYCID'] = X_TYCID
json_data = {
    'filterJson': '{"economicTypeMethod":{"key":"economicTypeMethod","items":[{"value":"1"}]},"institutionTypeMethod":{"key":"institutionTypeMethod","items":[{"value":"1"}]},"word":{"key":"word","items":[{"value":"少林寺"}]}}',
    'searchType': 1,
    'sessionNo': '1753944990.23319382',
    'allowModifyQuery': 1,
    'reportInfo': {
        'page_id': 'SearchResult',
        'page_name': '主搜搜索结果页',
        'tab_id': 'company',
        'tab_name': '公司',
        'search_session_id': '1753944990.23319382',
        'distinct_id': '308462737',
    },
    'pageNum': 1,
    'pageSize': 20,
}

response = requests.post(
    'https://capi.tianyancha.com/cloud-tempest/web/searchCompanyV4',
    params=params,
    headers=headers,
    json=json_data,
)


print(response.json()['data'])
