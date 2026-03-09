let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/code2.js", "utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});

// 3. 提取 `_0xfd85` 数组
let stringArray = [];
traverse(ast, {
    VariableDeclarator(path) {
        if (
            path.node.id.name === "_0x3160" &&
            types.isArrayExpression(path.node.init)
        ) {
            stringArray = path.node.init.elements.map((el) => el.value);
        }
    },
});


// 4. 递归收集所有 `_0x4252` 的别名
const aliasMap = {};
traverse(ast, {
  VariableDeclarator(path) {
    const { id, init } = path.node;
    if (types.isIdentifier(init)) {
      // 如果初始化是一个变量（如 `var _0x17ab7b = _0x4252`）
      aliasMap[id.name] = init.name;
    }
  },
});

// 5. 解析别名链，找到所有最终指向 `_0x582b` 的变量
const resolvedAliasMap = {};
Object.keys(aliasMap).forEach((alias) => {
  let current = alias;
  while (aliasMap[current]) {
    current = aliasMap[current];
  }
  if (current === "_0x582b") {
    resolvedAliasMap[alias] = true;
  }
});

// 6. 替换 `_0x4252(x)` 和所有别名调用为 `_0xfd85[x]`
traverse(ast, {
  CallExpression(path) {
    const callee = path.node.callee;
    if (
      types.isIdentifier(callee) &&
      (callee.name === "_0x4252" || resolvedAliasMap[callee.name]) &&
      path.node.arguments.length === 1
    ) {
      const arg = path.node.arguments[0];
      if (types.isNumericLiteral(arg)) {
        const index = arg.value;
        path.replaceWith(types.stringLiteral(stringArray[index]));
      }
    }
  },
});


// 还原字符串编码
traverse(ast, {
    "StringLiteral": function (path) {
        if (path.node.extra && !path.node.extra.raw.includes(path.node.value)) {
            // delete path.node.extra.raw
            path.node.extra.raw = "'" + path.node.value + "'"
            // path.node.extra = void 0
        }
    }
})

// 4. 提取所有对象定义（如 `_0x42d5f0 = { "akgbm": "undefined", ... }`）
const objectDefinitions = {};
traverse(ast, {
  VariableDeclarator(path) {
    if (
      types.isIdentifier(path.node.id) &&
      path.node.id.name.startsWith("_0x") &&
      types.isObjectExpression(path.node.init)
    ) {
      const objName = path.node.id.name;
      objectDefinitions[objName] = {};
      path.node.init.properties.forEach((prop) => {
        if (types.isObjectProperty(prop)) {
          const key = prop.key.value; // 如 "akgbm"
          objectDefinitions[objName][key] = prop.value; // 存储原始值或函数
        }
      });
    }
  },
});

// 5. 替换所有 `_0x1234["abcd"]` 为原始值
traverse(ast, {
  MemberExpression(path) {
    const obj = path.node.object;
    const prop = path.node.property;
    if (
      types.isIdentifier(obj) &&
      objectDefinitions[obj.name] &&
      types.isStringLiteral(prop)
    ) {
      const propValue = objectDefinitions[obj.name][prop.value];
      if (
        types.isStringLiteral(propValue) ||
        types.isNumericLiteral(propValue) ||
        types.isBooleanLiteral(propValue)
      ) {
        path.replaceWith(propValue); // 直接替换为原始值
      }
    }
  },
});

// 6. 替换所有 `_0x1234["abcd"](...)` 为函数逻辑
traverse(ast, {
  CallExpression(path) {
    const callee = path.node.callee;
    if (
      types.isMemberExpression(callee) &&
      types.isIdentifier(callee.object) &&
      objectDefinitions[callee.object.name] &&
      types.isStringLiteral(callee.property)
    ) {
      const func = objectDefinitions[callee.object.name][callee.property.value];

      if (types.isFunctionExpression(func)) {
        // 1. 提取函数参数名
        const paramNames = func.params.map(p => p.name);

        // 2. 提取调用时的实际参数
        const actualArgs = path.node.arguments;

        // 3. 创建参数映射表
        const argMap = {};
        paramNames.forEach((name, i) => {
          argMap[name] = actualArgs[i] || types.identifier('undefined');
        });

        // 4. 找到return语句
        const returnStatement = func.body.body.find(s => types.isReturnStatement(s));
        if (returnStatement) {
          // 5. 克隆return表达式
          let newExpr = types.cloneNode(returnStatement.argument);

          // 6. 替换参数标识符
          traverse(newExpr, {
            Identifier(p) {
              if (argMap[p.node.name]) {
                p.replaceWith(types.cloneNode(argMap[p.node.name]));
              }
            }
          }, path.scope, path);

          // 7. 替换整个调用表达式
          path.replaceWith(newExpr);
        }
      }
    }
  }
});


// 8. 删除未使用的变量
const referencedIdentifiers = new Set();
traverse(ast, {
  Identifier(path) {
    if (
      !path.parentPath.isVariableDeclarator() && // 排除声明语句
      !path.parentPath.isFunctionDeclaration()
    ) {
      referencedIdentifiers.add(path.node.name);
    }
  },
});

traverse(ast, {
  VariableDeclarator(path) {
    if (
      !referencedIdentifiers.has(path.node.id.name) &&
      path.node.id.name.startsWith("_0x")
    ) {
      path.remove(); // 删除未使用的变量
    }
  },
});

// 还原 window['']  => window.xx
// traverse(ast, {
//     MemberExpression: function (path){
//         path.node.computed = false
//         path.node.property.type = "Identifier"
//         path.node.property.name = path.node.property.value
//     }
// })


// 二次加餐 还原 debu + gger  1 +2

// traverse(ast, {
//     BinaryExpression: {exit:
//     function (path){
//         let left = path.get("left").node.value
//         let right = path.get("right").node.value
//         if(path.get("left").isStringLiteral() && path.get("right").isStringLiteral()){
//             path.replaceInline(types.valueToNode(left + right))
//         }
//         if(path.get("left").isNumericLiteral && path.get("right").isNumericLiteral()){
//             console.log(path.toString())
//             let {confident,value} = path.evaluate()
//             path.replaceInline({type:"NumericLiteral",value:value})
//         }
//     }}
// })
let output = generate(ast).code

fs.writeFileSync("output/code2.js", output)