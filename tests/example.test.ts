import prefix from '../src/index';

// Text

test('example 1 word', () => {
    expect(prefix('!cmd').word('Name').example()).toContain('lorem')
})

test('example 2 words', () => {
    expect(prefix('!cmd').words('Name', 2).example()).toContain('lorem ipsum')
})

test('example 3 words', () => {
    expect(prefix('!cmd').words('Name', 3).example()).toContain('lorem ipsum dolor')
})

test('example text', () => {
    expect(prefix('!cmd').text('Name').example()).toContain('lorem ipsum')
})

test('example rest', () => {
    expect(prefix('!cmd').rest('Name').example()).toContain('lorem ipsum')
})

// Regex

test('example regex', () => {
    expect(prefix('!cmd').regex('Name', 'abc', /[a-z]{3}/).example()).toContain('abc')
})

test('example regex', () => {
    expect(prefix('!cmd').regex('Name', 'test@example.com', /[a-z]+@[a-z]+\.com/).example()).toContain('test@example.com')
})

// Int

test('example int', () => {
    expect(prefix('!cmd').int('Age').example()).toContain('50')
})

test('example int min', () => {
    expect(prefix('!cmd').int('Age', 11).example()).toContain('55')
})

test('example int max', () => {
    expect(prefix('!cmd').int('Age', null, 11).example()).toContain('5')
})

test('example int min/max pos', () => {
    expect(prefix('!cmd').int('Age', 1, 11).example()).toContain('6')
})

test('example int min/max neg', () => {
    expect(prefix('!cmd').int('Age', -11, -1).example()).toContain('-6')
})

test('example int float', () => {
    expect(prefix('!cmd').int('Age', 1.1, 10.9).example()).toContain('5')
})

// Float

test('example float', () => {
    expect(prefix('!cmd').float('Age').example()).toContain('50')
})

test('example int min', () => {
    expect(prefix('!cmd').float('Age', 11.5).example()).toContain('55.75')
})

test('example int max', () => {
    expect(prefix('!cmd').float('Age', null, 11.5).example()).toContain('5.75')
})

test('example int min/max pos', () => {
    expect(prefix('!cmd').float('Age', 1.5, 11.5).example()).toContain('6.50')
})

test('example int min/max neg', () => {
    expect(prefix('!cmd').float('Age', -11.5, -1.5).example()).toContain('-6.50')
})

test('example float int', () => {
    expect(prefix('!cmd').float('Age', 1, 11).example()).toContain('6')
})

// Mention

test('example mention user', () => {
    expect(prefix('!cmd').user('Name').example()).toContain('<@12345>')
})

test('example mention role', () => {
    expect(prefix('!cmd').role('Name').example()).toContain('<@&12345>')
})

test('example mention channel', () => {
    expect(prefix('!cmd').channel('Name').example()).toContain('<#12345>')
})

// Flag

test('example flag long/short yes', () => {
    expect(prefix('!cmd').flagTrue('Yes', '--yes', '-y').example()).toContain('--yes')
})

test('example flag long yes', () => {
    expect(prefix('!cmd').flagTrue('Yes', '--yes').example()).toContain('--yes')
})

test('example flag long/short no', () => {
    expect(prefix('!cmd').flagFalse('Nup', '--nup', '-n').example()).toContain('--nup')
})

test('example flag long no', () => {
    expect(prefix('!cmd').flagFalse('Nup', '--nup').example()).toContain('--nup')
})