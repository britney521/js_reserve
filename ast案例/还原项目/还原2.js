let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/2.js", "utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});





// 3. 替换 Unicode 变量名为 var_1, var_2, ...
let varCounter = 1;
const varMap = new Map(); // 存储变量名映射关系

traverse(ast, {
    Identifier(path) {
        const node = path.node;
        // 如果变量名包含非 ASCII 字符（如 Unicode 符号）
        if (/[^\x00-\x7F]/.test(node.name)) {
            // 如果变量名已经映射过，直接使用之前的名称
            if (varMap.has(node.name)) {
                node.name = varMap.get(node.name);
            } else {
                // 否则分配一个新名称（如 var_1, var_2, ...）
                const newName = `var_${varCounter++}`;
                varMap.set(node.name, newName);
                node.name = newName;
            }
        }
    }
});

// 分阶段处理表达式
function simplifyExpressions(ast) {
    // 第一阶段：计算所有可以计算的子表达式
    traverse(ast, {
        BinaryExpression: {
            exit: function(path) {
                try {
                    const {confident, value} = path.evaluate();
                    if (confident && (typeof value === 'number' || typeof value === 'string')) {
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
            exit: function(path) {
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
const vm = require('vm'); // 使用 Node.js 的 vm 模块来执行函数
// 执行表达式简化
simplifyExpressions(ast);


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

// 3. 遍历 AST，修改 switch 结构
traverse(ast, {
    ForStatement(path) {
        // 检查for循环体是否直接包含switch语句
        const body = path.node.body;

        // 如果for循环体是块语句，检查其第一个语句是否是switch
        if (types.isBlockStatement(body) && body.body.length > 0) {
            const firstStatement = body.body[0];

            if (types.isSwitchStatement(firstStatement)) {
                // 找到目标for循环，开始处理
                const switchPath = path.get('body.body.0');

                // 1. 收集所有信息
                const loopInfo = {
                    stateVar: null,   // 状态变量
                    initialState: null,  // 初始值
                    transitions: {},  // 状态转换
                    cases: {},  // case分支
                    variables: {},
                    returnValue: null
                };

                // 获取状态变量（switch的判别式）
                if (types.isIdentifier(switchPath.node.discriminant)) {
                    loopInfo.stateVar = switchPath.node.discriminant.name;

                    // 收集所有case块
                    switchPath.node.cases.forEach(caseNode => {
                        if (caseNode.test) {
                            loopInfo.cases[caseNode.test.value] = caseNode.consequent;
                        }
                    });
                }

                // 收集for循环内部的变量声明
                path.traverse({
                    VariableDeclarator(varPath) {
                        const name = varPath.node.id.name;
                        if (types.isLiteral(varPath.node.init)) {
                            loopInfo.variables[name] = varPath.node.init.value;
                        } else if (types.isUnaryExpression(varPath.node.init) &&
                            types.isLiteral(varPath.node.init.argument)) {
                            const value = varPath.node.init.operator === '-'
                                ? -varPath.node.init.argument.value
                                : varPath.node.init.argument.value;
                            loopInfo.variables[name] = value;
                        } else if (types.isIdentifier(varPath.node.init)) {
                            // 如果初始化值是另一个变量，尝试从已收集的变量中获取值
                            const refName = varPath.node.init.name;
                            if (loopInfo.variables[refName] !== undefined) {
                                loopInfo.variables[name] = loopInfo.variables[refName];
                            }
                        }
                    }
                });

                // 查找初始状态（在for循环同级的变量声明中）
                const parentBlock = path.findParent(p => p.isBlockStatement());
                if (parentBlock) {
                    const forLoopIndex = parentBlock.node.body.indexOf(path.node);

                    // 遍历for循环之前的所有同级节点
                    for (let i = 0; i < forLoopIndex; i++) {
                        const sibling = parentBlock.node.body[i];

                        if (types.isVariableDeclaration(sibling)) {
                            sibling.declarations.forEach(decl => {
                                if (decl.id.name === loopInfo.stateVar && decl.init) {
                                    if (types.isLiteral(decl.init)) {
                                        loopInfo.initialState = decl.init.value;
                                    } else if (types.isUnaryExpression(decl.init) &&
                                        types.isLiteral(decl.init.argument)) {
                                        loopInfo.initialState = decl.init.operator === '-'
                                            ? -decl.init.argument.value
                                            : decl.init.argument.value;
                                    } else if (types.isIdentifier(decl.init)) {
                                        // 如果初始值是另一个变量，尝试从已收集的变量中获取
                                        const refName = decl.init.name;
                                        if (loopInfo.variables[refName] !== undefined) {
                                            loopInfo.initialState = loopInfo.variables[refName];
                                        }
                                    }
                                }
                            });
                        }
                    }
                }

                console.log("Found target for-loop with switch:");
                console.log("State variable:", loopInfo.stateVar);
                console.log("Initial state:", loopInfo.initialState);
                console.log("Cases:", Object.keys(loopInfo.cases));
                console.log("Variables:", loopInfo.variables);

                // 2. 分析状态流转
                function analyzeTransitions() {
                    for (const [caseValue, consequent] of Object.entries(loopInfo.cases)) {
                        consequent.forEach(stmt => {
                            if (types.isBlockStatement(stmt)) {
                                stmt.body.forEach(blockStmt => {
                                    checkAssignment(blockStmt, parseInt(caseValue));
                                });
                            } else {
                                checkAssignment(stmt, parseInt(caseValue));
                            }
                        });
                    }

                    function checkAssignment(stmt, caseValue) {
                        if (types.isExpressionStatement(stmt) &&
                            types.isAssignmentExpression(stmt.expression) &&
                            types.isIdentifier(stmt.expression.left, {name: loopInfo.stateVar})
                        ) {
                            const expr = stmt.expression;
                            let rightValue;

                            if (types.isNumericLiteral(expr.right)) {
                                rightValue = expr.right.value;
                            } else if (types.isUnaryExpression(expr.right)) {
                                if (types.isNumericLiteral(expr.right.argument)) {
                                    rightValue = expr.right.operator === "-"
                                        ? -expr.right.argument.value
                                        : +expr.right.argument.value;
                                }
                            } else if (types.isConditionalExpression(expr.right)) {
                                // 处理条件表达式
                                const test = expr.right.test;
                                const consequent = expr.right.consequent;
                                const alternate = expr.right.alternate;

                                if (types.isIdentifier(test) && loopInfo.variables[test.name] !== undefined) {
                                    const testValue = loopInfo.variables[test.name];
                                    // 处理 consequent 分支的值
                                    let consequentValue;
                                    if (types.isNumericLiteral(consequent)) {
                                        consequentValue = consequent.value;
                                    } else if (types.isUnaryExpression(consequent) &&
                                        types.isNumericLiteral(consequent.argument)) {
                                        consequentValue = consequent.operator === "-"
                                            ? -consequent.argument.value
                                            : consequent.argument.value;
                                    }

                                    // 处理 alternate 分支的值
                                    let alternateValue;
                                    if (types.isNumericLiteral(alternate)) {
                                        alternateValue = alternate.value;
                                    } else if (types.isUnaryExpression(alternate) &&
                                        types.isNumericLiteral(alternate.argument)) {
                                        alternateValue = alternate.operator === "-"
                                            ? -alternate.argument.value
                                            : alternate.argument.value;
                                    }

                                    // 根据测试条件选择正确的值
                                    if (consequentValue !== undefined && alternateValue !== undefined) {
                                        rightValue = testValue ? consequentValue : alternateValue;
                                    }
                                }
                            }

                            if (rightValue !== undefined) {
                                let newState;
                                if (expr.operator === "+=") {
                                    newState = caseValue + rightValue;
                                } else if (expr.operator === "-=") {
                                    newState = caseValue - rightValue;
                                } else if (expr.operator === "=") {
                                    newState = rightValue;
                                }

                                if (newState !== undefined) {
                                    loopInfo.transitions[caseValue] = newState;
                                }
                            }
                        }
                    }
                }

                analyzeTransitions();

                console.log("Transitions:", loopInfo.transitions);

                // 3. 模拟执行并收集执行顺序
                const executionOrder = [];
                let currentState = loopInfo.initialState;
                const visitedStates = new Set();

                while (currentState !== undefined && !visitedStates.has(currentState)) {
                    visitedStates.add(currentState);
                    executionOrder.push(currentState);
                    currentState = loopInfo.transitions[currentState];
                }

                console.log("Execution order:", executionOrder);

                // 4. 按执行顺序重建代码
                if (executionOrder.length > 0) {
                    const newBody = [];

                    // 按顺序添加case块代码
                    executionOrder.forEach(state => {
                        if (loopInfo.cases[state]) {
                            loopInfo.cases[state].forEach(consequent => {
                                if (types.isBlockStatement(consequent)) {
                                    consequent.body.forEach(stmt => {
                                        // 跳过状态变量赋值语句
                                        if (!(types.isExpressionStatement(stmt) &&
                                            types.isAssignmentExpression(stmt.expression) &&
                                            types.isIdentifier(stmt.expression.left, {name: loopInfo.stateVar}))) {
                                            newBody.push(stmt);
                                        }
                                    });
                                } else {
                                    // 跳过状态变量赋值语句
                                    if (!(types.isExpressionStatement(consequent) &&
                                        types.isAssignmentExpression(consequent.expression) &&
                                        types.isIdentifier(consequent.expression.left, {name: loopInfo.stateVar}))) {
                                        newBody.push(consequent);
                                    }
                                }
                            });
                        }
                    });

                    // 替换for循环为顺序执行的代码
                    path.replaceWithMultiple(newBody);
                }
            }
        }
    }
});



traverse(ast, {
  BreakStatement(path) { path.remove(); },
  EmptyStatement(path) { path.remove(); },
  ExpressionStatement(path) {
    if (path.node.expression?.name === 'undefined') {
      path.remove();
    }
  }
});

/* ---------- 2. 基于作用域删除未引用的变量/函数/import ---------- */
// traverse(ast, {
//   Program: {
//     exit(path) {
//       // 现在整个 AST 的作用域树已经完整
//       path.traverse({
//         VariableDeclarator(innerPath) {
//           const name = innerPath.node.id.name;
//           const binding = innerPath.scope.getBinding(name);
//
//           if (!binding || binding.referenced === false) {
//             console.log('删除:', innerPath.toString());
//             innerPath.remove();
//
//             if (innerPath.parent.declarations.length === 0) {
//               innerPath.parentPath.remove();
//             }
//           }
//         }
//       });
//     }
//   }
// });
/* ---------- 3. 最后再扫一遍空 VariableDeclaration ---------- */
traverse(ast, {
  VariableDeclaration(path) {
    if (path.node.declarations.length === 0) {
      path.remove();
    }
  }
});



let output = generate(ast).code

fs.writeFileSync("output/2.2.js", output)