//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    messages: [] //消息列表
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
      url: wx.getStorageSync('domain') + '/api/user/messages',
      method: 'GET'
    }).then(res => {
      that.setData({
        messages: res.messages
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  chatwe: function(e) {
    console.log('======与绑定的业务员聊天======')
    wx.navigateTo({
      url: '../user/chating?user=' + e.currentTarget.dataset.user,
    })
  },

  //在线沟通服务提醒
  getNumSuccess: function (e) {
    var arr = [];
    arr.push(e.detail.formId)
    $.http({
      url: wx.getStorageSync('domain') + '/api/WXreply/setButtKey',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('myuserId'),
        buttKeyList: arr
      }
    }).then(res => {
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