import prefix from '../src/index';

const simpleEmailRegex = /\w+@\w+\.\w+/

test('matches regex 1', () => {
    const [args, error] = prefix('!cmd')
        .regex('user', simpleEmailRegex, 'test@example.com')
        .parse('!cmd jim@bob.com is my email')
    expect(error).toBe(null)
    expect(args).toEqual(['jim@bob.com'])
})

test('matches regex 1', () => {
    const [args, error] = prefix('!cmd')
        .regex('Email', simpleEmailRegex, 'test@example.com')
        .parse('!cmd jim@bob')
    expect(error).toContain("`<Email {text}>` is missing or invalid. Type `!cmd --help` for info.")
    expect(args).toEqual(null)
})
