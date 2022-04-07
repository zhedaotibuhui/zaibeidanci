const db = wx.cloud.database()
let content = '',
  id = ''

Page({

  data: {
  },
  /**
   * 单词详情
   */
  transfer(e){ 
    id=e.target;
    console.log('id：',id)

    wx.showToast({
      title: '暂未开发',
      icon:'none'
    })

    // wx.navigateTo({  // TODO
    //   url: '../remind/remind?id='+id,
    // })
  },

  /**
   * 更新单词状态
   */
  onLoad: function (options) {
    db.collection("reviewList").watch({
      onChange:res=>{
        console.log('res',res)
      },
      onError:err=>{
        console.log('err',err)
      }
    })
  },

  // 渲染数据
  onShow: function () {
    let THIS = this
    db.collection('reviewList').get().then(res => {
      THIS.setData({
        DataList:res.data
      })
    })
  },

})