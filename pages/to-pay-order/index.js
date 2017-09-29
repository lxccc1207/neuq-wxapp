//index.js
//获取应用实例
var app = getApp()
const api = require('../../api/index.js')

Page({
  data: {
    goodsList:[],
    isNeedLogistics:0, // 是否需要物流信息
    totalPrice:0,
    yunPrice:0,
    allGoodsAndYunPrice:0,
    goodsJsonStr:"",
    orderType:"", //订单类型，购物车下单或立即支付下单，默认是购物车，

    hasNoCoupons: true,
    coupons: [],
    youhuijine:0, //优惠券金额
    curCoupon:null // 当前选择使用的优惠券
  },
  onShow : function () {
    // var that = this;
    // var shopList = [];
    // //立即购买下单
    // if ("buyNow"==that.data.orderType){
    //   var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
    //   if (buyNowInfoMem && buyNowInfoMem.shopList) {
    //     shopList = buyNowInfoMem.shopList
    //   }
    // }else{
    //   //购物车下单
    //   var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    //   if (shopCarInfoMem && shopCarInfoMem.shopList) {
    //     // shopList = shopCarInfoMem.shopList
    //     shopList = shopCarInfoMem.shopList.filter(entity => {
    //       return entity.active;
    //     });
    //   }
    // }
    // that.setData({
    //   goodsList: shopList,
    // });
    this.initShippingAddress();
  },
  onLoad: function (e) {
    var list = JSON.parse(e.shopCartInfo)
    var totalPrice = 0
    for (var i = 0; i < list.length; i++) {
      totalPrice += list[i].price * list[i].number
    }
    this.setData({
      isNeedLogistics: 1,
      orderType: e.orderType,
      goodsList: list,
      totalPrice: totalPrice
    });
  },
  createOrder:function (e) {
    var data = this.data.goodsList[0]
    console.log(this.data.goodsList[0])
    wx.showLoading();
    var postData = {
      buyerId: 1030,
      message: e.detail.value.remark, // 备注信息
      orderCommodityPOList: [{
      commodityId: data.commodityId,
      commodityPO: data.commodityPO,
      number: data.number
    }]
    };
    // 收货地址
    // if (this.data.isNeedLogistics > 0) {
    //   if (!this.data.curAddressData) {
    //     wx.hideLoading();
    //     wx.showModal({
    //       title: '错误',
    //       content: '请先设置您的收货地址！',
    //       showCancel: false
    //     })
    //     return;
    //   } else {
    //     // TODO address
    //     postData.addressId = 0
    //   }
    // }
    // 优惠券
    // if (this.data.curCoupon) {
    //   postData.couponId = this.data.curCoupon.id;
    // }
    api.insertOrder(postData).then(res => {
      console.log(res)
      if (res.data.status === 0) {
        wx.redirectTo({
          url: "/pages/order-list/index"
        });
      }
    })
  },
  initShippingAddress: function () {
    var that = this;
    // wx.request({
    //   url: '',
    //   data: {
    //     token:app.globalData.token
    //   },
    //   success: (res) =>{
    //     if (res.data.code == 0) {
    //       that.setData({
    //         curAddressData:res.data.data
    //       });
    //     }else{
    //       that.setData({
    //         curAddressData: null
    //       });
    //     }
    //   }
    // })
  },
  addAddress: function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url:"/pages/select-address/index"
    })
  }
  // ,getMyCoupons: function () {
  //   var that = this;
  //   wx.request({
  //     url: '',
  //     data: {
  //       token: app.globalData.token,
  //       status:0
  //     },
  //     success: function (res) {
  //       if (res.data.code == 0) {
  //         var coupons = res.data.data.filter(entity => {
  //           return entity.moneyHreshold <= that.data.allGoodsAndYunPrice;
  //         });
  //         if (coupons.length > 0) {
  //           that.setData({
  //             hasNoCoupons: false,
  //             coupons: coupons
  //           });
  //         }
  //       }
  //     }
  //   })
  // },
  // bindChangeCoupon: function (e) {
  //   const selIndex = e.detail.value[0] - 1;
  //   if (selIndex == -1) {
  //     this.setData({
  //       youhuijine: 0,
  //       curCoupon:null
  //     });
  //     return;
  //   }
  //   console.log("selIndex:" + selIndex);
  //   this.setData({
  //     youhuijine: this.data.coupons[selIndex].money,
  //     curCoupon: this.data.coupons[selIndex]
  //   });
  // }
})
