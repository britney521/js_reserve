let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("19.js", "utf-8")
let ast = parse(js_code)


function isLetter(str) {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(str);
}


// 还原字符串编码
traverse(ast, {
    "StringLiteral": function (path) {
        if (path.node.extra) {
            // delete path.node.extra.raw
            path.node.extra.raw = "'" + path.node.value + "'"
            // path.node.extra = void 0
        }
    }
})
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

let output = generate(ast).code
// console.log(output)
fs.writeFileSync("output19.js", output)