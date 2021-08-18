import prefix from '../src/index';

test('matches int', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd 25')
    expect(error).toBe(null)
    expect(args).toEqual([25])
})

test('matches int - fail', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd age 25')
    expect(error).toContain('Number not found')
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
    expect(error).toContain('Number not found')
})

test('matches int - text', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd two')
    expect(args).toEqual(null)
    expect(error).toContain('Number not found')
})

test('matches int - pass min/max', () => {
    const [args, error] = prefix('!cmd').int('age', 20, 30).parse('!cmd 25')
    expect(args).toEqual([25])
    expect(error).toBe(null)
})

test('matches int - fail min', () => {
    const [args, error] = prefix('!cmd').int('age', 30).parse('!cmd 25')
    expect(args).toEqual(null)
    expect(error).toContain("'25' cannot be less than '30'")
})

test('matches int - fail max', () => {
    const [args, error] = prefix('!cmd').int('age', null, 20).parse('!cmd 25')
    expect(args).toEqual(null)
    expect(error).toContain("'25' cannot be more than '20'")
})

test('matches int - fail float', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd 25.36')
    expect(error).toBe(null)
    expect(args).toEqual([25])
})