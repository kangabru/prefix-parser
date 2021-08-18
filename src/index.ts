import BaseArg, { BaseArgs, ParseResponse, RegexArg, RegexArgs } from "./matchers/base";
import { FlagArgs, FlagFalseArg, FlagTrueArg } from "./matchers/flag";
import { DiscordChannelMentionArg, DiscordRoleMentionArg, DiscordUserMentionArg } from "./matchers/mention";
import { FloatArg, FloatArgs, IntegerArg, IntegerArgs } from "./matchers/number";
import { RestArg, TextArg, TextArgs, WordArgs, WordsArg, WordsArgs } from "./matchers/text";
import { DiscordPrefixParser } from "./prefix";

type PrefixParserWrapArgs = [prefix: string, args?: BaseArg<any>[]]

/**
 * Start a prefix command and use the fluent interface to add arguments.
 * @param prefix - The prefix string expected at the start of the command.
 * @param args - (Optional) An array of argument classes to add arguments without the fluent interface.
 */
export default function prefix(...[prefix, args = []]: PrefixParserWrapArgs) {
    return new DiscordPrefixParserFluentInterface(prefix, args)
}

/**
 * Wraps the {@link DiscordPrefixParser} class to provide an easy to use fluent interface.
 * @example
 * let [args, error] = prefix('!cmd')
 *     .int("Age")
 *     .float("Height")
 *     .text("Name")
 *     .parse("!cmd 20 1.8 Jim Bob")
 * console.log(args) // [20, 1.8, 'Jim Bob']
 */
export class DiscordPrefixParserFluentInterface {
    private _parser: DiscordPrefixParser;

    constructor(...[prefix, args = []]: PrefixParserWrapArgs) {
        this._parser = new DiscordPrefixParser(prefix, args)
    }

    parser() {
        return this._parser
    }

    parse(text: string): ParseResponse<any[]> {
        let args = null, error = null;
        try {
            args = this._parser.parse(text)
        } catch (e) {
            error = e.toString()
        }
        return [args, error]
    }

    int(...args: IntegerArgs) {
        this._parser.addArg(new IntegerArg(...args))
        return this
    }

    float(...args: FloatArgs) {
        this._parser.addArg(new FloatArg(...args))
        return this
    }

    rest(...args: TextArgs) {
        this._parser.addArg(new RestArg(...args))
        return this
    }

    text(...args: TextArgs) {
        this._parser.addArg(new TextArg(...args))
        return this
    }

    word(...args: WordArgs) {
        this._parser.addArg(new WordsArg(...args))
        return this
    }

    words(...args: WordsArgs) {
        this._parser.addArg(new WordsArg(...args))
        return this
    }

    regex(...args: RegexArgs) {
        this._parser.addArg(new RegexArg(...args))
        return this
    }

    mentionUser(...args: BaseArgs) {
        this._parser.addArg(new DiscordUserMentionArg(...args))
        return this
    }

    mentionRole(...args: BaseArgs) {
        this._parser.addArg(new DiscordRoleMentionArg(...args))
        return this
    }

    mentionChannel(...args: BaseArgs) {
        this._parser.addArg(new DiscordChannelMentionArg(...args))
        return this
    }

    flagTrue(...args: FlagArgs) {
        this._parser.addArg(new FlagTrueArg(...args))
        return this
    }

    flagFalse(...args: FlagArgs) {
        this._parser.addArg(new FlagFalseArg(...args))
        return this
    }
}
