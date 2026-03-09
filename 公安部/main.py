import time

import requests
from get_code import recognize

headers = {
    'Referer': 'https://zfwzzc.www.gov.cn/check_web/errorInfo/jcInfoNew?siteCode=bm09000013&url=http%3A%2F%2Fwww.mps.gov.cn%2F',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',

}

while True:
    session = requests.Session()
    response = session.get('https://zfwzzc.www.gov.cn/check_web/kaptcha.jpg?1723429117075',headers=headers)
    f = open('img/VerifyCode.png','wb')
    f.write(response.content)
    f.close()
    code = recognize('img/VerifyCode.png')
    print('code: ' + code)
    headers = {
        'Referer': 'https://zfwzzc.www.gov.cn/check_web/errorInfo/jcInfoNew?siteCode=bm09000013&url=http%3A%2F%2Fwww.mps.gov.cn%2F',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
    }

    data = {
        'phone': '18166072280',
        'captcha': code,
    }

    response = session.post('https://zfwzzc.www.gov.cn/check_web/errorInfo_getPhoneCaptcha.action', headers=headers, data=data)
    cookie_dict = requests.utils.dict_from_cookiejar(session.cookies)
    print("======cookie_dict:", cookie_dict)
    print(response.json()['errmsg'])
    time.sleep(60)



