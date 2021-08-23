import { NameArg } from "../types";
import { assert, isNum, isPopulated, isVoid } from "../utils";
import BaseArg, { ArgParseResponse } from "./base";

type NumberOpts = { min?: number, max?: number, float?: boolean }
type NumberArgs = [...NameArg, NumberOpts]

type MinMaxArgs = [...args: NameArg, opts?: { min?: number, max?: number }]
export type IntegerArgs = MinMaxArgs
export type FloatArgs = MinMaxArgs

/** Matches the next valid number using 'parseInt' and 'parseFloat' for the respective type. */
class NumberArg<T = number> extends BaseArg<T> {
    min?: number; max?: number; float: boolean;

    constructor(...[name, { min, max, float }]: NumberArgs) {
        super(name)
        this.float = float ?? false
        this.min = (float || isVoid(min)) ? min : Math.floor(min!)
        this.max = (float || isVoid(max)) ? max : Math.floor(max!)

        if (isPopulated(min)) assert(isNum(min), `Value '${min}' must be a number`)
        if (isPopulated(max)) assert(isNum(max), `Value '${max}' must be a number`)
        if (isPopulated(min) && isPopulated(max))
            assert(min! < max!, `Min value '${min}' must be less than '${max}'`)
    }

    parse(text: string): ArgParseResponse<T> {
        const re = /^-?[\d\.]+/g // Look for numbers like -5, 5, -5.0, 5.0
        const matches = text.trim().match(re)
        if (!matches) throw Error("Number not found")
        const match = matches[0]

        const rest = text.replace(match, '').trim()
        const value = this.float ? parseFloat(match) : parseInt(match)

        if (value === NaN) throw Error(`Number '${match}' could not be parsed as a number.`)
        if (this.min !== null && value < this.min!) throw Error(`'${match}' cannot be less than '${this.min}'.`)
        if (this.max !== null && value > this.max!) throw Error(`'${match}' cannot be more than '${this.max}'.`)

        return [value as any, rest]
    }

    help() {
        const type = this.float ? 'float' : 'int'
        const hasMin = isNum(this.min), hasMax = isNum(this.max)
        const hasBoth = hasMin && hasMax
        const extra = hasBoth ? ` ${this.min}~${this.max}`
            : hasMin ? ` >${this.min}`
                : hasMax ? ` <${this.max}`
                    : ''
        return `<${this.name} {${type}${extra}}>`
    }

    example() {
        const min = this.min ?? 0
        const max = this.max ?? 100
        return Math.floor((min + max) / 2).toString()
    }
}

/** Matches an integer. Numbers like '12.34' will be converted to an int like '12'. */
export class IntegerArg extends NumberArg {
    constructor(...[name, opts]: IntegerArgs) {
        super(name, { ...opts, float: false })
    }
}


/** Matches a float. */
export class FloatArg extends NumberArg {
    constructor(...[name, opts]: FloatArgs) {
        super(name, { ...opts, float: true })
    }

    example() {
        const min = this.min ?? 0.0
        const max = this.max ?? 100.0
        return ((min + max) / 2).toFixed(2)
    }
}