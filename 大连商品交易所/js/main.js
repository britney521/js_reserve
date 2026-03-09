
require('./js/env.js')
require('./js/ts.js')
//
// require('./env.js')
// require('./code.js')

const cookieValue = document.cookie.match(/^\s*hNUS9DnJtejwT=([^;]*)/)?.[1];
console.log(cookieValue)
console.log(cookieValue.length)
function get_rs6(){
        const cookieValue = document.cookie.match(/^\s*hNUS9DnJtejwT=([^;]*)/)?.[1];
    console.log(cookieValue || "Cookie 不存在或不在首位");
    return cookieValue
}

// 321
