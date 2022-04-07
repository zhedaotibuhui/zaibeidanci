
const db = wx.cloud.database()
var opid = wx.getStorageSync('openid')


// pages/wordBook/wordBook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 单词详情
   */

  transfer(e){
    var id=e.target.dataset.val;
    
    wx.navigateTo({
      url: '../wordBook/bookDetail/bookDetail?id='+id,
    })

  },

  /**
   * 更新单词状态
   */

  
  getData(){
    db.collection("wordlist")
    .get()
    .then(res=>{
      dataArr:res.data
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    db.collection("wordlist").watch({
      onChange:res=>{
        console.log(res)
      },
      onError:err=>{
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  
  onShow: function () {
    let THIS = this
    db.collection('wordlist').where({
      _openid:opid
    }).get().then(res => {
      THIS.setData({
        DataList:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})