var variables = require('./src/variables.js')
module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = variables.brand
      return args
    })
  },
  transpileDependencies: ['vuetify']
}
