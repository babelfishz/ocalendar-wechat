// pages/target/peoples.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      users:[],
  },

  bindShowAlbumTap(e){
    //console.log(e);

    var index = e.currentTarget.dataset.index;

    var that = this;
    var userId = that.data.users[index].userId; 

    //var myId = wx.getStorageSync('userId');
    //if(userId == myId) {console.log('yes!');} else {console.log('no!')};

    wx.navigateTo({
      url: "../album/album?userId="+userId
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.userInfoPath;

    var that =this;

    wx.request({
      url: url,
      success: function(res){
        var users = res.data;
        that.setData({users:users});
        console.log(res.data);
      },
    })
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