//获取应用实例
var $ = require("../../utils/http.js");
var WxParse = require('../wxParse/wxParse.js');
Page({
  data: {
    domain: wx.getStorageSync('domain'),
    id: '', //活动id
    jgjActivity: '', //活动页面数据
    count: '', //参与人数
    jgjTakePartInEntities: '' //滚动消息
  },

  onLoad: function(options) {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/index/activities/' + options.id,
      method: 'GET'
    }).then(res => {
      that.setData({
        id: options.id,
        count: res.count,
        jgjActivity: res.jgjActivity,
        jgjTakePartInEntities: res.jgjTakePartInEntities
      })
      wx.setNavigationBarTitle({
        //调整页面标题显示
        title: res.jgjActivity.name
      })
      if (res.jgjActivity.detail != null) {
        WxParse.wxParse('article', 'html', res.jgjActivity.detail, that, 5);
      }
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  saveInfo: function(e) {
    var that = this,
      phoneReg = /^(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})$/;
    if (e.detail.value.username == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (e.detail.value.phone == '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!phoneReg.test(e.detail.value.phone)) {
      wx.showToast({
        title: '手机号码输入有误',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else {
      //请求服务器
      $.http({
        url: wx.getStorageSync('domain') + '/api/index/addactivities?jgjActivityId=' + that.data.id + '&mobile=' + e.detail.value.phone + '&userName=' + e.detail.value.username + '&userId=' + wx.getStorageSync('myuserId'),
        method: 'POST'
      }).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '信息提交成功',
            icon: 'success',
            duration: 1500,
          })
          //表单提交以后刷新当前页面
          setTimeout(() => {
            wx.switchTab({
              url: '../index/index'
            })
          }, 2000);
        }
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