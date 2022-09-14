import expressionDefinitions from "./expressionMakers";

import * as solidityParse from "@solidity-parser/parser"
import { logInfo } from "./utils";

export interface ContractData {
    [key: string]: {
        mappingVariables: {
            [key: string]: boolean
        },
        variables: {
            [key: string]: boolean
        }
    }
}

export function TS(parent: TranspileToTS, exp: any): string {
    const expFunc = expressionDefinitions[exp.type]

    if (expFunc === undefined) {
        throw new Error(`Expression unknown (${exp.type})`)
    }

    return expFunc(parent, exp)
}

export class TranspileToTS {

    contractsData: ContractData = {}

    currentContractName = ""

    constructor() { }

    static TS(parent: TranspileToTS, exp: any): string {
        const expFunc = expressionDefinitions[exp.type]

        if (expFunc === undefined) {
            throw new Error(`Expression unknown (${exp.type})`)
        }

        return expFunc(parent, exp)
    }

    SolTS(exp: any): string {
        return exp.children.map((data) => {

            this.currentContractName = data.name

            this.contractsData[data.name] = {
                mappingVariables: {}, variables: {}
            }

            return TS(this, data)
        }).join(" ")
    }
}


class SolTS {
    #astTree: any

    #beforeHooks = []
    #afterHooks = []

    #transpiledCode = ""

    transpiler = new TranspileToTS()

    constructor(code: string) {
        this.#astTree = solidityParse.parse(code)
    }

    transpile() {
        let _transpiled = this.#beforeHooks.join(' ')

        _transpiled += this.transpiler.SolTS(this.#astTree)

        _transpiled += this.#afterHooks.join(' ')

        this.#transpiledCode = _transpiled

        console.log('[output]', this.#transpiledCode)
    }

    expose() {

    }

    contract(name: string) {

        function call() {

        }

        function get() {

        }

        return {
            call
        }
    }
}

export default SolTS