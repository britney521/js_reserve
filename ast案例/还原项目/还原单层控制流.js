let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/switch.js", "utf-8");
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});

traverse(ast, {
    FunctionDeclaration(path) {
        // 1. 收集所有信息
        const functionInfo = {
            stateVar: null,   // 声明的变量
            initialState: null,  // 初始值
            transitions: {},  // 跳转
            cases: {},  // 分支
            variables: {},
            returnValue: null
        };

        // 收集变量声明
        path.traverse({
            VariableDeclarator(varPath) {
                const name = varPath.node.id.name;
                if (types.isLiteral(varPath.node.init)) {
                    functionInfo.variables[name] = varPath.node.init.value;
                } else if (types.isUnaryExpression(varPath.node.init) &&
                    types.isLiteral(varPath.node.init.argument)) {
                    const value = varPath.node.init.operator === '-'
                        ? -varPath.node.init.argument.value
                        : varPath.node.init.argument.value;
                    functionInfo.variables[name] = value;
                }
            }
        });

        // 查找状态变量和switch语句
        path.traverse({
            SwitchStatement(switchPath) {
                if (types.isIdentifier(switchPath.node.discriminant)) {
                    functionInfo.stateVar = switchPath.node.discriminant.name;
                    functionInfo.switchNode = switchPath.node;

                    // 收集所有case块
                    switchPath.node.cases.forEach(caseNode => {
                        if (caseNode.test) {
                            functionInfo.cases[caseNode.test.value] = caseNode.consequent;
                        }
                    });
                }
            },
            ReturnStatement(returnPath) {
                functionInfo.returnValue = returnPath.node.argument?.name;
            }
        });
        if(!functionInfo.cases)return
        // 查找初始状态
        path.traverse({
            VariableDeclaration(varPath) {
                varPath.node.declarations.forEach(decl => {
                    if (decl.id.name === functionInfo.stateVar && decl.init) {
                        if (types.isLiteral(decl.init)) {
                            functionInfo.initialState = decl.init.value;
                        } else if (types.isUnaryExpression(decl.init) &&
                            types.isLiteral(decl.init.argument)) {
                            functionInfo.initialState = decl.init.operator === '-'
                                ? -decl.init.argument.value
                                : decl.init.argument.value;
                        }
                    }
                });
            }
        });

        console.log("State variable:", functionInfo.stateVar);
        console.log("Initial state:", functionInfo.initialState);
        console.log("Cases:", Object.keys(functionInfo.cases));
        console.log("Variables:", functionInfo.variables);

        // 2. 分析状态流转
        function analyzeTransitions() {
            for (const [caseValue, consequent] of Object.entries(functionInfo.cases)) {
                consequent.forEach(stmt => {
                    if (types.isBlockStatement(stmt)) {
                        stmt.body.forEach(blockStmt => {
                            checkAssignment(blockStmt, parseInt(caseValue));
                        });
                    }
                });
            }

            function checkAssignment(stmt, caseValue) {

                if (types.isExpressionStatement(stmt) &&
                    types.isAssignmentExpression(stmt.expression) &&
                    types.isIdentifier(stmt.expression.left, {name: functionInfo.stateVar})
                ) {
                    console.log(caseValue, 'caseValue')
                    console.log(generate(stmt).code, 'stmt')
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
                        const test = expr.right.test;
                        const consequent = expr.right.consequent;
                        const alternate = expr.right.alternate;

                        if (types.isIdentifier(test) && functionInfo.variables[test.name] !== undefined) {
                            const testValue = functionInfo.variables[test.name];
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

                        } else if (types.isBooleanLiteral(test)) {
                            rightValue = test.value ? consequent.value : alternate.value;
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

                            console.log(newState, 'newState')
                            functionInfo.transitions[caseValue] = newState;
                        }
                    }
                }
            }
        }

        analyzeTransitions();

        console.log(functionInfo.transitions)
        // 3. 模拟执行并收集执行顺序
        const executionOrder = [];
        let currentState = functionInfo.initialState;
        const visitedStates = new Set();

        while (currentState !== undefined && !visitedStates.has(currentState)) {
            visitedStates.add(currentState);
            executionOrder.push(currentState);
            currentState = functionInfo.transitions[currentState];
        }

        console.log("Execution order:", executionOrder);

        // 4. 按执行顺序重建函数体
        if (executionOrder.length > 0) {
            const newBody = [];

            // 添加原始变量声明（除了状态变量）
            // path.traverse({
            //     VariableDeclaration(varPath) {
            //         if (!varPath.node.declarations.some(decl => decl.id.name === functionInfo.stateVar)) {
            //             newBody.push(varPath.node);
            //         }
            //     }
            // });

            // 按顺序添加case块代码
            executionOrder.forEach(state => {
                if (functionInfo.cases[state]) {
                    functionInfo.cases[state].forEach(consequent => {
                        if (types.isBlockStatement(consequent)) {
                            consequent.body.forEach(stmt => {
                                // 跳过状态变量赋值语句
                                if (!(types.isExpressionStatement(stmt) &&
                                    types.isAssignmentExpression(stmt.expression) &&
                                    types.isIdentifier(stmt.expression.left, {name: functionInfo.stateVar}))) {
                                    newBody.push(stmt);
                                }
                            });
                        } else {
                            newBody.push(consequent);
                        }
                    });
                }
            });

            // 添加return语句
            // if (functionInfo.returnValue) {
            //     newBody.push(types.returnStatement(types.identifier(functionInfo.returnValue)));
            // }

            // 替换函数体
            path.get('body').replaceWith(types.blockStatement(newBody));
        }
    }
});


// 第一步：分析变量使用情况
const usedVariables = new Set();

traverse(ast, {
    Identifier(path) {
        // 排除变量声明和函数声明
        if (!path.parentPath.isVariableDeclarator() &&
            !path.parentPath.isFunctionDeclaration() &&
            !path.parentPath.isFunctionExpression() &&
            !path.parentPath.isObjectProperty() &&
            !path.parentPath.isMemberExpression() && path.node.name != 'undefined') {
            usedVariables.add(path.node.name);
        }
    }
});

console.log(usedVariables, 'usedVariables')
// 第三步：精确清理未使用的变量
traverse(ast, {
    // 删除break语句
    BreakStatement(path) {
        path.remove();
    },

    // 删除空语句
    EmptyStatement(path) {
        path.remove();
    },

    // 删除undefined语句
    ExpressionStatement(path) {
        if (types.isIdentifier(path.node.expression) &&
            path.node.expression.name === 'undefined') {
            path.remove();
        }
    },


});

// 第四步：删除空的变量声明和函数参数
traverse(ast, {
    VariableDeclaration(path) {
        if (path.node.declarations.length === 0) {
            path.remove();
        }
    },

});

// 第五步：最后清理一次
traverse(ast, {
    // 删除未使用的变量声明
    VariableDeclaration(path) {
        // 检查这个声明中是否有任何变量未被使用
        const hasUnused = path.node.declarations.some(decl => {
            const varName = decl.id.name;
            return !usedVariables.has(varName);
        });

        // 如果有任何变量未使用，删除整个声明
        if (hasUnused) {
            console.log('准备移除:', path.toString()); // 调试信息
            path.remove();
            console.log('已标记移除'); // 确认移除操作执行
        }
    },
    EmptyStatement(path) {
        path.remove();
    }
});

let output = generate(ast).code;
fs.writeFileSync("output/switch.js", output);

//3 → 2 → 1 → 4