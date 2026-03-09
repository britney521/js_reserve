import re
from bs4 import BeautifulSoup
import requests
from lxml import etree
import execjs
session = requests.session()


headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Pragma': 'no-cache',
    'Referer': 'https://www.jscq.com.cn/search/pcRender?app=05666ce3eef644079c38a49e56ea9e47&sr=score+desc&pageId=afce95baf4ef4b1fa8d1ae8ee433222e&ext=siteId%3Add785e7f68ca42a89ae68ee255b0a990&pNo=1&q=',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}

for i in range(1,10):


    response = session.get('https://www.nmpa.gov.cn/datasearch/search-result.html',  headers=headers)
    print(response.status_code)
    # print(response.cookies.get_dict())
    print(response.text)
    NfBCSins2OywS = response.cookies.get_dict()['NfBCSins2OywS']
    print(NfBCSins2OywS)
    ojb_html = etree.HTML(response.text)
    contnt_data = ojb_html.xpath('(//meta[@r="m"])/@content')[0]
    func_code = ojb_html.xpath('//script[1]/text()')[0]
    script_src = ojb_html.xpath('//script[@src]/@src')[0]
    jssrc = 'https://www.nmpa.gov.cn' + script_src


    response = session.get(jssrc, headers=headers)
    print(contnt_data)
    # print(func_code)
    print(jssrc)

    with open('js/demo.js','r', encoding='utf-8') as f:
        js_code = f.read().replace('sz_fun;', func_code).replace('fun_main', response.text)

    with open('js/env.js','r', encoding='utf-8') as f:
        env_text = f.read()
    new_text = re.sub(
        r"content:'([^']*)'",  # 匹配 content:'...'，并捕获引号内的内容
        f"content:'{contnt_data}'",  # 替换为新的值
        env_text
    )

    new_text = re.sub(
        r"cookie:'([^']*)'",  # 匹配 cookie:'...'，并捕获引号内的内容
        f"cookie:'NfBCSins2OywS={NfBCSins2OywS}'",  # 替换为新的值
        new_text
    )
    with open('js/env.js','w', encoding='utf-8') as f:
        f.write(new_text)

    with open('js/ts.js','w', encoding='utf-8') as f:
        f.write(js_code)

    ctx = execjs.compile(open('js/main.js','r',encoding='utf-8').read())

    cookie_6 = ctx.call('get_rs6')
    print('cookie_6',cookie_6)
    print(len(cookie_6))
    session.cookies.update({'jDwkDWjIm6GRP':cookie_6})

    params = {
        'itemId': 'ff8080818046502f0180f934f6873f78',
        'isSenior': 'N',
        'searchValue': '酒精',
        'pageNum': '1',
        'pageSize': '10',
        'timestamp': '1755242988000',
    }

    response = session.get(
        'https://www.nmpa.gov.cn/datasearch/data/nmpadata/search',
        params=params,
        headers=headers,
    )
    print(response.status_code)
    if response.status_code == 200:
        print('请求成功')
        # print(response.text)
        soup = BeautifulSoup(response.text,'html.parser')
        lists = soup.select('.searchMod')
        for item in lists:
            title = item.select_one('.ajax_title').get_text()
            print(title)
