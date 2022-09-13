import expressionDefinitions from "./expressionMakers";

import * as solidityParse from "@solidity-parser/parser"

export class TranspileToTS {
    static TS(exp: any): string {
        // console.log(exp)

        const expFunc = expressionDefinitions[exp.type]

        if (expFunc === undefined) {
            throw new Error(`Expression unknown (${exp.type})`)
        }

        return expFunc.call(TranspileToTS, exp)
    }

    static SolTS(exp: any): string {
        return exp.children.map(this.TS).join(" ")
    }
}


class SolTS {
    #astTree: any

    #beforeHooks = []
    #afterHooks = []

    #transpiledCode = ""

    constructor(code: string) {
        this.#astTree = solidityParse.parse(code)
    }

    transpile() {
        let _transpiled = this.#beforeHooks.join(' ')

        _transpiled += TranspileToTS.SolTS(this.#astTree)

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