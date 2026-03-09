import requests
import json


def rpc_token():
    url = "http://127.0.0.1:12080/go"
    data = {
        "group": "weibo",
        "action": "xhs",
        "param": json.dumps({"user":"黑脸怪","status":"好困啊"})
    }
    # print(data["param"])  # dumps后就是长这样的字符串{"user": "\u9ed1\u8138\u602a", "status": "\u597d\u56f0\u554a"}
    res = requests.post(url, data=data)  # 这里换get也是可以的
    print(res.text)
    return json.loads(res.text)["data"]
rpc_token()