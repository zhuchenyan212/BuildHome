//获取应用实例
var $ = require("../../utils/http.js");
var WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  saveInfo: function(e) {
    var that = this,
      phoneReg = /^(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})$/;
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (e.detail.value.mobile == '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!phoneReg.test(e.detail.value.mobile)) {
      wx.showToast({
        title: '手机号码输入有误',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (e.detail.value.area == '') {
      wx.showToast({
        title: '请输入意向城市',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else {
      //请求服务器
      $.http({
        url: wx.getStorageSync('domain') + '/api/user/cooperations?name=' + e.detail.value.name + '&mobile=' + e.detail.value.mobile + '&city=' + e.detail.value.area + '&type=1',
        method: 'POST'
      }).then(res => {
        wx.showToast({
          title: '信息提交成功',
          icon: 'success',
          duration: 1500,
        })
        //表单提交以后刷新当前页面
        setTimeout(() => {
          wx.switchTab({
            url: '../user/index'
          })
        }, 1500);
      }).catch(err => {
        wx.showToast({
          title: '请求失败请稍候',
          icon: 'none',
          duration: 2000,
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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
      url: wx.getStorageSync('domain') + '/api/user/getCooperationIMG',
      method: 'GET'
    }).then(res => {
      WxParse.wxParse('article', 'html', res.data.businessman, that, 5);
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
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