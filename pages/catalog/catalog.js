var HTTP = require('../../servers.js');
var config = require('../../config.js');
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
var app = getApp();
Page({
  data: {
    img: '',
    option: '',
    stutas: true,
    haveId: false,
    checkedNum: 0,
    nodata: true,
    showLoading: true,
    checkImgId: [],
    checkImg: [],
    checkall: false,
    operation: false,
    _operation: false,
    authority: false,
    imageList: [],
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],
    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],
    countIndex: 9,
    name: '',

  },
  // 触摸开始时间
  touchStartTime: 0,
  // 触摸结束时间
  touchEndTime: 0,
  // 最后一次单击事件点击发生时间
  lastTapTime: 0,
  // 单击事件点击后要触发的函数
  lastTapTimeoutFunc: null,

  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  goHome: function () {
    wx.reLaunch({ url: '../index/index' })
  },
  deleteAlbum: function () {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '您是否要删除' + self.data.name + ' 相册',
      showCancel: true,
      cancelText: '暂不删除',
      confirmText: "确认删除",
      success: function (res) {
        if (res.confirm) {
          self.setData({
            showLoading: false
          });
          HTTP.deleteFolder(self.data.id).then(() => {
            self.setData({
              showLoading: true
            });
            wx.reLaunch({ url: '../index/index' })
          }, () => {
            wx.showToast({
              title: '删除文件夹失败',
              image: '../../image/foldererr.png',
              duration: 2000
            })
          })
        } else {

        }

      }
    })


  },
  dynamics: function (e) {
    var self = this;
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.countIndex,
      success: function (res) {

        wx.setStorageSync('imageinput', res);
        wx.navigateTo({
          url: '../pushdymics/pushdymics?id=' + self.data.id
        })
      }
    })
  },
  /// 长按
  longTap: function (e) {
    let img = this.data.imageList;
    img[e.target.dataset.index].activeImg = "activeImg";
    this.setData({ imageList: img })
    this.showModal();
  },
  /// 单击、双击
  multipleTap: function (e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        console.log("double tap")
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
        wx.showModal({
          title: '提示',
          content: '双击事件被触发',
          showCancel: false
        })
      } else {
        // 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。
        that.lastTapTimeoutFunc = setTimeout(function () {
          that.checkImg(e);
        }, 300);
      }
    }
  },
  downLoadFile: function () {
    var self = this;
    self.setData({
      showLoading: false,
      loadingText: "正在下载..."
    })
  

    var length = self.data.checkImg.length;
    var s = Math.ceil(length / 6);
    var i = 0;

    function down() {
      var newres = self.data.checkImg.slice(i * 6, i * 6 + 5);
      if (newres.length > 0) {
        HTTP.downLoadFile(newres).then((res) => {
          HTTP.saveImageToPhotosAlbum(res).then(() => {

            i++;
            down()

          }, () => {
            self.setData({
              showLoading: true
            })
            wx.showToast({
              title: '下载照片失败',
              image: '../../image/image.png',
              duration: 2000
            })
          })
        })
      } else {
        self.setData({ checkImg: [], checkImgId: [] });
        self.cancleCheckAll();
        self.setData({
          showLoading: true
        })
        wx.showToast({
          title: '下载照片成功',
          image: '../../image/image.png',
          duration: 2000
        })
        return;
      }

    }


    down();



  },
  deleteFile: function () {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '是否删除已选照片',
      showCancel: true,
      cancelText: '暂不删除',
      confirmText: "确认删除",
      success: function (res) {
        if (res.confirm) {
          self.setData({
            showLoading: false,
            loadingText: "正在删除..."
          })
          HTTP.deleteImgs(self.data.id, self.data.checkImgId).then((res) => {
            self.setData({ checkImg: [], checkImgId: [] });
            self.cancleCheckAll();
            self.getData();
            self.setData({
              showLoading: true
            })
          }, () => {
            wx.showToast({
              title: '删除照片失败',
              image: '../../image/image.png',
              duration: 2000
            })
          })
        }

      }
    })
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[that.data.sourceTypeIndex],
      sizeType: sizeType[that.data.sizeTypeIndex],
      count: that.data.count[that.data.countIndex],
      success: function (res) {
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getData();

      this.setData({
        options: options
      })
    } else {
      this.setData({
        options: ''
      })
    }

  },
  getData: function () {
    var self = this;
    HTTP.get(config.getFolder(self.data.id), app.globalData.sessionID).then((res) => {
      console.log("文件", res)
      if (res == '404') {
        self.setData({
          stutas: false
        })
      } else {
        self.setData({
          stutas: true
        })
        wx.setNavigationBarTitle({ title: res.name })
        self.setData({
          id: res._id,
          name: res.name,
          imagenum: res.photoCount,
          img: config.staticHost + res.cover,
          description: res.description,
          authority: res.owner
        })
      }

    }, (err) => {
      console.log("相册查询失败", err)
    })
    var imageList = [];
    self.setData({
      showLoading: false,
      loadingText: "正在查询"
    });
    HTTP.get(config.uploadFileUrl(self.data.id), app.globalData.sessionID).then((res) => {
      var fileUrls = [];
      res = res.reverse();
      res.forEach((r) => {
        fileUrls.push(config.staticHost + r.src)
        imageList.push({ url: config.staticHost + r.src, checked: false, id: r._id })
      });
      if (res.length == 0) {
        if (self.data._operation) {
          self.cancleCheck();
        }
        self.setData({
          nodata: true
        })
      } else {
        self.setData({
          nodata: false
        })
      }
      self.setData({ imageList: imageList });
      self.setData({
        showLoading: true
      });
    }, (err) => {

    })
  },
  operationshow: function () {
    this.showModal();
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
    if (!this.data.option && wx.getStorageSync('folderaId')) {
      var id = wx.getStorageSync('folderaId')
      this.setData({
        id: id
      })
      this.getData();
    }
  },
  checkAll: function () {
    this.setData({
      checkall: true,
      checkImg: [],
      checkImgId: []
    });
    let Imgs = [];
    var self = this;
    this.data.imageList.forEach(function (d) {
      d.checked = true;
      self.data.checkImg.push(d.url)
      self.data.checkImgId.push(d.id)
      Imgs.push(d);
    });
    this.setData({ imageList: Imgs, checkedNum: Imgs.length })
    this.showModal();
  },
  cancleCheckAll: function () {
    this.setData({
      checkall: false,
      checkImg: [],
      checkImgId: []
    });
    let Imgs = [];
    this.data.imageList.forEach(function (d) {
      d.checked = false;
      Imgs.push(d);
    });
    this.setData({ imageList: Imgs, checkedNum: 0 })
    this.hideModal();
  },
  cancleCheck: function () {
    let Imgs = [];
    this.data.imageList.forEach(function (d) {
      d.checked = false;
      Imgs.push(d);
    });
    this.setData({
      imageList: Imgs,
      checkedNum: 0
    })
    this.hideModal();
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-out",
      delay: 0
    })
    this.animation = animation
    animation.height(0).step()
    this.setData({
      animationData: animation.export(),
      operation: false,
      _operation: false
    })
    setTimeout(function () {
      animation.height(200).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  checkImg: function (e) {
    if (this.data.operation) {
      let img = this.data.imageList;
      img[e.target.dataset.index].checked = !img[e.target.dataset.index].checked;
      if (img[e.target.dataset.index].checked) {
        this.setData({ checkedNum: this.data.checkedNum + 1 })
        this.data.checkImg.push(img[e.target.dataset.index].url)
        this.data.checkImgId.push(img[e.target.dataset.index].id)
      } else {
        this.setData({ checkedNum: this.data.checkedNum - 1 });
        this.data.checkImg.splice(e.target.dataset.index, 1)
        this.data.checkImgId.splice(e.target.dataset.index, 1)
      }
      if (this.data.checkedNum) {
        if (!this.data.showModalStatus) {
          this.showModal();
        }
      } else {
        if (this.data.showModalStatus) {
          this.hideModal();
        }
      }
      this.setData({ imageList: img })

    } else {
      var current = e.target.dataset.src;
      var previewImgs = [];

      this.data.imageList.forEach(function (d) {
        previewImgs.push(d.url)
      });
      wx.previewImage({
        current: current,
        urls: previewImgs
      })
    }
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
    wx.clearStorageSync();
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
  operationFn: function () {
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease-in",
      delay: 0,
      transformOrigin: "0 0",
    })
    animation.height(0).step()
    this.animation = animation
    this.setData({
      animationData: animation.export(),
      _operation: true
    })
    setTimeout(function () {
      animation.height(0).step()
      this.setData({ animationData: animation.export(), operation: true })
    }.bind(this), 200)
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-out",
      delay: 0
    })
    this.animation = animation
    animation.translateY(200).step()
    this.setData({
      bottomAnimationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        bottomAnimationData: animation.export()
      })
    }.bind(this), 300)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(400).step()
    this.setData({
      bottomAnimationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        bottomAnimationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: app.globalData.userInfo.nickName + '向您分享“' + that.data.name + '”相册',
      path: '/pages/catalog/catalog?id=' + that.data.id,
      imageUrl: that.data.img,
      success: function (res) {
        //转发成功
        wx.showToast({
          title: '分享成功',
          image: '../../image/shared.png',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          image: '../../image/shared.png',
          duration: 2000
        })
      }
    }
  }
})