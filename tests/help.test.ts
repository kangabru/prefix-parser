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
