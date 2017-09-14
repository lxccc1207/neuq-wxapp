var app = getApp()
Page( {
  data: {
    userInfo: {},
    projectSource: '',
    userListInfo: [ {
      icon: 'g',
      text: '我的订单',
      isunread: true,
      unreadNum: 2
    }, {
        icon: '',
        text: '我的代金券',
        isunread: false,
        unreadNum: 2
      }, {
        icon: '',
        text: '我的拼团',
        isunread: true,
        unreadNum: 1
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
  },

  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
      that.setData( {
        userInfo: userInfo
      })
    })
  }
})