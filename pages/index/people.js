// pages/index/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: [],

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: '',
    authorizationHidden: false,
    resultHidden:true,
  },

  bindLoginTap: function(e){
    
    //console.log(e.detail.errMsg);
    //console.log(e.detail.userInfo);
    //console.log(e.detail.rawData);

    var that = this;
    that.setData({userInfo:e.detail.userInfo});
    that.updateUserInfo();

    //getApp().getAllUserInfo();
    that.onLoad();
    //that.setData({users:getApp().globalData.allUserInfo});
  },

  bindDeleteUserInfoTap: function () {
    var that =this;
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.userInfoPath +'/' + app.globalData.myUserInfo.userId;
    console.log(url);

    wx.request({
      url: url,
      method: 'DELETE',
      success: function (res) {
        console.log(res);
        that.onLoad();      
        },
    });
  },

  bindChooseUserTap:function(e){
    var index = e.currentTarget.dataset.index;
    var that = this;
    var app = getApp();

    app.globalData.currentUserInfo = that.data.users[index]; 
    if(app.globalData.currentUserInfo.userId == app.globalData.myUserInfo.userId){                     app.globalData.readWrite = true; 
    } else { 
      app.globalData.readWrite = false;
    };

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.onLoad();

    wx.navigateBack();
  },

  bindSwitchBackTap:function(){
    var app =getApp();
    app.globalData.currentUserInfo = app.globalData.myUserInfo;
    app.globalData.readWrite = true; 

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.onLoad();

    wx.navigateBack();
  },

  updateUserInfo:function(){
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.userInfoPath;

    var userId = app.globalData.myUserInfo.userId;

    var that = this;

    //console.log(userId);
    //console.log(that.data.userInfo);

    wx.request({
      url: url,
      data: {
        userId: userId,
        nickName: that.data.userInfo.nickName, 
        avatarUrl: that.data.userInfo.avatarUrl,
        province: that.data.userInfo.province,
        city: that.data.userInfo.city,
      },
      method: 'POST',
      success: function (res) {
        //console.log(res);
        that.setData({
          authorizationHidden:true,
          resultHidden:false,
        });
      }
    });
  },

  getAllUserInfo: function () {
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.userInfoPath;
    var userId = app.globalData.myUserInfo.userId;

    //console.log(userId);

    var that = this;
    wx.request({
      url: url,
      data: {
        'userId': userId,
      },
      success: function (res) {
        var users = res.data;
        //console.log(users);
        that.setData({users:users});
        function findUsers(users) { return users.userId == getApp().globalData.myUserInfo.userId };
        var me = users.findIndex(findUsers);
        //console.log(me);
        if (me != -1) {
          users.splice(me, 1);
          that.setData({
            authorizationHidden: true,
            resultHidden: false,
            users:users,
          });
        }else{that.setData({
          authorizationHidden:false,
          resultHidden:true,
        })
        };
      },
    })
  },

  onLoad: function () {
    var that = this;
    that.getAllUserInfo();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})