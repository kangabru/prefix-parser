import BaseArg, { BaseArgs } from "./matchers/base";
import { FlagArgs, FlagFalseArg, FlagTrueArg } from "./matchers/flag";
import { DiscordChannelMentionArg, DiscordRoleMentionArg, DiscordUserMentionArg } from "./matchers/mention";
import { FloatArg, FloatArgs, IntegerArg, IntegerArgs } from "./matchers/number";
import { RegexArg, RegexArgs } from "./matchers/regex";
import { RestArg, TextArg, TextArgs, WordArgs, WordsArg, WordsArgs } from "./matchers/text";
import { DiscordPrefixParser } from "./prefix";

/**
 * Wraps the {@link DiscordPrefixParser} class to provide an easy to use fluent interface.
 * @example
 * const [args, error] = prefix('!cmd', 'My command')
 *     .int("Age")
 *     .float("Height")
 *     .text("Name")
 *     .parse("!cmd 20 1.8 Jim Bob")
 * console.log(args) // [20, 1.8, 'Jim Bob']
 */
export class DiscordPrefixParserFluentInterface {
    private parser: DiscordPrefixParser;

    constructor(parser: DiscordPrefixParser) {
        this.parser = parser
    }

    add<T>(...args: BaseArg<T>[]) {
        this.parser.add(...args)
        return this
    }

    /**
     * Parses a Discord message and tries to parse it argument values.
     * @param text - The Discord message to try parse against the added arguments.
     * @returns An array with values [<args>, <error>].
     *      <args> - 'null' if arguments were not parsed, or an array of parsed argument values of the same length and order of the added arguments.
     *      <error> - 'null' if no error was thrown, or an error message that should be sent to the end user to help them correct and retry the command.
     */
    parse(text: string): [any[] | null, string | null] {
        let args = null, error = null;
        try {
            args = this.parser.parse(text)
        } catch (e) {
            error = e.toString()
        }
        return [args, error]
    }

    help() {
        return this.parser.help()
    }

    example() {
        return this.parser.example()
    }

    int(...args: IntegerArgs) {
        this.parser.add(new IntegerArg(...args))
        return this
    }

    float(...args: FloatArgs) {
        this.parser.add(new FloatArg(...args))
        return this
    }

    rest(...args: TextArgs) {
        this.parser.add(new RestArg(...args))
        return this
    }

    text(...args: TextArgs) {
        this.parser.add(new TextArg(...args))
        return this
    }

    word(...args: WordArgs) {
        this.parser.add(new WordsArg(...args))
        return this
    }

    words(...args: WordsArgs) {
        this.parser.add(new WordsArg(...args))
        return this
    }

    regex(...args: RegexArgs) {
        this.parser.add(new RegexArg(...args))
        return this
    }

    user(...args: BaseArgs) {
        this.parser.add(new DiscordUserMentionArg(...args))
        return this
    }

    role(...args: BaseArgs) {
        this.parser.add(new DiscordRoleMentionArg(...args))
        return this
    }

    channel(...args: BaseArgs) {
        this.parser.add(new DiscordChannelMentionArg(...args))
        return this
    }

    flagTrue(...args: FlagArgs) {
        this.parser.add(new FlagTrueArg(...args))
        return this
    }

    flagFalse(...args: FlagArgs) {
        this.parser.add(new FlagFalseArg(...args))
        return this
    }
}
