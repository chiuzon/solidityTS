import * as exp from "constants"
import { ExpressionDefinitions } from "./type"
import { logInfo } from "./utils"

const elementaryTypeAlias = {
    ["address"]: (type) => { return 'string' },
    ["uint"]: (type) => { return 'number' }
}

function getTypeByName(name: string) {
    const typeDecl = elementaryTypeAlias[name]

    if (typeDecl === undefined) {
        throw new Error("Type Not Supported!")
    }

    return typeDecl
}

const expressionDefinitions: ExpressionDefinitions = {
    ["ContractDefinition"]: function (this, expr: any) {
        return `class ${expr.name} { ${expr.subNodes.map(this.TS).join(" ")} }`
    },
    ["StateVariableDeclaration"]: function (this, expr: any) {


        const initialValue = expr.initialValue === null ? "" : this.TS(expr.initialValue)

        return `${expr.variables.map(this.TS).join(" ")} ${initialValue};`
    },
    ["Block"]: function (this, expr: any) {
        return `{ ${expr.statements.map(this.TS).join(" ")} }`
    },
    ["FunctionDefinition"]: function (this, expr: any) {
        const funcName = expr.name === null ? "constructor" : expr.name

        return `${funcName} (${expr.parameters.map((par: any) => `${par.name}`).join(",")}) ${this.TS(expr.body)}`
    },
    ["NumberLiteral"]: function (this, expr: any) {
        return `${expr.number}`
    },
    ["StringLiteral"]: function (this, expr: any) {
        return `"${expr.value}"`
    },
    ["VariableDeclarationStatement"]: function (this, expr: any) {
        return `let ${expr.variables.map(this.TS).join(" ")} = ${this.TS(expr.initialValue)};`
    },
    ["VariableDeclaration"]: function (this, expr: any) {

        const varDeclrOnType = (() => {
            if (expr.typeName.type === "Mapping") {
                return `new Map<${getTypeByName(expr.typeName.keyType.name)()}, ${getTypeByName(expr.typeName.valueType.name)()}>()`
            }

            return ""
        })()

        return `${expr.name} = ${varDeclrOnType}`
    },
    ["IfStatement"]: function (this, expr: any) {
        let str = `if (${this.TS(expr.condition)}) ${this.TS(expr.trueBody)}`

        if (expr.falseBody !== null) {
            str += `else ${this.TS(expr.falseBody)}`
        }

        return str
    },
    ["BinaryOperation"]: function (this, expr: any) {
        return `${this.TS(expr.left)} ${expr.operator} ${this.TS(expr.right)}`
    },
    ["WhileStatement"]: function (this, expr: any) {
        return `while (${this.TS(expr.condition)}) ${this.TS(expr.body)}`
    },
    ["ForStatement"]: function (this, expr: any) {
        return `for (${this.TS(expr.initExpression)} ${this.TS(expr.conditionExpression)} ; ${this.TS(expr.loopExpression)}) ${this.TS(expr.body)}`
    },
    ["Identifier"]: function (this, expr: any) {
        return `${expr.name}`
    },
    ["ExpressionStatement"]: function (this, expr: any) {
        return `${this.TS(expr.expression)}`
    },
    ["UnaryOperation"]: function (this, expr: any) {
        return `${this.TS(expr.subExpression)}${expr.operator}`
    },
    ["NewExpression"]: function (this, expr: any) {
        return `new ${this.TS(expr.typeName)}`
    },
    ["ReturnStatement"]: function (this, expr: any) {
        return `return ${this.TS(expr.expression)};`
    },
    ["MemberAccess"]: function (this, expr: any) {
        return `${this.TS(expr.expression)}.${expr.memberName}`
    },
    ["FunctionCall"]: function (this, expr: any) {
        return ` ${this.TS(expr.expression)}(${expr.arguments.map(this.TS).join(",")})`
    },
    ["ArrayTypeName"]: function (this, expr: any) {
        return `Array`
    },
    ["Mapping"]: function (this, expr: any) {

        return ``
    },
    ["TupleExpression"]: function (this, expr: any) {
        return `[${expr.components.map(this.TS).toString()}]`
    },
}


export default expressionDefinitions