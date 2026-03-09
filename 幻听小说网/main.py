import re
import time

import requests
import execjs
from bs4 import BeautifulSoup

session = requests.Session()
ctx = execjs.compile(open('js/jiami.js','r').read())



def get_index(mainurl):
    response = session.get(mainurl,headers=headers)

def get_sign():
    response = session.get('https://www.huanting.cc/PTaudio2.php', headers=headers)
    sgin = re.search(r'sgin\s*=\s*"([0-9a-f]{32})"', response.text).group(1)
    return sgin



def get_chapter(id,pid):

    params = {
        'id': id, # bookid
        'pid': pid,
    }

    sgin = get_sign()
    header_data = ctx.call('headers', id,pid,sgin)
    headers.update(header_data)
    response = session.get('https://www.huanting.cc/apiP2.php', params=params,  headers=headers)

    file = response.json()['playlist']['file']

    fileurl = ctx.call('get_file', file)
    print(fileurl)

    res = session.get(fileurl[0], headers=headers)
    file_name = 'data/'+fileurl[0].split('/')[-1]
    with open(file_name, "wb") as f:
        for chunk in res.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)


if __name__ == '__main__':

    id = '2479'
    mainurl = f'https://www.huanting.cc/book/{id}.html'

    headers = {
        'accept': '*/*',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',

        'pragma': 'no-cache',
        'priority': 'u=0, i',
        'referer': mainurl,
        # 's1': '54d0ff7fa56cf6cbf429f51392bbc0e9',
        # 's2': '4174db86',
        # 's3': '==gN4IWZ3EjZ0AEN0gjK5YDOxAEblRnbJNWYNBUKu9WazJXZWBCZllmZpNWZwNnbVBCLvJHUgQTTgUGbwBXQgojclJXZk5WZSBCbhRXZNBSRMdkTBBCLlxGcwFEKgUETH5UQAhzMjBDOxQTMxkTYkVmZkFGZmRjY2E2M4ImYhZWYkdjM',
        'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
    }
    response = requests.get(mainurl, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    lists = soup.select('ul#vlink li a')
    pid = 1 # 集数
    for item in lists:
        time.sleep(4)
        url = item.get('href')
        url = 'https://www.huanting.cc' + url
        print(url,pid)

        get_index(url)
        # 防盗链
        headers['referer'] = url
        get_chapter(id, str(pid))
        pid += 1