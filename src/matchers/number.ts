import BaseArg, { ParseResponse } from "./base";

type MinMaxArgs = [name: string, min?: number, max?: number]
type NumberArgs = [name: string, min?: number, max?: number, float?: boolean]

/** Matches the next valid number using 'parseInt' and 'parseFloat' for the respective type. */
class NumberArg<T = number> extends BaseArg<T> {
    name: string; min: number; max: number; float: boolean;

    constructor(...[name, min, max, float = false]: NumberArgs) {
        super(name)
        this.min = min
        this.max = max
        this.float = float
    }

    parse(text: string): ParseResponse<T> {
        const re = /^-?[\d\.]+/g // Look for numbers like -5, 5, -5.0, 5.0
        const matches = text.trim().match(re)
        if (!matches) throw Error("Number not found")
        const match = matches[0]

        const rest = text.replace(match, '').trim()
        const value = this.float ? parseFloat(match) : parseInt(match)

        if (value === NaN) throw Error(`Number '${match}' could not be parsed as a number.`)
        if (this.min !== null && value < this.min) throw Error(`'${match}' cannot be less than '${this.min}'.`)
        if (this.max !== null && value > this.max) throw Error(`'${match}' cannot be more than '${this.max}'.`)

        return [value as any, rest]
    }
}

export type IntegerArgs = MinMaxArgs

/** Matches an integer. Numbers like '12.34' will be converted to an int like '12'. */
export class IntegerArg extends NumberArg {
    constructor(...[name, min, max]: IntegerArgs) {
        super(name, min, max)
    }
}

export type FloatArgs = MinMaxArgs

/** Matches a float. */
export class FloatArg extends NumberArg {
    constructor(...[name, min, max]: FloatArgs) {
        super(name, min, max, true)
    }
}