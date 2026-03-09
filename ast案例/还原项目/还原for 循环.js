let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/for 循环.js", "utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});




let output = generate(ast).code

fs.writeFileSync("output/for 循环.js", output)