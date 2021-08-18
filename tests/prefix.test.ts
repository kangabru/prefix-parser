import prefix from '../src/index';
import { FloatArg, IntegerArg } from '../src/matchers/number';
import { RestArg } from '../src/matchers/text';
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
    const [args, error] = prefix('!cmd')
        .int("Age")
        .float("Height")
        .text("Name")
        .parse("!cmd 20 1.8 Jim Bob")

    expect(error).toBe(null)
    expect(args).toEqual([20, 1.8, 'Jim Bob'])
})

test('prefix - parse via args array', () => {
    const [args, error] = prefix('!cmd', [
        new IntegerArg("Age"),
        new FloatArg("Height"),
        new RestArg("Name"),
    ]).parse("!cmd 20 1.8 Jim Bob")

    expect(error).toBe(null)
    expect(args).toEqual([20, 1.8, 'Jim Bob'])
})

test('prefix - parse via classes', () => {
    const builder = new DiscordPrefixParser('!cmd')
    builder.addArg(new IntegerArg("Age"))
    builder.addArg(new FloatArg("Height"))
    builder.addArg(new RestArg("Name"))
    const args = builder.parse("!cmd 20 1.8 Jim Bob")
    expect(args).toEqual([20, 1.8, 'Jim Bob'])
})

test('prefix - many commands flag true', () => {
    const [args, error] = prefix('!cmd')
        .text("Name")
        .int("Age")
        .float("Height")
        .flagTrue("Male", '--male', '-m')
        .mentionUser("User")
        .mentionRole("Fav Role")
        .mentionChannel("Fav Channel")
        .parse("!cmd Jim Bob 20 1.8 <@12345> <@&24680> <@#13579> -m")

    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob', 20, 1.8, true, '12345', '24680', '13579'])
})

test('prefix - many commands flag false', () => {
    const [args, error] = prefix('!cmd')
        .text("Name")
        .int("Age")
        .float("Height")
        .flagTrue("Male", '--male', '-m')
        .mentionUser("User")
        .mentionRole("Role")
        .mentionChannel("Channel")
        .parse("!cmd Jim Bob 20 1.8 <@12345> <@&24680> <@#13579> Extra")

    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob', 20, 1.8, false, '12345', '24680', '13579'])
})
