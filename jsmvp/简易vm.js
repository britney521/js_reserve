function vmFunc(instlist){
    function vm(pc,stack){
        stack = stack || [];
        while (1){
            let inst = instlist[pc++]
            if(inst === undefined){
                console.log(`stack ${stack}`);
                break
            }
            let right,left,top;
            switch (inst){
                case 1:
                    stack.push(instlist[pc++]);
                    break
                case 2:
                    right = stack.pop()
                    left = stack.pop()
                    stack.push(left*right);
                    break
                case 3:
                    right = stack.pop()
                    left = stack.pop()
                    stack.push(left+right);
                    break
                case 4:
                    top = stack.pop()
                    console.log(`top ${top}`);
                    break
                default:
                    console.log(`${inst}未实现`);
                    console.log(`stack ${stack}`);

                    throw {};
            }
        }
    }
    vm(0)
}
// 2*5+8
// vmFunc([1,2,1,5,2,1,8,3,4])

// 2*5+8+2+3
vmFunc([1,2,1,5,2,1,8,3,1,2,3,1,3,3,4])