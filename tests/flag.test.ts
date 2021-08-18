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

// ** Long arg check **

test('long argument check 1', () => {
    expect(() => {
        prefix('!cmd').flagFalse('Age', 'age')
    }).toThrow("Long command 'age' must be in the form --command");
})

test('long argument check 2', () => {
    expect(() => {
        prefix('!cmd').flagFalse('Age', '-age')
    }).toThrow("Long command '-age' must be in the form --command");
})

test('long argument check 3', () => {
    expect(() => {
        prefix('!cmd').flagFalse('Age', '---age')
    }).toThrow("Long command '---age' must be in the form --command");
})

test('long argument check 4', () => {
    expect(() => {
        prefix('!cmd').flagFalse('Age', '--age1')
    }).toThrow("Long command '--age1' must be in the form --command");
})

test('long argument check 5', () => {
    expect(() => {
        prefix('!cmd').flagFalse('Age', '--ae')
    }).toThrow("Long command '--ae' must be in the form --command and have 3+ characters");
})

test('long argument check 6 - caps', () => {
    expect(() => {
        prefix('!cmd').flagFalse('Age', '--AGE')
    }).toThrow("Long command '--AGE' must be in the form --command and have 3+ characters");
})

// ** Short arg check **

test('short argument check 1', () => {
    expect(() => {
        prefix('!cmd').flagFalse('Age', '--age', 'a')
    }).toThrow("Short command 'a' must be in the form -cmd");
})

test('short argument check 2', () => {
    prefix('!cmd').flagFalse('Age', '--age', '-a')
})

test('short argument check 3', () => {
    prefix('!cmd').flagFalse('Age', '--age', '-ab')
})

test('short argument check 4', () => {
    prefix('!cmd').flagFalse('Age', '--age', '-abc')
})

test('short argument check 5', () => {
    expect(() => {
        prefix('!cmd').flagFalse('Age', '--age', '-abcd')
    }).toThrow("Short command '-abcd' must be in the form -cmd and have 1-3 characters");
})

test('short argument check 6', () => {
    expect(() => {
        prefix('!cmd').flagFalse('Age', '--age', '--abc')
    }).toThrow("Short command '--abc' must be in the form -cmd and have 1-3 characters");
})

test('short argument check 7 - caps', () => {
    expect(() => {
        prefix('!cmd').flagFalse('Age', '--age', '-A')
    }).toThrow("Short command '-A' must be in the form -cmd");
})
