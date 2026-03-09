import requests
import execjs

ctx = execjs.compile(open('main.js', 'r', encoding='utf-8').read())

headers = {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-type': 'application/json',
    'device-uuid': '6336ea3709da0e3e2e8414a6db5dba31',
    'priority': 'u=1, i',
    'referer': 'https://servicewechat.com/wx08ed3dc45df80a37/751/page-frame.html',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'token': 'Bz1calVvUGNUaQ0_Az5QZQY0XG5VbQJAVmwLO1JtXW9Vb19vBToAMFppX2xWHwJoUTtbMwBtXTk',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090c39)XWEB/14315',
    'userid': '11316547951',
    'x-canary-userid': '11316547951',
    'x-nonce': '8be13abd25185e2194ae7948c54d5226',
    'x-requested-env': 'miniprogram',
    'x-requested-refer': '/package/doctor/pages/evaluate/index/index',
    'x-requested-with': 'XMLHttpRequest',
    'x-trace-id': 'v1-1760187270956-6522184860613',
    'xweb_xhr': '1',
}
# "x-trace-id": "v1-" + Date.now() + "-" + (Math.floor(8999999999999 * Math.random()) + 1e12),
for page in range(1, 5):
    params = {
        'userId': '11316547951',
        '_an': 'hdfjia',
        '_av': 'v20250924.1',
        '_r': '7',
        'device_uuid': '6336ea3709da0e3e2e8414a6db5dba31',
        'doctorId': '3140616663',
        'siftId': '1',
        'nowPage': str(page),
        'pageSize': '10',
        'diseaseId': '',
        'token': 'Bz1calVvUGNUaQ0_Az5QZQY0XG5VbQJAVmwLO1JtXW9Vb19vBToAMFppX2xWHwJoUTtbMwBtXTk',
    }
    h = f'salt=haodf_2023&userId=11316547951&_an=hdfjia&_av=v20250924.1&_r=7&device_uuid=6336ea3709da0e3e2e8414a6db5dba31&doctorId=3140616663&siftId=1&nowPage={page}&pageSize=10&diseaseId=&token=Bz1calVvUGNUaQ0_Az5QZQY0XG5VbQJAVmwLO1JtXW9Vb19vBToAMFppX2xWHwJoUTtbMwBtXTk'

    x_noce = ctx.call('get_xnoce', h)
    print('x_noce:', x_noce)
    headers['x-nonce'] = x_noce
    response = requests.get('https://weixinmp.haodf.com/ndoctor/wxmp/evaluate/getCommentShowList', params=params, headers=headers)

    # print(response.text)

    data = response.json()['data']['data']
    for item in data:
        effect = item['effect']
        id = item['id']
        disease = item['disease']
        content = item['content']
        print(id, effect, disease, content)