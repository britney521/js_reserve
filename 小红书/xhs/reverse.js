require('./env.js')
require('./loadMnsv2.js')
require('./Mnsv2Init.js')

c = '/api/redcaptcha/v2/getconfig{}'
d = '701d7db129f79737abc1c57cc97e69da'
console.log(window.mnsv2(c, d))
