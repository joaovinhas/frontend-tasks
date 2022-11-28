const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  /*
  devServer: {
    proxy: 'http://localhost:80'
  },

  publicPath: process.env.NODE_ENV === 'production'
    ? '/tasks/'
    : '/'
    ,
*/
  transpileDependencies: true
})
