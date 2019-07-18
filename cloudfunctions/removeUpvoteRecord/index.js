// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _  = db.command;

  try {
    return await db.collection('upvote_collection').where({
      recordid: event.curRecordId
    }).remove()
  } catch(e) {
    console.log(e);
  }
}