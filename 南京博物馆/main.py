import re
import time

from PIL import Image
from shibe import recognize
from send_code import send
import execjs
import requests



headers = {
    'Referer': 'https://ticket.wisdommuseum.cn/reservation/userOut/outSingle/toRegisterSingle.do',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
}
url = 'https://ticket.wisdommuseum.cn/reservation/userOut/outSingle/toRegisterSingle.do'

while True:
    session = requests.Session()

    # 使用session发送GET请求
    res = session.get(url,headers=headers)
    print(res)
    if res.status_code != 200:
        break
    arg1 = re.findall('var arg1=(.*?);',res.text)
    if arg1:
        arg1 = arg1[0].strip("''")
        print(arg1)
        node = execjs.get()
        ctx = node.compile(open('js/cookie.js', 'r', encoding='utf-8', errors='ignore').read())
        acw_sc__v2 = ctx.call('get_acw_sc__v2', arg1)
        session.cookies.update({'acw_sc__v2':acw_sc__v2})
        params = {
            'd': '1723338942717',
        }

        response = session.get('https://ticket.wisdommuseum.cn/reservation/userOut/out/getVerifyCode.do', params=params, headers=headers)
        print(response.content)

        f = open('data/input/VerifyCode.png','wb')
        f.write(response.content)
        f.close()
        cookie_dict = requests.utils.dict_from_cookiejar(session.cookies)
        print("======cookie_dict:", cookie_dict)
        # time.sleep(3)

        # code = input('输入识别验证码:')
        code = recognize()
        # code = shibe('VerifyCode')
        # print(code)


        send('17315231596',code,cookie_dict)

        time.sleep(60)