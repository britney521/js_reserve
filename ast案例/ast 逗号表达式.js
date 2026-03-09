const processSequenceExpression = {
   ExpressionStatement: {
        exit(path) {
           let {node} = path;
           //保存所有的节点
           let nodes = [];
           //别忘了判断节点类型，可能会死循环
           if (!types.isSequenceExpression(node.expression)) {
               return
            }
           //为每个节点生成一个ExpressionStatement节点
           for (const expression of node.expression.expressions) {
                nodes.push(types.expressionStatement(expression));
            }
           //替换原来的节点
            path.replaceWithMultiple(nodes);
        }
    }
}
traverse(ast, processSequenceExpression);