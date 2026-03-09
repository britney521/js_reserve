

import asyncio
import websockets
import json

# 存储连接的客户端
connected_clients = set()


async def handle_connection(websocket, path):
    print(f"客户端已连接: {websocket.remote_address}")
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            data = json.loads(message)
            print(f"收到消息: {data}")

            if data['type'] == 'encryptionRequest':
                # 这是来自Python客户端的请求，转发给前端
                for client in connected_clients:
                    if client != websocket:  # 不发送回原客户端
                        await client.send(json.dumps({
                            "type": "encryptionRequest",
                            "text": data['text'],
                            "key": data['key'],
                            "requestId": data.get('requestId')  # 用于标识请求
                        }))

            elif data['type'] == 'encryptedResult':
                # 这是来自前端的加密结果，找到对应的Python客户端返回
                request_id = data['originalMessageId']
                for client in connected_clients:
                    if client != websocket:  # 找到另一个客户端
                        await client.send(json.dumps({
                            "type": "encryptedResult",
                            "encrypted": data['encrypted'],
                            "requestId": request_id
                        }))

    except websockets.exceptions.ConnectionClosed:
        print("客户端断开连接")
    finally:
        connected_clients.remove(websocket)


# 启动 WebSocket 服务器
start_server = websockets.serve(
    handle_connection,
    "localhost",  # 监听地址
    8080  # 监听端口
)

print("WebSocket 服务器启动: ws://localhost:8080")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

