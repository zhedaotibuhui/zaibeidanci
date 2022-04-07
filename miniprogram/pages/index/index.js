const db = wx.cloud.database()
let m = 0, // 单词起始位置
  n = 5, // 默认学习条数，初始值为5
  array = [], //存放单词数据
  idx = 0, //单词初始下标，默认0
  value = {}, // 当前单词书名称
  curr_idx = 0,
  word_def = {},
  optionsNum = 0,
  wordType = 'cet4', // 默认四级
  myaudio = wx.createInnerAudioContext({
    useWebAudioImplement: true
  }),

  // 两个单词本以学的数量，通过缓存判断当前单词本，点击next加一，接着存入缓存中
  cnt_cet4 = 0,
  cnt_4 = {},
  cnt_6 = {},
  cnt_cet4_6 = 0,
  a = 0 // 

Page({

  /**
   * 页面的初始数据
   * 初始单词下标从0开始，onload加载第一组数据，并渲染下标0的数据
   * 点击下一个，下标首先+1，如果此时下标值超过数据长度（含等于），弹出提示。不超过就渲染新的数据。
   * 对于弹框提示中，用户选择继续，当下标归为0，数据长度也为新数据长度，并渲染一次数据。
   */

  data:{
    showNot:true,
    showDef:false,
    definition:""
  },

  getDef: function(){
    this.setData({
      showDef:true
    })
  },

  async onLoad(options) {
    m = 0
    n = 5
    idx = 0 // 每次进入页面时，单词起始下标归为0，避免数据残留
    if (options.taskNum) {
      optionsNum = options.taskNum
      console.log('需要学习的数量：', options.taskNum)
      // 重置学习条数
      n = parseInt(options.taskNum)
    }
    // 必须有书籍缓存，才会进入当前页面，所以无需判断是否有缓存
    let currBook = wx.getStorageSync('currBook')
    console.log('当前book', currBook)
    this.type = currBook.type
    // 根据当前书籍的类型type，获取已学习进度
    if (currBook.type == 'cet4') {
      if (wx.getStorageSync('cet4Progress')) {
        m = wx.getStorageSync('cet4Progress')
      }
    } else if (currBook.type == 'cet6') {
      if (wx.getStorageSync('cet6Progress')) {
        m = wx.getStorageSync('cet6Progress')
      }
    }
    // 根据值传递，获取对应数据库数据，此时数据从下标m开始
    // 此时的下标是进入页面的初始下标0，即idx为0，获取数据
    // 没有学习记录，从0开始获取。有记录，在上次学习的最后一个单词数量上+1后，开始获取数据
    // 初次进入页面，此处只需直接传值，不需要改变m的值，避免影响setdata()方法中的数据处理
    array = await this.getinfo(m == 0 ? 0 : m + 1, n, currBook.type)
    // 渲染数据
    // 初次进入页面，发生跳数据问题。也就是m值此时不可改变
    this.setdata(m, currBook.type)
  },
  show: function () {
    console.log('word', this.data.content)
    wx.navigateTo({
      url: "/pages/remind/remind?content=" + this.data.content,
    })
  },

  /**
   * 查询数据
   */
  async next() {
    // 下标递增
    idx += 1
    this.setData({
      showDef: false,
      showNot:true,
    })
    // 数据长度5，下标应从0到4，下标为5时需要弹框。即下标值idx≥数据长度n，弹框。数据长度同时也是学习的条数n
    if (idx >= n) {
      // 此时下标溢出，必须弹框
      let res = await wx.showModal({
        cancelColor: 'green',
        title: '提示',
        content: '你已经完成今日任务啦',
        cancelText: "去打卡",
        confirmText: "再来一点"
      })
      if (res.confirm) {
        // 用户确定继续，下标归0；单词新的起始位置m，为当前位置m+学习条数n，即m+=n，重置后开始获取新的数据，并赋值到array
        idx = 0
        m += n
        array = await this.getinfo(m, n, this.type)
        // 渲染数据
        this.setdata(m, this.type)
      } else {
        // 用户去打卡页面
        wx.navigateTo({
          url: '/pages/punchCard/punchCard?optionsNum=' + optionsNum,
        })
      }
    }
    // 下标未溢出
    else {
      // 下标值未超过学习条数时，继续渲染数据。m从0开始
      console.log('next中，m的值为：', m)
      this.setdata(m, this.type)
    }
  },

  /**
   * 添加生词本
   */
  addWord() {
    let that = this
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    this.setData({
      showNot: false,
    })
    db.collection("wordlist")
      .add({
        data: {
          content: that.data.content,
          pron: that.data.pron,
          definition: that.data.definition,
        }
      }).then(res => {
        console.log(res)
        wx.hideLoading({})
      })
  },
  read: function () {
    console.log("read")
    myaudio.play();
  },
  // 获取数据(利用云函数来获取)
  async getinfo(m, n, type) {
    wx.showLoading({
      title: '获取中',
    })
    // 调用getWord云函数，并传入m,n值
    let res = await wx.cloud.callFunction({
      name: 'getWord',
      data: {
        m,
        n,
        type
      }
    })

    wx.hideLoading()
    return res.result
  },
  // 渲染数据
  async setdata(m, type) {
    console.log('当前本类型：', type, '此时a的值：', a, 'idx的值：', idx, 'm的值：', m)
    // 缓存单词当前位置。此处不可动态设置m的值，会发生全局改变。曲线救国
    // m=0,idx=0时，表示第一个单词，此时学习数量为m+idx+1，即1;
    // m=0,idx=1时，此时学习数量为m+idx+1,即2
    // m=0,idx=2,m+idx+1=3
    // 4
    // 5
    // m=5,idx=0时，学习数量为m+idx+1，即6
    // m=5,idx=1时，学习数量为m+idx+1，即7

    // 单词起始位m，下标idx，当前学习数量m+idx+1
    // idx+1为整体，idx从0开始，学习数量从idx+1开始
    a = m + idx + 1
    let word = array[idx].content
    
    console.log('设置数据a后', a)
    if (type == 'cet4') {
      wx.setStorageSync('cet4Progress', a)
      console.log('此时的单词是：',word)
      // 点击单词显示释义
      let word_def = await db.collection('CET4').where({ 
          content:word
      }).get()
      this.setData({
        definition:word_def.data[0].definition,
      })
      console.log('word_def',word_def)
      
    } else if (type == 'cet6') {
      wx.setStorageSync('cet6Progress', a)
      console.log('此时的单词是：',word)
      // 点击单词显示释义
      let word_def = await db.collection('CET4_6').where({ 
          content:word
      }).get()
      this.setData({
        definition:word_def.data[0].definition,
      })
      console.log('word_def',word_def)
    }
    console.log(`加载第${idx+1}个单词`)

    // 已学单词加入复习本
    // db.collection('reviewList').add({
    //   data: {
    //     content: array[idx].content,
    //   }
    // })

    this.setData({
      content: array[idx].content,
      pron: array[idx].pron,
      definition: array[idx].definition,
    })
    //云数据库折磨
    myaudio.src = 'https://dict.youdao.com/dictvoice?audio=' + array[idx].content + '&type=2';
  }
})