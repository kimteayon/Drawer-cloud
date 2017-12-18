var HTTP = require('../../servers.js');
var config = require('../../config.js');
const app = getApp()
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
Page({
  data: {
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],
    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],
    countIndex: 9,
    hidden: true
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sourceType: sourceType[that.data.sourceTypeIndex],
      sizeType: sizeType[that.data.sizeTypeIndex],
      count: that.data.countIndex,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths.concat(that.data.imageList);
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
    this.setData({
      hidden: false
    })
    HTTP.uploadFile(this.data.imageList, self.data.id).then((res) => {
      this.setData({
        hidden: true
      })
      wx.setStorageSync('folderId', this.data.id);
      wx.navigateBack();
    }, (err) => {
      wx.showToast({
        title: '上传照片失败',
        image: '../../image/image.png',
        duration: 2000
      })
    })
  },
  onLoad: function (options) {
    var self = this;
    this.setData({ id: options.id });
    wx.getStorage({
      key: 'imageinput',
      success: function (res) {
        self.setData({
          imageList: res.data.tempFilePaths
        })
      }
    })
   
  }
})
