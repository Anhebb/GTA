// components/showpage/showpage.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    allUserPhoto: {
      type: Array,
      value: [],
    },
    fileIDs: { // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [
    ], // 属性初始值（可选），如果未定则会根据类型选择一个
    },
    nickName: { // 属性名
      type: String,
      value: ''
    },
    avatarUrl: { // 属性名
      type: String,
      value: ''
    },
    uploadDate: { // 属性名
      type: String,
      value: ''
    },
    recordid: {
      type: String,
      value: ''
    },
    num: {
      type: Number,
      value: 0
    },
    isDisplay: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    preview:function(event) {
      var src = event.currentTarget.dataset.src;//获取data-src
      wx.previewImage({
        current: src, 
        urls: this.properties.fileIDs,
      })
    },

    handleUpvote: function(event) {
      let curRecordId_ = event.currentTarget.dataset.recordid;
      let curUserOpenId_ = app.globalData.openID;
      let upvotePeoples_ = [];
      let cnt = 0;
      const db = wx.cloud.database();

      db.collection("upvote_collection").where({
        recordid: curRecordId_
      }).get().then(res => {
        console.log(res.data);
        if (res.data.length > 0) {
          // 找到对应的点赞记录
          upvotePeoples_ = res.data[0].upvotepeople;
          if (upvotePeoples_.indexOf(curUserOpenId_) > -1) {
            // 若该用户已经点赞
            // 显示消息提醒
            wx.showToast({
              icon: 'none',
              title: '你已经点过赞了',
            });
            cnt = upvotePeoples_.length;
          } else {
            // 若该用户未点赞
            // 调用云函数将该用户加入点赞名单
            wx.cloud.callFunction({
              name: 'addUpvotePeople',
              data: {
                id: res.data[0]._id,
                curUserOpenId: curUserOpenId_
              }
            }).then(r => {
              console.log(r.result);
            }).catch(e => {
              console.log(e);
            });
            // 调用云函数更新点赞数
            wx.cloud.callFunction({
              name: 'updateUpvoteCnt',
              data: {
                curRecordId: curRecordId_
              }
            }).then(r => {
              console.log(r.result);
            }).catch(e => {
              console.log(e);
            });
            cnt = upvotePeoples_.length + 1;
            wx.showToast({
              icon: 'none',
              title: '点赞成功',
            });
          }
        } else {
          // 未找到对应的点赞记录
          upvotePeoples_.push(curUserOpenId_);
          // 调用云函数添加点赞记录
          wx.cloud.callFunction({
            name: 'addUpvoteRecord',
            data: {
              curRecordId: curRecordId_,
              upvotePeoples: upvotePeoples_
            }
          })
          .then(r => {
            console.log(r.result);
          })
          .catch(e => {
            console.log(e);
          });
          // 调用云函数修改点赞数
          wx.cloud.callFunction({
            name: 'updateUpvoteCnt',
            data: {
              curRecordId: curRecordId_
            }
          })
          .then(r => {
              console.log(r.result);
          })
          .catch(e => {
              console.log(e);
          });
          cnt = 1;
          wx.showToast({
            icon: 'none',
            title: '点赞成功',
          });
        }
        // 更新视图层点赞数
        this.setData({
          "num": cnt
        })
      }).catch(err => {
        console.log(err);
      })
    },

    handleDelete: function (event) {
      // 获取当前记录的id
      let curRecordId_ = event.currentTarget.dataset.recordid;
      let curRecordFileIds_ = [];
      const db = wx.cloud.database();

      // 根据当前记录的id获取该记录的文件列表
      db.collection('photo_collection').doc(curRecordId_).get({
        success: function(res) {
          // 获取该记录的文件列表（即对应的照片）
          curRecordFileIds_ = curRecordFileIds_.concat(res.data.fileIDs);
          console.log(curRecordFileIds_);
          // 将该记录删除
          db.collection('photo_collection').doc(curRecordId_).remove({
            success: function(r) {
              console.log(r);
              wx.redirectTo({
                url: '../../pages/mainPage/mainPage',
              })
            },
            fail: function(e) {
              console.log(e);
            }
          })
          // 将对应的文件（照片）删除
          wx.cloud.deleteFile({
            fileList: curRecordFileIds_,
            success: r => {
              console.log(r.fileList);
            },
            fail: e => {
              console.log(e);
            }
          })
          // 调用云函数删除对应的点赞记录
          wx.cloud.callFunction({
            name: 'removeUpvoteRecord',
            data: {
              curRecordId: curRecordId_
            },
            success: r => {
              console.log(r);
            },
            fail: e => {
              console.log(e);
            }
          })
          wx.showToast({
            icon: 'none',
            title: '删除成功',
          });
        },
        fail: function(err) {
          console.log(err);
        }
      });
      console.log(curRecordFileIds_);
    }
  }
})
