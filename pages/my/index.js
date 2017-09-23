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
      
    }, {
<<<<<<< HEAD
        icon: '',
        text: '我的代金券',
        isunread: false,
       
      }, 
       {
        icon: '',
        text: '收货地址管理'
      }, {
        icon: '',
        text: '联系客服'
      }, {
        icon: '',
        text: '常见问题'
      }]
=======
      icon: '',
      text: '我的代金券',
      isunread: false,
      unreadNum: 2
    }, {
      icon: '',
      text: '收货地址管理'
    }, {
      icon: '',
      text: '联系客服'
    }, {
      icon: '',
      text: '常见问题'
    }]
>>>>>>> master
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