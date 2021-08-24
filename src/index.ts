import { DiscordPrefixParserFluentInterface } from "./fluent";
import { DiscordPrefixParser, PrefixParserArgs } from "./prefix";

/**
 * Start a prefix command and use the fluent interface to add arguments.
 * @param prefix - The prefix string expected at the start of the command.
 * @param description - (Optional) A longer description of the command to display to end users via the help command.
 */
export default function prefix(...args: PrefixParserArgs) {
    return new DiscordPrefixParserFluentInterface(new DiscordPrefixParser(...args))
}

module.exports = prefix