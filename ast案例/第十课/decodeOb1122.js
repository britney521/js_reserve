/*****************************************************
Module name:decode_obfuscator.js
Author:悦来客栈的老板
Date:2022.09.08
Version:V2.0.6

混淆工具地址:https://obfuscator.io/

脚本仅用于被obfuscator混淆了的代码，不支持商业工具混淆的代码

声明:

脚本仅用于学习研究，禁止非法使用，否则后果自负！


使用方法可以观看在线视频:

https://www.bilibili.com/video/BV16V411H7yz

欢迎购买AST星球共同学习交流

星球地址:

https://t.zsxq.com/FMRf2ZV

本人微信:523176585

*****************************************************/

const fs         = require('fs');
const parser        = require("@babel/parser");
const traverse      = require("@babel/traverse").default;
const types         = require("@babel/types");
const generator     = require("@babel/generator").default;



//js混淆代码读取
process.argv.length > 2 ? encodeFile = process.argv[2]: encodeFile ="./encode.js";
process.argv.length > 3 ? decodeFile = process.argv[3]: decodeFile ="./decodeResult.js";

//将源代码解析为AST
let sourceCode = fs.readFileSync(encodeFile, {encoding: "utf-8"});

let ast    = parser.parse(sourceCode);


console.time("处理完毕，耗时");



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


const member_property_literals = {
  MemberExpression:
  {
    exit({node})
    {
      const prop = node.property;
      if (!node.computed && types.isIdentifier(prop))
      {
        node.property = types.StringLiteral(prop.name);
        node.computed = true;
      }
    }
  },  
  ObjectProperty: 
  {
    exit({node})
    {
      const key = node.key;
      if (!node.computed && types.isIdentifier(key))
      {
        node.key = types.StringLiteral(key.name);
      }
    }
  },  
}

traverse(ast, member_property_literals);

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

/*
function judge (ele) {
	return types.isNumericLiteral(ele.value);
}

const decodeObj = 
{
	VariableDeclarator(path)
	{
		let {scope,node} = path;
		
		let {id,init} = node;
		
		if (!types.isIdentifier(id) || !types.isObjectExpression(init))
		{
			return;
		}
		
		let {properties} = init;
		
		if (properties.length == 0 || !properties.every(judge))
		{
			return;
		}
		
		let binding =  scope.getBinding(id.name);
		
		if (!binding || !binding.constant)
		{
			return;
		}
		
		for (let property of properties)
		{
			let objKey = property.key.value;
			let objVal = property.value;  //这里不需要获取value,避免重复构造节点。
			
			for (let referPath of binding.referencePaths.reverse())
			{

				let {parentPath} = referPath;
				if (!parentPath.isMemberExpression())
				{
					continue;
				}
				
				if (types.isStringLiteral(parentPath.node.property,{"value":objKey}))
				{
					parentPath.replaceWith(objVal);
					break;
				}
			}
			
		}
		
		
	}
	
}



traverse(ast, decodeObj);
*/

  



console.timeEnd("处理完毕，耗时");


let {code} = generator(ast,opts = {jsescOption:{"minimal":true}});

fs.writeFile(decodeFile, code, (err) => {});