const api = require('../../api/index.js')
Page({
    data: {
        category: [],
        list:[],
        curIndex: 0,
        isScroll: false,
        toView: 'cafe'
    },
    onLoad: function () {
        var category, list
        api.getTypeList().then(res => {
            console.log(res)
            category = res.data
            api.getListCommodityByType(res.data[0].id).then(res => {
                console.log(res)
                list = res.data.res
                this.setData({
                    category: category,
                    list: list
                })
            })
        })
    },
    switchTab(e){
        var id = e.currentTarget.dataset.id
        api.getListCommodityByType(id).then(res => {
            this.setData({
                toView : e.target.dataset.id,
                curIndex : e.target.dataset.index,
                list: res.data.res
            })
        })
    }
})