// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: 'zbdc-6gavbhj633c62e27'
  })
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    return await db.collection('reviewList').aggregate()
    .match({
        _id:event.id,
    })
    .lookup({
        from:'CET4',
        localField: 'content',
        foreignField: 'content',
        as: 'word'
    })
    .lookup({
        from:'CET4_6',
        localField: 'content',
        foreignField: 'content',
        as: 'wordTwo'
    })
    .end()

}