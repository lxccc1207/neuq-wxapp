//app.js
const Promise = require('modules/es6-promise.js').Promise
const api = require('api/index.js')
const pwx = require('utils/pwx.js')
import {ToastPannel} from './templates/toast/toast'
App({
  ToastPannel,
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
    pwx.checkSession().then( res => {
      // console.log("success1-checkSession")
    }).catch( res => {
      // console.log("error1-checkSession")
      this.getSessionId();
    })
  },
  getSessionId : function(){
    return new Promise((resolve, reject) => {
      pwx.login().then( res => {
        // console.log('code is ' + res.code)
        return api.getSession(res.code)
      }).then( res => {
        // console.log(res)
        // console.log("success3-post-code")
        this.globalData.session=res.data.extMap.thirdSessionId
        this.globalData.UID = res.data.extMap.userId
        return pwx.setStorage('session',this.globalData.session)
      }).then(res => {
        // console.log(res)
        return pwx.setStorage('UID', this.globalData.UID)
      }).then( res => {
        // console.log("success4-set-storage "+res)
        return pwx.getUserInfo()
      }).then( res => {
        // console.log("success5-get-user-info")
        // console.log(res)
        this.globalData.userInfo = res.userInfo;
        var encryptedData = res.encryptedData
        // console.log(encryptedData)
        var iv = res.iv
        // console.log(iv)
        return api.decodeUserInfo({
          "iv":iv,
          "encryptedData" :encryptedData
        })
      }).then(res => {
        resolve(res.data.status)
      }).catch(err => {
        reject(err)
      })
    })
  },
  globalData: {
    userInfo: null,
    session: '',
    UID: ''
  }
})