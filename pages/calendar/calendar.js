// pages/Calendar/calendar.js
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    sysW: null,
    lastDay: null,
    firstDay: null,
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    year: null,
    currentDate:'',

    myFloras: [],
    imgList: [],

    hiddenFlag: true,
    floraUrl: '',
    floraName: '',
    floraCapturedTime:'',
    floraPhotoby: 'myself',
  },

  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    var that = this;

    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10 ) {
      //flag_hd = false;
      //执行切换页面的方法
      var currentDate = that.data.currentDate;
      currentDate.setMonth(currentDate.getMonth() + 1);
      that.setData({currentDate:currentDate});

      that.dataTime();
      that.refreshCalendar();
      that.getFloraOfMonth(that.data.currentDate.getMonth() + 1);
    }
    // 向右滑动   
    if (touchMove - touchDot >= 40 && time < 10) {
      //flag_hd = false;
      //执行切换页面的方法
      var currentDate = that.data.currentDate;
      currentDate.setMonth(currentDate.getMonth() -1);
      that.setData({ currentDate: currentDate });

      that.dataTime();
      that.refreshCalendar();
      that.getFloraOfMonth(that.data.currentDate.getMonth() + 1);
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },

  getFloraOfMonth(month){
    var that = this;
    var app = getApp();
    var url = app.globalData.backendUrl + app.globalData.photoPath + "/" + month;
    var userId = app.globalData.currentUserInfo.userId;

    //console.log(url);
    //console.log(userId);

    wx.request({
      url: url,
      data: {
        'userId': userId
      },
      
      success: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
          var imgList = [];
          var i= 0;

          while(res.data.myFloras[i]){
            imgList[i] = new Object();
            imgList[i].url = app.globalData.backendUrl + res.data.myFloras[i].filePath + res.data.myFloras[i].thumbnailFileName;
            imgList[i].isMyPhoto = true;
            imgList[i].floraData = res.data.myFloras[i];
            i++;
          }

          var ii = 0;
          while (res.data.extraFloras[ii]) {
            if (res.data.extraFloras[ii].floraName!=null){
              imgList[i] = new Object();
              imgList[i].url = app.globalData.backendUrl + res.data.extraFloras[ii].filePath + res.data.extraFloras[ii].thumbnailFileName;
              imgList[i].isMyPhoto = false;
              imgList[i].floraData = res.data.extraFloras[ii];
              i++;
            }
            ii++;
          }
          that.setData({imgList:imgList});
        }
      },
      fail:function (err) {
        console.log(err)
      }
    });
  },


  //获取日历相关参数
  dataTime: function () {
    var date = this.data.currentDate;
    var year = date.getFullYear();
    var month = date.getMonth();
    var months = date.getMonth() + 1;

    //获取现今年份
    this.data.year = year;

    //获取现今月份
    this.data.month = months;

    //获取今日日期
    this.data.getDate = date.getDate();

    //最后一天是几号
    var d = new Date(year, months, 0);
    this.data.lastDay = d.getDate();

    //第一天星期几
    let firstDay = new Date(year, month, 1);
    this.data.firstDay = firstDay.getDay();
  },

  refreshCalendar:function(){
    //根据得到今月的最后一天日期遍历 得到所有日期
    
    var arr = [];
    for (var i = 1; i < this.data.lastDay + 1; i++) {
      //this.data.arr.push(i);
      arr.push(i);
    }
    this.setData({arr:arr});

    var res = wx.getSystemInfoSync();
    this.setData({
      sysW: res.windowHeight / 12,//根据屏幕宽度变化自动设置宽度
      marLet: this.data.firstDay,
      //arr: this.data.arr,
      //arr:arr,
      year: this.data.year,
      getDate: this.data.getDate,
      month: this.data.month
    });
  },

  showMap:function(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var that = this;
    var flora = that.data.imgList[index];

    var floraUrl = getApp().globalData.backendUrl + flora.floraData.filePath + flora.floraData.thumbnailFileName;
    var floraCapturedTime = flora.floraData.dateTimeDigitized;
    if (flora.floraData.nickName){
      var floraPhotoby = flora.floraData.nickName;
    }else{
      var floraPhotoby = "myself";
    }

    that.setData({
      floraUrl:floraUrl,
      floraName:flora.floraData.floraName,
      floraCapturedTime:floraCapturedTime,
      floraPhotoby:floraPhotoby,
    });

    that.showMask();
    /*wx.navigateTo({
      url: './map',
    })*/
  },

  showMask: function () {
    this.setData({ hiddenFlag: false })
  },

  closeMask: function () {
    this.setData({ hiddenFlag: true })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var date = new Date();
    that.setData({currentDate:date});
    that.dataTime();
    that.refreshCalendar();
    that.getFloraOfMonth(that.data.currentDate.getMonth()+1);
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
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
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