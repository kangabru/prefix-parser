import prefix from '../index';

test('matched time s', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd 25s')
    expect(error).toBe(null)
    expect(args).toEqual([25])
})

test('matched time m', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd 25m')
    expect(error).toBe(null)
    expect(args).toEqual([1500])
})

test('matched time h', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd 25h')
    expect(error).toBe(null)
    expect(args).toEqual([90e3])
})

test('matched time d', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd 25d')
    expect(error).toBe(null)
    expect(args).toEqual([2160e3])
})

test('matched time - zero pad', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd 000002s')
    expect(error).toBe(null)
    expect(args).toEqual([2])
})

test('matched time - long num', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd 123456789123456789s')
    expect(error).toBe(null)
    expect(args).toEqual([123456789123456789])
})

test('matched time - long num', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd 1e5s')
    expect(error).toContain("`time {time}` is missing or invalid.")
    expect(args).toEqual(null)
})

test('matched time - fail - no unit', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd 25')
    expect(error).toContain("`time {time}` is missing or invalid.")
    expect(args).toEqual(null)
})

test('matched time - fail - negative', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd -25d')
    expect(error).toContain("`time {time}` is missing or invalid.")
    expect(args).toEqual(null)
})

test('matched time - fail - decimal', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd 1.5d')
    expect(error).toContain("`time {time}` is missing or invalid.")
    expect(args).toEqual(null)
})

test('matched time - text', () => {
    const [args, error] = prefix('!cmd').time('time').parse('!cmd two')
    expect(args).toEqual(null)
    expect(error).toContain("`time {time}` is missing or invalid.")
})

test('matched time - pass min', () => {
    const [args, error] = prefix('!cmd').time('time', { min: '20m' }).parse('!cmd 25m')
    expect(args).toEqual([1500])
    expect(error).toBe(null)
})

test('matched time - pass max', () => {
    const [args, error] = prefix('!cmd').time('time', { max: '1d' }).parse('!cmd 25m')
    expect(args).toEqual([1500])
    expect(error).toBe(null)
})

test('matched time - pass min/max', () => {
    const [args, error] = prefix('!cmd').time('time', { min: '20m', max: '1d' }).parse('!cmd 25m')
    expect(args).toEqual([1500])
    expect(error).toBe(null)
})

test('matched time - fail min', () => {
    const [args, error] = prefix('!cmd').time('time', { min: '20m' }).parse('!cmd 15s')
    expect(args).toEqual(null)
    expect(error).toContain("`time {time >20m}` error: '15s' cannot be less than '20m'.")
})

test('matched time - fail max', () => {
    const [args, error] = prefix('!cmd').time('time', { max: '1d' }).parse('!cmd 2d')
    expect(args).toEqual(null)
    expect(error).toContain("`time {time <1d}` error: '2d' cannot be more than '1d'.")
})

test('matched time - fail min/max 1', () => {
    const [args, error] = prefix('!cmd').time('time', { min: '20m', max: '1d' }).parse('!cmd 15s')
    expect(args).toEqual(null)
    expect(error).toContain("`time {time 20m~1d}` error: '15s' cannot be less than '20m'.")
})

test('matched time - fail min/max 2', () => {
    const [args, error] = prefix('!cmd').time('time', { min: '20m', max: '1d' }).parse('!cmd 2d')
    expect(args).toEqual(null)
    expect(error).toContain("`time {time 20m~1d}` error: '2d' cannot be more than '1d'.")
})

test('arg time min', () => {
    expect(() => {
        prefix('!cmd').time('time', { min: 5 as any })
    }).toThrow("Min value '5' must be text")
})

test('arg time min no unit', () => {
    expect(() => {
        prefix('!cmd').time('time', { min: '5' })
    }).toThrow("Min value '5' must be a time unit")
})

test('arg time min decimal', () => {
    expect(() => {
        prefix('!cmd').time('time', { min: '5.0m' })
    }).toThrow("Min value '5.0m' must be a time unit")
})

test('arg time min negative', () => {
    expect(() => {
        prefix('!cmd').time('time', { min: '-5d' })
    }).toThrow("Min value '-5d' must be a time unit")
})

test('arg time min bad unit', () => {
    expect(() => {
        prefix('!cmd').time('time', { min: '1w' })
    }).toThrow("Min value '1w' must be a time unit")
})

test('arg time max', () => {
    expect(() => {
        prefix('!cmd').time('time', { max: 5 as any })
    }).toThrow("Max value '5' must be text")
})

test('arg time max no unit', () => {
    expect(() => {
        prefix('!cmd').time('time', { max: '5' })
    }).toThrow("Max value '5' must be a time unit")
})

test('arg time max decimal', () => {
    expect(() => {
        prefix('!cmd').time('time', { max: '5.0m' })
    }).toThrow("Max value '5.0m' must be a time unit")
})

test('arg time max negative', () => {
    expect(() => {
        prefix('!cmd').time('time', { max: '-5d' })
    }).toThrow("Max value '-5d' must be a time unit")
})

test('arg time max bad unit', () => {
    expect(() => {
        prefix('!cmd').time('time', { max: '1w' })
    }).toThrow("Max value '1w' must be a time unit")
})

test('arg time min/max sec/min pass', () => {
    prefix('!cmd').time('time', { min: '119s', max: '2m' })
})

test('arg time min/max sec/min fail', () => {
    expect(() => {
        prefix('!cmd').time('time', { min: '120s', max: '2m' })
    }).toThrow("Min value '120s' must be less than '2m'")
})

test('arg time min/max sec/min pass', () => {
    prefix('!cmd').time('time', { min: '119m', max: '2h' })
})

test('arg time min/max sec/min fail', () => {
    expect(() => {
        prefix('!cmd').time('time', { min: '120m', max: '2h' })
    }).toThrow("Min value '120m' must be less than '2h'")
})

test('arg time min/max sec/min pass', () => {
    prefix('!cmd').time('time', { min: '47h', max: '2d' })
})

test('arg time min/max sec/min fail', () => {
    expect(() => {
        prefix('!cmd').time('time', { min: '48h', max: '2d' })
    }).toThrow("Min value '48h' must be less than '2d'")
})

test('missing time', () => {
    const [_args, error] = prefix('!cmd').time('Num').parse('!cmd')
    expect(error).toBe("`Num {time}` is missing or invalid. Type `!cmd --help` for info.")
})

test('example time none', () => {
    const example = prefix('!cmd').time('time').example()
    expect(example).toBe("`!cmd 30s`")
})

test('example time sec', () => {
    const example = prefix('!cmd').time('time', { min: '0s', max: '10s' }).example()
    expect(example).toBe("`!cmd 5s`")
})

test('example time min', () => {
    const example = prefix('!cmd').time('time', { min: '5m', max: '15m' }).example()
    expect(example).toBe("`!cmd 10m`")
})

test('example time hour', () => {
    const example = prefix('!cmd').time('time', { min: '10h', max: '20h' }).example()
    expect(example).toBe("`!cmd 15h`")
})

test('example time day', () => {
    const example = prefix('!cmd').time('time', { min: '15d', max: '25d' }).example()
    expect(example).toBe("`!cmd 20d`")
})

test('example time sec max', () => {
    const example = prefix('!cmd').time('time', { max: '10s' }).example()
    expect(example).toBe("`!cmd 5s`")
})

test('example time min max', () => {
    const example = prefix('!cmd').time('time', { max: '15m' }).example()
    expect(example).toBe("`!cmd 7m`")
})

test('example time hour max', () => {
    const example = prefix('!cmd').time('time', { max: '20h' }).example()
    expect(example).toBe("`!cmd 10h`")
})

test('example time day max', () => {
    const example = prefix('!cmd').time('time', { max: '25d' }).example()
    expect(example).toBe("`!cmd 12d`")
})

test('example time sec min', () => {
    const example = prefix('!cmd').time('time', { min: '10s' }).example()
    expect(example).toBe("`!cmd 20s`")
})

test('example time min min', () => {
    const example = prefix('!cmd').time('time', { min: '15m' }).example()
    expect(example).toBe("`!cmd 30m`")
})

test('example time hour min', () => {
    const example = prefix('!cmd').time('time', { min: '20h' }).example()
    expect(example).toBe("`!cmd 40h`")
})

test('example time day min', () => {
    const example = prefix('!cmd').time('time', { min: '25d' }).example()
    expect(example).toBe("`!cmd 50d`")
})

test('example time sec min', () => {
    const example = prefix('!cmd').time('time', { min: '10s', max: '20m' }).example()
    expect(example).toBe("`!cmd 605s`")
})

test('example time min min', () => {
    const example = prefix('!cmd').time('time', { min: '15m', max: '2h' }).example()
    expect(example).toBe("`!cmd 67m`")
})

test('example time hour min', () => {
    const example = prefix('!cmd').time('time', { min: '20h', max: '3d' }).example()
    expect(example).toBe("`!cmd 46h`")
})
