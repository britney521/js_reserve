
import requests

cookies = {
    'headerShow': 'true',
    'SESSION_FLAG': '1',
}

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    # Already added when you pass json=
    # 'Content-Type': 'application/json',
    # Requests sorts cookies= alphabetically
    # 'Cookie': 'headerShow=true; SESSION_FLAG=1',
    'Origin': 'https://ggfw.ybj.jiangxi.gov.cn',
    'Pragma': 'no-cache',
    'Referer': 'https://ggfw.ybj.jiangxi.gov.cn/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
    'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
}

json_data = {
    'current': 2,
    'tenditmName': '',
    'pacmatl': '',
    'dosformName': '',
    'drugCode': '',
    'drugName': '',
    'drugProdname': '',
    'pac': '',
    'prodEntpName': '',
    'admdvs': '',
    'cityCode': '',
    'size': 10,
}

response = requests.post('https://ggfw.ybj.jiangxi.gov.cn/hsa-local/hsa-pss-cw-local/pss/web/tpsQuery/queryCentralizedPurchaseOfDrugInfo', cookies=cookies, headers=headers, json=json_data)
print(response.text)