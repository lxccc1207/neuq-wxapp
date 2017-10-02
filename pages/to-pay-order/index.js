//index.js
//获取应用实例
var app = getApp()
const api = require('../../api/index.js')
const onfire = require('../../modules/onfire.js')
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
  onShow: function () {
    onfire.on('changeAddress', id => {
      api.getUserAddress(id).then(res => {
        if (res.data.status === 0) {
          this.setData({
            curAddressData: res.data.res
          })
        }
      })
    })
  },
  onLoad: function (e) {
    // console.log(e)
    var list = JSON.parse(e.shopList)
    console.log(list)
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
    this.initShippingAddress();
  },
  createOrder:function (e) {
    wx.showLoading();
    // console.log(this.data.goodsList)
    var list = this.data.goodsList
    var postData = {
      message: e.detail.value.remark, // 备注信息
      orderCommodityPOList: []
    };
    for (var i = 0; i < list.length; i++) {
      var item = {
        commodityId: list[i].commodityId,
        commodityPO: list[i].commodityPO,
        number: list[i].number
      }
      postData.orderCommodityPOList.push(item)
    }
    // 收货地址
    if (this.data.isNeedLogistics > 0) {
      if (!this.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      } else {
        // TODO address
        postData.addressId = this.data.curAddressData.id
      }
    }
    // 优惠券
    // if (this.data.curCoupon) {
    //   postData.couponId = this.data.curCoupon.id;
    // }
    api.insertOrder(postData).then(res => {
      wx.hideLoading();
      if (res.data.status === 0) {
        wx.redirectTo({
          url: "/pages/order-list/index"
        });
      }
    })
  },
  initShippingAddress: function () {
    api.getUserAddressList().then(res => {
      // console.log(res)
      if (res.data.status === 0) {
        var list = res.data.res
        var curAddressData
        if (list.length > 0) {
          curAddressData = {}
        } else {
          curAddressData = null
        }
        for (var i = 0; i < list.length; i++) {
          if (list[i].isDefault) {
            curAddressData = list[i]
            break
          }
        }
        if (!curAddressData.receiverName) {
          curAddressData = list[0]
        }
        this.setData({
          curAddressData: curAddressData
        })
        // console.log(curAddressData)
      }
    })
  },
  addAddress: function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url:"/pages/select-address/index?status=1"
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
