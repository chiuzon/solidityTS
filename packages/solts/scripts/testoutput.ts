import SolTS from "../src/main";


const solCode = new SolTS(`
    contract Test {
       uint[] arr2 = [1, 2, 3];

       function test() {
         uint[] arr2 = [1, 2, 3];
       }
    }
`)

solCode.transpile()