//app.js
App({

  onLaunch: function () {
    // 登录
     var that = this;
     that.getMyUserId();
  },

  getMyUserId: function(){
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var app = getApp();
        var url = app.globalData.backendUrl + 'api/getcode';
        wx.request({
          //后台接口地址 
          url: url,
          data: {
            code: res.code, // code 必须给 
            //encryptedData: res_user.encryptedData, //密文串 必须给 
            //iv: res_user.iv //加密初始量 必给 
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log('userId:', res.data);
            //wx.setStorageSync('userId', res.data);
            if(res.statusCode == 200){
              var userInfo = { userId: '', nickName: '', avatarUrl: '', city: '', province: '' };
              userInfo.userId = res.data;
              getApp().globalData.myUserInfo = userInfo;
              getApp().globalData.currentUserInfo = userInfo;
            }
            //getApp().getAllUserInfo();
            //console.log(getApp().globalData);
          },
          fail: function (res) {
            console.log(res);
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
    backendUrl: "https://www.ocalendar.com.cn/",
    photoPath: 'api/photo',
    orchidPath:'api/orchid',
    userInfoPath:'api/users',

    allUserInfo: [],
    myUserInfo:'',
    currentUserInfo:'',
    readWrite:true,
  }
})