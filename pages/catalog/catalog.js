var HTTP = require('../../servers.js');
var config = require('../../config.js');
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
var app = getApp();
Page({
  data: {
    checkedNum: 0,
    checkall: false,
    operation: false,
    _operation: false,
    imageList: [],
    axisdatas: [{
      memberinfo: {
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/X8qpdaicx7s3siapSicynvX0jyrOdyjodOKjWVj8aY6qxAejoCTraZU8n829de12FUl1up3tqqoaTH6MdDTYJdqsw/0",
        city: "Beibei",
        country: "China",
        nickName: "吃饼干的怪兽👑",
        province: "Chongqing",

      },
      uiImg: 'ui-timeaxis-image-3',
      time: "5分钟前",
      image: [{ url: '1.jpeg' }, { url: '2.jpeg' }, { url: '3.jpeg' }],
    }, {
      memberinfo: {
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/X8qpdaicx7s3siapSicynvX0jyrOdyjodOKjWVj8aY6qxAejoCTraZU8n829de12FUl1up3tqqoaTH6MdDTYJdqsw/0",
        city: "Beibei",
        country: "China",
        nickName: "吃饼干的怪兽👑",
        province: "Chongqing"
      },
      time: "5分钟前",
      image: [{ url: '6.jpeg' }, { url: '7.jpeg' }],
    }, {
      memberinfo: {
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/X8qpdaicx7s3siapSicynvX0jyrOdyjodOKjWVj8aY6qxAejoCTraZU8n829de12FUl1up3tqqoaTH6MdDTYJdqsw/0",
        city: "Beibei",
        country: "China",
        nickName: "吃饼干的怪兽👑",
        province: "Chongqing"
      },
      time: "5分钟前",
      image: [{ url: '3.jpeg' }, { url: '4.jpeg' }],
    }],
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],
    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],
    countIndex: 9,
    name: '',
    img: '1.jpg'
  },
  setup: function (e) {
    wx.navigateTo({
      url: '../setup/setup?id=' + this.data.id + '&name=' + this.data.name + '&img=' + this.data.img + '&member=' + this.data.member + '&imagenum=' + this.data.imagenum
    })
  },
  dynamics: function (e) {
    var self = this;
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.countIndex,
      success: function (res) {
        console.log(res);
        wx.setStorageSync('imageinput', res);
        wx.navigateTo({
          url: '../pushdymics/pushdymics?id=' + self.data.id
        })

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
        console.log(res)
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
    this.setData({
      id: options.id,
      name: options.name,
      img: options.img,
      member: options.member,
      imagenum: options.imagenum
    })
    var self = this;
    HTTP.get(config.getFolder(self.data.id)).then((res) => {

    }, (err) => {

    })
    var imageList = [];
    HTTP.get(config.uploadFileUrl(self.data.id)).then((res) => {
      res.forEach((r) => {
        console.log(config.staticHost + '/download/' + r.name)
        imageList.push({ url: config.staticHost + '/download/' + r.name, checked: false })
      })
      self.setData({ imageList: imageList })
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

  },
  checkAll: function () {
    this.setData({
      checkall: !this.data.checkall
    });
    let Imgs = [];
    this.data.imageList.forEach(function (d) {
      d.checked = true;
      Imgs.push(d);
    });
    this.setData({ imageList: Imgs, checkedNum: Imgs.length })
    this.showModal();
  },
  cancleCheckAll: function () {
    this.setData({
      checkall: !this.data.checkall
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
      } else {
        this.setData({ checkedNum: this.data.checkedNum - 1 })
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
      console.log(res.target)
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