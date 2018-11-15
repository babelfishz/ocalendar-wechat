// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImagePath : '../../image/view.png',
    inputValue: '',
    showUploadStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({uploadImagePath:decodeURIComponent(options.srcPath)})
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

  },

  formSubmit: function (e) {
    var that = this;
    var tempFilePaths = that.data.uploadImagePath;
    var name = e.detail.value.input;
    console.log(tempFilePaths);
    console.log(name);
    

       wx.uploadFile({
          url: 'http://47.74.251.157/photo', 
          filePath: tempFilePaths,
          name: 'file',
          formData: {
            'name': name
          },
          success: function (res) {
            //var data = res.data;
            //console.log(res);
            that.setData({ showUploadStatus: true });
          },
          fail: function (res) {
            console.log(res);
          }
        })
  },
})