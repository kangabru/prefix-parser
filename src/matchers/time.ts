import { NameArg } from "../types";
import { assert } from "../utils";
import BaseArg, { ArgParseResponse } from "./base";

type TimeOpts = { min?: string, max?: string }
export type TimeArgs = [...args: NameArg, opts?: TimeOpts]

const regexTime = /^(\d+)([a-z]{1})/ // 1d, 12h, 5m, 10s ...
const time = { sec: 1, min: 60, hour: 3600, day: 3600 * 24 }

/** Matches time args like 1d, 12h, 5m, 10s, 250ms. */
export class TimeArg extends BaseArg<string> {
    min?: string; max?: string;
    vMin?: number; vMax?: number;

    constructor(...[name, opts = {}]: TimeArgs) {
        super(name)

        const { min, max } = opts
        if (min !== undefined) assert(typeof min === "string", `Min value '${min}' must be text`)
        if (max !== undefined) assert(typeof max === "string", `Max value '${max}' must be text`)
        if (min) assert(isTime(min), `Min value '${min}' must be a time unit`)
        if (max) assert(isTime(max), `Max value '${max}' must be a time unit`)

        const vMin = parseTime(min), vMax = parseTime(max)
        if (vMin !== -1 && vMax !== -1)
            assert(vMin! < vMax!, `Min value '${min}' must be less than '${max}'`)

        this.min = min; this.max = max;
        this.vMin = vMin; this.vMax = vMax;
    }

    parse(text: string): ArgParseResponse<string> {
        const matches = text.trim().match(regexTime)
        if (!matches) throw Error() // not found
        const match = matches[0]

        const rest = text.replace(match, '').trim()
        const value = parseTime(match)

        if (value === -1) throw Error()
        if (this.vMin !== -1 && value < this.vMin!) throw Error(`'${text}' cannot be less than '${this.min}'`)
        if (this.vMax !== -1 && value > this.vMax!) throw Error(`'${text}' cannot be more than '${this.max}'`)

        return [value as any, rest]
    }

    help() {
        const hasMin = !!this.min, hasMax = !!this.max
        const hasBoth = hasMin && hasMax
        const extra = hasBoth ? ` ${this.min}~${this.max}`
            : hasMin ? ` >${this.min}`
                : hasMax ? ` <${this.max}`
                    : ''
        return `${this.name} {time${extra}}`
    }

    example() {
        // Always choose to lowest unit or we might round outside of the min/max bounds
        const unitMin = parseTimeParts(this.min)?.[1]
        const unitMax = parseTimeParts(this.max)?.[1]
        const unit: Unit = unitMin ?? unitMax ?? "s"

        // Get a value between min/max
        const min = this.vMin === -1 ? 0 : this.vMin!
        const max = this.vMax === -1 ? (min > 0 ? min * 3 : 60) : this.vMax!
        const mid = Math.floor((min + max) / 2)

        // Convert to display unit
        if (unit === "d") return `${Math.floor(mid / time.day)}d`
        if (unit === "h") return `${Math.floor(mid / time.hour)}h`
        if (unit === "m") return `${Math.floor(mid / time.min)}m`
        return `${mid}s`
    }
}

function isTime(arg: string | undefined) {
    return parseTime(arg) !== -1
}

function parseTime(arg: string | undefined) {
    const parts = parseTimeParts(arg)
    if (parts) {
        const [value, unit] = parts
        switch (unit) {
            case "s":
                return value * time.sec
            case "m":
                return value * time.min
            case "h":
                return value * time.hour
            case "d":
                return value * time.day
        }
    }
    return -1
}

type Unit = "s" | "m" | "h" | "d"

/** Splits a time argument into the number and unit parts. */
function parseTimeParts(arg: string | undefined): [number, Unit] | undefined {
    if (arg) {
        const match = arg.match(regexTime)
        if (match) {
            const [_, value, unit] = match // Get parts from regex groups
            return [parseInt(value), unit as Unit]
        }
    }
}