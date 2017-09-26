var app = getApp()
Page( {
  data: {
    userInfo: {},
    projectSource: '',
    userListInfo: [ {
      icon: '',
      text: '我的订单',
      url: '../order-list/index',
      isunread: true,
      unreadNum: 2
    }, {
      icon: '',
      text: '我的代金券',
      url:'',
      isunread: false,
      unreadNum: 2
    }, {
      icon: '',
      text: '收货地址管理',
      url:'../select-address/index',
    }, {
      icon: '',
      text: '联系客服'
    }, {
      icon: '',
      text: '常见问题'
    }]
  },

  onLoad: function(options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
       that.setData({
         userInfo:userInfo
       })
      }
    )
  }
})