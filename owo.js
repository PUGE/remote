module.exports = {
  // 项目根目录
  root: "/src",
  // 页面标题
  title: 'lamp',
  // 解决方案
  scheme: [],
  // 基础目录
  basePath: './',
  // 输出目录
  outFolder: "./dist",
  // 设置外层是否有容器包裹，包裹容器的class
  container: '',
  // 手机入口
  // phoneEnter: "name",
  // 资源目录
  resourceFolder: "./src/resource",
  // head属性清单
  headList: [
    {
      'http-equiv': 'content-type',
      content: 'text/html; charset=UTF-8',
    },
    {
      name: 'viewport',
      content: 'initial-scale=1,user-scalable=no,maximum-scale=1',
    }
  ],
  // 使用到的外部脚本清单
  scriptList: [
    {
      name: "main",
      src: "./src/main.js"
    }
  ],
  // 使用到的样式列表
  styleList: [
    {
      name: "main",
      src: "./src/main.css"
    }
  ],
  // 页面清单
  pageList: [
    // {
    //   name: 'home',
    //   src: './src/page/home.owo'
    // },
    {
      name: 'two',
      src: './src/page/two.owo'
    },
  ],
  // 调试模式配置
  dev: {
    
    debug: true,
    // 是否监测文件改动重新打包
    watcher: {
      // 是否启用
      enable: true,
      // 忽略监控的文件或文件夹，支持正则，默认为输出目录
      ignored: './dist/*',
      // 监测深度,默认99
      depth: 99
    },
    route: {
      // 永远从第一页开始
      startAtHome: false
    },
    // 输出配置
    outPut: {
      // 是否将主要css, js合并到html中
      merge: true,
      // 是否压缩css
      minifyCss: false,
      // 是否压缩js
      minifyJs: false,
      // 输出文件自动追加版本号，可以用来消除缓存
      addVersion: true,
    },
    serverPort: 8000,
    // 静态文件服务
    server: true,
    // 自动重新加载
    autoReload: true,
    // 远程调试
    remoteDebug: true
  },
  // 编译模式配置
  build: {
    debug: false,
    // 外链警告
    alertLink: false,
    route: {
      // 永远从第一页开始
      startAtHome: true
    },
    // 输出配置
    outPut: {
      // 是否将主要css, js合并到html中
      merge: false,
      alertLink: true,
      // 是否压缩css
      minifyCss: true,
      // 是否压缩js
      minifyJs: true,
      // 输出文件自动追加版本号，可以用来消除缓存
      addVersion: true,
      // 小于多大的资源会嵌入到代码中,单位kb,默认10,设置为0则不启用
      embedSize: 10
    }
  }
}