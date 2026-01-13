// app.js
App({
  onLaunch() {
    // 应用启动时不需要做任何登录检查
    // 登录将在发起 API 请求时自动处理
  },

  globalData: {
    userInfo: null
  }
})
