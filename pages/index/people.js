// pages/index/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: [],
    photoCountChanged: [],

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: '',
    authorizationHidden: false,
    //resultHidden:true,
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
    //console.log(url);

    wx.request({
      url: url,
      method: 'DELETE',
      success: function (res) {
        //console.log(res);
        //that.onLoad();
        that.setData({
          authorizationHidden: false,
          //resultHidden: true,
        })         
      },
    });
  },

  bindChooseUserTap:function(e){
    var index = e.currentTarget.dataset.index;
    var that = this;
    var app = getApp();

    
    var userInfo = that.data.users[index];

    app.globalData.currentUserInfo = userInfo;
    app.globalData.readWrite = false;

    var photoCountChanged = that.data.photoCountChanged;
    photoCountChanged[index] = false;
    that.setData({photoCountChanged:photoCountChanged});

    //console.log(that.data);

    wx.setStorageSync(userInfo.nickName, userInfo.photoCount);
    //var photoCount = wx.getStorageSync('hello');
    //console.log(userInfo.userId);
    //console.log(photoCount);

    wx.navigateTo({
      url: '../album/album',
    });

    /*var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.onLoad();

    wx.navigateBack();*/
  },

  /*bindSwitchBackTap:function(){
    var app =getApp();
    app.globalData.currentUserInfo = app.globalData.myUserInfo;
    app.globalData.readWrite = true; 

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.onLoad();

    wx.navigateBack();
  },*/

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
          //resultHidden:false,
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
        //console.log(res.data);
        /*var users = res.data;
        function findUsers(users) { return users.userId == getApp().globalData.myUserInfo.userId };
        var me = users.findIndex(findUsers);
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
        };*/

        var peoples = res.data.peoples;
        that.setData({ users: peoples });

        if (res.data.hereAmI == true) {
          that.setData({
            authorizationHidden: true,
          });
        } else {
          that.setData({
            authorizationHidden: false,
          })
        }

        var i = 0;
        var photoCountChanged = that.data.photoCountChanged;
        while (peoples[i]) {
          var prevPhotoCount = wx.getStorageSync(peoples[i].nickName);
          //console.log(prevPhotoCount, peoples[i].photoCount);
          if (prevPhotoCount) {
            if (peoples[i].photoCount != prevPhotoCount) {
              photoCountChanged[i] = true;
              
            } else {
              photoCountChanged[i] = false;
            }
          } else {
            photoCountChanged[i] = true;
          }
          i++;
        }
        that.setData({ photoCountChanged: photoCountChanged });

        //console.log(that.data);
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
    var app = getApp();
    app.globalData.currentUserInfo = app.globalData.myUserInfo;
    app.globalData.readWrite = true; 
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