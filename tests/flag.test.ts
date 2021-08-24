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

// ** Positional flag checks **

test('positional flag - first arg - start', () => {
    const cmd = prefix('!cmd')
        .flag('Yes', '--yes', { short: '-y' })
        .word('First Name')
        .word('Surname')

    let [args, error] = cmd.parse('!cmd --yes Elon Musk')
    expect(error).toBe(null)
    expect(args).toEqual([true, 'Elon', 'Musk'])


    let [args_, error_] = cmd.parse('!cmd -y Elon Musk')
    expect(error_).toBe(null)
    expect(args_).toEqual([true, 'Elon', 'Musk'])
})

test('positional flag - first arg - middle', () => {
    const cmd = prefix('!cmd')
        .flag('Yes', '--yes', { short: '-y' })
        .word('First Name')
        .word('Surname')

    let [args, error] = cmd.parse('!cmd Elon --yes Musk')
    expect(error).toBe(null)
    expect(args).toEqual([true, 'Elon', 'Musk'])


    let [args_, error_] = cmd.parse('!cmd Elon -y Musk')
    expect(error_).toBe(null)
    expect(args_).toEqual([true, 'Elon', 'Musk'])
})

test('positional flag - first arg - end', () => {
    const cmd = prefix('!cmd')
        .flag('Yes', '--yes', { short: '-y' })
        .word('First Name')
        .word('Surname')

    let [args, error] = cmd.parse('!cmd Elon Musk --yes')
    expect(error).toBe(null)
    expect(args).toEqual([true, 'Elon', 'Musk'])


    let [args_, error_] = cmd.parse('!cmd Elon Musk -y')
    expect(error_).toBe(null)
    expect(args_).toEqual([true, 'Elon', 'Musk'])
})

test('positional flag - middle arg - start', () => {
    const cmd = prefix('!cmd')
        .word('First Name')
        .flag('Yes', '--yes', { short: '-y' })
        .word('Surname')

    let [args, error] = cmd.parse('!cmd --yes Elon Musk')
    expect(error).toBe(null)
    expect(args).toEqual(['Elon', true, 'Musk'])


    let [args_, error_] = cmd.parse('!cmd -y Elon Musk')
    expect(error_).toBe(null)
    expect(args_).toEqual(['Elon', true, 'Musk'])
})

test('positional flag - middle arg - middle', () => {
    const cmd = prefix('!cmd')
        .word('First Name')
        .flag('Yes', '--yes', { short: '-y' })
        .word('Surname')

    let [args, error] = cmd.parse('!cmd Elon --yes Musk')
    expect(error).toBe(null)
    expect(args).toEqual(['Elon', true, 'Musk'])


    let [args_, error_] = cmd.parse('!cmd Elon -y Musk')
    expect(error_).toBe(null)
    expect(args_).toEqual(['Elon', true, 'Musk'])
})

test('positional flag - middle arg - end', () => {
    const cmd = prefix('!cmd')
        .word('First Name')
        .flag('Yes', '--yes', { short: '-y' })
        .word('Surname')

    let [args, error] = cmd.parse('!cmd Elon Musk --yes')
    expect(error).toBe(null)
    expect(args).toEqual(['Elon', true, 'Musk'])


    let [args_, error_] = cmd.parse('!cmd Elon Musk -y')
    expect(error_).toBe(null)
    expect(args_).toEqual(['Elon', true, 'Musk'])
})

test('positional flag - last arg - start', () => {
    const cmd = prefix('!cmd')
        .word('First Name')
        .word('Surname')
        .flag('Yes', '--yes', { short: '-y' })

    let [args, error] = cmd.parse('!cmd --yes Elon Musk')
    expect(error).toBe(null)
    expect(args).toEqual(['Elon', 'Musk', true])


    let [args_, error_] = cmd.parse('!cmd -y Elon Musk')
    expect(error_).toBe(null)
    expect(args_).toEqual(['Elon', 'Musk', true])
})

test('positional flag - last arg - middle', () => {
    const cmd = prefix('!cmd')
        .word('First Name')
        .word('Surname')
        .flag('Yes', '--yes', { short: '-y' })

    let [args, error] = cmd.parse('!cmd Elon --yes Musk')
    expect(error).toBe(null)
    expect(args).toEqual(['Elon', 'Musk', true])


    let [args_, error_] = cmd.parse('!cmd Elon -y Musk')
    expect(error_).toBe(null)
    expect(args_).toEqual(['Elon', 'Musk', true])
})

test('positional flag - last arg - end', () => {
    const cmd = prefix('!cmd')
        .word('First Name')
        .word('Surname')
        .flag('Yes', '--yes', { short: '-y' })

    let [args, error] = cmd.parse('!cmd Elon Musk --yes')
    expect(error).toBe(null)
    expect(args).toEqual(['Elon', 'Musk', true])


    let [args_, error_] = cmd.parse('!cmd Elon Musk -y')
    expect(error_).toBe(null)
    expect(args_).toEqual(['Elon', 'Musk', true])
})