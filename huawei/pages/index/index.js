var app = getApp()
Page({
  data: {
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    showModalStatus: false
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)

  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  onnameinput(e){
    console.log(e);
  },
  enterFolder: function (e) {
    wx.navigateTo({
      url: '../catalog/catalog'
    })
  },
onLoad: function () {
  for (var i = 1; i < 11; i++) {
    this.data.items.push({
      id: "201709" + i,
      name: "2017-09-" + i,
      content: i + " 向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦",
      isTouchMove: false //默认全隐藏删除
    })
  }
  this.setData({
    items: this.data.items
  })
},
//手指触摸动作开始 记录起点X坐标
touchstart: function (e) {
  //开始触摸时 重置所有删除
  this.data.items.forEach(function (v, i) {
    if (v.isTouchMove)//只操作为true的
      v.isTouchMove = false;
  })
  this.setData({
    startX: e.changedTouches[0].clientX,
    startY: e.changedTouches[0].clientY,
    items: this.data.items
  })
},
//滑动事件处理
touchmove: function (e) {
  var that = this,
    index = e.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
  that.data.items.forEach(function (v, i) {
    v.isTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if (i == index) {
      if (touchMoveX > startX) //右滑
        v.isTouchMove = false
      else //左滑
        v.isTouchMove = true
    }
  })
  //更新数据
  that.setData({
    items: that.data.items
  })
},
/**
 * 计算滑动角度
 * @param {Object} start 起点坐标
 * @param {Object} end 终点坐标
 */
angle: function (start, end) {
  var _X = end.X - start.X,
    _Y = end.Y - start.Y
  //返回角度 /Math.atan()返回数字的反正切值
  return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
},
//删除事件
del: function (e) {
  this.data.items.splice(e.currentTarget.dataset.index, 1)
  this.setData({
    items: this.data.items
  })
}
})