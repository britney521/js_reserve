import requests
import base64
import execjs
import time

cookies = {'JSESSIONID': '1yYKUc0_qITAiFJUUS2OHHh-6zJSNr7BWVWGOm4sZo1452IIcPzT!-292051281', 'PYCCS': '1726750013|hnNhcKaeTV0SdpWHAzPbpf5C6VeiOGWG0AFCq/9vpck=', 'route': 'e383da5a665a29e8aebc7eee693cc945', 'xincaigou': '49737.2927.1035.0000'}

headers = {
    'Referer': 'http://www.yngp.com/page/procurement/procurementList.html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
}
ts = int(time.time()*1000)

uuid = execjs.compile(open('js/captcha.js','r',encoding='utf-8').read()).call('uuid')
json_data = {
    'captchaType': 'clickWord',
    'clientUid': uuid,
    'ts': ts,
}

response = requests.post('http://www.yngp.com/api/captcha/captcha.get.svc', cookies=cookies, headers=headers, json=json_data, verify=False)
token = response.json()['data']['repData']['token']
secretKey = response.json()['data']['repData']['secretKey']
wordList = response.json()['data']['repData']['wordList']
originalImageBase64 = response.json()['data']['repData']['originalImageBase64']
print(token,secretKey,wordList)


with open('img/captcha.png','wb') as f:
    f.write(base64.b64decode(originalImageBase64))
checkPosArr = []
for i in range(3):
    PosArr = input('Check坐标,x,y以都好分开')
    checkPosArr.append({"x": int(PosArr.split(',')[0]), "y": int(PosArr.split(',')[1])})
# checkPosArr = [
#      {
#          "x": 117,
#          "y": 31
#      },
#      {
#          "x": 183,
#          "y": 90
#      },
#      {
#          "x": 252,
#          "y": 92
#      }
#  ]
print(checkPosArr)
pointJson = execjs.compile(open('js/captcha.js','r',encoding='utf-8').read()).call('get_pointJson',checkPosArr,secretKey)
json_data = {
    'captchaType': 'clickWord',
    'pointJson': pointJson,
    'token': token,
    'clientUid': uuid,
    'ts': ts,
}

response = requests.post('http://www.yngp.com/api/captcha/captcha.check.svc', cookies=cookies, headers=headers, json=json_data, verify=False)

Verification = execjs.compile(open('js/captcha.js','r',encoding='utf-8').read()).call('get_captcha',token,checkPosArr,secretKey)
print('Verification',Verification)

for i in range(1,10):
    time.sleep(1)
    data = {
        'current': str(i),
        'rowCount': '10',
        'searchPhrase': '',
    }

    response = requests.post(f'http://www.yngp.com/apilist/procurement/Procurement.gghtMoreList.svc?captchaCheckFlag={Verification}&p={i}', cookies=cookies,headers=headers, data=data, verify=False)
    print(f'第{i}页----------------------------------------------')
    print(response.text)