<div align="center">

# ¡Discord Prefix Parser!

Easily parse and validate prefix commands in Discord

</div>

## Features

- 👀 **Parse messages into JS variables**
    - 👩‍💻 `.parse('!rate @kangabru 10 Kang is pog --public')`
    - 🤖 `>> ['72657579', 10, 'Kang is pog', true]`

- 👮‍♂️ **Validate inputs**
    - 👩‍💻 `.parse('!rate @kangabru 100 Kang is pog --public')`
    - 🤖 `>> "Rating value '100' cannot be greater than '10'"`

- 🧠 **Automatic command help**
    - 👩‍💻 `.parse('!rate --help')`
    - 🤖 `!rate`  **Rate your friends!**

        ***Usage:***
        `!rate`  `User {@user}`  `Rating {int} {0-10}`  `Reason {text}`  `Is Public {-p/--public}`

        ***Example:***
        `!rate @user 6 lorem ipsum --public`

---

## 🚀 Get started

Using node or discord.js? Install with:

```shell
npm i prefix-parser
```

Using Autocode? Install with:

```js
const prefix = require('prefix-parser')
```

> A green 'Installed Dependency' should popup to confirm the installation

---

## 📚 Usage

Create commands in 3 simple steps:

**1. Create the command**
```js
const prefix = require('prefix-parser')

const command = prefix("!rate", "Rate your friends!")
    .user('User')
    .int('Rating', { min: 0, max: 10 })
    .text('Reason')
    .flag('Is Public', '--public')
```

**2. Parse a message**
```js
const content = '!rate @kangabru 10 Kang is pog --public' // use 'message.content' in prod
const [args, infoOrError] = command.parse(content)

console.log(args) // ['72657579', 10, 'Kang is pog', true]
console.log(infoOrError) // null
```

**3. Handle results**
```js
if (infoOrError)
{
    // Send `infoOrError` as a message back to Discord.
    // It's populated for --help and errors otherwise 'null'
    sendMessage(infoOrError);
}
else if (args)
{
    // Your command logic goes here
    // It's populated when parsed successfully otherwise 'null'
    handleRateCommand(args);
}
```

**All together:**

Combining steps 1-3 looks like this:

```js
const prefix = require('prefix-parser')

const content = '!rate @kangabru 10 Kang is pog --public' // use 'message.content' in prod
const [args, infoOrError] = prefix("!rate")
    .user('User')
    .int('Rating', { min: 0, max: 10 })
    .text('Reason')
    .flag('Is Public', '--public')
    .parse(content)

if (infoOrError)
{
    // Send `infoOrError` as a message back to Discord.
    sendMessage(infoOrError);
}
else if (args)
{
    // Your command logic goes here
    handleRateCommand(args); // ['72657579', 10, 'Kang is pog', true]
}
```

<details><summary>See Example (Discord.js)</summary><br>

```js
const prefix = require('prefix-parser')

client.on('messageCreate', message => {
    const [args, infoOrError] = prefix("!rate", , "Rate your friends!")
        .user('User')
        .int('Rating', { min: 0, max: 10 })
        .text('Reason')
        .flag('Is Public', '--public')
        .parse(message.content)

    if (infoOrError) {
        return message.channel.send(infoOrError)
    }
    else if (args) {
        return handleRateCommand(args) // Replace with Rate command logic
    }

    // Handle other commands below...
})
```

</details>

<details><summary>See Example (Autocode)</summary><br>

**Endpoint:** `message.create`

```js
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const prefix = require('prefix-parser')
const { channel_id, content } = context.params.event;

const [args, infoOrError] = prefix("!rate", "Rate your friends!")
    .user('User')
    .int('Rating', { min: 0, max: 10 })
    .text('Reason')
    .flag('Is Public', '--public')
    .parse(content)

if (infoOrError) {
    return lib.discord.channels['@0.1.2'].messages.create({ channel_id, content: infoOrError })
}
else if (args) {
    return handleRateCommand(args) // Replace with Rate command logic
}

// Handle other commands below...
```

</details>

### Explained: `args`

These are the parsed arguments (args) for the command the user entered.
- It's always an array `[...]` of values when parsing was successful and `null` otherwise.
- Args are returned in the same order they were defined in code.
- Args are validated so the user can only enter valid values.
- Arg values are returned as a suitable JS value. E.g. `int` and `float` args return numbers.

```js
const [args, infoOrError] = command.parse('!rate @kangabru 10 Kang is pog --public')
console.log(args) // ['72657579', 10, 'Kang is pog', true]
```

### Explained: `infoOrError`

This is a descriptive message that should be shown to the end user.
- It's always a string `"..."` if an info or error occurred and `null` otherwise.
- Info about the command is returned if `-h` or `--help` was used on the command.
- An error is returned if the user didn't use the command correctly.
Args are automatically validated and users get descriptive messages about them. Errors are user friendly and render nicely in Discord.

```js
const [args, infoOrError] = command.parse('!rate @kangabru 10') // Omit 'reason'
console.log(infoOrError) // 'Reason' not found
```

### Explained: `--help`

All commands include a help flag `-h` or `--help` which explain what the command is and the arguments it accepts.

```js
const [args, infoOrError] = command.parse('!rate --help')
console.log(infoOrError) // !rate <User {@user}> <Rating {int 0~10}> <Reason {text}> <Is Public {--public}>
```

---

## 📖 Examples

Here are some real world examples to showcase the various features.

### Purge

Uses: `int`

```javascript
// !purge 25
const [args, infoOrError] = prefix("!purge")
    .int('Messages')
    .parse(content)

const [messageCount] = args // [25]
```

### Slap

Uses: `user`

```javascript
// -slap @user
const [args, infoOrError] = prefix("-slap")
    .user('User')
    .parse(content)

const [user] = args // ['12345']
```

### Math

Uses: `rest`

```javascript
// *math 2+2
const [args, infoOrError] = prefix("*math")
    .rest('Equation')
    .parse(content)

const [equation] = args // ['2+2']
```

### Giveaway

Uses: `int` `rest`

```javascript
// %giveaway 60 Win a jetski! 🚤
const [args, infoOrError] = prefix("%giveaway")
    .int('Seconds', { min: 20, max: 300 }) // 20s - 5mins
    .rest('Prize')
    .parse(content)

const [seconds, prize] = args // [60, 'Win a jetski! 🚤']
```

### Assign

Uses: `user` `role`

```javascript
// >assign @user @role
const [args, infoOrError] = prefix(">assign")
    .user('User')
    .role('Role')
    .parse(content)

const [user, role] = args // ['12345', '12345']
```

### Announce

Uses: `channel` `text`

```javascript
// !announce #announcements I love you all!
const [args, infoOrError] = prefix("!announce")
    .channel('Post to')
    .text('Message')
    .parse(content)

const [channel, message] = args // ['12345', 'I love you all']
```

### Invite

Uses: `words` `regex`

```javascript
// !invite Elon Musk elon@musk.space
const [args, infoOrError] = prefix("!invite")
    .words('Name', 2)
    .regex('Email', /\w+@\w+\.\w+/, 'steve@apple.com')
    .parse(content)

const [name, email] = args // ['Elon Musk', 'elon@musk.space']
```

### ASL

Uses: `int` `word` `text`

```javascript
// ?asl 18 f Cali
const [args, infoOrError] = prefix("?asl")
    .int('Age')
    .word('Gender')
    .text('Location')
    .parse(content)

const [age, gender, location] = args // [18, 'f', 'Cali']
```

### Remind

Uses: `channel` `int` `text` `flag`

```javascript
// remind me #general 2 Organise a team game --public
const [args, infoOrError] = prefix("remind me")
    .channel('Where')
    .int('Days', { min: 1, max: 7 })
    .text('Reminder')
    .flag('Is Public', '--public')
    .parse(content)

const [where, days, reminder, isPublic] = args // ['12345', 2, 'Organise a team game', 'true']
```

### Mute

Uses: `user` `text` `channel` `int`

```javascript
// !mute @user Talking too fast #mute-jail 15
const [args, infoOrError] = prefix("!mute")
    .user('Where')
    .text('Reason')
    .channel('Jail')
    .int('Hours')
    .parse(content)

const [where, reason, channel, days] = args // ['12345', 'Talking too fast', '12345', 15]
```

### Send $

Uses: `user`, `float`, `regex`, `rest`

```javascript
// $send @user 123.45 doge_01 Buying 100 dogecoins
const [args, infoOrError] = prefix("$send")
    .user('Vendor')
    .float('Amount')
    .regex('Item ID', /\w{4}_\d{2}/, 'abcd_01')
    .rest('Notes')
    .parse(content)

const [vendor, amount, itemId, notes] = args // ['12345', 123.45, 'doge_01', 'Buying 100 dogecoins']
```

---

## ⚡ Arguments

Arguments are the building blocks that give your commands power. Here's every single one of them and how you can make your own.

Note that every argument *must* specify a `name` (string) as the first argument to be used in help and error messages.

### Words

Match 1 or more words that include characters `a-z`, `0-9`, and `_`.
- `word(name)` matches 1 word only
- `words(name, words=1)` matches 1 or more words

**Returns** `string`

```js
const cmd = prefix('!cmd')
const msg = '!cmd this is a sentence'

cmd.word('Word').parse(msg) // >> ['this']
cmd.words('Words', 2).parse(msg) // >> ['this is']
cmd.words('Words', 5).parse(msg) // >> Error: There are only 4 words
```

### Text

Match text within or at the end of the command:
- `text(name)` will look for as much text as it can that include characters `a-z`, `space`, and `_`.
- `rest(name)` will match all remaining text and must be the last argument.

**Returns** `string`

```js
const cmd = prefix('!cmd')
const msg = '!cmd Pigs can fly. Monkeys cannot.'

cmd.text('Text').parse(msg) // >> ['Pigs can fly']
cmd.rest('Rest').parse(msg) // >> ['Pigs can fly. Monkeys cannot.']
```

### Numbers

Match numbers like `123` and `12.34`:
- `int(name, options={})` will match numbers and convert them to integers.
- `float(name, options={})` will match numbers and convert them to floats.

**Options:**
- `min` (number) - The minimum value a user can enter.
- `max` (number) - The maximum value a user can enter.

**Returns:** `number`

```js
const cmd = prefix('!cmd')
    .int('Num 1')
    .int('Num 2', { max: 100 }) // max of 100
    .float('Num 3', { min: 0 }) // min of 0

cmd.parse('!cmd 8 12.34 56.78') // >> [8, 12, 56.78]
```

### Mentions

Match Discord mention types and extract their ID numbers.
- `user(name)` matches a mention like '@user'.
- `role(name)` matches a mention like '@role'.
- `channel(name)` matches a mention like '#channel'.

**Returns** `string`

```js
const cmd = prefix('!cmd')
    .user('User')
    .role('Role')
    .channel('Channel')

// User types: !cmd @kangabru @admin #general
cmd.parse('!cmd <@12345> <@&67890> <#24680>') // >> ['12345', '67890', '24680']
```

> Discord sends mention IDs like <@!12345> and the ID '12345' is extracted.

### Flags

Match optional flags like `--flag` which can be placed anywhere by the user.
- `flag(name, command, options={})`
    - `name` (string) The name of the argument uses in help messages.
    - `command` (string) A command like `--abc` that must start with `--` and have at least 3 characters.

**Options:**
- `short` (string) The short version of the command like `-h` that must start with `-` and have 1-3 characters.
- `storeFalse` (boolean) Make the parser return `false` instead of `true` when the flag is set by the user.

**Returns** `boolean`

```js
const cmd = prefix('!cmd')
    .flag('Allow', '--yes', { short: '-y' }) // Returns 'true' when set
    .flag('Deny', '--no', { short: '-n', storeFalse: true }) // Returns 'false' when set

// When set
cmd.parse('!cmd --yes --no') // >> [true, false]
cmd.parse('!cmd -y -n') // >> [true, false]

// When unset
cmd.parse('!cmd') // >> [false, true]
```

### Regex

Default args not enough for you? Match custom text with [regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).
- `regex(name, regexp, example, options={})`
    - `regexp` (RegExp) The regular expression like `/\w+/`.
    - `example` (string) An example of what the regex will match. This is used in error messages and *must* match the regex provided or an error will be thrownm when `.regex(...)` is called.

**Options:**
- `group` (number) The regex group index to return from the `<text>.match(<regexp>)` call. Defaults to `0` (the entire match).

**Returns** `string`

```js
const simpleEmail = /\w+@\w+\.\w+/
const cmd = prefix('!cmd').regex('Email', simpleEmail, 'user@example.com')

cmd.parse('!cmd user@example.com') // >> ['user@example.com']
cmd.parse('!cmd user.example@com') // >> Error: Email not found
```

> **Advanced:** *Still not enough?* Create your own parser! See the various `src/` files to see how to inherit the `BaseArg` and other args. You just need to implement the `parse` and `help` functions and it'll plug and play with everything nicely. Highly recommended to use Typescript to check input and return types.

---

## ❗ Prefix

The `prefix` function is the starting point for defining commands. Under the hood it stores your arguments and can use them to provide cool features like the `--help` function, infoOrError messages, and of course parsing values.

Use with Javascript like this:

```js
const prefix = require('prefix-parser')
const cmd = prefix('!cmd')
```

### Command Description

The `prefix` function also accepts an optional description field which is used in the `--help` command.

```js
const cmd = prefix('!cmd', 'Best Command')
cmd.parse(`!cmd --help`) // >> `!cmd` Best Command ...
```

### Args Fluent Interface

The easiest way to add arguments is via the fluent interface:

```js
prefix('!cmd')
    .int("Age")
    .float("Height")
    .text("Name")
    .parse("!cmd 20 1.8 Jim Bob") // >> [20, 1.8, 'Jim Bob']
```

### Args Array

Sick of the fluent interface or want dynamic args? Provide them via an array instead:

```js
prefix('!cmd')
    .args(...[
        new IntegerArg("Age"),
        new FloatArg("Height"),
        new RestArg("Name"),
    ])
    .parse("!cmd 20 1.8 Jim Bob") // >> [20, 1.8, 'Jim Bob']
```

---

## 💻 Development

Issues and PRs are welcome!

The quickest way to code is via a test. Follow the examples in the `test/` dir and run `npm run test` to run them. For even faster deving use the VSCode 'jest' extension to test automatically on code changes.

---

## 📄 About

Copyright 2021 Kangabru

❤ [MIT license baby](LICENSE)
