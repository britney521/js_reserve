import re
import time
import execjs
import pandas as pd
import requests
cookies = {
    'acw_tc': '0a47308f17539424306615171eccd165aa6dcebfb2741ab9b31ef89ddc74c9',
    'QCCSESSID': '709b097e67e49afb0b23b493cf',
    'qcc_did': '59a3ac0d-cfe0-4447-a544-f622b762b689',
    'UM_distinctid': '1985f1d998d8f4-0eb70b9fdaf6eb-17525637-1fa400-1985f1d998e1ee9',
    '_c_WBKFRo': 'WE7iBxI2MFNXUC1dGfzinYqLBgj5Dsv5RCIg8QEk',
    '_nb_ioWEgULi': '',
    'CNZZDATA1254842228': '16481146-1753942432-https%253A%252F%252Fwww.baidu.com%252F%7C1753942518',
}

headers = {
    # '9501109cc9c77e19abba': '07b95b7179d193f57fdf8cab2cdec4a36a2bfb384726fe324eb75a682269558f90b12e449c4781a38c9841c75eaacec2e078715d48daf9ccebbeb70899944de5',
    'referer': 'https://www.qcc.com/web/search?key=%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',

}
def get_tid():
    params = {
        'key': '少林寺',
    }
    headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'cache-control': 'no-cache',
        # Requests sorts cookies= alphabetically
        # 'cookie': 'qcc_did=5ae86557-4bb7-4dd2-9482-a182a9e368b8; UM_distinctid=190e3e9672e6a5-09cd3e353bb546-4c657b58-168000-190e3e9672f13a6; QCCSESSID=f86a525114e9c43463fb01994d; tfstk=fE8jOEg-J-2X-cO5IihPVh0dsvb1cKgU1519tCU46ZQYBRddUs8qnCB6CLWu3noGkOU6QC82QFOg51d9IjXZi0RDiNbtLvJs8IA0CoCmUY7t6QQubc-o82RDMGkAxN0Esvd4AOXOWiI9wQBltrEvBiQJwTfG6-CTkbORE1QTkrQOe8CFOsBTkbXKP_ofHIG-u14jVz-DMTaBZU1Y19ghFPU9PsO5pInLWPL5GiTaD8Lw-i-9tMY2_ValuBtRy1Ti9l61AhLVyEH-Jgj9XHS64-h2pdOJIZ8-6oBp0K7JkHNTWQ_fFG5fA-M5pEAJ-aIrJXOJrKRDPCPtW_JFeIYA52hhlZBAP_YZErB62hLVmN2xCOYWwEK14V4FdmEYf7s35_6ENbZgbHaHRsnzi7TND_fzLbG7hljAZ_6ENbZgjiClaXlSN-ZG.; CNZZDATA1254842228=763465287-1721810643-https%253A%252F%252Fwww.bing.com%252F%7C1723535577; acw_tc=2f61f26817235373626931253e50aaf7fce1d78669a10858cf3d2cdefb7f82',
        'pragma': 'no-cache',
        'priority': 'u=0, i',
        'referer': 'https://www.qcc.com/web/search?key=%E4%BA%AC%E9%BE%99&p=3',
        'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
    }
    response = requests.get('https://www.qcc.com/web/search', params=params, cookies=cookies, headers=headers)
    text = response.text
    tid = re.findall("window.tid='(.*?)'</script>",text)
    # print(text)
    if tid:
        tid = tid[0]
        print('tid: %s' % tid)
        return tid
def scrawl(i,tid):
    json_data = {
        'searchKey': '少林寺',
        'pageIndex': i,
        'pageSize': 20,
    }
    t = '/api/search/searchmulti'
    node = execjs.get()
    ctx = node.compile(open('js/ij.js', 'r', encoding='utf-8', errors='ignore').read())
    i = ctx.call('s', t,json_data)
    j = ctx.call('jl', t,json_data, tid)
    print(i,j)
    headers[i] = j
    response = requests.post('https://www.qcc.com/api/search/searchMulti', cookies=cookies, headers=headers, json=json_data)
    # print('response: %s' % response.text)
    results = response.json()['Result']
    for result in results:
        KeyNo = result['KeyNo']
        name = result['Name'].replace('<em>','').replace('</em>','')
        ShortStatus = result['ShortStatus']
        Status = result['Status']
        OperName = result['OperName']
        RegistCapi = result['RegistCapi']
        CreditCode = result['CreditCode']
        StartDate = result['StartDate']
        Email = result['Email']
        Address = result['Address']
        print(KeyNo,name, ShortStatus, Status,OperName,RegistCapi,CreditCode,StartDate,Email,Address)


def scrawl_details(KeyNo):
    url = f'https://www.qcc.com/firm/{KeyNo}.html'
    response = requests.get(url, cookies=cookies,
                            headers=headers)
    tables = pd.read_html(response.text)
    for table in tables:
        df = table
        print(df)


if __name__ == '__main__':
    tid = get_tid()
    while not tid:
        print('继续请求tid')
        tid = get_tid()
    for i in range(3,10):
        print('爬取第{}页-----------------------'.format(i))
        scrawl(i,tid)
        time.sleep(5)



