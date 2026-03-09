let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/9-9.js","utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});


// 第一步看变量 a 放入内存
memory = {};
// traverse(ast, {
//     "VariableDeclarator": function (path) {
//         if(["a", "b", "e", "f"].indexOf(path.get("id").node.name) !== -1){   // 或者 path.get("id.name").node === "a"
//             if(path.get("init").type === "ObjectExpression"){
//                 eval(path.toString())
//                 memory[path.get("id").node.name] = path
//             }
//         }
//     }
// })

// 第二步 还原对象a 里面容易还原部分，即字符串  例如a['QxnwF']
// traverse(ast, {
//     "MemberExpression": function (path) {
//         if(path.get('property').type === 'StringLiteral' && ["a", "b", "e", "f"].indexOf(path.get("object.name").node) !== -1 ){
//             let res = eval(path.toString())
//             if(typeof res === 'string'){
//                 path.replaceInline({type:'StringLiteral',value:res})
//             }
//         }
//     }
// })

// 第三步还原 控制流
// var b = "4|2|1|6|3|7|5|8|0"["split"]('|');
// var control = []
// traverse(ast, {
//     "SwitchCase": function (path) {
//         // control.push(path.get('consequent.0').toString())
//         control[path.get("test.value").node] = path.get('consequent.0').toString()
//     }
// })
// 将 控制流 平坦化 替换成 while
//
// traverse(ast, {
//     "WhileStatement": function (path) {
//        let new_jscode = ""
//         for(let i in b){
//             new_jscode += control[i]
//         }
//         path.replaceInline(parse(new_jscode))
//     }
// })

// 还原 a[''] b['']
// traverse(ast, {
//     "CallExpression": {
//         exit: function (path) {
//             if(path.get("callee.object").node && ["a", "b", "e", "f"].indexOf(path.get("callee.object").node.name) !== -1){
//                 for (let i of memory[path.get("callee.object").node.name].get("init.properties")){
//                     if (path.get("callee").node && path.get("callee.property").node && i.node.key.value === path.get("callee.property").node.value){
//                          // 操作符
//                         if(i.get("value.body.body.0.argument").type === "BinaryExpression"){
//                             let operator = i.get("value.body.body.0.argument").node.operator
//                             let left = path.get("arguments.0").node
//                             let right = path.get("arguments.1").node
//                             path.replaceInline(types.binaryExpression(operator, left, right))
//                         } else if(i.get("value.body.body.0.argument").type === "CallExpression"){
//                             // console.log(path.toString())
//                             let function_path = path.get("arguments.0").node
//                             let function_arguments = path.node.arguments.slice(1)
//                             path.replaceInline(types.callExpression(function_path, function_arguments))
//                         }
//
//                     }
//                      // 函数
//                 }
//             }
//         }
//     }
// })


// 还原字符串编码
traverse(ast, {
    "StringLiteral": function (path){
        if(path.node.extra && !path.node.extra.raw.includes(path.node.value)){
            // delete path.node.extra.raw
            path.node.extra.raw = "'" + path.node.value + "'"
            // path.node.extra = void 0
        }
    }
})


// 还原 window['']  => window.xx
// traverse(ast, {
//     MemberExpression: function (path){
//         path.node.computed = false
//         path.node.property.type = "Identifier"
//         path.node.property.name = path.node.property.value
//     }
// })


// 二次加餐 还原 debu + gger  1 +2

// traverse(ast, {
//     BinaryExpression: {exit:
//     function (path){
//         let left = path.get("left").node.value
//         let right = path.get("right").node.value
//         if(path.get("left").isStringLiteral() && path.get("right").isStringLiteral()){
//             path.replaceInline(types.valueToNode(left + right))
//         }
//         if(path.get("left").isNumericLiteral && path.get("right").isNumericLiteral()){
//             console.log(path.toString())
//             let {confident,value} = path.evaluate()
//             path.replaceInline({type:"NumericLiteral",value:value})
//         }
//     }}
// })
let output = generate(ast).code
// console.log(output)
fs.writeFileSync("output/output9-9.js",output)