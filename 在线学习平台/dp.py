
import time
from DrissionPage import Chromium,ChromiumOptions
from concurrent.futures import ThreadPoolExecutor

op = ChromiumOptions().set_paths('/Applications/GPT Chrome.app/Contents/MacOS/GptBrowser')
#创建页面对象
browser = Chromium(op)


tab=browser.new_tab( )
tab.get("https://gxdzcs.dingkao.cn/pages1/tiku/lianxi?id=84955009868343&status=true")# 打开百度

tab.wait(2)
def get_data(d):


    res = tab.run_js(f'return cryptoEncryptData({d})')
    return {
        'key': res[1],
        'data': res[0],
    }