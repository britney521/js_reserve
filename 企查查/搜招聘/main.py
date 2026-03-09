import re
import time
import urllib.parse
import execjs
import requests

from 企查查.搜招聘.jiami import s, jl

cookies = {
    'qcc_did': '5ae86557-4bb7-4dd2-9482-a182a9e368b8',
    'UM_distinctid': '190e3e9672e6a5-09cd3e353bb546-4c657b58-168000-190e3e9672f13a6',
    'QCCSESSID': '7e1a0e9149a4c9ab8498540f98',
    'tfstk': 'fit6yKmK25V6IBgZP-HFOd47dYsXhIiPG-6vEKEaHGITMSpRTO-ZsKCXGB5HGZDGgsCXgKLZL0oyIdjcDiGr407W5-ovfsFVDRUbZmlra0oFb8ZBvbRaH4V_RtfdBtCOMvZdntIYMtdA9wBRU5IvMiHCJTX_XtQOHWBdttIAMIIxwzmCLV19CvoCsQin3KvOOo9MAOQ_SdCQDoKBRN18c6ZYDH69K0HstugVwUfNz_AKYlsXptOCzFG7fI9vEEQBc5HwwKdMAGjSuAbWJe8P5eGTc6-NhaIAR-EvdM1HNnI-2W6HJd8vjCwbDOxw4Z1lRxEcuMKPyUd_nYvdXtdcrnluj1pvE3YPVcNlCep5AgPg4_gTWrwCro6CavMQorjkglv-8R2B0NBhL7kId5acW9XCavMQorbOK9krdvN_o',
    'acw_tc': '1a0c39cf17322633582414765e010f23c32c4a1c1bb00111d30e8993ecf2eb',
    'CNZZDATA1254842228': '763465287-1721810643-https%253A%252F%252Fwww.bing.com%252F%7C1732263426',
}

headers = {
    # 'a562bcb226f69f5b3a8b': 'e39b9c286cbf3c707e0e6b949d7c2217eb84d0474a79d2153f8ef382a68a9dfbeb530947b0a77269a16aa7fa8db3907e475d0e3ff6340dd31172dfe2958a6cec',
    'referer': 'https://www.qcc.com/web/bigsearch/recruit?searchKey=%E7%94%B5%E8%AF%9D%E9%94%80%E5%94%AE',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
}
def get_tid():
    params = {
        'searchKey': '电话销售',
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
    response = requests.get('https://www.qcc.com/web/bigsearch/recruit', params=params, cookies=cookies, headers=headers)
    text = response.text
    tid = re.findall("window.tid='(.*?)'</script>",text)
    # print(text)
    if tid:
        tid = tid[0]
        print('tid: %s' % tid)
        return tid


def scrawl(i,tid):
    params = {
        'city': '',
        'companyscale': '',
        'education': '',
        'experience': '',
        'fromTime': '',
        'industry': '',
        'isFromSingleApp': True,
        'isSortAsc': False,
        'pageIndex': str(i),
        'pageSize': 20,
        'salary': '',
        'searchKey': '电话销售',
        'sortField': 'publishtime',
        'toTime': '',
    }
    # 将参数字典转换为 URL 编码格式
    encoded_params = urllib.parse.urlencode(params)

    # 构建完整的 URL
    t = f'/api/bigsearch/recruit?{encoded_params}'
    print('t',t)
    node = execjs.get()
    ctx = node.compile(open('js/header.js', 'r', encoding='utf-8', errors='ignore').read())
    i = ctx.call('s', t)
    j = ctx.call('jl', t, None, tid)
    # i = s(t)
    # j = jl( t, None, tid)

    print(i, j)
    headers[i] = j
    response = requests.get('https://www.qcc.com/api/bigsearch/recruit', params=params, cookies=cookies,
                       headers=headers)
    print(response.text)
    datas = response.json()['Result']
    for data in datas:
        CompanyKeyNo = data['CompanyKeyNo']
        CompanyName = data['CompanyName']
        name = data['PositionName'].replace('<em>', '').replace('</em>', '')
        Province = data['Province']
        Salary = data['Salary']
        Education = data['Education']
        Experience = data['Experience']
        PublishTime = data['PublishTime']
        print(CompanyKeyNo, CompanyName, name,Province,Salary,Education,Experience,PublishTime)


if __name__ == '__main__':
    tid = get_tid()
    while not tid:
        print('继续请求tid')
        tid = get_tid()
    for i in range(1,10):
        print('爬取第{}页-----------------------'.format(i))
        scrawl(i,tid)
        time.sleep(5)
