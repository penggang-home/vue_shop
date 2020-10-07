module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
        'commonjs': "@/commonjs",
      }
    }
  },
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production',cofnig => {
      // 根据当前是什么模式 来判断使用那个 入口文件
      config.entry('app').clear().add('./src/main-prod.js')

      //  打包时排除指定包 手动添加 CDN
      config.set('externals',{
        vue: 'Vue',
        'vue-router':'VueRouter',
        axios:'axios',
        lodash:'_',
        echarts:'echarts',
        nprogress:'NProgress',
        'vue-quill-editor':'VueQuillEditor'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development',cofnig => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })

  }
}