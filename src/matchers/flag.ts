import { assert } from "../utils";
import BaseArg, { ArgParseResponse } from "./base";

export type FlagArgs = [name: string, longCommand: string, shortCommand?: string]

/** Returns 'true' if it matches a flag anywhere in the text like '--help' or '-h' (long and short version respectively). */
export class FlagTrueArg<T = boolean> extends BaseArg<T> {
    long: string; short?: string;

    constructor(...[name, longCommand, shortCommand]: FlagArgs) {
        super(name)
        this.long = longCommand
        this.short = shortCommand

        // Assert long command is in the form of "--command"
        const long = longCommand.toLowerCase().match(/^--[a-z]{3,}$/)
        assert(!!(long && long.length && long[0] === longCommand), `Long command '${longCommand}' must be in the form --command and have 3+ characters`)

        // Assert short command is in the form of "-cmd" (up to 3 letters)
        if (shortCommand) {
            const short = shortCommand.toLowerCase().match(/^-[a-z]{1,3}$/)
            assert(!!(short && short.length && short[0] === shortCommand), `Short command '${shortCommand}' must be in the form -cmd and have 1-3 characters`)
        }
    }

    parse(text: string): ArgParseResponse<T> {
        const longWord = this.long.split('-').join('')
        const shortWord = this.short ? this.short.split('-').join('') : ""

        const longMatch = text.match(new RegExp(`(^|\\s)--${longWord}($|\\s)`))
        const shortMatch = text.match(new RegExp(`(^|\\s)-${shortWord}($|\\s)`))

        if (longMatch && longMatch.length === 3) {
            const [match, start, end] = longMatch
            const rest = text.replace(match, start + end) // replace word only and not adjacent spaces
            return [true as any, rest]
        }

        if (this.short && shortMatch && shortMatch.length === 3) {
            const [match, start, end] = shortMatch
            const rest = text.replace(match, start + end) // replace word only and not adjacent spaces
            return [true as any, rest]
        }

        return [false as any, text]
    }

    help() {
        const command = [this.long, this.short].filter(x => !!x).join('/')
        return `<${this.name} {${command}}>`
    }

    example() {
        return this.long
    }
}

/** Returns 'false' if it matches a flag anywhere in the text like '--help' or '-h' (long and short version respectively). */
export class FlagFalseArg<T = boolean> extends FlagTrueArg<T> {
    parse(text: string): ArgParseResponse<T> {
        const [hasFlag, rest] = super.parse(text)
        return [!hasFlag as any, rest]
    }
}

/** Returns 'true' if it matches the help flag anywhere in the text ('--help' or '-h'). */
export class HelpFlagArg extends FlagTrueArg {
    constructor() {
        super("Help", "--help", "-h")
    }
}