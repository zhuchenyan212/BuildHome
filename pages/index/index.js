//获取应用实例
var $ = require("../../utils/http.js");

Page({
  data: {
    domain: wx.getStorageSync('domain'),
    swiper: [], //轮播图
    service: [], //服务类目
    active: [], //优惠活动
    news: [], //无缝滚动
    count: '', //参与人数
    coupon: [], //优惠券
    enterPrise: '',
    afterSale: '',
    show: false //是否显示优惠券弹窗
  },

  onLoad: function() {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/index/indexPage',
      method: 'GET'
    }).then(res => {
      console.log(res)
      that.setData({
        count: res.count,
        swiper: res.jgjMerryGoRoundEntities,
        service: res.jgjServiceEntities,
        active: res.jgjActivityEntities,
        news: res.jgjTakePartInEntities,
        enterPrise: res.enterPrise,
        afterSale: res.afterSale,
      })
      //全局缓存拨打号码
      wx.setStorageSync('telephone', res.tel);
      if (res.jgjUsersCouponEntities && res.jgjUsersCouponEntities.length > 0) {
        that.setData({
          coupon: res.jgjUsersCouponEntities
        })
        that.setData({
          show: true
        })
        setTimeout(() => {
          that.setData({
            show: false
          })
        }, 1500);
      } else {
        that.setData({
          show: false
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  saveUserInfo: function(e) {
    var that = this,
      phoneReg = /^(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})$/;
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '请输入小区名称',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (e.detail.value.phone == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!phoneReg.test(e.detail.value.phone)) {
      wx.showToast({
        title: '电话号码输入有误',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else {
      //请求服务器
      $.http({
        url: wx.getStorageSync('domain') + '/api/index/activities',
        method: 'POST',
        data: {
          userName: e.detail.value.name,
          mobile: e.detail.value.phone,
          jgjActivityId: 0
        }
      }).then(res => {
        wx.showToast({
          title: '信息提交成功',
          icon: 'success',
          duration: 1500,
        })
        //表单提交以后刷新当前页面
        that.setData({
          name: '',
          phone: ''
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

  //关闭优惠券弹窗
  close: function() {
    var that = this;
    that.setData({
      show: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '佳管家家居服务平台',
      path: '/pages/index/index'
    }
  },

  onHide: function() {
    clearInterval()
  }

})