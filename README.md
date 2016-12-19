# TypeScript + Electron + React + Redux + Neon + Rust

This is a "spike", or throwaway project to prove that a particular set of
technologies can all actually play together.  This is all throwaway code.

![Rust](screenshots/electron-rust-main-and-browser-processes.png)

Above: A Rust plugin running in Electron, in both the main process and the
renderer process.

## There are binaries!

Binaries for Linux are available on the [Releases][] page.  Binaries for
MacOS and Windows are presumably just a matter of messing around with the
build system and TravisCI/AppVeyor.

[Releases]: https://github.com/emk/electron-test/releases

## To run it

Install the React Developer Tools plugin in Chrome if you haven't already.

```sh
. env.sh
npm install -g typings
yarn
typings install
npm run install
npm start
```

To recompile the JavaScript code after making changes, try:

```sh
npm run watch
```

Note that our type definitions for TypeScript are still a bit dodgy.  In
particular, there are multiple sets of React type definitions, none of
which are really great.  We use a version installed via `package.json`
that's technically for React 0.14, even though we're running 0.15.

In the browser console the first time:

```js
require('electron-react-devtools').install()
```

When you're ready to produce a distributable binary, try the following on
Linux:

```sh
npm run dist
dist/electest-*-x86_64.AppImage
```
