import requests

cookies = {
    '_csrf_token': '1730278663314',
    '_user_vitals_session_data_': '{"user_line_track":true,"ul_session_id":"hyskg3gphs7","last_page_id":"shuangditiyu.1688.com%2Fp3vhn14ipth"}',
    'cna': '1TVDH32CKx8CAW+tytNNZEdK',
    'leftMenuLastMode': 'EXPEND',
    'mtop_partitioned_detect': '1',
    '_m_h5_tk': 'a6b4aa92a66fadb952b305cc55f59dd3_1730286944543',
    '_m_h5_tk_enc': '0ab522b0d0b8f14a65ba63c603e81b0a',
    'xlly_s': '1',
    'leftMenuModeTip': 'shown',
    'cookie2': '1dd7e672244fe8ff47322a4f57bf4cf7',
    't': 'd0f69a8dcf10521cb46f2d1e7f6049fc',
    '_tb_token_': '3343eeee81556',
    '__cn_logon__': 'false',
    'tfstk': 'fBDmeSTeYjPfJYCuqQyXs_lzQgOJhiw_XVBTWRUwazz5HVEvGfbiRqXtDsExZ8r30NPwl-Hircgikje2lVciAVDABjnOsV4ouOFxIc6gbcu6cPKXwmibCR8pJVvKcm1PRYtvyR-Z4WemJGpppmiVDo-K4pHYEsuguPyag55r4zZG7PuagzyzPlZNulW2q3q_zl7aglzP4kZ13tuaQ3mzPllr2nzxQYkyl9viTGo5Hxr0iPXTrO4IU9F08mzlQekum9aE0zXNQrFDfYmoDEXI2-MK-k3vUt0nbDGaZAby-PMo4xlZVZYaVfuYUreegg2xhmlU_v81_22mSWk4ZGWEcmzgEukeX6a-Er3Zn7-dK5erpWyqwQTY6-qn7xgcjOuE2DHbNAYhzPGYA8riCH5gS5SPa_5Uq06_4hHP11N4Vu4L2F5y5A95FS-kq6P_guZbJ3xl11N4Vu4pq3fE5Sr7cyC..',
    'isg': 'BEJCMPEskTzd5Yz9-x7aMgNpk0ikE0Yte4nBAYxbiLVg3-JZdKGmPfJZi9ujj77F',
}

def get_m_h5_tk(params,headers):
    response = requests.get('https://h5api.m.1688.com/h5/mtop.alibaba.alisite.cbu.server.pc.moduleasyncservice/1.0/', params=params,  headers=headers)
    print(response.text)
    set_cookies = response.headers.get('Set-Cookie')
    if set_cookies:
        print("Set-Cookie:")
        for cookie in set_cookies.split(','):
            print(cookie)
            if '_m_h5_tk' in cookie:
                name, value = cookie.split('=',1)
                print(f"{name.strip()}: {value.strip()}")
                return value.strip()
    else:
        print("No Set-Cookie header found.")

# get_m_h5_tk()