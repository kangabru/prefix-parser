import { NameArgAnd } from "../types";
import { assertPositive, intArg } from "../utils";
import BaseArg, { ArgParseResponse } from "./base";

export type RegexArgs = NameArgAnd<[example: string, regex: RegExp, group?: number]>

/** A generic regex parser which can match regex and extract a single regex group. */
export class RegexArg<T = string> extends BaseArg<T> {
    private _example: string
    private regex: RegExp
    private group: number

    /**
     * @param name - The name of the command.
     * @param regex - The regex to match with. Everything matched by this expression will be discarded and not accessible by remaining argument parsers.
     * @param group - The index of a regex group to return. The
     */
    constructor(...[name, example, regex, group = 0]: RegexArgs) {
        super(name)
        this.regex = regex
        this._example = example
        this.group = intArg(group)

        assertPositive(group)
    }

    parse(text: string): ArgParseResponse<T> {
        const matches = text.trim().match(this.regex)
        if (!matches) throw Error("Expression not found")
        if (this.group >= matches.length) throw Error(`Could not get group '${this.group}' from ${matches.length} matches`)

        const allMatch = matches[0]
        const groupMatch = matches[this.group].trim() as any
        const rest = text.replace(allMatch, '').trim()
        return [groupMatch, rest]
    }

    help(): string {
        return `<${this.name} {text}>`
    }

    /** Returns an example of this argument as seen by end users via the help flag. */
    example(): string {
        return this._example
    }
}