// pages/album/album.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    species_count: 0,
    photo_count: 0,
    sysW: '',

    apiPath:'/name/',
    paginated: true,
    page: 1,
    pageSize: 30,
    hasMoreData: true,
   
    flora_by_month: [],
    pendingRequest: false,

    pulldownIconHidden: false,
    searchFormHidden: true,
    searchFormCancelHidden: false,
    title:'相册',
  },

  bindLongPress: function(e) {
    
    //console.log(getApp().globalData.readWrite);
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
    })
  },

  showSearchForm:function(){
    var that = this;
    that.setData({ searchFormHidden: false });  
  },

  searchByName:function(e){
    var name = e.detail.value.input;
    if(!name) return;
    //console.log(name);
    
    var that = this;
    var flora_by_month = [];
    that.setData({
      flora_by_month:flora_by_month,
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
    var options = new Object();
    options.type = 'default';
    that.onLoad(options);
  },
  
  bindImgLoad:function(e){
    //console.log(e);
    var that = this;
    if(that.data.paginated != true) return;

    var i= that.data.flora_by_month.length-1;
    var j= that.data.flora_by_month[i].flora.length-1;
    //console.log(i, j);
    //console.log(e.currentTarget.dataset);
    if (e.currentTarget.dataset.idx == i & e.currentTarget.dataset.subidx == j)
    {
      //console.log("----this is last one", i, j);
      if (that.data.hasMoreData) {
        that.getFloraData();
      }
    }
  },

  /*分页，用current page来判断乱序的返回请求 */
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
        //console.log(res);
        if (res.statusCode == 200) {
          var responsePage = res.data.floras.current_page;
          var current_page = that.data.page;
            //console.log('response',responsePage);
            //console.log("current page", current_page);
          if (responsePage == current_page) {
            that.makeTimeLine(res);
            that.proceedingPages(res);
          } else {
            console.log("discard out of order response")
          }
        }     
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  /*不分页，用pending request避免多余的查询请求*/
  getFloraDataByName: function (name) {
    var that = this;
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.photoPath + that.data.apiPath + name;
    var userId = getApp().globalData.currentUserInfo.userId;

    if (that.data.pendingRequest != true) {
      that.setData({ pendingRequest: true });
      wx.request({
        url: url,
        data: {
          'userId': userId,
        },
        success: function (res) {
          //console.log(res);
          if (res.statusCode == 200) {
              that.makeTimeLine(res);
          }
          that.setData({ pendingRequest: false });
        },
        fail: function (err) {
          console.log(err);
          that.setData({ pendingRequest: false });
        }
      })
    }
  },

  /*分页时前进一页*/
  proceedingPages:function(res){
    var that = this;
    var current_page = that.data.page;
    var lastPage = res.data.floras.last_page;

    if (current_page != lastPage) {
      current_page = current_page + 1;
      that.setData({
        page: current_page,
        hasMoreData: true,
      });
    }
    else {
      that.setData({ hasMoreData: false });
    }  
  },

  /*把照片按月放入时间线*/
  makeTimeLine: function(res){
    const flora = res.data.floras.data;
    const species_count = res.data.species;
    const photo_count = res.data.floras.total;
  
    var that = this;

    that.setData({
      species_count: species_count,
      photo_count: photo_count
    });

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
    getApp().globalData.readWrite = options.readWrite=='true'?true:false;
    //console.log(getApp().globalData);

    var sysInfo = wx.getSystemInfoSync();
    that.setData({ sysW: sysInfo.windowWidth });

    if(options.type == 'default'){
      that.setData({
        pulldownIconHidden: false,
        searchFormHidden: true,
        serarchFormCancelHidden: false,
        title:'相册',
        apiPath:'/name/',
      });
      that.getFloraData();
    }else if(options.type == 'searchAll')
    {
        that.setData({
        pulldownIconHidden: true,
        searchFormHidden: false,
        searchFormCancelHidden: true,
        title : '查找',
        apiPath:'/all/name/',
      });
    }else{
      console.log('wrong type');
    }

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
    getApp().globalData.readWrite = false;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //console.log("pull down");
    var that = this;
    if(that.data.pulldownIconHidden != true){
      that.showSearchForm();
    }
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