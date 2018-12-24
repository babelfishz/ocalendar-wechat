// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //uploadImagePaths : [],
    imgArr: [],
    showChooseImageArea:true,
    chooseViewShow: true,
    loading: false,
    showInputName: false,
    inputValue: '',
    isUploadError: false,
    showUploadStatus: false,
    success: true,
    sysW:'',
  },

  chooseImage: function () {

    var that = this;
    wx.chooseImage({
      count: 9 - that.data.imgArr.length,
      sizeType: ['original'],
      sourceType: ['album', 'camera'], 

      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //console.log(res.tempFilePaths);
        if (res.tempFilePaths.count == 0) {
          return;
        }

        var imgArrNow = that.data.imgArr;
        imgArrNow = imgArrNow.concat(res.tempFilePaths);
        //console.log(imgArrNow);

        var showInputName = true;
        //var showInputName = false;
        //if(imgArrNow.length == 1) {showInputName = true};

        that.setData({
          imgArr: imgArrNow,
          showInputName: showInputName,
        })
        that.chooseViewShow();
      }
    })
  },


  /** 删除图片 */
  deleteImv: function (e) {

    var imgArr = this.data.imgArr;
    var itemIndex = e.currentTarget.dataset.id;
    imgArr.splice(itemIndex, 1);

    //console.log(imgArr);

    var showInputName = false;
    if (imgArr.length == 1) { showInputName = true };

    this.setData({
      imgArr: imgArr,
      showInputName:showInputName
    })

    //判断是否隐藏选择图片
    this.chooseViewShow();
  },

  /** 是否隐藏图片选择 */
  chooseViewShow: function () {
    if (this.data.imgArr.length >= 9) {
      this.setData({
        chooseViewShow: false
      })
    } else {
      this.setData({
        chooseViewShow: true
      })
    }
  },

  /** 显示图片 */

  showImage: function (e) {
    var imgArr = this.data.imgArr;
    var itemIndex = e.currentTarget.dataset.id;

    wx.previewImage({
      current: imgArr[itemIndex], // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    })
  },

  formSubmit: function (e) {
    var that = this;
    var imgArr = that.data.imgArr;
    this.setData({ loading: !this.data.loading });

    var inputName = e.detail.value.input;
   
    if(imgArr.length == 1){
      that.uploadSingleFile(imgArr[0], inputName);
    }else{
      var successCount = 0;
      var failCount = 0;
      var i = 0;
      var length = imgArr.length;
      that.uploadMultiFile(imgArr, inputName, successCount,failCount,i,length);
    }
  },

  uploadSingleFile:function(filePath, name){
    var that = this;
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.photoPath;
    var userId = app.globalData.currentUserInfo.userId;
    //var userId = wx.getStorageSync('userId');
    
    //console.log('upload userId:', userId);
    
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      formData: {
        'name': name,
        'userId': userId
      },
      success: function (res) {
        var data = res.data;
        console.log(res);
        if (res.statusCode == 200) {
          that.setData({
            showChooseImageArea:false, 
            showUploadStatus: true, 
            success: true});
        }else{
          that.setData({ 
            showUploadStatus: true,
            success: false,
            loading: false,
           });
        }
      },
      fail: function (res) {
        that.setData({
          showChooseImageArea: false, 
          showUploadStatus: true,
          success: false,
          loading: false,
        });
        console.log(res);
      }
    })
  },

  uploadMultiFile:function(filePaths, name, successCount, failCount, i, length) {
    
      var that = this;
      var app = getApp();
      var url = app.globalData.backendUrl + app.globalData.photoPath;
      var userId = app.globalData.currentUserInfo.userId;
     
      wx.uploadFile({
        url: url,
        filePath: filePaths[i],
        name: 'file',
        formData: {
          'name': name,
          'userId': userId
        },

        success: function(res){
          if(res.statusCode == 200){
            successCount++;
          }else{
            that.setData({ isUploadError: true });
            failCount++;
            console.log(res);
          }
        },
        fail: function(res) {
          that.setData({isUploadError:true});
          failCount++;
        },

        complete: function() {
          i++;
          if (i == length) {
            that.setData({
              showChooseImageArea:false, 
              showUploadStatus: true,
              success: true,
            });
          } else {  //递归调用uploadMultiFile函数
            if (that.data.isUploadError) {
              that.setData({
                showChooseImageArea: false,  
                showUploadStatus: true,
                success: false,
                loading: false,
              });
            } else {
              that.uploadMultiFile(filePaths,name, successCount, failCount, i, length);
            }
          }
        }
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*var that = this;
    var sysInfo = wx.getSystemInfoSync();
    that.setData({ sysW: sysInfo.windowWidth });

    var uploadFiles = JSON.parse(options.srcPath);
    that.setData({uploadImagePaths:uploadFiles});
    if(uploadFiles.length == 1)
    { 
      that.setData({showInputName:true});
    }*/
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