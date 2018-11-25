// pages/index/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  bindLoginTap: function(e){
    
    console.log(e.detail.errMsg);
    console.log(e.detail.userInfo);
    console.log(e.detail.rawData);

    wx.login({
      success: function (res) {
        console.log(res.code);
        if (res.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res_user) {
              wx.request({
                //后台接口地址 
                url: 'http://www.ocalendar.com.cn/api/wechat/getcode',
                data: {
                  code: res.code, // code 必须给 
                  encryptedData: res_user.encryptedData, //密文串 必须给 
                  iv: res_user.iv //加密初始量 必给 
                },
                method: 'GET',
                header: { 'content-type': 'application/json' },
                success: function (res) {
                  console.log('userId:', res.data);
                  wx.setStorageSync('userId', res.data);
                }
              })
            },
            fail: function (res_user) {
              console.log(res_user);
            }
          })
        }
      }
    }); 

  },
  
  onLoad: function () {
    
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