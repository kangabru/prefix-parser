import { NameArg } from "../types"
import { assertGreaterThan, intArg, loremIpsum } from "../utils"
import BaseArg, { ArgParseResponse, ValidateIndexArgs } from "./base"
import { RegexArg } from "./regex"

export type TextArgs = NameArg
export type WordArgs = NameArg

type WordsOpts = { words?: number }
export type WordsArgs = [...args: NameArg, opts?: WordsOpts]

/**
 * Matches as much text as possible including characters a-z, spaces, - and _.
 *
 * @example
 * const args = prefix('!cmd').text('name').parse('!cmd Jim Bob! is my name')
 * console.log(args) // 'Jim Bob'
 */
export class TextArg<T = string> extends RegexArg<T> {
    constructor(...[name]: TextArgs) {
        super(name, /[a-zA-Z_-\s]+/, loremIpsum(2))
    }

    help() {
        return `<${this.name} {text}>`
    }
}

/**
 * Matches all remaining text including all characters.
 *
 * @example
 * const args = prefix('!cmd').text('name').parse('!cmd Jim Bob!')
 * console.log(args) // 'Jim Bob! is my name'
 */
export class RestArg<T = string> extends BaseArg<T> {
    parse(text: string): ArgParseResponse<T> {
        if (!text.length)
            throw Error("Text cannot be empty")
        return [text as any, ""]
    }

    validateIndex(...[argIndex, argCount]: ValidateIndexArgs) {
        if (argIndex !== (argCount - 1)) throw Error(`'${this.name}' must be the last argument`)
    }

    help() {
        return `<${this.name} {remaining}>`
    }

    example() {
        return loremIpsum(2)
    }
}

/**
 * Matches on one more words separated by spaces and that contain characters a-z, 0-9, and _.
 *
 * @example
 * const args = prefix('!cmd').word('name').parse('!cmd Jim Bob rules')
 * console.log(args) // 'Jim'
 *
 * args = prefix('!cmd').words('name', 2).parse('!cmd Jim Bob rules')
 * console.log(args) // 'Jim Bob'
 */
export class WordsArg<T = string> extends RegexArg<T> {
    private words: number
    constructor(...[name, opts = {}]: WordsArgs) {
        const { words = 1 } = opts
        const _words = intArg(words)
        const regex = [...new Array(_words)].map(_ => '\\w+').join('\\s+') // regex words separated by spaces e.g. /\w+\s+\w+/

        super(name, new RegExp(regex), loremIpsum(words))
        this.words = _words

        assertGreaterThan(_words, 0)
    }

    parse(text: string): ArgParseResponse<T> {
        try {
            return super.parse(text)
        } catch (error) {
            const s = this.words === 1 ? '' : 's'
            throw Error(`${this.words} word${s} not found`)
        }
    }

    help() {
        const s = this.words === 1 ? '' : 's'
        return `<${this.name} {${this.words} word${s}}>`
    }

    example() {
        return loremIpsum(this.words)
    }
}
