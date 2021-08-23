import prefix from '../src/index';
import { FloatArg, IntegerArg } from '../src/matchers/number';
import { TextArg } from '../src/matchers/text';
import { DiscordPrefixParser } from '../src/prefix';

test('matches command', () => {
    const [args, error] = prefix('!cmd').parse('!cmd')
    args as [] // Typecheck
    expect(error).toBe(null)
    expect(args).toEqual([])
})

test('ignores command', () => {
    const [args, error] = prefix('!cmd').parse('Hey')
    args as [] // Typecheck
    expect(error).toBe(null)
    expect(args).toEqual(null)
})

test('prefix - parse via fluent interface', () => {
    const cmd = prefix('!cmd')
        .text("Name")
        .int("Age", { min: 18 })
        .float("Height", { min: 0, max: 3 })

    expect(cmd.help()).toBe('!cmd <Name {text}> <Age {int >18}> <Height {float 0~3}>')
    expect(cmd.example()).toBe('!cmd lorem ipsum 59 1.50')

    const [args, error] = cmd.parse("!cmd Jim Bob 20 1.8")
    args as [string, number, number] // Typecheck
    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob', 20, 1.8])
})

test('prefix - parse via args array', () => {
    const cmd = prefix('!cmd').add(
        new TextArg("Name"),
        new IntegerArg("Age", { min: 18 }),
        new FloatArg("Height", { min: 0, max: 3 }),
    )

    expect(cmd.help()).toBe('!cmd <Name {text}> <Age {int >18}> <Height {float 0~3}>')
    expect(cmd.example()).toBe('!cmd lorem ipsum 59 1.50')

    const [args, error] = cmd.parse("!cmd Jim Bob 20 1.8")
    args as [string, number, number] // Typecheck
    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob', 20, 1.8])
})

test('prefix - parse via classes', () => {
    type Args = [string, number, number] // we have to manually specify args here
    const cmd = new DiscordPrefixParser<Args>('!cmd')

    cmd.add(new TextArg("Name"))
    cmd.add(new IntegerArg("Age", { min: 18 }))
    cmd.add(new FloatArg("Height", { min: 0, max: 3 }))

    expect(cmd.help()).toBe('!cmd <Name {text}> <Age {int >18}> <Height {float 0~3}>')
    expect(cmd.example()).toBe('!cmd lorem ipsum 59 1.50')

    const args = cmd.parse("!cmd Jim Bob 20 1.8")
    args as [string, number, number] // Typecheck
    expect(args).toEqual(['Jim Bob', 20, 1.8])
})

test('prefix - many commands flag true', () => {
    const cmd = prefix('!cmd')
        .text("Name")
        .int("Age")
        .float("Height")
        .flag("Male", '--male')
        .user("User")
        .role("Fav Role")
        .channel("Fav Channel")

    expect(cmd.help()).toBe('!cmd <Name {text}> <Age {int}> <Height {float}> <Male {--male}> <User {@user}> <Fav Role {@role}> <Fav Channel {#channel}>')
    expect(cmd.example()).toBe('!cmd lorem ipsum 50 50.00 <@12345> <@&12345> <#12345> --male')

    const [args, error] = cmd.parse("!cmd Jim Bob 20 1.8 <@12345> <@&24680> <#13579> --male")
    args as [string, number, number, boolean, string, string, string] // Typecheck
    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob', 20, 1.8, true, '12345', '24680', '13579'])
})

test('prefix - many commands flag false', () => {
    const [args, error] = prefix('!cmd')
        .text("Name")
        .int("Age")
        .float("Height")
        .flag("Male", '--male')
        .user("User")
        .role("Role")
        .channel("Channel")
        .parse("!cmd Jim Bob 20 1.8 <@12345> <@&24680> <#13579> Extra")

    args as [string, number, number, boolean, string, string, string] // Typecheck
    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob', 20, 1.8, false, '12345', '24680', '13579'])
})
