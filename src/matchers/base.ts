import { NameArg } from "../types";
import { assert, isPopulated } from "../utils";

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
        const example = this.example()
        assert(example.length > 0, 'Example message should be populated')

        let value = null, error = ""
        try {
            [value, error] = this.parse(example)
        } catch (e) {
            console.error('Error parsing example:', e)
            throw Error(`Could not parse the example '${example}'`)
        }
        assert(!error, 'Parsing the example should not return errors')
        assert(isPopulated(value), 'Parsing the example should return a value')
    }

    /** (Optional) Validate the position of the arg. This should throw an error upon failure. */
    validateIndex(..._: ValidateIndexArgs): void { }
}
