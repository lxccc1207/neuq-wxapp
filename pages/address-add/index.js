//var commonCityData = require('../../utils/city.js')
//获取应用实例
var app = getApp()
const api = require('../../api/index.js')
Page({
  data: {
    addressData: {},
    id: 0,
    status: 0, // 0 -> add , 1 -> update
    firstAdd: false
  },
  bindCancel: function () {
    wx.navigateBack({})
  },
  bindSave: function(e) {
    var that = this;
    var receiverName = e.detail.value.receiverName;
    var address = e.detail.value.address;
    var receiverPhone = e.detail.value.receiverPhone;
    var isDefault = e.detail.value.isDefault ? 1 : 0

    if (receiverName == ""){
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel:false
      })
      return
    }
    if (receiverPhone == ""){
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel:false
      })
      return
    }
    if (address == ""){
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel:false
      })
      return
    }
    if (this.data.status === 0) {
      api.addAddress({
        address: address,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        isDefault: isDefault
      }).then(res => {
        if (res.data.status === 0) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
          if (this.data.firstAdd) {
            wx.navigateTo({
              url: '/pages/select-address/index?firstAdd=true'
            })
          } else {
            wx.navigateBack({})
          }
          this.setData({
            addressData: {}
          })
        }
      })
    } else {
      api.updateUserAddress({
        id: this.data.id,
        address: address,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        isDefault: isDefault
      }).then(res => {
        if (res.data.status === 0) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({})
          this.setData({
            addressData: {}
          })
        }
      })
    }
  },
  onLoad: function (e) {
    var id = e.id;
    var firstAdd = e.firstAdd
    if (id) {
      // 初始化原数据
      wx.showLoading();
      api.getUserAddress(id).then(res => {
        console.log(res)
        wx.hideLoading();
        if (res.data.status === 0) {
          this.setData({
            status: 1,
            id: id,
            addressData: res.data.res
          })
        }
      })
    }
    if (e.firstAdd) {
      this.setData({
        firstAdd: true
      })
    }
  },
  deleteAddress: function (e) {
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          api.deleteUserAddress(id).then(res => {
            if (res.data.status === 0) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              wx.navigateBack({})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
