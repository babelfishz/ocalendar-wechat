//app.js
App({

  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          //后台接口地址 
          url: 'http://www.ocalendar.com.cn/api/wechat/getcode',
          data: {
            code: res.code, // code 必须给 
            //encryptedData: res_user.encryptedData, //密文串 必须给 
            //iv: res_user.iv //加密初始量 必给 
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log('userId:', res.data);
            wx.setStorageSync('userId', res.data);
          }
        })
      }
    })  
  },

  /*onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },*/

  globalData: {
    userInfo: null,
    backendUrl: "http://www.ocalendar.com.cn/",
    photoPath: 'api/photo',
    orchidPath:'api/orchid',
  }
})