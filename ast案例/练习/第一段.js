let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
let ast = parse("let a = -0x1* 0x21ea + -0x53b + -0x101 + -0x27")
// console.log(ast)

// console.log(output)

// 整体表达式计算
// traverse(ast, {
//     BinaryExpression: function (path) {
//         if (path.parentPath.type === "VariableDeclarator") {
//             debugger
//             console.log(path.toString())
//             let value = path.evaluate().value
//             path.replaceInline({type: 'NumericLiteral',value:value})
//         }
//
//
//     }
// })

// 最小单元表达式 计算
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
let output = generate(ast).code
console.log(output)