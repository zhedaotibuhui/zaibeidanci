// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'zbdc-6gavbhj633c62e27'
  })

// 云函数入口函数
exports.main = async (event, context) => {
    const{ APPID,OPENID}=cloud.getWXContext()
     return {
       APPID,
       OPENID
     }
}