const fs = require('fs')
let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");


// 扩展指令集（按照您要求的格式）
const INST = {};
INST[INST["PUSH"] = 101] = "PUSH";
INST[INST["STORE"] = 102] = "STORE";  // 存储变量
INST[INST["LOAD"] = 103] = "LOAD";    // 加载变量

INST[INST["STORE_ELEM"] = 205] = "STORE_ELEM";  // 数组/对象元素赋值
INST[INST["ASSIGN"] = 206] = "ASSIGN";        // 变量赋值

// 数组对象
INST[INST["NEW_ARRAY"] = 201] = "NEW_ARRAY";
INST[INST["NEW_OBJECT"] = 202] = "NEW_OBJECT";
INST[INST["GET_PROP"] = 203] = "GET_PROP";
INST[INST["SET_PROP"] = 204] = "SET_PROP";

INST[INST["STORE_ELEM"] = 205] = "STORE_ELEM";  // 数组/对象元素赋值
INST[INST["ASSIGN"] = 206] = "ASSIGN";        // 变量赋值
// 算术运算
INST[INST["ADD"] = 1] = "ADD";
INST[INST["SUB"] = 2] = "SUB";
INST[INST["MUL"] = 3] = "MUL";
INST[INST["DIV"] = 4] = "DIV";
INST[INST["MOD"] = 5] = "MOD";
// 比较运算
INST[INST["GT"] = 6] = "GT";
INST[INST["LT"] = 7] = "LT";
INST[INST["EQ"] = 8] = "EQ";
INST[INST["NEQ"] = 9] = "NEQ";
INST[INST["GTE"] = 10] = "GTE";
INST[INST["LTE"] = 11] = "LTE";
// 位运算
INST[INST["LSHIFT"] = 12] = "LSHIFT";
INST[INST["RSHIFT"] = 13] = "RSHIFT";
INST[INST["BAND"] = 14] = "BAND";
INST[INST["BOR"] = 15] = "BOR";
INST[INST["BXOR"] = 16] = "BXOR";
INST[INST["BNOT"] = 17] = "BNOT";


class Complier {
    constructor(code) {
        this.ast = parse(code)
        this.instList = []  // 指令
        this.poolList = []  // 堆栈
        this.variables = {};  // 新增：变量存储
        this.varIndex = 0;    // 变量索引计数器
        this.globals = {
            Array: Array,
            Object: Object
        };
        this.instdec = []
    }

    complie() {
        this.complieStatement(this.ast.program);
    }

    pushInst(inst) {
        // 增加push指令
        this.instList.push(inst)
        if(inst!==INST.PUSH){
           this.instdec.push(INST[inst])
        }
    }

    pushPool(value) {

        let index = this.poolList.indexOf(value)
        this.pushInst(INST["PUSH"])
        if (index !== -1) {
            this.instList.push(index)
        } else {
            this.poolList.push(value)
            this.instList.push(this.poolList.length - 1)
        }
        this.instdec.push(INST[INST["PUSH"]])
    }


    complieStatement(node) {
        let {type} = node;
        switch (type) {
            case "Program": {
                let {body} = node;
                for (let i = 0; i < body.length; i++) {
                    this.complieStatement(body[i])
                }
                break;
            }

            case "ArrayExpression": {
                // 编译数组元素
                for (let element of node.elements) {
                    this.complieStatement(element);
                }
                // 创建数组指令：元素个数 数组
                this.pushInst(INST["NEW_ARRAY"]);
                this.pushInst(node.elements.length);
                break;
            }

            case "ObjectExpression": {
                // 编译对象属性
                for (let prop of node.properties) {
                    // 编译属性值
                    this.complieStatement(prop.value);
                    // 属性名存入常量池
                    if (prop.computed) {
                        this.complieStatement(prop.key);
                    } else {
                        this.pushPool(prop.key.name || prop.key.value);
                    }
                }
                // 创建对象指令：属性个数 对象
                this.pushInst(INST["NEW_OBJECT"]);
                this.pushInst(node.properties.length);
                break;
            }

            case "MemberExpression": {
                // 编译对象/数组访问
                this.complieStatement(node.object);

                // 处理属性名
                if (node.computed) {
                    // 计算属性名 [expr]
                    this.complieStatement(node.property);
                } else if (node.property.type === "Identifier") {
                    // 简单属性名 .prop
                    this.pushPool(node.property.name);
                } else {
                    // 其他情况（如数字字面量）
                    this.complieStatement(node.property);
                }

                this.pushInst(INST["GET_PROP"]);
                break;
            }
            case "VariableDeclaration": {
                for (let declarator of node.declarations) {
                    const varName = declarator.id.name;

                    // 确保变量名有效
                    if (typeof varName !== 'string' || varName.trim() === '') {
                        throw new Error(`无效的变量名: ${varName}`);
                    }

                    // 注册变量（如果未注册）
                    if (!this.variables.hasOwnProperty(varName)) {
                        this.variables[varName] = this.varIndex++;
                    }

                    // 处理初始化表达式
                    if (declarator.init) {
                        this.complieStatement(declarator.init);
                    } else {
                        this.pushPool(undefined);
                    }

                    // 存储变量
                    this.pushInst(INST["STORE"]);
                    this.pushInst(this.variables[varName]);
                }
                break;
            }

            case "Identifier": {
                const varName = node.name;

                // 特殊处理全局变量
                const globalVars = {
                    'undefined': undefined,
                    'NaN': NaN,
                    'Infinity': Infinity,
                    'null': null  // 虽然 null 是字面量，但这里也处理
                };

                if (globalVars.hasOwnProperty(varName)) {
                    this.pushPool(globalVars[varName]);
                    break;
                }

                // 检查变量是否已声明
                if (!this.variables.hasOwnProperty(varName)) {
                    throw new Error(`变量未定义: ${varName} (位置: ${node.loc?.start.line}:${node.loc?.start.column})`);
                }

                // 加载变量
                this.pushInst(INST["LOAD"]);
                this.pushInst(this.variables[varName]);
                break;
            }

            case "ExpressionStatement": {
                let {expression} = node
                this.complieStatement(expression)
                break;
            }


            case "StringLiteral": {
                let {value} = node;
                this.pushPool(value);
                break;
            }

            case "AssignmentExpression": {
                const {left, right, operator} = node;

                // 先计算右值
                this.complieStatement(right);

                // 处理左值
                switch (left.type) {
                    case "Identifier":
                        // 变量赋值
                        if (!this.variables.hasOwnProperty(left.name)) {
                            throw new Error(`变量未定义: ${left.name}`);
                        }
                        this.pushInst(INST["ASSIGN"]);
                        this.pushInst(this.variables[left.name]);
                        break;

                    case "MemberExpression":
                        // 数组/对象元素赋值
                        this.complieStatement(left.object);
                        if (left.computed) {
                            this.complieStatement(left.property);
                        } else {
                            this.pushPool(left.property.name);
                        }
                        this.pushInst(INST["STORE_ELEM"]);
                        break;

                    default:
                        throw new Error(`不支持的赋值左值类型: ${left.type}`);
                }
                break;
            }

            case "NullLiteral": {
                this.pushPool(null);  // 将 null 存入常量池
                break;
            }


            case "TemplateLiteral": {
                let {quasis, expressions} = node;
                // 处理模板字符串（简化版，只拼接不处理表达式）
                let str = quasis.map(q => q.value.cooked).join('');
                this.pushPool(str);
                break;
            }

            case "BinaryExpression": {
                let {left, right, operator} = node
                this.complieStatement(left)
                this.complieStatement(right)

                switch (operator) {
                    // 算术运算
                    case '+':
                        this.pushInst(INST['ADD']);
                        break;
                    case '-':
                        this.pushInst(INST['SUB']);
                        break;
                    case '*':
                        this.pushInst(INST['MUL']);
                        break;
                    case '/':
                        this.pushInst(INST['DIV']);
                        break;
                    case '%':
                        this.pushInst(INST['MOD']);
                        break;

                    // 比较运算
                    case '>':
                        this.pushInst(INST['GT']);
                        break;
                    case '<':
                        this.pushInst(INST['LT']);
                        break;
                    case '==':
                        this.pushInst(INST['EQ']);
                        break;
                    case '!=':
                        this.pushInst(INST['NEQ']);
                        break;
                    case '>=':
                        this.pushInst(INST['GTE']);
                        break;
                    case '<=':
                        this.pushInst(INST['LTE']);
                        break;

                    // 位运算
                    case '<<':
                        this.pushInst(INST['LSHIFT']);
                        break;
                    case '>>':
                        this.pushInst(INST['RSHIFT']);
                        break;
                    case '&':
                        this.pushInst(INST['BAND']);
                        break;
                    case '|':
                        this.pushInst(INST['BOR']);
                        break;
                    case '^':
                        this.pushInst(INST['BXOR']);
                        break;

                    default:
                        throw new Error(`不支持的运算符: ${operator}`)
                }
                break;
            }

            case "UnaryExpression": {
                if (node.operator === '~') {
                    this.complieStatement(node.argument)
                    this.pushInst(INST['BNOT'])
                } else {
                    throw new Error(`不支持的一元运算符: ${operator}`)
                }
                break;
            }

            case "NumericLiteral": {
                let {value} = node
                this.pushPool(value)
                break;
            }

            case "BooleanLiteral": {
                let {value} = node
                this.pushPool(value ? 1 : 0)
                break;
            }

            default:
                throw new Error(`${type} 类型未实现`)
        }
    }
}

function main() {
    let jscode = fs.readFileSync("./input.js") + ""
    let complier = new Complier(jscode);
    // ast 编译成指令
    complier.complie()
    // 输出常量表 指令
    console.log(complier.instList,)
    console.log(complier.poolList,)
    console.log(complier.instdec,)
    vmFunc(complier.instList, complier.poolList);
    // console.log(jscode)
}

//  解释器
function vmFunc(instlist, pooList) {
    function vm(pc, stack) {
        stack = stack || [];
        const variables = [];
        while (1) {
            let inst = instlist[pc++]

            if (inst === undefined) {
                let res = stack.pop()
                console.log(`计算结果: ${res}`);
                console.log("变量存储:", variables);
                return res
            }

            let right, left;
            switch (inst) {
                case INST.PUSH:
                    let poolIndex = instlist[pc++]
                    stack.push(pooList[poolIndex])
                    break;

                // 算术运算
                case INST.ADD:
                    stack.push(stack.pop() + stack.pop());
                    break;
                case INST.SUB:
                    right = stack.pop();
                    stack.push(stack.pop() - right);
                    break;
                case INST.MUL:
                    stack.push(stack.pop() * stack.pop());
                    break;
                case INST.DIV:
                    right = stack.pop();
                    if (right === 0) throw new Error("除数不能为零");
                    stack.push(stack.pop() / right);
                    break;
                case INST.MOD:
                    right = stack.pop();
                    stack.push(stack.pop() % right);
                    break;

                // 比较运算
                case INST.GT:
                    right = stack.pop();
                    stack.push(stack.pop() > right ? 1 : 0);
                    break;
                case INST.LT:
                    right = stack.pop();
                    stack.push(stack.pop() < right ? 1 : 0);
                    break;
                case INST.EQ:
                    stack.push(stack.pop() === stack.pop() ? 1 : 0);
                    break;
                case INST.NEQ:
                    stack.push(stack.pop() !== stack.pop() ? 1 : 0);
                    break;
                case INST.GTE:
                    right = stack.pop();
                    stack.push(stack.pop() >= right ? 1 : 0);
                    break;
                case INST.LTE:
                    right = stack.pop();
                    stack.push(stack.pop() <= right ? 1 : 0);
                    break;

                // 位运算
                case INST.LSHIFT:
                    right = stack.pop();
                    stack.push(stack.pop() << right);
                    break;
                case INST.RSHIFT:
                    right = stack.pop();
                    stack.push(stack.pop() >> right);
                    break;
                case INST.BAND:
                    stack.push(stack.pop() & stack.pop());
                    break;
                case INST.BOR:
                    stack.push(stack.pop() | stack.pop());
                    break;
                case INST.BXOR:
                    stack.push(stack.pop() ^ stack.pop());
                    break;
                case INST.BNOT:
                    stack.push(~stack.pop());
                    break;

                case INST.STORE: {
                    const varIndex = instlist[pc++];
                    variables[varIndex] = stack.pop();
                    break;
                }

                case INST.LOAD: {
                    const varIndex = instlist[pc++];
                    stack.push(variables[varIndex]);
                    break;
                }

                case INST.NEW_ARRAY: {
                    const length = instlist[pc++];
                    const elements = [];
                    for (let i = 0; i < length; i++) {
                        elements.unshift(stack.pop());
                    }
                    stack.push(elements);
                    break;
                }

                case INST.NEW_OBJECT: {
                    const propCount = instlist[pc++];
                    const obj = {};
                    for (let i = 0; i < propCount; i++) {
                        const key = stack.pop();
                        const value = stack.pop();
                        obj[key] = value;
                    }
                    stack.push(obj);
                    break;
                }

                case INST.GET_PROP: {
                    const key = stack.pop();
                    const obj = stack.pop();
                    stack.push(obj[key]);
                    break;
                }

                case INST.SET_PROP: {
                    const value = stack.pop();
                    const key = stack.pop();
                    const obj = stack.pop();
                    obj[key] = value;
                    stack.push(value);
                    break;
                }

                case INST.ASSIGN: {
                    const varIndex = instlist[pc++];
                    variables[varIndex] = stack.pop();
                    stack.push(variables[varIndex]); // 赋值表达式返回值
                    break;
                }

                case INST.STORE_ELEM: {
                    const value = stack.pop();
                    const key = stack.pop();
                    const obj = stack.pop();
                    obj[key] = value;
                    stack.push(value); // 赋值表达式返回值
                    break;
                }

                default:
                    console.log("当前栈:", stack);
                    console.log("变量存储:", variables);
                    throw new Error(`未知指令: ${inst}`)
            }
        }
    }

    return vm(0)
}

main()