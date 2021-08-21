import { NameArg, NameArgAnd } from "../types";
import { assert, assertPositive, intArg, isPopulated, isVoid } from "../utils";

export type ArgParseResponse<T> = [T, string]
export type BaseArgs = NameArg

export type ValidateIndexArgs = [argIndex: number, argCount: number]

/** The core 'arg' class which others must inherit from and implement. */
export default class BaseArg<T> {
    /** The name of the argument seen by end users via the help flag and in errors. */
    name: string;

    constructor(...[name]: BaseArgs) {
        assert(!!name, `Arg name ${name} not provided`)
        assert(name.length >= 3, `Arg name ${name} should be 3+ characters`)
        this.name = name
    }

    /** Parses as string for the next argument and returns the parsed value and remaining text. */
    parse(_: string): ArgParseResponse<T> {
        throw Error(`${this.name} 'parse()' function not implemented`)
    }

    /** Returns the help syntax seen by end users via the help flag and in errors. */
    help(): string {
        throw Error(`${this.name} 'help()' function not implemented`)
    }

    /** Returns an example of this argument as seen by end users via the help flag. */
    example(): string {
        throw Error(`${this.name} 'example()' function not implemented`)
    }

    validateArg() {
        assert(this.help().length > 0, 'Help message should be populated')
        assert(this.example().length > 0, 'Example message should be populated')
        const [value, error] = this.parse(this.example())
        assert(!error, 'Parsing the example should not return errors')
        assert(isPopulated(value), 'Parsing the example should return a value')
    }

    /** (Optional) Validate the position of the arg. This should throw an error upon failure. */
    validateIndex(..._: ValidateIndexArgs): void { }
}

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