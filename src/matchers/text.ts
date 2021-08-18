import { NameArg, NameArgAnd } from "../types"
import { assertGreaterThan, intArg } from "../utils"
import BaseArg, { ParseResponse, RegexArg } from "./base"

export type TextArgs = NameArg
export type WordArgs = NameArg
export type WordsArgs = NameArgAnd<[words?: number]>

/**
 * Matches as much text as possible including characters a-z, spaces, - and _.
 *
 * @example
 * const args = prefix('!cmd').text('name').parse('!cmd Jim Bob! is my name')
 * console.log(args) // 'Jim Bob'
 */
export class TextArg<T = string> extends RegexArg<T> {
    constructor(...[name]: TextArgs) {
        super(name, /[a-zA-Z_-\s]+/)
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
    parse(text: string): ParseResponse<T> {
        if (!text.length)
            throw Error("Text cannot be empty")
        return [text as any, ""]
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
    constructor(...[name, words = 1]: WordsArgs) {
        const _words = intArg(words)
        const regex = [...new Array(_words)].map(_ => '\\w+').join('\\s+') // regex words separated by spaces e.g. /\w+\s+\w+/

        super(name, new RegExp(regex))
        this.words = _words

        assertGreaterThan(_words, 0)
    }

    parse(text: string): ParseResponse<T> {
        try {
            return super.parse(text)
        } catch (error) {
            const s = this.words === 1 ? '' : 's'
            throw Error(`${this.words} word${s} not found`)
        }
    }
}