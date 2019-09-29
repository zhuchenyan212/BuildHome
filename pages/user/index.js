//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    phone: '',
    userEntity: '', //用户信息
    unReadMessageCount: '', //未读消息
    identity: wx.getStorageSync('identity'), //用户身份1为普通 2为业务员
    salesman: wx.getStorageSync('salesman') //业务员
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/indexPage',
      method: 'GET'
    }).then(res => {
      console.log(res)
      that.setData({
        userEntity: res.userEntity,
        unReadMessageCount: res.unReadMessageCount,
        phone: res.userEntity.mobile
      })
      // 缓存用户信息
      wx.setStorageSync('identity', res.userEntity.identity);
      wx.setStorageSync('salesman', res.userEntity.salesman);
      wx.setStorageSync('myuserId', res.userEntity.userId);
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  showInfo: function() {
    wx.navigateTo({
      url: '../user/infoList',
    })
  },

  blur: function(e) {
    console.log(e.detail.value)
    var that = this,
      phoneReg = /^(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})$/;
    if (phoneReg.test(e.detail.value)) {
      //请求服务器
      $.http({
        url: wx.getStorageSync('domain') + '/api/PersonCard/card?mobile=' + e.detail.value,
        method: 'PUT'
      }).then(res => {
        console.log(res)
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000,
        })
      }).catch(err => {
        wx.showToast({
          title: '请求失败请稍候',
          icon: 'none',
          duration: 2000,
        })
      })
    }
  },

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
            wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
            wx.showToast({
              title: '获取用户token成功',
              icon: 'success',
              duration: 2000,
            })
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候',
              icon: 'none',
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