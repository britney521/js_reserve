call = function (k) {
  I['send'](X(k["toString"]() + "|python-spider.com|yuanrenxue.com|\u5927\u5A01\u5929\u9F99\uFF0C\u5927\u7F57\u6CD5\u5492")), $("#page")["paging"]({
    'nowPage': k,
    'pageNum': 0x64,
    'buttonNum': 0x7,
    'canJump': 0x1,
    'showOne': 0x1,
    'callback': function (n) {
      call(n);
    }
  });
};