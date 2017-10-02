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

function getListCommodityByType (typeId) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/commodity/listCommodityByType/' + typeId,
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

function deleteShoppingCart (data) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/commodity/deleteShoppingCart',
    method : "POST",
    data: data
  })
}

function updateNumber (data) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/commodity/updateNumber',
    method : "POST",
    data: data
  })
}

function insertOrder (data) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/order/insertOrder',
    method : "POST",
    data: data
  })
}

function getOrderByUserId (type) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/order/getOrderByUserId/' + type,
    method : "GET"
  })
}

function addAddress (data) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/user/addAddress',
    method : "POST",
    data: data
  })
}

function deleteUserAddress (id) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/user/deleteUserAddress',
    method : "POST",
    data: {id: id}
  })
}

function getUserAddressList () {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/user/getUserAddress',
    method : "GET"
  })
}

function getUserAddress (id) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/user/getUserAddress/' + id,
    method : "GET"
  })
}

function updateUserAddress (data) {
  return pwx.request({
    url: apiConfig.baseUrl + apiConfig.type + apiConfig.version + '/user/updateUserAddress',
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
  getTypeList,
  getListCommodityByType,
  deleteShoppingCart,
  updateNumber,
  insertOrder,
  getOrderByUserId,
  addAddress,
  deleteUserAddress,
  getUserAddress,
  getUserAddressList,
  updateUserAddress
}