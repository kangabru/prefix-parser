import prefix from '../src/index';
import { FloatArg, IntegerArg } from '../src/matchers/number';
import { RestArg, TextArg } from '../src/matchers/text';
import { DiscordPrefixParser } from '../src/prefix';

test('matches command', () => {
    const [args, error] = prefix('!cmd').parse('!cmd')
    expect(error).toBe(null)
    expect(args).toEqual([])
})

test('ignores command', () => {
    const [args, error] = prefix('!cmd').parse('Hey')
    expect(error).toBe(null)
    expect(args).toEqual(null)
})

test('prefix - parse via fluent interface', () => {
    const cmd = prefix('!cmd')
        .text("Name")
        .int("Age", 18)
        .float("Height", 0, 3)

    expect(cmd.help()).toBe('!cmd <Name {text}> <Age {int >18}> <Height {float 0~3}>')
    expect(cmd.example()).toBe('!cmd lorem ipsum 59 1.50')

    const [args, error] = cmd.parse("!cmd Jim Bob 20 1.8")
    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob', 20, 1.8])
})

test('prefix - parse via args array', () => {
    const cmd = prefix('!cmd').add<any>(
        new TextArg("Name"),
        new IntegerArg("Age", 18),
        new FloatArg("Height", 0, 3),
    )

    expect(cmd.help()).toBe('!cmd <Name {text}> <Age {int >18}> <Height {float 0~3}>')
    expect(cmd.example()).toBe('!cmd lorem ipsum 59 1.50')

    const [args, error] = cmd.parse("!cmd Jim Bob 20 1.8")
    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob', 20, 1.8])
})

test('prefix - parse via classes', () => {
    const cmd = new DiscordPrefixParser('!cmd')
    cmd.add(new TextArg("Name"))
    cmd.add(new IntegerArg("Age", 18))
    cmd.add(new FloatArg("Height", 0, 3))

    expect(cmd.help()).toBe('!cmd <Name {text}> <Age {int >18}> <Height {float 0~3}>')
    expect(cmd.example()).toBe('!cmd lorem ipsum 59 1.50')

    const args = cmd.parse("!cmd Jim Bob 20 1.8")
    expect(args).toEqual(['Jim Bob', 20, 1.8])
})

test('prefix - many commands flag true', () => {
    const [args, error] = prefix('!cmd')
        .text("Name")
        .int("Age")
        .float("Height")
        .flagTrue("Male", '--male', '-m')
        .user("User")
        .role("Fav Role")
        .channel("Fav Channel")
        .parse("!cmd Jim Bob 20 1.8 <@12345> <@&24680> <#13579> -m")

    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob', 20, 1.8, true, '12345', '24680', '13579'])
})

test('prefix - many commands flag false', () => {
    const [args, error] = prefix('!cmd')
        .text("Name")
        .int("Age")
        .float("Height")
        .flagTrue("Male", '--male', '-m')
        .user("User")
        .role("Role")
        .channel("Channel")
        .parse("!cmd Jim Bob 20 1.8 <@12345> <@&24680> <#13579> Extra")

    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob', 20, 1.8, false, '12345', '24680', '13579'])
})
