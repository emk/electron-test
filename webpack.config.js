// This file tells webpack how to build our application.  A lot of the
// tricky setup required to make this all work happens here.

const resolve = {
  // We add the `.ts` and `.tsx` extensions for TypeScript.
  extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
}

const loaders = [
  // Load `.ts` or `.tsx` files with `ts-loader`.
  { test: /\.tsx?$/, loader: 'ts-loader' }
]

module.exports = [{
  // Our `main` thread.  Creates and manages windows.
  entry: './src/main/main.ts',
  output: {
    filename: 'main.js'
  },
  resolve: resolve,
  module: {
    loaders: loaders
  },
  target: 'electron-main',
  externals: {
    // Tricky: Whenever we see `require("../../native")`, use the following
    // JavaScript to implement a stub module.  We can't use `node-loader` for
    // this because it bakes in hard-coded paths and breaks the ability to
    // move compiled Electron apps between systems.
    '../../native': "require('./native')"
  },
  // Don't step on `__dirname` or `__filename`, because we need to use
  // these to find our `app` directory.  Normally `webpack` tries to do
  // magic things to these, and we don't want that.
  node: {
    __dirname: false,
    __filename: false
  }
}, {
  // Our `renderer` thread.  Loaded as a JavaScript into a browser window
  // by `app/index.html`.
  entry: './src/renderer/index.tsx',
  output: {
    filename: 'app/index.js'
  },
  resolve: resolve,
  module: {
    loaders: loaders
  },
  target: 'electron-renderer',
  externals: {
    // We need a slightly different path to make this work.
    '../../native': "require('../native')"
  }
}]
