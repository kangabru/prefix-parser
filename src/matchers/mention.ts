import { ArgParseResponse, RegexArg } from "./base"

/**
 * Matches a Discord user mention like <@!12345> or <@12345>.
 * @see https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
 */
export class DiscordUserMentionArg<T = string> extends RegexArg<T> {
    constructor(name: string) {
        super(name, /^\<\@\!?(\d+)\>/, 1)
    }

    parse(text: string): ArgParseResponse<T> {
        try {
            return super.parse(text)
        } catch (error) {
            throw Error("User mention not found")
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
    constructor(name: string) {
        super(name, /^\<\@\&(\d+)\>/, 1)
    }

    parse(text: string): ArgParseResponse<T> {
        try {
            return super.parse(text)
        } catch (error) {
            throw Error("Role mention not found")
        }
    }

    help() {
        return `<${this.name} {@role}>`
    }
}

/**
 * Matches a Discord channel mention like <@#12345>.
 * @see https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
 */
export class DiscordChannelMentionArg<T = string> extends RegexArg<T> {
    constructor(name: string) {
        super(name, /^\<\@\#(\d+)\>/, 1)
    }

    parse(text: string): ArgParseResponse<T> {
        try {
            return super.parse(text)
        } catch (error) {
            throw Error("Channel mention not found")
        }
    }

    help() {
        return `<${this.name} {#channel}>`
    }
}