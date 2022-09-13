import { TranspileToTS } from "./main";


export type ExpressionDefinitions = {
    [key: string]: (this: typeof TranspileToTS, expr: any) => string
}