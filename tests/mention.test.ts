import prefix from '../src/index';

// ** User **

test('matches user mention 1', () => {
    const [args, error] = prefix('!cmd').user('user').parse('!cmd <@12345>')
    expect(error).toBe(null)
    expect(args).toEqual(['12345'])
})

test('matches user mention 2', () => {
    const [args, error] = prefix('!cmd').user('user').parse('!cmd <@!12345>')
    expect(error).toBe(null)
    expect(args).toEqual(['12345'])
})

test('matches user no mention 1', () => {
    const [args, error] = prefix('!cmd').user('user').parse('!cmd <@!hey>')
    expect(error).toContain('User mention not found')
    expect(args).toEqual(null)
})

// ** Role **

test('matches role mention', () => {
    const [args, error] = prefix('!cmd').role('role').parse('!cmd <@&12345>')
    expect(error).toBe(null)
    expect(args).toEqual(['12345'])
})

test('matches role no mention', () => {
    const [args, error] = prefix('!cmd').role('role').parse('!cmd <@&hey>')
    expect(error).toContain('Role mention not found')
    expect(args).toEqual(null)
})

// ** Channel **

test('matches channel mention', () => {
    const [args, error] = prefix('!cmd').channel('channel').parse('!cmd <#12345>')
    expect(error).toBe(null)
    expect(args).toEqual(['12345'])
})

test('matches role no mention', () => {
    const [args, error] = prefix('!cmd').channel('channek').parse('!cmd <#hey>')
    expect(error).toContain('Channel mention not found')
    expect(args).toEqual(null)
})