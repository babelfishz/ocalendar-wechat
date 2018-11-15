// pages/album/album.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flora_by_month: [],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  },

bindLongPress: function(e) {
    
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var month = e.currentTarget.dataset.month;
    var index = e.currentTarget.dataset.index;

    var that = this;
    var flora = that.data.flora_by_month;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          var url ="http://47.74.251.157/photo" +"/"+id;
          wx.request({
            url: url,
            method: 'DELETE',
            success: function(res){
              flora[month].splice(index, 1);
              that.setData({flora_by_month:flora});
              },
            fail:function(res){
              console.log(res)}
          })
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }       
      }
    })
  },

  previewImage: function (e) {

    var month = e.currentTarget.dataset.month;
    var current = e.currentTarget.dataset.idx;

    var that = this;
    var flora = that.data.flora_by_month[month];

    //console.log(flora);

    var urls = flora.map(function (item) {
      return 'http://47.74.251.157/'+ item['filePath'] + item['fileName'];
    });
    
    //console.log(urls);

    wx.previewImage({
      current: urls[current],
      urls: urls,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: "http://47.74.251.157/photo",
      success: function (res) {
        var app = getApp();
        
        const flora = res.data;

        var i=0;
        var flora_by_month = new Array();
        while(flora[i]){
          var date = new Date(flora[i].dateTimeDigitized);
          var month = date.getMonth();
          if(!flora_by_month[month]){ flora_by_month[month] = new Array();};
          flora_by_month[month] = flora_by_month[month].concat(flora[i]);
          i++;
        };
        that.setData({flora_by_month:flora_by_month});
        that.setData({flora:flora});
        console.log(that.data.flora_by_month);
      },
      fail: function (err) {
        console.log(err)
      }
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