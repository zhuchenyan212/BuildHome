//获取应用实例
var $ = require("../../utils/http.js");
var WxParse = require('../wxParse/wxParse.js');

Page({
  data: {
    domain: wx.getStorageSync('domain'),
    swiper: [], //轮播图
    service: [], //服务类目
    active: [], //优惠活动
    news: [], //无缝滚动
    count: '', //参与人数
    coupon: [], //优惠券
    show: false, //是否显示优惠券弹窗
    openor: '' //是否打开强制授权
  },

  onLoad: function(query) {
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
      })
      var info = '<p><img src=' + res.afterSale + '><br></p>'
      WxParse.wxParse('article', 'html', info, that, 5);
      var infos = '<p><img src=' + res.enterPrise + '><br></p>'
      WxParse.wxParse('section', 'html', infos, that, 5);
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

    // 扫描海报二维码绑定业务员
    console.log(query.scene)
    if (query.scene) {
      //进入页面获取到业务员id就绑定业务员
      $.http({
        url: wx.getStorageSync('domain') + '/api/PersonCard/bindSalesMan?bindSalesMan=' + query.scene,
        method: 'PUT'
      }).then(res => {
        console.log("===绑定业务员结果=======" + res + "+============")
      }).catch(err => {
        console.log('请求失败请稍候')
      })
    }
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
        url: wx.getStorageSync('domain') + '/api/index/appointment?serviceId=0&mobile=' + e.detail.value.phone + '&unit=' + e.detail.value.name + '&userId=' + wx.getStorageSync('myuserId'),
        method: 'POST'
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
  },

  onShow: function() {
    var that = this;
    // 调用登录
    wx.login({
      success: res => {
        if (res.errMsg == "login:ok") {
          //请求服务器
          $.http({
            url: wx.getStorageSync('domain') + '/api/index/login',
            method: 'GET',
            data: {
              code: res.code,
            },
          }).then(res => {
            console.log('=====获取到用户的token========');
            // 缓存后台返回的用户token
            wx.setStorageSync('user', res.token);
            wx.setStorageSync('openId', res.openId);
            //请求服务器===是否强制授权
            if (res.openId) {
              $.http({
                url: wx.getStorageSync('domain') + '/api/WXreply/DeceptionType?openId=' + res.openId,
                method: 'POST',
              }).then(res => {
                if (res.msg == 0) {
                  that.setData({
                    openor: false
                  })
                  wx.setStorageSync('openor', false);
                } else {
                  // 调用授权弹窗
                  that.setData({
                    openor: true
                  })
                  wx.setStorageSync('openor', true);
                }
              }).catch(err => {
                wx.showToast({
                  title: '请求失败请稍候',
                  icon: 'none',
                  duration: 2000,
                })
              })
            }
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候',
              icon: 'none',
              duration: 2000,
            })
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

  // 获取用户信息登录
  getInfo: function(e) {
    wx.login({
      success: res => {
        if (res.errMsg == "login:ok") {
          //请求服务器
          $.http({
            url: wx.getStorageSync('domain') + '/api/index/login',
            method: 'GET',
            data: {
              code: res.code,
              nickName: e.detail.userInfo.nickName,
              avatarUrl: e.detail.userInfo.avatarUrl,
            },
          }).then(res => {
            console.log('=====获取到用户的token========');
            // 缓存后台返回的用户token
            wx.setStorageSync('user', res.token);
            wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
            wx.setStorageSync('myuserId', res.userEntity.userId);
            wx.showToast({
              title: '获取用户token成功',
              icon: 'success',
              duration: 2000,
            })
            this.onShow()
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候',
              icon: 'none',
              duration: 2000,
            })
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

})