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
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/commodity/getShoppingCartByUserId',
    method : "GET"
  })
}

function getTypeList () {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/commodity/getTypeList',
    method : "GET"
  })
}

function addShoppingCart (data) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/commodity/addShoppingCart',
    method : "POST",
    data: data
  })
}

module.exports = {
  getSession,
  decodeUserInfo,
  getIndexInfo,
  getCommodity,
  getShoppingCart,
  addShoppingCart,
  getTypeList
}