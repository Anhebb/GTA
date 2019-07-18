// miniprogram/pages/mainPage/mainPage.js
const db = wx.cloud.database({env: 'core-i9-ra3al'});

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allUserPhoto: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('photo_collection').orderBy('uploadDate', 'desc').get().then(res => {
      // 获取全部记录成功
      this.setData({
        allUserPhoto: res.data,
      })
      for (var i = 0; i < this.data.allUserPhoto.length; i++) {
        if (this.data.allUserPhoto[i]._openid == app.globalData.openID) {
          this.data.allUserPhoto[i].isDisplay = true;
          let str = "allUserPhoto[" + i + "].isDisplay";
          this.setData({
            [str]: true
          })
        } else {
          this.data.allUserPhoto[i].isDisplay = false;
          let str = "allUserPhoto[" + i + "].isDisplay";
          this.setData({
            [str]: false
          })
        }
      }
    }).catch(err => {
      // 获取全部记录失败
      console.log(err);
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
    this.onLoad();
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
  
    db.collection('photo_collection').orderBy('uploadDate', 'desc').get().then(res => {
      // 获取全部记录成功
          this.setData({
            allUserPhoto: res.data
      })
      for (var i = 0; i < this.data.allUserPhoto.length; i++) {
        if (this.data.allUserPhoto[i]._openid == app.globalData.openID) {
          this.data.allUserPhoto[i].isDisplay = true;
          let str = "allUserPhoto[" + i + "].isDisplay";
          this.setData({
            [str]: true
          })
        } else {
          this.data.allUserPhoto[i].isDisplay = false;
          let str = "allUserPhoto[" + i + "].isDisplay";
          this.setData({
            [str]: false
          })
        }
      }
    }).catch(err => {
      // 获取全部记录失败
      console.log(err);
    })
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
  
  updata: function(){
      console.log("点击事件")
      wx.navigateTo({
        url: '../uploadImagePage/uploadImage',
      })
    }
})