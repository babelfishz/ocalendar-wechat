// pages/album/album.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    species_count: '',
    photo_count: '',
    sysW: '',
  
    paginated: true,
    page: 1,
    pageSize: 30,
    hasMoreData: true,
   
    flora_by_month: [],

    searchFormHidden: true,
  },

  bindLongPress: function(e) {
    
    if (!getApp().globalData.readWrite) return;

    var index = e.currentTarget.dataset.idx;
    var current = e.currentTarget.dataset.subidx;

    var that = this;
    var flora_by_month = that.data.flora_by_month;
    var id = flora_by_month[index].flora[current].id;

    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          //console.log('点击确定了');
          var app = getApp();
          var url = app.globalData.backendUrl + app.globalData.photoPath + "/"+ id;
          var userId = getApp().globalData.currentUserInfo.userId;
          wx.request({
            url: url,
            method: 'DELETE',
            data: {
              'userId': userId
            },
            success: function(res){
              //console.log('in delete photo:',res.data);
              flora_by_month[index].flora.splice(current, 1);
              var species = res.data.species;
              that.setData({
                flora_by_month: flora_by_month, species_count:species,
                photo_count: that.data.photo_count - 1});
              },
            fail:function(res){
              console.log(res)}
          })
        } else if (res.cancel) {
          //console.log('点击取消了');
          return false;
        }       
      }
    })
  },

  viewImage: function (e) {

    var index = e.currentTarget.dataset.idx;
    var current = e.currentTarget.dataset.subidx;

    wx.navigateTo({
      url: "../picture/picture?idx=" + index + '&subidx=' + current
      //url: "../album/slides?idx=" + index + '&subidx=' + current
    })
  },

  showSearchForm:function(){
    var that = this;
    that.setData({ searchFormHidden: false });  },

  searchByName:function(e){
    var name = e.detail.value.input;
    //console.log(name);
    
    var that = this;
    var flora_by_month = [];
    that.setData({
      flora_by_month,flora_by_month,
      paginated:false,
    });

    that.getFloraDataByName(name);
  },

  closeSearchForm:function(){
    var that = this;
    var flora_by_month = [];
    that.setData({ 
      searchFormHidden:true,
      flora_by_month:flora_by_month,
      page: 1,
      paginated: true,
    });
    that.getFloraData();
  },
  
  bindImgLoad:function(e){
    //console.log(e);
    var that = this;
    var i= that.data.flora_by_month.length-1;
    var j= that.data.flora_by_month[i].flora.length-1;
    if (e.currentTarget.dataset.idx == i & j == e.currentTarget.dataset.subidx)
    {
      //console.log("----this is last one", i, j);
      if (that.data.hasMoreData && that.data.paginated) {
        that.getFloraData();
      }
    }
  },

  getFloraData: function(){
    var that = this;
    var current_page = this.data.page;
    var app =getApp();
    var url = app.globalData.backendUrl + app.globalData.photoPath + '/?page=' + current_page;
    var userId = getApp().globalData.currentUserInfo.userId;
   
    wx.request({
      url: url,
      data: {
        'userId': userId
      },
      success: function (res) {
        that.makeTimeLine(res);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  getFloraDataByName: function (name) {
    var that = this;
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.photoPath + '/name/'+ name;
    var userId = getApp().globalData.currentUserInfo.userId;

    wx.request({
      url: url,
      data: {
        'userId': userId
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

  makeTimeLine: function(res){

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

    that.getFloraData();
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //console.log("pull down");
    var that = this;
    that.showSearchForm();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.hasMoreData && that.data.paginated) {
      //console.log("send flora request")
      that.getFloraData();
    } else {
      wx.showToast({
        title: '没有更多照片了',
        icon: 'none'
      })
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})