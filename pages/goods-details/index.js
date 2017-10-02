//index.js
//获取应用实例
var app = getApp();
const api = require('../../api/index.js')
const util = require('../../utils/utils.js')

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail:{},
    swiperCurrent: 0,
    hasMoreSelect:false,
    selectSize:"选择：",
    selectSizePrice:0,
    hideShopPopup:true,
    buyNumber:1,
    buyNumMin:1,
    buyNumMax:10,
    propertyChildIds:"",
    propertyChildNames:"",
    canSubmit:false, //  选中规格尺寸时候是否允许加入购物车
    price: 0,
    shopPOList: [],
    shopPOListActive: [{},{}],
    shopCartInfo:{},
    shopType: "addShopCart",//购物类型，加入购物车或立即购买，默认为加入购物车
  },
  //事件处理函数
  swiperchange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onLoad: function (e) {
    api.getCommodity(e.id).then(res => {
      console.log(res)
      if (res.data.status === 0) {
        this.setData({
          goodsDetail: res.data.res,
          price: res.data.res.price
        })
        wx.setNavigationBarTitle({
          title: res.data.res.name
        })
      } else if (res.data.status === 1001) {
        app.getSessionId().then(result => {
          api.getCommodity(e.id).then(res => {
            if (res.data.status === 0) {
              this.setData({
                goodsDetail: res.data.res,
                price: res.data.res.price
              })
              wx.setNavigationBarTitle({
                title: res.data.res.name
              })
            }
          })
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          image: '../../images/icon/error.png',
          duration: 2000
        })
      }
    })
  },
  goShopCart: function () {
    wx.switchTab({
      url: '../../pages/cart/index'
    })
  },
  toAddShopCart: function () {
    this.setData({
      shopType: "addShopCart"
    })
    if (this.judgeQuantity) {
      this.bindSpecSelectTap();
    } else {
      wx.showToast({
        title: '暂时缺货哦',
        image: '../../images/icon/error.png',
        duration: 2000
      })
    }
  },
  tobuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    if (this.judgeQuantity) {
      this.bindSpecSelectTap();
    } else {
      wx.showToast({
        title: '暂时缺货哦',
        image: '../../images/icon/error.png',
        duration: 2000
      })
    }
  },
  judgeQuantity: function () {
    if (this.data.goodsDetail.quantity > 0) {
      return true
    } else {
      return false
    }
  },
  // 规格选择弹出框
  bindSpecSelectTap: function() {
    this.setData({
      hideShopPopup: false
    })
  },
  // 规格选择弹出框隐藏
  closePopupTap: function() {
    this.setData({
      hideShopPopup: true
    })
  },
  numSubtractTap: function() {
    if(this.data.buyNumber > this.data.buyNumMin){
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
          buyNumber: currentNum
      })
    } else {
      wx.showToast({
        title: '数量不能为空',
        image: '../../images/icon/error.png',
        duration: 2000
      })
    }
  },
  numAddTap: function() {
    if (this.data.buyNumber > this.data.buyNumMax) {
      wx.showToast({
        title: '已达最大数量',
        image: '../../images/icon/error.png',
        duration: 2000
      })
      return false;
    }
    if (this.data.buyNumber >= this.data.goodsDetail.quantity) {
      wx.showToast({
        title: '库存不足',
        image: '../../images/icon/error.png',
        duration: 2000
      })
      return false;
    }
    var currentNum = this.data.buyNumber;
    currentNum++ ;
    this.setData({
        buyNumber: currentNum
    })
  },
  labelItemTap: function(e) {
    var dataset = e.currentTarget.dataset
    var shopPOList = this.data.shopPOList
    var length = shopPOList.length
    var price = this.data.goodsDetail.price
    // 点击样式
    this.data.shopPOListActive[0][dataset.attrname] = dataset.id
    this.data.shopPOListActive[1][dataset.attrname] = dataset.addprice
    if (length) {
      for (let i=0;i<length;i++) {
        if (shopPOList[i].attrName == dataset.attrname) {
          shopPOList[i].commodityAttrPOList[0].attrName = dataset.attrname
          shopPOList[i].commodityAttrPOList[0].value = dataset.value
          break
        }
      }
    } else {
      var obj = {
        attrName: dataset.attrname,
        commodityAttrPOList: [{
          id: dataset.id,
          addPrice: dataset.addprice,
          value: dataset.value
        }]
      }
      shopPOList.push(obj)
    }
    // 修改实时价格
    for (var item in this.data.shopPOListActive[1]) {
      price += this.data.shopPOListActive[1][item]
    }
    this.setData({
      shopPOListActive: this.data.shopPOListActive, // {attrName: price}
      price: price,
      shopPOList: shopPOList
    })
  },
  addShopCart: function(){
    // 判断是否符合购物车标准
    if (util.keys(this.data.shopPOListActive[0]).length !== this.data.goodsDetail.commodityPOList.length) {
      wx.showToast({
        title: '请选择商品规格',
        image: '../../images/icon/error.png',
        duration: 2000
      })
    } else {
      // 初始化购物车信息
      var shopCartInfo = {
        commodityId: this.data.goodsDetail.id,
        number: this.data.buyNumber
      }
      if (this.data.shopPOList[0]) {
        shopCartInfo.commodityAttrPOList = this.data.shopPOList[0].commodityAttrPOList
      } else {
        shopCartInfo.commodityAttrPOList = []
      }
      // 提交购物车
      api.addShoppingCart(shopCartInfo).then(res => {
        if (res.data.status === 0) {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          console.log(res)
        }
      }).finally(res => {
        this.closePopupTap();
      })
    }
  },
  buyNow:function(){
    // 判断是否符合购买要求
    if (util.keys(this.data.shopPOListActive[0]).length !== this.data.goodsDetail.commodityPOList.length) {
      wx.showToast({
        title: '请选择商品规格',
        image: '../../images/icon/error.png',
        duration: 2000
      })
    } else {
      // 初始化购物信息
      var shopCartInfo = {
        commodityId: this.data.goodsDetail.id,
        number: this.data.buyNumber,
        name: this.data.goodsDetail.name,
        imgUrl: this.data.goodsDetail.imageList[0].url,
        price: this.data.price,
        shopPOList: this.data.shopPOList
      }
      if (this.data.shopPOList[0]) {
        shopCartInfo.commodityPO = {}
        shopCartInfo.commodityPO.commodityAttrPOList = this.data.shopPOList[0].commodityAttrPOList
      } else {
        shopCartInfo.commodityPO = {}
        shopCartInfo.commodityPO.commodityAttrPOList = []
      }
      // 关闭弹窗
      this.closePopupTap();
      // 跳转订单页
      wx.navigateTo({
        url: "/pages/to-pay-order/index?orderType=buyNow&shopList=" + JSON.stringify([shopCartInfo])
      })
    }
  }
})
