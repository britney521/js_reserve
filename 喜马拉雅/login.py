
from loguru import logger

from DrissionPage import Chromium, ChromiumOptions
from matplotlib import pyplot as plt


def check_login():
    login_btn = tab.ele('css:.login-btn')
    return login_btn

op = ChromiumOptions().set_paths('/Applications/GPT Chrome.app/Contents/MacOS/GptBrowser')
browser = Chromium(op)
logger.info("浏览器对象创建完成")

tab = browser.new_tab()
tab.get('https://www.ximalaya.com/')

login_btn = check_login()
if login_btn:
    logger.info(f'检测需要登入')
    login_btn.click()
    tab.wait(2)

    while check_login():
        tab.wait(3)
        logger.info(f'请扫码登入')
logger.info(f'检测已经登入')
cookies = tab.cookies().as_str()
with open('cookies.txt', 'w') as f:
    f.write(cookies)