//index.js
//获取应用实例
const app = getApp()
var HTTP = require('../../servers.js');
var config = require('../../config.js');
Page({
  data: {
    textlength: 0,
    disabled: true,
    hidden: true,
    folderName: '',
    description: ''
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
      self.setData({ hidden: true });
      wx.redirectTo({
        url: '../catalog/catalog?id=' + value._id + '&name=' + value.name + '&img=' + '&member=' + 0 + '&imagenum=0'
      })
    }, function (error) {
      self.setData({ hidden: true });
      wx.showToast({
        title: '创建文件夹失败',
        image: '../../image/feedback.png',
        duration: 2000
      })
    });
  },
  onLoad: function () {

  }
})
