import { EmojiArg, EmojiArgs } from "./matchers/emoji";
import { FlagArg, FlagArgs } from "./matchers/flag";
import { DiscordChannelMentionArg, DiscordRoleMentionArg, DiscordUserMentionArg, MentionArgs } from "./matchers/mention";
import { FloatArg, FloatArgs, IntegerArg, IntegerArgs } from "./matchers/number";
import { RegexArg, RegexArgs } from "./matchers/regex";
import { FluentWordsArgs, RestArg, TextArg, TextArgs, WordArgs, WordsArg } from "./matchers/text";
import { TimeArg, TimeArgs } from "./matchers/time";
import { UrlArg, UrlArgs } from "./matchers/url";
import { DiscordPrefixParser } from "./prefix";
import { Arr, MapToBaseArg } from "./types";

type Update<Args extends Arr> = DiscordPrefixParserFluentInterface<Args>
type Extend<Args extends Arr, T> = Update<[...Args, T]>

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
export class DiscordPrefixParserFluentInterface<Args extends Arr = []> {
    private parser: DiscordPrefixParser<Args>;

    constructor(parser: DiscordPrefixParser<Args>) {
        this.parser = parser
    }

    add<NewArgs extends Arr>(...args: MapToBaseArg<NewArgs>): Update<[...Args, ...NewArgs]> {
        this.parser.add(...args)
        return this as any
    }

    /**
     * Parses a Discord message and tries to parse it argument values.
     * @param text - The Discord message to try parse against the added arguments.
     * @returns An array with values [<args>, <error>].
     *      <args> - 'null' if arguments were not parsed, or an array of parsed argument values of the same length and order of the added arguments.
     *      <error> - 'null' if no error was thrown, or an error message that should be sent to the end user to help them correct and retry the command.
     */
    parse(text: string): [Args | null, string | null] {
        let args = null, error = null;
        try {
            args = this.parser.parse(text)
        } catch (e) {
            error = e.message
        }
        return [args, error]
    }

    help() {
        return this.parser.help()
    }

    usage() {
        return this.parser.usage()
    }

    example() {
        return this.parser.example()
    }

    int(...args: IntegerArgs): Extend<Args, number> {
        this.parser.add(new IntegerArg(...args))
        return this as any
    }

    float(...args: FloatArgs): Extend<Args, number> {
        this.parser.add(new FloatArg(...args))
        return this as any
    }

    rest(...args: TextArgs): Extend<Args, string> {
        this.parser.add(new RestArg(...args))
        return this as any
    }

    text(...args: TextArgs): Extend<Args, string> {
        this.parser.add(new TextArg(...args))
        return this as any
    }

    word(...args: WordArgs): Extend<Args, string> {
        this.parser.add(new WordsArg(...args))
        return this as any
    }

    words(...[name, words = 1]: FluentWordsArgs): Extend<Args, string> {
        this.parser.add(new WordsArg(name, { words }))
        return this as any
    }

    regex(...args: RegexArgs): Extend<Args, string> {
        this.parser.add(new RegexArg(...args))
        return this as any
    }

    user(...args: MentionArgs): Extend<Args, string> {
        this.parser.add(new DiscordUserMentionArg(...args))
        return this as any
    }

    role(...args: MentionArgs): Extend<Args, string> {
        this.parser.add(new DiscordRoleMentionArg(...args))
        return this as any
    }

    channel(...args: MentionArgs): Extend<Args, string> {
        this.parser.add(new DiscordChannelMentionArg(...args))
        return this as any
    }

    flag(...args: FlagArgs): Extend<Args, boolean> {
        this.parser.add(new FlagArg(...args))
        return this as any
    }

    url(...args: UrlArgs): Extend<Args, string> {
        this.parser.add(new UrlArg(...args))
        return this as any
    }

    time(...args: TimeArgs): Extend<Args, string> {
        this.parser.add(new TimeArg(...args))
        return this as any
    }

    emoji(...args: EmojiArgs): Extend<Args, string> {
        this.parser.add(new EmojiArg(...args))
        return this as any
    }
}
