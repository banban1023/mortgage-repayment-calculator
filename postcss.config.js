module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16, // 1rem = 16px
      propList: ['*'], // 所有属性都转换
      selectorBlackList: [], // 不转换的选择器
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }
  }
}