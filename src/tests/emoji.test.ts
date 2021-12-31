import prefix from '../index';

test('matches emoji unicode', () => {
    const [args, error] = prefix('!cmd').emoji('Emoji').parse('!cmd 🙂')
    expect(error).toBe(null)
    expect(args).toEqual(['🙂'])
})

test('matches emoji discord', () => {
    const [args, error] = prefix('!cmd').emoji('Emoji').parse('!cmd <:Kangabru:1234567890>')
    expect(error).toBe(null)
    expect(args).toEqual(['<:Kangabru:1234567890>'])
})

test('missing emoji', () => {
    const [_args, error] = prefix('!cmd').emoji('Emoji').parse('!cmd')
    expect(error).toBe("`Emoji {emoji}` is missing or invalid. Type `!cmd --help` for info.")
})
