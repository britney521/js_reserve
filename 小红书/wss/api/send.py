import requests

# 发送待加密的数据到 Flask
response = requests.post(
    "http://localhost:5000/encrypt",
    json={"text": "hello", "key": "123"}
)

print(response.json())  # 输出: {"status": "已发送到前端加密"}