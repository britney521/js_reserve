const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
let generate = require("@babel/generator").default;

// 示例代码字符串
const code = `
    const result = 10523 + -0x2919;
`;

// 解析代码为 AST
const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
});

// 遍历 AST
traverse(ast, {
    BinaryExpression(path) {
        const left = path.node.left;
        const right = path.node.right;
        const operator = path.node.operator;

        // 只处理加法操作
        if (operator === '+') {
            if (t.isNumericLiteral(left) && t.isUnaryExpression(right)) {
                // 计算结果
                const rightValue = right.operator === '-' ? -right.argument.value : right.argument.value;
                const result = left.value + rightValue;
                path.replaceWith(t.numericLiteral(result));
            }
        }
    }
});

// 将 AST 转换回代码
const output = generate(ast, {}, code).code;

console.log(output);