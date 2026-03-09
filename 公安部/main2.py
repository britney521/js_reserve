import base64
import time

from get_code import recognize
import requests


# headers = {
#     'Referer': 'https://ywtb.mps.gov.cn/newhome/register/grzc',
#     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
#
# }
#
# json_data = {
#     'type': 'CHAR_DEVICE',
#     'phone': '18166072280',
# }
#
# response = requests.post('https://ywtb.mps.gov.cn/newhome/api/captcha/get/verification/image', headers=headers, json=json_data)
# print(response.json())
# charImage = response.json()['data']['charImage']
# img = 'data:image/jpeg;base64,' + charImage
#
# with open("img/VerifyCode2.png", 'wb') as f:
#     f.write(base64.b64decode(img))
#
# code = recognize("img/VerifyCode2.png")
# print('code: ' + code)


while True:
    import requests

    headers = {
        'Referer': 'https://ywtb.mps.gov.cn/newhome/register/grzc',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
        'validToken': '94f0668d-3600-478e-b735-f9024475f014',
    }

    response = requests.get('https://ywtb.mps.gov.cn/newhome/api/user/receiveYzm/18166072280', headers=headers)
    print(response.json())
    time.sleep(60)
