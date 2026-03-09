from flask import Flask, request, jsonify
import threading
import asyncio
import websockets
import json

app = Flask(__name__)

# 存储 WebSocket 连接（单客户端示例）
active_websocket = None

async def handle_websocket(websocket, path):
    global active_websocket
    active_websocket = websocket
    print("WebSocket 客户端已连接")

    try:
        async for message in websocket:
            print("收到前端消息:", message)
            # 这里可以处理前端返回的加密结果（如果需要）
    except websockets.exceptions.ConnectionClosed:
        print("WebSocket 客户端断开连接")
        active_websocket = None

def run_websocket_server():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    start_server = websockets.serve(handle_websocket, "localhost", 8080)
    loop.run_until_complete(start_server)
    loop.run_forever()

# 启动 WebSocket 服务器（在后台线程）
threading.Thread(target=run_websocket_server, daemon=True).start()

from queue import Queue
result_queue = Queue()

@app.route('/encrypt', methods=['POST'])
def encrypt():
    data = request.json
    text = data.get("text")
    key = data.get("key")

    if not text or not key:
        return jsonify({"error": "缺少 text 或 key"}), 400

    if not active_websocket:
        return jsonify({"error": "前端未连接"}), 503

    # 发送加密请求到前端
    asyncio.run(
        active_websocket.send(json.dumps({"text": text, "key": key}))
    )

    # 等待前端返回结果（超时 10 秒）
    try:
        encrypted_result = result_queue.get(timeout=10)
        return jsonify({"encrypted": encrypted_result})
    except:
        return jsonify({"error": "等待前端响应超时"}), 408

# 在 handle_websocket 中接收前端返回
async def handle_websocket(websocket, path):
    global active_websocket
    active_websocket = websocket
    print("WebSocket 客户端已连接")

    try:
        async for message in websocket:
            data = json.loads(message)
            if "encrypted" in data:
                result_queue.put(data["encrypted"])  # 存储结果
    except websockets.exceptions.ConnectionClosed:
        print("WebSocket 客户端断开连接")
        active_websocket = None

if __name__ == '__main__':
    app.run(port=5000)