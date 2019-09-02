//获取应用实例
var $ = require("../../utils/http.js");
var WxParse = require('../wxParse/wxParse.js');
Page({

  data: {
    domain: wx.getStorageSync('domain'),
    swiper: [
      ["/images/a1.png"],
      ["/images/a1.png"],
      ["/images/a1.png"],
      ["/images/a1.png"]
    ],
    jgjCaseEntity: {}
  },

  onLoad: function(options) {
    console.log(options.id)
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/cases/' + options.id,
      method: 'GET'
    }).then(res => {
      console.log(res)
      that.setData({
        jgjCaseEntity: res.jgjCaseEntity
      })
      if (res.jgjCaseEntity.detail != null) {
        WxParse.wxParse('article', 'html', res.jgjCaseEntity.detail, that, 5);
      }
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  // saveInfo: function(e) {
  //   var that = this,
  //     phoneReg = /^(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})$/;
  //   console.log(e.detail.value)
  //   if (e.detail.value.username == '') {
  //     wx.showToast({
  //       title: '请输入姓名',
  //       icon: 'none',
  //       duration: 1500
  //     })
  //     return false;
  //   } else if (e.detail.value.phone == '') {
  //     wx.showToast({
  //       title: '请输入手机号码',
  //       icon: 'none',
  //       duration: 1500
  //     })
  //     return false;
  //   } else if (!phoneReg.test(e.detail.value.phone)) {
  //     wx.showToast({
  //       title: '手机号码输入有误',
  //       icon: 'none',
  //       duration: 1500
  //     })
  //     return false;
  //   } else {
  //     //请求服务器
  //     $.http({
  //       url: wx.getStorageSync('domain') + '/api/index/activities',
  //       method: 'POST',
  //       data: {
  //         userName: e.detail.value.username,
  //         mobile: e.detail.value.phone,
  //         jgjActivityId: that.data.id
  //       }
  //     }).then(res => {
  //       wx.showToast({
  //         title: '信息提交成功',
  //         icon: 'success',
  //         duration: 1500,
  //       })
  //       //表单提交以后刷新当前页面
  //       setTimeout(() => {
  //         wx.redirectTo({
  //           url: '../index/index'
  //         })
  //       }, 2000);
  //     }).catch(err => {
  //       wx.showToast({
  //         title: '请求失败请稍候',
  //         icon: 'none',
  //         duration: 2000,
  //       })
  //     })
  //   }
  // },

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