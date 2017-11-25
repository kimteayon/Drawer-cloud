var HTTP = require('../../servers.js');
var config = require('../../config.js');
var app = getApp()
Page({
  data: {
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    showModalStatus: false,
    hidden: true
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu, e)
  },
  newfolder: function (e) {
    wx.navigateTo({
      url: '../new/new'
    })
  },
  onPullDownRefresh: function (e) {
    this.setData({
      hidden: false
    })
  },
  enterFolder: function (e) {
    wx.navigateTo({
      url: '../catalog/catalog?id=' + e.currentTarget.dataset.statu.id + '&name=' + e.currentTarget.dataset.statu.name + '&img=' + e.currentTarget.dataset.statu.img + '&member=' + e.currentTarget.dataset.statu.member + '&imagenum=' + e.currentTarget.dataset.statu.imagenum
    })
  },
  onLoad: function () {
    var items = [];
    HTTP.get(config.creatFolder).then((res) => {
      res.forEach((d, i) => {
        items.push({ id: d._id, name: d.name, img: '3.jpg', imagenum: 10, member: 2 })
      })
      this.setData({
        items: items
      })
    }, () => { })
    this.data.items = [
      { id: 1, name: '圣诞狂欢', img: '3.jpg', imagenum: 10, member: 2 },
      { id: 2, name: '旅行', img: '2.jpg', imagenum: 23, member: 4 },
      { id: 3, name: '体育', img: '1.jpg', imagenum: 15, member: 6 },
      { id: 4, name: '校园', img: '4.jpg', imagenum: 210, member: 12 }
    ]
    app.globalData.items = this.data.items;

  },
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
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
  }
})