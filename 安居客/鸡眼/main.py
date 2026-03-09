import io
import json
import random
import sys
import time

import execjs
from PIL import Image
from ultralytics import YOLO
import cv2
import numpy as np
import requests

from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
import binascii

from 安居客.鸡眼.predict import match_icons


def calc_cv_similarity(img1, img2):
    """计算两张灰度图的相似度（模板匹配）"""
    # 统一尺寸（以模板图为基准）
    h, w = img2.shape[:2]
    img1_resize = cv2.resize(img1, (w, h))

    # 模板匹配（归一化相关系数）
    res = cv2.matchTemplate(img1_resize, img2, cv2.TM_CCOEFF_NORMED)
    max_val = res[0][0]  # 相似度（-1~1，越接近1越相似）
    return round(max_val, 4)

def get_place():
    coords = match_icons()
    return coords

def download(bg_0,path,flag=False):
    bg = 'https://static.geetest.com/' + str(bg_0)

    bgContent = requests.get(bg, headers=headers).content
    with open(f'{path}', 'wb') as f:
        f.write(bgContent)

    if flag:
        # 4. 读取图片（无需保存到本地再读取）
        img = Image.open(io.BytesIO(bgContent))

        # 5. 缩放图片至 250×160（保持宽高比可选，此处强制缩放）
        # resize参数：(宽度, 高度)，Image.Resampling.LANCZOS 是高质量缩放算法
        target_size = (250, 160)
        resized_img = img.resize(target_size, Image.Resampling.LANCZOS)

        # 6. 保存缩放后的图片（覆盖原文件）
        resized_img.save(f'{path}')

def calculate_gap_position(bg_path, slice_path):
    """
    用 OpenCV 模板匹配计算滑块缺口距离
    返回缺口 x 坐标（像素）
    """
    print("开始计算缺口位置 | bg={} | slice={}", bg_path, slice_path)
    bg = cv2.cvtColor(np.array(Image.open(bg_path).convert('RGB')), cv2.COLOR_RGB2GRAY)
    tp = cv2.cvtColor(np.array(Image.open(slice_path).convert('RGB')), cv2.COLOR_RGB2GRAY)
    tp = 255 - tp  # 反色，让滑块区域更突出
    res = cv2.matchTemplate(bg, tp, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, max_loc = cv2.minMaxLoc(res)
    print("模板匹配最大值=%.3f，缺口坐标={}", max_val, max_loc)
    return max_loc[0] if max_val > 0.3 else None


def calculate_circle_percent(click_x, click_y, img_width=300, img_height=200, circle_size=30):
    """
    根据点击坐标计算30×30圆圈的左上角百分比（相对300×200图片）
    :param click_x: 点击的x像素坐标（水平）
    :param click_y: 点击的y像素坐标（垂直）
    :param img_width: 图片宽度（默认300）
    :param img_height: 图片高度（默认200）
    :param circle_size: 圆圈尺寸（宽高，默认30）
    :return: (circle_left, circle_top, left_percent, top_percent)
             圆圈左上角像素坐标、左上角百分比（保留2位小数）
    """
    # 计算圆圈半径（保证点击点在圆圈中心）
    circle_radius = circle_size // 2

    # 1. 计算圆圈左上角原始坐标（点击点 - 半径）
    circle_left = click_x - circle_radius
    circle_top = click_y - circle_radius

    # 2. 边界处理：防止圆圈超出图片范围
    # 左边界：最小为0
    circle_left = max(0, circle_left)
    # 上边界：最小为0
    circle_top = max(0, circle_top)
    # 右边界：圆圈右边缘 ≤ 图片宽度
    circle_left = min(circle_left, img_width - circle_size)
    # 下边界：圆圈下边缘 ≤ 图片高度
    circle_top = min(circle_top, img_height - circle_size)

    # 3. 计算百分比（相对图片尺寸）
    left_percent = (circle_left / img_width) * 10000
    top_percent = (circle_top / img_height) * 10000

    return int(left_percent), int(top_percent)


def RSA_encrypt(data):
    modulus = 0x00C1E3934D1614465B33053E7F48EE4EC87B14B95EF88947713D25EECBFF7E74C7977D02DC1D9451F79DD5D1C10C29ACB6A9B4D6FB7D0A0279B6719E1772565F09AF627715919221AEF91899CAE08C0D686D748B20A3603BE2318CA6BC2B59706592A9219D0BF05C9F65023A21D2330807252AE0066D59CEEFA5F2748EA80BAB81
    exponent = 0x010001
    key = RSA.construct((modulus, exponent))
    cipher = PKCS1_v1_5.new(key)
    encrypted = cipher.encrypt(data.encode())
    return binascii.hexlify(encrypted).decode()

session = requests.Session()

headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    # 'Cookie': 'captcha_v4_user=57c1fbc2dd1847038018d866a1920519',
    'Pragma': 'no-cache',
    'Referer': 'https://hip.ke.com/',
    'Sec-Fetch-Dest': 'script',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'cross-site',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}
captcha_id = '89a09da8588eb49f112da8cd1d8a5a88'
params = {
    'captcha_id': captcha_id,
    'challenge': '16058bfb-3010-43cd-90b9-9a04687871b6',
    'client_type': 'web',
    'lang': 'zho',
    'callback': 'geetest_1766976217890',
}



response = session.get('https://gcaptcha4.geetest.com/load', params=params, headers=headers)
json_data = response.text
print(json_data)
json_str = json_data.split('(', 1)[1].rstrip(')')
# 解析 JSON 字符串为 Python 字典
data = json.loads(json_str)
print(data)
lot_number = data['data']['lot_number']
payload = data['data']['payload']
process_token = data['data']['process_token']
payload_protocol = data['data']['payload_protocol']
pt = data['data']['pt']
version = data['data']["pow_detail"]['version']
bits = data['data']['pow_detail']['bits']
datetime = data['data']['pow_detail']['datetime']
hashfunc = data['data']['pow_detail']['hashfunc']
print(lot_number)
print(payload)
print(process_token)
print(payload_protocol)
print(pt)
print(version)
print(bits)
print(datetime)
print(hashfunc)
bg_0 = data['data'].get('bg')
slice = data['data'].get('slice')


if not bg_0:
    print("===== 点选")

    bg_0 = data['data']['imgs']
    download(bg_0,f'image/bg.png')

    # 点击小图
    ques = data['data'].get('ques')
    for index,ques in enumerate(ques):
        download(ques,f'template_icons/ques{index+1}.png')
    # break
    filtered_boxes = get_place()
    userresponse = []
    for index,box in enumerate(filtered_boxes):
        x,y = calculate_circle_percent(box[0],box[1])
        userresponse.append([x,y])
    passtime = 4470

    with open('js/极验4.js', 'r', encoding='utf-8') as f:
        js = f.read()
    ctx = execjs.compile(js)
    num = ctx.call('get_h')
    print(num)

    pow_msg = f"{version}|{bits}|{hashfunc}|{datetime}|{captcha_id}|{lot_number}||{num}"
    print(pow_msg)
    pow_sign = ctx.call('hash', pow_msg, hashfunc)
    print(pow_sign)
    infoo = { "passtime": passtime, "userresponse": userresponse, "device_id": "",
             "lot_number": lot_number, "pow_msg": pow_msg, "pow_sign": pow_sign, "geetest": "captcha", "lang": "zh",
             "ep": "123", "biht": "1426265548", "VkOI": "YGWp", "4784ca": "9e36",
             "em": {"ph": 0, "cp": 0, "ek": "11", "wd": 1, "nt": 0, "si": 0, "sc": 0}}
    info = json.dumps(infoo)
    print(info)
    uxx = ctx.call('aesCbcEncrypt', info, num)
    print(uxx)
    rxx = RSA_encrypt(num)
    print(rxx)

    wxx = uxx + rxx
    print(wxx)

    url_2 = "https://gcaptcha4.geetest.com/verify"
    params = {
        "callback": 'geetest_' + str(random.randint(0, 9999) + int(time.time() * 1000)),
        "captcha_id": captcha_id,
        "client_type": "web",
        "lot_number": lot_number,
        "risk_type": "slide",
        "payload": payload,
        "process_token": process_token,
        "payload_protocol": payload_protocol,
        "pt": pt,
        "w": wxx
    }

    response = session.get(url_2, headers=headers, params=params)

    print(response.text)
    print(response)
else:
    print("===== 滑块")
    sys.exit(0)
    download(bg_0, 'bg.png')
    download(slice, 'slice.png')
    distance = calculate_gap_position('image/bg.png','image/slice.png')
    userresponse = (int(distance) / 1.0059466666666665) + 2
    passtime = (int(distance) / 189) * 1494

    with open('js/极验4.js', 'r', encoding='utf-8') as f:
        js = f.read()
    ctx = execjs.compile(js)
    num = ctx.call('get_h')
    print(num)

    pow_msg = f"{version}|{bits}|{hashfunc}|{datetime}|{captcha_id}|{lot_number}||{num}"
    print(pow_msg)
    pow_sign = ctx.call('hash', pow_msg, hashfunc)
    print(pow_sign)
    infoo = {"setLeft": distance, "passtime": passtime, "userresponse": userresponse, "device_id": "",
             "lot_number": lot_number, "pow_msg": pow_msg, "pow_sign": pow_sign, "geetest": "captcha", "lang": "zh",
             "ep": "123", "biht": "1426265548", "VkOI": "YGWp", "4784ca": "9e36",
             "em": {"ph": 0, "cp": 0, "ek": "11", "wd": 1, "nt": 0, "si": 0, "sc": 0}}
    info = json.dumps(infoo)
    print(info)
    uxx = ctx.call('aesCbcEncrypt', info, num)
    print(uxx)

    rxx = RSA_encrypt(num)
    print(rxx)

    wxx = uxx + rxx
    print(wxx)

    url_2 = "https://gcaptcha4.geetest.com/verify"
    params = {
        "callback": 'geetest_' + str(random.randint(0, 9999) + int(time.time() * 1000)),
        "captcha_id": captcha_id,
        "client_type": "web",
        "lot_number": lot_number,
        "risk_type": "slide",
        "payload": payload,
        "process_token": process_token,
        "payload_protocol": payload_protocol,
        "pt": pt,
        "w": wxx
    }

    response = session.get(url_2, headers=headers, params=params)

    print(response.text)
    print(response)


# for index,que in enumerate(ques):
#     que_url = 'https://static.geetest.com/' + str(que)
#     queContent = requests.get(que, headers=headers).content
#     with open(f'que{index+1}.png', 'wb') as f:
#         f.write(bgContent)