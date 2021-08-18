import { NameArg, NameArgAnd } from "../types";
import { assertPositive, intArg } from "../utils";

export type ParseResponse<T> = [T, string]
export type BaseArgs = NameArg

/** The core 'arg' class which others must inherit from and implement. */
export default class BaseArg<T> {
    /** The name of the argument seen by end users via the help flag and in errors. */
    name: string;

    constructor(...[name]: BaseArgs) {
        if (!name) throw Error("BaseArg 'name' not provided")
        this.name = name
    }

    /** Parses as string for the next argument and returns the parsed value and remaining text. */
    parse(_: string): ParseResponse<T> {
        throw Error("BaseArg 'parse()' not implemented")
    }

    /** Returns the help syntax seen by end users via the help flag and in errors. */
    help(): string {
        throw Error("BaseArg 'help()' not implemented")
    }
}

export type RegexArgs = NameArgAnd<[regex: RegExp, group?: number]>

/** A generic regex parser which can match regex and extract a single regex group. */
export class RegexArg<T = string> extends BaseArg<T> {
    private regex: RegExp
    private group: number

    /**
     * @param name - The name of the command.
     * @param regex - The regex to match with. Everything matched by this expression will be discarded and not accessible by remaining argument parsers.
     * @param group - The index of a regex group to return. The
     */
    constructor(...[name, regex, group = 0]: RegexArgs) {
        super(name)
        this.regex = regex
        this.group = intArg(group)

        assertPositive(group)
    }

    parse(text: string): ParseResponse<T> {
        const matches = text.trim().match(this.regex)
        if (!matches) throw Error("Expression not found")
        if (this.group >= matches.length) throw Error(`Could not get group '${this.group}' from ${matches.length} matches`)

        const allMatch = matches[0]
        const groupMatch = matches[this.group].trim() as any
        const rest = text.replace(allMatch, '').trim()
        return [groupMatch, rest]
    }
}