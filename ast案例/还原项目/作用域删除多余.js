let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("output/2.2.js", "utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});


traverse(ast, {
  Program: {
    exit(path) {
      // 现在整个 AST 的作用域树已经完整
      path.traverse({
        VariableDeclarator(innerPath) {
          const name = innerPath.node.id.name;
          const binding = innerPath.scope.getBinding(name);

          if(!binding || binding.referenced){
            return
          }
          // 没有被引用 被改变
          if(binding.constant){
            path.remove()
          }

          if(binding.constantViolations.length == 1 && binding.constantViolations[0] == path){
            path.remove()
          }
        }
      });
    }
  }
});

let output = generate(ast).code

fs.writeFileSync("output/2.2.js", output)