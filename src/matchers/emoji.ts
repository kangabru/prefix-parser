import { NameArg } from "../types"
import { RegexArg } from "./regex"

export type EmojiArgs = NameArg

const regexUnicode = "\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]"
const regexDiscord = "<:[a-zA-Z]+:[0-9]+>"

/**
 * Matches as much emoji as possible including characters a-z, spaces, - and _.
 *
 * @example
 * const args = prefix('!cmd').emoji('name').parse('!cmd Jim Bob! is my name')
 * console.log(args) // 'Jim Bob'
 */
export class EmojiArg extends RegexArg<string> {
    constructor(...[name]: EmojiArgs) {
        console.log(`${regexUnicode}|${regexDiscord}`);

        super(name, new RegExp(`${regexUnicode}|${regexDiscord}`), "🙂")
    }

    help() {
        return `${this.name} {emoji}`
    }
}
