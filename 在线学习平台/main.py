import json
import time
import hashlib
import random
import string
import execjs
import requests
import csv
from loguru import logger
from bs4 import BeautifulSoup

from 在线学习平台.login import get_token

def clean(text):
    soup = BeautifulSoup(text, 'lxml')
    return soup.get_text()

ctx = execjs.compile(open('js/crytoencrypt.js','r',encoding='utf-8').read())

def get_timu(chapter_id,qbank_id,cartry,cartry2):
    d = {
        'cert_id': '225',
        'chapter_id': chapter_id,
        'lite': 0,
        'nonce': rand_str(),
        'platform': '1',
        'qbank_id': qbank_id,
        'seller_id': '16f36910df490122',
        'timestamp': str(timestamp),
        'token': token,
        'version': '1.1.30',
        'key': 'cd15cef931459789e502c0731c6b471a'
    }

    # 按字典序拼接
    params_str = '&'.join(f'{k}={d[k]}' for k in sorted(d))
    params_str = params_str + '&key=cd15cef931459789e502c0731c6b471a'
    sign = hashlib.md5(params_str.encode()).hexdigest()
    d['sign'] = sign
    # data = get_data(d)
    # d_json = json.dumps(d, ensure_ascii=False, separators=(',', ':'))
    data = ctx.call('get_data', d)
    response = fetch_insurance_num('https://api-next.dingkao.cn/v2/qbank/chapter/question', data=data)
    res = ctx.call('get_result', response.text, data['key'])
    datas = res.get('data',[])
    if len(datas) == 0:
        logger.error('未获取到数据,请检查登入状态')
        global need_login
        need_login = True
        return False
    for item in datas:
        kind_text = item.get('kind_text')
        options = item.get('options', [])
        options = (options + [''] * 6)[:6]
        title = clean(item.get('stem'))
        analysis = item.get('analysis')
        answer = item.get('answer')
        difficulty = item.get('difficulty')
        chapter = item.get('chapter').get('title')
        logger.info('获取到数据{}'.format(''.join(map(str, [cartry, cartry2, kind_text, title,
                                                      answer, analysis, difficulty, chapter]))))
        csv_f.writerow([cartry,cartry2,chapter,kind_text,title,*options,answer,difficulty,analysis])
    return True


# 重试装饰器
def retry(max_retries=3, delay=2, backoff=2):
    def decorator(func):
        def wrapper(*args, **kwargs):
            retries = 0
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    retries += 1
                    if retries >= max_retries:
                        logger.error(f"函数 {func.__name__} 重试 {max_retries} 次后失败: {e}")
                        raise
                    sleep_time = delay * (backoff ** (retries - 1))
                    logger.warning(f"函数 {func.__name__} 第 {retries} 次失败, {sleep_time}秒后重试: {e}")
                    time.sleep(sleep_time)

        return wrapper

    return decorator

@retry(max_retries=3, delay=2)
def fetch_insurance_num(url, data):
    """

    """
    time.sleep(random.randint(4,6))
    resp = requests.post(
        url,
        headers=headers, data=data
    )
    resp.raise_for_status()
    return resp

headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Origin': 'https://gxdzcs.dingkao.cn',
    'Pragma': 'no-cache',
    'Referer': 'https://gxdzcs.dingkao.cn/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}
# 隧道域名:端口号
tunnel = "e264.kdltps.com:15818"

# 用户名密码方式
username = "t16100640413459"
password = "e8xkdq31"
proxies = {
    "http": "http://%(user)s:%(pwd)s@%(proxy)s/" % {"user": username, "pwd": password, "proxy": tunnel},
    "https": "http://%(user)s:%(pwd)s@%(proxy)s/" % {"user": username, "pwd": password, "proxy": tunnel}
}
header_col = ['大类','二级分类','章节','题目类型','题目标题','【选择题】选项A','【选择题】选项B','【选择题】选项C','【选择题】选项D','【选择题】选项E','【选择题】选项F','正确答案','题目难度','解析']

f = open('题库.csv','w',encoding='utf-8',newline='')
csv_f = csv.writer(f)
csv_f.writerow(header_col)
def rand_str(length=16):
    """生成随机字母数字串"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
timestamp = int(time.time()) * 1000          # 毫秒时间戳

class BreakAllLoops(Exception):
    """专门用来一次性跳出多层循环"""
    pass

need_login = True
# with open('data.json', 'r', encoding='utf-8') as f:
#     items = json.load(f)
items= [{"id":79848540968768,"title":"职业适应性测试"}]
# items = [{'id': 84954594385995, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/8d2a323dcb5c5aa1/76c8b66c371516c3.jpg', 'title': '土木建筑大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 482, 'question_count': 482, 'question_chapter': 482, 'question_recycle': 0, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 84954966895165, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/a411ba2ef8f8500c/6201fb06b394ffeb.jpg', 'title': '水利大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 997, 'question_count': 997, 'question_chapter': 997, 'question_recycle': 0, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 84955009868343, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/e256c4b94c17e280/67f0488ab33aaf06.jpg', 'title': '装备制造大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 1184, 'question_count': 1184, 'question_chapter': 1184, 'question_recycle': 0, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 84955064010, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/fccc74ca917f7df1/0bfd847ee25fe171.jpg', 'title': '资源环境与安全大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 762, 'question_count': 762, 'question_chapter': 762, 'question_recycle': 0, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 84955089718979, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/06408f9a2017b90a/95b6ab13042782ce.jpg', 'title': '能源动力大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 1506, 'question_count': 1506, 'question_chapter': 1506, 'question_recycle': 0, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 84969541137793, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/e40b0530f39fa2ef/54166fa.jpg', 'title': '农林牧渔大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 1210, 'question_count': 1019, 'question_chapter': 1019, 'question_recycle': 63, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 84969585701720, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/5bfdefdbee0a14e3/b83042af558bcc0f.jpg', 'title': '生物与化工大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 1005, 'question_count': 1005, 'question_chapter': 1005, 'question_recycle': 24, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 84969865890787, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/c55937a06e063357/a1f5b8cdc56f0e38.jpg', 'title': '交通运输大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 586, 'question_count': 586, 'question_chapter': 586, 'question_recycle': 0, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 85022214950908, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/02804fb2f579be5b/ad56a6cdd50e5aa2.jpg', 'title': '文化艺术大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 1442, 'question_count': 1442, 'question_chapter': 1442, 'question_recycle': 10, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 85040310257748, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/64cfa5efd562a40e/bf2aca446d63605b.jpg', 'title': '食品药品与粮食大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 1111, 'question_count': 1109, 'question_chapter': 1109, 'question_recycle': 2, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 85040787550673, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202506/6e8196c91f858edc/66b88e0b5221322c.jpg', 'title': '旅游大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 3663, 'question_count': 2535, 'question_chapter': 2535, 'question_recycle': 519, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 85073385223863, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202507/e40b0530f39fa2ef/9a3cd954a5d24fa1.jpg', 'title': '公共管理与服务大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 2349, 'question_count': 2057, 'question_chapter': 2057, 'question_recycle': 292, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 85245978961090, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202507/e723689f5b5d2a10/3048f5867a2a463a.jpg', 'title': '财经商贸大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 1423, 'question_count': 1140, 'question_chapter': 1140, 'question_recycle': 26, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 85515918941236, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202508/6eae4115789a2ff6/2da9c55468265fec.jpg', 'title': '轻工纺织大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 622, 'question_count': 622, 'question_chapter': 622, 'question_recycle': 0, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}, {'id': 85516080573928, 'seller_id': 0, 'cert_id': 225, 'cate_id': 235, 'logo': 'https://static.dingkao.cn/202508/4a6fab9ac18f7d94/10924e1e6d08ab13.jpg', 'title': '新闻传播大类', 'desc': '', 'content': '', 'price_market': '10.00', 'price_selling': '10.00', 'question_total': 652, 'question_count': 652, 'question_chapter': 652, 'question_recycle': 0, 'paper_count': 0, 'exam_count': 0, 'validity': 365, 'sort': 0, 'type': 1, 'is_recommend': 0, 'is_self': 0, 'is_eroom': 0, 'status': 1, 'diy_item_style': 0, 'sales': 0, 'cert': {'id': 225, 'title': '职教高考'}, 'cate': {'id': 235, 'title': '专业基础综合课'}}]
def login():
    global need_login
    token = get_token()
    if token:
        logger.info(f'登入success,token为{token}')
        need_login = False
        return token

for item in items:
    if need_login:
        token = login()

    qbank_id = item['id']
    cartry = item['title']
    logger.info('正在采集{}-------{}'.format(qbank_id, cartry))

    d = {
        'cert_id': '225',
        'nonce': rand_str(),
        'platform': '1',
        'qbank_id': qbank_id,
        'seller_id': '16f36910df490122',
        'timestamp': str(timestamp),
        'token': token,
        'version': '1.1.30',
        'key': 'cd15cef931459789e502c0731c6b471a'
    }

    params_str = '&'.join(f'{k}={d[k]}' for k in sorted(d))
    params_str += '&key=cd15cef931459789e502c0731c6b471a'
    sign = hashlib.md5(params_str.encode()).hexdigest()
    d['sign'] = sign
    data = ctx.call('get_data', d)

    response = fetch_insurance_num('https://api-next.dingkao.cn/v2/qbank/chapter/list', data=data)
    res = ctx.call('get_result', response.text, data['key'])
    datas = res.get('data')

    try:
        for node in datas:                 # 改名避免跟外层 item 混淆
            chapter_id = node.get('id')
            title = node.get('title')
            children = node.get('children')
            if children:
                for child in children:
                    # 你原 bug：用了 item.get 应改为 child.get
                    if not get_timu(chapter_id, qbank_id, cartry, child.get('title')):
                        if need_login:
                            token = login()
            else:
                if not get_timu(chapter_id, qbank_id, cartry, title):
                    if need_login:
                        token = login()
    except BreakAllLoops:
        # 只跳出多层循环，不再处理后续 item
        continue



