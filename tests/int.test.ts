import prefix from '../src/index';

test('matches int', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd 25')
    expect(error).toBe(null)
    expect(args).toEqual([25])
})

test('matches int - fail', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd age 25')
    expect(error).toContain("`<age {int}>` is missing or invalid.")
    expect(args).toEqual(null)
})

test('matches int - negative', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd -25')
    expect(error).toBe(null)
    expect(args).toEqual([-25])
})

test('matches int - chars', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd -2.-5-')
    expect(error).toBe(null)
    expect(args).toEqual([-2])
})

test('matches int - NaN', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd ---4')
    expect(args).toEqual(null)
    expect(error).toContain("`<age {int}>` is missing or invalid.")
})

test('matches int - text', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd two')
    expect(args).toEqual(null)
    expect(error).toContain("`<age {int}>` is missing or invalid.")
})

test('matches int - pass min/max', () => {
    const [args, error] = prefix('!cmd').int('age', { min: 20, max: 30 }).parse('!cmd 25')
    expect(args).toEqual([25])
    expect(error).toBe(null)
})

test('matches int - fail min', () => {
    const [args, error] = prefix('!cmd').int('age', { min: 30 }).parse('!cmd 25')
    expect(args).toEqual(null)
    expect(error).toContain("'25' cannot be less than '30'")
})

test('matches int - fail max', () => {
    const [args, error] = prefix('!cmd').int('age', { max: 20 }).parse('!cmd 25')
    expect(args).toEqual(null)
    expect(error).toContain("'25' cannot be more than '20'")
})

test('matches int - fail float', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd 25.36')
    expect(error).toBe(null)
    expect(args).toEqual([25])
})

test('arg int min', () => {
    expect(() => {
        prefix('!cmd').int('Age', { min: '5' as any })
    }).toThrow("'5' must be a number")
})

test('arg int max', () => {
    expect(() => {
        prefix('!cmd').int('Age', { max: '5' as any })
    }).toThrow("'5' must be a number")
})

test('arg int min/max', () => {
    expect(() => {
        prefix('!cmd').int('Age', { min: 10, max: 5 })
    }).toThrow("Min value '10' must be less than '5'")
})

test('missing int', () => {
    const [_args, error] = prefix('!cmd').int('Num').parse('!cmd')
    expect(error).toBe("`<Num {int}>` is missing or invalid. Type `!cmd --help` for info.")
})

test('int too high', () => {
    const [_args, error] = prefix('!cmd').int('Num', { max: 10 }).parse('!cmd 100')
    expect(error).toBe("`<Num {int <10}>` error: '100' cannot be more than '10'. Type `!cmd --help` for info.")
})

test('int too low', () => {
    const [_args, error] = prefix('!cmd').int('Num', { min: 10 }).parse('!cmd 5')
    expect(error).toBe("`<Num {int >10}>` error: '5' cannot be less than '10'. Type `!cmd --help` for info.")
})