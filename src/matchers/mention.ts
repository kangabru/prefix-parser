import { NameArg } from "../types"
import { ArgParseResponse } from "./base"
import { RegexArg } from "./regex"

export type MentionArgs = NameArg

/**
 * Matches a Discord user mention like <@!12345> or <@12345>.
 * @see https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
 */
export class DiscordUserMentionArg<T = string> extends RegexArg<T> {
    constructor(...[name]: MentionArgs) {
        super(name, /^\<\@\!?(\d+)\>/, '<@12345>', { group: 1 })
    }

    parse(text: string): ArgParseResponse<T> {
        try {
            return super.parse(text)
        } catch (error) {
            throw Error() // not found
        }
    }

    help() {
        return `<${this.name} {@user}>`
    }
}

/**
 * Matches a Discord role mention like <@&12345>.
 * @see https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
 */
export class DiscordRoleMentionArg<T = string> extends RegexArg<T> {
    constructor(...[name]: MentionArgs) {
        super(name, /^\<\@\&(\d+)\>/, '<@&12345>', { group: 1 })
    }

    parse(text: string): ArgParseResponse<T> {
        try {
            return super.parse(text)
        } catch (error) {
            throw Error() // not found
        }
    }

    help() {
        return `<${this.name} {@role}>`
    }
}

/**
 * Matches a Discord channel mention like <#12345>.
 * @see https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
 */
export class DiscordChannelMentionArg<T = string> extends RegexArg<T> {
    constructor(...[name]: MentionArgs) {
        super(name, /^\<\#(\d+)\>/, '<#12345>', { group: 1 })
    }

    parse(text: string): ArgParseResponse<T> {
        try {
            return super.parse(text)
        } catch (error) {
            throw Error() // not found
        }
    }

    help() {
        return `<${this.name} {#channel}>`
    }
}