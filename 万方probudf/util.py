def parse_protobuf_data(data):
    # 解析外层结构
    outer_length = int.from_bytes(data[4:5], byteorder='big')  # \x1c = 28
    protobuf_data = data[5:5 + outer_length]  # 提取PB消息内容

    print(f"外层长度前缀: {outer_length} bytes")
    print(f"PB消息内容: {protobuf_data.hex()}")

    # 手动解析PB消息
    index = 0
    while index < len(protobuf_data):
        # 读取字段标签和类型
        byte = protobuf_data[index]
        index += 1
        field_tag = byte >> 3
        wire_type = byte & 0x07

        if wire_type == 2:  # 长度分隔类型（字符串、字节数组等）
            # 读取长度
            length = protobuf_data[index]
            index += 1
            # 读取内容
            content = protobuf_data[index:index + length]
            index += length

            # 尝试解码为字符串
            try:
                content_str = content.decode('utf-8')
                print(f"字段 {field_tag}: 字符串 '{content_str}' (长度: {length})")
            except:
                print(f"字段 {field_tag}: 字节数据 {content.hex()} (长度: {length})")

        elif wire_type == 0:  # Varint类型
            # 读取varint值
            value = 0
            shift = 0
            while True:
                byte_val = protobuf_data[index]
                index += 1
                value |= (byte_val & 0x7F) << shift
                if not (byte_val & 0x80):
                    break
                shift += 7
            print(f"字段 {field_tag}: 数值 {value}")

        else:
            print(f"字段 {field_tag}: 未知类型 {wire_type}")

data = '\x00\x00\x00\x00\x1c\n\x18\n\x05paper\x12\x06爬虫(\x010\x14B\x01\x00H\x01\x10\x01'.encode()
# 解析数据
parse_protobuf_data(data)