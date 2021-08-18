import BaseArg from "./matchers/base";
import { HelpFlagArg } from "./matchers/flag";

export type PrefixParserArgs = [prefix: string, args?: BaseArg<any>[]]

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
    private args: BaseArg<any>[];

    constructor(...[prefix, args = []]: PrefixParserArgs) {
        this.prefix = prefix
        this.args = args
    }

    addArg<T>(arg: BaseArg<T>) {
        this.args.push(arg)
        return this;
    }

    parse(text: string): any[] | null {
        const help = new HelpFlagArg().parse(text)[0]
        if (help) throw Error(this.help())

        if (!text.startsWith(this.prefix))
            return null

        const values = []
        text = text.replace(this.prefix, '').trim()
        for (const arg of this.args) {
            try {
                let [value, rest] = arg.parse(text)
                values.push(value)
                text = rest
            } catch (error) {
                throw Error(`Invalid argument. '${arg.name}': ${error}`)
            }
        }

        return values
    }

    help(): string {
        const args = this.args.map(a => a.help()).join(' ')
        return `${this.prefix} ${args}`
    }
}