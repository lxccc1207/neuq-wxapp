//index.js
//获取应用实例
var app = getApp()
const api = require('../../api/index.js')
const onfire = require('../../modules/onfire.js')
Page({
  data: {
    addressList:[],
    status: 0,
    firstAdd: false
  },
  onPullDownRefresh: function () {
    api.getUserAddressList().then(res => {
      // console.log(res)
      if (res.data.status === 0) {
        this.setData({
          addressList: res.data.res
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    // console.log(e)
    if (this.data.status === 1) {
      wx.navigateBack({})
      onfire.fire('changeAddress', id)
    }
    if (this.data.firstAdd) {
      wx.navigateBack({
        delta: 2
      })
      onfire.fire('changeAddress', id)
    }
  },
  addAddess : function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },
  onLoad: function (e) {
    if (parseInt(e.status) === 1) {
      this.setData({
        status: 1
      })
    }
    if (e.firstAdd) {
      this.setData({
        firstAdd: true
      })
    }
  },
  onShow : function () {
    this.initAddress()
  },
  initAddress: function () {
    api.getUserAddressList().then(res => {
      // console.log(res)
      if (res.data.status === 0) {
        this.setData({
          addressList: res.data.res
        })
      }
    })
  }

})
