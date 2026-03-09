let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("all.js", "utf-8")
// 解析代码为 AST
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});


window = global;

// 第一步看变量 a 放入内存
memory = {};
traverse(ast, {
    "VariableDeclarator": function (path) {
        if (["z"].indexOf(path.get("id").node.name) !== -1) {   // 或者 path.get("id.name").node === "a"
            if (path.get("init").type === "ObjectExpression") {
                eval(path.toString())
                memory[path.get("id").node.name] = path
            }
        }
    }
})

// 第二步 还原对象a 里面容易还原部分，即字符串  例如z['QxnwF']
traverse(ast, {
    "MemberExpression": function (path) {
        if (path.get('property').type === 'StringLiteral' && ["z"].indexOf(path.get("object.name").node) !== -1) {
            let res = eval(path.toString())
            if (typeof res === 'string') {
                path.replaceInline({type: 'StringLiteral', value: res})
            }
        }
    }
})

//
// //第二步 还原对象a 里面容易还原部分，即字符串  例如z['QxnwF']
// 还原o['']
traverse(ast, {
    "CallExpression": {
        exit: function (path) {
            if (path.get("callee.object").node && ["z"].indexOf(path.get("callee.object").node.name) !== -1) {
                for (let i of memory[path.get("callee.object").node.name].get("init.properties")) {
                    if (path.get("callee").node && path.get("callee.property").node && i.node.key.value === path.get("callee.property").node.value) {
                        // 操作符
                        if (i.get("value.body.body.0.argument").type === "BinaryExpression") {
                            let operator = i.get("value.body.body.0.argument").node.operator
                            let left = path.get("arguments.0").node
                            let right = path.get("arguments.1").node
                            path.replaceInline(types.binaryExpression(operator, left, right))
                        } else if (i.get("value.body.body.0.argument").type === "CallExpression") {
                            // console.log(path.toString())
                            let function_path = path.get("arguments.0").node
                            let function_arguments = path.node.arguments.slice(1)
                            path.replaceInline(types.callExpression(function_path, function_arguments))
                        }

                    }
                    // 函数
                }
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
// 遍历 AST 并处理二元表达式
traverse(ast, {
    BinaryExpression: {
        exit(path) {
            const left = path.get("left").node;
            const right = path.get("right").node;

            // 计算表达式的值
            const {confident, value} = path.evaluate();

            if (confident) {
                // 替换为计算结果
                if (typeof value === 'number') {
                    path.replaceInline(types.numericLiteral(value));
                } else if (typeof value === 'boolean') {
                    path.replaceInline(types.booleanLiteral(value));
                } else if (typeof value === 'string') {
                    path.replaceInline(types.stringLiteral(value));
                } else {
                    console.warn(`Unhandled type: ${typeof value}`);
                }
            }
        }
    }
});

// 二次加餐 还原 debu + gger  1 +2 分阶段处理表达式
function simplifyExpressions(ast) {
    // 第一阶段：计算所有可以计算的子表达式
    traverse(ast, {
        BinaryExpression: {
            exit: function (path) {
                try {
                    const {confident, value} = path.evaluate();
                    if (confident && (typeof value === 'number' || typeof value === 'string')) {
                        console.log('简化:', generate(path.node).code, '->', value);
                        if (typeof value === 'number') {
                            path.replaceWith(types.numericLiteral(value));
                        } else {
                            path.replaceWith(types.stringLiteral(value));
                        }
                    }
                } catch (e) {
                    // 忽略计算错误
                }
            }
        }
    });

    // 第二阶段：处理特殊情况
    traverse(ast, {
        BinaryExpression: {
            exit: function (path) {
                const {left, right, operator} = path.node;

                // 处理 0 + x 或 x + 0
                if (operator === '+' &&
                    types.isNumericLiteral(left) && left.value === 0) {
                    path.replaceWith(right);
                    return;
                }
                if (operator === '+' &&
                    types.isNumericLiteral(right) && right.value === 0) {
                    path.replaceWith(left);
                    return;
                }

                // 处理 1 * x 或 x * 1
                if (operator === '*' &&
                    types.isNumericLiteral(left) && left.value === 1) {
                    path.replaceWith(right);
                    return;
                }
                if (operator === '*' &&
                    types.isNumericLiteral(right) && right.value === 1) {
                    path.replaceWith(left);
                    return;
                }

                // 处理 x * 0 或 0 * x
                if (operator === '*' &&
                    (types.isNumericLiteral(left) && left.value === 0 ||
                        types.isNumericLiteral(right) && right.value === 0)) {
                    path.replaceWith(types.numericLiteral(0));
                    return;
                }
            }
        }
    });
}

// 执行表达式简化
simplifyExpressions(ast);


// 还原字符串编码
traverse(ast, {
  StringLiteral(path) {
    const { node } = path;
    if (node.extra && node.extra.raw !== JSON.stringify(node.value)) {
      // 保留原始引号风格
      const quote = node.extra.raw[0]; // ' 或 "
      node.extra.raw = quote + node.value + quote;
    }
  }
});

// 遍历 AST 并还原字符串编码，但排除 other RegExp() 中的字符串
traverse(ast, {
    StringLiteral(path) {
        // 检查当前字符串是否是 other RegExp 的参数
        const isRegExpArg = path.findParent((parentPath) => {
            return (
                types.isNewExpression(parentPath) &&
                types.isIdentifier(parentPath.node.callee, {name: 'RegExp'}) &&
                parentPath.node.arguments.includes(path.node)
            );
        });

        // 如果不是 other RegExp 的参数，则还原字符串编码
        if (!isRegExpArg) {
            if (path.node.extra) {
                path.node.extra.raw = "'" + path.node.value + "'";
            }
        }
    }
});


// 还原 十六进制
traverse(ast, {
        NumbericLiteral({node}) {
            if (node.extra && /^0[obx]/i.test(node.extra.raw)) {
                node.extra = undefined;
            }
        },
        StringLiteral({node}) {
            if (node.extra && /\\[ux]/gi.test(node.extra.raw)) {
                node.extra = undefined;
            }
        }

    }
)

//  字符串相加
const constantFold = {
    "BinaryExpression|UnaryExpression"(path) {
        if (path.isUnaryExpression({operator: "_"}) || path.isUnaryExpression({operator: "void"})){
            return;
        }
        const {confident, value} = path.evaluate();
        if (!confident) return;
        if (typeof value == 'number' && (!Number.isFinite(value))) {
            return;
            path.replaceWith(types.valueToNode(value));
        }
    }
}


traverse(ast, constantFold);

// 逗号表达式

const resolveSequence = {
    SequenceExpression(path) {
        let { scope, parentPath, node } = path;
        let expressions = node.expressions;

        // 处理ReturnStatement中的逗号表达式
        if (parentPath.isReturnStatement({ "argument": node })) {
            let lastExpression = expressions.pop();
            for (let expression of expressions) {
                parentPath.insertBefore(types.expressionStatement(expression));
            }
            path.replaceInline(lastExpression);
        }
        // 处理ExpressionStatement中的逗号表达式
        else if (parentPath.isExpressionStatement({ "expression": node })) {
            let body = [];
            expressions.forEach(express => {
                body.push(types.expressionStatement(express));
            });
            path.replaceWithMultiple(body);
        }
        // 其他情况不处理
        else {
            return;
        }
        scope.crawl();
    }
};
traverse(ast, resolveSequence);

// 遍历 AST，找到所有的二元表达式并计算它们的值
// traverse(ast, {
//     BinaryExpression: {
//         exit: function (path) {
//
//             // 检查左右操作数是否都是数字字面量或一元表达式
//             if (
//                 isSimpleNumericExpression(path.node.left) &&
//                 isSimpleNumericExpression(path.node.right)
//             ) {
//                 console.log(path.toString())
//                 // 计算表达式的值
//                 let result = evaluateExpression(path.node);
//                 // 替换表达式为计算结果
//                 path.replaceWith(types.numericLiteral(result));
//             }
//         }
//     }
// })
// ;


// 还原 window['']  => window.xx
// traverse(ast, {
//     MemberExpression: function (path){
//         path.node.computed = false
//         path.node.property.type = "Identifier"
//         path.node.property.name = path.node.property.value
//     }
// })

// 删除未使用变量
traverse(ast, {
    BreakStatement(path) {
        path.remove();
    },
    EmptyStatement(path) {
        path.remove();
    },
    ExpressionStatement(path) {
        if (path.node.expression?.name === 'undefined') {
            path.remove();
        }
    }
});

// 在当前作用域未使用删除
traverse(ast, {
    Program: {
        exit(path) {
            // 现在整个 AST 的作用域树已经完整
            path.traverse({
                VariableDeclarator(innerPath) {
                    const name = innerPath.node.id.name;
                    const binding = innerPath.scope.getBinding(name);

                    if (!binding || binding.referenced === false) {
                        console.log('删除:', innerPath.toString(), binding);
                        innerPath.remove();

                        if (innerPath.parent.declarations.length === 0) {
                            innerPath.parentPath.remove();
                        }
                    }

                    if (binding.constant) { // 没有被改变
                        path.remove()
                    }
                    if (binging.constantViolations.length == 1 && binding.constantViolations[0] == path) {
                        path.remove()
                    }
                }
            });
        }
    }
});

traverse(ast, {
    VariableDeclaration(path) {
        if (path.node.declarations.length === 0) {
            path.remove();
        }
    }
});

traverse(ast, {
  VariableDeclarator(path) {
    const binding = path.scope.getBinding(path.node.id.name);
    if (binding && !binding.referenced) {
      path.remove();
    }
  },
  FunctionDeclaration(path) {
    const binding = path.scope.getBinding(path.node.id.name);
    if (binding && !binding.referenced) {
      path.remove();
    }
  },
  VariableDeclaration(path) {
    if (path.node.declarations.length === 0) {
      path.remove();
    }
  }
});

const decodeObject =
{
    VariableDeclarator(path) {
        let { node, scope } = path;
        const { id, init } = node;
        if (!types.isObjectExpression(init)) return;

        let properties = init.properties;
        if (properties.length == 0 || !properties.every(property => isBaseLiteral(property.value)))
            return;

        let binding = scope.getBinding(id.name);

        let { constant, referencePaths } = binding;
        if (!constant) return;

        let newMap = new Map();
        for (const property of properties) {
            let { key, value } = property;
            newMap.set(key.value, value);
        }

        let canBeRemoved = true;
        for (const referPath of referencePaths) {
            let { parentPath } = referPath;
            if (!parentPath.isMemberExpression()) {
                canBeRemoved = false;
                return;
            }

            let AncestorPath = parentPath.parentPath;

            if (AncestorPath.isAssignmentExpression({"left":parentPath.node}))
            {
            	  canBeRemoved = false;
                return;
            }
            if (AncestorPath.isUpdateExpression() && ['++','--'].includes(AncestorPath.node.operator))
            {
            	  canBeRemoved = false;
                return;
            }

            let curKey = parentPath.node.property.value;
            if (!newMap.has(curKey)) {
                canBeRemoved = false;
                break;
            }
            parentPath.replaceWith(newMap.get(curKey));
        }
        canBeRemoved && path.remove();
        newMap.clear();
    },
}

// 辅助函数：将表达式转换为语句
function expressionToStatement(expr) {
    if (t.isConditionalExpression(expr)) {
        // 递归转换三元表达式为 If-Else
        return t.ifStatement(
            expr.test,
            t.blockStatement([expressionToStatement(expr.consequent)]),
            t.blockStatement([expressionToStatement(expr.alternate)])
        );
    } else if (t.isSequenceExpression(expr)) {
        // 处理逗号表达式 (a, b, c) -> { a; b; c; }
        return t.blockStatement(
            expr.expressions.map(e => expressionToStatement(e))
        );
    } else {
        // 普通表达式直接包裹为语句
        return t.expressionStatement(expr);
    }
}

// 3. AST 遍历与转换
traverse(ast, {
    // 1. 还原 Unicode 和 Hex (例如 \u006c -> l)
    'StringLiteral|NumericLiteral'(path) {
        if (path.node.extra) {
            delete path.node.extra;
        }
    },

    // 2. 还原属性访问 (obj['prop'] -> obj.prop)
    MemberExpression(path) {
        if (
            path.node.computed &&
            t.isStringLiteral(path.node.property)
        ) {
            const propName = path.node.property.value;
            // 确保属性名是合法的标识符
            if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(propName)) {
                path.node.computed = false;
                path.node.property = t.identifier(propName);
            }
        }
    },

    // 3. 拆分逗号表达式 (a, b, c)
    ExpressionStatement(path) {
        if (t.isSequenceExpression(path.node.expression)) {
            const expressions = path.node.expression.expressions;
            path.replaceWithMultiple(
                expressions.map(expr => t.expressionStatement(expr))
            );
        }
    },

    // 4. 核心：展开控制流平坦化的三元表达式
    // 仅处理位于语句位置的三元表达式
    ExpressionStatement(path) {
        if (t.isConditionalExpression(path.node.expression)) {
            const statement = expressionToStatement(path.node.expression);
            path.replaceWith(statement);
        }
    }
});

let output = generate(ast).code
// console.log(output)
fs.writeFileSync("outputall14.js", output)