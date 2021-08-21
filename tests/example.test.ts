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
    expect(prefix('!cmd').int('Age').example()).toContain('<Age {int}>')
})

test('example int min 0', () => {
    expect(prefix('!cmd').int('Age', 0).example()).toContain('<Age {int >0}>')
})

test('example int min 5', () => {
    expect(prefix('!cmd').int('Age', 5).example()).toContain('<Age {int >5}>')
})

test('example int max 0', () => {
    expect(prefix('!cmd').int('Age', null, 0).example()).toContain('<Age {int <0}>')
})

test('example int max 5', () => {
    expect(prefix('!cmd').int('Age', null, 5).example()).toContain('<Age {int <5}>')
})

test('example int min/max pos', () => {
    expect(prefix('!cmd').int('Age', 0, 5).example()).toContain('<Age {int 0~5}>')
})

test('example int min/max neg', () => {
    expect(prefix('!cmd').int('Age', -5, 0).example()).toContain('<Age {int -5~0}>')
})

test('example int min/max neg alt', () => {
    expect(prefix('!cmd').int('Age', -10, -5).example()).toContain('<Age {int -10~-5}>')
})

test('example int float', () => {
    expect(prefix('!cmd').int('Age', 5.9, 10.9).example()).toContain('<Age {int 5~10}>')
})

// Float

test('example float', () => {
    expect(prefix('!cmd').float('Age').example()).toContain('<Age {float}>')
})

test('example float min 1.2', () => {
    expect(prefix('!cmd').float('Age', 1.2).example()).toContain('<Age {float >1.2}>')
})

test('example float min 5.6', () => {
    expect(prefix('!cmd').float('Age', 5.6).example()).toContain('<Age {float >5.6}>')
})

test('example float max 1.2', () => {
    expect(prefix('!cmd').float('Age', null, 1.2).example()).toContain('<Age {float <1.2}>')
})

test('example float max 5.6', () => {
    expect(prefix('!cmd').float('Age', null, 5.6).example()).toContain('<Age {float <5.6}>')
})

test('example float min/max pos', () => {
    expect(prefix('!cmd').float('Age', 1.2, 5.6).example()).toContain('<Age {float 1.2~5.6}>')
})

test('example float min/max neg', () => {
    expect(prefix('!cmd').float('Age', -5.6, 1.2).example()).toContain('<Age {float -5.6~1.2}>')
})

test('example float min/max neg alt', () => {
    expect(prefix('!cmd').float('Age', -11.2, -5.6).example()).toContain('<Age {float -11.2~-5.6}>')
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