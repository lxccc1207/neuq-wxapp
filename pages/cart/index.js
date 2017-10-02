//index.js

var app = getApp()
const api = require('../../api/index.js')
Page({
  data: {
    goodsList: {
      saveHidden: true,
      totalPrice: 0,
      allSelect: false,
      noSelect: true,
      list: [],
      buyNumMax: 10
    },
    delBtnWidth: 120,    //删除按钮宽度单位（rpx）
  },

  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);  //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  onLoad: function () {
    api.getShoppingCart().then(res => {
      // console.log(res)
      if (res.data.status === 0) {
        this.data.goodsList.list = res.data.res
        this.setData({
          goodsList: this.data.goodsList
        })
      } else if (res.data.status === 1001) {
        app.getSessionId().then(result => {
          api.getShoppingCart(e.id).then(res => {
            if (res.data.status === 0) {
              this.setData({
                goodsList: this.data.goodsList
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
    this.initEleWidth();
    this.onShow();
  },
  onShow: function () {
    api.getShoppingCart().then(res => {
      if (res.data.status === 0) {
        this.data.goodsList.list = res.data.res
        this.setData({
          goodsList: this.data.goodsList
        })
      }
    })
  },
  onPullDownRefresh: function () {
    api.getShoppingCart().then(res => {
      wx.stopPullDownRefresh()
      if (res.data.status === 0) {
        this.data.goodsList.list = res.data.res
        this.setData({
          goodsList: this.data.goodsList
        })
      } else if (res.data.status === 1001) {
        app.getSessionId().then(result => {
          api.getShoppingCart(e.id).then(res => {
            if (res.data.status === 0) {
              this.setData({
                goodsList: this.data.goodsList
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
  jumpDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../goods-details/index?id=' + id
    })
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var index = e.currentTarget.dataset.index;

    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) {//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      var list = this.data.goodsList.list;
      if (index != "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  touchE: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      var list = this.data.goodsList.list;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);

      }
    }
  },
  delItem: function (e) {
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var list = this.data.goodsList.list
    list.splice(index, 1);
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    this.deleteShoppingCart([id])
  },
  selectTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    }
  },
  totalPrice: function () {
    var list = this.data.goodsList.list;
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        total += (curItem.commodityPO.price * curItem.number);
      }
    }
    return total;
  },
  allSelect: function () {
    var list = this.data.goodsList.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  noSelect: function () {
    var list = this.data.goodsList.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },
  deleteShoppingCart: function (list) {
    api.deleteShoppingCart({
      deleteId: list
    }).then(res => {
      // console.log(res)
    })
  },
  updateShoppingCart: function (id, number) {
    api.updateNumber({
      id: id,
      number: number
    }).then(res => {
      // console.log(res)
    })
  },
  setGoodsList: function (saveHidden, total, allSelect, noSelect, list) {
    this.setData({
      goodsList: {
        saveHidden: saveHidden,
        totalPrice: total,
        allSelect: allSelect,
        noSelect: noSelect,
        list: list
      }
    });
    // console.log(list)
  },
  bindAllSelect: function () {
    var currentAllSelect = this.data.goodsList.allSelect;
    var list = this.data.goodsList.list;
    if (currentAllSelect) {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = false;
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
      }
    }

    this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
  },
  addBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number < this.data.buyNumMax) {
        list[parseInt(index)].number++;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
        this.updateShoppingCart(list[parseInt(index)].id, list[parseInt(index)].number)
      }
    }
  },
  subtractBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number > 1) {
        list[parseInt(index)].number--;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
        this.updateShoppingCart(list[parseInt(index)].id, list[parseInt(index)].number)
      }
    }
  },
  editTap: function () {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  saveTap: function () {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  getSaveHide: function () {
    var saveHidden = this.data.goodsList.saveHidden;
    return saveHidden;
  },
  deleteSelected: function () {
    var list = this.data.goodsList.list;
    var restList, deleteList
    var idList = []
    restList = list.filter(function (curGoods) {
      return !curGoods.active;
    });
    deleteList = list.filter(function (curGoods) {
      return curGoods.active;
    });
    for (var i=0;i<deleteList.length;i++) {
      idList.push(deleteList[i].id)
    }
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), restList);
    this.deleteShoppingCart(idList)
  },
  toPayOrder: function () {
    var shopList = [];
    var list = this.data.goodsList.list
    var toPayList = []
    wx.showLoading();
    if (this.data.goodsList.noSelect) {
      wx.hideLoading();
      return;
    }
    if (list.length > 0) {
      shopList = list.filter(item => item.active)
    } else {
      wx.hideLoading();
    }
    for (var i = 0; i < shopList.length; i++) {
      var item = {
        commodityId: shopList[i].commodityPO.id,
        number: shopList[i].number,
        name: shopList[i].commodityPO.name,
        imgUrl: shopList[i].commodityPO.imageList[0].url,
        price: shopList[i].commodityPO.price,
        commodityPO: {
          commodityAttrPOList: shopList[i].commodityPO.commodityAttrPOList
        }
      }
      toPayList.push(item)
    }
    if (toPayList.length > 0) {
      for (var i = 0; i < toPayList.length; i++) {
        var id = toPayList[i].commodityId
        var number = toPayList[i].number
        api.getCommodity(id).then(res => {
          wx.hideLoading();
          if (number > res.data.res.quantity) {
            wx.showModal({
              title: '提示',
              content: '当前购物车有商品超过库存，请检查',
              showCancel:false
            })
          } else {
            wx.navigateTo({
              url: '/pages/to-pay-order/index?shopList=' + JSON.stringify(toPayList)
            })
          }
        })
      }
    }
    // console.log(toPayList)
    // console.log(JSON.stringify(toPayList))
  }
})
