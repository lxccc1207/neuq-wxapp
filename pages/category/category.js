const api = require('../../api/index.js')
Page({
    data: {
        category: [
            {name:'咖啡',id:'cafe'},
            {name:'奶茶',id:'naicha'},
            {name:'酸奶',id:'suannai'},
            {name:'气泡水',id:'qipaoshui'},
            {name:'奶昔',id:'naixi'},
            {name:'特别推荐',id:'tebietuijian'}
        ],
        detail:[],
        curIndex: 0,
        isScroll: false,
        toView: 'cafe'
    },
    onLoad: function () {
        api.getTypeList().then(res => {
            if (res.data.status === 0) {
                console.log(res)
            }
        })
    },
    switchTab(e){
        this.setData({
            toView : e.target.dataset.id,
            curIndex : e.target.dataset.index
        })
    }
    
})