const db = wx.cloud.database()
let myaudio = wx.createInnerAudioContext({
        useWebAudioImplement: true
    }),
    searchword = ''

Page({
    
    onShow: function () {
        this.getRandomWord()
    },



    async getRandomWord() {
        // Returns a pseudorandom number between 0 and ?.

        let res = await wx.cloud.callFunction({
            name: 'getWord',
            data: {
                type: 'queryWordByRandom'
            }
        })
        console.log('随机单词', res.result)
        // return
        this.setData({
            randomWord: res.result
        })
    },
    onReady: function () {
        // 绑定组件id，用于后面调用指定id组件内的方法
        this.component = this.selectComponent("#search")
    },
    // 输入框内容
    inputword(e) {
        searchword = e.detail.value
    },
    // 点击“查询”
    async search() {
        console.log('执行查询', searchword)
        if (searchword) {
            // 获取数据
            wx.showLoading({
                title: '查询中...',
                mask: true
            })
            let res = await wx.cloud.callFunction({
                name: 'getWord',
                data: {
                    searchword: searchword,
                    type: 'searchword'
                }
            })
            wx.hideLoading()

            res = res.result.data

            // 打印数据结果
            console.log('res', res)
            // 如果数据长度为0，表示没有相关记录
            if (res.length == 0) {
                wx.showToast({
                    title: '未找到相关单词',
                    icon: 'none'
                })
                return // 终止程序
            }
            let wordName = res[0].content

            myaudio.src = 'https://dict.youdao.com/dictvoice?audio=' + wordName + '&type=2'
            myaudio.play();
            // console.log('word', wordName)
            // 能走到这里，表示已经查询到单词，将获取的整体数据传给组件，以便组件随意使用数据
            this.setData({
                word: res[0]
            })
            // 执行组件内方法，让组件内的元素显示
            this.component.show()
        } else {
            wx.showToast({
                title: '请输入查询单词',
                icon: 'error'
            })
        }
    },
    // 加入生词本
    addWord() {
        // console.log('res',this.data.word)
        let that = this
        wx.showLoading({
            title: '数据加载中...',
            mask: true
        })
        this.setData({
            showNot: true,
        })
        db.collection("wordlist")
            .add({
                data: {
                    content: this.data.word.content,
                    pron: this.data.word.pron,
                    definition: this.data.word.definition,

                }
            }).then(res => {
                console.log(res)
                wx.hideLoading({})
            })
    },

    // 单词发音
    read: function () {
        myaudio = wx.createInnerAudioContext({
            useWebAudioImplement: true
        });
        console.log('content:', this.data.word.content)
        myaudio.src = 'https://dict.youdao.com/dictvoice?audio=' + this.data.word.content + '&type=2'
        myaudio.play();
    },

    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: this.searchword, // 分享标题
            desc: '您也可以分享哦', // 分享描述
            path: '', // 分享路径
        }
    },
})