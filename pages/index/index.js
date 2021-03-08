//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '行到水穷处，...',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentAlbumName:''
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  bindUploadTap:function(){
    if(getApp().globalData.myUserInfo){
      wx.navigateTo({
      url: '../upload/upload'
      })
    }
  },

  bindAlbumTap: function () {
    if(getApp().globalData.myUserInfo){
    wx.navigateTo({
      url: '../album/album?readWrite=true' + '&type=default'
    })
    }
  },

  bindCalendarTap: function () {
    if (getApp().globalData.myUserInfo) {
    wx.navigateTo({
      url: '../calendar/calendar'
    })
    }
  },

  bindLoginTap: function () {
    if (getApp().globalData.myUserInfo) {
    wx.navigateTo({
      url: './people'
    })
    }
  },

  bindSearchTap:function(){
    if (getApp().globalData.myUserInfo) {
      wx.navigateTo({
        //url: './search'
        url: '../album/album?readWrite=false' + '&type=searchAll'
      })
    }
  },
  
  bindUserInfoTap:function()
  {
    var that = this;
    if (!getApp().globalData.myUserInfo) {
      //console.log("retry");
      that.getMyUserId();
      //that.updateUserInfo();
    }
  },

  getMyUserId: function () {
    var that = this;
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
            //console.log(res);
            if (res.statusCode == 200) {
              
              var userInfo = { userId: '', nickName: '', avatarUrl: '', city: '', province: '' };
              userInfo.userId = res.data;
              
              wx.getSetting({
                complete: (res) => {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: function(res) {
                        //console.log(res.userInfo)
                        userInfo.nickName = res.userInfo.nickName;
                        userInfo.avatarUrl = res.userInfo.avatarUrl;
                        userInfo.city = res.userInfo.city;
                        userInfo.province = res.userInfo.province;

                        wx.getStorage({
                          key: 'share_my_info',
                          success (res) {
                            //console.log(res.data)
                            if(res.data == 'true'){
                              wx.request({
                                url: app.globalData.backendUrl + app.globalData.userInfoPath,
                                data: {
                                  userId: userInfo.userId,
                                  nickName: userInfo.nickName, 
                                  avatarUrl: userInfo.avatarUrl,
                                  province: userInfo.province,
                                  city: userInfo.city,
                                },
                                method: 'POST',
                                success: function (res) {
                                  //console.log(res);
                                }
                              });
                            }
                          }
                        })
                      }
                    })
                  }
                },
              })

              getApp().globalData.myUserInfo = userInfo;
              getApp().globalData.currentUserInfo = userInfo;
              getApp().globalData.readWrite = true;

              that.setData({ motto: '行到水穷处，坐看云起时。'});
              
            }
            //console.log(getApp().globalData);
          },
          fail: function (res) {
            console.log(res);
          }
        })
      }
    })
  },
 

  onLoad: function () {
    var that = this;
    that.getMyUserId();
    
    if(getApp().globalData.myUserInfo.userId == getApp().globalData.currentUserInfo.userId){
      that.setData({currentAlbumName:'我'});
      //console.log(that.data);
    }else{
      that.setData({currentAlbumName:getApp().globalData.currentUserInfo.nickName});
    }

    //console.log('---------',getApp().globalData);
  },

  /*onLoad: function () {
      
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //console.log(app.globalData.userInfo);
    var userId = wx.getStorageSync('userId');
    var that = this;
    that.setData({userId:userId});
  },*/
  
  /*getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }*/
})
