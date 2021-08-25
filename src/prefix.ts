import BaseArg from "./matchers/base";
import { FlagArg, HelpFlagArg } from "./matchers/flag";
import { Arr, MapToBaseArg } from "./types";
import { formatDiscordHelp, wrap } from "./utils";

export type PrefixParserArgs = [command: string, name?: string]

type Arg = BaseArg<any>
type Extend<Args extends Arr, T extends Arr> = DiscordPrefixParser<[...Args, ...T]>

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
export class DiscordPrefixParser<Args extends Arr = []> {
    private prefix: string;
    private name?: string;
    private args: Arg[];

    constructor(...[prefix, name]: PrefixParserArgs) {
        this.prefix = prefix
        this.name = name
        this.args = []
    }

    add<NewArgs extends Arr>(...args: MapToBaseArg<NewArgs>): Extend<Args, NewArgs> {
        this.args.push(...args)

        // Validate arg definition
        for (const arg of args) arg.validateArg()

        // Validate arg index
        for (let i = 0; i < this.args.length; i++) {
            const arg = this.args[i];
            arg?.validateIndex(i, this.args.length)
        }

        return this as any;
    }

    /**
     * Parses a Discord message and tries to parse it argument values.
     * @param text - The Discord message to try parse against the added arguments.
     * @returns 'null' if the command isn't the prefix command, or an array of parsed argument values of the same length and order of the added arguments.
     * @throws A string error that can be sent to end users to help them correct the command and try again.
     */
    parse(text: string): Args | null {
        if (!text.startsWith(this.prefix)) return null

        // Handle -h/--help
        const help = new HelpFlagArg().parse(text)[0]
        if (help) throw Error(this.help())

        // Add a key to args so we can process them out of order
        type KeyedArg<T extends BaseArg<T>> = T & { __key__: string }
        const keyedArgs: KeyedArg<Arg>[] = this.args.map((arg, i) => {
            const _arg: KeyedArg<any> = arg as any
            _arg.__key__ = `${i}_${arg.name}`
            return _arg
        })

        // Split flags so we can process them first. Flags can be anywhere in
        // the parse string so strip them out first so other args don't match them.
        const [argsNorm, argsFlag] = this.splitFlagArgs(keyedArgs)
        const args = argsFlag.concat(argsNorm)

        // Process args and their values against their key
        const valueIndex: Record<string, any> = {}
        text = text.replace(this.prefix, '').trim()
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            try {
                const [value, rest] = arg.parse(text)
                valueIndex[arg.__key__] = value
                text = rest
            } catch (error) {
                const message = error.message
                const helpArg = wrap(arg.help(), '`')
                const helpGen = `Type \`${this.prefix} --help\` for info.`
                if (message)
                    throw Error(`${helpArg} error: ${message}. ${helpGen}`)
                else
                    throw Error(`${helpArg} is missing or invalid. ${helpGen}`)
            }
        }

        // Return arg values in original order
        return keyedArgs.map(arg => valueIndex[arg.__key__]) as any
    }

    help(): string {
        return formatDiscordHelp(
            this.title(),
            this.usage(),
            this.example(),
        )
    }

    /**
     * Returns a Discord compatible message with the command and title (if provided).
     * @example **`!rate` Rate your friends!**
     */
    title(): string {
        const command = wrap(this.prefix, '`')
        const name = this.name ? wrap(this.name, '**') : ''
        return `${command}  ${name}`.trim()
    }

    /**
     * Returns a Discord compatible message describing the command usage.
     * @example !rate `User {@user}` `Score {int}`
     */
    usage(): string {
        const argsHelp = this.args.map(a => a.help()).map(h => wrap(h, '`')).join('  ')
        return [wrap(this.prefix, '`'), argsHelp].join('  ')
    }

    /**
     * Returns a Discord compatible message with a valid example of the command.
     * @example !rate @user 50
     */
    example(): string {
        // Separate flags because they're optional so should be at the end
        const [argsNorm, argsFlag] = this.splitFlagArgs(this.args)
        const argsHelp = argsNorm.concat(argsFlag).map(a => a.example()).join(' ')
        return wrap([this.prefix, argsHelp].join(' '), '`')
    }

    private splitFlagArgs<T extends Arg>(args: T[]): [T[], T[]] {
        const argsNorm: T[] = [], argsFlag: T[] = []
        args.forEach(arg => {
            if ((arg as unknown as FlagArg).isFlag)
                argsFlag.push(arg)
            else
                argsNorm.push(arg)
        })
        return [argsNorm, argsFlag]
    }
}