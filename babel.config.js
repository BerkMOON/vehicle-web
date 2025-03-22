// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md

module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }]
  ],
//   alias: {
//     '@/components': path.resolve(__dirname, '..', 'src/components'),
//     '@/utils': path.resolve(__dirname, '..', 'src/utils'),
//   },
  plugins: [
    [
      "import",
      {
        "libraryName": "@nutui/nutui-react-taro",
        "libraryDirectory": "dist/esm",
        "style": 'css',
        "camel2DashComponentName": false
      },
      'nutui-react-taro'
    ]
  ]
}
