let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let ast = parse(`
function name(){
    var var_3 = var_1.$_Ct,
          var_4 = ["$_CEEN"].concat(var_3),
          var_5 = var_4[1];
        var_4.shift();
        var var_6 = var_4[0];
        function n(var_2) {
          var var_4 = var_1.$_DL()[0][10];
          for (; var_4 !== var_1.$_DL()[0][9];) {
            switch (var_4) {
              case var_1.$_DL()[0][10]:
                return 0 < var_2[var_3(69)](var_3(47)) ? s(var_2) ? s(var_2) : n(var_2[var_3(85)](0, var_2[var_3(97)](var_5(47)))) : s(var_2) ? s(var_2) : var_5(75);
                break;
            }
          }
        }
}`)




traverse(ast, {
  CallExpression(path) {
    const callee = path.node.callee;
    console.log(path.toString(),'111111')
    if (callee.type === 'Identifier') {
      const binding = path.scope.getBinding(callee.name);

      if (binding && binding.referenced) {
        // 找到这个变量的声明
        const declaration = binding.path;

        if (declaration.isVariableDeclarator()) {
          const init = declaration.node.init;

          // 检查是否是 var_1.$_Ct
          if (init &&
              init.type === 'MemberExpression' &&
              init.object && init.object.name === 'var_1' &&
              init.property && init.property.name === '$_Ct') {

            console.log(`找到 $_Ct 函数调用: ${generate(path.node).code}`);

          }

          // 检查是否是数组元素的引用（如 var_5 = var_4[1]）
          else if (init && init.type === 'MemberExpression' &&
                   init.object && init.object.type === 'Identifier') {

            const arrayName = init.object.name;
            const arrayBinding = path.scope.getBinding(arrayName);

            if (arrayBinding) {
              const arrayInit = arrayBinding.path.node.init;

              // 检查数组是否是 ["$_CEEN"].concat(var_3) 形式
              if (arrayInit && arrayInit.type === 'CallExpression' &&
                  arrayInit.callee.property &&
                  arrayInit.callee.property.name === 'concat') {

                const concatArgs = arrayInit.arguments;
                if (concatArgs.length === 1 &&
                    concatArgs[0].type === 'Identifier') {

                  const ctVarName = concatArgs[0].name;
                  const ctBinding = path.scope.getBinding(ctVarName);

                  // 确认 concat 的参数是 var_1.$_Ct
                  if (ctBinding && ctBinding.path.node.init &&
                      ctBinding.path.node.init.type === 'MemberExpression' &&
                      ctBinding.path.node.init.object.name === 'var_1' &&
                      ctBinding.path.node.init.property.value === '$_Ct') {

                    console.log(`找到 $_Ct 别名调用: ${generate(path.node).code}`);

                  }
                }
              }
            }
          }
        }
      }
    }
  }
});



let output = generate(ast).code
// console.log(output)



