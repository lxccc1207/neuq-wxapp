//index.js
//获取应用实例
const api = require('../../api/index.js')
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false, // loading
    sliderList: [],
    classifyList: [],
    goodsList: []
  },
  onPullDownRefresh: () => {
    api.getIndexInfo().then(res => {
        if (res.data.status === 0) {
          wx.stopPullDownRefresh()
          this.setData({
            sliderList: res.data.res.bannerPOList,
            classifyList: res.data.res.typeList,
            goodsList: res.data.res.commodityPOList
          })
        } else if (res.data.status === 1001){
          app.getSessionId().then(res => {
              console.log(res)
              api.getIndexInfo().then(res => {
                  if (res.data.status === 0) {
                      wx.stopPullDownRefresh()
                      this.setData({
                        sliderList: res.data.res.bannerPOList,
                        classifyList: res.data.res.typeList,
                        goodsList: res.data.res.commodityPOList
                      })
                  } else {

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
  //事件处理函数
  swiperchange: () => {

  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(()=>{
        api.getIndexInfo().then(res => {
          wx.hideLoading()
          console.log(res)
          if (res.data.status === 0) {
            this.setData({
              sliderList: res.data.res.bannerPOList,
              classifyList: res.data.res.typeList,
              goodsList: res.data.res.commodityPOList
            })
          } else {
            app.getSessionId().then(result => {
                console.log(result)
                api.getIndexInfo().then(res => {
                    if (res.data.status === 0) {
                        this.setData({
                          sliderList: res.data.res.bannerPOList,
                          classifyList: res.data.res.typeList,
                          goodsList: res.data.res.commodityPOList
                        })
                    } else {
                        wx.showToast({
                          title: res.data.msg,
                          image: '../../images/icon/error.png',
                          duration: 2000
                        })
                    }
                })
            })
          }
        })
    }, 1000)
    //sliderList
    // wx.request({
    //   url: '',
    //   method: 'GET',
    //   data: {},
    //   header: {
    //     'Accept': ''
    //   },
    //   success: function (res) {
    //     that.setData({
    //       images: res.data
    //     })
    //   }
    // })

    //venuesList
    // wx.request({
    //   url: '',
    //   method: 'GET',
    //   data: {},
    //   header: {
    //     'Accept': ''
    //   },
    //   success: function (res) {
    //     that.setData({
    //       venuesItems: res.data.data
    //     })
    //     setTimeout(function () {
    //       that.setData({
    //         loadingHidden: true
    //       })
    //     }, 1500)
    //   }
    // })

    //choiceList
    // wx.request({
    //   url: '',
    //   method: 'GET',
    //   data: {},
    //   header: {
    //     'Accept': ''
    //   },
    //   success: function (res) {
    //     that.setData({
    //       choiceItems: res.data.data.dataList
    //     })
    //     setTimeout(function () {
    //       that.setData({
    //         loadingHidden: true
    //       })
    //     }, 1500)
    //   }
    // })

  }
})
