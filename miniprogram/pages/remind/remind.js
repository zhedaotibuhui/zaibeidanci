Page({
    /**
     * 页面的初始数据
     */
    data: {
        distortion:'',
        phrase:'',
        samples:''
    },

    getback:function(){
        wx.navigateBack()
    },

    async onLoad(options) {
        console.log('op',options.content,options.id)
        let res = await wx.cloud.callFunction({
            name:'confind',
            data:{
                id:options.id,
                content:options.content
            }
        })
        console.log('res',res,res.result)
        this.setData({
            distortion:res.result.list[0].word[0].distortion,
            phrase:res.result.list[0].word[0].phrase,
            samples:res.result.list[0].word[0].samples,
        })
        console.log('res',res.result)
    },


})