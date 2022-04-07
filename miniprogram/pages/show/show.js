const db = wx.cloud.database()
var myVlu = "";
let studiedNum = 0,
  totalNum = 0,
  percentage = 0,
  schedule = 0,
  bookName = '',
  m = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    signedNum: 0,
    bookInfo: {},
    array: [5, 10, 15, 20, 25, 30, 35, 40]
  },

  setBookInfo: function () {
    wx.navigateTo({
      url: "/pages/changeDct/changeDct",
    })
  },

  bindPickerChange: function (res) {
    // console.log('picker发送选择改变，携带值为', res.detail.value)
    this.setData({
      index: res.detail.value
    })

  },

  startLearn: function () {
    // 不存在userinfo的缓存时
    if (!wx.getStorageSync('userInfo')) {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      return
    }else if (!wx.getStorageSync('currBook')) {
      wx.showToast({
        title: '请选择单词本',
        icon: "none"
      })
      return
    }
    // 不存在未选择数量的情况，已经默认5条
    // 可在云函数直接获取openid
    wx.navigateTo({
      url: '../index/index?taskNum=' + this.data.array[this.data.index]
    })
  },

  startreview: function () {
    wx.navigateTo({
      url: '/pages/review/review',
    })
  },

  toCalendarPage: function () {
    wx.navigateTo({
      url: '../../pages/punchCard/punchCard',
    })
  },

  async onShow() {
    // 获取打卡天数
    db.collection('calendar').count().then(res => {
      this.setData({
        signedNum: res.total
      })
    })

    // 根据当前书信息
    let storbook = await wx.getStorageSync('currBook')
    console.log('书：', storbook)

    // 获取存储的已学单词数量
    if (storbook.type == 'cet4') {
      // 用户初次进入页面时，是没有缓存信息，加判断
      if (await wx.getStorageSync('cet4Progress')) {
        m = await wx.getStorageSync('cet4Progress')
      } else {
        m = 0
      }
      console.log('进入cet4，m的值为', m)
    } else if (storbook.type == 'cet6') {
      if (await wx.getStorageSync('cet6Progress')) {
        m = await wx.getStorageSync('cet6Progress')
      }else {
        m = 0
      }
      console.log('进入cet6，m的值为', m)
    }
    studiedNum = m
    totalNum = storbook.total

    // 算取当前进度，向上取整
    percentage = Math.ceil(studiedNum / totalNum || 0)
    console.log('stu', studiedNum, 'per', percentage)
    this.setData({
      bookInfo: {
        totalNum,
        studiedNum,
        schedule: percentage,
        bookName: storbook.name,
      }
    })
  },

})