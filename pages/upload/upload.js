// pages/upload/upload.js
const urlsafe_base64 = require("../../utils/urlsafe_base64.js");
//const flora_names=["广东石豆兰","建兰","橙黄玉凤花"]; 
//const flora_names=['三蕊兰', '三褶虾脊兰', '二列叶虾脊兰', '二尾兰', '二色卷瓣兰', '云南叉柱兰', '低地羊耳蒜', '全唇孟兰', '北插天天麻', '半柱毛兰', '南方带唇兰', '叉柱兰', '地宝兰', '坡参', '墨兰', '多叶斑叶兰', '多枝拟兰', '多花脆兰', '大序隔距兰', '寄树兰', '密花石豆兰', '寒兰', '小片菱兰', '小舌唇兰', '尖喙隔距兰', '广东石豆兰', '广东隔距兰', '建兰', '扇唇羊耳蒜', '报春贝母兰', '插天山羊耳蒜', '撕唇阔蕊兰', '斑唇卷瓣兰', '无叶美冠兰', '橙黄玉凤花', '歌绿斑叶兰', '永泰卷瓣兰', '流苏贝母兰', '深裂沼兰', '牛齿兰', '玫瑰宿苞兰', '瘤唇卷瓣兰', '白绵绒兰', '白花线柱兰', '短穗竹茎兰', '短裂阔蕊兰', '石仙桃', '竹叶兰', '竹茎兰', '紫纹兜兰', '紫花羊耳蒜', '线柱兰', '细叶石仙桃', '细裂玉凤花', '绶草', '绿花带唇兰', '绿花斑叶兰', '美冠兰', '腐生齿唇兰', '芳香石豆兰', '苞舌兰', '蛇舌兰', '蛤兰', '血叶兰', '见血青', '触须阔蕊兰', '金线兰', '钳唇兰', '镰翅羊耳蒜', '长茎羊耳蒜', '阔叶沼兰', '香港带唇兰', '香港绶草', '高斑叶兰', '鹅毛玉凤花', '鹤顶兰', '黄兰', '黄唇线柱兰', '齿瓣石豆兰', '龙头兰']


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //uploadImagePaths : [],
    imgArr: [],
    showChooseImageArea:true,
    chooseViewShow: true,
    loading: false,
    showInputName: false,
    inputValue: '',
    accuracy: 0,
    showProgress: false,    
    isUploadError: false,
    showUploadStatus: false,
    success: true,
    sysW:'',
  },

  chooseImage: function () {

    var that = this;
    wx.chooseImage({
      count: 9 - that.data.imgArr.length,
      sizeType: ['original'],
      sourceType: ['album', 'camera'], 

      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //console.log(res.tempFilePaths);
        if (res.tempFilePaths.count == 0) {
          return;
        }

        var imgArrNow = that.data.imgArr;
        imgArrNow = imgArrNow.concat(res.tempFilePaths);

        that.setData({
          imgArr: imgArrNow,
          showInputName: true,
          inputValue: '',
        })
        that.chooseViewShow();
      }
    })
  },


  /** 删除图片 */
  deleteImv: function (e) {

    var imgArr = this.data.imgArr;
    var itemIndex = e.currentTarget.dataset.id;
    imgArr.splice(itemIndex, 1);

    this.setData({
      imgArr: imgArr,
      showInputName:imgArr.length==0?false:true,
    })

    //判断是否隐藏选择图片
    this.chooseViewShow();
  },

  /** 是否隐藏图片选择 */
  chooseViewShow: function () {
    if (this.data.imgArr.length >= 9) {
      this.setData({
        chooseViewShow: false
      })
    } else {
      this.setData({
        chooseViewShow: true
      })
    }
  },

  /** 显示图片 */

  showImage: function (e) {
    var imgArr = this.data.imgArr;
    var itemIndex = e.currentTarget.dataset.id;

    wx.previewImage({
      current: imgArr[itemIndex], // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    })
  },

  formSubmit: function (e) {
    var that = this;
    var imgArr = that.data.imgArr;
    this.setData({ loading: !this.data.loading });

    var inputName = e.detail.value.input;
   
    var successCount = 0;
    var failCount = 0;
    var i = 0;
    var length = imgArr.length;
    if (length){
      that.setData({
        showProgress:true,
        progress:0,
      })
      that.uploadFiles(imgArr, inputName, successCount,failCount,i,length)
    }
    else{
      that.uploadAgain();    
    };
  },

  uploadFiles:function(filePaths, name, successCount, failCount, i, length) {
    
      var that = this;
      var app = getApp();
      var url = app.globalData.backendUrl + app.globalData.photoPath;
      var userId = app.globalData.currentUserInfo.userId;
     
      wx.uploadFile({
        url: url,
        filePath: filePaths[i],
        name: 'file',
        formData: {
          'name': name,
          'userId': userId
        },

        success: function(res){
          if(res.statusCode == 200){
            successCount++;
            let progress = Math.round(successCount/length*100)
            that.setData({
              progress:progress,
            })
          }else{
            that.setData({ isUploadError: true });
            failCount++;
            console.log(res);
          }
        },
        fail: function(res) {
          console.log(res);
          that.setData({isUploadError:true});
          failCount++;
        },

        complete: function() {
          i++;
          if (i == length) {
            that.setData({
              showProgress: false,
              showChooseImageArea:false, 
              showUploadStatus: true,
              success: that.data.isUploadError?false:true,
            });
          } else {  //递归调用uploadMultiFile函数
            if (that.data.isUploadError) {
              that.setData({
                showChooseImageArea: false, 
                showProgress: false, 
                showUploadStatus: true,
                success: false,
                loading: false,
              });
            } else {
              that.uploadFiles(filePaths,name, successCount, failCount, i, length);
            }
          }
        }
      });
  },

  uploadAgain: function(){
    var that = this;
    that.setData({
      imgArr: [],
      showChooseImageArea:true,
      chooseViewShow: true,
      loading: false,
      showInputName: false,
      inputValue: '',
      accuracy: 0,
      isUploadError: false,
      showUploadStatus: false,
      success: true,
      sysW:'',  
    });
    that.onLoad();
  },

  /*classifyFlowers:function(){
    let that = this;
     
    let FSM = wx.getFileSystemManager();
    //console.log(this.data.imgArr);
    let imageBytes = FSM.readFileSync(this.data.imgArr[0], "base64"); 
    let urlsafe_imageBytes = urlsafe_base64.encode(imageBytes);

    //console.log(urlsafe_imageBytes);

    let data = JSON.stringify({'instances':[{'b64_image_bytes': urlsafe_imageBytes}]});
    //let url = "http://47.88.158.181:8501/v1/models/flower:predict";
    let url = "https://www.ocalendar.com.cn/api/photo/predict"
    //console.log(data);

    wx.showLoading({
      title: '识别中',
    })
    
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      success: function (res) {
        //console.log(res.data);
        wx.hideLoading();
        let predictions = res.data.predictions[0];
        let maxIndex = that.indexOfMax(predictions);

        //console.log(maxIndex);
        let result = flora_names[maxIndex];
        let acc = predictions[maxIndex]*100;
        let accuracy = acc.toFixed();
        

        //console.log(result);
        that.setData({
          inputValue:result,
          accuracy: accuracy,
        });
      },
      fail: function (res){
        wx.hideLoading();
        //console.log(res);
      }});
  },
  
  indexOfMax:function(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
  },*/

  
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  },
  
})