// miniprogram/pages/indexPage/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
            }
          })
          // 从本地缓存获取openid
          try {
            // 使用云函数getOpenId获取用户的OpenId
            wx.cloud.callFunction({
              name: 'getOpenId'
            })
            .then(res => {
              // 执行云函数成功
              app.globalData.openID = res.result.openid;
            })
            .catch(err => {
              // 执行云函数出错
              console.log(err);
            })
          } catch (e) {
            // Do something when catch error
            console.log(e);
          }
          wx.redirectTo({
            // 已授权
            url: '../mainPage/mainPage',
          })
        }
        else {
          // 未授权
          wx.redirectTo({
            url: '../authPage/auth',
          })
        }
      }
    })
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

  }
})