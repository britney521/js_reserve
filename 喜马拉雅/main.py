import itertools
import random
import string
import sys
import time
from save_to_db import logger
import requests
from save_to_db import DbSaver


saver = DbSaver()          # 全局实例
saver.init_database()
logger.info('初始化数据库')
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
    "HW5": "t6pfoml9679z52kqw93uqu75eflqdg1bykhl", # 指纹
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
}
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
        data = get_buffer(timestr,str(uid))

        resp = requests.post('https://hdaa.shuzilm.cn/report',
                             params=params, headers=headers,
                             data=base64.b64decode(data), timeout=10)
        return json.loads(aes_decrypt( resp.text, "m9ZtRrz:qujT8@da"))
    except Exception as e:
        logger.error(f'get_key 失败: {e}')
        return {}



def update_headers(uid):
    """失败不影响主流程"""
    try:
        json_data = get_key(uid)

        xm_sign = 'D2U9qkIfZDRb6kI0MdFy/2ME2YDNkmugkYSmw2YoM5OggXa5&&' + json_data.get('sid', '')
        headers['xm-sign'] = xm_sign
    except Exception as e:
        logger.warning(f'更新 xm-sign 失败: {e}')

# ---------- 业务接口 ----------
def get_album(album_id: int):
    try:
        resp = requests.get('https://www.ximalaya.com/revision/album/v1/simple',
                            params={'albumId': album_id},
                             headers=headers, timeout=10)
        data = safe_get_json(resp, {}).get('data', {}).get('albumPageMainInfo', {})
        return {
            'updateDate': data.get('updateDate'),
            'createDate': data.get('createDate'),
            'anchorUid': data.get('anchorUid'),
            'playCount': data.get('playCount', 0),
        }
    except Exception as e:
        logger.error(f'get_album 失败 album_id={album_id}: {e}')
        return {}

def get_anchor(anchor_uid: int):
    try:
        resp = requests.get('https://www.ximalaya.com/revision/user/basic',
                            params={'uid': anchor_uid, 'needRealCount': 'true'},
                             headers=headers, timeout=10)
        data = safe_get_json(resp, {}).get('data', {})
        return {
            'nickName': data.get('nickName', ''),
            'fansCount': data.get('fansCount', 0),
        }
    except Exception as e:
        logger.error(f'get_anchor 失败 anchor_uid={anchor_uid}: {e}')
        return {'nickName': '', 'fansCount': 0}

def get_ablum_comment(ablum_uid: int):
    try:
        params = {
            'albumId': ablum_uid,
            'order': 'content-score-desc',
            'pageId': '1',
            'pageSize': '10',
        }

        resp= requests.get(
            'https://mobile.ximalaya.com/album-comment-mobile/web/album/comment/list/query/{}'.format(int(time.time()*1000)),
            params=params,
            headers=headers,
        )
        data = safe_get_json(resp, {}).get('data', {})
        return {
            'comments_count': data.get('allCommentsCount'),
            'score': data.get('recScoreSummary',{}).get('score',0),
        }
    except Exception as e:
        logger.error(f'get_album comment 失败 album_id={album_id}: {e}')
        return {}

def getTracksList(album_id: int):
    try:
        resp = requests.get('https://www.ximalaya.com/revision/album/v1/getTracksList',
                            params={'albumId': album_id, 'pageNum': 1, 'pageSize': 30},
                             headers=headers, timeout=10)

        return safe_get_json(resp, {}).get('data', {}).get('tracks', [])
    except Exception as e:
        logger.error(f'getTracksList 失败 album_id={album_id}: {e}')
        return []

def getdescTracksList(album_id: int):
    try:
        resp = requests.get('https://www.ximalaya.com/revision/album/v1/getTracksList',
                            params={'albumId': album_id, 'pageNum': 1, 'sort':1,'pageSize': 30},
                             headers=headers, timeout=10)
        return safe_get_json(resp, {}).get('data', {}).get('tracks', [])
    except Exception as e:
        logger.error(f'getTracksList 失败 album_id={album_id}: {e}')
        return []



try:
    with open('cookies.txt', 'r', encoding='utf-8') as f:
        cookies = [cookie.strip('\n') for cookie in f.readlines()]
        cookies_cycle = itertools.cycle(cookies)
except Exception as e:
    logger.error(f'找不到cookies 文件,请确认cookies文件是否存在')
    sys.exit()
def get_tracks_with_retry(album_id, max_retry=len(cookies)):
    """换 Cookie 重试，直到拿到章节或耗尽 Cookie"""
    for _ in range(max_retry):
        ck = next(cookies_cycle)
        headers['cookie'] = ck                     # 先换
        update_headers(album_id)
        tracks = getTracksList(album_id)
        desctracks = getdescTracksList(album_id)
        if tracks:                       # 成功
            return tracks, desctracks
        logger.warning(f'Cookie {ck[:20]}... 无章节，换下一个')
    return [], []


headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
     'Cookie': cookies[0],
    'Pragma': 'no-cache',
    'Referer': 'https://www.ximalaya.com/top/1/100150/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}




# 全局：待补章节的集合
pending_album_ids = set()          # 只存 album_id
pending_meta = {}
PENALTY_SLEEP = 5 * 60
lists = [
  {
    "tabId": 2,
    "id": 2,
    "name": "热门",
    "position": 1,
    "rankingId": 100077
  },
  {
    "tabId": 2,
    "id": 283,
    "name": "新品",
    "position": 2,
    "rankingId": 100157
  },
  {
    "tabId": 2,
    "id": 325,
    "name": "免费",
    "position": 3,
    "rankingId": 100224
  },
  {
    "tabId": 2,
    "id": 304,
    "name": "口碑",
    "position": 4,
    "rankingId": 100191
  },
  {
    "tabId": 2,
    "id": 329,
    "name": "月票",
    "position": 6,
    "rankingId": 100332
  },
  {
    "tabId": 2,
    "id": 331,
    "name": "男生",
    "position": 7,
    "rankingId": 100330
  },
  {
    "tabId": 2,
    "id": 80,
    "name": "都市",
    "position": 10,
    "rankingId": 100078
  },
  {
    "tabId": 2,
    "id": 81,
    "name": "玄幻",
    "position": 11,
    "rankingId": 100079
  },
  {
    "tabId": 2,
    "id": 82,
    "name": "悬疑",
    "position": 12,
    "rankingId": 100080
  },
  {
    "tabId": 2,
    "id": 83,
    "name": "历史",
    "position": 13,
    "rankingId": 100081
  },
  {
    "tabId": 2,
    "id": 84,
    "name": "科幻",
    "position": 14,
    "rankingId": 100082
  },
  {
    "tabId": 2,
    "id": 85,
    "name": "游戏",
    "position": 15,
    "rankingId": 100083
  },

]

fengkong_flag = False
_exception_time = None               # 异常发生时刻
for abluml_item in lists:
    rankingId = abluml_item['rankingId']
    params = {
        'rankingId': rankingId,
    }
    update_headers(rankingId)
    response = requests.get('https://www.ximalaya.com/revision/rank/v4/element', params=params,headers=headers)

    category_name = abluml_item['name']
    print(f"榜单{category_name}===============")
    category_id = saver.get_or_create_category(category_name)
    rankList = response.json().get('data', {}).get('rankList', [])
    if response.status_code != 200 or len(rankList)==0:
        logger.error('请重新登入，检查cookies文件是否存在')
        break
    rankList = rankList[0]['albums']
    # 榜单循环内部
    for index, item in enumerate(rankList):
        time.sleep(1)
        album_id = item['id']
        albumTitle = item['albumTitle']
        print(f'排名{index + 1}', albumTitle, '===============================')

        update_headers(album_id)
        # time.sleep(1)
        album_data = get_album(album_id)  # 你自己的函数
        album_datacomment = get_ablum_comment(album_id)  # 你自己的函数
        album_data.update(album_datacomment)
        if not album_data:
            continue
        update_headers(album_id)
        # time.sleep(1)
        anchor_data = get_anchor(album_data.get('anchorUid'))
        album_data['albumTitle'] = albumTitle  # 补全字段
        album_data['anchorName'] = anchor_data.get('nickName')
        album_data['fansCount'] = anchor_data.get('fansCount')
        album_data['playCount'] = album_data.get('playCount', 0)
        album_data['commentCount'] = item.get('commentCount', 0)
        album_data['trackCount'] = item.get('trackCount', 0)
        album_data['albumId'] = album_id

        logger.info('小说信息{}'.format(album_data))

        # 1. 写/更新小说详情
        note_id = saver.save_album(
            category_id=category_id,
            rank_position=index + 1,
            album_data=album_data,
            anchor_data=anchor_data)

        # 没有封控 或者 封控时间 过了 20分钟
        if not fengkong_flag or time.time() - _exception_time > PENALTY_SLEEP:
            time.sleep(1)
            update_headers(album_id)
            # 2. 写/更新章节
            tracks, desctracks = get_tracks_with_retry(album_id)
            if len(tracks) == 0:  # 触发滑块
                logger.warning(f'封控出现，专辑 {album_id} 章节稍后补爬')
                fengkong_flag = True
                _exception_time = time.time()
                # 把补课时需要的元数据也暂存下来
                pending_meta[album_id] = {
                    'note_id': note_id,
                    'albumTitle': albumTitle,
                    'nickName': anchor_data['nickName'],
                    'category_id': category_id
                }
                pending_album_ids.add(album_id)
                continue
                # 有封控 加入待做列表
        else:
            logger.warning(f'封控出现，专辑 {album_id} 章节稍后补爬')
            # 把补课时需要的元数据也暂存下来
            pending_meta[album_id] = {
                'note_id': note_id,
                'albumTitle': albumTitle,
                'nickName': anchor_data['nickName'],
                'category_id': category_id
            }
            pending_album_ids.add(album_id)
            continue
        saver.save_tracks(
            note_id=note_id,
            albumTitle=albumTitle,
            nickName=anchor_data['nickName'],
            category_id=category_id,
            tracks=tracks,
        chapter_order_type='ASC')

        saver.save_tracks(
            note_id=note_id,
            albumTitle=albumTitle,
            nickName=anchor_data['nickName'],
            category_id=category_id,
            tracks=desctracks,
            chapter_order_type='DESC')

        logger.info(f'《{albumTitle}》 榜单={category_name} 排名={index + 1} 章节数={len(tracks)} 已入库')



# ------------------------------------------------------------------
# 2. 所有榜单扫完后，集中补课
# ------------------------------------------------------------------
BASE_SLEEP   = 1

MAX_CONSECUTIVE = 3

# 把 set 转成 list，方便 shuffle 打散
pending = list(pending_album_ids)
consecutive_fail = 0
logger.info(f'开始补爬取{len(pending)}个专辑小说章节')
while pending:
    # 每轮重新打乱，避免老卡在一个坏 id
    import random
    random.shuffle(pending)

    failed_this_round = []          # 本轮没拿到的暂存
    for album_id in pending:
        # 根据连续失败次数决定睡多久
        sleep_time = PENALTY_SLEEP if consecutive_fail >= MAX_CONSECUTIVE else BASE_SLEEP
        time.sleep(sleep_time)

        update_headers(album_id)
        meta = pending_meta[album_id]
        logger.info('开始补爬 《{}》'.format(meta['albumTitle']) )

        tracks = getTracksList(album_id)
        update_headers(album_id)
        desctracks = getdescTracksList(album_id)

        if not tracks:
            consecutive_fail += 1
            logger.error('专辑 {} 补爬失败，连续失败={}'.format(album_id,consecutive_fail))
            failed_this_round.append(album_id)   # 先记下，本轮结束再放回队列
            continue

        # 成功 → 清零 + 写库
        consecutive_fail = 0
        saver.save_tracks(
            note_id=meta['note_id'],
            albumTitle=meta['albumTitle'],
            nickName=meta['nickName'],
            category_id=meta['category_id'],
            tracks=tracks,
            chapter_order_type='ASC')
        saver.save_tracks(
            note_id=meta['note_id'],
            albumTitle=meta['albumTitle'],
            nickName=meta['nickName'],
            category_id=meta['category_id'],
            tracks=tracks,
            chapter_order_type='DESC')
        logger.info('补爬完成 《{}》 章节数={}'.format(meta['albumTitle'], len(tracks)))

    # 本轮结束：把失败的重新放回队列，继续下一轮
    pending = failed_this_round
    logger.info('本轮结束，还剩 {} 张专辑待重试'.format(len(pending)))


