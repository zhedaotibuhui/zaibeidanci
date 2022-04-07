// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'zbdc-6gavbhj633c62e27'
  })
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let res = await db.collection('CET4').aggregate()
    .match({
        _id:event.id,
        content:event.content
    })
    .lookup({
        from:'CET4_6',
        localField: 'content',
        foreignField: 'content',
        as: 'wordTwo'
    })
    .end()
    .then()
    .catch()
    return res
}