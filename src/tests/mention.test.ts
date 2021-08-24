import prefix from '../index';

// ** User **

test('matches user mention 1', () => {
    const [args, error] = prefix('!cmd').user('User').parse('!cmd <@12345>')
    expect(error).toBe(null)
    expect(args).toEqual(['12345'])
})

test('matches user mention 2', () => {
    const [args, error] = prefix('!cmd').user('User').parse('!cmd <@!12345>')
    expect(error).toBe(null)
    expect(args).toEqual(['12345'])
})

test('matches user no mention 1', () => {
    const [args, error] = prefix('!cmd').user('User').parse('!cmd <@!hey>')
    expect(error).toContain("`<User {@user}>` is missing or invalid. Type `!cmd --help` for info.")
    expect(args).toEqual(null)
})

// ** Role **

test('matches role mention', () => {
    const [args, error] = prefix('!cmd').role('Role').parse('!cmd <@&12345>')
    expect(error).toBe(null)
    expect(args).toEqual(['12345'])
})

test('matches role no mention', () => {
    const [args, error] = prefix('!cmd').role('Role').parse('!cmd <@&hey>')
    expect(error).toContain("`<Role {@role}>` is missing or invalid. Type `!cmd --help` for info.")
    expect(args).toEqual(null)
})

// ** Channel **

test('matches channel mention', () => {
    const [args, error] = prefix('!cmd').channel('Channel').parse('!cmd <#12345>')
    expect(error).toBe(null)
    expect(args).toEqual(['12345'])
})

test('matches role no mention', () => {
    const [args, error] = prefix('!cmd').channel('Channel').parse('!cmd <#hey>')
    expect(error).toContain("`<Channel {#channel}>` is missing or invalid. Type `!cmd --help` for info.")
    expect(args).toEqual(null)
})

// ** Missing **

test('missing user', () => {
    const [_args, error] = prefix('!cmd').user('User').parse('!cmd')
    expect(error).toBe("`<User {@user}>` is missing or invalid. Type `!cmd --help` for info.")
})

test('missing role', () => {
    const [_args, error] = prefix('!cmd').role('Role').parse('!cmd')
    expect(error).toBe("`<Role {@role}>` is missing or invalid. Type `!cmd --help` for info.")
})

test('missing channel', () => {
    const [_args, error] = prefix('!cmd').channel('Channel').parse('!cmd')
    expect(error).toBe("`<Channel {#channel}>` is missing or invalid. Type `!cmd --help` for info.")
})