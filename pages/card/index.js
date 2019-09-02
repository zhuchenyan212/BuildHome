//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    domain: wx.getStorageSync('domain'),
    identity: wx.getStorageSync('identity'),
    userEntity: '', //名片
    decoration: '', //装修案例
    constructionSite: '', //装修工地
    active: '' //活动广告
  },


  onLoad: function() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  onShow: function() {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/indexPage',
      method: 'GET'
    }).then(res => {
      console.log(res)
      that.setData({
        identity: wx.getStorageSync('identity'),
        userEntity: res.userEntity,
        decoration: res.decoration,
        constructionSite: res.constructionSite,
        active: res.activityEntities
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  edit: function() {
    wx.navigateTo({
      url: '../card/Edit',
    })
  },

  chatWei: function() {
    //是否绑定业务员
    console.log('======绑定的业务员聊天======')
  },

  //一键拨打客服电话
  fixedNum: function() {
    var num = wx.getStorageSync("telephone")
    wx.makePhoneCall({
      phoneNumber: num,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
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