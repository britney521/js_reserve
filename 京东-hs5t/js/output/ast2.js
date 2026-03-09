const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const fs = require("fs");

// ================= 配置区域 =================
const INPUT_FILE = 'hs5t_fixed.js'; // 请输入上一步处理好的文件
const OUTPUT_FILE = 'hs5t_final.js';

// ================= 逻辑区域 =================
const sourceCode = fs.readFileSync(INPUT_FILE, "utf-8");
const ast = parser.parse(sourceCode, { sourceType: "module" });

console.log("🚀 开始全自动扫描 OB 混淆对象...");

// 映射表：Map<对象名, Map<属性名, 配置>>
// 结构：{ '_$W': { 'YIUnk': { type: 'binary', op: '+' }, ... }, '_$A': { ... } }
const globalObjMap = new Map();

// --- 第一步：扫描所有变量定义，自动识别混淆对象 ---
traverse(ast, {
    VariableDeclarator(path) {
        // 1. 必须是对象定义 var xxx = { ... }
        if (!t.isObjectExpression(path.node.init)) return;
        if (!t.isIdentifier(path.node.id)) return;

        const objName = path.node.id.name;
        const properties = path.node.init.properties;

        // 2. 这里的策略是：如果一个对象里包含了大量的“包装函数”，我们就认为它是混淆对象
        // 我们先临时收集属性，如果符合特征的属性数量 > 0，就记录这个对象
        const currentObjProps = new Map();

        properties.forEach(prop => {
            // 只处理 ObjectProperty，跳过 SpreadElement 等
            if (!t.isObjectProperty(prop)) return;

            const key = prop.key.value || prop.key.name; // 获取属性名
            const value = prop.value;

            // 特征 A: 简单的字面量映射 (String/Number)
            if (t.isStringLiteral(value) || t.isNumericLiteral(value)) {
                currentObjProps.set(key, { type: 'literal', node: value });
            }

            // 特征 B: 简单的函数包装
            else if (t.isFunctionExpression(value) || t.isArrowFunctionExpression(value)) {
                const body = value.body.body;
                // 必须是单行 return 语句
                if (body && body.length === 1 && t.isReturnStatement(body[0])) {
                    const returnArg = body[0].argument;

                    // B1: 二元运算 (a + b, a > b)
                    if (t.isBinaryExpression(returnArg)) {
                        currentObjProps.set(key, {
                            type: 'binary',
                            operator: returnArg.operator
                        });
                    }
                    // B2: 逻辑运算 (a || b, a && b)
                    else if (t.isLogicalExpression(returnArg)) {
                        currentObjProps.set(key, {
                            type: 'logical',
                            operator: returnArg.operator
                        });
                    }
                    // B3: 函数调用 (fn(a), fn(a,b))
                    else if (t.isCallExpression(returnArg)) {
                        // 确保是 return arg(args...) 的形式
                        if (t.isIdentifier(returnArg.callee)) {
                            currentObjProps.set(key, { type: 'call' });
                        }
                    }
                }
            }
        });

        // 3. 只有当识别出有效属性时，才把这个对象加入全局映射表
        if (currentObjProps.size > 0) {
            console.log(`📦 发现混淆对象: [${objName}] (包含 ${currentObjProps.size} 个映射属性)`);
            globalObjMap.set(objName, currentObjProps);
        }
    }
});

console.log(`📊 共发现 ${globalObjMap.size} 个混淆对象，开始进行全局替换...`);

// --- 第二步：遍历 AST 进行替换 ---
let replaceCount = 0;

traverse(ast, {
    // 1. 处理函数调用形式: Obj.func(a, b)
    CallExpression(path) {
        const { callee, arguments: args } = path.node;

        // 必须是 MemberExpression (Obj.prop)
        if (!t.isMemberExpression(callee)) return;

        // 获取对象名
        const objectName = callee.object.name;
        if (!objectName || !globalObjMap.has(objectName)) return;

        // 获取属性名
        const propName = callee.property.value || callee.property.name;

        // 获取配置
        const propMap = globalObjMap.get(objectName);
        const config = propMap.get(propName);

        if (config) {
            try {
                // A. 二元运算替换
                if (config.type === 'binary') {
                    path.replaceWith(t.binaryExpression(config.operator, args[0], args[1]));
                    replaceCount++;
                }
                // B. 逻辑运算替换
                else if (config.type === 'logical') {
                    path.replaceWith(t.logicalExpression(config.operator, args[0], args[1]));
                    replaceCount++;
                }
                // C. 函数调用替换
                else if (config.type === 'call') {
                    // Obj.call(func, arg1, arg2) -> func(arg1, arg2)
                    const realFunc = args[0];
                    const realArgs = args.slice(1); // 剩下的都是参数
                    path.replaceWith(t.callExpression(realFunc, realArgs));
                    replaceCount++;
                }
            } catch (e) {
                // 忽略错误，防止个别节点结构异常导致中断
            }
        }
    },

    // 2. 处理属性访问/常量替换: Obj['key'] 或 Obj.key
    MemberExpression(path) {
        const { object, property } = path.node;

        if (!t.isIdentifier(object)) return;
        if (!globalObjMap.has(object.name)) return;

        const propName = property.value || property.name;
        const propMap = globalObjMap.get(object.name);
        const config = propMap.get(propName);

        // 如果是字面量映射 (String/Number)
        if (config && config.type === 'literal') {
            path.replaceWith(config.node);
            replaceCount++;
        }
    }
});

console.log(`✅ 还原完成，共执行替换 ${replaceCount} 处。`);


console.log("🚀 开始执行常量折叠 (Constant Folding)...");

let replaceCount2 = 0;

traverse(ast, {
    // 同时监听 二元运算(+, -, *, /, <<, >>等) 和 一元运算(-1, !0, typeof 'a'等)
    "BinaryExpression|UnaryExpression"(path) {

        // 🔥 核心：Babel 内置的计算引擎
        // 它会尝试计算当前节点的值。如果节点里全是常量（包括递归子节点），
        // confident 会返回 true，value 会返回计算结果。
        const { confident, value } = path.evaluate();

        // 1. 只有计算结果可信时才替换
        // 2. 过滤掉 Infinity 和 NaN (防止除以0导致的异常代码)
        if (confident && value !== Infinity && value !== -Infinity && !Number.isNaN(value)) {

            // 这里的 value 可能是数字、字符串、布尔值
            // t.valueToNode 会自动创建对应的 AST 节点 (NumericLiteral, StringLiteral...)

            // 优化：有些混淆器会把非常大的整数拆解，如果计算结果过大（超出JS安全整数），
            // 可能需要 BigInt 处理，但一般 VMP 里的运算都在安全范围内。

            // 执行替换
            path.replaceWith(t.valueToNode(value));

            // 加上 skip 防止对新生成的常量重复遍历浪费性能
            path.skip();

            replaceCount++;
        }
    }
});

console.log(`✅ 计算还原完成，共简化了 ${replaceCount2} 处表达式。`);
// ================= 输出 =================
// 生成代码时尽量保留格式
const { code } = generator(ast, {
    jsescOption: { minimal: true },
    comments: true
});

fs.writeFileSync(OUTPUT_FILE, code, "utf-8");
console.log(`📂 文件已保存为: ${OUTPUT_FILE}`);