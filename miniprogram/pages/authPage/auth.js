// miniprogram/pages/authPage/authPage.js
// var handleLogin = require("handleLogin.js");

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

  onGotUserInfo: function (e) {
    if (e.detail.userInfo) {
      // 用户允许授权
      app.globalData.userInfo = e.detail.userInfo;
      // 登陆，并获取openID
      wx.login({
        success(res) {
          if (res.code) {
            // 使用云函数login获取openid
            wx.cloud.callFunction({
              name: 'login',
              data: {},
              success: res => {
                app.globalData.openID = res.result.openid;
                wx.redirectTo({
                  url: '../mainPage/mainPage',
                })
              },
              fail: err => {
                console.error('[云函数] [login] 调用失败', err)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg);
          }
        }
      })
    } else {
      // 用户拒绝授权
      // do something...
      console.log('permission denied');
    }
  }
})