let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');
const {default: generator} = require("@babel/generator");

let js_code = fs.readFileSync("veriycode.js", "utf-8")
// 解析代码为 AST
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});

// 临时存放提取出来的代码
let decryptCode = "";
traverse(ast, {
    VariableDeclarator(path) {
        // 提取数组 var _0x1295 = [...]
        if (path.node.id.name === 'a0_0x3d6e') {
            decryptCode += generator(path.parent).code + "\n";
        }
    },
    FunctionDeclaration(path) {
        // 提取函数 function _0x3ab2(...) {...}
        if (path.node.id.name === 'a0_0x1e60') {
            decryptCode += generator(path.node).code + "\n";
        }
    }
});

const mockEnv = `
    var window = {}; 
    var document = {};
    var navigator = {};
    // 绕过上一段代码中的正则检测
    RegExp.prototype.test = function(){ return true; }; 
`;

try {
    // 在当前上下文执行解密函数，这样我们就能直接调用 _0x3ab2(xxx) 了
    eval(mockEnv + decryptCode);
    console.log("环境加载成功，测试解密:", a0_0x1e60(0x1e6)); // 测试一下是否能解出字符串
} catch (e) {
    console.error("加载解密函数失败，请检查是否缺少依赖或手动复制函数代码到本脚本头部。", e);
    process.exit(1);
}

// 6. 替换 `_0x4252(x)` 和所有别名调用为 `_0xfd85[x]`
traverse(ast, {
  CallExpression(path) {
    const callee = path.node.callee;
    if (
      types.isIdentifier(callee) &&
      callee.name === "a0_0x1e60" &&
      path.node.arguments.length === 1
    ) {
      const arg = path.node.arguments[0];
      if (types.isNumericLiteral(arg)) {
        const index = arg.value;
        // 核心修复：1. 获取解密结果 2. 包裹成字符串字面量 3. 替换节点
        const decryptResult = a0_0x1e60(index);
        // 方式1：推荐用 types 构建字符串节点（更安全，避免注入）
        const stringNode = types.stringLiteral(decryptResult);
        path.replaceWith(stringNode);

        // 方式2（备选）：如果非要用 replaceWithSourceString，必须手动加引号
        // path.replaceWithSourceString(`"${decryptResult.replace(/"/g, '\\"')}"`);
      }
    }
  },
});


// 二次加餐 还原 debu + gger  1 +2
// 遍历 AST 并处理二元表达式
traverse(ast, {
    BinaryExpression: {
        exit(path) {
            const left = path.get("left").node;
            const right = path.get("right").node;

            // 计算表达式的值
            const {confident, value} = path.evaluate();

            if (confident) {
                // 替换为计算结果
                if (typeof value === 'number') {
                    path.replaceInline(types.numericLiteral(value));
                } else if (typeof value === 'boolean') {
                    path.replaceInline(types.booleanLiteral(value));
                } else if (typeof value === 'string') {
                    path.replaceInline(types.stringLiteral(value));
                } else {
                    console.warn(`Unhandled type: ${typeof value}`);
                }
            }
        }
    }
});



let output = generate(ast).code
// console.log(output)
fs.writeFileSync("outveriycode.js", output)