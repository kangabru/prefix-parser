import { NameArg } from "../types";
import { assert } from "../utils";
import BaseArg, { ArgParseResponse } from "./base";

type FlagOpts = { short?: string, storeFalse?: boolean }
export type FlagArgs = [...args: NameArg, long: string, opts?: FlagOpts]

/** Returns 'true' if it matches a flag anywhere in the text like '--help' or '-h' (long and short version respectively). */
export class FlagArg<T = boolean> extends BaseArg<T> {
    isFlag = true
    long: string; short?: string; storeFalse: boolean;

    constructor(...[name, long, opts = {}]: FlagArgs) {
        super(name)

        const { short, storeFalse = false } = opts
        this.long = long.toLowerCase()
        this.storeFalse = storeFalse

        // Assert long command is in the form of "--command"
        const longMatch = this.long.match(/^--[a-z]{2,}$/)
        assert(!!(longMatch && longMatch.length && longMatch[0] === long), `Long command '${long}' must be in the form --command and have 2+ characters`)

        // Assert short command is in the form of "-cmd" (up to 3 letters)
        if (short) {
            this.short = short
            const shortMatch = short.toLowerCase().match(/^-[a-z]{1,3}$/)
            assert(!!(shortMatch && shortMatch.length && shortMatch[0] === short), `Short command '${short}' must be in the form -cmd and have 1-3 characters`)
        }
    }

    parse(text: string): ArgParseResponse<T> {
        const longWord = this.long.split('-').join('')
        const shortWord = this.short ? this.short.split('-').join('') : ""

        const longMatch = text.match(new RegExp(`(^|\\s)--${longWord}($|\\s)`))
        const shortMatch = text.match(new RegExp(`(^|\\s)-${shortWord}($|\\s)`))

        const resultIfSet = !this.storeFalse

        if (longMatch && longMatch.length === 3) {
            const [match, start, end] = longMatch
            const rest = text.replace(match, start + end) // replace word only and not adjacent spaces
            return [resultIfSet as any, rest]
        }

        if (this.short && shortMatch && shortMatch.length === 3) {
            const [match, start, end] = shortMatch
            const rest = text.replace(match, start + end) // replace word only and not adjacent spaces
            return [resultIfSet as any, rest]
        }

        return [!resultIfSet as any, text]
    }

    help() {
        const command = [this.long, this.short].filter(x => !!x).join('/')
        return `${this.name} {${command}}`
    }

    example() {
        return this.long
    }
}

/** Returns 'true' if it matches the help flag anywhere in the text ('--help' or '-h'). */
export class HelpFlagArg extends FlagArg {
    constructor() {
        super("Help", "--help", { short: "-h" })
    }
}