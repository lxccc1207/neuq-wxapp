//index.js
//获取应用实例
var app = getApp();
const api = require('../../api/index.js')
const util = require('../../utils/utils.js')
//var WxParse = require('../../wxParse/wxParse.js');

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
    shopNum:0,
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
      //console.log(e.detail.current)
       this.setData({
        swiperCurrent: e.detail.current
    })
  },
  onLoad: function (e) {
    // console.log(e)
    var that = this;
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
    // 获取购物车数据
    // wx.getStorage({
    //   key: 'shopCartInfo',
    //   success: function(res) {
    //     that.setData({
    //       shopCartInfo:res.data,
    //       shopNum:res.data.shopNum
    //     });
    //   }
    // })
    // wx.request({
    //   url: '/'+ app.globalData.subDomain +'',
    //   data: {
    //     id: e.id
    //   },
    //   success: function(res) {
    //     var selectSizeTemp = "";
    //     if (res.data.data.properties) {
    //       for(var i=0;i<res.data.data.properties.length;i++){
    //         selectSizeTemp = selectSizeTemp + " " + res.data.data.properties[i].name;
    //       }
    //       that.setData({
    //         hasMoreSelect:true,
    //         selectSize:that.data.selectSize + selectSizeTemp,
    //         selectSizePrice:res.data.data.basicInfo.minPrice,
    //       });
    //     }
    //     that.data.goodsDetail = res.data.data;
    //     that.setData({
    //       goodsDetail:res.data.data,
    //       selectSizePrice:res.data.data.basicInfo.minPrice,
    //       buyNumMax:res.data.data.basicInfo.stores,
    //       buyNumber:(res.data.data.basicInfo.stores>0) ? 1: 0
    //     });

    //   }
    // })
    // this.reputation(e.id);
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
    this.bindGuiGeTap();
  },
  tobuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();
    /*    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
          this.bindGuiGeTap();
          return;
        }
        if(this.data.buyNumber < 1){
          wx.showModal({
            title: '提示',
            content: '暂时缺货哦~',
            showCancel:false
          })
          return;
        }
        this.addShopCart();
        this.goShopCart();*/
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function() {
     this.setData({
        hideShopPopup: false
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
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
     if(this.data.buyNumber < this.data.buyNumMax){
        var currentNum = this.data.buyNumber;
        currentNum++ ;
        this.setData({
            buyNumber: currentNum
        })
     } else {
        wx.showToast({
          title: '已达最大数量',
          image: '../../images/icon/error.png',
          duration: 2000
        })
     }
  },
  labelItemTap: function(e) {
    // var that = this;
    var dataset = e.currentTarget.dataset
    // console.log(dataset)
    var shopPOList = this.data.shopPOList
    var length = shopPOList.length
    var price = 0
    // 点击样式
    this.data.shopPOListActive[0][dataset.attrname] = dataset.id
    this.data.shopPOListActive[1][dataset.attrname] = dataset.addprice
    if (length) {
      for (let i=0;i<length;i++) {
        if (shopPOList[i].attrName === dataset.attrName) {
          shopPOList[i].commodityAttrPOList[0].addPrice = dataset.attrName
          shopPOList[i].commodityAttrPOList[0].value = dataset.value
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
    for (var item in this.data.shopPOListActive[1]) {
      price += this.data.shopPOListActive[1][item]
    }
    // console.log(price)
    this.setData({
      shopPOListActive: this.data.shopPOListActive,
      price: price,
      shopPOList: shopPOList
    })
    /*
    console.log(e)
    console.log(e.currentTarget.dataset.propertyid)
    console.log(e.currentTarget.dataset.propertyname)
    console.log(e.currentTarget.dataset.propertychildid)
    console.log(e.currentTarget.dataset.propertychildname)
    */
    // 取消该分类下的子栏目所有的选中状态
    // var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods;
    // for(var i = 0;i < childs.length;i++){
    //   that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
    // }
    // 设置当前选中状态
    // that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[e.currentTarget.dataset.propertychildindex].active = true;
    // 获取所有的选中规格尺寸数据
    // var needSelectNum = that.data.goodsDetail.properties.length;
    // var curSelectNum = 0;
    // var propertyChildIds= "";
    // var propertyChildNames = "";
    // for (var i = 0;i < that.data.goodsDetail.properties.length;i++) {
    //   childs = that.data.goodsDetail.properties[i].childsCurGoods;
    //   for (var j = 0;j < childs.length;j++) {
    //     if(childs[j].active){
    //       curSelectNum++;
    //       propertyChildIds = propertyChildIds + that.data.goodsDetail.properties[i].id + ":"+ childs[j].id +",";
    //       propertyChildNames = propertyChildNames + that.data.goodsDetail.properties[i].name + ":"+ childs[j].name +"  ";
    //     }
    //   }
    // }
    // var canSubmit = false;
    // if (needSelectNum == curSelectNum) {
    //   canSubmit = true;
    // }
    // 计算当前价格
    // if (canSubmit) {
      // wx.request({
      //   url: ''+ app.globalData.subDomain +'',
      //   data: {
      //     goodsId: that.data.goodsDetail.basicInfo.id,
      //     propertyChildIds:propertyChildIds
      //   },
      //   success: function(res) {
      //     that.setData({
      //       selectSizePrice:res.data.data.price,
      //       propertyChildIds:propertyChildIds,
      //       propertyChildNames:propertyChildNames,
      //       buyNumMax:res.data.data.stores,
      //       buyNumber:(res.data.data.stores>0) ? 1: 0
      //     });
      //   }
      // })
    // }


    // this.setData({
    //   goodsDetail: that.data.goodsDetail,
    //   canSubmit:canSubmit
    // })
  },
  /**
  * 加入购物车
  */
  addShopCart: function(){
    if (util.keys(this.data.shopPOListActive[0]).length !== this.data.goodsDetail.commodityPOList.length) {
      wx.showToast({
        title: '请选择商品规格',
        image: '../../images/icon/error.png',
        duration: 2000
      })
    } else {
      var shopCartInfo = {
        id: this.data.goodsDetail.id,
        number: this.data.buyNumber,
        commodityPOList: this.data.shopPOList
      }
      console.log(JSON.stringify(shopCartInfo))
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
      this.closePopupTap();
    }
    // if (this.data.goodsDetail.properties && !this.data.canSubmit) {
    //   if (!this.data.canSubmit){
    //     wx.showModal({
    //       title: '提示',
    //       content: '请选择商品规格！',
    //       showCancel: false
    //     })
    //   }
    //   this.bindGuiGeTap();
    //   return;
    // }
    // if(this.data.buyNumber < 1){
    //   wx.showModal({
    //     title: '提示',
    //     content: '购买数量不能为0！',
    //     showCancel:false
    //   })
    //   return;
    // }
    //组建购物车
    // var shopCartInfo = this.bulidShopCartInfo();

    // this.setData({
    //   shopCartInfo:shopCartInfo,
    //   shopNum:shopCartInfo.shopNum
    // });

    // 写入本地存储
    // wx.setStorage({
    //   key:"shopCartInfo",
    //   data:shopCartInfo
    // })
    
    // wx.showToast({
    //   title: '加入购物车成功',
    //   icon: 'success',
    //   duration: 2000
    // })
    //console.log(shopCartInfo);

    //shopCartInfo = {shopNum:12,shopList:[]}
  },
	/**
	  * 立即购买
	  */
  buyNow:function(){
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      wx.showModal({
        title: '提示',
        content: '请先选择规格尺寸哦~',
        showCancel:false
      })
      return;
    }
    if(this.data.buyNumber < 1){
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel:false
      })
      return;
    }
    //组建立即购买信息
    var buyNowInfo = this.buliduBuyNowInfo();
    // 写入本地存储
    wx.setStorage({
      key:"buyNowInfo",
      data:buyNowInfo
    })
    this.closePopupTap();

    wx.navigateTo({
      url: "/pages/to-pay-order/index?orderType=buyNow"
    })
  },
  /**
   * 组建购物车信息
   */
  bulidShopCartInfo: function () {
    // 加入购物车
    // var shopCarMap = {};
    // shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    // shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    // shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸
    // shopCarMap.propertyChildIds = this.data.propertyChildIds;
    // shopCarMap.label = this.data.propertyChildNames;
    // shopCarMap.price = this.data.selectSizePrice;
    // shopCarMap.left = "";
    // shopCarMap.active = true;
    // shopCarMap.number = this.data.buyNumber;
    // shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    // shopCarMap.logistics = this.data.goodsDetail.logistics;
    // shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var shopCartInfo = this.data.shopCartInfo;
    if (!shopCartInfo.shopNum) {
      shopCartInfo.shopNum = 0;
    }
    if (!shopCartInfo.shopList) {
      shopCartInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCartInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCartInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCartInfo.shopNum = shopCartInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCartInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCartInfo.shopList.push(shopCarMap);
    }
    return shopCartInfo;
  },
	/**
	 * 组建立即购买信息
	 */
  buliduBuyNowInfo: function () {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    /*    var hasSameGoodsIndex = -1;
        for (var i = 0; i < toBuyInfo.shopList.length; i++) {
          var tmpShopCarMap = toBuyInfo.shopList[i];
          if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
            hasSameGoodsIndex = i;
            shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
            break;
          }
        }
        toBuyInfo.shopNum = toBuyInfo.shopNum + this.data.buyNumber;
        if (hasSameGoodsIndex > -1) {
          toBuyInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
        } else {
          toBuyInfo.shopList.push(shopCarMap);
        }*/

    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },

  reputation: function (goodsId) {
    var that = this;
    // wx.request({
    //   url: '' + app.globalData.subDomain + '',
    //   data: {
    //     goodsId: goodsId
    //   },
    //   success: function (res) {
    //     if (res.data.code == 0) {
    //       console.log(res.data.data);
    //       that.setData({
    //         reputation: res.data.data
    //       });
    //     }
    //   }
    // })
  }
})
