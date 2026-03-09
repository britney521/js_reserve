import requests
from urllib.parse import quote

from 一帆视频.jiami import get_sign


def get_resurl(publicKey, privateKey):

    headers = {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'cache-control': 'no-cache',
        # Requests sorts cookies= alphabetically
        # 'cookie': 'cf_clearance=79QUASyPHQuFDGgTfONyOG1yzo3HFlvi398Nvy8szkE-1726289173-1.2.1.1-t1zBiXI.U5lpmJB6uxEzKanrdFwfqxfXXmwzTWRl0JZ1FbHnODkZJqC_RvrybNy3_q9xMbtDLpLRWiP7sP98wtnn4Ebd6rWM.kMSBV_cZ_8vymMIz_dScpCwKjR_60sY9D4xyRp0KGFJwE91jCMSTRIzTNVWQm80j2RFx_l2rqnjDqUlzmikzqRX0Pd.pH_oM8Gk6vRSc3LKzwO_YZhVJR2r1toPdVdN582OEHp_SYGJOTsdUdHps2HUrrUmzB9qRQGOWecR9yk1cANsDdnGw2yZxqts1Qi9uqoOTOyrTqnNayGrGuI7oTUHNnEbqIr96oOJzbFxnozAPV79YYU5tRWTtz77DGsVReA.8f.AsXdiF2VF8BLZRAeknp2PssFYRIgK177MuqdK_KiCv4RXWHzngOqH6w5asyuuOvAHLmHD4_5LxH1CGZPuUeTJvlwr; _ga=GA1.1.1391753465.1732795322; dn_config=device=desktop&player=CkPlayer&tech=HLS&region=US&country=US&lang=none&v=1&volume=0.8&isDark=1; _ga_JEW7TS0WWF=GS1.1.1732856453.5.1.1732857175.0.0.0',
        'origin': 'https://www.yfsp.tv',
        'pragma': 'no-cache',
        'priority': 'u=1, i',
        'referer': 'https://www.yfsp.tv/play/Cwy9wuxg4ZF',
        'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
    }

    params = {
        'cinema': '1',
        'id': 'Cwy9wuxg4ZF',
        'a': '1',
        'lang': 'none',
        'usersign': '1',
        'region': 'US',
        'device': '1',
        'isMasterSupport': '1',
    }
    # 对每个查询参数进行编码
    encoded_params = "&".join(f"{key}={quote(str(value))}" for key, value in params.items())

    vv = get_sign(publicKey, privateKey, False, encoded_params.lower())
    print('vv',vv)
    params['vv'] = vv
    params['pub'] = publicKey
    response = requests.get('https://m10.yfsp.tv/v3/video/play', params=params, headers=headers)
    # print(response.json(),'1111')
    result = response.json()['data']['info'][0]['flvPathList'][1]['result']

    return result