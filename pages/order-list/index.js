var app = getApp()
const api = require('../../api/index.js')
Page({
  data:{

    statusType: [ "全部" , "待付款" , "待使用" , "待评价", "退款/售后"],
    currentType:1,
    tabClass: ["", "", "", "", ""],
    orderList: []

    
  },
  statusTap:function(e){
     var curType =  e.currentTarget.dataset.type;
     this.data.currentType = curType
     api.getOrderByUserId(curType).then(res => {
       console.log(res)
       if (res.data.status === 0) {
         this.setData({
            currentType:curType,
            orderList: res.data.res
         })
         this.onShow();
       }
     })
  },
  orderDetail : function (e) {
    var orderId = e.currentTarget.dataset.id;
    // wx.navigateTo({
    //   url: "/pages/order-details/index?id=" + orderId
    // })
  },
  cancelOrderTap:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
     wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading();
          // wx.request({
          //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/close',
          //   data: {
          //     token: app.globalData.token,
          //     orderId: orderId
          //   },
          //   success: (res) => {
          //     wx.hideLoading();
          //     if (res.data.code == 0) {
          //       that.onShow();
          //     }
          //   }
          // })
        }
      }
    })
  },
  toPayTap:function(e){
    var orderId = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    // wxpay.(app, money, orderId, "/pages/order-list/index");
  },
  onLoad:function(options){
    api.getOrderByUserId(1).then(res => {
      console.log(res)
      if (res.data.status === 0) {
        this.setData({
          orderList: res.data.res
        })
      }
    })
  },
  getOrderStatistics : function () {
    var that = this;
    // wx.request({
    //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/statistics',
    //   data: { token: app.globalData.token },
    //   success: (res) => {
    //     wx.hideLoading();
    //     if (res.data.code == 0) {
    //       var tabClass = that.data.tabClass;
    //       if (res.data.data.count_id_no_pay > 0) {
    //         tabClass[0] = "red-dot"
    //       } else {
    //         tabClass[0] = ""
    //       }
    //       if (res.data.data.count_id_no_transfer > 0) {
    //         tabClass[1] = "red-dot"
    //       } else {
    //         tabClass[1] = ""
    //       }
    //       if (res.data.data.count_id_no_confirm > 0) {
    //         tabClass[2] = "red-dot"
    //       } else {
    //         tabClass[2] = ""
    //       }
    //       if (res.data.data.count_id_no_reputation > 0) {
    //         tabClass[3] = "red-dot"
    //       } else {
    //         tabClass[3] = ""
    //       }
    //       if (res.data.data.count_id_success > 0) {
    //         //tabClass[4] = "red-dot"
    //       } else {
    //         //tabClass[4] = ""
    //       }

    //       that.setData({
    //         tabClass: tabClass,
    //       });
    //     }
    //   }
    // })
  },
  onShow:function(){
    // 获取订单列表
    // wx.showLoading();
    this.getOrderStatistics();
    // wx.request({
    //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/list',
    //   data: postData,
    //   success: (res) => {
    //     wx.hideLoading();
    //     if (res.data.code == 0) {
    //       that.setData({
    //         orderList: res.data.data.orderList,
    //         logisticsMap : res.data.data.logisticsMap,
    //         goodsMap : res.data.data.goodsMap
    //       });
    //     } else {
    //       this.setData({
    //         orderList: null,
    //         logisticsMap: {},
    //         goodsMap: {}
    //       });
    //     }
    //   }
    // })
  }
})