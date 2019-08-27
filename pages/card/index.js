//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    domain: wx.getStorageSync('domain'),
    userEntity: '', //名片
    decoration: '', //装修案例
    constructionSite: '' //装修工地
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/indexPage',
      method: 'GET'
    }).then(res => {
      console.log(res)
      that.setData({
        userEntity: res.userEntity,
        decoration: res.decoration,
        constructionSite: res.constructionSite,
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'fail',
        duration: 2000,
      })
    })
  },

  Edit: function() {
    wx.navigateTo({
      url: '../card/Edit',
    })
  },

  chatWei: function () {
    //是否绑定业务员
    console.log('======绑定的业务员聊天======')
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