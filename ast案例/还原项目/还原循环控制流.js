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

// 查找包含switch语句的for循环
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

// 清理未使用的代码
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

// 清理代码
traverse(ast, {
    BreakStatement(path) {
        path.remove();
    },
    EmptyStatement(path) {
        path.remove();
    },
    ExpressionStatement(path) {
        if (types.isIdentifier(path.node.expression) &&
            path.node.expression.name === 'undefined') {
            path.remove();
        }
    },
    VariableDeclaration(path) {
        if (path.node.declarations.length === 0) {
            path.remove();
        }
    },
});

// 删除未使用的变量声明
traverse(ast, {
    VariableDeclaration(path) {
        const hasUnused = path.node.declarations.some(decl => {
            const varName = decl.id.name;
            return !usedVariables.has(varName);
        });

        if (hasUnused) {
            path.remove();
        }
    },
    EmptyStatement(path) {
        path.remove();
    }
});

let output = generate(ast).code;
fs.writeFileSync("output/switch.js", output);