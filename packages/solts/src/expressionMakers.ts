import * as exp from "constants"
import { TS } from "./main"
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
    ["ContractDefinition"]: function (parent, expr: any) {

        return `class ${expr.name} { ${expr.subNodes.map((node) => TS(parent, node)).join(" ")} }`
    },
    ["StateVariableDeclaration"]: function (parent, expr: any) {
        const initialValue = expr.initialValue === null ? "" : TS(parent, expr.initialValue)

        parent.contractsData[parent.currentContractName].variables[expr.variables[0].name] = true

        return `${expr.variables.map((vars) => TS(parent, vars)).join(" ")} ${initialValue};`
    },
    ["Block"]: function (parent, expr: any) {
        return `{ ${expr.statements.map((stmnts) => TS(parent, stmnts)).join(" ")} }`
    },
    ["FunctionDefinition"]: function (parent, expr: any) {
        const funcName = expr.name === null ? "constructor" : expr.name

        return `${funcName} (${expr.parameters.map((par: any) => `${par.name}`).join(",")}) ${TS(parent, expr.body)}`
    },
    ["NumberLiteral"]: function (parent, expr: any) {
        return `${expr.number}`
    },
    ["StringLiteral"]: function (parent, expr: any) {
        return `"${expr.value}"`
    },
    ["VariableDeclarationStatement"]: function (parent, expr: any) {
        return `let ${expr.variables.map((vars) => TS(parent, vars)).join(" ")} ${TS(parent, expr.initialValue)};`
    },
    ["VariableDeclaration"]: function (parent, expr: any) {

        const varDeclrOnType = (() => {
            if (expr.typeName.type === "Mapping") {
                // console.log("map", expr)
                // console.log(expr)
                parent.contractsData[parent.currentContractName].mappingVariables[expr.name] = true

                return `new Map<${getTypeByName(expr.typeName.keyType.name)()}, ${getTypeByName(expr.typeName.valueType.name)()}>()`
            }

            return ""
        })()

        return `${expr.name} = ${varDeclrOnType}`
    },
    ["IfStatement"]: function (parent, expr: any) {
        let str = `if (${TS(parent, expr.condition)}) ${TS(parent, expr.trueBody)}`

        if (expr.falseBody !== null) {
            str += `else ${TS(parent, expr.falseBody)}`
        }

        return str
    },
    ["BinaryOperation"]: function (parent, expr: any) {

        if (expr.left.type === "IndexAccess" && expr.operator === "=") {
            const mapExists = parent.contractsData[parent.currentContractName].mappingVariables[expr.left.base.name]

            if (mapExists === undefined || !mapExists) {
                throw new Error(`Mapping with the name ${expr.left.base.name} isn't present in the contract ${parent.currentContractName}`)
            }

            return `this.${expr.left.base.name}.set(${TS(parent, expr.left.index)}, ${TS(parent, expr.right)})`
        }

        if (expr.left.type === "Identifier") {
            return `${TS(parent, expr.left)} ${expr.operator} ${TS(parent, expr.right)};`
        }

        return `${TS(parent, expr.left)} ${expr.operator} ${TS(parent, expr.right)}`
    },
    ["WhileStatement"]: function (parent, expr: any) {
        return `while (${TS(parent, expr.condition)}) ${TS(parent, expr.body)}`
    },
    ["ForStatement"]: function (parent, expr: any) {
        return `for (${TS(parent, expr.initExpression)} ${TS(parent, expr.conditionExpression)} ; ${TS(parent, expr.loopExpression)}) ${TS(parent, expr.body)}`
    },
    ["Identifier"]: function (parent, expr: any) {
        const variableExists = parent.contractsData[parent.currentContractName].variables[expr.name]

        if (variableExists !== undefined || variableExists) {
            return `this.${expr.name}`
        }

        return `${expr.name}`
    },
    ["ExpressionStatement"]: function (parent, expr: any) {

        return `${TS(parent, expr.expression)}`
    },
    ["UnaryOperation"]: function (parent, expr: any) {
        return `${TS(parent, expr.subExpression)}${expr.operator}`
    },
    ["NewExpression"]: function (parent, expr: any) {
        return `new ${TS(parent, expr.typeName)}`
    },
    ["ReturnStatement"]: function (parent, expr: any) {

        return `return ${TS(parent, expr.expression)};`
    },
    ["MemberAccess"]: function (parent, expr: any) {
        return `${TS(parent, expr.expression)}.${expr.memberName}`
    },
    ["FunctionCall"]: function (parent, expr: any) {
        return ` ${TS(parent, expr.expression)}(${expr.arguments.map((arg) => TS(parent, arg)).join(",")})`
    },
    ["ArrayTypeName"]: function (parent, expr: any) {
        return `Array`
    },
    ["IndexAccess"]: function (parent, expr: any) {
        console.log("index:", expr)

        const mapExists = parent.contractsData[parent.currentContractName].mappingVariables[expr.base.name]

        if (mapExists !== undefined || mapExists) {
            return `this.${expr.base.name}.get(${TS(parent, expr.index)})`
        }

        return `TODO//`
    },
    ["Mapping"]: function (parent, expr: any) {

        return ``
    },
    ["TupleExpression"]: function (parent, expr: any) {
        return `[${expr.components.map(TS).toString()}]`
    },
}


export default expressionDefinitions