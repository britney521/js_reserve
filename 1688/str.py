from urllib.parse import quote_plus
import urllib.parse
r = '%E7%BE%BD%E7%BB%92%E6%9C%8D%0A'
encoded_keywords = quote_plus('羽毛球',encoding='gbk')
print(encoded_keywords)



encoded_str = '%D3%F0%C8%DE%B7%FE'
decoded_str = urllib.parse.unquote(encoded_str,encoding='gbk')

print(decoded_str)




