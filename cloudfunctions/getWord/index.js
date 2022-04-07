// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'zbdc-6gavbhj633c62e27'
})
const db = cloud.database()
exports.main = async (event, context) => {
  //根据接收的m,n值，查询数据
  if (event.type == 'cet4') {
    let res = await db.collection('CET4').skip(event.m).limit(event.n).get()
    return res.data
  } else if (event.type == 'cet6') {
    let res = await db.collection('CET4_6').skip(event.m).limit(event.n).get()
    return res.data
  } else if (event.type == 'searchword') {
    return await db.collection('CET4').where({
      content: event.searchword
    }).get()
  } else if (event.type == 'queryWordByRandom') {
    let a = parseInt(Math.random() * 5)
    let res = await db.collection('reviewList')
      .aggregate()
      .skip(a)
      .limit(1)
      .lookup({
        from: 'CET4',
        localField: 'content',
        foreignField: 'content',
        as: 'detail'
      }).end()
    return res.list[0].detail[0]
  } else if (event.type == 'getBooksList') {
    // 返回所有书籍和每本的单词数量
    let res = await db.collection('books').get()
    for (let i = 0; i < res.data.length; i++) {
      if (res.data[i].type == 'cet4') {
        let count = await db.collection('CET4').count()
        res.data[i].total = count.total
      } else if (res.data[i].type == 'cet6') {
        let count = await db.collection('CET4_6').count()
        res.data[i].total = count.total
      }
    }
    return res
  }
}