import hmac
import hashlib
import json

codes = {
    "n": 20,
    "codes": {
        "0": "W",
        "1": "l",
        "2": "k",
        "3": "B",
        "4": "Q",
        "5": "g",
        "6": "f",
        "7": "i",
        "8": "i",
        "9": "r",
        "10": "v",
        "11": "6",
        "12": "A",
        "13": "K",
        "14": "N",
        "15": "k",
        "16": "4",
        "17": "L",
        "18": "1",
        "19": "8"
    }
}


def a(e):
    t = e.lower() + e.lower()
    n = ''
    for i in range(len(t)):
        # 获取字符的 ASCII 值，然后取模
        char_code = ord(t[i]) % codes["n"]
        # 将编码转换为对应的字符，确保使用字符串作为键
        n += codes["codes"].get(str(char_code), '')  # 使用 get 方法避免 KeyError
    return n

def o(e, t):
    return hmac.new(t.encode(), e.encode(), hashlib.sha512).hexdigest()

def s(e, u=None):
    if u is None:
        u = {}
    t = (e if e else "/").lower()
    n = json.dumps(u, ensure_ascii=False).lower()  # 确保 JSON 字符串中包含非 ASCII 字符
    return o(t + n, a(t)).lower()[8:28]  # 根据原始 JavaScript 代码调整下标


def jl(n,e,t):
    if e is None:
        e = {}
    if t is None:
        t = ""
    n = (n if n else "/").lower()
    i = json.dumps(e, ensure_ascii=False).lower()
    return o(n + "pathString" + i + t, a(n))

# 调用 s 函数，传递 search 和 None 作为参数
search = '/api/bigsearch/recruit?city=&companyscale=&education=&experience=&fromtime=&industry=&isfromsingleapp=true&issortasc=false&pageindex=1&pagesize=20&salary=&searchkey=%e7%94%b5%e8%af%9d%e9%94%80%e5%94%ae&sortfield=publishtime&totime='
i = s(search, None)
j = jl(search, None,'d6f055163af721bdd4b322ee1b52c3cd')
print(j)

