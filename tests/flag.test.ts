import prefix from '../src/index';

test('matches flag true - set', () => {
    const [args, error] = prefix('!cmd').flagTrue('Age', '--age', '-a').parse('!cmd -a')
    expect(error).toBe(null)
    expect(args).toEqual([true])
})

test('matches flag true - unset', () => {
    const [args, error] = prefix('!cmd').flagTrue('Age', '--age', '-a').parse('!cmd')
    expect(error).toBe(null)
    expect(args).toEqual([false])
})

test('matches flag false - set', () => {
    const [args, error] = prefix('!cmd').flagFalse('Age', '--age', '-a').parse('!cmd -a')
    expect(error).toBe(null)
    expect(args).toEqual([false])
})

test('matches flag false - unset', () => {
    const [args, error] = prefix('!cmd').flagFalse('Age', '--age', '-a').parse('!cmd')
    expect(error).toBe(null)
    expect(args).toEqual([true])
})
