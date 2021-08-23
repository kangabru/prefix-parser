import prefix from '../src/index';

test('matches flag true - set', () => {
    const [args, error] = prefix('!cmd')
        .flag('Age', '--age', { short: '-a' })
        .parse('!cmd -a')

    expect(error).toBe(null)
    expect(args).toEqual([true])
})

test('matches flag true - unset', () => {
    const [args, error] = prefix('!cmd')
        .flag('Age', '--age', { short: '-a' })
        .parse('!cmd')

    expect(error).toBe(null)
    expect(args).toEqual([false])
})

test('matches flag false - set', () => {
    const [args, error] = prefix('!cmd')
        .flag('Age', '--age', { short: '-a', storeFalse: true })
        .parse('!cmd -a')

    expect(error).toBe(null)
    expect(args).toEqual([false])
})

test('matches flag false - unset', () => {
    const [args, error] = prefix('!cmd')
        .flag('Age', '--age', { short: '-a', storeFalse: true })
        .parse('!cmd')

    expect(error).toBe(null)
    expect(args).toEqual([true])
})

// ** Long arg check **

test('long argument check 1', () => {
    expect(() => {
        prefix('!cmd').flag('Age', 'age')
    }).toThrow("Long command 'age' must be in the form --command");
})

test('long argument check 2', () => {
    expect(() => {
        prefix('!cmd').flag('Age', '-age')
    }).toThrow("Long command '-age' must be in the form --command");
})

test('long argument check 3', () => {
    expect(() => {
        prefix('!cmd').flag('Age', '---age')
    }).toThrow("Long command '---age' must be in the form --command");
})

test('long argument check 4', () => {
    expect(() => {
        prefix('!cmd').flag('Age', '--age1')
    }).toThrow("Long command '--age1' must be in the form --command");
})

test('long argument check 5', () => {
    prefix('!cmd').flag('Age', '--ae') // No error
})

test('long argument check 6 - caps', () => {
    expect(() => {
        prefix('!cmd').flag('Age', '--AGE')
    }).toThrow("Long command '--AGE' must be in the form --command and have 2+ characters");
})

// ** Short arg check **

test('short argument check 1', () => {
    expect(() => {
        prefix('!cmd').flag('Age', '--age', { short: 'a' })
    }).toThrow("Short command 'a' must be in the form -cmd");
})

test('short argument check 2', () => {
    prefix('!cmd').flag('Age', '--age', { short: '-a' }) // No error
})

test('short argument check 3', () => {
    prefix('!cmd').flag('Age', '--age', { short: '-ab' }) // No error
})

test('short argument check 4', () => {
    prefix('!cmd').flag('Age', '--age', { short: '-abc' }) // No error
})

test('short argument check 5', () => {
    expect(() => {
        prefix('!cmd').flag('Age', '--age', { short: '-abcd' })
    }).toThrow("Short command '-abcd' must be in the form -cmd and have 1-3 characters");
})

test('short argument check 6', () => {
    expect(() => {
        prefix('!cmd').flag('Age', '--age', { short: '--abc' })
    }).toThrow("Short command '--abc' must be in the form -cmd and have 1-3 characters");
})

test('short argument check 7 - caps', () => {
    expect(() => {
        prefix('!cmd').flag('Age', '--age', { short: '-A' })
    }).toThrow("Short command '-A' must be in the form -cmd");
})
