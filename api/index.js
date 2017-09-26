const pwx = require('../utils/pwx.js')

const apiConfig = {
  baseUrl: 'https://neuqstore.fightinghang.cn/mall',
  type: '/api',
  version: '/v1.0'
}

function getSession(code) {
  return pwx.requestNoToken({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/getSession',
    data: { "code" : code},
    method : "GET"
  })
}

function decodeUserInfo(data) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/decodeUserInfo',
    data: JSON.stringify(data),
    method : "POST"
  })
}

function getIndexInfo () {
  return pwx.requestNoToken({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/commodity/getIndexInfo',
    method : "GET"
  })
}

function getCommodity (id) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/commodity/getCommodityById/' + id,
    method : "GET"
  })
}

function getShoppingCart () {
  var uid = wx.getStorageSync('UID')
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/commodity/getShoppingCartByUserId/' + uid,
    method : "GET"
  })
}

module.exports = {
  getSession: getSession,
  decodeUserInfo: decodeUserInfo,
  getIndexInfo: getIndexInfo,
  getCommodity: getCommodity,
  getShoppingCart: getShoppingCart
}