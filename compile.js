const script = `+ 1 #[2] #[3]`

var inkjs = require("inkjs")

const comped = new inkjs.Compiler(script).Compile().ToJson()

console.log(comped)