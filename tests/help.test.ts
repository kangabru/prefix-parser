import prefix from '../src/index';

// Text

test('help 1 word', () => {
    expect(prefix('!cmd').word('Name').help()).toContain('<Name {1 word}>')
})

test('help 2 words', () => {
    expect(prefix('!cmd').words('Name', 2).help()).toContain('<Name {2 words}>')
})

test('help 3 words', () => {
    expect(prefix('!cmd').words('Name', 3).help()).toContain('<Name {3 words}>')
})

test('help text', () => {
    expect(prefix('!cmd').text('Name').help()).toContain('<Name {text}>')
})

test('help rest', () => {
    expect(prefix('!cmd').rest('Name').help()).toContain('<Name {remaining}>')
})

// Regex

test('help regex', () => {
    expect(prefix('!cmd').regex('Name', /[a-z]{3}/, 'abc').help()).toContain('<Name {text}>')
})

// Int

test('help int', () => {
    expect(prefix('!cmd').int('Age').help()).toContain('<Age {int}>')
})

test('help int min 0', () => {
    expect(prefix('!cmd').int('Age', { min: 0 }).help()).toContain('<Age {int >0}>')
})

test('help int min 5', () => {
    expect(prefix('!cmd').int('Age', { min: 5 }).help()).toContain('<Age {int >5}>')
})

test('help int max 0', () => {
    expect(prefix('!cmd').int('Age', { max: 0 }).help()).toContain('<Age {int <0}>')
})

test('help int max 5', () => {
    expect(prefix('!cmd').int('Age', { max: 5 }).help()).toContain('<Age {int <5}>')
})

test('help int min/max pos', () => {
    expect(prefix('!cmd').int('Age', { min: 0, max: 5 }).help()).toContain('<Age {int 0~5}>')
})

test('help int min/max neg', () => {
    expect(prefix('!cmd').int('Age', { min: -5, max: 0 }).help()).toContain('<Age {int -5~0}>')
})

test('help int min/max neg alt', () => {
    expect(prefix('!cmd').int('Age', { min: -10, max: -5 }).help()).toContain('<Age {int -10~-5}>')
})

test('help int float', () => {
    expect(prefix('!cmd').int('Age', { min: 5.9, max: 10.9 }).help()).toContain('<Age {int 5~10}>')
})

// Float

test('help float', () => {
    expect(prefix('!cmd').float('Age').help()).toContain('<Age {float}>')
})

test('help float min 1.2', () => {
    expect(prefix('!cmd').float('Age', { min: 1.2 }).help()).toContain('<Age {float >1.2}>')
})

test('help float min 5.6', () => {
    expect(prefix('!cmd').float('Age', { min: 5.6 }).help()).toContain('<Age {float >5.6}>')
})

test('help float max 1.2', () => {
    expect(prefix('!cmd').float('Age', { max: 1.2 }).help()).toContain('<Age {float <1.2}>')
})

test('help float max 5.6', () => {
    expect(prefix('!cmd').float('Age', { max: 5.6 }).help()).toContain('<Age {float <5.6}>')
})

test('help float min/max pos', () => {
    expect(prefix('!cmd').float('Age', { min: 1.2, max: 5.6 }).help()).toContain('<Age {float 1.2~5.6}>')
})

test('help float min/max neg', () => {
    expect(prefix('!cmd').float('Age', { min: -5.6, max: 1.2 }).help()).toContain('<Age {float -5.6~1.2}>')
})

test('help float min/max neg alt', () => {
    expect(prefix('!cmd').float('Age', { min: -11.2, max: -5.6 }).help()).toContain('<Age {float -11.2~-5.6}>')
})

// Mention

test('help mention user', () => {
    expect(prefix('!cmd').user('Name').help()).toContain('<Name {@user}>')
})

test('help mention role', () => {
    expect(prefix('!cmd').role('Name').help()).toContain('<Name {@role}>')
})

test('help mention channel', () => {
    expect(prefix('!cmd').channel('Name').help()).toContain('<Name {#channel}>')
})

// Flag

test('help flag long/short', () => {
    expect(prefix('!cmd').flag('Yes', '--yes', { short: '-y' }).help()).toContain('<Yes {--yes/-y}>')
})

test('help flag long', () => {
    expect(prefix('!cmd').flag('Yes', '--yes').help()).toContain('<Yes {--yes}>')
})