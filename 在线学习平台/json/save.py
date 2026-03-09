import csv
import json

from bs4 import BeautifulSoup


def clean(text):
    soup = BeautifulSoup(text, 'lxml')
    return soup.get_text()
header_col = ['大类','二级分类','章节','题目类型','题目标题','【选择题】选项A','【选择题】选项B','【选择题】选项C','【选择题】选项D','【选择题】选项E','【选择题】选项F','正确答案','题目难度','解析']

f = open('题库.csv','w',encoding='utf-8',newline='')
csv_f = csv.writer(f)
csv_f.writerow(header_col)

jsonpath = 'dk_decode_1762749695607.json'
with open(jsonpath,'r',encoding='utf-8') as f2:
    json_data = json.load(f2)

cartry = '职业适应性测试'
cartry2 = '信息技术必修一'
chapter = '数据与信息'
datas = json_data['plain']['data']
for item in datas:
    kind_text = item.get('kind_text')
    options = item.get('options', [])
    options = item.get('options', [])
    if isinstance(options, str):
        options = [options]*6  # 单字符串 → 单元素列表
    elif not isinstance(options, (list, tuple)):
        options = []

    # 再补/截到 6 个
    options = (options + [''] * 6)[:6]
    title = clean(item.get('stem'))
    analysis = item.get('analysis')
    answer = item.get('answer')
    difficulty = item.get('difficulty')
    chapter = item.get('chapter').get('title')
    print('获取到数据{}'.format(''.join(map(str, [cartry, cartry2, kind_text, title,
                                                        answer, analysis, difficulty, chapter]))))
    csv_f.writerow([cartry, cartry2,chapter, kind_text, title, *options, answer, difficulty, analysis])