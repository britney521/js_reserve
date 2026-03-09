let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("ob.js", "utf-8")
// 解析代码为 AST
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});

const transform_literal = {
  NumericLiteral({node}) {
    if (node.extra && /^0[obx]/i.test(node.extra.raw)) {
      node.extra = undefined;
    }
  },
  StringLiteral({node})
  {
    if (node.extra && /\\[ux]/gi.test(node.extra.raw)) {
      node.extra = undefined;
    }
  },
}

traverse(ast,transform_literal);


const constantFold = {
    "BinaryExpression|UnaryExpression"(path) {
        if(path.isUnaryExpression({operator:"-"}) ||
    	   path.isUnaryExpression({operator:"void"}))
    	{
    		return;
    	}
        const {confident, value} = path.evaluate();
        if (!confident)
            return;
        if (typeof value == 'number' && (!Number.isFinite(value))) {
            return;
        }
        path.replaceWith(types.valueToNode(value));
    },
}

traverse(ast, constantFold);


function isBaseLiteral(node) {
    if (types.isLiteral(node)) {
        return true;
    }
    if (types.isUnaryExpression(node, {operator: "-"}) ||
        types.isUnaryExpression(node, {operator: "+"})) {
        return isBaseLiteral(node.argument);
    }

    return false;
}


const decodeObject =
{
    VariableDeclarator(path) {
        let { node, scope } = path;
        const { id, init } = node;
        if (!types.isObjectExpression(init)) return;

        let properties = init.properties;
        if (properties.length == 0 || !properties.every(property => isBaseLiteral(property.value)))
            return;

        let binding = scope.getBinding(id.name);

        let { constant, referencePaths } = binding;
        if (!constant) return;

        let newMap = new Map();
        for (const property of properties) {
            let { key, value } = property;
            newMap.set(key.value, value);
        }

        let canBeRemoved = true;
        for (const referPath of referencePaths) {
            let { parentPath } = referPath;
            if (!parentPath.isMemberExpression()) {
                canBeRemoved = false;
                return;
            }

            let AncestorPath = parentPath.parentPath;

            if (AncestorPath.isAssignmentExpression({"left":parentPath.node}))
            {
            	  canBeRemoved = false;
                return;
            }
            if (AncestorPath.isUpdateExpression() && ['++','--'].includes(AncestorPath.node.operator))
            {
            	  canBeRemoved = false;
                return;
            }

            let curKey = parentPath.node.property.value;
            if (!newMap.has(curKey)) {
                canBeRemoved = false;
                break;
            }
            parentPath.replaceWith(newMap.get(curKey));
        }
        canBeRemoved && path.remove();
        newMap.clear();
    },
}


traverse(ast, decodeObject);

// var code = '';
// traverse(ast,{
//     VariableDeclarator:function (path){
//         let { node, scope,parentPath } = path
//         const { id, init } = node;
//         if (!types.isObjectExpression(init)) return;
//            console.log('66666')
//         code += parentPath.toString()
//     }
// })
// eval(code)
// console.log(MX.k)

let output = generate(ast).code
// console.log(output)
fs.writeFileSync("output.js", output)