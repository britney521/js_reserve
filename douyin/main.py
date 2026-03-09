import json
import os

import requests
# import execjs
import threading
from Crypto.Cipher import AES, PKCS1_v1_5
from Crypto.Util.Padding import pad
from base64 import b64decode, b64encode
from Crypto.PublicKey import RSA
import base64

public_key_str = '''-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkJZWIUIje8VjJ3okESY8stCs/a95hTUqK3fD/AST0F8mf7rTLoHCaW+AjmrqVR9NM/tvQNni67b5tGC5z3PD6oROJJ24QfcAW9urz8WjtrS/pTAfGeP/2AMCZfCu9eECidy16U2oQzBl9Q0SPoz0paJ9AfgcrHa0Zm3RVPL7JvOUzscL4AnirYImPsdaHZ52hAwz5y9bYoiWzUkuG7LvnAxO6JHQ71B3VTzM3ZmstS7wBsQ4lIbD318b49x+baaXVmC3yPW/E4Ol+OBZIBMWhzl7FgwIpgbGmsJSsqrOq3D8IgjS12K5CgkOT7EB/sil7lscgc22E5DckRpMYRG8dwIDAQAB
-----END PUBLIC KEY-----'''

def rsa_encrypt(public_key, message):
    # 从字符串加载公钥
    rsakey = RSA.importKey(public_key)
    cipher = PKCS1_v1_5.new(rsakey)
    # 执行加密操作
    encrypted_message = cipher.encrypt(message.encode('utf-8'))
    # 对加密后的消息进行base64编码
    cipher_text = base64.b64encode(encrypted_message).decode('utf-8')
    return cipher_text

# AES加密
def mi(message, key, iv):
    key = key.encode()
    iv = b64decode(iv)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_message = pad(message.encode(), AES.block_size)
    encrypted_message = cipher.encrypt(padded_message)
    return b64encode(encrypted_message).decode()

def get_sign(body):
    key = "kedou@8989!63239"
    iv = "a2Vkb3VAODk4OSE2MzIzMw=="
    encrypted = mi(json.dumps(body), key, iv)
    sign = rsa_encrypt(public_key_str,encrypted)
    print(sign)
    return sign

def scraw(url):
    cookies = {
        '_ga': 'GA1.1.296948712.1728265958',
        'language': 'cn',
        '_ga_RDEPQPJKET': 'GS1.1.1728434039.2.0.1728434039.0.0.0',
        'i18n_redirected': 'cn',
    }

    headers = {
        'accept': 'application/json',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        # Requests sorts cookies= alphabetically
        # 'cookie': '_ga=GA1.1.296948712.1728265958; language=cn; _ga_RDEPQPJKET=GS1.1.1728434039.2.0.1728434039.0.0.0; i18n_redirected=cn',
        'kdsystem': 'GreenVideo',
        'origin': 'https://greenvideo.cc',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
    }
    body = {
        'url':url
    }
    data = get_sign(body)
    response = requests.post('https://greenvideo.cc/api/video/cnSimpleExtract', cookies=cookies, headers=headers, data=data)
    # print(response.json())

    if 'douyin.com' in url:
        data = response.json()['data']
        displayTitle = data['displayTitle']
        baseUrl = data['videoItemVoList'][0]['baseUrl']
        print(displayTitle,baseUrl)
        if not os.path.exists('./video'):
            os.mkdir('./video')
        f = open(f'video/抖音/{displayTitle}.mp4','wb')
        f.write(requests.get(baseUrl, headers=headers).content)

# url = input('请输入链接:')
urls = ['https://v.douyin.com/CeiyxLYS/',
'https://v.douyin.com/Ceiy7exw/',
'https://v.douyin.com/CeiyXaqq/',
'https://v.douyin.com/CeiyvNby/',
'https://v.douyin.com/Ceiyx5LK/',]

# 创建线程列表
threads = []

# 创建线程并启动
for url in urls:
    thread = threading.Thread(target=scraw, args=(url,))
    threads.append(thread)
    thread.start()

# 在主线程中执行其他操作
print("主线程继续执行")

# 等待所有线程完成
for thread in threads:
    thread.join()

print("所有线程执行完毕")


