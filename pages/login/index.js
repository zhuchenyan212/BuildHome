var $ = require("../../utils/http.js");
Page({
  data: {
    domain: wx.getStorageSync('domain'), //网址根目录
  },

  onLoad: function() {},

  // 获取用户信息登录
  getInfo: function(e) {
    console.log(e.detail.userInfo)
    wx.login({
      success: res => {
        console.log(res)
        if (res.errMsg == "login:ok") {
          //请求服务器
          $.http({
            url: wx.getStorageSync('domain') + '/api/index/login',
            method: 'GET',
            data: {
              code: res.code,
              nickName: e.detail.userInfo.nickName,
              avatarUrl: e.detail.userInfo.avatarUrl,
            },
          }).then(res => {
            console.log('=====获取到用户的token========');
            console.log(res)
            // 缓存后台返回的用户token
            wx.setStorageSync('user', res.token);
            wx.reLaunch({
              url: "../index/index"
            })
          }).catch(err => {
            wx.showToast({
              title: err,
              icon: 'fail',
              duration: 2000,
            })
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})