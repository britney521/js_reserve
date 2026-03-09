const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const fs = require("fs");

const INPUT_FILE = 'hs5t_final.js';
const OUTPUT_FILE = 'hs5t_clean.js';

// 1. 模拟 _4yple 解密函数
function _4yple(s) {
    var o = '';
    for (var i = 0; i < s.length;) {
      var c = s.charCodeAt(i++);
      if (c > 63) o += String.fromCharCode(c ^ 16);
      else if (c == 35) o += s.charAt(i++);
      else o += String.fromCharCode(c);
    }
    return o;
}

const sourceCode = fs.readFileSync(INPUT_FILE, "utf-8");
const ast = parser.parse(sourceCode, { sourceType: "module" });

console.log("🚀 开始深度清理 (架构优化版)...");

let _1tjle_Values = [];
// 全局字典：存储所有识别到的混淆对象配置
// 结构: Map<对象名, Map<属性名, 配置>>
const globalObfuscatorConfig = new Map();

// ============================================
// 第一阶段：分析与收集 (不修改 AST)
// ============================================
traverse(ast, {
    // 1. 替换 _4yple (这是个独立的解密函数，可以直接替换)
    CallExpression(path) {
        if (t.isIdentifier(path.node.callee, { name: "_4yple" }) &&
            path.node.arguments.length === 1 &&
            t.isStringLiteral(path.node.arguments[0])) {
            path.replaceWith(t.stringLiteral(_4yple(path.node.arguments[0].value)));
        }
    },
    // 2. 捕获 _1tjle 字符串池
    VariableDeclarator(path) {
        if (t.isIdentifier(path.node.id, { name: "_1tjle" }) && t.isArrayExpression(path.node.init)) {
            path.node.init.elements.forEach(el => {
                _1tjle_Values.push(t.isStringLiteral(el) ? el.value : null);
            });
            console.log(`✅ 捕获 VMP 字符串表，共 ${_1tjle_Values.length} 项`);
        }

        // 3. 分析混淆对象 (只分析，不替换)
        // 特征: var _$VP = { 'add': function(a,b){return a+b}, 'str': 'abc' }
        if (t.isObjectExpression(path.node.init) && t.isIdentifier(path.node.id)) {
            const objName = path.node.id.name;
            const propMap = new Map();
            let isValidObj = false;

            path.node.init.properties.forEach(prop => {
                if (!t.isObjectProperty(prop)) return;
                const key = prop.key.value || prop.key.name;

                // 字面量映射
                if (t.isLiteral(prop.value)) {
                    propMap.set(key, { type: 'literal', node: prop.value });
                }
                // 函数包装器
                else if (t.isFunctionExpression(prop.value) || t.isArrowFunctionExpression(prop.value)) {
                    const body = prop.value.body.body;
                    if (body.length === 1 && t.isReturnStatement(body[0])) {
                        isValidObj = true;
                        const retArg = body[0].argument;
                        // 记录具体的运算类型和操作符
                        if (t.isBinaryExpression(retArg)) {
                            propMap.set(key, { type: 'binary', operator: retArg.operator });
                        } else if (t.isLogicalExpression(retArg)) {
                            propMap.set(key, { type: 'logical', operator: retArg.operator });
                        } else if (t.isCallExpression(retArg)) {
                            propMap.set(key, { type: 'call' });
                        }
                    }
                }
            });

            if (isValidObj) {
                // 将配置存入全局 Map，供第二阶段使用
                globalObfuscatorConfig.set(objName, propMap);
            }
        }
    }
});

console.log(`📊 分析完成，识别到 ${globalObfuscatorConfig.size} 个混淆对象。开始执行替换...`);

// ============================================
// 第二阶段：统一替换 (Call & Member)
// ============================================
let replaceCount = 0;

traverse(ast, {
    // 1. 替换 _1tjle[123] -> "string"
    MemberExpression(path) {
        const { object, property } = path.node;
        if (t.isIdentifier(object, { name: "_1tjle" }) && t.isNumericLiteral(property)) {
            const val = _1tjle_Values[property.value];
            if (val !== null && val !== undefined) {
                path.replaceWith(t.stringLiteral(val));
                replaceCount++;
            }
            return; // 处理完直接返回
        }

        // 2. 替换对象属性访问: _$VP['str'] -> 'value'
        if (t.isIdentifier(object) && globalObfuscatorConfig.has(object.name)) {
            const key = property.value || property.name;
            const config = globalObfuscatorConfig.get(object.name).get(key);

            if (config && config.type === 'literal') {
                path.replaceWith(config.node);
                replaceCount++;
            }
        }
    },

    // 3. 替换函数调用: _$VP.add(a, b)
    CallExpression(path) {
        const { callee, arguments: args } = path.node;

        // 必须是成员表达式调用: Obj.method(...)
        if (!t.isMemberExpression(callee)) return;

        const object = callee.object;
        if (!t.isIdentifier(object) || !globalObfuscatorConfig.has(object.name)) return;

        const key = callee.property.value || callee.property.name;
        const config = globalObfuscatorConfig.get(object.name).get(key);

        if (config) {
            try {
                if (config.type === 'binary') {
                    path.replaceWith(t.binaryExpression(config.operator, args[0], args[1]));
                    replaceCount++;
                } else if (config.type === 'logical') {
                    path.replaceWith(t.logicalExpression(config.operator, args[0], args[1]));
                    replaceCount++;
                } else if (config.type === 'call') {
                    // Obj.call(fn, a, b) -> fn(a, b)
                    if (args.length >= 1) {
                        path.replaceWith(t.callExpression(args[0], args.slice(1)));
                        replaceCount++;
                    }
                }
            } catch (e) {
                console.error(`⚠️ 替换出错 [${object.name}.${key}]:`, e.message);
            }
        }
    }
});

console.log(`✅ 清理完成，共替换 ${replaceCount} 处引用。`);

const { code } = generator(ast, { jsescOption: { minimal: true } });
fs.writeFileSync(OUTPUT_FILE, code, "utf-8");
console.log(`📂 文件已保存为: ${OUTPUT_FILE}`);