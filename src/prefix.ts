import BaseArg from "./matchers/base";
import { HelpFlagArg } from "./matchers/flag";

export type PrefixParserArgs = [command: string, name?: string]

/**
 * Parses Discord messages into Javascript values.
 * It handles argument validation and provides messages to help the Discord user format the command correctly.
 *
 * It works by taking an array of 'arguments' which represent various types like @mentions, numbers, text.
 * Each argument is then run through the parser which tries to find the matching variable.
 * If all variables are found then it returns the argument values as an array with the correct JS types.
 * If an error is thrown then a helpful message is returned that can be sent to the Discord user to help them format the command correctly.
 *
 * @example
 * const builder = new DiscordPrefixParser('!cmd')
 * builder.addArg(new IntegerArg("Age"))
 * builder.addArg(new FloatArg("Height"))
 * builder.addArg(new StringArg("Name"))
 * const args = builder.parse("!cmd 20 1.8 Jim Bob")
 * console.log(args) // [20, 1.8, 'Jim Bob']
 */
export class DiscordPrefixParser {
    private prefix: string;
    private name?: string;
    private args: BaseArg<any>[];

    constructor(...[prefix, name]: PrefixParserArgs) {
        this.prefix = prefix
        this.name = name
        this.args = []
    }

    add<T>(...args: BaseArg<T>[]) {
        this.args.push(...args)

        // Validate arg definition
        for (const arg of args) arg.validateArg()

        // Validate arg index
        for (let i = 0; i < this.args.length; i++) {
            const arg = this.args[i];
            arg?.validateIndex(i, this.args.length)
        }

        return this;
    }

    /**
     * Parses a Discord message and tries to parse it argument values.
     * @param text - The Discord message to try parse against the added arguments.
     * @returns 'null' if the command isn't the prefix command, or an array of parsed argument values of the same length and order of the added arguments.
     * @throws A string error that can be sent to end users to help them correct the command and try again.
     */
    parse(text: string): any[] | null {
        const help = new HelpFlagArg().parse(text)[0]
        if (help) throw Error(this.help())

        if (!text.startsWith(this.prefix))
            return null

        const values = []
        text = text.replace(this.prefix, '').trim()
        for (let i = 0; i < this.args.length; i++) {
            const arg = this.args[i];
            try {
                const [value, rest] = arg.parse(text)
                values.push(value)
                text = rest
            } catch (error) {
                throw Error(`Invalid argument. '${arg.name}': ${error}`)
            }
        }

        return values
    }

    title() {
        return this.name ? `** \`${this.prefix}\` - ${this.name} **` : `** ${this.prefix} **`
    }

    help(): string {
        const argsHelp = this.args.map(a => a.help()).join(' ')
        return [this.prefix, argsHelp].join(' ')
    }

    toString() {
        return [this.title(), this.help()].join('\n')
    }
}