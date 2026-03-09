document = {

}

document.cookie = 'HWWAFSESID=b37f5181b20a4a636cd; HWWAFSESTIME=1753944932969; csrfToken=gSV3T8hOr_sMWR95qSpjL_x9; CUID=3b1aeadad6f024a5847766ab75db7785; jsid=SEO-BAIDU-ALL-SY-000001; TYCID=5ccbc9506ddb11f0b23e394b70bc8fcc; sajssdk_2015_cross_new_user=1; bdHomeCount=0; bannerFlag=true; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1753277027,1753944938; HMACCOUNT=7FA70CA4A968649E; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22308462737%22%2C%22first_id%22%3A%221985f43d55816e5-06e41e0f4f92ff8-17525637-2073600-1985f43d5593365%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Flink%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTk4NWY0M2Q1NTgxNmU1LTA2ZTQxZTBmNGY5MmZmOC0xNzUyNTYzNy0yMDczNjAwLTE5ODVmNDNkNTU5MzM2NSIsIiRpZGVudGl0eV9sb2dpbl9pZCI6IjMwODQ2MjczNyJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22308462737%22%7D%2C%22%24device_id%22%3A%221985f43d55816e5-06e41e0f4f92ff8-17525637-2073600-1985f43d5593365%22%7D; tyc-user-info=%7B%22state%22%3A%220%22%2C%22vipManager%22%3A%220%22%2C%22mobile%22%3A%2217315231596%22%2C%22userId%22%3A%22308462737%22%7D; tyc-user-info-save-time=1753944990309; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNzMxNTIzMTU5NiIsImlhdCI6MTc1Mzk0NDk5MCwiZXhwIjoxNzU2NTM2OTkwfQ.MSCa4msojCmBNolEP__rtJSAzo6CXwvMuePC2n_7XAPA8DHIr8cS7tEKeo3RZcMxqlGOY5m2XtbCwa9g8fHXoA; searchSessionId=1753944990.23319382; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1753944991'

A = function(e, t, n) {
            return function(n) {
                for (var r = [], i = 1; i < arguments.length; i++)
                    r[i - 1] = arguments[i];
                return !t && (t = this),
                e.apply(t, r)
            }
        }((function() {
            return  function(e) {
                for (var t, n, r = {}, i = /(?:;\s|^)([^;]*?)=([^;]*)/g, o = /([^&]+)=([^&]+)(?:&|$)/g; t = i.exec(e); )
                    for (r[t[1]] = {
                        value: unescape(t[2]),
                        values: null
                    }; n = o.exec(t[2]); )
                        r[t[1]].values = r[t[1]].values || {},
                        r[t[1]].values[n[1]] = unescape(n[2]);
                return r
            }(document.cookie)
        }
        ))

function get_token(e, t) {
            var n = A(t)[e];
            return n && n.value
        };
// e = 'auth_token'
// 'TYCID'
// console.log(get_token('TYCID'))