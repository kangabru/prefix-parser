import prefix from '../index';

test('matches url 1', () => {
    const [args, error] = prefix('!cmd')
        .url('Landing Page')
        .parse('!cmd https://discord.com')
    expect(error).toBe(null)
    expect(args).toEqual(['https://discord.com'])
})

test('matches url 2', () => {
    const [args, error] = prefix('!cmd')
        .url('Landing Page')
        .parse('!cmd www.discord.com')
    expect(error).toBe(null)
    expect(args).toEqual(['www.discord.com'])
})

test('matches url 3', () => {
    const [args, error] = prefix('!cmd')
        .url('Landing Page')
        .parse('!cmd discord.com')
    expect(error).toBe(null)
    expect(args).toEqual(['discord.com'])
})

test('matches url 4', () => {
    const [args, error] = prefix('!cmd')
        .url('Landing Page')
        .parse('!cmd discord')
    expect(error).toContain("`Landing Page {url}` is missing or invalid. Type `!cmd --help` for info.")
    expect(args).toEqual(null)
})