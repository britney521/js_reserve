import asyncio
import websockets
import json
import uuid


async def get_encrypted_data(text, key):
    async with websockets.connect("ws://localhost:8080") as ws:
        # 生成唯一请求ID
        request_id = str(uuid.uuid4())

        # 发送加密请求
        await ws.send(json.dumps({
            "type": "encryptionRequest",
            "text": text,
            "key": key,
            "requestId": request_id
        }))

        # 等待响应
        while True:
            response = await ws.recv()
            data = json.loads(response)

            if data.get('type') == 'encryptedResult' and data.get('requestId') == request_id:
                return data['encrypted']

# 调用示例
async def main(text,key):
    encrypted = await get_encrypted_data(
        text,
        key
    )

    return encrypted

encrypted = asyncio.get_event_loop().run_until_complete(main('/api/sec/v1/sbtsource{"callFrom":"web","appId":"xhs-pc-web"}','afed5178c8187113129369c482721688'))
print("加密结果:", encrypted)