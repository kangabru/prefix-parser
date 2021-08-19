<div align="center">

# ¡Discord Prefix Parser!

Easily parse and validate prefix commands in Discord

</div>

## Features

- 👀 **Parse messages into JS variables**
    - 👩‍💻 `parse('!rate @kangabru 10 Kang is pog')`
    - 🤖 `>> ['72657579', 10, 'Kang is pog']`

- 👮‍♂️ **Validate inputs**
    - 👩‍💻 `!rate @kangabru 100 Kang is pog`
    - 🤖 `Rating value '100' cannot be greater than '10'`

- 🧠 **Automatic command help**
    - 👩‍💻 `!rate --help`
    -
        ```
        --- `!rate` Rate your friends ---
        **Usage:** `!rate <User {@user}> <Rating {int} {0-10}> <Reason {text}>`
        **Example:** `!rate @user 6 lorem ipsum`
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
1. Define it: `prefix('!rate')`
2. Add arguments: `.user('User').int('Rating')...`
3. Parse the message: `parse('!rate @kangabru ...')`

Altogether it looks something like this:

```js
const prefix = require('prefix-parser')

const command = prefix("!rate")
    .user('User')
    .int('Rating', 0, 10)
    .text('Reason')

const [args, error] = command.parse('!rate @kangabru 10 Kang is pog')

console.log(error) // null
console.log(args) // ['72657579', 10, 'Kang is pog']
```

Args are automatically validated and users get descriptive messages about them. Errors are user friendly and render nicely in Discord.

```js
const [args, error] = command.parse('!rate @kangabru 10') // Omit 'reason' arg

console.log(error) // Missing argument `<Reason {text}>`. Type `!rate --help` for help.
console.log(args) // null
```

All commands include a help flag (`-h` / `--help`) to help users use them.

```js
const [args, error] = command.parse('!rate --help')

console.log(error) // !rate <User {@user}> <Rating {int} {0-10}> <Reason {text}>
console.log(args) // null
```

### Handling Errors and Null Args

Prefix commands handle lots of validation so expect null args and error messages.
Structure your code like this handle things properly:

```js
const [args, error] = command.parse(message)

// #1 Test the error first.
// This error is user friendly so send it back to help them try again.
if (error) return sendMessage(error)

// #2 Check for empty args.
// Args will be 'null' if there's an error and for messages that aren't your prefix command.
if (!args) return

// #3 Success! Use the parsed values.
// This array will match the length and order of the arguments you configured.
const [user, rating, reason] = args
```

<details><summary>See Example (Discord.js)</summary><br>

```js
TODO
```

</details>

<details><summary>See Example (Autocode)</summary><br>

```js
TODO
```

</details>

---

## 📖 Examples

Here are some real world examples to showcase the various features.

### Basic Example

In this example the entire state will be persisted and rehydrated after a restart:

```js
const prefix = require('prefix-parser')

const [args, error] = prefix("!rate")
    .user('User')
    .int('Rating', 0, 10)
    .text('Reason')
    .parse('!rate @kangabru 10 Kang is pog')

console.log(error) // null
console.log(args) // ['72657579', 10, 'Kang is pog']
```

---

## ❗ Prefix

The `prefix` function is the starting point for defining commands. Under the hood it stores your arguments and can use them to provide cool features like the `--help` function, error messages, and of course parsing values.

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
cmd.parse('!cmd <@12345> <@&67890> <@#24680>') // >> ['12345', '67890', '24680']
```

### Flags

The `flagTrue` and `flagFalse` flags match arguments like `--help` and `-h` and return booleans.

```js
const cmd = prefix('!cmd')
    .flagTrue('A', '--alpha', '-a') // Var will be 'true' when set
    .flagFalse('B', '--beta', '-b') // Var will be 'false' when set

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

## 💻 Development

Issues and PRs are welcome!

The quickest way to code is via a test. Follow the examples in the `test/` dir and run `npm run test` to run them. For even faster deving use the VSCode 'jest' extension to test automatically on code changes.

---

## 📄 About

Copyright 2021 Kangabru

❤ [MIT license baby](LICENSE)
