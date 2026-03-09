import urllib
from urllib.parse import urlencode

import execjs
import requests

headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    'cookie': 'ttwid=1%7CDw7G9_XJYIRFyVsuECQo-zLWpcHmFx5OfHq2y9WjphA%7C1713342988%7Cc6f00c88b61a526bb5e8aa9adb16e649aa35aef6d710b9a1136c48b8bc506b0b; bd_ticket_guard_client_web_domain=2; xgplayer_user_id=151895854419; d_ticket=fcd0db94a0df7ad5bfb4d7c1fd01a86edb258; passport_assist_user=CkDE7lv0DoRQsf6_e9CsZObas2ZVSX2Cx-pfv7hqE9bhJc6F0fTKl9v72ysNFtbrlUfqlljkXlSomzo63CSGfSiuGkoKPK-FZw6LW0sTMttY4bNGvFFP49nGcLDZvWsnCbLpqCXfkIrndELw60Y6u-ItOhL4D4qSt7wueKVwY-00YRC-pdMNGImv1lQgASIBA7qOAQU%3D; n_mh=bRj9wnCvlvHfr9DpEUKfAcD0xW7we8zJIPyvFO-2KJs; sso_uid_tt=7422d5e75e85d6c3def9d963951018b2; sso_uid_tt_ss=7422d5e75e85d6c3def9d963951018b2; toutiao_sso_user=08c957de518de8ff76f0cfcbb6d3e00e; toutiao_sso_user_ss=08c957de518de8ff76f0cfcbb6d3e00e; sid_ucp_sso_v1=1.0.0-KDkxYjUyZjBlZjEzZmY3ZWZlMjliNDQzZDhiYTUwNWQyNzM2NjEyYTAKIQi-1pDW6PWhARDH94WzBhjvMSAMMPvYovcFOAZA9AdIBhoCbGYiIDA4Yzk1N2RlNTE4ZGU4ZmY3NmYwY2ZjYmI2ZDNlMDBl; ssid_ucp_sso_v1=1.0.0-KDkxYjUyZjBlZjEzZmY3ZWZlMjliNDQzZDhiYTUwNWQyNzM2NjEyYTAKIQi-1pDW6PWhARDH94WzBhjvMSAMMPvYovcFOAZA9AdIBhoCbGYiIDA4Yzk1N2RlNTE4ZGU4ZmY3NmYwY2ZjYmI2ZDNlMDBl; uid_tt=2d950710063e183df97cf58f6817ddca; uid_tt_ss=2d950710063e183df97cf58f6817ddca; sid_tt=1c01b6c10fc2624629fe672267beae75; sessionid=1c01b6c10fc2624629fe672267beae75; sessionid_ss=1c01b6c10fc2624629fe672267beae75; _bd_ticket_crypt_doamin=2; _bd_ticket_crypt_cookie=2153b2ee6e05fbb99ebd68761ca0ee11; __security_server_data_status=1; store-region=cn-hb; store-region-src=uid; my_rd=2; SEARCH_RESULT_LIST_TYPE=%22single%22; UIFID_TEMP=fa6cda412c16c7667c793c3549025f122b064c8fecfdcae9cd663ea2db1893d2e84d3b5eacf75691014b8b0afb160ab35b352d0a85dc24eee9ed9a7833b68a64e757a4bf351fd7b12458885c005b8067; fpk1=U2FsdGVkX19Txd81LqGItJhUce2aQ7cHrKbrpJD6kjlweEtU6j7HO1PXlzL/EKvuHNy9BXyVyidUPxKbZeeOPA==; fpk2=e95fb8733ac3417b3aa284b34753f35d; UIFID=fa6cda412c16c7667c793c3549025f122b064c8fecfdcae9cd663ea2db1893d2689f5c8e69343a9bf9209087ef4dc820850eee1767e750c6167c6e23a203cc2a0c1e37793048be28922b9504485205ab4ccd67ca57aa9861e14cf1e5c8d152e4655d1e8a86bcc3bd915893c9345278d5598a7b01ec64631e87579004ec89f7383bbe433de4836462b1a66ee479358a9d113465cc013608c388213f6f285673e6; passport_csrf_token=cace5ab1af826bd58b310c1497a7ada8; passport_csrf_token_default=cace5ab1af826bd58b310c1497a7ada8; sid_guard=1c01b6c10fc2624629fe672267beae75%7C1720505204%7C4393951%7CThu%2C+29-Aug-2024+02%3A39%3A15+GMT; sid_ucp_v1=1.0.0-KDNjYzQyOWVmNjhjMTk4MTY4YTQ3MTM1MmM0NDQwZDFhYjkyNWY0MjEKGwi-1pDW6PWhARD0prO0BhjvMSAMOAZA9AdIBBoCbGYiIDFjMDFiNmMxMGZjMjYyNDYyOWZlNjcyMjY3YmVhZTc1; ssid_ucp_v1=1.0.0-KDNjYzQyOWVmNjhjMTk4MTY4YTQ3MTM1MmM0NDQwZDFhYjkyNWY0MjEKGwi-1pDW6PWhARD0prO0BhjvMSAMOAZA9AdIBBoCbGYiIDFjMDFiNmMxMGZjMjYyNDYyOWZlNjcyMjY3YmVhZTc1; live_use_vvc=%22false%22; douyin.com; device_web_cpu_core=12; device_web_memory_size=8; architecture=amd64; csrf_session_id=00702a2109f5faa2035918c7ab572e7c; passport_fe_beating_status=true; s_v_web_id=verify_lyp8ryt5_CAe8GlUt_YC7R_47Fm_9Zks_fpU9Up2nyrbI; __live_version__=%221.1.2.1991%22; webcast_leading_last_show_time=1721184461640; webcast_leading_total_show_times=1; webcast_local_quality=origin; dy_swidth=1536; dy_sheight=960; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Atrue%2C%22volume%22%3A0.188%7D; publish_badge_show_info=%220%2C0%2C0%2C1722044533558%22; xg_device_score=7.557151144604173; strategyABtestKey=%221722044541.281%22; biz_trace_id=505c914c; __ac_nonce=066a4666600cb69445e77; __ac_signature=_02B4Z6wo00f01KWI1fgAAIDBetMmtITFm4SlqNFAAE.Le2; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1536%2C%5C%22screen_height%5C%22%3A960%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A12%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A100%7D%22; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAAQOTYFIrBBtsOSBKNGI6Jh90gdhL5OaDYrT_iXKfJ1XQ%2F1722096000000%2F0%2F0%2F1722051375560%22; FOLLOW_NUMBER_YELLOW_POINT_INFO=%22MS4wLjABAAAAQOTYFIrBBtsOSBKNGI6Jh90gdhL5OaDYrT_iXKfJ1XQ%2F1722096000000%2F0%2F1722050775561%2F0%22; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCRzhRZ1Ayd3p0QjViUHc0M0xveWtxaU9LTHg0UFpzL1p3M3FWQ1I4Q1lDM3c3NEFIL1RjV1NLcm9vbUMzb1ZpUXVCbHZIUXd5UHNkZ2tpdks1eHFBQmM9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoxfQ%3D%3D; home_can_add_dy_2_desktop=%221%22; odin_tt=abb4918f29fa2aadb811c19411fe5041387d03e08f50647e48f9c3e09d27bfba51cb6bb35ed5bd274066bb44605ea133; download_guide=%223%2F20240727%2F0%22; pwa2=%220%7C0%7C2%7C0%22; IsDouyinActive=true',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://www.douyin.com/user/MS4wLjABAAAAUg6GA31cLhQxV7R8oZ0Xu8TrHKlOml2uaJuLCk5FJJA?modal_id=7329531669432569138&vid=7395661361134472474',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
}

params = {
    'device_platform': 'webapp',
    'aid': '6383',
    'channel': 'channel_pc_web',
    'item_id': '7589983778215431483',
    'comment_id': '7590072273395991333',
    'cut_version': '1',
    'cursor': '0',
    'count': '3',
    'item_type': '0',
    'update_version_code': '170400',
    'pc_client_type': '1',
    'pc_libra_divert': 'Mac',
    'support_h265': '1',
    'support_dash': '1',
    'cpu_core_num': '12',
    'version_code': '170400',
    'version_name': '17.4.0',
    'cookie_enabled': 'true',
    'screen_width': '1920',
    'screen_height': '1080',
    'browser_language': 'zh-CN',
    'browser_platform': 'MacIntel',
    'browser_name': 'Chrome',
    'browser_version': '128.0.0.0',
    'browser_online': 'true',
    'engine_name': 'Blink',
    'engine_version': '128.0.0.0',
    'os_name': 'Mac OS',
    'os_version': '10.15.7',
    'device_memory': '8',
    'platform': 'PC',
    'downlink': '10',
    'effective_type': '4g',
    'round_trip_time': '100',
    'webid': '7532353517529351689',
    'uifid': '9e5c45806baed1121aef2e4ebdb50ae0783a7b9267143d29acaade7dde1bacd53a317bdec882a9b924ad9b45815c2e3cbf8632e6ca9c91748f759d2479f1daffb24648da6918a63b3b6de4a84f34cb95a7b12efdf7e9ff699d154e6194f94a8582003e33ec64b21d535b5743df20e85a5a45c6724a7e2d8b926ccb2efc11c79fff8241fb6d73fec9389cd38bad4d8b126fb62373745c4882443c2157ad93e1ebeeacca8ae3383587181041469f9026a0564b98cab8c3955433342174ff4e95a0',
    'msToken': 'haGyRxLuah4SiVYAhEmFJWfex934_NooivgJXmYnDxTsWWR0nj8FoFj5E4U8gBQPur7PctwGrF3vSzYGeJhoDLi-5rjO3VRk1fLcEdYxDe7kYrBLjPSqvhKk5bfeYL53lVto5Tyly21o0uZl4-aaVIGbaIYEU_7eYhuVsZm6DZS-EQ==',
    # 'a_bogus': 'Yy0RDFWJYdmfFVFbmcQtyvNlao9ArBuy2MTdbxATCNzjOXzaMWNkOxbZjoq-Dn6-RbpkheAH5EaMYnVbTGUwZoHpwmZvSZTjATAA9hXL2qw2GFiQEqygSwYzwwBS8QUqaQn9E1D56ssCIdQWINA2lpCay5FO5QmDRHFbdMscn9WTDSyPYZajOMiAOD7qaD==',
    'verifyFp': 'verify_mjnrqafa_5Wi3jjck_uQI2_4CuJ_BUVl_0a9vwelc8VKq',
    'fp': 'verify_mjnrqafa_5Wi3jjck_uQI2_4CuJ_BUVl_0a9vwelc8VKq',
}
params_str = urlencode(params)
node = execjs.get()
ctx = node.compile(open('js/douyin-2025.js','r',encoding='utf-8').read())
query = '&'.join([f'{k}={urllib.parse.quote(str(v))}' for k, v in params.items()])
call_name = 'sign_reply'
a_bogus = ctx.call(call_name, query, headers["user-agent"])
params["a_bogus"] = a_bogus
response = requests.get('https://www.douyin.com/aweme/v1/web/comment/list/reply/', params=params, headers=headers)
print(response.json())
comments = response.json()['comments']
for comment in comments:
    cid = comment['cid']
    nickname = comment['user']['nickname']
    text = comment['text']
    ip_label = comment['ip_label']
    create_time = comment['create_time']
    # 点赞
    digg_count = comment['digg_count']
    # 作者点赞过
    is_author_digged = comment['is_author_digged']
    # 是否热评
    is_hot = comment['is_hot']
    reply_id = comment['reply_id']
    print(text, nickname, ip_label, create_time, digg_count)