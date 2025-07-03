const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        additionalData: `@import "@/styles/common.less";`
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/mortgage-repayment-calculator/'
    : '/'
})
