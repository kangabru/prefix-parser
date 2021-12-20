import { NameArg } from "../types"
import { RegexArg } from "./regex"

export type UrlArgs = NameArg

// https://regexr.com/37i6s
const regexUrl = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

/**
 * Matches a Discord user mention like <@!12345> or <@12345>.
 * @see https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
 */
export class UrlArg extends RegexArg<string> {

    constructor(...[name]: NameArg) {
        super(name, regexUrl, 'https://discord.gg', { group: 0 })
    }

    help() {
        return `${this.name} {url}`
    }
}