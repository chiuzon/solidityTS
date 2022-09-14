import { TranspileToTS } from "./main";


export type ExpressionDefinitions = {
    [key: string]: (parent: TranspileToTS, expr: any) => string
}