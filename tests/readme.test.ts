import prefix from '../src/index';

test('readme - rate', () => {
    const content = '!rate <@!12345> 10 Kang is pog --public'
    const command = prefix("!rate")
        .user('User')
        .int('Rating', { min: 0, max: 10 })
        .text('Reason')
        .flag('Is Public', '--public')

    const helpText = command.parse('!rate --help')[1]
    expect(helpText).toBe("!rate <User {@user}> <Rating {int 0~10}> <Reason {text}> <Is Public {--public}>")

    const [args, infoOrError] = command.parse(content)

    args as [string, number, string, boolean] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual(['12345', 10, 'Kang is pog', true])
})

test('readme - purge', () => {
    const content = '!purge 25'
    const [args, infoOrError] = prefix("!purge")
        .int('Messages')
        .parse(content)

    args as [number] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual([25])
})

test('readme - slap', () => {
    const content = '-slap <@!12345>'
    const [args, infoOrError] = prefix("-slap")
        .user('User')
        .parse(content)

    args as [string] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual(['12345'])
})

test('readme - math', () => {
    const content = '*math 2+2'
    const [args, infoOrError] = prefix("*math")
        .rest('Equation')
        .parse(content)

    args as [string] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual(['2+2'])
})

test('readme - giveaway', () => {
    const content = '%giveaway 60 Win a jetski! 🚤'
    const [args, infoOrError] = prefix("%giveaway")
        .int('Seconds', { min: 20, max: 300 }) // 20s - 5mins
        .rest('Prize')
        .parse(content)

    args as [number, string] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual([60, 'Win a jetski! 🚤'])
})

test('readme - asign', () => {
    const content = '>assign <@!12345> <@&12345>'
    const [args, infoOrError] = prefix(">assign")
        .user('User')
        .role('Role')
        .parse(content)

    args as [string, string] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual(['12345', '12345'])
})

test('readme - announce', () => {
    const content = '!announce <#12345> I love you all!'
    const [args, infoOrError] = prefix("!announce")
        .channel('Post to')
        .text('Message')
        .parse(content)

    args as [string, string] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual(['12345', 'I love you all'])
})


test('readme - invite', () => {
    const content = '!invite Elon Musk elon@musk.space'
    const [args, infoOrError] = prefix("!invite")
        .words('Name', 2)
        .regex('Email', /\w+@\w+\.\w+/, 'steve@apple.com')
        .parse(content)

    args as [string, string] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual(['Elon Musk', 'elon@musk.space'])
})

test('readme - asl', () => {
    const content = '?asl 18 f Cali'
    const [args, infoOrError] = prefix("?asl")
        .int('Age')
        .word('Gender')
        .text('Location')
        .parse(content)

    args as [number, string, string] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual([18, 'f', 'Cali'])
})

test('readme - remind', () => {
    const content = 'remind me <#12345> 2 Organise a team game --public'
    const [args, infoOrError] = prefix("remind me")
        .channel('Where')
        .int('Days', { min: 1, max: 7 })
        .text('Reminder')
        .flag('Is Public', '--public')
        .parse(content)

    args as [string, number, string, boolean] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual(['12345', 2, 'Organise a team game', true])
})

test('readme - mute', () => {
    const content = '!mute <@!12345> Talking too fast <#12345> 15'
    const [args, infoOrError] = prefix("!mute")
        .user('Where')
        .text('Reason')
        .channel('Jail')
        .int('Minutes')
        .parse(content)

    args as [string, string, string, number] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual(['12345', 'Talking too fast', '12345', 15])
})

test('readme - send', () => {
    const content = '$send <@!12345> 123.45 doge_01 Buying 100 dogecoins'
    const [args, infoOrError] = prefix("$send")
        .user('Vendor')
        .float('Amount')
        .regex('Item ID', /\w{4}_\d{2}/, 'abcd_01')
        .rest('Notes')
        .parse(content)

    args as [string, number, string, string] // Typecheck
    expect(infoOrError).toBe(null)
    expect(args).toEqual(['12345', 123.45, 'doge_01', 'Buying 100 dogecoins'])
})