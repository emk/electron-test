# TypeScript + Electron + React

Install the React Developer Tools plugin in Chrome if you haven't already.

```sh
npm install -g typings
yarn
typings install
npm run build # Or `watch`, to recompile as needed.
npm start
```

Note that our type definitions for TypeScript are still a bit dodgy.  In
particular, there are multiple sets of React type definitions, none of
which are really great.  We use a version installed via `package.json`
that's technically for React 0.14, even though we're running 0.15.

In the browser console the first time:

```js
require('electron-react-devtools').install()
```
