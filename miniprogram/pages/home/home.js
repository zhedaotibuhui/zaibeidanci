// pages/home/home.js
const db = wx.cloud.database()
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo : {},
    hasUserInfo:false,
    newWordsNum: 0,
    oldWordsNum: 0,
    unstudyWordsNum: 0,
  },

  toReview:function(){
    wx.navigateTo({
      url: '/pages/review/review',
    })
  },

  status:function(){
    wx.navigateTo({
      url: '../status/status',
    })
  },


  wordList(res){
    var id = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/wordBook/wordBook?id="+id,
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    db.collection("wordlist").count().then(res=>{
      // console.log('res',res.total)
      this.setData({

        count:res.total
      })
    }),

    db.collection("reviewList").count().then(res=>{
      // console.log('res',res.total)
      this.setData({
        newWordsNum:res.total
      })
      
      let reviewCnt = this.data.newWordsNum;
      console.log('cnt',reviewCnt)
      wx.setStorageSync('reviewCnt', {
        reviewCnt
      })
    })
    

  },
    /**
   * 用户注销
   */
  onClickOut:function(){
    app.delUserInfo();
    this.setData({
      userInfo:null
  })
  },

  // 点击登录授权获取头像、昵称
  async getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', 
      success: (e) => { // 授权成功调用云函数获取OPENDID
        console.log(e.userInfo)
        this.setData({
          userInfo : e.userInfo, // 展示头像、昵称
          hasUserInfo : true
        })
        wx.cloud.callFunction({ // 用户进入缓存已经存入OPNEID
          name: 'userinfo',
        }).then(res => {
          let that = this
          let OPENID = res.result.OPENID
          console.log('云函数', OPENID) //res就将appid和openid返回了
          wx.setStorageSync('userInfo', 
          {
            openid:OPENID,
            userInfo:{
              avatarUrl:that.data.userInfo.avatarUrl,
              nickName:that.data.userInfo.nickName
            }
          })
        })
      }
    })
  },

  // 我的页面
  async onLoad (options){
    let userInfo = await wx.getStorageSync('userInfo')
    console.log('登录模块的OPENID',userInfo.OPENID)
    if (userInfo) {
      this.setData({
        userInfo: userInfo.userInfo,
        hasUserInfo:true
      })   
    }else{ // 没有缓存用户昵称和头像就弹出登录请求
      this.setData({
        hasUserInfo:false
      })
    }
  },

})