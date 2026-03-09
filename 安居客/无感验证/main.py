import requests


def get_token():
    params = {
        'referer': 'https://callback.58.com/antibot/verifycode',
        'zoneId': 'CN31',
        'dt': 'SyKrFiQAgcFFQhAAEBbS2Mf943fHLsNv',
        'id': '713d69f50c9c4b73b9fc53306b4cb940',
        'fp': 'JH6Jb5Apd/9MatgXfLcDG1v7ki\\fWIlvtV4xgU4ryYU\\x0\\KARfPPkwg+UBblyGRRGk2oW3zuqr8vdAyE\\avgKrw4ndiYKH0dJ5miXhukkaTR/mie+743dN7Uq\\iUYRNkjDfr9\\Mfhw6blj1m3NqIQIdk26oUEziL9LP1f+j9AMr7AS\\:1766894313338',
        'https': 'true',
        'type': '',
        'width': '',
        'sizeType': 'undefined',
        'version': '2.28.5',
        'dpr': '2',
        'dev': '1',
        'cb': 'wYtyI13DSEmWnKWwWrNNFIiJzGWlDf2uQOvb6G5m0+R6C+2va50ebOBNfzZygjwH5z/IQUs320FCL.MWyoKmoHmYoMY7',
        'ipv6': 'false',
        'runEnv': '10',
        'group': '',
        'scene': '',
        'sdkVersion': '',
        'loadVersion': '2.5.3',
        'iv': '4',
        'user': '',
        'irToken': 'c4qCKLSQ6nxFJkAVUBKWynwfEP32P2mh',
        'smsVersion': 'v3',
        'callback': '__JSONP_gzcg3lk_0',
    }

    response = requests.get('https://c.dun.163.com/api/v3/get', params=params, headers=headers)


cookies = {
    '__snaker__id': 'nKBrbNcLwtCvrSR3',
    'xxzlxxid': 'pfmxAd5pZDj7NsYYo7ApFWE0cfvcZ/pfiX0ShV9+UwaHp0M6FfhEi+pq3qFEpXgloPwt',
    'gdxidpyhxdE': 'MQV0%2FHtxL%2B%5CEM3QviCaUX2xf9hWxlg%2FXlVNk1PzD7oNQGuSrSZcEH3uBRzEq%2FHOw6AnreNaDvTH07OJBIPITyKQ7oW82Ou4gmgc4lwqdV5A0pCdh4lXZcQgmG6p2okdTOhloRG%5Cz1SEPODEgBCupti1u%2Fu9wthIDHLIKG5GBy%2F0gq2Yf%3A1766840075134',
}
headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Pragma': 'no-cache',
    'Referer': 'https://callback.58.com/',
    'Sec-Fetch-Dest': 'script',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'cross-site',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}

params = {
    'referer': 'https://callback.58.com/antibot/verifycode',
    'zoneId': 'CN31',
    'dt': 'SyKrFiQAgcFFQhAAEBbS2Mf943fHLsNv',  # localStorage ujg3ps2znyw 值
    'id': '713d69f50c9c4b73b9fc53306b4cb940', # captchaId
    'version': '2.28.5',
    'cb': 'yyUgraovtAjfJdXu0LxLYcLFx1+KG9qomyiC4O6csMRIAN.la9j9+RIq9PvidruoQnO.ldvvecHSHpD/zOn2vNyLris7',
    'user': '',
    'extraData': '',
    'bf': '0',
    'runEnv': '10',
    'sdkVersion': 'undefined',
    'loadVersion': '2.5.3',
    'iv': '4',
    'token': 'dc7e00a44fb345b4a78d9d0dcbc9403a',
    'type': '5',
    'width': '240',
    'data': '{"d":"","m":"u0CehpONYkFKadNe3uGtDaqx.GeNHzqA2C+xaAtyRB8W5ipSNpKsOskS6A6Jyakj/ITcpI1r/apLoLP3U3XEJB5+x2s7","p":"SaGAz8qHN9PqFhsNDu.Fu4Qb4U6gzOa.Z6gh1dwLQ3O8+cPjimbpFbbIL8lqPdCES52QUgWO+ikN/lcJkRZSjCy/DBq7","ext":"TKnWwopn1VdV2qH8ddDoP4JVuSIZfWlV1s/D884A6CHUIVRob5VWXSpEUeySrsSEuGEl5u4GEye1aVbTGJ6KnCYJWas7"}',
    'callback': '__JSONP_0zyuesz_1',
}

response = requests.get('https://c.dun.163.com/api/v3/check', params=params, headers=headers)
print(response.text)

