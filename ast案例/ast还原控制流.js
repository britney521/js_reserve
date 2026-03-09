const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

const sourceCode = `
 var QQoOO = 39;
          while (QQoOO) {
            switch (QQoOO) {
              case 40:
                {
                  var QOQoo = Object(this);
                  var O0QOO = QOQoo["length"] >>> 0;
                  QQoOO = 41;
                  break;
                }
              case 42:
                {
                  if (arguments["length"] > 1) {
                    oO00O = arguments[1];
                  }
                  for (var OOOoO = 0; OOOoO < O0QOO; OOOoO++) {
                    if (OOOoO in QOQoo) {
                      var QOOOO = QOQoo[OOOoO];
                      if (QOO0o["call"](oO00O, QOOOO, OOOoO, QOQoo)) {
                        Oo0OQ["push"](QOOOO);
                      }
                    }
                  }
                  return Oo0OQ;
                }
              case 39:
                {
                  if (this == null) {
                    throw new TypeError("Array.prototype.filter called on null or undefined");
                  }
                  if (typeof QOO0o !== "function") {
                    throw new TypeError(QOO0o + " is not a function");
                  }
                  QQoOO = 40;
                  break;
                }
              case 41:
                {
                  var Oo0OQ = [];
                  var oO00O = undefined;
                  QQoOO = 42;
                  break;
                }
            }
          }`;

// 【修正点】：添加配置对象，允许由 return
const ast = parser.parse(sourceCode, {
    allowReturnOutsideFunction: true
});

traverse(ast, {
    WhileStatement(path) {
        const {test, body} = path.node;

        if (!t.isBlockStatement(body) || !t.isSwitchStatement(body.body[0])) return;
        const switchStmt = body.body[0];
        const stateVarName = switchStmt.discriminant.name;
        if (!t.isIdentifier(test, {name: stateVarName})) return;

        let currentState = null;
        // 获取 while 前面的变量声明 (var QQoOO = 39;)
        const prevSibling = path.getSibling(path.key - 1);
        if (prevSibling.isVariableDeclaration()) {
            const decl = prevSibling.node.declarations[0];
            if (decl.id.name === stateVarName && t.isNumericLiteral(decl.init)) {
                currentState = decl.init.value;
                prevSibling.remove(); // 移除初始化的变量声明
            }
        }
        if (currentState === null) return;

        const casesMap = {};
        switchStmt.cases.forEach(c => {
            if (t.isNumericLiteral(c.test)) {
                casesMap[c.test.value] = c.consequent;
            }
        });

        const finalBody = [];
        const visited = new Set(); // 防止死循环

        while (currentState !== 0 && currentState !== null && !visited.has(currentState)) {
            visited.add(currentState);
            let caseStmts = casesMap[currentState];

            if (!caseStmts) break;

            // 针对 case { ... } 的情况，取内部 body
            if (caseStmts.length === 1 && t.isBlockStatement(caseStmts[0])) {
                caseStmts = caseStmts[0].body;
            }

            const statements = [...caseStmts];

            // 删掉最后的 break
            if (statements.length > 0 && t.isBreakStatement(statements[statements.length - 1])) {
                statements.pop();
            }

            // 寻找赋值跳转 (QQoOO = 41;)
            const lastStmt = statements[statements.length - 1];
            let nextState = null;

            if (lastStmt &&
                t.isExpressionStatement(lastStmt) &&
                t.isAssignmentExpression(lastStmt.expression) &&
                t.isIdentifier(lastStmt.expression.left, {name: stateVarName}) &&
                t.isNumericLiteral(lastStmt.expression.right)) {

                nextState = lastStmt.expression.right.value;
                statements.pop(); // 移除改变状态变量的语句
            } else {
                nextState = 0; // 或者 null，表示流程结束
            }

            finalBody.push(...statements);
            currentState = nextState;
        }

        path.replaceWithMultiple(finalBody);
    }
});

const {code} = generator(ast);
console.log(code);