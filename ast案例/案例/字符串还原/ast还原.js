let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let ast = parse(`
call = function (k) {
      I['send'](X(k["toString"]() + ("|python-" + 'spid' + 'er.c' + 'om|y' + 'uanr' + 'enxu' + 'e.co' + 'm|大威' + '天龙，大' + '罗法咒'))), $("#page")["paging"]({
        'nowPage': k,
        'pageNum': 0x64,
        'buttonNum': 0x7,
        'canJump': 0x1,
        'showOne': 0x1,
        'callback': function (n) {
          call(n);
        }
      });
    }`)

traverse(ast, {
    BinaryExpression: {exit:
    function (path){
        let left = path.get("left").node.value
        let right = path.get("right").node.value
        if(path.get("left").isStringLiteral() && path.get("right").isStringLiteral()){
            path.replaceInline(types.valueToNode(left + right))
        }
    }}
})


let output = generate(ast).code

fs.writeFileSync("output.js", output)