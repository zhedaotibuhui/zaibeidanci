
const db = wx.cloud.database()
let myaudio;

// pages/BookDetail/bookDetael.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    words:"",
  },

  remove:function(e){
    let id = e.target.dataset.val;
    wx.showLoading({
      title: '数据加载中...',
      mask:true
    })             
    db.collection('wordlist').where({
      _id:id
    }).remove().then(e=>{
      console.log(e)
      wx.hideLoading({})
    }) 
    wx.navigateBack()

  },


  read:function(e){
    myaudio= wx.createInnerAudioContext({
      useWebAudioImplement: true
    });
    var that = this
    
    db.collection('wordlist').doc(this.id).get().then(res=>{
      this.setData({
        word:res.data.content        
      }) 
      // console.log('word1',that.data.word)
      myaudio.src = 'https://dict.youdao.com/dictvoice?audio='+that.data.word+'&type=2'
      myaudio.play();
    })
  },

  
  audio: function(){
    // const {word} = this.data
    db.collection('wordlist').doc(this.id).get().then(res=>{
      // console.log('res',res.data.content)
      this.setData({
        word:res.data.content        
      }) 
      var That = this
      wx.navigateTo({
        url: '/pages/wordBook/video/video?word=' + That.data.word,
      })
      // console.log('word2',That.data.word)
    })
    
  },

  back:function(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.id = options.id;
    // console.log(options)

    db.collection('wordlist').where({
      _id:this.id,
    }).watch({
      onChange:res=>{
        // console.log('e',res)
        this.setData({
          words:res.docs
        })
      },
      onError: function(err) {
        console.error(err)
      },
    })
    // console.log(ids)
    db.collection('wordlist').doc(this.id).get().then(res=>{
      // console.log('res',res)
      myaudio= wx.createInnerAudioContext({
      useWebAudioImplement: true
      });
      myaudio.src = 'https://dict.youdao.com/dictvoice?audio='+res.data.content+'&type=2'

      myaudio.play();
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