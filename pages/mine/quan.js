var $ = require("../../utils/http.js");
Page({

  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    couponList: [] //优惠券数据
  },

  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    console.log(e.detail.current)

    var that = this;
    if (e.detail.current == 0) {
      //请求服务器==========可用
      $.http({
        url: wx.getStorageSync('domain') + '/api/user/usersCoupons?available=1',
        method: 'GET',
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
    } else if (e.detail.current == 1) {
      //请求服务器===========不可用
      $.http({
        url: wx.getStorageSync('domain') + '/api/user/usersCoupons?available=0',
        method: 'GET',
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
    } else if (e.detail.current == 2) {
      //请求服务器============过期
      $.http({
        url: wx.getStorageSync('domain') + '/api/user/usersCoupons?available=2',
        method: 'GET',
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
    }

  },

  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    console.log(e.target.dataset.current)
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
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

  onLoad: function() {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    console.log(that.data.currentTab)
    //请求服务器可用
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/usersCoupons?available=1',
      method: 'GET',
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