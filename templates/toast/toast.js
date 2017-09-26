let _compData = {
  '_toast_isHide': false,
  '_toast_content': ''
}

let toastPannel = {
  show: function (data) {
    // let that = this
    this.setData({
      '_toast_isHide': true,
      '_toast_content': data
    })
    setTimeout(()=>{
      this.setData({
        '_toast_isHide': false
      })
    }, 3000)
  }
}

function ToastPannel () {
  let pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  this.__page = currentPage
  Object.assign(currentPage, toastPannel)
  currentPage.toastPannel = this
  currentPage.setData(_compData)
  return this
}

module.exports = {
  ToastPannel
}