module.exports = {
  module: {
    rules: [
      {
        test: /\.glsl$/,
        use: 'file-loader'
      }
    ]
  }
}