import json
import time
from ws import rpc_token
import requests
import execjs
import execjs._runner_sources

node = execjs._runtimes.get('Node')

new_process_name = "new_process"
node._runner_source = "{} = process;\n".format(new_process_name) + \
execjs._runner_sources.Node.replace("process", new_process_name);


ctx = execjs.compile(open('js/main.js','r',encoding='utf-8').read())


cookies = {
    '__jdu': '866395081',
    'shshshfpa': '5dca2291-e9ab-b2da-182d-e0cd7bc31d0a-1754113913',
    'shshshfpx': '5dca2291-e9ab-b2da-182d-e0cd7bc31d0a-1754113913',
    'jcap_dvzw_fp': '9iBIHlm8x7lQIsr5UGmusDlLzaDCPAE7dHSHlIbE7-iqdZEAKwvCZ1owHHAt-xs4pfEIXlxk97lAoTJgMzJ3tKMewv0=',
    'ipLoc-djd': '17-1413-1419-7573',
    'autoOpenApp_downCloseDate_autoOpenApp_autoPromptly': '1765977515797_1',
    'unpl': 'JF8EAK1nNSttWBtSAB0LG0UZHApcW1lcTx8Eam4HXQkIHFIBHQYSGxl7XlVdWhRKFx9uYRRUXVNKUw4YAisSEXteXVdZDEsWC2tXVgQFDQ8VXURJQlZAFDNVCV9dSRZRZjJWBFtdT1xWSAYYRRMfDlAKDlhCR1FpMjVkXlh7VAQrCxwVEkNZVVddOEonBF9XNVxbW0NSNRoyGiJSHwFdW1sNShROZmACVlVcSl0FKwMrEQ',
    'ceshi3.com': '000',
    'b_dw': '1705',
    'b_dh': '883',
    'b_dpr': '2',
    'b_webp': '1',
    'b_avif': '1',
    'whwswswws': '',
    'warehistory': '1093727503%2C10133004171551%2C10133004171551%2C10133004171551%2C',
    'TARGET_UNIT': 'bjcenter',
    '__jdv': '76161171|direct|-|none|-|1769496347059',
    'pt_st': '1_ABvSavrFlXRc0YZTfyZqGJvHIK-xVTAYiDZMiA-ag96T6a9XoEV09BkJ8QMe1cBwQS4YO2-l1OHTYznIhtIIJwnYr2YmB4GyRsHZuVCEIgfqIAMb1IEP8MMvp_pDtJCCHf__qweEDMHsli8reC_WwzkY6QPz01ARZBKxzrQ7h1s9motnvc6hSDyr9VkdwxIFk05DROWboguD3L2RxLDJT2uUKixFZ5JSycQ3NUo*',
    'PCSYCityID': 'CN_420000_421000_0',
    'cid': '9',
    'mba_muid': '866395081',
    'wlfstk_smdl': 'p95o8onjlxko2zq0vuil78htgahrdhl3',
    'TrackID': '1mz5nnGrCJHcGyk7_HXI9uF2-xNvQflCNTcVTOZMJB1CNVSDdUdAmvylJJ-yybA2q4A1J3p0YthUz1GaznnTOXs_HPhDgjE2_5n7MA1geOPym3rfF29f6FbbXm1Bof6Lf',
    'thor': '13ABE4FC07154007D62B5628244819113782788DAA7D4C9DE81B9BB00752D8E079EBFF1F5C6A27EBC30C615C97BD8C2DC1501A97D0BE5A4E71D22E48F0C4BF0196F6D365427E3C3F624D3E25C8B9315287891ACDE8FA444DBA799C9C262393DAEE815F7B07936DAE70D79AF05801212CF5816FA39F8C1639A0CC6DE8F465C419139ABADCE3EBD53A0A0CC5F4CDE1E0EE2E298F511DC1173482DA9A6946FE1021',
    'light_key': 'AASBKE7rOxgWQziEhC_QY6yavoxkKIGGlz3dZ2OiOQaUmPj8eX91WlzryqeYqw5p_gR9jbDW',
    'pinId': 'jR7vs-5qwu1odovT3ljAzg',
    'pin': 'jd_bRvIZDMpattP',
    'unick': 'ii41v7i22kupj2',
    '_tp': '37euN3SqNS%2FLFYMMmHAsnw%3D%3D',
    '_pst': 'jd_bRvIZDMpattP',
    '__jdc': '143920055',
    '__jda': '143920055.866395081.1754113909.1769671690.1769676847.52',
    '__jdb': '143920055.3.866395081|52.1769676847',
    'flash': '3_YYJyo9JXPktNd7UuIe47UvMlbMQK6sYjsTe_5CEFy_GjwbxzU0KQjQTaB3CFn12dh8T4_LcQ3JUvut9nbjkEkEf0fhNM07_-BPs3e5BzRO1ep4JvSJK4v9uiakhh4aVq56gJUidwfscyndoK4k5r61NyFCrjdG-xQm496lL7_mZ5UkV8q6Ju',
    '3AB9D23F7A4B3CSS': 'jdd03OPC5DL7KBFI2FMD7W2AI6JYVAQAKICJJ7F4KR22FZ5SSHYMQC65RMUK5HAO7PI7SEH5CA3G4VR6FZMUP77DODBRME4AAAAM4BD26BXQAAAAACLQNGIK3QDRH6IX',
    'cn': '0',
    'shshshfpb': 'BApXWKnT9C_lAPIyBG-xcbqrkibrABazQBhZQPjxk9xJ1PdZfQoTkhDPRqAbqMpJnQ6qfW6nnsaxkI71g6a1d4tx9YQ63ruUf94U',
    '3AB9D23F7A4B3C9B': 'OPC5DL7KBFI2FMD7W2AI6JYVAQAKICJJ7F4KR22FZ5SSHYMQC65RMUK5HAO7PI7SEH5CA3G4VR6FZMUP77DODBRME4',
    'sdtoken': 'AAbEsBpEIOVjqTAKCQtvQu17-8OkkY-x8Z7Wbm6zXRFSX2UkObS4ee_Ui4Rls9XbavBx6NiSgUZgcv3wZdN9nKchv0kEgMMH4fnFv4PptiBfugmkjZiC-Wmk-icxgRwCFa8i9dJMCWIqOsc',
}


headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    'origin': 'https://search.jd.com',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://search.jd.com/Search?keyword=%E8%8B%B9%E6%9E%9C%E6%89%8B%E6%9C%BA&enc=utf-8&wq=%E8%8B%B9%E6%9E%9C%E6%89%8B%E6%9C%BA&pvid=f486f9d3b17746acb4b38311166715a0',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'x-referer-page': 'https://search.jd.com/Search',
    'x-rp-client': 'h5_1.0.0',
}


body = {
    "enc": "utf-8",
    "pvid": "8bcc8712e18f4438ae398f3141a4332c",
    "area": "17_1413_1419_7573",
    "page": 1,
    "mode": None,
    "concise": False,
    "new_interval": True,
    "s": 1
}

bodystr = json.dumps(body, ensure_ascii=False,separators=(',',':'))
time_str = str(int(time.time()*1000))
# h5st_value = ctx.call('get_hs5t',body,time_str)
h5st_value = rpc_token(body)
print(len(h5st_value))
# 核心：将 URL 中的查询参数整理为 params 字典
params = {
    'appid': 'search-pc-java',
    'client': 'pc',
    'clientVersion': '1.0.0',
    'cthr': '1',
    'uuid': '866395081',
    'loginType': '3',
    'keyword': '苹果手机',  # 中文参数无需手动编码，requests 会自动处理
    'functionId': 'pc_search_searchWare',
    # body 参数是 JSON 字符串，保持原样
    'body': bodystr,
    'x-api-eid-token': 'jdd03OPC5DL7KBFI2FMD7W2AI6JYVAQAKICJJ7F4KR22FZ5SSHYMQC65RMUK5HAO7PI7SEH5CA3G4VR6FZMUP77DODBRME4AAAAM4BANYTEQAAAAACU6T63QO6VDCM4X',
    'h5st': h5st_value,
    't': time_str  # 注意：原URL中有两个t参数，后一个会覆盖前一个
}
# 发送请求
response = requests.get(
    'https://api.m.jd.com/api',  # 简化后的基础URL
    params=params,              # 使用params传递查询参数
    cookies=cookies,
    headers=headers,
)
print(response.text,'response')
# datas = response.json()['data']['wareList']
# for item in datas:
#     color = item['color']
#     commentFuzzy = item['commentFuzzy']
#     catid = item['catid']
#     skuId = item['skuId']
#     jdPrice = item['jdPrice']
#     realPrice = item['realPrice']
#     oriPrice = item['oriPrice']
#     shopName = item['shopName']
#     print(color,commentFuzzy)