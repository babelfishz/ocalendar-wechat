// pages/index/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    species_count: 0,
    photo_count: 0,
    sysW: '',

    paginated: true,
    page: 1,
    pageSize: 30,
    hasMoreData: true,

    flora_by_month: [],

    searchFormHidden: false,
  },

  viewImage: function (e) {
    var index = e.currentTarget.dataset.idx;
    var current = e.currentTarget.dataset.subidx;

    wx.navigateTo({
      url: "../picture/picture?idx=" + index + '&subidx=' + current
      //url: "../album/slides?idx=" + index + '&subidx=' + current
    })
  },

  searchByName: function (e) {
    var name = e.detail.value.input;
    //console.log(name);

    var that = this;
    var flora_by_month = [];
    that.setData({
      flora_by_month, flora_by_month,
      paginated: false,
    });

    that.getFloraDataByName(name);
  },

  getFloraDataByName: function (name) {
    var that = this;
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.photoPath + '/all/name/' + name;
    var userId = getApp().globalData.currentUserInfo.userId;

    wx.request({
      url: url,
      data: {
        'userId': userId,
      },
      success: function (res) {
        //console.log(res);
        that.makeTimeLine(res);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  makeTimeLine: function (res) {

    const flora = res.data.floras.data;
    const species_count = res.data.species;
    const photo_count = res.data.floras.total;
    var lastPage = res.data.floras.last_page;

    //console.log('response',res.data);

    var that = this;
    var current_page = this.data.page;

    that.setData({
      species_count: species_count,
      photo_count: photo_count
    });

    if (current_page != lastPage) {
      current_page = current_page + 1;
      that.setData({
        page: current_page,
        hasMoreData: true
      });
    }
    else {
      that.setData({ hasMoreData: false });
    }

    var i = 0;
    var flora_by_month = that.data.flora_by_month;

    if (flora_by_month.length != 0) {
      var j = flora_by_month.length - 1;
      var last_month = flora_by_month[j].month;
      var last_year = flora_by_month[j].year;
    }
    else {
      var j = 0;
      var last_month = 0;
      var last_year = 0;
    }

    while (flora[i]) {
      var date0 = flora[i].dateTimeDigitized;
      if (date0) {
        var date1 = date0.toString().replace(/-/g, "/");
      } else {
        var date1 = date0;
      }
      var date = new Date(date1);

      var month = date.getMonth();
      var year = date.getFullYear();

      if (!flora_by_month[j]) {
        flora_by_month[j] = { year: year, month: month, flora: Array() };
      } else if (month != last_month || year != last_year) {
        j++;
        flora_by_month[j] = { year: year, month: month, flora: Array() };
      }

      last_month = month;
      last_year = year;
      flora_by_month[j].flora = flora_by_month[j].flora.concat(flora[i]);
      i++;
    };

    that.setData({ flora_by_month: flora_by_month });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var sysInfo = wx.getSystemInfoSync();
    that.setData({ sysW: sysInfo.windowWidth });

    var app = getApp();
    app.globalData.readWrite = false; 

    //that.getFloraData();
    //console.log(that.data.flora_by_month);
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