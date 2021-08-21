import prefix from '../src/index';

const simpleEmailRegex = /\w+@\w+\.\w+/

test('matches regex 1', () => {
    const [args, error] = prefix('!cmd').regex('user', 'test@example.com', simpleEmailRegex).parse('!cmd jim@bob.com is my email')
    expect(error).toBe(null)
    expect(args).toEqual(['jim@bob.com'])
})

test('matches regex 1', () => {
    const [args, error] = prefix('!cmd').regex('user', 'test@example.com', simpleEmailRegex).parse('!cmd jim@bob')
    expect(error).toContain('Expression not found')
    expect(args).toEqual(null)
})
