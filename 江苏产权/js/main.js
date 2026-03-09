require('./js/env.js')
require('./js/ts.js')


const cookieValue = document.cookie.match(/^\s*jDwkDWjIm6GRP=([^;]*)/)?.[1];
console.log(cookieValue)
console.log(cookieValue.length)
function get_rs6(){
    const cookieValue = document.cookie.match(/^\s*jDwkDWjIm6GRP=([^;]*)/)?.[1];
console.log(cookieValue || "Cookie 不存在或不在首位");
return cookieValue
}
// 257

