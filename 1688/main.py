import pprint
import time
from urllib.parse import quote_plus
import csv
import requests

cookies = {
    'cna': '1TVDH32CKx8CAW+tytNNZEdK',
    'xlly_s': '1',
    'mtop_partitioned_detect': '1',
    '_m_h5_tk': '71bb77bf16ba42250aa46436fa6dccfd_1723622389870',
    '_m_h5_tk_enc': '1901c8d5dea8f0ba561f89704cbdbfaa',
    'cookie2': '213103a04dfaaca3fc61d1bc0f2374a8',
    'sgcookie': 'E100BM0nAk3YWKTHt4uPXR%2BEZYH38JUAbSaDpUuEn5tCbnQ9STJRmHZLfEC9aLeManIFWavTnmsK0HqqE1GxecdrLjgjI8ehjxhpBQwnAGG8kkdTSLyShorYLqWqvgQ73zUs',
    't': 'c5c6f8009990cc35f05ddd8b17f7411f',
    '_tb_token_': '5ee150b8e1e3b',
    '__cn_logon__': 'false',
    '_csrf_token': '1723615210850',
    'keywordsHistory': '%E7%BE%BD%E7%BB%92%E6%9C%8D',
    'tfstk': 'fv6-hM0j5r4kaeVhFgNDKZSqmPqDvTIPHaSsKeYoOZQAAExSOvMCMeQfkU6kEgjBpZIJPTvlqM9dkgUrEuPyOeQyowDhq9CqpGSFEuJ34LSyLpagSRbd4gJUrT_4mTHXcHIjO29CNKSSPpagS-mCLKjXd621a8xAcE-KFet5RKTXAHvBA39QDEtpbXg5RpZAcE-eAHOBAKOXx3iSCwlJ80TKp69hBV8sN5kSFtKb8Fs-1AtPh33BRgLY5S6xQQL1VEHQSDILveLVCrVA0Nf5rn7LBrp1_ZBp1pe-73CfXKTkC8ny5Txdj6ITW2xVNaBX9tqUaiBpyC6WMcMHhpKCRBC4WAxJEsdOe_rElg_My19PxcUlDCCv_nOjvb9lsGXe1Tw-7EAwvZdGwPHR5grhIOngTVY9xbZYDXleNnjIiAhrzG35UnLgmicETIx2DFqYDXleNn-vSoYmTXRD0',
    'isg': 'BJ-fuXC1Beq09wH2Zslv6RbWLvMpBPOmQKCPhDHuQs7owL5COdad9LXWhlC-2Mse',
}

headers = {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    # Requests sorts cookies= alphabetically
    # 'cookie': 'cna=1TVDH32CKx8CAW+tytNNZEdK; xlly_s=1; mtop_partitioned_detect=1; _m_h5_tk=71bb77bf16ba42250aa46436fa6dccfd_1723622389870; _m_h5_tk_enc=1901c8d5dea8f0ba561f89704cbdbfaa; cookie2=213103a04dfaaca3fc61d1bc0f2374a8; sgcookie=E100BM0nAk3YWKTHt4uPXR%2BEZYH38JUAbSaDpUuEn5tCbnQ9STJRmHZLfEC9aLeManIFWavTnmsK0HqqE1GxecdrLjgjI8ehjxhpBQwnAGG8kkdTSLyShorYLqWqvgQ73zUs; t=c5c6f8009990cc35f05ddd8b17f7411f; _tb_token_=5ee150b8e1e3b; __cn_logon__=false; _csrf_token=1723615210850; keywordsHistory=%E7%BE%BD%E7%BB%92%E6%9C%8D; tfstk=fv6-hM0j5r4kaeVhFgNDKZSqmPqDvTIPHaSsKeYoOZQAAExSOvMCMeQfkU6kEgjBpZIJPTvlqM9dkgUrEuPyOeQyowDhq9CqpGSFEuJ34LSyLpagSRbd4gJUrT_4mTHXcHIjO29CNKSSPpagS-mCLKjXd621a8xAcE-KFet5RKTXAHvBA39QDEtpbXg5RpZAcE-eAHOBAKOXx3iSCwlJ80TKp69hBV8sN5kSFtKb8Fs-1AtPh33BRgLY5S6xQQL1VEHQSDILveLVCrVA0Nf5rn7LBrp1_ZBp1pe-73CfXKTkC8ny5Txdj6ITW2xVNaBX9tqUaiBpyC6WMcMHhpKCRBC4WAxJEsdOe_rElg_My19PxcUlDCCv_nOjvb9lsGXe1Tw-7EAwvZdGwPHR5grhIOngTVY9xbZYDXleNnjIiAhrzG35UnLgmicETIx2DFqYDXleNn-vSoYmTXRD0; isg=BJ-fuXC1Beq09wH2Zslv6RbWLvMpBPOmQKCPhDHuQs7owL5COdad9LXWhlC-2Mse',
    'origin': 'https://s.1688.com',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://s.1688.com/',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
}
f = open('羽毛球.csv','w',encoding='utf-8',newline='')
csv_f = csv.writer(f)
encoded_keywords = quote_plus('羽毛球',encoding='gbk')
print(encoded_keywords)
csv_f.writerow(['公司名','url','城市','省份','制造类型','3月销量','复购率','userId'])
for i in range(1,20):
    time.sleep(1)
    response = requests.get(f'https://search.1688.com/service/companySearchBusinessService?keywords={encoded_keywords}&spm=a26352.13672862.searchbox.input&beginPage={i}&async=true&asyncCount=14&pageSize=20&requestId=26nTfRbtSE8YMkCmGmecMscsAhPHWibY6sz1723615475905&sessionId=a6ba4ca37ad141ce853fec0192a29c49&startIndex=6&pageName=supplier', cookies=cookies, headers=headers)
    try:
        data = response.json()['data']['data']['companyWithOfferLists']
    except:
        print(response.text)
    print(f'第{i}页数据--------------------------------')
    for item in data:
        # pprint.pprint(item)
        chineseName = item['companyModel']['company']
        domainUri = item['companyModel']['domainUri']
        userId = item['companyModel']['userId']
        city = item['companyModel']['city']
        province = item['companyModel']['province']
        manufactureType = item['companyModel']['manufactureType']
        saleQuantity3Month = item['companyModel']['saleQuantity3Month']
        repeatRate = item['companyModel']['repeatRate']
        csv_f.writerow([chineseName,domainUri,city,province,manufactureType,saleQuantity3Month,repeatRate,userId])
        print(chineseName,domainUri,city,province,manufactureType,saleQuantity3Month,repeatRate,userId)



