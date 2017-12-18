var URL = require('./config.js');
var SESSION = '';
var APP = null;
var Http = {
  setApp: function (app) {
    APP = app;
  },
  relogin: function (resolve, reject) {
    var self = this;
    wx.login({
      success: res => {
        // 获取用户信息
        wx.getSetting({
          success: r => {
            if (!r.authSetting['scope.userInfo']) {
              wx.authorize({
                scope: 'scope.userInfo',
                success() {
                  self.session(res, resolve, reject);
                }
              })
            }
            if (!r.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  wx.saveImageToPhotosAlbum();
                  wx.saveVideoToPhotosAlbum();
                }
              })
            }
            if (r.authSetting['scope.userInfo']) {
              self.session(res, resolve, reject);
            }
          }
        });


      },
    })
  },
  session: function (res, resolve, reject) {
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    var self = this;
    wx.getUserInfo({
      success: u => {
        // 可以将 res 发送给后台解码出 unionId
        APP.globalData.userInfo = u.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(APP.globalData.userInfo)
        self.postLogin(URL.loginUrl, { js_code: res.code, username: u.userInfo.nickName, img: u.userInfo.avatarUrl }).then((res) => {
          console.log("登录成功")
          SESSION = res;
          resolve();
        }, (err) => {
          console.log("登录失败")
          reject(err)
        })

        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(u)
        }
      }
    })
  },
  login: function () {
    var self = this;
    const promise = new Promise(function (resolve, reject) {
      wx.checkSession({
        success: function (r) {
          if (!SESSION) {
            self.relogin(resolve, reject);
          } else {
            self.postLogin(URL.checkSession, {}).then((res) => {
              console.log(res)
              if (!res) {
                self.relogin(resolve, reject);
              } else {
                console.log("无需登录", SESSION);
                resolve();
              }
            }, () => {
              self.relogin(resolve, reject);
              console.log("checksession失败！！")
            })
          }
        },
        fail: function () {
          self.relogin(resolve, reject);
        }
      })

    })
    return promise;
  },
  get: function (url) {
    var self = this;
    const promise = new Promise(function (resolve, reject) {
      self.login().then((ss) => {
        wx.request({
          url: url,
          method: 'GET',
          header: { cookie: 'connect.sid=' + SESSION },
          dataType: 'json',
          success: function (res) {

            resolve(res.data);
          },
          fail: function (res) {

            reject();
          }
        });
      })
    })
    return promise;
  },
  deleteFolder: function (id) {
    var url = URL.host + '/folders/' + id;
    var self = this;
    const promise = new Promise(function (resolve, reject) {
      self.login().then((ss) => {
        wx.request({
          url: url,
          method: 'DELETE',
          dataType: 'json',
          header: { cookie: 'connect.sid=' + SESSION },
          success: function (res) {
            resolve(res.data);
          },
          fail: function (res) {
            reject(new Error('failed!'));
          }
        });
      })

    })
    return promise;
  },
  deleteImgs: function (id, urls) {
    var self = this;
    const promise = Promise.all(urls.map((url, index) => {
      return new Promise(function (resolve, reject) {
        self.login().then((ss) => {
          wx.request({
            url: URL.host + '/folders/' + id + '/photos/' + url,
            method: 'DELETE',
            dataType: 'json',
            header: { cookie: 'connect.sid=' + SESSION },
            success: function (res) {
              resolve(res.data);
            },
            fail: function (res) {
              reject(new Error('failed!'));
            }
          });

        })

      });
    }))
    return promise;
  },
  post: function (url, data) {
    var self = this;
    const promise = new Promise(function (resolve, reject) {
      self.login().then((ss) => {
        wx.request({
          url: url,
          method: 'POST',
          data: data,
          dataType: 'json',
          header: { cookie: 'connect.sid=' + SESSION },
          success: function (res) {
            resolve(res.data);
          },
          fail: function (res) {
            reject(new Error('failed!'));
          }
        });
      });

    });
    return promise;
  },
  postLogin: function (url, data) {
    var self = this;
    const promise = new Promise(function (resolve, reject) {
      wx.request({
        url: url,
        method: 'POST',
        data: data,
        dataType: 'json',
        header: { cookie: 'connect.sid=' + SESSION },
        success: function (res) {
          resolve(res.data);
        },
        fail: function (res) {
          reject(new Error('failed!'));
        }
      });
    });
    return promise;
  },
  uploadFile: function (tempFilePaths, id) {
    var self = this;
    const promise = Promise.all(tempFilePaths.map((tempFilePath, index) => {
      return new Promise(function (resolve, reject) {
        self.login().then((ss) => {
          wx.uploadFile({
            url: URL.uploadFileUrl(id),
            filePath: tempFilePath,
            header: { cookie: 'connect.sid=' + SESSION },
            name: "photo",
            success: function (res) {
              resolve(res.data);
            },
            fail: function (err) {
              reject(new Error('failed to upload file'));
            }

          })
        })


      });
    }));
    return promise;
  },
  downLoadFile: function (tempFilePaths) {
    var self = this;
    const promise = Promise.all(tempFilePaths.map((tempFilePath, index) => {
      return new Promise(function (resolve, reject) {
        self.login().then((ss) => {
          wx.downloadFile({
            url: tempFilePath,
            success: function (res) {
              resolve(res);
            },
            fail: function (err) {
              reject("2", console.log(err));
            }
          })
        })

      })
    }))
    return promise;
  },
  saveImageToPhotosAlbum: function (Paths) {
    var self = this;
    const promise = Promise.all(Paths.map((Path, index) => {
      var tempFilePath = Path.tempFilePath;
      return new Promise(function (resolve, reject) {
        self.login().then((ss) => {
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function (res) {
              resolve(res);
            },
            fail: function (err) {
              reject("下载失败");
            }
          })
        })
      })
    }))

    return promise;


  }
}
module.exports = Http;