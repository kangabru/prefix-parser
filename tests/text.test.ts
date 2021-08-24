import prefix from '../src/index';

test('matches rest', () => {
    const [args, error] = prefix('!cmd').rest('name').parse('!cmd  Jim Bob 25!  is my name ')
    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob 25!  is my name'])
})

test('matches text', () => {
    const [args, error] = prefix('!cmd').text('name').parse('!cmd  Jim Bob 25!  is my name ')
    expect(error).toBe(null)
    expect(args).toEqual(['Jim Bob'])
})

test('match 0 words', () => {
    expect(() => {
        prefix('!cmd').words('name', 0).parse('!cmd Jimmy is the best')
    }).toThrow("Argument with value '0' must be greater than '0'");
})

test('match 1 word', () => {
    const [args, error] = prefix('!cmd').word('name').parse('!cmd Jimmy is the best')
    expect(error).toBe(null)
    expect(args).toEqual(['Jimmy'])
})

test('match 2 words', () => {
    const [args, error] = prefix('!cmd').words('name', 2).parse('!cmd Jimmy is the best')
    expect(error).toBe(null)
    expect(args).toEqual(['Jimmy is'])
})

test('match word + sentence', () => {
    const [args, error] = prefix('!cmd')
        .word('name')
        .text('rest')
        .parse('!cmd Jimmy is the best')
    expect(error).toBe(null)
    expect(args).toEqual(['Jimmy', 'is the best'])
})

test('match sentence + word', () => {
    const [args, error] = prefix('!cmd')
        .text('rest')
        .word('name')
        .parse('!cmd Jimmy is the best')
    expect(error).toContain('1 word not found')
    expect(args).toEqual(null)
})

test('rest as last argument - pass', () => {
    prefix('!cmd').rest('Name')
})

test('rest as last argument - fail', () => {
    expect(() => {
        prefix('!cmd').rest('Name').int('Age')
    }).toThrow("'Name' must be the last argument");
})
