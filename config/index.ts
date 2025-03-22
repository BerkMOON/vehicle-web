import path from "path"
import HtmlWebpackPlugin from 'html-webpack-plugin'

const config = {
  projectName: 'vehicle-web',
  date: '2025-1-7',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-html'],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false }
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['nut-']
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    // esnextModules: ['nutui-react'],
    alias: {
      '@/components': path.resolve(__dirname, '..', 'src/components'),
      '@/utils': path.resolve(__dirname, '..', 'src/utils'),
      '@/api': path.resolve(__dirname, '..', 'src/api'),
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['nut-']
        }
      },
      autoprefixer: {
        enable: true,
        config: {
          config: {
            // 添加自动处理浏览器前缀的配置
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    devServer: {
      proxy: {
        "/api": {
          target: "http://47.121.134.143:8888",
          changeOrigin: true,
        }
      }
    },
    router: {
      mode: 'browser'
    },
    entry: {
      bind: './src/pages/bind/index.tsx',
    },
    webpackChain(chain) {
      chain.entryPoints.clear()

      const entries = {
        bind: [
          './src/pages/bind/index.tsx'
        ],
      }

      Object.keys(entries).forEach(entry => {
        chain.entry(entry).merge(entries[entry])
      })

      chain.plugins.delete('html')

      Object.keys(entries).forEach(entry => {
        chain.plugin(`html-${entry}`).use(HtmlWebpackPlugin, [{
          filename: `${entry}.html`,
          template: path.join(process.cwd(), 'src/index.html'),
          chunks: ['vendors', 'common', entry],
          inject: true,
          templateParameters: {
            TARO_PLATFORM: 'h5'
          }
        }])
      })

      // 修改分包配置
      chain.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      })
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}

export default config
