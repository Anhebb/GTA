// miniprogram/pages/newindex/newindex.js
var util = require('../../libs/utils/util.js');
const app = getApp();

Page({

  data: {
    userInfo: {
      avatarUrl: ['../../images/uploadImagePage/userphoto.png'],
      nickName: '麦克'
    },
    loginTime: '1999.01.01 00:00:00'
  },

  //预览图片
  previewImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.userInfo.avatarUrl;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) {
      },
      fail: function (res) {
      },
      complete: function (res) {
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'userInfo.nickName': app.globalData.userInfo.nickName,
      'loginTime': util.formatTime(new Date()),
      'userInfo.avatarUrl': [app.globalData.userInfo.avatarUrl]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  uploadPhoto: function (filePaths, userInfo) {
    let total = filePaths.length;
    let uploadTime = util.formatTime(new Date());
    let fileIds = [];
    const db = wx.cloud.database();
    Promise.all(filePaths.map((item) => {
      return wx.cloud.uploadFile({
        cloudPath: 'uploadPhoto/' + Date.now() + item.match(/\.[^.]+?$/)[0], // 文件名称 
        filePath: item,
      })
    })).then((res) => {
      // 照片上传成功
      // 获取图片的文件id
      res.map((item) => {
        fileIds.push(item.fileID);
      })
      // 在数据库中添加记录
      db.collection('photo_collection').add({
        data: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          uploadDate: uploadTime,
          fileIDs: fileIds,
          totalNum: total,
          upvoteCnt: 0
        }
      }).then(r => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '照片上传成功',
        })
        setTimeout(function () { wx.navigateBack(); }, 500);
        console.log(r);
      }).catch((e) => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '照片上传失败',
        })
        console.log('[照片上传失败]: ', err);
      })
    }).catch((err) => {
      // 照片上传失败
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '照片上传失败',
      })
      console.log('[照片上传失败]: ', err);
    })
    console.log(fileIds);
  },

  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传图片中',
        })

        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);

        that.uploadPhoto(tempFilePaths, app.globalData.userInfo);
      },
    })
  }
})