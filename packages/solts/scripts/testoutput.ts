import SolTS from "../src/main";


const solCode = new SolTS(`
    contract Test {
        uint i = 100;

       function test() {
            uint a = 10;

            i = 100;

            a = 10;
       }
    }
`)

solCode.transpile()