// pages/album/slides.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      index:'',
      current:'',

      floraList:[],
      speciesInfo:[],

  },

  photoSlide: function(e){
    var current = e.detail.current;
    
    var that = this;
    that.getSpeciesInfo(current, that.data.floraList[current].name)
  },

getSpeciesInfo(current, name)
  {
    var that=this;
    var speciesInfo = that.data.speciesInfo;

    //console.log(speciesInfo);

    if(speciesInfo[current]) return;

    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.orchidPath + "/" + name;

    wx.request({
      url: url,
      success: function (res) {
        var data = res.data[0];
        if (data) { 
          speciesInfo[current] = data;
          that.setData({speciesInfo:speciesInfo});
          console.log(that.data);
        };
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options);
    var that = this;
    var index = options.idx;
    var current = options.subidx;
    that.setData({ current: current });

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面

    var floraList = [];
    var i = 0; 

    while(prevPage.data.flora_by_month[index].flora[i]){
      var flora_data = prevPage.data.flora_by_month[index].flora[i];
      var flora = new Object();
      flora.id = flora_data.id;
      flora.url = getApp().globalData.backendUrl + "/" + flora_data.filePath + flora_data.fileName;
      flora.name = flora_data.floraName ? flora_data.floraName : '';
      flora.created_time = flora_data.dateTimeDigitized ? flora_data.dateTimeDigitized : '';
      
      floraList.push(flora);
      i++;
    }

    console.log(floraList);
    that.setData({floraList:floraList});

    var name = floraList[current].name;
    console.log("name=",name);
    that.getSpeciesInfo(current, floraList[current].name);
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