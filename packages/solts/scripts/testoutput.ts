import SolTS from "../src/main";


const solCode = new SolTS(`
    contract Test {
        uint[] i = [10, 20, 30];
        mapping(address => uint) x;

       function test() {
           console.log(i[0]);

           i.push(10);

           x["0x1"] = 10;

           console.log(x["0x1"]);
       }
    }
`)

solCode.exec()