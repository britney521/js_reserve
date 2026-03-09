
import requests



def send(phone,code,cookie_dict):

    headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        # Requests sorts cookies= alphabetically
        # 'Cookie': 'JSESSIONID=3DD0EBFFEA0FF1B8B4A44D6331C3B619; UM_distinctid=1913efd6e79581-072543363062c6-4c657b58-168000-1913efd6e7a148e; acw_tc=76b20fe317233421431955167e0f83adac3d6d638900114a850ec8da2937a0; acw_sc__v2=66b81d4c855de3902009abc416966435400e3946; CNZZDATA1281245212=1494052345-1723338682-https%253A%252F%252Fticket.wisdommuseum.cn%252F%7C1723342171',
        'Origin': 'https://ticket.wisdommuseum.cn',
        'Pragma': 'no-cache',
        'Referer': 'https://ticket.wisdommuseum.cn/reservation/userOut/outSingle/toRegisterSingle.do',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
    }

    data = {
        'tel': phone,
        'numberCode': code,
    }
    session = requests.Session()
    for key, value in cookie_dict.items():
        session.cookies.set(key, value)
    response = session.post('https://ticket.wisdommuseum.cn/reservation/userOut/out/checkSendCode.do',headers=headers, data=data)
    print(response.text)
    if response.text == '0':
        print('短信验证码已发送')

