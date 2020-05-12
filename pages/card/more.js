//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    casesList: '' //案例列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //案例详情
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/casesList/' + options.type,
      method: 'GET'
    }).then(res => {
      that.setData({
        casesList: res.CasesList
      })
    }).catch(err => {
      console.log('请求失败请稍候')
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