let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');


let ast = parse(`const a = 1000;
let b = 2000;
let obj = {
  name: 'mankvis',
  add: function (a) {
    a = 400;
    b = 300;
    let e = 700;

    function demo() {
      let d = 600;
    }

    demo();
    return a + a + b + 1000 + obj.name;
  },
}
obj.add(100);`)


function TestOwnBinding(path) {
  path.traverse({
    Identifier(p) {
      let name = p.node.name;
      console.log(name, !!p.scope.getOwnBinding(name));
    }
  });
}

traverse(ast, {
  Identifier(path) {
      // e 变量的作用域
    if (path.node.name === 'e') {
      // console.log(generate(path.scope.block).code)
    }
  },
    // 函数作用域
    FunctionDeclaration(path) {
    // console.log(generate(path.scope.parent.block).code)
  },
  //   FunctionDeclaration(path) {
  //   let bindingB = path.scope.getBinding('b');
  //   console.log(generate(bindingB.scope.block).code);
  // },
  FunctionExpression(path) {
    TestOwnBinding(path);
  },
  // 变量名混淆
  Identifier(path) {
    path.scope.rename(
      path.node.name,
      path.scope.generateUidIdentifier('_0x2ba6ea').name
    );
  },
  BlockStatement(path) {
    console.log('\n此块节点源码: \n', path.toString());
    let bindings = path.scope.bindings;
    console.log('作用域内被绑定数量:', Object.keys(bindings).length);
    for (const bindingsKey in bindings) {
      console.log('名字', bindingsKey);
      let binding_ = bindings[bindingsKey];
      console.log('类型:', binding_.kind);
      console.log('定义:', binding_.identifier);
      console.log('是否常量:', binding_.constant);
      console.log('被修改信息记录:', binding_.constantViolations);
      console.log('是否被引用:', binding_.referenced);
      console.log('被引用次数:', binding_.references);
      console.log('被引用信息NodePath记录', binding_.referencePaths);
    }
    console.log('-------------------------------------');
  },

})



let output = generate(ast).code
// console.log(output)



