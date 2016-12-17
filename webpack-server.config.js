module.exports = {
  entry: './main.ts',
  output: {
    filename: 'main.js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension. 
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader` 
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  target: 'electron-main',
  // Don't step on `__dirname` or `__filename`, because we need to use
  // these to find our supporting files.
  node: {
    __dirname: false,
    __filename: false
  }
}
