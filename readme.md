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
    - 🤖 `>>`
        ```
        `!rate` Rate users between 0-10
        Usage: `!rate <User {@user}> <Rating {int} {0-10}> <Reason {text}> <Reason {text}> <Is Public {-p/--public}>`
        Example: `!rate @user 6 lorem ipsum --public`
        ```

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

**1. Create command**
```js
const prefix = require('prefix-parser')

const command = prefix("!rate")
    .user('User')
    .int('Rating', { min: 0, max: 10 })
    .text('Reason')
    .flag('Is Public', '--public')
```

**2. Parse a message**
```js
const content = '!rate @kangabru 10 Kang is pog --public'
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

const command = prefix("!rate")
    .user('User')
    .int('Rating', { min: 0, max: 10 })
    .text('Reason')
    .flag('Is Public', '--public')

const content = '!rate @kangabru 10 Kang is pog --public'
const [args, infoOrError] = command.parse(content)

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
client.on('messageCreate', message => {
    const content = message.content

    return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}
});
```

</details>

<details><summary>See Example (Autocode)</summary><br>

```js
TODO
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
- It's always a string `"..."` if and info or error occurred and `null` otherwise.
- Info about the command is returned if `-h` or `--help` was used on the command.
- An error is returned if the user didn't use the command correctly.
Args are automatically validated and users get descriptive messages about them. Errors are user friendly and render nicely in Discord.

```js
const [args, infoOrError] = command.parse('!rate @kangabru 10') // Omit 'reason'
console.log(args) // 'Reason' not found
```

### Explained: `--help`

All commands include a help flag (`-h` / `--help`) to help users use them.

```js
const [args, infoOrError] = command.parse('!rate --help')

console.log(error) // !rate <User {@user}> <Rating {int} {0-10}> <Reason {text}>
console.log(args) // null
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

// >> [25]
const [messageCount] = args
```

### Slap

Uses: `user`

```javascript
// -slap @user
const [args, infoOrError] = prefix("-slap")
    .user('User')
    .parse(content)

// >> ['12345']
const [user] = args
```

### Math

Uses: `rest`

```javascript
// *math 2+2
const [args, infoOrError] = prefix("*math")
    .rest('Equation')
    .parse(content)

// >> ['2+2']
const [equation] = args
```

### Giveaway

Uses: `int` `rest`

```javascript
// %giveaway 60 Win a jetski! 🚤
const [args, infoOrError] = prefix("%giveaway")
    .int('Seconds', { min: 20, max: 300 }) // 20s - 5mins
    .rest('Prize')
    .parse(content)

// >> [60, 'Win a jetski! 🚤']
const [seconds, prize] = args
```

### Assign

Uses: `user`, `role`

```javascript
// >assign @user @role
const [args, infoOrError] = prefix(">assign")
    .user('User')
    .role('Role')
    .parse(content)

// >> ['12345', '12345']
const [user, role] = args
```

### Announce

Uses: `channel` `text`

```javascript
// !announce #announcements I love you all!
const [args, infoOrError] = prefix("!announce")
    .channel('Post to')
    .text('Message')
    .parse(content)

// >> ['12345', 'I love you all']
const [channel, message] = args
```

### Invite

Uses: `words`, `regex`

```javascript
// !invite Elon Musk elon@musk.space
const [args, infoOrError] = prefix("!invite")
    .words('Name', 2)
    .regex('Email', /\w+@\w+\.\w+/, 'steve@apple.com')
    .parse(content)

// >> ['Elon Musk', 'elon@musk.space']
const [name, email] = args
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

// >> [18, 'f', 'Cali']
const [age, gender, location] = args
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

// >> ['12345', 2, 'Organise a team game', 'true']
const [where, days, reminder, isPublic] = args
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

// >> ['12345', 'Talking too fast', '12345', 15]
const [where, reason, channel, days] = args
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

// >> ['12345', 123.45, 'doge_01', 'Buying 100 dogecoins']
const [vendor, amount, itemId, notes] = args
```

---

## ⚡ Arguments

Arguments are the building blocks that give your commands power. Here's every single one of them and how you can make your own.

### Words

The `word` and `words` args match 1 or more words that include characters `a-z`, `0-9`, and `_`.

```js
const cmd = prefix('!cmd')
const msg = '!cmd this is a sentence'

cmd.word('Word').parse(msg) // >> ['this']
cmd.words('Words', 2).parse(msg) // >> ['this is']
cmd.words('Words', 5).parse(msg) // >> Error (there are only 4 words)
```

### Text

The `text` arg will look for as much text as it can that include characters `a-z`, `space`, and `_`.

The `rest` arg will match all remaining text and must be the last argument.

```js
const cmd = prefix('!cmd')
const msg = '!cmd Pigs can fly. Monkeys cannot.'

cmd.text('Text').parse(msg) // >> ['Pigs can fly']
cmd.rest('Rest').parse(msg) // >> ['Pigs can fly. Monkeys cannot.']
```

### Numbers

The `int` arg will match numbers and convert them to integers.

The `float` arg will match numbers and convert them to floats.

Both args can take optional min/max values.

```js
const cmd = prefix('!cmd')
    .int('Num', null, 100) // max of 100
    .float('Num', 0) // min of 0

cmd.parse('!cmd 12.34 56.78') // >> ['12', '56.78']
```

### Mentions

The `user`, `role`, and `channel` args will match Discord mentions and extract their IDs.

```js
const cmd = prefix('!cmd')
    .user('User')
    .role('Role')
    .channel('Channel')

// User types: !cmd @kangabru @admin #general
cmd.parse('!cmd <@12345> <@&67890> <#24680>') // >> ['12345', '67890', '24680']
```

### Flags

The `flag` and `flag` flags match arguments like `--help` and `-h` and return booleans.

```js
const cmd = prefix('!cmd')
    .flag('A', '--alpha', '-a') // Var will be 'true' when set
    .flag('B', '--beta', '-b') // Var will be 'false' when set

// Set
cmd.parse('!cmd -a -b') // >> [true, false]
cmd.parse('!cmd --alpha --beta') // >> [true, false]

// Unset
cmd.parse('!cmd') // >> [false, true]
```

### Custom

Default args not enough for you? Use the `regex` arg for something more custom.

```js
const simpleEmail = /\w+@\w+\.\w+/
const cmd = prefix('!cmd').regex('Email', simpleEmail)

cmd.parse('!cmd user@example.com') // >> ['user@example.com']
cmd.parse('!cmd user.example@com') // >> Error (Email not found)
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
    parse("!cmd 20 1.8 Jim Bob") // >> [20, 1.8, 'Jim Bob']
```

### Args Array

Sick of the fluent interface or want dynamic args? Provide them via an array instead:

```js
prefix('!cmd')
    .args(
        new IntegerArg("Age"),
        new FloatArg("Height"),
        new RestArg("Name"),
    )
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
