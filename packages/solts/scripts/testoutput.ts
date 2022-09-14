import SolTS from "../src/main";


const solCode = new SolTS(`
    contract Test {
        uint i = 10;

        constructor() {
            
        }

        function test() public {
            uint x = "1";

            for(uint i = 0; i < 100; i++){
                //
            }
        }
    }
`)

solCode.transpile()