const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const fs = require("fs");

// 读取你的源文件
const code = fs.readFileSync("jiami.js", "utf-8");



// 假设解密函数名是 $_0x34a9，根据你提供的文件，这确实是函数名
const DECRYPT_FUNC_NAME = "$_0x320c";

// =========================================================================
// 2. 开始 AST 处理
// =========================================================================

const ast = parser.parse(code, {
  sourceType: "script",
});
let decryptCode = "";
let foundDecryptor = false;
// 遍历 AST 的顶层节点，寻找解密函数定义
traverse(ast, {
  Program(path) {
    const body = path.get('body');
    for (const nodePath of body) {
      // 生成当前节点的代码
      const nodeCode = generator(nodePath.node, { minified: true }).code;

      // 拼接到预执行代码中
      decryptCode += nodeCode + ";\n";

      // 检查当前节点是否是解密函数的定义
      // 情况 1: function $_0x320c(...) { ... }
      if (t.isFunctionDeclaration(nodePath.node) &&
          nodePath.node.id.name === DECRYPT_FUNC_NAME) {
        foundDecryptor = true;
        break; // 找到了就停止，后面的业务逻辑不需要加载
      }

      // 情况 2: var $_0x320c = function(...) { ... }
      if (t.isVariableDeclaration(nodePath.node)) {
        const declaration = nodePath.node.declarations[0];
        if (t.isIdentifier(declaration.id) && declaration.id.name === DECRYPT_FUNC_NAME) {
          foundDecryptor = true;
          break;
        }
      }
    }
    path.stop(); // 只需要遍历顶层，处理完直接停止
  }
});

if (!foundDecryptor) {
  console.error(`未找到解密函数 ${DECRYPT_FUNC_NAME} 的定义，请检查函数名是否正确！`);
  process.exit(1);
}

try {
  // 在全局作用域执行提取出来的代码
  // 这样 $_0x320c 就在内存里了，后续 eval 就能调用到了
  console.log("正在加载解密环境...");
  eval(decryptCode);
  console.log("解密环境加载成功！");
} catch (e) {
  console.error("解密环境加载失败:", e);
  process.exit(1);
}

// 辅助函数：判断节点是否是字面量
function isLiteral(node) {
  return t.isStringLiteral(node) || t.isNumericLiteral(node) || t.isBooleanLiteral(node);
}

console.log("正在清洗十六进制字符串...");
traverse(ast, {
  // 1. 清洗字符串: "\x61" -> "a"
  StringLiteral(path) {
    if (path.node.extra) {
        delete path.node.extra; // 删除原始格式，强制 Babel 重新生成标准字符串
    }
  },

});

traverse(ast, {
  // --- 阶段 A: 解密字符串 ---
  CallExpression(path) {
    const { callee, arguments: args } = path.node;

    // 匹配 $_0x34a9('0x...', '...')
    if (t.isIdentifier(callee) && callee.name === DECRYPT_FUNC_NAME) {
      if (args.length >= 2) {
        try {
          // 直接调用前面 eval 进来的函数
          const decrypted = eval(`${DECRYPT_FUNC_NAME}('${args[0].value}', '${args[1].value}')`);
          if (decrypted !== undefined) {
            path.replaceWith(t.stringLiteral(decrypted));
            return;
          }
        } catch (e) {
          // ignore error
          console.log(`${DECRYPT_FUNC_NAME}('${args[0].value}', '${args[1].value}')报错`,e)
        }
      }
    }
  },
});

// --- 阶段 B: 处理对象代理 (Proxy Object) ---
// 全局注册表
const aliasMap = {};  // 映射变量关系
const proxyMap = {}; // ob 对象

function getOriginalName(name) {
  let curr = name;
  while (aliasMap[curr]) {
    curr = aliasMap[curr];
  }
  return curr;
}

function analyzeValueNode(valueNode) {
  if (t.isLiteral(valueNode)) return { type: 'literal', node: valueNode };
  if (t.isFunctionExpression(valueNode) || t.isArrowFunctionExpression(valueNode)) {
    const body = valueNode.body.body;
    if (body && body.length === 1 && t.isReturnStatement(body[0])) {
      const retArg = body[0].argument;
      if (t.isCallExpression(retArg)) return { type: 'call' };
      if (t.isBinaryExpression(retArg)) return { type: 'binary', operator: retArg.operator };
      if (t.isLogicalExpression(retArg)) return { type: 'logical', operator: retArg.operator };
    }
  }
  return null;
}

// =========================================================================
// 阶段 1 & 2: 收集信息
// =========================================================================
traverse(ast, {
  VariableDeclarator(path) {
    const { id, init } = path.node;
    if (!t.isIdentifier(id)) return;

    if (init && t.isIdentifier(init)) {
      aliasMap[id.name] = init.name;
      return;
    }

    if (init && t.isObjectExpression(init)) {
      const objName = id.name;
      if (!proxyMap[objName]) proxyMap[objName] = {};

      init.properties.forEach(prop => {
        if (!t.isObjectProperty(prop)) return;
        let key = t.isIdentifier(prop.key) ? prop.key.name : (t.isLiteral(prop.key) ? prop.key.value : null);
        if (key) {
          const config = analyzeValueNode(prop.value);
          if (config) proxyMap[objName][key] = config;
        }
      });
    }
  },
  AssignmentExpression(path) {
    const { left, right } = path.node;
    if (t.isMemberExpression(left) && t.isIdentifier(left.object)) {
      const aliasName = left.object.name;
      const originalName = getOriginalName(aliasName);

      if (proxyMap[originalName]) {
        let key = null;
        if (!left.computed && t.isIdentifier(left.property)) key = left.property.name;
        else if (left.computed && t.isLiteral(left.property)) key = left.property.value;

        if (key) {
          const config = analyzeValueNode(right);
          if (config) proxyMap[originalName][key] = config;
        }
      }
    }
  }
});

console.log(`信息收集完成，共追踪到 ${Object.keys(proxyMap)} 个混淆对象。`);
console.log(`信息收集完成，共追踪到 ${JSON.stringify(aliasMap)} 个映射关系。`);
console.log("开始替换...\n");

// =========================================================================
// 阶段 3: 执行替换 (带日志 + 写入保护)
// =========================================================================
traverse(ast, {
  // 1. 先处理 MemberExpression (最底层的字面量)
  MemberExpression: {
    exit(path) {
      if (!t.isIdentifier(path.node.object)) return;
      const originalName = getOriginalName(path.node.object.name);
      if (!proxyMap[originalName]) return;

      let key = null;
      if (!path.node.computed && t.isIdentifier(path.node.property)) key = path.node.property.name;
      else if (path.node.computed && t.isLiteral(path.node.property)) key = path.node.property.value;

      if (!key || !proxyMap[originalName][key]) return;

      // --- 关键修正：写入保护 ---
      // 只有明确在赋值号左边时才跳过
      if (t.isAssignmentExpression(path.parent) && path.key === 'left') return;
      if (t.isUpdateExpression(path.parent)) return;
      // 也是对象属性定义的一部分时跳过
      if (path.parent.type === 'ObjectProperty' && path.parent.value === path.node && path.parentPath.parent.type === 'ObjectPattern') return;

      const config = proxyMap[originalName][key];
      // 只替换字面量，函数代理留给 CallExpression 处理
      if (config.type === 'literal') {
        try {
          path.replaceWith(config.node);
          // console.log(`[字符还原] ${key}`);
        } catch (e) {}
      }
    }
  },

  // 2. 再处理 CallExpression (因为是 exit，此时参数里的 MemberExpression 已经被上面的逻辑替换完了！)
  CallExpression: {
    exit(path) {
      const { callee, arguments: args } = path.node;
      if (!t.isMemberExpression(callee) || !t.isIdentifier(callee.object)) return;

      const originalName = getOriginalName(callee.object.name);
      if (!proxyMap[originalName]) return;

      let key = null;
      if (!callee.computed && t.isIdentifier(callee.property)) key = callee.property.name;
      else if (callee.computed && t.isLiteral(callee.property)) key = callee.property.value;

      if (!key || !proxyMap[originalName][key]) return;

      const config = proxyMap[originalName][key];
      const oldCode = generator(path.node, { minified: true }).code;

      try {
        if (config.type === 'invoke' && args.length > 0) {
          path.replaceWith(t.callExpression(args[0], args.slice(1)));
          console.log(`[函数还原] ${oldCode} -> Invoke`);
        }
        else if (config.type === 'chain') {
          const newCallee = t.cloneNode(config.callee);
          path.replaceWith(t.callExpression(newCallee, args));
          console.log(`[链式还原] ${oldCode} -> Chain`);
        }
        else if ((config.type === 'binary' || config.type === 'logical') && args.length === 2) {
          path.replaceWith(t.binaryExpression(config.operator, args[0], args[1]));
          const newCode = generator(path.node, { minified: true }).code;
          console.log(`[运算还原] ${oldCode} -> ${newCode}`);
        }
      } catch (e) {}
    }
  }
});

// =========================================================================
// 阶段 4: 字符串合并 (带日志)
// =========================================================================
traverse(ast, {
  BinaryExpression: {
    exit(path) {
      if (path.node.operator === '+' && t.isStringLiteral(path.node.left) && t.isStringLiteral(path.node.right)) {
        const oldStr = `"${path.node.left.value}" + "${path.node.right.value}"`;
        const newStr = `"${path.node.left.value + path.node.right.value}"`;

        if (newStr.length < 60) { // 太长的就不打印了，刷屏
             console.log(`[文本合并] ${oldStr.padEnd(40)} -> ${newStr}`);
        }

        path.replaceWith(t.stringLiteral(path.node.left.value + path.node.right.value));
      }
    }
  },
  VariableDeclarator(path) {
    if (t.isIdentifier(path.node.id) && proxyMap[path.node.id.name]) {
       if (t.isObjectExpression(path.node.init)) path.remove();
    }
  },
  AssignmentExpression(path) {
    if (t.isMemberExpression(path.node.left) && t.isIdentifier(path.node.left.object)) {
      const name = path.node.left.object.name;
      if (proxyMap[getOriginalName(name)]) {
        if (path.parentPath.isExpressionStatement()) path.parentPath.remove();
        else path.remove();
      }
    }
  }
});


console.log("正在执行控制流平坦化...");

traverse(ast, {
  WhileStatement(path) {
    const { test, body } = path.node;

    // 1. 匹配 while(true) 或 while(!![])
    if (!t.isBooleanLiteral(test, { value: true }) &&
        !(t.isUnaryExpression(test, { operator: '!' }) && t.isUnaryExpression(test.argument, { operator: '!' }) && t.isArrayExpression(test.argument.argument))) {
      return;
    }

    // 2. 寻找内部 switch
    if (!t.isBlockStatement(body)) return;
    const switchStmt = body.body.find(stmt => t.isSwitchStatement(stmt));
    if (!switchStmt) return;

    // 3. 匹配 switch 判别变量: array[index++]
    const discriminant = switchStmt.discriminant;
    if (!t.isMemberExpression(discriminant) || !t.isUpdateExpression(discriminant.property)) return;

    const arrayName = discriminant.object.name; // _0x300457
    const indexName = discriminant.property.argument.name; // _0x1a7355

    // 4. 寻找顺序数组的定义 (向上查找 binding)
    const binding = path.scope.getBinding(arrayName);
    if (!binding) return;

    const declNode = binding.path.node.init;

    // 匹配 var arr = "3|1|2".split('|')
    let orderStr = null;
    if (t.isCallExpression(declNode) &&
        t.isMemberExpression(declNode.callee) &&
        (declNode.callee.property.name === 'split' || declNode.callee.property.value === 'split') &&
        t.isStringLiteral(declNode.callee.object)) {
        orderStr = declNode.callee.object.value;
    }

    if (!orderStr) return;

    console.log(`发现控制流平坦化: 顺序 [${orderStr}]`);

    const order = orderStr.split('|');
    const cases = switchStmt.cases;
    const caseMap = {};

    // 5. 建立 Case 映射
    cases.forEach(c => {
      if (t.isStringLiteral(c.test)) {
        caseMap[c.test.value] = c.consequent;
      }
    });

    // 6. 重组代码块
    const newBody = [];
    order.forEach(idx => {
      const stmts = caseMap[idx];
      if (stmts) {
        // 过滤掉 break 和 continue
        const cleanStmts = stmts.filter(s => !t.isBreakStatement(s) && !t.isContinueStatement(s));
        newBody.push(...cleanStmts);
      }
    });

    // 7. 替换 While 循环
    path.replaceWithMultiple(newBody);

    // 8. 清理定义的变量 (数组和索引)
    binding.path.remove(); // 移除 var arr = ...
    path.scope.getBinding(indexName).path.remove(); // 移除 var idx = 0;
  }
});

// 4. 生成代码
const output = generator(ast).code;
fs.writeFileSync("jiami_restored.js", output);
console.log("还原完成，已保存为 jiami_restored.js");