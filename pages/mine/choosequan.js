var $ = require("../../utils/http.js");
Page({

  data: {
    couponList: [] //优惠券数据
  },

  onLoad: function () {

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
    var that = this
    //请求服务器可用
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/usersCoupons',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('myuserId'),
        type: 0
      }
    }).then(res => {
      that.setData({
        couponList: res.jgjUsersCouponEntities
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  choosequan: function (e) {
    var that = this;
    for (var i = 0; i < that.data.couponList.length; i++) {
      if (that.data.couponList[i].id === e.currentTarget.dataset.id) {
        //获取优惠券选中数据存入缓存
        wx.setStorageSync('coupon', that.data.couponList[i]);
        if (wx.getStorageSync('coupon') != '' || wx.getStorageSync('coupon') != null || wx.getStorageSync('coupon') != undefined) {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000);
        }
      }
    }
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

  }
})