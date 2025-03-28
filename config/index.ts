import path from "path"
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin' 

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
      chain.plugins.delete('index-html')

      Object.keys(entries).forEach(entry => {
        chain.plugin(`html-${entry}`).use(HtmlWebpackPlugin, [{
          filename: `${entry}.html`,
          template: path.join(process.cwd(), 'src/index.html'),
          chunks: ['taro-vendors', 'nut-vendors', 'react-vendors', 'vendors', 'common', entry],
          inject: true,
          templateParameters: {
            TARO_PLATFORM: 'h5'
          }
        }])
      })

      // 先定义 DefinePlugin
      chain.plugin('define')
        .use(require('webpack').DefinePlugin, [{
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }])

      // 优化分包配置
      chain.optimization.splitChunks({
        chunks: 'all',
        maxInitialRequests: 5,
        minSize: 20000,
        maxSize: 100000,
        cacheGroups: {
          taroVendors: {
            name: 'taro-vendors',
            test: /[\\/]node_modules[\\/](@tarojs)/,
            priority: 20,
            chunks: 'all'
          },
          nutVendors: {
            name: 'nut-vendors',
            test: /[\\/]node_modules[\\/](@nutui)/,
            priority: 15,
            chunks: 'all'
          },
          reactVendors: {
            name: 'react-vendors',
            test: /[\\/]node_modules[\\/](react|react-dom)/,
            priority: 10,
            chunks: 'all'
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 5,
            chunks: 'all'
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 0,
            reuseExistingChunk: true
          }
        }
      })

      // 添加压缩配置
      chain.optimization.minimize(true)
      chain.optimization.usedExports(true)

      // 添加 terser 配置
      chain.optimization.minimizer('terser')
        .use(TerserPlugin, [{
          terserOptions: {
            compress: {
              drop_console: process.env.NODE_ENV === 'production',
              drop_debugger: true
            },
            format: {
              comments: false
            }
          },
          extractComments: false
        }])
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