import { NameArg } from "../types"
import { clean } from "../utils"
import { ArgParseResponse } from "./base"
import { RegexArg } from "./regex"

export type MentionArgs = NameArg

/**
 * Matches a Discord user mention like <@!12345> or <@12345>.
 * @see https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
 */
export class DiscordUserMentionArg extends RegexArg<string> {
    constructor(...[name]: MentionArgs) {
        super(name, /^(\d{5,}|\<\@\!?\d{5,}\>)/, '<@12345>', { group: 1 })
    }

    parse(text: string): ArgParseResponse<string> {
        try {
            const [match, msg] = super.parse(text)
            const matchClean = clean(match, '<@!>')
            return [matchClean, msg]
        } catch (error) {
            console.error(error)
            throw Error() // not found
        }
    }

    help() {
        return `${this.name} {@user}`
    }
}

/**
 * Matches a Discord role mention like <@&12345>.
 * @see https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
 */
export class DiscordRoleMentionArg extends RegexArg<string> {
    constructor(...[name]: MentionArgs) {
        super(name, /^(\d{5,}|\<\@\&\d{5,}\>)/, '<@&12345>', { group: 1 })
    }

    parse(text: string): ArgParseResponse<string> {
        try {
            const [match, msg] = super.parse(text)
            const matchClean = clean(match, '<@&>')
            return [matchClean, msg]
        } catch (error) {
            console.error(error)
            throw Error() // not found
        }
    }

    help() {
        return `${this.name} {@role}`
    }
}

/**
 * Matches a Discord channel mention like <#12345>.
 * @see https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
 */
export class DiscordChannelMentionArg extends RegexArg<string> {
    constructor(...[name]: MentionArgs) {
        super(name, /^(\d{5,}|\<\#\d{5,}\>)/, '<#12345>', { group: 1 })
    }

    parse(text: string): ArgParseResponse<string> {
        try {
            const [match, msg] = super.parse(text)
            const matchClean = clean(match, '<@#>')
            return [matchClean, msg]
        } catch (error) {
            console.error(error)
            throw Error() // not found
        }
    }

    help() {
        return `${this.name} {#channel}`
    }
}