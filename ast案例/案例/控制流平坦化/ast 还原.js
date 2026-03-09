let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let ast = parse(`
while (!![]) {
    switch (z[o++]) {
        case '0':
            var d0 = O['FHHZF'];
            continue;
        case '1':
            datas = K['data'];
            continue;
        case '2':
            K = JSON['parse'](O['zVfcR'](c, O['zVfcR'](btoa, O['nrZNf'](i, K))));
            continue;
        case '3':
            '';
            continue;
        case '4':
            $['each'](datas, function (d1, d2) {
                var d3 = O['jxmTX'](O['jxmTX']('<td\x20class=\x22info\x22>', d2['value']), O['zJGlq']);
                d0 += d3;
            });
            continue;
        case '5':
            O['OjnEu']($, O['wUpcq'])['text']('')['append'](O['jxmTX'](d0, O['fbzwm']));
            continue;
        case '6':
            console['log'](O['zVfcR'](btoa, i(K)));
            continue;
    }
    break;
}`)

// 第一步看变量 a 放入内存
memory = {};
var O = {
    'jxmTX': function (K, z) {
        return J['cnlES'](K, z);
    },
    'zJGlq': J['wHMQT'],
    'BwQrh': J['KPlxS'],
    'FHHZF': J['wDbRF'],
    'zVfcR': function (K, z) {
        return J['aBCOr'](K, z);
    },
    'nrZNf': function (K, z) {
        return J['uhAav'](K, z);
    },
    'OjnEu': function (K, z) {
        return J['aBCOr'](K, z);
    },
    'wUpcq': J['kFJjX'],
    'fbzwm': J['xNObd'],
    'EZyPx': J['hCaVp'],
    'dDJgV': function (K, z) {
        return J['aBCOr'](K, z);
    }
};
var z = '6|3|2|0|1|4|5'['split']('|')

var control = []
traverse(ast, {
    "SwitchCase": function (path) {
        // control.push(path.get('consequent.0').toString())
        control[path.get("test.value").node] = path.get('consequent.0').toString()
    }
})
// 将 控制流 平坦化 替换成 while
traverse(ast, {
    "WhileStatement": function (path) {
        let new_jscode = ""
        for (let i in z) {
            new_jscode += control[i]
        }
        path.replaceInline(parse(new_jscode))
    }
})


// 还原o['']
traverse(ast, {
    "CallExpression": {
        exit: function (path) {
            if(path.get("callee.object").node && ["O"].indexOf(path.get("callee.object").node.name) !== -1){
                for (let i of memory[path.get("callee.object").node.name].get("init.properties")){
                    if (path.get("callee").node && path.get("callee.property").node && i.node.key.value === path.get("callee.property").node.value){
                         // 操作符
                        if(i.get("value.body.body.0.argument").type === "BinaryExpression"){
                            let operator = i.get("value.body.body.0.argument").node.operator
                            let left = path.get("arguments.0").node
                            let right = path.get("arguments.1").node
                            path.replaceInline(types.binaryExpression(operator, left, right))
                        } else if(i.get("value.body.body.0.argument").type === "CallExpression"){
                            // console.log(path.toString())
                            let function_path = path.get("arguments.0").node
                            let function_arguments = path.node.arguments.slice(1)
                            path.replaceInline(types.callExpression(function_path, function_arguments))
                        }

                    }
                     // 函数
                }
            }
        }
    }
})
// 还原字符串编码
// traverse(ast, {
//     "StringLiteral": function (path){
//         if(path.node.extra){
//             // delete path.node.extra.raw
//             path.node.extra.raw = "'" + path.node.value + "'"
//             // path.node.extra = void 0
//         }
//     }
// })


let output = generate(ast).code

fs.writeFileSync("output.js", output)