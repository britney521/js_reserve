let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/3.js", "utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});


// 还原字符串编码
traverse(ast, {
    "StringLiteral": function (path) {
        if (path.node.extra && !path.node.extra.raw.includes(path.node.value)) {
            // delete path.node.extra.raw
            path.node.extra.raw = "'" + path.node.value + "'"
            // path.node.extra = void 0
        }
    }
})

// 3. 替换 Unicode 变量名为 var_1, var_2, ...
// let varCounter = 1;
// const varMap = new Map(); // 存储变量名映射关系
//
// traverse(ast, {
//     Identifier(path) {
//         const node = path.node;
//         // 如果变量名包含非 ASCII 字符（如 Unicode 符号）
//         if (/[^\x00-\x7F]/.test(node.name)) {
//             // 如果变量名已经映射过，直接使用之前的名称
//             if (varMap.has(node.name)) {
//                 node.name = varMap.get(node.name);
//             } else {
//                 // 否则分配一个新名称（如 var_1, var_2, ...）
//                 const newName = `var_${varCounter++}`;
//                 varMap.set(node.name, newName);
//                 node.name = newName;
//             }
//         }
//     }
// });
//



// // 分阶段处理表达式
// function simplifyExpressions(ast) {
//     // 第一阶段：计算所有可以计算的子表达式
//     traverse(ast, {
//         BinaryExpression: {
//             exit: function(path) {
//                 try {
//                     const {confident, value} = path.evaluate();
//                     if (confident && (typeof value === 'number' || typeof value === 'string')) {
//                         if (typeof value === 'number') {
//                             path.replaceWith(types.numericLiteral(value));
//                         } else {
//                             path.replaceWith(types.stringLiteral(value));
//                         }
//                     }
//                 } catch (e) {
//                     // 忽略计算错误
//                 }
//             }
//         }
//     });
//
//     // 第二阶段：处理特殊情况
//     traverse(ast, {
//         BinaryExpression: {
//             exit: function(path) {
//                 const {left, right, operator} = path.node;
//
//                 // 处理 0 + x 或 x + 0
//                 if (operator === '+' &&
//                     types.isNumericLiteral(left) && left.value === 0) {
//                     path.replaceWith(right);
//                     return;
//                 }
//                 if (operator === '+' &&
//                     types.isNumericLiteral(right) && right.value === 0) {
//                     path.replaceWith(left);
//                     return;
//                 }
//
//                 // 处理 1 * x 或 x * 1
//                 if (operator === '*' &&
//                     types.isNumericLiteral(left) && left.value === 1) {
//                     path.replaceWith(right);
//                     return;
//                 }
//                 if (operator === '*' &&
//                     types.isNumericLiteral(right) && right.value === 1) {
//                     path.replaceWith(left);
//                     return;
//                 }
//
//                 // 处理 x * 0 或 0 * x
//                 if (operator === '*' &&
//                     (types.isNumericLiteral(left) && left.value === 0 ||
//                      types.isNumericLiteral(right) && right.value === 0)) {
//                     path.replaceWith(types.numericLiteral(0));
//                     return;
//                 }
//             }
//         }
//     });
// }
// const vm = require('vm'); // 使用 Node.js 的 vm 模块来执行函数
// // 执行表达式简化
// simplifyExpressions(ast);





let output = generate(ast).code

fs.writeFileSync("output/3.js", output)