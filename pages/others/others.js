var HTTP = require('../../servers.js');
var config = require('../../config.js');
var app = getApp()
Page({
  data: {
    items: [],
    nodata: false,
    hidden: true,
    loadingText: '加载中...'
  },
  JumpToCreateFolder: function (e) {
    wx.navigateTo({
      url: '../createfolder/createfolder'
    })
  },
  onPullDownRefresh: function (e) {
    // this.setData({
    //   hidden: false
    // })
  },
  enterFolder: function (e) {
    wx.setStorageSync('folderaId', e.currentTarget.dataset.statu.id);
    wx.navigateTo({
      url: '../catalog/catalog?id=' + e.currentTarget.dataset.statu.id
    })
  },
  onShow: function () {
    var items = [];
    this.setData({
      hidden: false
    })
    HTTP.get(config.creatFolder + "?type=share").then((res) => {
      this.setData({
        hidden: true
      })

      res.forEach((d, i) => {
        var shared = false;
        if (d.shareCount > 0) {
          shared = true
        }
        items.push({ shared: shared, shareCount: d.shareCount, id: d._id, owner: d.owner, ownername: d.ownername, ownerimg: d.ownerimg, id: d._id, name: d.name, img: config.staticHost + d.cover, imagenum: d.photoCount, member: 2 })
      })
      var nodata = false;
      var length = items.length;
      if (length == 0) {
        nodata = true;
      }
      this.setData({
        items: items.reverse(),
        nodata: nodata
      })
    }, () => { })
    app.globalData.items = this.data.items;
  },
  onLoad: function () {


  },
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
    }
    return {
      title: app.globalData.userInfo.nickName + '邀请你加入抽屉云',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  inputSearch: function (res) {
    this.setData({
      loadingText: '正在搜索...',
      hidden: false,
    })
    var searchText = res.detail.value;
    var items = [];
    HTTP.get(config.creatFolder + "?type=share?name=" + searchText).then((res) => {
      this.setData({
        hidden: true
      })

      res.forEach((d, i) => {
        var shared = false;
        if (d.shareCount > 0) {
          shared = true
        }
        items.push({ shared: shared, shareCount: d.shareCount, id: d._id, ownername: d.ownername, ownerimg: d.ownerimg, name: d.name, img: config.staticHost + d.cover, imagenum: d.photoCount, member: 2 })
      })
      var nodata = false;
      var length = items.length;
      if (length == 0) {
        nodata = true;
      }
      this.setData({
        items: items.reverse(),
        nodata: nodata
      })
    }, (err) => {

    })
  }

})