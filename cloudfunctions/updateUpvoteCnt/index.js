// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;

  return db.collection("photo_collection").doc(event.curRecordId).update({
    data: {
      upvoteCnt: _.inc(1)
    },
    success: function (res) {
      console.log(res);
    },
    fail: function (err) {
      console.log(err);
    }
  })
}