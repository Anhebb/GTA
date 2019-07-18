// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();

  return db.collection("upvote_collection").add({
    data: {
      recordid: event.curRecordId,
      upvotepeople: event.upvotePeoples
    },
    success: function(res) {
      console.log(res);
    },
    fail: function(err) {
      console.log(err);
    }
  })
}