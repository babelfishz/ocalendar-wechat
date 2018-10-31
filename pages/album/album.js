// pages/album/album.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrlList: [{dateTimeDigitized:'',id:'',name:'',url:''}],
  },

bindLongPress: function(e) {
    var that = this;
    var imageUrlList= that.data.imageUrlList;
    var index = e.currentTarget.dataset.index;
    var id = imageUrlList[index].id;

    //console.log(imageUrlList);

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
              //console.log(res);
              imageUrlList.splice(index, 1);
              that.setData({
                imageUrlList
              });
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: "http://47.74.251.157/photo",
      success: function (res) {
        var app = getApp();
        var i = 0;
        //console.log(res);
        if(res.statusCode == 200){
          while (res.data[i] && i<10){
            var url = "http://" + app.globalData.serverAddress + "/" + res.data[i].filePath + res.data[i].fileName;
            //console.log(res.data[i]);
            that.setData({[`imageUrlList[${i}].url`]:url});
            that.setData({[`imageUrlList[${i}].name`]:res.data[i].floraName});
            that.setData({ [`imageUrlList[${i}].dateTimeDigitized`]: res.data[i].dateTimeDigitized});
            that.setData({ [`imageUrlList[${i}].id`]: res.data[i].id });
            i++;
            }
          }
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