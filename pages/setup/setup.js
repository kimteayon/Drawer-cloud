//index.js
//获取应用实例
const app = getApp()
var HTTP = require('../../servers.js');
Page({
  data: {
    disabled: true,
    hidden: true,
    memberinfo: [{
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/X8qpdaicx7s3siapSicynvX0jyrOdyjodOKjWVj8aY6qxAejoCTraZU8n829de12FUl1up3tqqoaTH6MdDTYJdqsw/0",
      city: "Beibei",
      country: "China",
      nickName: "吃饼干的怪兽👑",
      province: "Chongqing"
    }]
  },

  creatFolder: function (e) {
    this.setData({ hidden: false });
    HTTP.post('https://127.0.0.1', { name: 'haha' }, function () { }, function () { });
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      name: options.name,
      img: options.img,
      member: options.member,
      imagenum: options.imagenum
    })
  },
  deletemember: function () {
    wx.navigateTo({ url: '../deletemember/deletemember' });
  },
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {

    }
    return {
      title: app.globalData.userInfo.nickName + '邀请你加入“' + that.data.name + '”相册',
      path: '/pages/catalog/catalog?id=' + that.data.id + '&name=' + that.data.name + '&img=' + that.data.img + '&member=' + that.data.member + '&imagenum=' + that.data.imagenum,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
