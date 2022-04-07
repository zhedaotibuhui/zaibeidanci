// app.js
App({
  async onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'zbdc-6gavbhj633c62e27',
        traceUser: true,
      });
    }

  //   if (wx.getStorageSync('userInfo')) {
  //     wx.reLaunch({
  //         url: 'pages/show/show'
  //     })
  // } else {
  //     wx.reLaunch({
  //         url: 'pages/home/home'
  //     })
  // }
  },

  globalData: {
    userInfo: null
  },


  delUserInfo: function () {
    this.globalData.userInfo = null;
    wx.removeStorageSync('userInfo')
  },

})