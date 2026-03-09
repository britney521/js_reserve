let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/14.js","utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});


// 第一步看变量 a 放入内存
memory = {};
traverse(ast, {
    "VariableDeclarator": function (path) {
        if(["z"].indexOf(path.get("id").node.name) !== -1){   // 或者 path.get("id.name").node === "a"
            if(path.get("init").type === "ObjectExpression"){
                eval(path.toString())
                memory[path.get("id").node.name] = path
            }
        }
    }
})

//第二步 还原对象a 里面容易还原部分，即字符串  例如z['QxnwF']
traverse(ast, {
    "MemberExpression": function (path) {
        if(path.get('property').type === 'StringLiteral' && ["z"].indexOf(path.get("object.name").node) !== -1 ){
            let res = eval(path.toString())
            if(typeof res === 'string'){
                path.replaceInline({type:'StringLiteral',value:res})
            }
        }
    }
})

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

// 二次加餐 还原 debu + gger  1 +2

traverse(ast, {
    BinaryExpression: {exit:
    function (path){
        let left = path.get("left").node.value
        let right = path.get("right").node.value
        if(path.get("left").isStringLiteral() && path.get("right").isStringLiteral()){
            path.replaceInline(types.valueToNode(left + right))
        }
        if(path.get("left").isNumericLiteral && path.get("right").isNumericLiteral()){
            console.log(path.toString())
            let {confident,value} = path.evaluate()
            path.replaceInline({type:"NumericLiteral",value:value})
        }
    }}
})


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

traverse(ast, {
    "BinaryExpression": {
        exit(path) {
            console.log(path.toString())
            let {confident,value} = path.evaluate()
            path.replaceInline({type:"NumericLiteral",value:value})
            console.log(confident,value)
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


let output = generate(ast).code
// console.log(output)
fs.writeFileSync("output/output14.js",output)