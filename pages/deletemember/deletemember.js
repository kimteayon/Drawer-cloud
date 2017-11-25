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
    }, {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/X8qpdaicx7s3siapSicynvX0jyrOdyjodOKjWVj8aY6qxAejoCTraZU8n829de12FUl1up3tqqoaTH6MdDTYJdqsw/0",
      city: "Beibei",
      country: "China",
      nickName: "吃饼干的怪兽👑",
      province: "Chongqing"
    } ]},

    creatFolder: function (e) {
      this.setData({ hidden: false });
      HTTP.post('https://127.0.0.1', { name: 'haha' }, function () { }, function () { });
    },
    onLoad: function () {

    }
  })
