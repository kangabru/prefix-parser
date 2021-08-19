import prefix from '../src/index';

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

test('help int', () => {
    expect(prefix('!cmd').int('Age').help()).toContain('<Age {int}>')
})

test('help int min 0', () => {
    expect(prefix('!cmd').int('Age', 0).help()).toContain('<Age {int >0}>')
})

test('help int min 5', () => {
    expect(prefix('!cmd').int('Age', 5).help()).toContain('<Age {int >5}>')
})

test('help int max 0', () => {
    expect(prefix('!cmd').int('Age', null, 0).help()).toContain('<Age {int <0}>')
})

test('help int max 5', () => {
    expect(prefix('!cmd').int('Age', null, 5).help()).toContain('<Age {int <5}>')
})

test('help int min/max pos', () => {
    expect(prefix('!cmd').int('Age', 0, 5).help()).toContain('<Age {int 0~5}>')
})

test('help int min/max neg', () => {
    expect(prefix('!cmd').int('Age', -5, 0).help()).toContain('<Age {int -5~0}>')
})

test('help int min/max neg alt', () => {
    expect(prefix('!cmd').int('Age', -10, -5).help()).toContain('<Age {int -10~-5}>')
})
