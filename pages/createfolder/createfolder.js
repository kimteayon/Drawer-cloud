const app = getApp()
var HTTP = require('../../servers.js');
var config = require('../../config.js');
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    textlength: 0,
    disabled: true,
    hidden: true,
    folderName: '',
    description: '',
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],
    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],
    countIndex: 9,
    hidden: true,
    imageList: [],
    folderName:'新建相册'
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sourceType: sourceType[that.data.sourceTypeIndex],
      sizeType: sizeType[that.data.sizeTypeIndex],
      count: that.data.countIndex,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imageList: tempFilePaths
        })
      }
    })
  },
  deleteUploadImg: function (e) {
    var uploadImgs = this.data.imageList;
    uploadImgs.splice(e.target.dataset.index, 1);
    this.setData({
      imageList: uploadImgs
    })
  },
  startpush: function () {
    var self = this;

    if (self.data.imageList.length == 0) {
      this.setData({
        hidden: true
      })
      wx.redirectTo({
        url: '../catalog/catalog?id=' + self.data.id
      })
      return;
    }
    HTTP.uploadFile(self.data.imageList, self.data.id).then((res) => {
      this.setData({
        hidden: true
      })
      // wx.setStorageSync('folderId', this.data.id);
      wx.redirectTo({
        url: '../catalog/catalog?id=' + self.data.id
      })
    }, (err) => {
      wx.showToast({
        title: '上传照片失败',
        image: '../../image/image.png',
        duration: 2000
      })
    })
  },
  bindDiscription: function (e) {
    if (e.detail.value) {
      this.setData({ description: e.detail.value })
    } else {
      this.setData({ description: '' })
    }
  },
  bindinput: function (e) {
    if (e.detail.value) {
      this.setData({ folderName: e.detail.value, disabled: false, textlength: e.detail.value.length })
    } else {
      this.setData({ disabled: true, textlength: 0 })
    }
  },
  creatFolder: function (e) {
    var self = this;
    this.setData({ hidden: false });
    const describe = self.data.description;
    let data = {}
    if (describe) {
      data = { name: self.data.folderName, description: describe }
    } else {
      data = { name: self.data.folderName }
    }
    HTTP.post(config.creatFolder, data).then(function (value) {
      // success

      self.setData({ id: value._id });
      self.startpush()
      wx.setStorageSync('folderaId', value._id);


    }, function (error) {
      self.setData({ hidden: true });
      wx.showToast({
        title: '创建文件夹失败',
        image: '../../image/foldererr.png',
        duration: 2000
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
    var folderName = getNowFormatDate();
    this.setData({ folderName: folderName, disabled: false, textlength: folderName.length });
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