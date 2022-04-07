const myaudio = wx.createInnerAudioContext();
const db = wx.cloud.database()
const _ = db.command
Page({
 
  data: {
    isplay: false,//是否播放
  },
  onShow: function () {
  },
  //播放
  play: function () {
    myaudio.play();
    console.log(myaudio.duration);
    this.setData({ isplay: true });
  },
  // 停止
  stop: function () {
    myaudio.pause();
    this.setData({ isplay: false });
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var word = options.word
      console.log(word)
      db.collection('video').where({
        content:word,
      }).get().then(res=>{
        console.log(res)
        if ((res.data).length>0 && res.data[0].hasOwnProperty("address")){
          myaudio.src = res.data[0].address
        }else{
          wx.showModal({
            cancelColor: 'cancelColor',
            title:'提示',
            content:'未查询到此单词音频',
            showCancel:false,
            success (res) {
              if (res.confirm) {
                wx.navigateBack()
              } 
            }
          })

        }
        
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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