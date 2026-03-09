import blackboxprotobuf
from loguru import logger

# 修正十六进制字符串（将 'l' 改为 '1'）
hex_string = "000b040300000052000010c000000000443035314241430044303531000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040e9535c405d9f74"

# 将十六进制字符串转换为字节串
try:
    byte_string = bytes.fromhex(hex_string)
    logger.info('字节串长度: {}'.format(len(byte_string)))
    logger.info('字节串: {}'.format(byte_string.hex()))

    # 使用 blackboxprotobuf 解析
    original_data, message_type = blackboxprotobuf.protobuf_to_json(byte_string)

    logger.info('解析结果:')
    logger.info(original_data)
    logger.info('消息类型:')
    logger.info(message_type)

except ValueError as e:
    logger.error('十六进制转换错误: {}'.format(e))
except Exception as e:
    logger.error('Protocol Buffers 解析错误: {}'.format(e))



# data = '\x00\x00\x00\x00\x1c\n\x18\n\x05paper\x12\x06爬虫(\x010\x14B\x01\x00H\x01\x10\x01'.encode()
# hex_data = data.hex()
# print(hex_data)  # 输


message_type =  {'1': {'type': 'message', 'message_typedef': {'1': {'type': 'bytes', 'name': ''}, '2': {'type': 'bytes', 'name': ''}, '5': {'type': 'int', 'name': ''}, '6': {'type': 'int', 'name': ''}, '8': {'type': 'bytes', 'name': ''}, '9': {'type': 'int', 'name': ''}}, 'name': ''}, '2': {'type': 'int', 'name': ''}}


data = {
  "1": {
    "1": "paper",
    "2": "爬虫",
    "5": 1,
    "6": 20,
    "8": "\u0000",
    "9": 1
  },
  "2": 1
}

# 编码为 Protocol Buffers 二进制
encoded_data = blackboxprotobuf.encode_message(data, message_type)

print("编码后的二进制数据:", encoded_data)
print("十六进制表示:", encoded_data.hex())