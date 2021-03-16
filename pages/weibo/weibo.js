// pages/weibo/weibo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  searchByName:function(name){
    let that = this
    let app =getApp();
    let url = app.globalData.backendUrl + app.globalData.weiboPath +  "/" + name;

    wx.request({
      url: url,
      success: function (res) {
        if (res.statusCode == 200) {
          //console.log(res.data)

          let r1 =/(<)[^<]+>/g
          let r2 = /@[^ ]+/g 
                    
          let mblogList = []
          let card_group = res.data[0].data.cards[0].card_group

          console.log(card_group)

          for(var x in card_group){
            let mblog = card_group[x].mblog
            let item = {}
            item.avatar = mblog.user.avatar_hd
            item.user_name = mblog.user.screen_name
            item.created_at = mblog.created_at
            item.text = (mblog.text.replace(r1," ")).replace(r2, " ")
            item.picList = mblog.pics?mblog.pics:""
            if(item){
              mblogList.push(item)
            }
          }

          that.setData({
            mblogList:mblogList
          })

          /*console.log(mblogList)

          let mblog = card_group[0].mblog
          let text = (mblog.text.replace(r1," ")).replace(r2, " ")
                   
          that.setData({
            avatar:mblog.user.avatar_hd,
            user_name: mblog.user.screen_name,
            created_at:mblog.created_at,
            text:text,
            picList:mblog.pics,
          })*/
        }
      },
      fail:function(res){
        console.log(res.data)
      }
    })
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let name = options.name;
      let that = this;
      this.searchByName(name);
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