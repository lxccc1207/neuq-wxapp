const api = require('../../api/index.js')
const onfire = require('../../modules/onfire.js')
Page({
    data: {
        category: [],
        list:[],
        curIndex: 0,
        isScroll: false,
        toView: 'cafe'
    },
    onLoad: function (e) {
        var category, list
        api.getTypeList().then(res => {
            console.log(res)
            if (res.data.status === 0) {
                category = res.data.res
                this.showCommodityList(res.data.res[0].id)
                this.setData({
                    category: category
                })
            }
        })
    },
    switchTab(e){
        var id = e.currentTarget.dataset.id
        this.setData({
            toView : e.target.dataset.id,
            curIndex : e.target.dataset.index
        })
        this.showCommodityList(id)
    },
    showCommodityList: function (id) {
        api.getListCommodityByType(id).then(res => {
            if (res.data.status === 0) {
                this.setData({
                    list: res.data.res
                })
            }
        })
    }
})