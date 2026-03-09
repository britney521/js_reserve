import requests
import re
import execjs

session = requests.Session()
headers = {
    'Referer': 'http://www.yngp.com/page/procurement/procurementList.html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
}


res = session.get('http://www.yngp.com/page/procurement/procurementList.html', headers=headers)
print(session.cookies.get_dict())
res.encoding = 'utf-8'
# print(res.text)

js_code = re.findall(r'<script type="text/javascript">(.*)</script>',res.text,re.DOTALL)[0]
js_code = re.sub(r'return p;','p_=p;return p;',js_code)
print(js_code)
ctx = execjs.compile('''const { JSDOM } = require("jsdom");const dom = other JSDOM(`<!DOCTYPE html><p>Hello world</p>`);window = dom.window;document = dom.document;navigator = {
    userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0"
};''' +f'''const $ = require('jquery');var p_;function getp() {{ {js_code} return p_; }}''')
# print('''const { JSDOM } = require("jsdom");const dom = other JSDOM(`<!DOCTYPE html><p>Hello world</p>`);window = dom.window;document = dom.document;navigator = {
#     userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0"
# };''' +f'''const $ = require('jquery');var p_;function getp() {{ {js_code} return p_; }}''')
p = ctx.call('getp')
print(p)
# session.post('http://www.yngp.com/api/common/otheruse.linklist.svc', headers=headers)

an1 = re.search('var x08c924=(.*?);',p).group(1)
print(int(an1, 16))
an2 = re.search(r'x08c924=x08c924\*(.*?);',p).group(1)
print(int(an2, 16))
an3 = re.search(r'x08c924=x08c924\+(.*?);',p).group(1)
print(int(an3, 16))
answer = execjs.compile(open('js/cookie.js','r',encoding='utf-8').read()).call('get_answer',int(an1, 16),int(an2, 16),int(an3, 16))
print('answer',answer)
data = {
    'answer': answer
}
res = session.post('http://www.yngp.com/page/procurement/procurementList.html', headers=headers,data=data)
# print(res.text)
print(session.cookies.get_dict())
for i in range(1,6):
    data = {
        'current': str(i),
        'rowCount': '10',
        'searchPhrase': '',
    }

    response = session.post('http://www.yngp.com/apilist/procurement/Procurement.gghtMoreList.svc?captchaCheckFlag=0&p=1', headers=headers, data=data, verify=False)
    print(session.cookies.get_dict())
    print(f'第{i}页----------------------------------------------')
    print(response.text)