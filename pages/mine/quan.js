var $ = require("../../utils/http.js");
Page({

  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    couponList: [] //优惠券数据
  },

  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    var that = this;
    if (e.detail.current == 0) {
      //请求服务器===========可使用
      that.getData()
    } else if (e.detail.current == 1) {
      //请求服务器===========已使用
      that.getdatao()
    } else if (e.detail.current == 2) {
      //请求服务器============已过期
      that.getdatad()
    }
  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  onLoad: function () {
    var that = this;
    that.getData()
  },

  //可使用
  getData: function () {
    var that = this;
    //请求可以使用的优惠券
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/usersCoupons',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('myuserId'),
        type: 0
      }
    }).then(res => {
      if (res.code == 0) {
        that.setData({
          couponList: res.jgjUsersCouponEntities,
          winHeight: res.jgjUsersCouponEntities.length
        })
      }
    }).catch(err => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    })
  },

  //已使用
  getdatao: function () {
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/usersCoupons',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('myuserId'),
        type: 1
      }
    }).then(res => {
      this.setData({
        couponList: res.jgjUsersCouponEntities,
        winHeight: res.jgjUsersCouponEntities.length
      })
    }).catch(err => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    })
  },

  //已过期
  getdatad: function () {
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/usersCoupons',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('myuserId'),
        type: 2
      }
    }).then(res => {
      this.setData({
        couponList: res.jgjUsersCouponEntities,
        winHeight: res.jgjUsersCouponEntities.length
      })
    }).catch(err => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    })
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