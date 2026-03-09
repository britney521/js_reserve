import execjs

name = execjs.get().name  # 获取JS的运行时名称，写代码时可不写
ctx = execjs.compile("""
       function add(x, y) {
               return x + y;
          }
""")  # 获取代码编译完成后的对象
print(ctx.call("add", 1, 2))
print(ctx.eval("add({}, {})".format(1,2)))
print(ctx.eval('add("{0}", "{1}")').format("1", "2"))



