let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');
const vm = require('vm'); // 使用 Node.js 的 vm 模块来执行函数

let js_code = fs.readFileSync("input/123.js", "utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});

// 第一步：找到 var_1 函数的定义并提取函数体
let var1FunctionCode = null;
traverse(ast, {
    VariableDeclarator(path) {
        if (path.node.id.name === 'var_1' && types.isFunctionExpression(path.node.init)) {
            // 生成函数的代码字符串
            var1FunctionCode = generate(path.node.init).code;
            path.stop();
        }
    },
    FunctionDeclaration(path) {
        if (path.node.id.name === 'var_1') {
            var1FunctionCode = generate(path.node).code;
            path.stop();
        }
    }
});

// 第二步：在沙箱环境中创建并执行函数
let var1Function = null;
if (var1FunctionCode) {
    try {
        const sandbox = {
            atob:atob
        };
        vm.createContext(sandbox);
        // 执行函数定义代码
        vm.runInContext(var1FunctionCode, sandbox);
        var1Function = sandbox.var_1 || (sandbox.var_1 = sandbox.var_1);
    } catch (e) {
        console.error('执行函数失败:', e);
    }
}

// 第三步：遍历所有调用并替换结果
if (var1Function && typeof var1Function === 'function') {
    traverse(ast, {
        CallExpression(path) {
            const callee = path.node.callee;
            if (types.isIdentifier(callee, { name: 'var_1' }) &&
                path.node.arguments.length === 2) {

                const arg1 = path.node.arguments[0];
                const arg2 = path.node.arguments[1];

                // 只有当两个参数都是字符串字面量时才进行替换
                if (types.isStringLiteral(arg1) && types.isStringLiteral(arg2)) {
                    try {
                        // 直接调用函数获取结果
                        const result = var1Function(arg1.value, arg2.value);

                        // 根据返回值的类型创建对应的 AST 节点
                        if (typeof result === 'string') {
                            path.replaceWith(types.stringLiteral(result));
                        } else if (typeof result === 'number') {
                            path.replaceWith(types.numericLiteral(result));
                        } else if (typeof result === 'boolean') {
                            path.replaceWith(types.booleanLiteral(result));
                        } else {
                            // 其他类型保持原样
                            console.log('未知返回类型:', typeof result, result);
                        }
                    } catch (e) {
                        console.error('函数调用失败:', e);
                    }
                }
            }
        }
    });
}

// 处理 MemberExpression 中的特殊字符属性
traverse(ast, {
    SequenceExpression(path) {
        const expressionsPath = path.get('expressions');

        if (!Array.isArray(expressionsPath)) {
            return;
        }

        // 反向遍历以便安全删除
        for (let i = expressionsPath.length - 1; i >= 0; i--) {
            const exprPath = expressionsPath[i];
            if (exprPath.isStringLiteral() && exprPath.node.value === " " || exprPath.node.value === " ") {
                console.log('删除特殊字符表达式');
                exprPath.remove(); // 安全删除
            }
        }

        // 检查删除后的结果
        const remainingExpressions = path.get('expressions');
        if (remainingExpressions.length === 0) {
            path.replaceWith(types.identifier('undefined'));
        } else if (remainingExpressions.length === 1) {
            path.replaceWith(remainingExpressions[0].node);
        }
    }
});


let output = generate(ast).code;
fs.writeFileSync("output/123.js", output);