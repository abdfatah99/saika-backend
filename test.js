const functionA = (paramA, paramB) => { return paramA + paramB }

const result = functionA("selamat", "datang", (paramC) => { console.log(`result from paramC: ${paramC}`) })

console.log(result)