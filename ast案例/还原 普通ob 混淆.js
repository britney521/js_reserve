const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const fs = require("fs");

// 读取你的源文件
const code = fs.readFileSync("jiami.js", "utf-8");



// 假设解密函数名是 $_0x34a9，根据你提供的文件，这确实是函数名
const DECRYPT_FUNC_NAME = "$_0x34a9";

// =========================================================================
// 2. 开始 AST 处理
// =========================================================================

const ast = parser.parse(code, {
  sourceType: "script",
});

// 辅助函数：判断节点是否是字面量
function isLiteral(node) {
  return t.isStringLiteral(node) || t.isNumericLiteral(node) || t.isBooleanLiteral(node);
}
const proxyMap = {};
traverse(ast, {
  // --- 阶段 A: 解密字符串 ---
  CallExpression(path) {
    const { callee, arguments: args } = path.node;

    // 匹配 $_0x34a9('0x...', '...')
    if (t.isIdentifier(callee) && callee.name === DECRYPT_FUNC_NAME) {
      if (args.length >= 2 && t.isStringLiteral(args[0])) {
        try {
          // 直接调用前面 eval 进来的函数
          const decrypted = eval(`${DECRYPT_FUNC_NAME}('${args[0].value}', '${args[1].value}')`);
          if (decrypted !== undefined) {
            path.replaceWith(t.stringLiteral(decrypted));
            return;
          }
        } catch (e) {
          // ignore error
        }
      }
    }
  },
});

// --- 阶段 B: 处理对象代理 (Proxy Object) ---
traverse(ast, {
  VariableDeclarator(path) {
    const { id, init } = path.node;
    if (!t.isObjectExpression(init)) return;
    if (init.properties.length < 3) return;

    const objName = id.name;
    const props = init.properties;

    proxyMap[objName] = {};

    for (const prop of props) {
      if (!t.isObjectProperty(prop)) continue;

      // 1. 获取 Key (兼容 标识符、字符串、数字)
      let key = null;
      if (t.isIdentifier(prop.key)) key = prop.key.name;
      else if (t.isStringLiteral(prop.key)) key = prop.key.value;
      else if (t.isNumericLiteral(prop.key)) key = prop.key.value.toString();

      if (!key) continue;

      const value = prop.value;

      // 2. 获取 Value (修复点：使用 isLiteral 匹配所有字面量)
      // 这能覆盖 StringLiteral, NumericLiteral, BooleanLiteral, NullLiteral 等
      if (t.isLiteral(value)) {
        proxyMap[objName][key] = { type: 'literal', node: value };
      }
      // 2.1 额外支持 TemplateLiteral (防止混淆器使用 `string` 这种反引号形式)
      else if (t.isTemplateLiteral(value)) {
         proxyMap[objName][key] = { type: 'literal', node: value };
      }
      // 3. 处理函数和表达式代理
      else if (t.isFunctionExpression(value)) {
        const body = value.body.body;
        if (body.length === 1 && t.isReturnStatement(body[0])) {
          const retArg = body[0].argument;
          if (t.isCallExpression(retArg)) {
             proxyMap[objName][key] = { type: 'call' };
          } else if (t.isBinaryExpression(retArg)) {
             proxyMap[objName][key] = { type: 'binary', operator: retArg.operator };
          } else if (t.isLogicalExpression(retArg)) {
             proxyMap[objName][key] = { type: 'logical', operator: retArg.operator };
          }
        }
      }
    }
  }
});

console.log(`收集到 ${Object.keys(proxyMap).length} 个代理对象，开始执行安全替换...`);

// =========================================================================
// 阶段 2: 执行替换 (使用 CallExpression 访问器，解决 Container is falsy)
// =========================================================================
traverse(ast, {
  // 1. 专门处理函数调用类型的代理 ( _0xObj['add'](a,b) )
  CallExpression(path) {
    const { callee, arguments: args } = path.node;

    // 检查 callee 是否是成员表达式 (MemberExpression)
    if (!t.isMemberExpression(callee)) return;

    const { object, property, computed } = callee;
    if (!t.isIdentifier(object)) return;

    const objName = object.name;
    if (!proxyMap[objName]) return;

    // 获取属性名
    let propName = null;
    if (computed && t.isStringLiteral(property)) propName = property.value;
    else if (!computed && t.isIdentifier(property)) propName = property.name;

    if (!propName || !proxyMap[objName][propName]) return;

    const config = proxyMap[objName][propName];

    try {
      // 类型 A: 函数调用转发 _0xObj['func'](a, b) -> a(b)
      if (config.type === 'call') {
        if (args.length > 0) {
          const realCallee = args[0];
          const realArgs = args.slice(1);
          path.replaceWith(t.callExpression(realCallee, realArgs));
        }
      }
      // 类型 B: 二元运算 _0xObj['add'](a, b) -> a + b
      else if (config.type === 'binary' || config.type === 'logical') {
        if (args.length === 2) {
          path.replaceWith(t.binaryExpression(config.operator, args[0], args[1]));
        }
      }
    } catch (e) {
      console.log(`CallExpression 替换跳过: ${e.message}`);
    }
  },

  // 2. 专门处理字面量类型的代理 ( _0xObj['STR'] )
  MemberExpression(path) {
    const { object, property, computed } = path.node;
    if (!t.isIdentifier(object)) return;

    const objName = object.name;
    if (!proxyMap[objName]) return;

    let propName = null;
    if (computed && t.isStringLiteral(property)) propName = property.value;
    else if (!computed && t.isIdentifier(property)) propName = property.name;

    if (!propName || !proxyMap[objName][propName]) return;

    const config = proxyMap[objName][propName];

    // 只处理字面量替换，CallExpression 已经由上面的访问器处理了，这里不要碰
    if (config.type === 'literal') {
      try {
        path.replaceWith(config.node);
      } catch (e) {
        // ignore
      }
    }
  }
});

console.log("代理对象替换完成，清理死代码...");

// =========================================================================
// 阶段 3: 清理死代码 (移除定义的大对象)
// =========================================================================
traverse(ast, {
  VariableDeclarator(path) {
    if (t.isIdentifier(path.node.id) && proxyMap[path.node.id.name]) {
      path.remove();
    }
  }
});
traverse(ast, {
  BinaryExpression: {
    exit(path) {
      const { left, right, operator } = path.node;
      // 检查是否是两个字符串相加
      if (operator === '+' && t.isStringLiteral(left) && t.isStringLiteral(right)) {
        // 合并为 "debugger"
        path.replaceWith(t.stringLiteral(left.value + right.value));
      }
    }
  }
});



// 4. 生成代码
const output = generator(ast).code;
fs.writeFileSync("jiami_restored.js", output);
console.log("还原完成，已保存为 jiami_restored.js");