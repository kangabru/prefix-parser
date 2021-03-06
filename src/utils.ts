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

export function isVoid<T>(val: T): T extends void ? true : false {
    return (val === null || val === undefined || Number.isNaN(val)) as any
}

export function isPopulated<T>(val: T): T extends true ? true : false {
    return !isVoid(val) as any
}

export function isNum(val: any) {
    return typeof val === 'number' && isPopulated(val)
}

export function loremIpsum(wordCount: number) {
    const words = 'lorem ipsum dolor sit amet'.split(' ')
    return [...new Array(wordCount)].map((_, i) => words[i % words.length]).join(' ')
}

export function wrap(message: string, char: string) {
    return char + message + char
}

/** Removes each character in chars from text. */
export function clean(text: string, chars: string) {
    return chars.split('').reduce((out, char) => out.split(char).join(''), text)
}

export function formatDiscordHelp(title: string, usage: string, example: string): string {
    return [
        title,
        '',
        '***Help***',
        usage,
        '',
        '***Example***',
        example,
    ].join('\n')
}