const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    //代理axios
    proxy: {
      '/api0': { //请求路径关键字
        target: 'https://vop.baidu.com', //对应自己的接口
        changeOrigin: true,//是否允许跨域,在本地会创建一个虚拟服务端，然后发送请求的数据，
        https: true,
        // 并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/api0': ''      //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替
          // 比如我要调用'http://localhost:8024/management/user/add'，直接写‘/api/user/add’即可
        }
      },
      '/api1': { //请求路径关键字
        target: 'http://192.168.137.21', //对应自己的接口
        changeOrigin: true,//是否允许跨域,在本地会创建一个虚拟服务端，然后发送请求的数据，
        // 并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/api1': ''      //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替
          // 比如我要调用'http://localhost:8024/management/user/add'，直接写‘/api/user/add’即可
        }
      },
      '/api2': { //请求路径关键字
        target: 'http://192.168.137.10', //对应自己的接口
        changeOrigin: true,//是否允许跨域,在本地会创建一个虚拟服务端，然后发送请求的数据，
        // 并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/api2': ''      //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替
          // 比如我要调用'http://localhost:8024/management/user/add'，直接写‘/api/user/add’即可
        }
      },
      '/api3': { //请求路径关键字
        target: 'http://192.168.137.10', //对应自己的接口
        changeOrigin: true,//是否允许跨域,在本地会创建一个虚拟服务端，然后发送请求的数据，
        // 并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/api3': ''      //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替
          // 比如我要调用'http://localhost:8024/management/user/add'，直接写‘/api/user/add’即可
        }
      },
      '/api4': { //请求路径关键字
        target: 'http://192.168.137.10', //对应自己的接口
        changeOrigin: true,//是否允许跨域,在本地会创建一个虚拟服务端，然后发送请求的数据，
        // 并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/api4': ''      //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替
          // 比如我要调用'http://localhost:8024/management/user/add'，直接写‘/api/user/add’即可
        }
      },
      '/api5': { //请求路径关键字
        target: 'http://192.168.137.10', //对应自己的接口
        changeOrigin: true,//是否允许跨域,在本地会创建一个虚拟服务端，然后发送请求的数据，
        // 并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/api5': ''      //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替
          // 比如我要调用'http://localhost:8024/management/user/add'，直接写‘/api/user/add’即可
        }
      },
    },
    host: '0.0.0.0',
    port: 443,
    client: {
      webSocketURL: 'wss://0.0.0.0:443/ws',
    },
    //vue自己启动的端口
    historyApiFallback: true,
    allowedHosts: "all",
    https: true
  }
})
