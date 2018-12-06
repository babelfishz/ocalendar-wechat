// pages/picture/picture.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      flora:{id:'',url:'', name:'',created_time:''},
      family:'',
      genus:'',
      genusLatin: '', 
      speciesLatin: '',
      index_of_prevPage:'',
      subidx_of_prevPage:'',
      showModifyForm: false,
      cachedName:'',
      Loading:false,
      showStatus:false,
  },

  showModifyForm:function(e)
  {
      if (!getApp().globalData.readWrite) return;

      var that = this;
      that.setData({showStatus:false});
      that.setData({showModifyForm:true});
      wx.getStorage({
        key: 'cachedFloraName',
      success: function (res) {
        that.setData({cachedName:res.data});
      },
    })
  },

  cacelModifyForm:function(e)
  {
      var that = this;
      that.setData({ showModifyForm: false });
  },

  formSubmit: function (e) {
    var that = this;
    var name = e.detail.value.input;
    var id = that.data.flora.id;

    wx.setStorageSync('cachedFloraName', name);
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.photoPath + "/" + id;

    wx.request({
      url: url,
      method: 'PUT',
      data: {
        'name': name
      },
      success: function (res) {
        var flora = that.data.flora;
        flora.name = name;
        that.setData({flora : flora});
        that.setData({showModifyForm:false});

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面

        var flora_by_month = prevPage.data.flora_by_month;
        flora_by_month[that.data.index_of_prevPage].flora[that.data.subidx_of_prevPage].floraName = name;
        prevPage.setData({flora_by_month,flora_by_month});

        if(flora.name) {that.getOrchidData(flora)};
      },

      fail: function (res){
        that.setData({ showModifyForm: false, showStatus: true });
      }});
  },

  getOrchidData(flora)
  {
    var that=this;
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.orchidPath + "/" + flora.name;

    wx.request({
      url: url,
      success: function (res) {
        var data = res.data[0];
        if (data) {
          that.setData({ 
            genus: data.genus,
            family: data.family,
            genusLatin: data.genusLatin,
            speciesLatin: data.speciesLatin 
          });
        }
        else
        {
          that.setData({ 
            genus: '',
            family:'',
            genusLatin:'',
            speciesLatin:''
          });
        }
      }
    });
  },

  savePhoto:function(e)
  {
    var that=this;

    wx.showModal({
      title: '提示',
      content: '确定要保存这张照片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.getImageInfo({
            src: that.data.flora.url,
            success: function (res) {
              console.log(res);
              var path = res.path;
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success: function (res) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  })
                },
                fail: function (res) {
                  console.log('保存失败');
                }
              })
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var index = options.idx;
      var current = options.subidx;

      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      var flora_data = prevPage.data.flora_by_month[index].flora[current];

      var flora = {id:'',url:'', name:'',created_time:''};
      var app = getApp();

      flora.id = flora_data.id;
      flora.url = app.globalData.backendUrl + "/" + flora_data.filePath + flora_data.fileName;
      flora.name = flora_data.floraName;
      flora.created_time = flora_data.dateTimeDigitized;

      //console.log(flora.name);

      var that = this;
      that.setData({
        flora: flora,
        index_of_prevPage: index,
        subidx_of_prevPage: current
        });

      if(flora.name) {that.getOrchidData(flora)};
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