import base64
import json
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5

# 模拟从 localStorage 获取公钥和私钥
def get_local_storage_key(key_name):
    # 这里假设公钥和私钥已经从某处加载
    # 在实际应用中，你可能需要从文件或其他存储中读取
    if key_name == 'logo1':
        # 公钥
        return RSA.import_key(open("public_key.pem").read())
    elif key_name == 'logo2':
        # 私钥
        return RSA.import_key(open("private_key.pem").read())
    else:
        raise ValueError("Unknown key name")


data = {
    "condition": {
        "level": 0,
        "treeMerchantType": 1,
        "keyWord": ""
    },
    "pageSize": 10
}  # 示例数据

# 模拟加密过程
def encrypt_data(data, public_key):
    # 将数据转换为 JSON 字符串
    data_json = json.dumps(data)
    # 使用公钥加密
    cipher = PKCS1_v1_5.new(public_key)
    encrypted_data = cipher.encrypt(data_json.encode('utf-8'))
    # 返回 Base64 编码的加密数据
    return base64.b64encode(encrypted_data).decode('utf-8')

# 模拟解密过程
def decrypt_data(encrypted_data, private_key):
    # 确保 Base64 编码的字符串长度是 4 的倍数
    padding_length = 4 - (len(encrypted_data) % 4)
    if padding_length < 4:
        encrypted_data += '=' * padding_length

    # 将 Base64 编码的加密数据解码
    encrypted_data_bytes = base64.b64decode(encrypted_data)
    # 使用私钥解密
    cipher = PKCS1_v1_5.new(private_key)
    decrypted_data = cipher.decrypt(encrypted_data_bytes, None)
    # 将解密后的数据转换为 JSON 对象
    return json.loads(decrypted_data.decode('utf-8'))

# 获取公钥和私钥
public_key = get_local_storage_key('logo1')
private_key = get_local_storage_key('logo2')


# 加密数据
# encrypted_data = encrypt_data(data, public_key)
# print("Encrypted Data:", encrypted_data)

# 解密数据
decrypted_data = decrypt_data('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', private_key)
print("Decrypted Data:", decrypted_data)