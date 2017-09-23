//app.js
const api = require('api/index.js')
const pwx = require('utils/pwx.js')
App({
  onLaunch: function () {
    // this.checkSession()
    this.getSessionId()
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      // console.log(this.globalData.userInfo)
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      // 调用登录接口
      pwx.login().then(res=>{
        // console.log(res);
        return pwx.getUserInfo()
      }).then(res => {
        that.globalData.userInfo = res.userInfo
        typeof cb == "function" && cb(that.globalData.userInfo)
      })
    }
  },
  checkSession: function (){
    var that = this;
    pwx.checkSession().then( res => {
      // console.log("success1-checkSession")
    }).catch( res => {
      // console.log("error1-checkSession")
      that.getSessionId();
    })
  },
  getSessionId : function(){
    var that = this;
    pwx.login().then( res => {
      // console.log('code is ' + res.code)
      return api.getSession(res.code)
    }).then( res => {
      // console.log(res)
      // console.log("success3-post-code")
      that.globalData.session=res.data.extMap.thirdSessionId
      that.globalData.UID = res.data.extMap.userId
      return pwx.setStorage('session',that.globalData.session)
    }).then(res => {
      // console.log(res)
      return pwx.setStorage('UID', that.globalData.UID)
    }).then( res => {
      // console.log("success4-set-storage "+res)
      return pwx.getUserInfo()
    }).then( res => {
      // console.log("success5-get-user-info")
      // console.log(res)
      that.globalData.userInfo = res.userInfo;
      var encryptedData = res.encryptedData
      // console.log(encryptedData)
      var iv = res.iv
      // console.log(iv)
      return api.decodeUserInfo({
        "iv":iv,
        "encryptedData" :encryptedData
      })
    })
  },
  globalData: {
    userInfo: null,
    session: '',
    UID: ''
  }
})