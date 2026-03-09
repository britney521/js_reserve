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
    'Referer': 'http://www.dce.com.cn/dce/channel/list/1018.html',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
}

cookie_one = 'hNUS9DnJtejwS'
cookie_two = 'hNUS9DnJtejwT'

for i in range(1,10):


    response = session.get('http://www.dce.com.cn/dce/channel/list/1018.html',headers=headers)
    # print(response.cookies.get_dict())
    # print(response.text)
     # hNUS9DnJtejwT
    cookie_ = response.cookies.get_dict().get(cookie_one)
    hNUS9DnJtejwS = cookie_ if cookie_ else '60uFloraNJ9chbKHOTw_q.YdHZR0XMwnxDUPJ4OHutp0lfaQMmezsCgUZWBhwTILSvgVqdndSjVdqnAc6VEErhIG'
    print(hNUS9DnJtejwS)
    ojb_html = etree.HTML(response.text)
    contnt_data = ojb_html.xpath('//meta[@id="9wq7NOeAWkjr"]/@content')[0]
    func_code = ojb_html.xpath('//script[1]/text()')[0]
    script_src = ojb_html.xpath('//script[@src]/@src')[0]
    jssrc = 'http://www.dce.com.cn' + script_src


    response = session.get(jssrc, headers=headers)
    print(contnt_data)
    # print(func_code)
    print(script_src)
    #
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
        f"cookie:'{cookie_one}={hNUS9DnJtejwS}'",  # 替换为新的值
        new_text
    )
    with open('js/env.js','w', encoding='utf-8') as f:
        f.write(new_text)

    with open('js/ts.js','w', encoding='utf-8') as f:
        f.write(js_code)

    ctx = execjs.compile(open('js/main.js','r',encoding='utf-8').read())

    cookie_6 = ctx.call('get_rs6')
    print('cookie_6',len(cookie_6))
    session.cookies.update({cookie_two:cookie_6})


    response = session.get('http://www.dce.com.cn/dce/channel/list/1018.html', headers=headers)
    print(response.status_code)
    if response.status_code == 200:
        print('请求成功')
        # print(response.text)
        soup = BeautifulSoup(response.text,'html.parser')
        lists = soup.select('.searchMod')
        for item in lists:
            title = item.select_one('.ajax_title').get_text()
            print(title)
