const db = wx.cloud.database()
//获取应用实例
const app = getApp()
let task_Num = 0

Page({
  data: {
    showNot: true,
    selectedDate: '', //选中的几月几号
    selectedWeek: '', //选中的星期几
    curYear: 2017, //当前年份
    curMonth: 0, //当前月份
    daysCountArr: [ // 保存各个月份的长度，平年
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ],
    weekArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    todayHasRecord: false, // 今日是否已打卡，默认未打卡
    // 是否动画延迟
    delay: false,
    today: new Date()
  },
  // 初次进入页面时，需要获取本月数据情况
  async onLoad(options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.optionsNum) {
      task_Num = options.optionsNum
    }
    // 计算今日数据
    var today = new Date(); //当前时间  
    var y = today.getFullYear(); //年  
    var mon = today.getMonth() + 1; //月  
    var d = today.getDate(); //日  
    var i = today.getDay(); //星期  
    this.setData({
      curYear: y,
      curMonth: mon,
      selectedDate: y + '-' + mon + '-' + d,
      selectedWeek: this.data.weekArr[i]
    });
    // 根据以上计算值，获取主要数据，并循环出今日的打卡记录。
    let todayData = await this.main(y, mon)
    for (let i = 0; i < todayData.length; i++) {
      for (let j = 0; j < todayData[i].length; j++) {
        if (todayData[i][j].date == d && todayData[i][j].hasRecord) {
          this.setData({
            todayHasRecord: true
          })
          return
        }
      }
    }
  },

  /** 打卡*/
  async accord() {
    if (task_Num) {
      let today = new Date()
      let y = today.getFullYear(),
        m = today.getMonth() + 1,
        d = today.getDate()
      wx.showLoading({
        title: '打卡中',
        mask: true
      })
      let res = await db.collection('calendar').add({
        data: {
          year: y,
          month: m,
          date: d
        }
      })
      wx.hideLoading()
      console.log(res)
      if (res._id) {
        wx.showToast({
          title: '打卡成功',
          icon: 'success' // 默认success，可不写
        })
        this.setData({
          showNot: false,
          hasFinished: !this.data.hasFinished,
          todayHasRecord: true
        })
      } else {
        wx.showToast({
          title: '打卡出错',
          icon: 'error'
        })
      }
    } else {
      wx.showToast({
        title: '未完成今天任务',
        icon: 'error'
      })
    }
  },
  // 已打卡
  hasRecord() {
    wx.showToast({
      title: '你今日已打卡',
      icon: 'error'
    })
  },
  selectDate: function (e) {
    // console.log('选中', e.currentTarget.dataset.date.value);
    this.setData({
      selectedDate: e.currentTarget.dataset.date.value,
      selectedWeek: this.data.weekArr[e.currentTarget.dataset.date.week]
    });

  },
  // 首先计算上月日期数据
  preMonth: function () {
    // 上个月
    var curYear = this.data.curYear;
    var curMonth = this.data.curMonth;
    curYear = curMonth - 1 ? curYear : curYear - 1;
    curMonth = curMonth - 1 ? curMonth - 1 : 12;
    // console.log('上个月', curYear, curMonth);
    this.setData({
      curYear: curYear,
      curMonth: curMonth
    });
    // 然后根据计算出的日期数据，获取主要数据
    this.main(curYear, curMonth);
  },
  // 先计算下月日期数据
  nextMonth: function () {
    // 下个月
    var curYear = this.data.curYear;
    var curMonth = this.data.curMonth;
    curYear = curMonth + 1 == 13 ? curYear + 1 : curYear;
    curMonth = curMonth + 1 == 13 ? 1 : curMonth + 1;
    // console.log('下个月', curYear, curMonth);
    this.setData({
      curYear: curYear,
      curMonth: curMonth
    });
    // 然后根据计算出的结果，获取主要数据
    this.main(curYear, curMonth);
  },
  // 初次进入页面、点击上个月、点击下个月，均会执行main()方法
  async main(year, month) {
    // 根据当前年月，获取日期分布情况
    let res = this.getDateList(year, month - 1);
    console.log('获取日期分布情况', res)
    // 根据当前年月，获取打卡记录
    let msg = await this.getRecordByYM(year, month)
    console.log(`${year}年${month}月打卡记录：`, msg.data)
    // 开始处理数据，对打卡记录中的日期与当月日期匹配，存在打卡记录，则给当日日期添加新字段hasRecord，表示已打卡
    res.forEach(item => {
      item.forEach(it => {
        msg.data.forEach(list => {
          if (list.date == it.date) {
            it.hasRecord = true
          }
        })
      })
    });
    // 渲染数据
    this.setData({
      dateList: res
    });
    return res
  },
  // 根据年月获取当月日期分布情况
  getDateList(y, mon) {
    //如果是否闰年，则2月是29日
    var daysCountArr = this.data.daysCountArr;
    if (y % 4 == 0 && y % 100 != 0) {
      // this.data.daysCountArr[1] = 29;
      daysCountArr[1] = 29;
      this.setData({
        daysCountArr: daysCountArr
      });
    }
    //第几个月；下标从0开始实际月份还要再+1  
    var dateList = [];
    // console.log('本月', this.data.daysCountArr[mon], '天');
    dateList[0] = [];
    var weekIndex = 0; //第几个星期
    for (var i = 0; i < this.data.daysCountArr[mon]; i++) {
      var week = new Date(y, mon, (i + 1)).getDay();
      //   console.log(week)
      // 如果是新的一周，则新增一周
      if (week == 0) {
        weekIndex++;
        dateList[weekIndex] = [];
      }
      // 如果是第一行，则将该行日期倒序，以便配合样式居右显示
      if (weekIndex == 0) {
        dateList[weekIndex].unshift({
          value: y + '-' + (mon + 1) + '-' + (i + 1),
          date: i + 1,
          week: week
        });
      } else {
        dateList[weekIndex].push({
          value: y + '-' + (mon + 1) + '-' + (i + 1),
          date: i + 1,
          week: week
        });
      }
    }
    return dateList
  },
  // 根据年月查询当月打卡记录情况
  async getRecordByYM(year, month) {
    return await db.collection('calendar').where({
      year: year,
      month: month
    }).get()
  },
})