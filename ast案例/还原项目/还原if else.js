let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/for if else.js", "utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});

//  1.  if 的 else 如果没有继续承接 if，那else 等于 if 判断右边的值
//
//     举例： if (f < 5) {if(f < 4)...} else {...}
//
//     else 里面没有直接承接  else{if(f.....)}, 所以 else 实际上就是 f -----> case 4

// 建立for 的块级别作用域
traverse(ast, {
        ForStatement: function (path) {
            debugger;
            path.node.body = types.blockStatement([path.node.body])
        }
    }
)

// 还原简易的 else

// else {
//             if (f < 3) {
//                 f += 4
//             } else {
//                 console.log(333);
//                 f -= 1
//             }
//         }
traverse(ast, {
    IfStatement: {
       exit: function (path){
           if(path.get("alternate").node && path.get("alternate.body").length && !path.get("alternate.body.0").isIfStatement()){
               let name = path.get("test").node.left.name
               let value = path.get("test").node.right.value
               // if(i === 9){....}
               let consequent = path.get("alternate").node
               let test = types.BinaryExpression("===", types.Identifier(name),  types.valueToNode(value))
               path.scope.getBinding(name).path.parentPath.container[1].body.body.unshift(types.IfStatement(test, consequent))
               path.get("alternate").remove()
           }
       }
    }
})

// 2.  对于  if 里面直接没有承接的情况
//
//     例  if (f < 7) {...} else {...}
//
//     一直找祖宗节点，直到找到 第一次的else 分支的 if，这个 if 判断右边的值 就是 case 的值  实际 f的值
//
// 3.  使用 enter 还是 exit

// 第二步 还原简易的 if
traverse(ast, {
    IfStatement: {
        exit: function (path) {
            if (path.get("consequent").node && path.get("consequent.body").length && !path.get("consequent.body.0").isIfStatement()) {
                if (path.get("test.operator").node === "<") {
                    if (path.get("test.right.value").node === 1) {
                        var value = 0;
                        var name = path.get("test").node.left.name;
                    } else {
                        //   向上找 在 babel里面 有没有对应的API，我不好说
                        let _path = path
                        while (1) {

                            if (_path.parentPath && _path.parentPath.key === "alternate") {
                                var name = _path.parentPath.parentPath.get("test").node.left.name
                                var value = _path.parentPath.parentPath.get("test").node.right.value
                                break
                            }
                            _path = _path.parentPath;
                        }
                    }
                    var test = types.binaryExpression("===", types.Identifier(name), types.valueToNode(value));
                    var consequent = path.get("consequent").node;
                    path.scope.getBinding(name).path.parentPath.container[1].body.body.unshift(types.IfStatement(test, consequent))
                    path.get("consequent").remove()
                }
            }
        }
    }
})

// 清理一下 空代码垃圾代码

traverse(ast, {
    IfStatement: {
        exit: function (path){

            if(path.get("consequent.body") && path.get("consequent.body").length === 0){
                if(!path.get("alternate").node || path.get("alternate.body").length === 0){
                    console.log(path.toString())
                    path.remove()
                }
                //
            }
        }
    }
})

let output = generate(ast).code
// console.log(output)
fs.writeFileSync("output/for if else.js", output)