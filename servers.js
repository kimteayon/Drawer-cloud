var URL = require('./config.js');
var Http = {
  get: function (url) {
    const promise = new Promise(function (resolve, reject) {
      wx.request({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          resolve(res.data);
        },
        fail: function (res) {
          reject(new Error('failed!'));
        }
      });
    })
    return promise;
  },
  post: function (url, data) {
    const promise = new Promise(function (resolve, reject) {
      wx.request({
        url: url,
        method: 'POST',
        data: data,
        dataType: 'json',
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
    const promise = Promise.all(tempFilePaths.map((tempFilePath, index) => {
      console.log(URL.uploadFileUrl(id))
      return new Promise(function (resolve, reject) {
        wx.uploadFile({
          url: URL.uploadFileUrl(id),
          filePath: tempFilePath,
          name: "photo",
          success: function (res) {
            resolve(res.data);
          },
          fail: function (err) {
            reject(new Error('failed to upload file'));
          }
        });
      });
    }));
    return promise;
  }
}
module.exports = Http;