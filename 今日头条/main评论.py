from urllib.parse import urlencode

import execjs
import requests

cookies = {
    '__ac_signature': '_02B4Z6wo00f01cD6GTgAAIDAH6HqdSn0Ym3A2h2AABaq01',
    'tt_webid': '7392142234839483923',
    'ttcid': '9b038e530c65454797b72f201142ab8622',
    'x-web-secsdk-uid': '54722416-e890-4095-8219-5822c3d6fcd6',
    'local_city_cache': '%E9%9A%8F%E5%B7%9E',
    '_ga': 'GA1.1.706803583.1721117256',
    'csrftoken': '1963ae85d68d027785b270202db9734a',
    's_v_web_id': 'verify_lyo4rz07_30rM3xOC_DKGr_4sy8_B2OE_dVUIEHcT7ZgN',
    'gfkadpd': '24,6457',
    'msToken': '0-TZDnAYE_BKymOgTE6AYtZlvTSLubzjBaUf4UfDXoMf4gYdCMpuBegWwSaQrOEDABHYac0MQYZIT-2746KwC3vwwFEkaohS5AUQmRZHLQ7orrMWtyU8',
    'ttwid': '1%7Cn8lcgFUirhKCkE6TEt3FByJg38-hhVzyGGwBFoth70w%7C1722070752%7Ce03ccb8c8263f09e7da5ae9eb89114d6faf339caf06b982d5196ade377b93ca6',
    'tt_scid': '2K2VK-oMi26QxlrjLxNHF2Z4ilyocxMcwpZUqIFxm-GW85gxwYA2vl2MMgjMYqz25a79',
    '_ga_QEHZPBE5HH': 'GS1.1.1722067181.6.1.1722070757.0.0.0',
}

headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    # Requests sorts cookies= alphabetically
    # 'cookie': '__ac_signature=_02B4Z6wo00f01cD6GTgAAIDAH6HqdSn0Ym3A2h2AABaq01; tt_webid=7392142234839483923; ttcid=9b038e530c65454797b72f201142ab8622; x-web-secsdk-uid=54722416-e890-4095-8219-5822c3d6fcd6; local_city_cache=%E9%9A%8F%E5%B7%9E; _ga=GA1.1.706803583.1721117256; csrftoken=1963ae85d68d027785b270202db9734a; s_v_web_id=verify_lyo4rz07_30rM3xOC_DKGr_4sy8_B2OE_dVUIEHcT7ZgN; gfkadpd=24,6457; msToken=0-TZDnAYE_BKymOgTE6AYtZlvTSLubzjBaUf4UfDXoMf4gYdCMpuBegWwSaQrOEDABHYac0MQYZIT-2746KwC3vwwFEkaohS5AUQmRZHLQ7orrMWtyU8; ttwid=1%7Cn8lcgFUirhKCkE6TEt3FByJg38-hhVzyGGwBFoth70w%7C1722070752%7Ce03ccb8c8263f09e7da5ae9eb89114d6faf339caf06b982d5196ade377b93ca6; tt_scid=2K2VK-oMi26QxlrjLxNHF2Z4ilyocxMcwpZUqIFxm-GW85gxwYA2vl2MMgjMYqz25a79; _ga_QEHZPBE5HH=GS1.1.1722067181.6.1.1722070757.0.0.0',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://www.toutiao.com/article/7376549899111858688/?log_from=c161055116ed1_1722070750242',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
}

params = {
    'aid': '24',
    'app_name': 'toutiao_web',
    'offset': '0',
    'count': '20',
    'group_id': '7376549899111858688',
    'item_id': '7376549899111858688',
    # '_signature': '_02B4Z6wo00901S0351AAAIDA8mwUH-HGI20tE-PAAC3sC5wuuBk0ILdkBFi3sGFqEwjw9Uzi7QCRAysg7aas7qcb4sZQUkHeuxPfVCJyDdQwXBIqMMhjO5yFCJYjH8WeW7jlwYWgfRr5XqW3a9',
}
node = execjs.get()
ctx = node.compile(open('js/__sign2.js', 'r', encoding='utf-8', errors='ignore').read())
params_str = 'https://www.toutiao.com/toutiao/article/v4/tab_comments/?' + urlencode(params)
sign = ctx.call('get_sign',{'url':params_str})
params['_signature'] = sign
response = requests.get('https://www.toutiao.com/article/v4/tab_comments/', params=params, cookies=cookies, headers=headers)
print(response.json())
datas = response.json()['data']
for data in datas:
    text = data['comment']['text']
    id = data['id']
    user_name = data['comment']['user_name']
    digg_count = data['comment']['digg_count']
    publish_loc_info = data['comment']['publish_loc_info']
    user_id = data['comment']['user_id']
    create_time = data['comment']['create_time']
    reply_count = data['comment']['reply_count']
    print(id, user_name, text, publish_loc_info)
# [, , "undefined" == typeof exports ? exports : void 0, "undefined" != typeof module ? module : void 0, "undefined" != typeof define ? define : void 0, "undefined" != typeof Object ? Object : void 0, void 0, "undefined" != typeof TypeError ? TypeError : void 0, "undefined" != typeof document ? document : void 0, "undefined" != typeof InstallTrigger ? InstallTrigger : void 0, "undefined" != typeof safari ? safari : void 0, "undefined" != typeof Date ? Date : void 0, "undefined" != typeof Math ? Math : void 0, "undefined" != typeof navigator ? navigator : void 0, "undefined" != typeof location ? location : void 0, "undefined" != typeof history ? history : void 0, "undefined" != typeof Image ? Image : void 0, "undefined" != typeof console ? console : void 0, "undefined" != typeof PluginArray ? PluginArray : void 0, "undefined" != typeof indexedDB ? indexedDB : void 0, "undefined" != typeof DOMException ? DOMException : void 0, "undefined" != typeof parseInt ? parseInt : void 0, "undefined" != typeof String ? String : void 0, "undefined" != typeof Array ? Array : void 0, "undefined" != typeof Error ? Error : void 0, "undefined" != typeof JSON ? JSON : void 0, "undefined" != typeof Promise ? Promise : void 0, "undefined" != typeof WebSocket ? WebSocket : void 0, "undefined" != typeof eval ? eval : void 0, "undefined" != typeof setTimeout ? setTimeout : void 0, "undefined" != typeof encodeURIComponent ? encodeURIComponent : void 0, "undefined" != typeof encodeURI ? encodeURI : void 0, "undefined" != typeof Request ? Request : void 0, "undefined" != typeof Headers ? Headers : void 0, "undefined" != typeof decodeURIComponent ? decodeURIComponent : void 0, "undefined" != typeof RegExp ? RegExp : void 0]
# [, , "undefined" != typeof exports ? exports : void 0, "undefined" != typeof module ? module : void 0, "undefined" != typeof define ? define : void 0, "undefined" != typeof Object ? Object : void 0, void 0, "undefined" != typeof TypeError ? TypeError : void 0, "undefined" != typeof document ? document : void 0, "undefined" != typeof InstallTrigger ? InstallTrigger : void 0, "undefined" != typeof safari ? safari : void 0, "undefined" != typeof Date ? Date : void 0, "undefined" != typeof Math ? Math : void 0, "undefined" != typeof navigator ? navigator : void 0, "undefined" != typeof location ? location : void 0, "undefined" != typeof history ? history : void 0, "undefined" != typeof Image ? Image : void 0, "undefined" != typeof console ? console : void 0, "undefined" != typeof PluginArray ? PluginArray : void 0, "undefined" != typeof indexedDB ? indexedDB : void 0, "undefined" != typeof DOMException ? DOMException : void 0, "undefined" != typeof parseInt ? parseInt : void 0, "undefined" != typeof String ? String : void 0, "undefined" != typeof Array ? Array : void 0, "undefined" != typeof Error ? Error : void 0, "undefined" != typeof JSON ? JSON : void 0, "undefined" != typeof Promise ? Promise : void 0, "undefined" != typeof WebSocket ? WebSocket : void 0, "undefined" != typeof eval ? eval : void 0, "undefined" != typeof setTimeout ? setTimeout : void 0, "undefined" != typeof encodeURIComponent ? encodeURIComponent : void 0, "undefined" != typeof encodeURI ? encodeURI : void 0, "undefined" != typeof Request ? Request : void 0, "undefined" != typeof Headers ? Headers : void 0, "undefined" != typeof decodeURIComponent ? decodeURIComponent : void 0, "undefined" != typeof RegExp ? RegExp : void 0]


