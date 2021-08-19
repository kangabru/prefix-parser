/** Throws an error is the given condition is not true. Used for validating developer inputs. */
export function assert(check: boolean, message: string) {
    if (!check) throw Error(`Assert error: ${message}`)
}

/** Throws an error if the given argument value is not greater than or equal to 0. */
export function assertPositive(argValue: number) {
    assert(argValue >= 0, `Argument with value '${argValue}' must be positive`)
}

/** Throws an error if the given argument value is not greater than or equal to the bound value. */
export function assertGreaterThan(argValue: number, boundValue: number) {
    assert(argValue > boundValue, `Argument with value '${argValue}' must be greater than '${boundValue}'`)
}

/** Converts a numeric argument value to be a positive integer that (including 0). */
export function intArg(num: number) {
    return Math.abs(Math.round(num))
}

export function isVoid(val: any) {
    return val === null || val === undefined
}

export function isPopulated(val: any) {
    return !isVoid(val)
}

export function isNum(val: any) {
    return typeof val === 'number'
}