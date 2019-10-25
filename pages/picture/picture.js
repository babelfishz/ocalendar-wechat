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

      showLeftArrow: false,
      showRightArrow: false,

      lastTapTime: 0,
      baseWidth: null,
      baseHeight: null,
      scale:1,

      showTitle:true,
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
        //console.log('orchid',res);
        var data = res.data;
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

  // 触摸开始
  touchStart(e) {
    console.log('touch move', this.data.scale);
    this.setData({
      touchStartX: e.touches[0].pageX,
      touchStartY: e.touches[0].pageY,
    })
  },

  // 计算方向
  touchMove(e) {
    console.log('touch move',this.data.scale);
    let turn = "";
    if ( (e.touches[0].pageX - this.data.touchStartX > 50) && (Math.abs(e.touches[0].pageY - this.data.touchStartY) < 50)) {      //右滑
      turn = "left";
    } else if ((e.touches[0].pageX - this.data.touchStartX < -50) && (Math.abs(e.touches[0].pageY - this.data.touchStartY) <50)) {   //左滑
      turn = "right";
    }
    this.setData({
      touchDirection: this.data.scale==1?turn:"",
    })
  },

  // 滚动图片
  touchEnd(e) {

    var that = this;
    var index = Number(that.data.index_of_prevPage);
    var subidx = Number(that.data.subidx_of_prevPage);

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var flora_by_month = prevPage.data.flora_by_month;

    if (this.data.touchDirection == 'left') {
      if (subidx == 0) {
        if (index == 0) { }
        else { index--; subidx = flora_by_month[index].flora.length - 1; };
      } else {
        subidx--;
      }
    } else if(this.data.touchDirection == 'right'){
      if (subidx == flora_by_month[index].flora.length - 1) {
        if (index == flora_by_month.length - 1) { }
        else { index++; subidx = 0; };
      } else {
        subidx++;
      }
    }
    this.setData({
      touchDirection: null
    })

    var options = new Object();
    options.idx = index;
    options.subidx = subidx;

    that.onLoad(options);
  },

  /*slidePhoto: function (e) {

    var that = this;
    var index = Number(that.data.index_of_prevPage);
    var subidx = Number(that.data.subidx_of_prevPage);

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var flora_by_month = prevPage.data.flora_by_month;

    var direction = e.currentTarget.dataset.direction;
    //console.log(direction);

    if (direction === "left") {
      if (subidx == 0) {
        if (index == 0) { }
        else { index--; subidx = flora_by_month[index].flora.length - 1; };
      } else {
        subidx--;
      }
    } else if (direction === "right") {
      if (subidx == flora_by_month[index].flora.length - 1) {
        if (index == flora_by_month.length - 1) { }
        else { index++; subidx = 0; };
      } else {
        subidx++;
      }
    }else{console.log("err")}

    var options = new Object();
    options.idx = index;
    options.subidx = subidx;

    that.onLoad(options);
  },*/

  //loadPhoto: function (e) {
    /*wx.hideLoading();*/
  //},

  loadPhoto:function(e){
    //console.log(e);
    var that = this;

    var photoWidth = e.detail.width;
    var photoHeight = e.detail.height;
    var ratio = photoWidth/photoHeight;

    if(photoWidth > photoHeight){
      that.setData({
        baseWidth: 690,
        baseHeight: 690/ratio,
      })
    }else{
      that.setData({
        baseWidth: 960*ratio,
        baseHeight: 960,
      })
    }

    //var baseWidth = 698;
    /*var baseWidth = 660;
    var baseHeight = baseWidth/ratio;*/

    /*let query = wx.createSelectorQuery();
    query.select('#text-area').boundingClientRect();
    query.exec((res) => {
      let screenHeight = wx.getSystemInfoSync().windowHeight;
      let screenWidth =wx.getSystemInfoSync().windowWidth;

      let baseHeight = (screenHeight - res[0].height - 5) * (750 / screenWidth);
      let baseWidth = baseHeight * ratio;
      console.log(baseHeight,baseWidth);

      that.setData({
        baseWidth: baseWidth,
        baseHeight: baseHeight,
        showLeftArrow: true,
        showRightArrow: true,
      })
    });*/
},

  onScale:function(e){
    //console.log(e);
    this.data.scale = e.detail.scale;
  },

  doubleClick: function (e) {
    var curTime = e.timeStamp;
    var lastTime = e.currentTarget.dataset.time;
    
    /*双击恢复原来大小*/
    var that = this;
    if (curTime - lastTime > 0) {
      if (curTime - lastTime < 300) {
        that.setData({ scale: 1 });
        console.log("double clicked!");
        console.log(that.data.scale);
      }
    }
    this.setData({
      lastTapTime: curTime
    });
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var index = options.idx;
      var current = options.subidx;

      //console.log(options);
      //console.log(current);

      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      var flora_data = prevPage.data.flora_by_month[index].flora[current];
      var flora = {id:'',url:'', name:'',created_time:''};
      var app = getApp();

      flora.id = flora_data.id;
      flora.url = app.globalData.backendUrl + "/" + flora_data.filePath + flora_data.fileName;
      //flora.thumbUrl = app.globalData.backendUrl + "/" + flora_data.filePath + flora_data.thumbnailFileName;
      //console.log(flora.thumbUrl);
      flora.name = flora_data.floraName ? flora_data.floraName:'';
      flora.created_time = flora_data.dateTimeDigitized?flora_data.dateTimeDigitized:'';

      var that = this;
      that.setData({
        flora: flora,
        index_of_prevPage: index,
        subidx_of_prevPage: current,
        showTitle:true,
        loadFinish:false,
        baseHeight:0,
        baseWidth:0,
        });

      /*wx.showLoading({
        title: '正在载入',
      })*/

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