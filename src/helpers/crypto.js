const crypto = require('crypto')

const key1 = crypto.randomBytes(32).toString('hex')
const key2 = crypto.randomBytes(32).toString('hex')
console.log(JSON.stringify({ key1, key2 }))

module.exports = {
    key1,
    key2
}