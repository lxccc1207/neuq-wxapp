//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false, // loading
    images: [{p1:'../../images/psb.jpg',},
             {p1:'../../images/psb.png',},
             {p1:'../../images/psb1.jpg',},
            ],

  },

  
  //事件处理函数
 

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    //sliderList
    wx.request({
      url: '',
      method: 'GET',
      data: {},
      header: {
        'Accept': ''
      },
      success: function (res) {
        that.setData({
          images: res.data
        })
      }
    })

    //venuesList
    wx.request({
      url: '',
      method: 'GET',
      data: {},
      header: {
        'Accept': ''
      },
      success: function (res) {
        that.setData({
          venuesItems: res.data.data
        })
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
      }
    })

    //choiceList
    wx.request({
      url: '',
      method: 'GET',
      data: {},
      header: {
        'Accept': ''
      },
      success: function (res) {
        that.setData({
          choiceItems: res.data.data.dataList
        })
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
      }
    })

  }
})
