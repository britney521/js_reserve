from json import decoder

import blackboxprotobuf
import requests
from loguru import logger
import res_pb2


def parse_search_response(response_content):
    """
    解析搜索响应
    """
    try:
        # 跳过前5个字节（可能是协议头）
        protobuf_data = response_content[5:]

        # 反序列化
        response = res_pb2.SearchResponse()
        response.ParseFromString(protobuf_data)

        return response
    except Exception as e:
        logger.error(f"解析失败: {e}")
        return None


def log_search_response(response):
    """
    日志记录搜索响应详情
    """
    if not response:
        logger.warning("响应为空")
        return

    logger.info("=== 搜索响应解析结果 ===")
    logger.info(f"状态: {response.status}")
    logger.info(f"消息: {response.message}")
    logger.info(f"总计数: {response.count}")
    logger.info(f"资源数量: {len(response.resourcesList)}")
    logger.info(f"自定义分组数量: {len(response.groupCustomList)}")

    # 记录自定义分组
    if response.groupCustomList:
        logger.info(f"自定义分组: {list(response.groupCustomList)}")

    # 记录资源详情
    for i, resource in enumerate(response.resourcesList):  # 只记录前5个资源
        log_resource_details(i, resource)


def log_resource_details(index, resource):
    """
    记录单个资源的详细信息
    """
    logger.info(f"\n--- 资源 {index + 1} ---")
    logger.info(f"资源类型: {resource.type}")
    logger.info(f"唯一标识: {resource.uid}")

    # 记录所有可能的资源类型字段
    log_specific_resource_fields(resource)

    # 记录原始按钮
    if resource.originbuttonsList:
        logger.info(f"原始按钮数量: {len(resource.originbuttonsList)}")
        for i, btn in enumerate(resource.originbuttonsList[:3]):  # 只显示前3个按钮
            logger.info(f"  按钮 {i + 1}: 类型={btn.type}, 类型名={btn.typeName}")


def log_specific_resource_fields(resource):
    """
    记录所有可能的特定资源字段
    """
    # 定义类型到字段名的映射
    type_field_mapping = {
        'claw': resource.claw,
        'conference': resource.conference,
        'cstad': resource.cstad,
        'magazine': resource.magazine,
        'meeting': resource.meeting,
        'nstr': resource.nstr,
        'patent': resource.patent,
        'periodical': resource.periodical,
        'standard': resource.standard,
        'thesis': resource.thesis,
        'thesiscatalog': resource.thesiscatalog,
        'video': resource.video,
        'localchronicle': resource.localchronicle,
        'localchronicleitem': resource.localchronicleitem,
        'book': resource.book
    }

    # 检查并记录所有存在的字段
    found = False
    for field_name, field_value in type_field_mapping.items():
        if field_value is not None and field_value != field_value.__class__():
            # 检查字段是否有实际内容（不是默认空对象）
            if has_meaningful_data(field_value):
                logger.info(f"{field_name} 数据存在:")
                log_specific_resource(field_value, field_name)
                found = True

    if not found:
        logger.info("未找到具体的资源数据")


def has_meaningful_data(message):
    """
    检查消息对象是否有实际数据（不是默认空值）
    """
    # 对于 protobuf 消息，可以检查是否有任何字段被设置
    # 这里使用简单的方法：检查所有字段是否都是默认值
    for field in message.DESCRIPTOR.fields:
        value = getattr(message, field.name)
        # 如果是重复字段，检查是否为空
        if field.label == field.LABEL_REPEATED:
            if value:  # 如果列表不为空
                return True
        # 如果是字符串，检查是否不是空字符串
        elif field.type == field.TYPE_STRING:
            if value != "":
                return True
        # 如果是消息类型，递归检查
        elif field.type == field.TYPE_MESSAGE:
            if value is not None and has_meaningful_data(value):
                return True
        # 对于其他类型，检查是否不是默认值
        else:
            if value != field.default_value:
                return True
    return False


def log_specific_resource(specific_resource, resource_type):
    """
    根据资源类型记录具体资源信息
    """
    try:
        # 将 protobuf 消息转换为字典以便记录
        resource_dict = message_to_dict(specific_resource)
        # 过滤掉空值
        filtered_dict = {k: v for k, v in resource_dict.items() if v not in ([], {}, "", None)}

        if filtered_dict:
            logger.info(f"  {resource_type} 详细信息:")
            for key, value in filtered_dict.items():
                # 对于复杂对象，可以进一步处理
                if isinstance(value, dict):
                    logger.info(f"    {key}: {json.dumps(value, ensure_ascii=False)}")
                else:
                    logger.info(f"    {key}: {value}")
        else:
            logger.info(f"  {resource_type} 无具体数据")

    except Exception as e:
        logger.warning(f"记录 {resource_type} 详细信息时出错: {e}")


# 辅助函数：检查字段是否存在
def has_field(message, field_name):
    """检查消息是否有指定字段"""
    return hasattr(message, field_name)


# 如果需要从 protobuf 消息转换为字典
from google.protobuf.json_format import MessageToDict


def message_to_dict(message):
    """将 protobuf 消息转换为字典"""
    return MessageToDict(message, preserving_proto_field_name=True, including_default_value_fields=False)

def get_response_summary(response):
    """
    获取响应摘要信息
    """
    if not response:
        return "响应解析失败"

    summary = {
        'status': response.status,
        'message': response.message,
        'total_count': response.count,
        'resource_count': len(response.resourcesList),
        'group_count': len(response.groupCustomList),
        'resource_types': {}
    }

    # 统计资源类型
    for resource in response.resourcesList:
        resource_type = resource.type or 'unknown'
        summary['resource_types'][resource_type] = summary['resource_types'].get(resource_type, 0) + 1

    return summary


# 更安全的解析函数
def safe_parse_search_response(response_content):
    """
    安全的解析函数，避免字段不存在的错误
    """
    try:
        response = res_pb2.SearchResponse()
        response.ParseFromString(response_content[5:])
        return response
    except Exception as e:
        logger.error(f"解析错误: {e}")
        # 尝试查看原始数据的前几个字节
        logger.debug(f"原始数据前20字节: {response_content[:20]}")
        return None




cookies = {
    'zh_choose': 'n',
    'source': 'baidu',
    'sourceUrl': 'https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DKOGsKQ0dYrdEMMb7bh-zN3v3Yr8qm2F7qOhCK6LvN4ANu7Enp9_xsGA5FNA2Zf40JmioyotMHROw9ZmiUTvw_a%26wd%3D%26eqid%3D9806b4e7000172c60000000668a7de32',
    'UM_distinctid': '198cfbc073e1e-0bbce9c828c93c-17525637-1fa400-198cfbc073f3e78',
    'Hm_lvt_838fbc4154ad87515435bf1e10023fab': '1755831863',
    'HMACCOUNT': '9D4C89992E46B08A',
    'Hm_lpvt_838fbc4154ad87515435bf1e10023fab': '1755831904',
    'CNZZDATA1281185085': '1419431410-1755831904-https%253A%252F%252Fwww.wanfangdata.com.cn%252F%7C1755831904',
}

headers = {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/grpc-web+proto',
    # 'cookie': 'zh_choose=n; source=baidu; sourceUrl=https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DKOGsKQ0dYrdEMMb7bh-zN3v3Yr8qm2F7qOhCK6LvN4ANu7Enp9_xsGA5FNA2Zf40JmioyotMHROw9ZmiUTvw_a%26wd%3D%26eqid%3D9806b4e7000172c60000000668a7de32; UM_distinctid=198cfbc073e1e-0bbce9c828c93c-17525637-1fa400-198cfbc073f3e78; Hm_lvt_838fbc4154ad87515435bf1e10023fab=1755831863; HMACCOUNT=9D4C89992E46B08A; Hm_lpvt_838fbc4154ad87515435bf1e10023fab=1755831904; CNZZDATA1281185085=1419431410-1755831904-https%253A%252F%252Fwww.wanfangdata.com.cn%252F%7C1755831904',
    'cookies': 'CASTGC=;CASTGCSpecial=;',
    'origin': 'https://s.wanfangdata.com.cn',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://s.wanfangdata.com.cn/paper?q=%E7%88%AC%E8%99%AB&p=1',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'x-grpc-web': '1',
    'x-user-agent': 'grpc-web-javascript/0.1',
}
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
data = bytes([0,0,0,0,len(encoded_data)])+ encoded_data

# data = '\x00\x00\x00\x00\x1c\n\x18\n\x05paper\x12\x06爬虫(\x010\x14B\x01\x00H\x01\x10\x01'.encode()

response = requests.post(
    'https://s.wanfangdata.com.cn/SearchService.SearchService/search',
    cookies=cookies,
    headers=headers,
    data=data,
)

original_data, message_type = blackboxprotobuf.protobuf_to_json(response.content[5:])

print(original_data)
print(message_type)
# from google.protobuf.json_format import MessageToDict

# def print_resource(resource):
#     # 把整个 Resource 转成 dict，自动展开嵌套结构
#     resource_dict = MessageToDict(resource, preserving_proto_field_name=True)
#     print("=== Resource ===")
#     for k, v in resource_dict.items():
#         print(f"{k}: {v}")

# # 在主逻辑里使用
# from google.protobuf.json_format import MessageToDict
# from google.protobuf.internal import decoder
# if response.status_code == 200:
#     # 跳过 5 字节协议头
#     raw = response.content[5:]

#     print(f"=== 原始数据 (前100字节) ===\n{raw}...\n")
#     # 反序列化
#     sr = res_pb2.SearchResponse()
#     sr.ParseFromString(raw)
#     print("=== SearchResponse ===",sr)
#     # 顶层信息
#     print("status :", sr.status)
#     print("message:", sr.message)
#     print("count  :", sr.count)

#     # 遍历资源
#     for idx, res in enumerate(sr.resourcesList, 1):
#         print(f"\n=== Resource #{idx} ===")
#         print("uid :", res.uid)
#         print("type:", res.type)

#         # 只打印 Periodical 为例
#         if res.HasField('periodical'):
#             p = res.periodical
#             print(p)
#             print("Periodical ID  :", p.id)
#             print("Title          :", " | ".join(p.titleList))
#             print("Creator        :", " | ".join(p.creatorList))
#             print("Publish Year   :", p.publishyear)
#             print("ISSN           :", p.issn)
#             print("Abstract       :", " ".join(p.abstractList))
#             print("Download Count :", p.downloadcount)
#             print("DOI            :", p.doi)
#             # 如果想一次性看全部字段：
#             # print(MessageToDict(p, preserving_proto_field_name=True))
#         if res.HasField('patent'):
#             p = res.patent
#             print(f"\n=== Patent #{idx} ===")
#             print("ID               :", p.id)
#             print("专利号           :", p.patentcode)
#             print("公布号           :", p.publicationno)
#             print("标题             :", " | ".join(p.titleList))
#             print("发明人           :", " | ".join(p.inventorList))
#             print("申请人           :", " | ".join(p.applicantList))
#             print("分类号           :", " | ".join(p.classcodeList))
#             print("摘要             :", " ".join(p.abstractList))
#             print("专利类型         :", p.patenttype)
#             print("申请日期         :", p.applicationdate)
#             print("公布日期         :", p.publicationdate)
#             print("国家/组织        :", p.countryorganization)
#             print("语言             :", p.language)
#             print("全文路径         :", p.fulltextpath)
#             print("是否有全文       :", p.hasfulltext)
#             print("下载次数         :", p.downloadcount)
#             print("DOI              :", p.doi)



