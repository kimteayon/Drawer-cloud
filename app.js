var HTTP = require('./servers.js')
var config = require('./config.js');
//app.js
App({
  onLaunch: function () {
    // 登录
    HTTP.setApp(this);
  },
  globalData: {
    userInfo: null
  }
})