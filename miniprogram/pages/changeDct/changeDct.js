Page({
    data: {
        currBook: '',
    },
    async onLoad() {
        wx.showLoading()
        let res = await wx.cloud.callFunction({
            name: 'getWord',
            data: {
                type: 'getBooksList'
            }
        })
        wx.hideLoading()
        this.setData({
            bookList: res.result.data
        })
    },
    // 切换类型
    chooseType(e) {
        e = e.currentTarget.dataset.index
        this.setData({
            currBook: this.data.bookList[e].name
        })
        // wx.navigateTo({
        //     url: '../index/index?type=' + this.data.bookList[e].type,
        // })
        let bookName = this.data.bookList[e]
        wx.setStorageSync('currBook', bookName)
        wx.showToast({
            title: `已切换至${bookName.name}`,
            icon: 'none',
            duration: 1500
        })
        setTimeout(function () {
            wx.navigateBack({
                delta: 1,
            })
        }, 1500)
    },

    async onShow() {
        let currBook = await wx.getStorageSync('currBook')
        this.setData({
            currBook: currBook.name
        })
    }
})