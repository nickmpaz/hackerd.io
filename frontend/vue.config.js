var variables = require('./src/variables.js')
const GoogleFontsPlugin = require('google-fonts-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    // config.plugin('html').tap(args => {
    //   args[0].title = variables.brand
    //   return args
    // }),
    plugins: [
      new GoogleFontsPlugin({
        fonts: [{ family: 'Source Code Pro' }]
      })
    ]
  },
  transpileDependencies: ['vuetify']
}
