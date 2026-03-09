from urllib.parse import urlencode
from hashlib import md5

params = {"doctorId":"3140616663","siftId":1,"nowPage":4,"pageSize":10,"diseaseId":"","userId":"11316547951","token":"Bz1calVvUGNUaQ0_Az5QZQY0XG5VbQJAVmwLO1JtXW9Vb19vBToAMFppX2xWHwJoUTtbMwBtXTk"}



# 1. 按 key 升序拼接（不 urlencode 值，保持原样）
query = '&'.join(f'{k}={v}' for k, v in sorted(params.items()))
print('sorted query:', query)
# 2. MD5 32 位小写
sign = md5(query.encode()).hexdigest()

print('query:', query)
print('md5 :', sign)