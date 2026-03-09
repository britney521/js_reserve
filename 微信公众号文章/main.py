import requests

import csv

begin_msgid = '2650068113'
f = open('人民日报.csv', 'w',encoding='utf-8',newline='')
csv_w = csv.writer(f)
csv_w.writerow(['标题','链接','评论数','id','key','阅读数'])
while True:
    headers = {
        'referer': 'https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MzA4NDI3NjcyNA==&scene=1&album_id=2899660829341253633&count=3&uin=MzE3NDk3NDE3OQ%3D%3D&key=daf9bdc5abc4e8d04a0a2618e2ebebb240390304f7517617587e438184d81f4a7e0f34b89669bb454cb1703ce15d8cb8142729fcde470516e28447e690db095a018fed73817c68aa92ed48a4428cc17c24508031aaa22c3394c70520594c4517f1aee0e58531785de99b98978de650c36c5dbe32fc0acaae3e3016f141276745&devicetype=Windows+11+x64&version=63090b19&lang=zh_CN&ascene=7&acctmode=0&pass_ticket=Qs42CvoD2WHPBDppgxQeU8evaN5U3%2FlV1q1m5b1LMwqhl7tyThMzrlG97OX1QtT0&wx_header=1&session_us=gh_6651e07e4b2d',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090b19) XWEB/11253 Flue',
    }
                            # 'https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MzA4NDI3NjcyNA==&album_id=2899660829341253633&count=10&begin_msgid=2650029200&begin_itemidx=1&uin=MzE3NDk3NDE3OQ%253D%253D&key=daf9bdc5abc4e8d04a0a2618e2ebebb240390304f7517617587e438184d81f4a7e0f34b89669bb454cb1703ce15d8cb8142729fcde470516e28447e690db095a018fed73817c68aa92ed48a4428cc17c24508031aaa22c3394c70520594c4517f1aee0e58531785de99b98978de650c36c5dbe32fc0acaae3e3016f141276745&pass_ticket=Qs42CvoD2WHPBDppgxQeU8evaN5U3%25252FlV1q1m5b1LMwqhl7tyThMzrlG97OX1QtT0&wxtoken=&devicetype=Windows%26nbsp%3B11%26nbsp%3Bx64&clientversion=63090b19&__biz=MzA4NDI3NjcyNA%3D%3D&appmsg_token=1285_ISdrcToWYjIl9x84uksXHNjNQvCln0KovFxY6g~~&x5=0&f=json'
    response = requests.get(f'https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MzA4NDI3NjcyNA==&album_id=2899660829341253633&count=10&begin_msgid={begin_msgid}&begin_itemidx=1&uin=MzE3NDk3NDE3OQ%253D%253D&key=daf9bdc5abc4e8d04a0a2618e2ebebb240390304f7517617587e438184d81f4a7e0f34b89669bb454cb1703ce15d8cb8142729fcde470516e28447e690db095a018fed73817c68aa92ed48a4428cc17c24508031aaa22c3394c70520594c4517f1aee0e58531785de99b98978de650c36c5dbe32fc0acaae3e3016f141276745&pass_ticket=Qs42CvoD2WHPBDppgxQeU8evaN5U3%25252FlV1q1m5b1LMwqhl7tyThMzrlG97OX1QtT0&wxtoken=&devicetype=Windows%26nbsp%3B11%26nbsp%3Bx64&clientversion=63090b19&__biz=MzA4NDI3NjcyNA%3D%3D&appmsg_token=1285_ISdrcToWYjIl9x84uksXHNjNQvCln0KovFxY6g~~&x5=0&f=json', headers=headers)
    print(response.json())
    try:
        article_list = response.json()['getalbum_resp']['article_list']
    except:
        print('没有数据了')
        break
    for article in article_list:
        title = article['title']
        comment_count = article.get('elected_comment_count')
        url = article.get('url')
        read_count = article.get('read_count')
        msgid = article.get('msgid')
        key = article.get('key')
        # scraw(url)
        print(title,msgid)
        begin_msgid = msgid
        csv_w.writerow([title,url,comment_count,msgid,key,read_count])