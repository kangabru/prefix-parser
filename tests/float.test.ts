import prefix from '../src/index';

test('matches float', () => {
    const [args, error] = prefix('!cmd').float('age').parse('!cmd 25.36')
    expect(error).toBe(null)
    expect(args).toEqual([25.36])
})

test('matches float - fail', () => {
    const [args, error] = prefix('!cmd').int('age').parse('!cmd age 25')
    expect(error).toContain('Number not found')
    expect(args).toEqual(null)
})

test('matches float - int', () => {
    const [args, error] = prefix('!cmd').float('age').parse('!cmd 25')
    expect(error).toBe(null)
    expect(args).toEqual([25.0])
})

test('matches float - negative', () => {
    const [args, error] = prefix('!cmd').float('age').parse('!cmd -25.36')
    expect(error).toBe(null)
    expect(args).toEqual([-25.36])
})

test('matches float - negative int', () => {
    const [args, error] = prefix('!cmd').float('age').parse('!cmd -25')
    expect(error).toBe(null)
    expect(args).toEqual([-25.0])
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
    expect(error).toContain('Number not found')
    expect(args).toEqual(null)
})

test('matches float - pass min/max', () => {
    const [args, error] = prefix('!cmd').float('age', 20, 30).parse('!cmd 25.36')
    expect(error).toBe(null)
    expect(args).toEqual([25.36])
})

test('matches float - fail min', () => {
    const [args, error] = prefix('!cmd').float('age', 30).parse('!cmd 25.36')
    expect(error).toContain("'25.36' cannot be less than '30'")
    expect(args).toEqual(null)
})

test('matches float - fail max', () => {
    const [args, error] = prefix('!cmd').float('age', null, 20).parse('!cmd 25.36')
    expect(error).toContain("'25.36' cannot be more than '20'")
    expect(args).toEqual(null)
})

test('arg float min', () => {
    expect(() => {
        prefix('!cmd').int('Age', '5' as any)
    }).toThrow("'5' must be a number")
})

test('arg float max', () => {
    expect(() => {
        prefix('!cmd').int('Age', null, '5' as any)
    }).toThrow("'5' must be a number")
})

test('arg float max', () => {
    expect(() => {
        prefix('!cmd').int('Age', 10, 5)
    }).toThrow("Min value '10' must be less than '5'")
})