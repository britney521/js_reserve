import requests




import requests

cookies = {
    'appmsglist_action_3881830519': 'card',
    'ua_id': 'OScCF1OgfY29aGgAAAAAAApcQYkiUSA1KG4_25pJj6U=',
    'wxuin': '53798001561140',
    'mm_lang': 'zh_CN',
    'RK': 'hQetsOsfZb',
    'ptcz': '54ba76151d84eb91a774d0772c386b65ccd50986f06bd442bd2112ce462d9359',
    'rewardsn': '',
    'wxtokenkey': '777',
    'uin': 'o786120564',
    '_ga': 'GA1.1.1007850669.1759283690',
    '_ga_PF3XX5J8LE': 'GS2.1.s1759283690$o1$g0$t1759283692$j58$l0$h0',
    'mmad_session': '6b1c5ea73566c93ec326cc7746aac97259d28200e3b651df5b9da91a7a044069c5560df512c4e7cf3dfbaec9b6f5fba6d559640665e98cb53ae1726ecd179211de6a01cbad7e1e258074170e7e08681d8a0874a622195baf0f80717cb0690c6711de1c56c245721266e7088080fefde3',
    'pgv_info': 'ssid=s6817715176',
    'pgv_pvid': '590291630',
    'ts_uid': '3670827444',
    '_ga_S0Y0QJNCMH': 'GS2.1.s1760947020$o1$g0$t1760947020$j60$l0$h0',
    '_gcl_au': '1.1.1930725498.1760947021',
    '_qimei_uuid42': '19a1c110512100fe1c732a9603f4c43efba24969b0',
    '_qimei_fingerprint': '5b81f7f6a22fca2a42b4139497dac6f9',
    '_qimei_i_3': '79ee4ad39d5d57d3c7c6fa3153d022e5a4e9f6f11b5c0780b78b7a097091206e326232973989e2a0d0ab',
    '_qimei_q36': '',
    '_qimei_i_2': '23f264c09d04',
    '_qimei_h38': 'd4d8f5361c732a9603f4c43e0300000d019a1c',
    '_qimei_i_1': '4de84ed6910e588dc494f831088370e2a6e7a2f1110d07d1b08c7d582593206c616363953980b3dd85fce2f8',
    '_qimei_q32': '',
    '_clck': 'xsf8ts|1|g0v|0',
    'uuid': '2ca1e8cca0f0d1d995cdd07e3985985a',
    'rand_info': 'CAESICJUeAM1LgKGzqaSjaa0Uxtcmqr1Z0xnRs7buozmNYQP',
    'slave_bizuin': '3881830519',
    'data_bizuin': '3881830519',
    'bizuin': '3881830519',
    'data_ticket': 'r0msZU6695FWBK/IlwDNsc12JW1QkezrFs93sUD6hE//KkXqgScu7M70xLrWYrf6',
    'slave_sid': 'RWdHQmVPMGR4VTZPanFBR3FMbm9WQmcwN0kzZ3AzaUJ5WFlwZUdtdTdZb0ZtNEFrQm1qUHJPOUxacUxOWnl6bG1WeFFXajBPNTJuaVFfQlViZkU5emVNdFRfXzA5eWM3N3MwOVdRNnhyV09wQVBEWHJOa2NnbjRrNU1IbjRuYWgyeVpDNWN2d2M5c2psd2th',
    'slave_user': 'gh_67766ea540c0',
    'xid': 'e996588e5e2076e4acc85f26a46d704c',
    '_clsk': '1lcmezq|1762687528191|7|1|mp.weixin.qq.com/weheat-agent/payload/record',
}

headers = {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    # 'cookie': 'appmsglist_action_3881830519=card; ua_id=OScCF1OgfY29aGgAAAAAAApcQYkiUSA1KG4_25pJj6U=; wxuin=53798001561140; mm_lang=zh_CN; RK=hQetsOsfZb; ptcz=54ba76151d84eb91a774d0772c386b65ccd50986f06bd442bd2112ce462d9359; rewardsn=; wxtokenkey=777; uin=o786120564; _ga=GA1.1.1007850669.1759283690; _ga_PF3XX5J8LE=GS2.1.s1759283690$o1$g0$t1759283692$j58$l0$h0; mmad_session=6b1c5ea73566c93ec326cc7746aac97259d28200e3b651df5b9da91a7a044069c5560df512c4e7cf3dfbaec9b6f5fba6d559640665e98cb53ae1726ecd179211de6a01cbad7e1e258074170e7e08681d8a0874a622195baf0f80717cb0690c6711de1c56c245721266e7088080fefde3; pgv_info=ssid=s6817715176; pgv_pvid=590291630; ts_uid=3670827444; _ga_S0Y0QJNCMH=GS2.1.s1760947020$o1$g0$t1760947020$j60$l0$h0; _gcl_au=1.1.1930725498.1760947021; _qimei_uuid42=19a1c110512100fe1c732a9603f4c43efba24969b0; _qimei_fingerprint=5b81f7f6a22fca2a42b4139497dac6f9; _qimei_i_3=79ee4ad39d5d57d3c7c6fa3153d022e5a4e9f6f11b5c0780b78b7a097091206e326232973989e2a0d0ab; _qimei_q36=; _qimei_i_2=23f264c09d04; _qimei_h38=d4d8f5361c732a9603f4c43e0300000d019a1c; _qimei_i_1=4de84ed6910e588dc494f831088370e2a6e7a2f1110d07d1b08c7d582593206c616363953980b3dd85fce2f8; _qimei_q32=; _clck=xsf8ts|1|g0v|0; uuid=2ca1e8cca0f0d1d995cdd07e3985985a; rand_info=CAESICJUeAM1LgKGzqaSjaa0Uxtcmqr1Z0xnRs7buozmNYQP; slave_bizuin=3881830519; data_bizuin=3881830519; bizuin=3881830519; data_ticket=r0msZU6695FWBK/IlwDNsc12JW1QkezrFs93sUD6hE//KkXqgScu7M70xLrWYrf6; slave_sid=RWdHQmVPMGR4VTZPanFBR3FMbm9WQmcwN0kzZ3AzaUJ5WFlwZUdtdTdZb0ZtNEFrQm1qUHJPOUxacUxOWnl6bG1WeFFXajBPNTJuaVFfQlViZkU5emVNdFRfXzA5eWM3N3MwOVdRNnhyV09wQVBEWHJOa2NnbjRrNU1IbjRuYWgyeVpDNWN2d2M5c2psd2th; slave_user=gh_67766ea540c0; xid=e996588e5e2076e4acc85f26a46d704c; _clsk=1lcmezq|1762687528191|7|1|mp.weixin.qq.com/weheat-agent/payload/record',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit_v2&action=edit&isNew=1&type=77&token=1260904863&lang=zh_CN&timestamp=1762687527264',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
}



params = {
    'action': 'search_biz',
    'begin': '0',
    'count': '5',
    'query': '孱陵在线',
    'fingerprint': '711f6ba863ae6d78730b75132c88bc99',
    'token': '1260904863',
    'lang': 'zh_CN',
    'f': 'json',
    'ajax': '1',
}

response = requests.get('https://mp.weixin.qq.com/cgi-bin/searchbiz', params=params, cookies=cookies, headers=headers)
print(response.json())
datas = response.json()['list']
fakeid = datas[0]['fakeid']
# for data in datas:
#     nickname = data['nickname']
#     fakeid = data['fakeid']
#     signature = data['signature']
#     print(nickname, fakeid, signature)