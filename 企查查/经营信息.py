import execjs
import requests

cookies = {
    'qcc_did': '5ae86557-4bb7-4dd2-9482-a182a9e368b8',
    'UM_distinctid': '190e3e9672e6a5-09cd3e353bb546-4c657b58-168000-190e3e9672f13a6',
    'QCCSESSID': 'f86a525114e9c43463fb01994d',
    'acw_tc': '2f624a6217235355585566233e48a4a6c38c956785912cd1eeeecb8b1b0728',
    'tfstk': 'fE8jOEg-J-2X-cO5IihPVh0dsvb1cKgU1519tCU46ZQYBRddUs8qnCB6CLWu3noGkOU6QC82QFOg51d9IjXZi0RDiNbtLvJs8IA0CoCmUY7t6QQubc-o82RDMGkAxN0Esvd4AOXOWiI9wQBltrEvBiQJwTfG6-CTkbORE1QTkrQOe8CFOsBTkbXKP_ofHIG-u14jVz-DMTaBZU1Y19ghFPU9PsO5pInLWPL5GiTaD8Lw-i-9tMY2_ValuBtRy1Ti9l61AhLVyEH-Jgj9XHS64-h2pdOJIZ8-6oBp0K7JkHNTWQ_fFG5fA-M5pEAJ-aIrJXOJrKRDPCPtW_JFeIYA52hhlZBAP_YZErB62hLVmN2xCOYWwEK14V4FdmEYf7s35_6ENbZgbHaHRsnzi7TND_fzLbG7hljAZ_6ENbZgjiClaXlSN-ZG.',
    'CNZZDATA1254842228': '763465287-1721810643-https%253A%252F%252Fwww.bing.com%252F%7C1723535577',
}

headers = {
    # '43269708b10dddeada16': '2b5a7b91a03ddbcf00e532dae96c6badde15f440eb3049abcef29ceb3784cc589e15b39d6caa8b274c884ce772d0422216a467f7dc4a17abb8ff4666d9154dbd',
    'referer': 'https://www.qcc.com/crun/a4b916e8b883a1c62450d33fbf392f7e.html',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
}

params = {
    'keyNo': 'a4b916e8b883a1c62450d33fbf392f7e',
}
t = '/api/datalist/tenderlist?keyno=a4b916e8b883a1c62450d33fbf392f7e'
node = execjs.get()
ctx = node.compile(open('js/ij2.js', 'r', encoding='utf-8', errors='ignore').read())
i = ctx.call('s', t,None)
j = ctx.call('jl', t,None,'db199839c35d73fec33a169f42e89d96')
print(i,j)
headers[i] = j
response = requests.get('https://www.qcc.com/api/datalist/tenderlist', params=params, cookies=cookies, headers=headers)
print(response.json())
datas = response.json()['data']
for data in datas:
    title = data['title']
    publishdate = data['publishdate']
    ifbunitarray = data['ifbunitarray']
    wtbunitarray = data['wtbunitarray']
    if data['wtbrecord']:
        money = data['wtbrecord'][0].get('Amt')
    print(title, publishdate,ifbunitarray, money, wtbunitarray)
