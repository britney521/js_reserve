// 1. 预置根目标
const aliasMap = new Map([['a0_0x40fd', true]]);

// 2. 统一的别名解析函数（递归+记忆）
function resolveAlias(name, scope) {
  if (aliasMap.has(name)) return aliasMap.get(name);

  // 变量声明
  const binding = scope.getBinding(name);
  if (binding) {
    const path = binding.path;

    // const x = y
    if (path.isVariableDeclarator() && types.isIdentifier(path.node.init)) {
      const result = resolveAlias(path.node.init.name, path.scope);
      aliasMap.set(name, result);
      return result;
    }

    // 函数参数：function f(p) { ... }
    if (path.isFunction()) {
      // 函数参数本身不可能是别名，除非内部再赋值
      aliasMap.set(name, false);
      return false;
    }
  }

  // 全局作用域下未声明就使用的变量（如 c = xxx）
  // 这里简单返回 false，也可按需求扩展
  aliasMap.set(name, false);
  return false;
}

// 3. 第一次遍历：收集别名
traverse(ast, {
  // 3-a) 变量声明
  VariableDeclarator(path) {
    const { id, init } = path.node;
    if (types.isIdentifier(init)) {
      resolveAlias(id.name, path.scope);
    }
  },

  // 3-b) 赋值表达式
  AssignmentExpression(path) {
    if (path.node.operator !== '=') return;   // 只关心普通 =

    const left = path.node.left;
    const right = path.node.right;

    if (!types.isIdentifier(left)) return;        // 左侧不是简单标识符
    if (!types.isIdentifier(right)) return;       // 右侧也不是简单标识符

    // 右侧指向谁？
    const rightPointsTo = resolveAlias(right.name, path.scope);
    aliasMap.set(left.name, rightPointsTo);
  }
});

// 4. 第二次遍历：处理所有函数调用
traverse(ast, {
  CallExpression(path) {
    const { callee } = path.node;
    if (!types.isIdentifier(callee)) return;

    const pointsTo = resolveAlias(callee.name, path.scope);
    if (pointsTo) {
      // console.log(`Found call: ${path.toString()}`);
      processFunctionCall(path);
    }
  }
});
console.log(aliasMap);  // 调试输出



// 3. 遍历并替换异或表达式
traverse(ast, {
  BinaryExpression(path) {
    const { node } = path;
    if (
      node.operator === '^' &&
      node.left.type === 'NumericLiteral' &&
      node.right.type === 'NumericLiteral'
    ) {
      const result = node.left.value ^ node.right.value;
      path.replaceWith({
        type: 'NumericLiteral',
        value: result
      });
    }
  }
});

// 评估AST节点获取其值
function evaluateNode(node, scope) {
    switch (node.type) {
        case 'StringLiteral':
            return node.value;
        case 'NumericLiteral':
            return node.value;
        case 'BooleanLiteral':
            return node.value;
        case 'Identifier':
            // 尝试从作用域中获取变量值
            const binding = scope.getBinding(node.name);
            if (binding && binding.constant && binding.path.node.init) {
                return evaluateNode(binding.path.node.init, scope);
            }
            return undefined;
        case 'BinaryExpression':
            // 处理二进制表达式，如 0x90b99 ^ 0x90f36
            const left = evaluateNode(node.left, scope);
            const right = evaluateNode(node.right, scope);
            if (left === undefined || right === undefined) {
                return undefined;
            }
            switch (node.operator) {
                case '+':
                    return left + right;
                case '-':
                    return left - right;
                case '*':
                    return left * right;
                case '/':
                    return left / right;
                case '%':
                    return left % right;
                case '|':
                    return left | right;
                case '&':
                    return left & right;
                case '^':
                    return left ^ right;  // 异或运算
                case '<<':
                    return left << right;
                case '>>':
                    return left >> right;
                case '>>>':
                    return left >>> right;
                default:
                    return undefined;
            }
        default:
            return undefined;
    }
}
function processFunctionCall(path) {
  const { node, scope } = path;
  let { arguments } = node;

  // 确保参数数量在1-2个之间
  if (arguments.length < 1 || arguments.length > 2) {
    return;
  }

  // 计算第一个参数的值
  const firstArgValue = evaluateNode(arguments[0], scope);

  // 如果无法确定第一个参数值，跳过
  if (firstArgValue === undefined) {
    return;
  }

  let secondArgValue = null;
  if (arguments.length === 2) {
    secondArgValue = evaluateNode(arguments[1], scope);
    // 如果第二个参数存在但无法确定值，跳过
    if (secondArgValue === undefined) {
      return;
    }
  }

  // 调用解密函数
  const decryptedValue = a0_0x40fd(firstArgValue, secondArgValue);

  // 用解密后的值替换函数调用
  path.replaceWith({
    type: 'StringLiteral',
    value: decryptedValue
  });
}