// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImagePaths : [],
    showInputName:false,
    inputValue: '',
    loading: false,
    isUploadError: false,
    showUploadStatus: false,
    success: true,
  },

  formSubmit: function (e) {
    var that = this;
    var tempFilePaths = that.data.uploadImagePaths;
    this.setData({ loading: !this.data.loading });
    if(tempFilePaths.length == 1){
      var inputName = e.detail.value.input;
      that.uploadSingleFile(tempFilePaths[0], inputName);
    }else{
      var successCount = 0;
      var failCount = 0;
      var i = 0;
      var length = tempFilePaths.length;
      that.uploadMultiFile(tempFilePaths, successCount,failCount,i,length);
    }
  },

  uploadSingleFile:function(filePath, name){
    var that = this;
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.photoPath;
    //console.log(url);
    
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      formData: {
        'name': name
      },
      success: function (res) {
        var data = res.data;
        console.log(res);
        that.setData({ showUploadStatus: true });
        that.setData({ success: true });
      },
      fail: function (res) {
        that.setData({ showUploadStatus: true });
        that.setData({ success: false });
        that.setData({ loading: false });
        console.log(res);
      }
    })
  },

  uploadMultiFile:function(filePaths, successCount, failCount, i, length) {
    
      var that = this;
      var app = getApp();
      var url = app.globalData.backendUrl + app.globalData.photoPath;
     
      wx.uploadFile({
        url: url,
        filePath: filePaths[i],
        name: 'file',
        formData: {
          'name': ''
        },

        success: function(res){
          successCount++;
        },

        fail: function(res) {
          that.setData({isUploadError:true});
          failCount++;
        },

        complete: function() {
          i++;
          if (i == length) {
            that.setData({ showUploadStatus: true });
            that.setData({ success: true });
          } else {  //递归调用uploadMultiFile函数
            if (that.data.isUploadError) {
              that.setData({ showUploadStatus: true });
              that.setData({ success: false });
              that.setData({ loading: false });
            } else {
              that.uploadMultiFile(filePaths, successCount, failCount, i, length);
            }
          }
        }
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var uploadFiles = JSON.parse(options.srcPath);
    that.setData({uploadImagePaths:uploadFiles});
    if(uploadFiles.length == 1)
    { 
      that.setData({showInputName:true});
    }
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
  
})