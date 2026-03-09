let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input.js", "utf-8")
// 解析代码为 AST
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});

traverse(ast, {
  WhileStatement(path) {
    const prev = path.getPrevSibling();
    if (!prev || !types.isVariableDeclaration(prev)) return;

    /* ---------- 1. 取出顺序数组 ---------- */
    const declarator = prev.node.declarations[0];
    const order = evaluate(declarator.init);   // ["0","1","2","3","4"]
    if (!Array.isArray(order)) return;

    /* ---------- 2. 收集 case ---------- */
    const caseMap = Object.create(null);   // 键值对： { '0': [stmt,stmt], '1': [stmt,stmt] }
    path.node.body.body[0].cases.forEach(cs => {
      if (!types.isStringLiteral(cs.test)) return; // 只处理常量 case
      const key = cs.test.value;

      /* 去掉末尾的 continue; 它只在 switch 里有意义 */
      const body = cs.consequent.filter(st => !types.isContinueStatement(st));
      caseMap[key] = body;          // AST 节点数组
    });

    /* ---------- 3. 按顺序生成新语句 ---------- */
    const newStmts = [];
    order.forEach(k => {
      if (caseMap[k]) newStmts.push(...caseMap[k]);
    });

    /* ---------- 4. 替换：删掉变量声明 + while，换成顺序语句 ---------- */
    prev.remove();
    path.replaceWithMultiple(newStmts);

    /* ---------- 5. （可选）打印调试 ---------- */
    console.log('case 键值对:', caseMap);
    console.log('还原后语句数量:', newStmts.length);
  }
});


/* ---------- 轻量级静态求值 ---------- */
function evaluate(node) {
  if (types.isStringLiteral(node)) return node.value;
  if (types.isNumericLiteral(node)) return node.value;

  // "0|1|2|3|4"["split"]('|')
  if (
    types.isCallExpression(node) &&
    types.isMemberExpression(node.callee) &&
    types.isLiteral(node.callee.object) &&
    node.callee.property.value === 'split' &&
    types.isLiteral(node.arguments[0])
  ) {
      console.log('1111111')
    return node.callee.object.value.split(node.arguments[0].value);
  }

  // 0x0
  if (types.isUnaryExpression(node, { operator: '-' }) &&
      types.isNumericLiteral(node.argument)) {
    return -node.argument.value;
  }

  return '<无法求值>';
}

let output = generate(ast).code

fs.writeFileSync("output.js", output)