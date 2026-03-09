import json
import urllib

import execjs
import requests
from urllib.parse import urlencode
headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'bd-ticket-guard-client-data': 'eyJ0c19zaWduIjoidHMuMi40MzJhYTU0MTFhMmJhNzk4MzhiYjc0ZWE4NDQyZDVhZTNhODk0YTc0ZWU1M2ExZDY4YzQ2NDU4MmM0OWFjYmYyYzRmYmU4N2QyMzE5Y2YwNTMxODYyNGNlZGExNDkxMWNhNDA2ZGVkYmViZWRkYjJlMzBmY2U4ZDRmYTAyNTc1ZCIsInJlcV9jb250ZW50IjoidGlja2V0LHBhdGgsdGltZXN0YW1wIiwicmVxX3NpZ24iOiJuangwRnhHcjZ6RnBrYTlrUGFRT0cxUERrL2xGbCtONVA5TEdtTlNjSUJFPSIsInRpbWVzdGFtcCI6MTc1OTg5MDU5OX0=',
    'bd-ticket-guard-iteration-version': '1',
    'bd-ticket-guard-ree-public-key': 'BHjvhSp/zO67cbYJWwvOZDZo15p+zYlJjxsMfpzqNKfb9s9fHQO5pwr1TLCG+nsQ48NAgG77BH7GCKhV27FlstQ=',
    'bd-ticket-guard-version': '2',
    'bd-ticket-guard-web-sign-type': '1',
    'bd-ticket-guard-web-version': '2',
    'cookie': 'enter_pc_once=1; UIFID_TEMP=9e5c45806baed1121aef2e4ebdb50ae0783a7b9267143d29acaade7dde1bacd53a317bdec882a9b924ad9b45815c2e3cbf8632e6ca9c91748f759d2479f1daffa438cda51ccdd0381096a439b129d37c7d98826efdb3323b7ae2667697bca915cab6811e647366e9bffe48e66baa126c; hevc_supported=true; fpk1=U2FsdGVkX19BVBTwbP0iQ6ESodyuzJaKTTHjt2WO37V/qoDJb+T2iQsemIbqiSNR1bon77tsht8pnv7u9XXbaw==; fpk2=fe0673f2a48d047b912b27e2a0c02f9f; bd_ticket_guard_client_web_domain=2; xgplayer_user_id=510698734264; UIFID=9e5c45806baed1121aef2e4ebdb50ae0783a7b9267143d29acaade7dde1bacd53a317bdec882a9b924ad9b45815c2e3cbf8632e6ca9c91748f759d2479f1daffb24648da6918a63b3b6de4a84f34cb95a7b12efdf7e9ff699d154e6194f94a8582003e33ec64b21d535b5743df20e85a5a45c6724a7e2d8b926ccb2efc11c79fff8241fb6d73fec9389cd38bad4d8b126fb62373745c4882443c2157ad93e1ebeeacca8ae3383587181041469f9026a0564b98cab8c3955433342174ff4e95a0; passport_assist_user=CkCocHZzfbJ3oaj8NMhx_4qOaTYhyGt9et049ucnAUSiGXg5gh77fkwX-dwMQpQ89sgyEHxWMwBnE4qJERB4qwa1GkoKPAAAAAAAAAAAAABPSuKDrKhAHmi0iaOfEYnYRf0lyRLxmsJpXdY4T4DbI5XwvWbWw8M0cUBYfQGo-heCChCjhPgNGImv1lQgASIBA4Vgrfo%3D; n_mh=bRj9wnCvlvHfr9DpEUKfAcD0xW7we8zJIPyvFO-2KJs; uid_tt=858e96d5f9a8d58aedbf558d22b83d31; uid_tt_ss=858e96d5f9a8d58aedbf558d22b83d31; sid_tt=a656658bfd9fd7845f53be728b4d8971; sessionid=a656658bfd9fd7845f53be728b4d8971; sessionid_ss=a656658bfd9fd7845f53be728b4d8971; is_staff_user=false; login_time=1753796102663; SelfTabRedDotControl=%5B%5D; live_use_vvc=%22false%22; __live_version__=%221.1.3.7534%22; douyin.com; xg_device_score=7.802204888412783; device_web_cpu_core=12; device_web_memory_size=8; dy_swidth=1920; dy_sheight=1080; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1920%2C%5C%22screen_height%5C%22%3A1080%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A12%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A50%7D%22; strategyABtestKey=%221759890383.653%22; is_dash_user=1; __security_mc_1_s_sdk_crypt_sdk=759e1177-4ea9-a5f2; __security_mc_1_s_sdk_cert_key=241952ae-4c28-8469; __security_mc_1_s_sdk_sign_data_key_web_protect=a3f47387-41d9-95c2; s_v_web_id=verify_mghdan0n_H6KexA6b_SMww_4MQF_8TcI_3a1HsVuGgTAN; passport_csrf_token=e806d2dc904a31f9a7792bb0c10ed61e; passport_csrf_token_default=e806d2dc904a31f9a7792bb0c10ed61e; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Atrue%2C%22volume%22%3A0.497%7D; sdk_source_info=7e276470716a68645a606960273f276364697660272927676c715a6d6069756077273f276364697660272927666d776a68605a607d71606b766c6a6b5a7666776c7571273f275e58272927666a6b766a69605a696c6061273f27636469766027292762696a6764695a7364776c6467696076273f275e582729277672715a646971273f2763646976602729277f6b5a666475273f2763646976602729276d6a6e5a6b6a716c273f2763646976602729276c6b6f5a7f6367273f27636469766027292771273f273c3d3d3d3d36353c3d3c303234272927676c715a75776a716a666a69273f2763646976602778; bit_env=VYuAhoXX6Oj3alXVkbhIh-vB6khGFGMqMGV0ficgq7CdzCVTxBrHZY_eFlmcg8kM5KTGkYnB5NigxlkefhFciHxjsjCWOUsWN_5iTyhcjKWm-tt5oQezzTCC9buTVD1gS7sWL4bW6SQVadrxy8Z4CtT0LM_0VPvRMDihqJWw7x9fVQQRfv_gwenKZPESy2U8qf_6Jm49aeYESU8UEcscAOMZy856I0KWo7ZhuREmsYyBTPym4L72g1MSBCz3YgJYvT39aDJ9YWjdvQ7OrbmENH4GSHPqHkE1K7dGsl4ne9TcLbwBTS0gfOiOpM83ZKwvzGq94_1AJ1MIA_0u0eHGXQmqL5mmYF_yQfBC-5L9rnChpNrCJ_EEediezM09KRrroy93Uff3RRnP4awAA_OA-SgptNfEEEU-OOVySbuQlQ2UoyC4Ll8Y2IPycobHkhVvvSNJTC9mVnSiaJRUAusjQjJWs-SnuprGdDFLTXkEnhC-AC0WEHUiyt_GhYzBzRMVR-GcGvrr0GgM61RpwjhOB6sFwXTrX88SIXe1O80tep0%3D; gulu_source_res=eyJwX2luIjoiYTgyN2IwNDY5NmZiZWQ5ZmZkOWYxYzRiNzc4YWFkMTljNGM4MDQ2NDUzNTBjN2VjODhmMTAwNzkyYjE0YTBhNSJ9; passport_auth_mix_state=tubhw416qqge7r1zgc217kp3uthr0wphtst77cbh0bm26hhb; sid_guard=a656658bfd9fd7845f53be728b4d8971%7C1759890402%7C5184000%7CSun%2C+07-Dec-2025+02%3A26%3A42+GMT; session_tlb_tag=sttt%7C8%7CplZli_2f14RfU75yi02Jcf________-1_8WHR36Nl2kZtqAUTwZYLKPQXbR3C_-920SbH-YZ59E%3D; sid_ucp_v1=1.0.0-KDI2NTM0ZjVhN2EwMmM5NGM4Zjc3NTdjYWFmNWZiYjFjMGRkNGZkNzMKIQi-1pDW6PWhARDil5fHBhjvMSAMMPvYovcFOAdA9AdIBBoCbHEiIGE2NTY2NThiZmQ5ZmQ3ODQ1ZjUzYmU3MjhiNGQ4OTcx; ssid_ucp_v1=1.0.0-KDI2NTM0ZjVhN2EwMmM5NGM4Zjc3NTdjYWFmNWZiYjFjMGRkNGZkNzMKIQi-1pDW6PWhARDil5fHBhjvMSAMMPvYovcFOAdA9AdIBBoCbHEiIGE2NTY2NThiZmQ5ZmQ3ODQ1ZjUzYmU3MjhiNGQ4OTcx; stream_player_status_params=%22%7B%5C%22is_auto_play%5C%22%3A0%2C%5C%22is_full_screen%5C%22%3A0%2C%5C%22is_full_webscreen%5C%22%3A1%2C%5C%22is_mute%5C%22%3A1%2C%5C%22is_speed%5C%22%3A1%2C%5C%22is_visible%5C%22%3A0%7D%22; __ac_nonce=068e5cbf50005ad3ba1fc; __ac_signature=_02B4Z6wo00f01TbUbxAAAIDCZCtPCr7sQxE29GuAACVT02; publish_badge_show_info=%220%2C0%2C0%2C1759890413477%22; odin_tt=12cd826b7ef86891127b671dcaf0b55f1516e527049c50ef6ccf676cf650433d6c4eda3d94275333e4d05b483bf2ddb1e2e99bc67b9112de3eb7f8e5cac76fce; ttwid=1%7Cw0COJqKHYI_-oxX9-8yROvEMiIcHmdgJtZVGrOHsRxU%7C1759890427%7C2ecafef8ff8fb11e209beba33bda3cd50d50e84f47132ee069edb6b46a4d6c87; biz_trace_id=08d0a328; download_guide=%221%2F20251008%2F0%22; IsDouyinActive=true; home_can_add_dy_2_desktop=%220%22; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAAQOTYFIrBBtsOSBKNGI6Jh90gdhL5OaDYrT_iXKfJ1XQ%2F1759939200000%2F0%2F0%2F1759891199006%22; FOLLOW_NUMBER_YELLOW_POINT_INFO=%22MS4wLjABAAAAQOTYFIrBBtsOSBKNGI6Jh90gdhL5OaDYrT_iXKfJ1XQ%2F1759939200000%2F0%2F1759890599006%2F0%22; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCSGp2aFNwL3pPNjdjYllKV3d2T1pEWm8xNXArellsSmp4c01mcHpxTktmYjlzOWZIUU81cHdyMVRMQ0crbnNRNDhOQWdHNzdCSDdHQ0toVjI3RmxzdFE9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; bd_ticket_guard_client_data_v2=eyJyZWVfcHVibGljX2tleSI6IkJIanZoU3Avek82N2NiWUpXd3ZPWkRabzE1cCt6WWxKanhzTWZwenFOS2ZiOXM5ZkhRTzVwd3IxVExDRytuc1E0OE5BZ0c3N0JIN0dDS2hWMjdGbHN0UT0iLCJ0c19zaWduIjoidHMuMi40MzJhYTU0MTFhMmJhNzk4MzhiYjc0ZWE4NDQyZDVhZTNhODk0YTc0ZWU1M2ExZDY4YzQ2NDU4MmM0OWFjYmYyYzRmYmU4N2QyMzE5Y2YwNTMxODYyNGNlZGExNDkxMWNhNDA2ZGVkYmViZWRkYjJlMzBmY2U4ZDRmYTAyNTc1ZCIsInJlcV9jb250ZW50Ijoic2VjX3RzIiwicmVxX3NpZ24iOiJkQ2pIOGNHdEE4SjVoeStaUGE4Y0JIMU9kVjh2TmNTN2dhU1k4N3kxSjNrPSIsInNlY190cyI6IiN3djdNRGRycFlVeFBuRHZLZ0FUL2NycFlFNC9lVDBqcE9FYkpDVStMYUVtbFN3bkoxYysyVWRqWlpJdC8ifQ%3D%3D',
    'priority': 'u=1, i',
    'referer': 'https://www.douyin.com/video/7554232069438688539?modeFrom=',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'uifid': '9e5c45806baed1121aef2e4ebdb50ae0783a7b9267143d29acaade7dde1bacd53a317bdec882a9b924ad9b45815c2e3cbf8632e6ca9c91748f759d2479f1daffb24648da6918a63b3b6de4a84f34cb95a7b12efdf7e9ff699d154e6194f94a8582003e33ec64b21d535b5743df20e85a5a45c6724a7e2d8b926ccb2efc11c79fff8241fb6d73fec9389cd38bad4d8b126fb62373745c4882443c2157ad93e1ebeeacca8ae3383587181041469f9026a0564b98cab8c3955433342174ff4e95a0',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
}
cursor = 0
params = {
    'device_platform': 'webapp',
    'aid': '6383',
    'channel': 'channel_pc_web',
    'aweme_id': '7554232069438688539',
    'cursor': '0',
    'count': '5',
    'item_type': '0',
    'whale_cut_token': '',
    'cut_version': '1',
    'rcFT': '',
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
    'round_trip_time': '50',
    'webid': '7532353517529351689',
    'uifid': '9e5c45806baed1121aef2e4ebdb50ae0783a7b9267143d29acaade7dde1bacd53a317bdec882a9b924ad9b45815c2e3cbf8632e6ca9c91748f759d2479f1daffb24648da6918a63b3b6de4a84f34cb95a7b12efdf7e9ff699d154e6194f94a8582003e33ec64b21d535b5743df20e85a5a45c6724a7e2d8b926ccb2efc11c79fff8241fb6d73fec9389cd38bad4d8b126fb62373745c4882443c2157ad93e1ebeeacca8ae3383587181041469f9026a0564b98cab8c3955433342174ff4e95a0',
    'verifyFp': 'verify_mghdan0n_H6KexA6b_SMww_4MQF_8TcI_3a1HsVuGgTAN',
    'fp': 'verify_mghdan0n_H6KexA6b_SMww_4MQF_8TcI_3a1HsVuGgTAN',
    'msToken': 'sRZ6b_ucm1vHfpPU5IpkjcRDGVod3dBNf_tvI4gyNqezP6kQUAKPoOIo2fqxxY4-Xdtmn7m4k-2Bas3B0vtJfUm-S0MEZtwLG_8V07oZ3Dl8-BthXT4ZWYMlci68cD7Hxf2kFbDMdLb7vzNul6cXn6LaPgnvfk3PkEjNzbevSWvT',
    # 'a_bogus': 'd60VDFWyDZR5edFbuKnxynaUfHDlrB8yD-TQWy5PCPO3cHtbdbPrLnc2bouOsQbRObpshqIHzVzlYxVczsUzZFnpKmpfS0hbmzI99Xmo2qw2YztBLqSmSwTFLw0uUQTilAnAEAsRlsMF2EcWnqAdlBeaC5za5ORDRHqbdZmbc9WbfSLPm3rSO/EWOfwFQY95nE==',
}
has_more = 1
all_commets = []
while has_more == 1:
    node = execjs.get()
    ctx = node.compile(open('js/douyin-2025.js','r',encoding='utf-8').read())
    query = '&'.join([f'{k}={urllib.parse.quote(str(v))}' for k, v in params.items()])
    call_name = 'sign_datail'
    a_bogus = ctx.call(call_name, query, headers["user-agent"])
    params["a_bogus"] = a_bogus
    response = requests.get('https://www.douyin.com/aweme/v1/web/comment/list/', params=params, headers=headers)
    print('response:::',response.text)
    comments = response.json()['comments']
    cursor = response.json()['cursor']
    params['cursor'] = cursor
    has_more = response.json()['has_more']
    print('has_more::',has_more,'cursor::',cursor)
    for comment in comments:
        text = comment['text']
        cid = comment['cid']
        nickname = comment['user']['nickname']
        ip_label = comment['ip_label']
        create_time = comment['create_time']
        #点赞
        digg_count = comment['digg_count']
        #作者点赞过
        is_author_digged = comment['is_author_digged']
        #是否热评
        is_hot = comment['is_hot']
        #评论回复数
        reply_comment_total = comment['reply_comment_total']
        print(text, nickname, ip_label, create_time, digg_count)
        all_commets.append((text, nickname, ip_label, create_time, digg_count))

print('总共{}'.format(len(all_commets)))




