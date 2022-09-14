import SolTS from "../src/main";


const solCode = new SolTS(`
    contract Test {
       mapping(address => uint) myMap;

    }
`)

solCode.transpile()