Page({
  data: {
    list: [
      {
        id: '2017929',
        name: '2017-9-29',
        open: false     
      }, {
        id: '2017928',
        name: '2017-9-28',
        open: false
      }, {
        id: '2017927',
        name: '2017-9-27',
        open: false
      }, {
        id: '2017926',
        name: '2017-9-26',
        open: false
      }, {
        id: '2017925',
        name: '2017-9-25',
        open: false
      }, {
        id: '2017924',
        name: '2017-9-24',
        open: false
      }, {
        id: '2017923',
        name: '2017-9-23',
        url: 'storage/storage'
      }
    ]
  },
  enterFolder:function(e){
    wx.navigateTo({
      url:'../catalog/catalog'
    })
  },
  setTool:function(e){
    wx.navigateTo({
      url: '../catalog/catalog'
    })
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        if (list[i].url) {
          wx.navigateTo({
            url: 'pages/' + list[i].url
          })
          return
        }
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
})
