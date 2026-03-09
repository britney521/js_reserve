import hashlib
import json
import re
import time
from get_cookie import get_m_h5_tk
import execjs
import requests

session = requests.Session()
# cookies = {
#     'mtop_partitioned_detect': '1',
#     '_m_h5_tk': 'a6b4aa92a66fadb952b305cc55f59dd3_1730286944543',
#     '_m_h5_tk_enc': '0ab522b0d0b8f14a65ba63c603e81b0a',
# }

headers = {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    # Requests sorts cookies= alphabetically
    # 'cookie': 'cna=1TVDH32CKx8CAW+tytNNZEdK; lid=%E5%B8%83%E5%85%B0%E5%A6%AEgreat; ali_apache_track=c_mid=b2b-1870847194|c_lid=%E5%B8%83%E5%85%B0%E5%A6%AEgreat|c_ms=1; taklid=2204583b11994183aaa0007032a67646; xlly_s=1; cookie1=WvLEeeU9JXBlLInRXvpZ94RiEx71uUnjqWq3%2Fv35U3c%3D; cookie2=11deec0e46cf2e8ea015033716b462d0; cookie17=UonciUrwAhKNfw%3D%3D; sgcookie=E100FVIkeSd6ZDSaRKLCLenopHZt4ltGwAzGHxIEfjdNfWL%2FeAKrGmf17UuTEJjroCZ8xoT76lUJsI8dxR3AsJ76ou89vzmu0msuvhYbbC%2FnmKe8aaL6pQ5w%2FsdlfU1uqu7e; t=4efd1ab8f668b3c0e740d2a1f3dd9006; _tb_token_=fe637778ff08d; sg=t49; csg=7bd0b070; unb=1870847194; uc4=id4=0%40UOE2TvRA9Gq834g%2FIDtcLNDLzs7J&nk4=0%4000Z7ohQnczaLBI7JbMQ%2FzrQ88COVwQ%3D%3D; _nk_=%5Cu5E03%5Cu5170%5Cu59AEgreat; __cn_logon__=true; __cn_logon_id__=%E5%B8%83%E5%85%B0%E5%A6%AEgreat; ali_apache_tracktmp=c_w_signed=Y; leftMenuLastMode=EXPEND; leftMenuModeTip=shown; ali_ab=111.173.205.193.1730095483095.8; keywordsHistory=%E7%BE%BD%E6%AF%9B%E7%90%83%3B%E7%BE%BD%E6%AF%9B%E7%90%83%E6%AF%94%E8%B5%9B%E7%94%A8%E7%90%83%3B%E7%BE%BD%E6%AF%9B%E7%90%83%E5%8C%85%E9%82%AE; __mwb_logon_id__=%25E5%25B8%2583%25E5%2585%25B0%25E5%25A6%25AEgreat; mwb=tm; _csrf_token=1730193873106; _m_h5_c=4047bc229687a8f495cbd2e9c3959bba_1730202902125%3Be97780bda4e7bb5f897eafbe609e8636; mtop_partitioned_detect=1; _m_h5_tk=d3abf9325d6040c3a65b5b518e741e59_1730261095192; _m_h5_tk_enc=0b685c647f20f272dab91eedb27680db; isg=BHBwr_Bo41Kysb7LXWSoLN0zQT7CuVQD9QNTV2rBPEueJRDPEskkk8YWfS1FtQzb; tfstk=fHMjc99JpZbXZEO2OGKzOaASY8y68V9eBGZtxcBVX-eYCdi_zoCOBOh75437k-R0Qc37bk7OWmea5Ygr5Ol4_jy6fcUo_RyV3YwsXccVQryA1hg-xSH43cSmZ2od3xR0QOw0IRLe8pJemm2gBOBwpdUm20q9BFywxmm0IgYe8pJEmNaw9dhYBVe8eoqTBP3TM0K7Xl7A6t39V0UufPEAHlURelrNWRetW0K7jbQHFuRbkmtuilO7vBGsDz6smYZYGsmYPOBtFbNbJNa5BOH7c0ry1gWB_yh3uWznyLWbC0EsPWlXRtgsXDcTNA_v02ntoYw0dC-0ObhrTSGWkOar3lNLB7sOB0w7r2MTppQ7qbnq6x0ffOEm3vP_-7tOI5y-LWhKlGxn2-EtSWDw-t4xXDDnTJ9f-oG-A8sPx9zBMsC1VWXTVy-WV1fMiF6EYTTw0OFYqu7eV3_fsSEuVy-WV1fgMuqyY3t5l1f..; _user_vitals_session_data_={"user_line_track":true,"ul_session_id":"8u56lfy50vv","last_page_id":"shuangditiyu.1688.com%2Fxm5xom956br"}',
    'pragma': 'no-cache',
    'referer': 'https://shuangditiyu.1688.com/',
    'sec-ch-ua': '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'script',
    'sec-fetch-mode': 'no-cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
}

params = {
    'jsv': '2.7.0',
    'appKey': '12574478',
    # 't': '1730254393025',
    # 'sign': 'b4480231a5c290972c17088afb478797',
    'api': 'mtop.alibaba.alisite.cbu.server.pc.ModuleAsyncService',
    'v': '1.0',
    'type': 'jsonp',
    'valueType': 'string',
    'dataType': 'jsonp',
    'timeout': '10000',
    'callback': 'mtopjsonp1',
    'data': '{"componentKey":"wp_pc_contactsmall","params":"{\\"memberId\\":\\"b2b-26168141382d3ea\\"}"}',
}

session.get('https://h5api.m.1688.com/h5/mtop.alibaba.alisite.cbu.server.pc.moduleasyncservice/1.0/',
                        params=params, headers=headers)

def md5(data):
    md5 = hashlib.md5()
    md5.update(data.encode('utf-8'))
    return md5.hexdigest()

cookies = session.cookies.get_dict()
print('cookie',cookies)

time1 = int(time.time()*1000)
ctx = execjs.compile(open('js/sign.js','r',encoding='utf-8').read())
token = cookies['_m_h5_tk'].split('_')[0]
appKey = "12574478"
# sign_js_path = './js/sign.js'
p = (token + '&' + str(time1) + '&' + appKey + '&' + str(params['data']))
print(p,'p',md5(p))
# sign = execjs.compile(open(sign_js_path).read()).call('h', p)
# print(sign)
params['t'] = time1
params['sign'] = md5(p)
print(params)

response = requests.get('https://h5api.m.1688.com/h5/mtop.alibaba.alisite.cbu.server.pc.moduleasyncservice/1.0/', params=params, cookies=cookies, headers=headers)
print(response.text)


content = re.findall('mtopjsonp1\((.*?)\)',response.text)
if content:
    data = json.loads(content[0])
    companyName = data['data']['companyName']
    address = data['data']['address']
    phoneNum = data['data'].get('phoneNum','')
    mobileNo = data['data']['mobileNo']
    print(companyName,address, phoneNum, mobileNo)