const proxyMap = {};

// 辅助函数：分析 Value 节点并提取配置
function analyzeValueNode(valueNode) {
  if (t.isLiteral(valueNode)) {
    return { type: 'literal', node: valueNode };
  }
  // 支持 TemplateLiteral (如 `str`)
  else if (t.isTemplateLiteral(valueNode)) {
    return { type: 'literal', node: valueNode };
  }
  else if (t.isFunctionExpression(valueNode) || t.isArrowFunctionExpression(valueNode)) {
    const body = valueNode.body.body; // BlockStatement 的 body
    // 简单函数：只有一个 return 语句
    if (body && body.length === 1 && t.isReturnStatement(body[0])) {
      const retArg = body[0].argument;
      if (t.isCallExpression(retArg)) {
         return { type: 'call' };
      } else if (t.isBinaryExpression(retArg)) {
         return { type: 'binary', operator: retArg.operator };
      } else if (t.isLogicalExpression(retArg)) {
         return { type: 'logical', operator: retArg.operator };
      }
    }
  }
  return null;
}

// =========================================================================
// 阶段 1: 增强型收集 (支持 var obj = {}; obj[key]=val;)
// =========================================================================
traverse(ast, {
  VariableDeclarator(path) {
    const { id, init } = path.node;
    // 必须是对象定义，但允许是空对象 {}
    if (!t.isObjectExpression(init)) return;

    const objName = id.name;
    const collectedProps = {};

    // 1. 收集初始化时的属性 (var obj = { k: v })
    init.properties.forEach(prop => {
      if (!t.isObjectProperty(prop)) return;

      let key = null;
      if (t.isIdentifier(prop.key)) key = prop.key.name;
      else if (t.isLiteral(prop.key)) key = prop.key.value;

      if (key) {
        const config = analyzeValueNode(prop.value);
        if (config) collectedProps[key] = config;
      }
    });

    // 2. 收集赋值时的属性 (obj['k'] = v)
    // 获取该变量在作用域中的绑定
    const binding = path.scope.getBinding(objName);
    if (binding && binding.referencePaths) {
      binding.referencePaths.forEach(refPath => {
        // 检查引用链：obj -> obj['key'] -> obj['key'] = val
        const memberExprPath = refPath.parentPath;
        if (!memberExprPath.isMemberExpression() || memberExprPath.node.object !== refPath.node) return;

        const assignmentExprPath = memberExprPath.parentPath;
        if (!assignmentExprPath.isAssignmentExpression() || assignmentExprPath.node.left !== memberExprPath.node) return;

        // 提取 Key
        const propNode = memberExprPath.node.property;
        let key = null;
        if (memberExprPath.node.computed) {
          if (t.isLiteral(propNode)) key = propNode.value; // 支持字符串/数字索引
        } else {
          if (t.isIdentifier(propNode)) key = propNode.name; // 支持点号索引
        }

        if (key) {
          // 提取 Value (赋值号右边)
          const config = analyzeValueNode(assignmentExprPath.node.right);
          if (config) collectedProps[key] = config;
        }
      });
    }

    // 只有收集到有效属性才认为是代理对象
    if (Object.keys(collectedProps).length > 0) {
      proxyMap[objName] = collectedProps;
    }
  }
});

console.log(`收集到 ${Object.keys(proxyMap).length} 个代理对象，开始执行安全替换...`);

// =========================================================================
// 阶段 2: 执行替换 (CallExpression + MemberExpression)
// =========================================================================
traverse(ast, {
  // 1. 处理函数调用: _0xObj['add'](a,b)
  CallExpression(path) {
    const { callee, arguments: args } = path.node;
    if (!t.isMemberExpression(callee)) return;

    const { object, property, computed } = callee;
    if (!t.isIdentifier(object)) return;

    const objName = object.name;
    if (!proxyMap[objName]) return;

    let propName = null;
    if (computed && t.isLiteral(property)) propName = property.value;
    else if (!computed && t.isIdentifier(property)) propName = property.name;

    if (!propName || !proxyMap[objName][propName]) return;

    const config = proxyMap[objName][propName];

    try {
      if (config.type === 'call' && args.length > 0) {
          const realCallee = args[0];
          const realArgs = args.slice(1);
          path.replaceWith(t.callExpression(realCallee, realArgs));
      }
      else if ((config.type === 'binary' || config.type === 'logical') && args.length === 2) {
          path.replaceWith(t.binaryExpression(config.operator, args[0], args[1]));
      }
    } catch (e) {
      console.log(`CallExpression 替换跳过: ${e.message}`);
    }
  },

  // 2. 处理字面量: _0xObj['STR']
  MemberExpression(path) {
    const { object, property, computed } = path.node;
    if (!t.isIdentifier(object)) return;

    const objName = object.name;
    if (!proxyMap[objName]) return;

    let propName = null;
    if (computed && t.isLiteral(property)) propName = property.value;
    else if (!computed && t.isIdentifier(property)) propName = property.name;

    if (!propName || !proxyMap[objName][propName]) return;

    const config = proxyMap[objName][propName];

    if (config.type === 'literal') {
      try {
        path.replaceWith(config.node);
      } catch (e) {}
    }
  }
});

// =========================================================================
// 阶段 3: 字符串合并
// =========================================================================
traverse(ast, {
  BinaryExpression: {
    exit(path) {
      if (path.node.operator === '+' &&
          t.isStringLiteral(path.node.left) &&
          t.isStringLiteral(path.node.right)) {
        path.replaceWith(t.stringLiteral(path.node.left.value + path.node.right.value));
      }
    }
  }
});

// =========================================================================
// 阶段 4: 清理定义 (移除代理对象及其赋值语句)
// =========================================================================
console.log("清理代理对象定义...");
traverse(ast, {
  // 1. 移除 var _0xObj = {}
  VariableDeclarator(path) {
    if (t.isIdentifier(path.node.id) && proxyMap[path.node.id.name]) {
      path.remove();
    }
  },
  // 2. 移除 _0xObj['k'] = v
  AssignmentExpression(path) {
    const { left } = path.node;
    if (t.isMemberExpression(left) && t.isIdentifier(left.object)) {
      if (proxyMap[left.object.name]) {
        // 如果父节点是语句 (ExpressionStatement)，则移除整行
        if (path.parentPath.isExpressionStatement()) {
          path.parentPath.remove();
        } else {
          path.remove();
        }
      }
    }
  }
});