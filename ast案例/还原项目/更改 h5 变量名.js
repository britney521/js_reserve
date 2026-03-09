let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/h5.js", "utf-8")

// 解析代码为 AST
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});

// 更精确的特殊字符检测
function containsSpecialChars(str) {
    // 匹配非ASCII字符和特殊符号
    return /[^\x00-\x7F]|[ꓸꓹˆⵏʻᐹߵㅣˉⲻᑉǃ]/.test(str);
}

// 变量名映射和计数器
const varMap = new Map();
let counter = 0;

function getNewVarName(oldName) {
    if (varMap.has(oldName)) {
        return varMap.get(oldName);
    }

    // 根据变量用途生成更有意义的名称
    let newName;
    if (oldName.includes('function') || /[ꓸꓹㅣʻ]/.test(oldName)) {
        newName = `func_${counter++}`;
    } else if (/[ⵏᐹߵ]/.test(oldName)) {
        newName = `param_${counter++}`;
    } else if (/[ǃˉⲻ]/.test(oldName)) {
        newName = `temp_${counter++}`;
    } else {
        newName = `var_${counter++}`;
    }

    varMap.set(oldName, newName);
    return newName;
}

// 遍历和转换AST
traverse(ast, {
    // 处理所有标识符
    Identifier(path) {
        const node = path.node;
        if (containsSpecialChars(node.name)) {
            node.name = getNewVarName(node.name);
        }
    },

    // 处理函数声明
    FunctionDeclaration(path) {
        const node = path.node;
        if (node.id && containsSpecialChars(node.id.name)) {
            node.id.name = getNewVarName(node.id.name);
        }

        // 处理参数
        node.params.forEach(param => {
            if (types.isIdentifier(param) && containsSpecialChars(param.name)) {
                param.name = getNewVarName(param.name);
            }
        });
    },

    // 处理函数表达式
    FunctionExpression(path) {
        const node = path.node;
        if (node.id && containsSpecialChars(node.id.name)) {
            node.id.name = getNewVarName(node.id.name);
        }

        node.params.forEach(param => {
            if (types.isIdentifier(param) && containsSpecialChars(param.name)) {
                param.name = getNewVarName(param.name);
            }
        });
    },

    // 处理变量声明
    VariableDeclarator(path) {
        const node = path.node;
        if (types.isIdentifier(node.id) && containsSpecialChars(node.id.name)) {
            node.id.name = getNewVarName(node.id.name);
        }
    }
});

// 生成转换后的代码
const { code: transformedCode } = generate(ast, {
    retainLines: false,
    compact: false,
    comments: true
});

// 输出结果
console.log("=== 转换后的代码 ===");
console.log(transformedCode);

console.log("\n=== 变量名映射表 ===");
varMap.forEach((newName, oldName) => {
    console.log(`原始: ${oldName.padEnd(10)} -> 新变量: ${newName}`);
});

// 保存到文件
fs.writeFileSync("output/cleaned_code.js", transformedCode);
console.log("\n转换完成！结果已保存到 cleaned_code.js");