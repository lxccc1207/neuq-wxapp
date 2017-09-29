var app = getApp()
Page( {
  data: {
    userInfo: {},
    projectSource: '',
    userListInfo: [ {
      icon:'/images/icon/iconfont-order.png',
      text: '我的订单',
      url: '../order-list/index',
      isunread: true,
      unreadNum: 2
    }, {
      icon:'/images/icon/iconfont-coupon.png',
      text: '我的代金券',
      url:'../mycoupons/index',
      isunread: false,
      unreadNum: 2
    }, {
      icon:'/images/icon/iconfont-addr.png',
      text: '收货地址管理',
      url:'../select-address/index',
    }, {
      icon:'/images/icon/iconfont-kefu.png',
      text: '联系客服'
    }, {
      icon:'/images/icon/iconfont-q.png',
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