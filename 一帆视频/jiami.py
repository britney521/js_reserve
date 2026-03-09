import time
import hashlib

def get_sign(publicKey,privateKey,flag=True,params=None):

    if flag:
        mid = ''
        public_key_index = int(time.time() * 1000)
    else:
        mid = params
        public_key_index = 0

    # 计算私钥索引
    private_key_index = public_key_index % len(privateKey)
    # 构建s字符串
    s = publicKey + "&" + mid + "&" + privateKey[private_key_index]
    print(s)
    md5 = hashlib.md5()
    md5.update(s.encode('utf-8'))
    return md5.hexdigest()


'CJSpCZWrEJ4rDIurD3HVLLDVCpWkDpCkCZCuBZLVOpSqD3WqCc5YD6CrD6LaDZbXCZasCMPZC30oCcDaCs9VDpOtEMPZCJWqCJSqCJKpDpGvPJPXPZPXOs4qDsOrP65&cinema=1&id=cwy9wuxg4zf&a=1&lang=none&usersign=1&region=us&device=1&ismastersupport=1&SpCZJSpCZWrEJ4rDIurD'
'CJSpCZWsC3OuDYuuC3XVLLDVCpWkDpCkCZCuBZLVE3HZP39aDcGmCJOoD6LYCs5XCMOoOs9bDc9cPZ0oP6LVPJaqE65aE34rOs9cDZ4uEJ5aDZ9aDMKrDJOnE3WuOs1&cinema=1&id=Cwy9wuxg4ZF&a=1&lang=none&usersign=1&region=US&device=1&isMasterSupport=1&SpCZJSpCZWsC3OuDYuuC'