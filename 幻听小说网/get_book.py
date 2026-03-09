import requests
from bs4 import BeautifulSoup



headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
    'priority': 'u=0, i',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
}

type = 'xuanhuan'  # dushi  kongbu xingzhen shangzhan junshi wangyou

for i in range(1,100):
    response = requests.get('https://www.huanting.cc/{}/{}.html'.format(type,i), headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    books = soup.select('.list_box .book')
    for book in books:
        name = book.select_one('.left dt').get_text()
        href = book.select_one('.left .info a')['href']
        print(name,href)