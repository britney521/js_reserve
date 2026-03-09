import base64
import json
import random
import time

import execjs
import requests
from save_to_db import logger

cookies = {
    '_xmLog': 'h5&5636fee6-36c8-42d0-85d0-bad665de84dd&process.env.sdkVersion',
    'Qs_lvt_476196': '1756633866',
    'Qs_pv_476196': '1089799915938283900',
    'wfp': 'ACM4MjdlYTExMWI4N2ZiMDc5XQIGu3GKBpZ4bXdlYl93d3c',
    'HWWAFSESID': 'abd6f1425c0cc04dec5',
    'HWWAFSESTIME': '1757561303998',
    'DATE': '1756633864988',
    'crystal': 'U2FsdGVkX19vuJiJbV2/gsCCRa5c9mvSS989uUeG9fsXGtU8M+/FipflCNQnGnsokZytynC6U7TZ+URtpSoNxRuFUibrAK+2/a04F0zMKsfoPnziPMtsYsFudIm9Oid3sL4mxY11arI1PBxmmICrSc+sQ/tkiVuwIi7RGi7D+ddpInUxbo6Py419Wfvl3QQi7LD/HWGoTC4a6DRjwI+XxRv0tkjsvO8eLf4DiAth4O7nQVgnQcNFOAp4JoZcJhc9',
    'xm-page-viewid': 'ximalaya-web',
    'impl': 'www.ximalaya.com.login',
    'Hm_lvt_4a7d8ec50cfd6af753c4f8aee3425070': '1756634342,1757561307',
    'HMACCOUNT': 'BE226A4D7F526496',
    '1&remember_me': 'y',
    '1&_token': '504055208&8A9BE9C0140N79CFE682AA5F59905DBAE5BFCBB966632983A897B9866A835F7A723AFF4485CE158M88AED0480C6DC46_',
    '1_l_flag': '504055208&8A9BE9C0140N79CFE682AA5F59905DBAE5BFCBB966632983A897B9866A835F7A723AFF4485CE158M88AED0480C6DC46__2025-09-1612:39:58',
    'web_login': '1758092042314',
    'Hm_lpvt_4a7d8ec50cfd6af753c4f8aee3425070': '1758092042',
    'cmci9xde': 'U2FsdGVkX19V8QAbj/wFqWHk0xLnFwY6b2KIqex9rY/sOdHm+5eWAGF9L4iYvpMqNyIvSFT4jeDzkNuhZpaILw==',
    'pmck9xge': 'U2FsdGVkX19W04hHp0fneSbqXMy6u+oQWrUQjaZb6EM=',
    'assva6': 'U2FsdGVkX1+qnI25xlgdhmKHgp0+61AzTNSTHXfiMR0=',
    'assva5': 'U2FsdGVkX1/OmxxPvz74p2yAs1PVwWC4tLW+w9L//e9s4aSf0oiBl3jsPdY0S3lwaz3m8bLj8d90Tl8oQQ97ng==',
    'vmce9xdq': 'U2FsdGVkX1+nBgsHnPu0jEAynqgqUzlLYjcSv8uesUS39v4SKTR3l0k56UACXCK6YUoGLVww7vZdz7XfQXUUeFrxtNhnPdmGvZW4mP6HxseyF5kiqKyBsKQYDTfztci73hJuW1s7sfw+mvkuNvDybxxzCTzKgSsnzMkQ7NyMMSM=',
}
import json
import base64
import urllib.parse
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import zlib

# ---------- 工具 ----------
def _unescape_percent(s: str) -> str:
    """把 JS 里手动解 %uXXXX / %XX 的代码还原回来"""
    out = []
    i = 0
    ln = len(s)
    while i < ln:
        ch = s[i]
        if ch == '%':
            if i + 5 < ln and s[i + 1] == 'u':
                hex4 = s[i + 2:i + 6]
                if all(c in '0123456789abcdefABCDEF' for c in hex4):
                    out.append(chr(int(hex4, 16)))
                    i += 6
                    continue
            if i + 2 < ln:
                hex2 = s[i + 1:i + 3]
                if all(c in '0123456789abcdefABCDEF' for c in hex2):
                    out.append(chr(int(hex2, 16)))
                    i += 3
                    continue
        out.append(ch)
        i += 1
    return ''.join(out)


def _string_to_uint8_array(text: str) -> bytes:
    """等价于 JS 侧 _stringToUint8Array"""
    escaped = urllib.parse.quote(text, safe='~()*!.\'')
    unescaped = _unescape_percent(escaped)
    return unescaped.encode('utf-8')


def _compress(data: bytes) -> bytes:
    """pako.deflate level=6"""
    return zlib.compress(data, level=6)


def _aes_encrypt(word_array: bytes, password: str) -> str:
    """AES-ECB-PKCS7，返回 base64"""
    key = password.encode('utf-8')
    cipher = AES.new(key, AES.MODE_ECB)
    encrypted = cipher.encrypt(pad(word_array, AES.block_size))
    return base64.b64encode(encrypted).decode()

# ---------- 主入口 ----------
def get_process_data(obj: dict, password: str) -> str:
    """完全等价于 JS 的 getProcessData"""
    # 1. JSON -> bytes
    json_bytes = _string_to_uint8_array(json.dumps(obj, separators=(',', ':')))
    # 2. 压缩
    compressed = _compress(json_bytes)
    # 3. AES
    return _aes_encrypt(compressed, password)

def get_buffer(timestr,uid):
    key = "m9ZtRrz:qujT8@da";
    data = {
    "Zf5": timestr,
    "GF9": "2.0.0",
    "HW5": "t6pfoml9679z52kqw93uqu75eflqdg1bykhl",
    "ew1": {
        "Wg7": "Mozilla",
        "lV1": "Google Inc.",
        "Xt4": "Netscape",
        "yV2": "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "KY1": "MacIntel",
        "Le3": "Tmxhcm9vei81LjAgKE56eHJtZ2xoczsgUm1ndm8gTnp4IExIIEMgMTBfMTVfNykgWmtrb3ZEdnlQcmcvNTM3LjM2IChQU0dOTywgb3JwdiBUdnhwbCkgWHNpbG52LzEyOC4wLjAuMCBIenV6aXIvNTM3LjM2",
        "kH1": 978,
        "ad5": 1920,
        "Ua9": 24,
        "TQ6": 1080,
        "kC7": 1920,
        "me8": 24,
        "eY9": True,
        "Kn2": False,
        "OM3": True,
        "sw8": False,
        "uW3": -1,
        "iO8": "https://www.ximalaya.com/album/"+uid,
        "By1": "www.ximalaya.com",
        "Gv4": "/album/"+uid,
        "ef2": "",
        "tZ2": "https:",
        "OG4": True,
        "kx1": True,
        "VD6": True,
        "Ov6": False,
        "lq3": "zh-CN",
        "ef5": [
            "zh-CN",
            "zh"
        ],
        "OK3": 2,
        "Fg5": True,
        "qS2": [
            1920,
            975,
            1869,
            898
        ],
        "Fc5": "light"
    },
    "HK3": {
        "iI1": {
            "NF1": -1,
            "cA1": -1,
            "NK5": -1,
            "VP4": "-1.00",
            "RX5": -1,
            "VP6": -1,
            "tJ4": -1
        },
        "ti4": {
            "xm9": True,
            "is3": 1
        },
        "AV9": 12,
        "aK8": "Google Inc. (Apple)",
        "df6": "ANGLE (Apple, ANGLE Metal Renderer: Apple M4 Pro, Unspecified Version)",
        "WB9": "UxZFXBRABkdAARcSUhRDVkBGB0NHUxBCABMQAUwSXRM",
        "pD7": "AEFCAE0QAExLAkVDBkdDUBBKXEVDXUxLARYVXEFBUxA",
        "da2": "VUdHSkVHV0FFUkVEVURHU0RB",
        "dt2": 8,
        "Sy6": -480,
        "MS3": "Asia/Shanghai",
        "pi9": False,
        "Ao1": [],
        "BH5": 0,
        "UG4": [
            "Andale Mono",
            "Arial",
            "Arial Black",
            "Arial Hebrew",
            "Arial Narrow",
            "Arial Rounded MT Bold",
            "Arial Unicode MS",
            "Comic Sans MS",
            "Courier",
            "Courier New",
            "Geneva",
            "Georgia",
            "Helvetica",
            "Helvetica Neue",
            "Impact",
            "LUCIDA GRANDE",
            "Microsoft Sans Serif",
            "Monaco",
            "Palatino",
            "Tahoma",
            "Times",
            "Times New Roman",
            "Trebuchet MS",
            "Verdana",
            "Wingdings",
            "Wingdings 2",
            "Wingdings 3"
        ]
    },
    "fc9": {
        "cx4": "4g",
        "zY8": -1,
        "yj6": 10,
        "dV4": 250,
        "yX4": False
    },
    "pX4": "7A9231:C4BA41:324E2A:f700",
    "Ud2": "D2U9qkIfZDRb6kI0MdFy/2ME2YDNkmugkYSmw2YoM5OggXa5",
    "Cb7": '',
    "Gp5": '',
    "Zn6": {
        "oe2": "0",
        "EV9": "true",
        "xu2": "1441A790E638FC63C1A16A093AA064090F07505CB569A950EF3E5E646CD1A0B3",
        "CY8": "",
        "nE4": 386956,
        "Tw1": [
            532.6999999880791,
            387453.6999999881
        ],
        "Sb1": False
    },
    "lL1": "7d423e13b26c612ad38d64d6a55ea1af",
    "uT8": "-1",
    "sV5": 1,
    "Vo6": "",
    "hi9": 0,
    "fd2": {
        "Pf5": 1756633864988,
        "Ja5": "7A9231:C4BA41:324E2A:f700",
        "xz7": "1b1314e3-82f1-42ac-2ae2-bfff96a40747",
        "av1": "D2U9qkIfZDRb6kI0MdFy/2ME2YDNkmugkYSmw2YoM5OggXa5",
        "cp9": 302
    },
    "ck9": "h5_goyxvzyohd",
    "uS7": "",
    "jm9": 2,
    "GJ2": "f9ef3959-f9a7-44de-bd33-8a495c58149d-fcs011",
    "MT7": "33-00000-0000-1111111-000000-0011-000000-0000-00000-0",
    "BG5": False,
    "Fd8": "2",
    "Dr2": "NjUydTQ2MnU0NDg2dXU2MHl6Nzg0dTA5N3U5enczNHc",
    "lp7": "OTl6NDE3ODM5MDUydjd6MzY1eDd5eTQ5eDkzdzAweDM",
    "iq7": False,
    "MB8": "IOB0m2cgyY",
    "ZH2": "PPMqb0ILky",
    "DP5": "1441A7909C087DBBE7CE59881B9DF8B9"
};
    buf = get_process_data(data, key)
    return buf



# ---------- 工具函数 ----------
def safe_get_json(resp: requests.Response, default=None):
    """防 json 解析炸掉"""
    try:
        return resp.json()
    except Exception as e:
        logger.warning(f'JSON 解析失败: {e}  url={resp.url}')
        return default or {}

def generate() -> str:
    t = int(time.time() * 1000) + time.perf_counter() * 1000
    def repl(match):
        nonlocal t
        t = int(t + 16 * random.random()) % 16
        val = t
        t = t // 16
        ch = match.group(0)
        if ch == 'y':
            val = (val & 0x3) | 0x8   # UUID variant 10x
        return format(val, 'x')
    import re
    return re.sub(r'[xy]', repl, 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')

def aes_decrypt(cipher_b64: str, password: str) -> str | None:
    """
    等价于 JS 的 aesDecrypt
    失败返回 None
    """
    try:
        key = password.encode('utf-8')
        data = base64.b64decode(cipher_b64)

        cipher = AES.new(key, AES.MODE_ECB)   # ECB 不需要 iv
        padded = cipher.decrypt(data)
        plain = unpad(padded, AES.block_size)
        return plain.decode('utf-8')
    except Exception as e:
        print('AES 解密失败:', e)
        return None

def get_key(uid):
    try:
        uuid = generate()
        params = {'v': '1.2.0', 'e': '1', 'c': '1', 'r': uuid}
        timestr = int(time.time()*1000)
        data = get_buffer(timestr,uid)

        resp = requests.post('https://hdaa.shuzilm.cn/report',
                             params=params, headers=headers,
                             data=base64.b64decode(data), timeout=10)
        print(resp.text)
        return json.loads(aes_decrypt( resp.text, "m9ZtRrz:qujT8@da"))
    except Exception as e:
        logger.error(f'get_key 失败: {e}')
        return {}



def update_headers(uid):
    """失败不影响主流程"""
    try:
        json_data = get_key(uid)
        print(json_data)
        xm_sign = 'D2U9qkIfZDRb6kI0MdFy/2ME2YDNkmugkYSmw2YoM5OggXa5&&' + json_data.get('sid', '')
        headers['xm-sign'] = xm_sign
    except Exception as e:
        logger.warning(f'更新 xm-sign 失败: {e}')
headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    # 'Cookie': '_xmLog=h5&5636fee6-36c8-42d0-85d0-bad665de84dd&process.env.sdkVersion; Qs_lvt_476196=1756633866; Qs_pv_476196=1089799915938283900; wfp=ACM4MjdlYTExMWI4N2ZiMDc5XQIGu3GKBpZ4bXdlYl93d3c; HWWAFSESID=abd6f1425c0cc04dec5; HWWAFSESTIME=1757561303998; DATE=1756633864988; crystal=U2FsdGVkX19vuJiJbV2/gsCCRa5c9mvSS989uUeG9fsXGtU8M+/FipflCNQnGnsokZytynC6U7TZ+URtpSoNxRuFUibrAK+2/a04F0zMKsfoPnziPMtsYsFudIm9Oid3sL4mxY11arI1PBxmmICrSc+sQ/tkiVuwIi7RGi7D+ddpInUxbo6Py419Wfvl3QQi7LD/HWGoTC4a6DRjwI+XxRv0tkjsvO8eLf4DiAth4O7nQVgnQcNFOAp4JoZcJhc9; xm-page-viewid=ximalaya-web; impl=www.ximalaya.com.login; Hm_lvt_4a7d8ec50cfd6af753c4f8aee3425070=1756634342,1757561307; HMACCOUNT=BE226A4D7F526496; 1&remember_me=y; 1&_token=504055208&9277FEC0240N0D3F6E8FDDAEE7C363CF2A50A6F6BC3D67DFC36A7844825F58417F1FF4DD197C36M799FFDAFDF4F819_; 1_l_flag=504055208&9277FEC0240N0D3F6E8FDDAEE7C363CF2A50A6F6BC3D67DFC36A7844825F58417F1FF4DD197C36M799FFDAFDF4F819__2025-09-1120:11:39; Hm_lpvt_4a7d8ec50cfd6af753c4f8aee3425070=1757988434; web_login=1757993613699; cmci9xde=U2FsdGVkX19fhl/XmgIQjU36nhj5avanIJ7dH1uXXi5hlW1Gs+0SWSdU1P7gmcy2WRYbWPab116RixrPAV1vKA==; pmck9xge=U2FsdGVkX1+oveoIw934rSxBrrxr19/xdVzI+7jNzYE=; assva6=U2FsdGVkX1+XB7UUK1Ix+NIW/02yLQlwN8rBtWZQAUo=; assva5=U2FsdGVkX1+dm8gwYXYHK1+p3IrP1gCK2vYcw0g7aCIaDcB4agIJBPnsIG3zGSs9VQ75qBh35bfj9Y9C3ZQrFg==; vmce9xdq=U2FsdGVkX19XsBl+tn2MRdveSDQOJLo73Xu1Y+aErD0iFcxJbzTHTVR2/IWsbnMb3D79BQeyFmz3t7HVRsMTN7d8HLn5mhGj0csnLzLveQV/GjoiQWgjfVdUW6a8UHUhoy1SllnMtTLwbHFmdqvV0Zt7Rzcxl5KhuSMv+acmRdM=',
    'Pragma': 'no-cache',
    'Referer': 'https://www.ximalaya.com/album/100959388',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'xm-sign': 'D2U9qkIfZDRb6kI0MdFy/2ME2YDNkmugkYSmw2YoM5OggXa5&&abnfCaA36l-tSIql7p__1QE1OYrsFsActW83A-lXfdo_1',
}
for i in range(1,27):
    params = {
        'albumId': '100959388',
        'pageNum': str(i),
        'sort': '1',
        'pageSize': '30',
    }
    update_headers('100959388')
    response = requests.get(
        'https://www.ximalaya.com/revision/album/v1/getTracksList',
        params=params,
        cookies=cookies,
        headers=headers,
    )


    resp = response
    tracks = safe_get_json(resp, {}).get('data', {}).get('tracks', [])
    print(tracks)
    if len(tracks) == 0:
        logger.info('触发封控======')