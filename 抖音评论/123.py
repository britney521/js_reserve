from DrissionPage import ChromiumPage, ChromiumOptions
co = ChromiumOptions().set_paths('/Applications/GPT Chrome.app/Contents/MacOS/GptBrowser')

f = open("js/bms.js",'r',encoding='utf-8')
page = ChromiumPage(co)
# page1.run_js('alert(arguments[0]+arguments[1]);', 'Hello', ' world!')
page.add_init_js(f.read())
page.get('https://www.baidu.com/s?')
page.wait.doc_loaded()
res = page.run_js('''
        const t = {
        "aid": 6383,
        "pageId": 6241,
        "paths": [
            "^/webcast/",
            "^/aweme/v1/",
            "^/aweme/v2/",
            "/douplus/",
            "/v1/message/send",
            "^/live/",
            "^/captcha/",
            "^/ecom/"
        ],
        "boe": false,
        "ddrt": 8.5,
        "ic": 8.5
    }
    window.bdms.init(t)
    return window.a_bogus
''')
print(res)