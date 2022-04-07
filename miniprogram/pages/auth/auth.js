var app = getApp();
// pages/auth/auth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"15517603760",
    code:""
  },

  bindPhoneInput:function(e){
    this.setData({phone: e.detail.value});
  },
  bindCodeInput:function(e){
    this.setData({code: e.detail.value});
  },
  onClickSubmit:function(e){
    e.detail.userInfo
    wx.request({
      url: 'http://192.168.137.1:8000/api/login/',
      data: {phone:this.data.phone, code:this.data.code},
      method: 'POST',   
      dataType: 'json', 
 
      success: function (res){
        if(res.data.status){
          
          // var pages = getCurrentPages();
          // prePage = pages[pages.length-2]
          // 跳转到上一级页面
          // 初始化用户信息

            app.initUserInfo(res.data.data, e.detail.userInfo);

          wx.navigateBack({});
          // console.log(pages);
        }else{
          wx.showToast({
            title: "登录失败",icon:'none',
          })
        }
      
      },

    })
  },


  onClickCheckCode:function(e){
    if (this.data.phone.length == 0){
    
    wx.showToast({
      title: '请填写手机号',
      icon: 'error',
    })
    return;
  };

    // 正则匹配
    var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!reg.test(this.data.phone)){
    
      wx.showToast({
        title: '手机格式错误',
        icon: 'error',
      })
      return;
    }

    // 申请验证码
    wx.request({
      url: 'http://192.168.137.1:8000/api/message/',
      data: {phone:this.data.phone},
      method: 'GET',   
      dataType: 'json', 
 
      success: function (res){
        if(res.data.status){
          wx.showToast({
            title: res.data.message,icon:'none',
          })
        }else{
          wx.showToast({
            title: res.data.message,icon:'none',
          })
        }
      },
      fail:function(res){
        console.log(res)
      },
    })
  },

     /**
   * 此登录模式不推荐
   */
  onClickLogin:function(e){
    wx.request({
      url: 'http://192.168.137.1:8000/api/login/',
      data: {phone:this.data.phone, code:this.data.code},
      method: 'POST',   
      dataType: 'json', 
 
      success: function (res){
        if(res.data.status){
          app.initUserInfo(res.data.data)
          
          // var pages = getCurrentPages();
          // prePage = pages[pages.length-2]
          // 跳转到上一级页面
          // 初始化用户信息
          wx.getUserProfile({
            desc: 'desc',
            success:function(local){
              // console.log(local);
              app.initUserInfo(res.data.data, local.userInfo);
            },
          })
          wx.navigateBack({});
          // console.log(pages);
        }else{
          wx.showToast({
            title: "登录失败",icon:'none',
          })
        }
      
      },

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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