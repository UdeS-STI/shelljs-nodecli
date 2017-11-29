# ShellJS Node CLI Extension (UdeS version)

An extension for ShellJS that makes it easy to find and execute Node.js
CLIs.

The difference between the original package and this version is that
the module will also searches inside the `node_modules` of your CLI.

So, this module will searches as the following way:
- `node_modules` of the project where your CLI is installed or where
  you actually execute a command of your CLI;
- global `node_modules`;
- `node_modules` of your CLI if it's installed globally.

## The Problem

[ShellJS](http://shelljs.org) is a fantastic tool for interacting with
the shell environment in a cross-platform way. It allows you to easily
write scripts that would otherwise be written in bash without worrying
about compatibility.

The only problem is that it's a real pain to execute Node binaries that
are installed locally. Most end up manually looking into the `node_modules`
directory to find the binary file to execute directly with Node, especially
when working on Windows, where the files in `node_modules/.bin` tend not to
work from scripting environments like make and ShellJS. Consequently, you end
up seeing a lot of this:

```javascript
import shell from 'shelljs'

const ESLINT = 'node_modules/eslint/bin/eslint.js'

shell.exec(`node ${ESLINT} myfile.js`)
```

## The Solution

Since Node binaries are specified in their `package.json` files, it's
actually pretty easy to look up the location of the runtime file and
get the path. That's where the ShellJS Node CLI extension comes in:

```javascript
import ShellJSNodeCLI from '@udes/shelljs-nodecli'

ShellJSNodeCLI.exec('eslint myfile.js')
```

The nodeCLI utility has its own `exec()` that is specifically for use 
when executing Node CLIs. It searches through the working directory's 
`node_modules` directory to find a locally installed utility. If it's 
not found there, then it searches globally. Finally, it will searches
inside the `node_modules` of your CLI. If it's still not found, then 
an error is thrown.

You can pass in as many string arguments as you'd like, and they will
automatically be concatenated together with a space in between, such as:

```javascript
import ShellJSNodeCLI from 'shelljs-nodecli'

ShellJSNodeCLI.exec("eslint -f compact myfile.js");
```

This ends up creating the following string:

```bash
eslint -f compact myfile.js
```

This frees you from needing to do tedious string concatenation to
execute the command.

The `exec()` method otherwise behaves exactly the same as the default
ShellJS `exec()` method, meaning you can use the same options and 
callback arguments, such as:

```javascript
import ShellJSNodeCLI from 'shelljs-nodecli'

const version = ShellJSNodeCLI.exec('eslint -v', {silent:true}).output;

const child = ShellJSNodeCLI.exec('some_long_running_process', {async:true})
child.stdout.on('data', (data) => {
    /* ... do something with data ... */
})

ShellJSNodeCLI.exec('some_long_running_process', (code, output) => {
    console.log('Exit code:', code)
    console.log('Program output:', output)
})
```

## Copyright

- Copyright 2014 Nicholas C. Zakas. All rights reserved.
- Copyright 2017 Université de Sherbrooke. All rights reserved.

## License

MIT License
