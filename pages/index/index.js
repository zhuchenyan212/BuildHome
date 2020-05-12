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
    //show: false, //是否显示优惠券弹窗
    openors: false, //是否打开优惠券详情
    //优惠券信息
    worth: '',
    content: '',
    threshold: '',
    endtime: '',
    couponId: '',
    openor: true, //是否打开强制授权
    getphone: false, //是否显示获取手机号
    remenList: [], //热门商品
    quanList: [], //优惠券
    activity: '', //专题活动
    userkanList: [], //用户正在砍价的数据
    getphone: false, //是否显示获取手机号
    kanjia: '', //砍价活动图
    salesmanId: '', //业务员id
  },

  onLoad: function (options) {
    // 扫描海报二维码绑定业务员
    var that = this;
    if (options.scene) {
      if (options.scene) {
        that.setData({
          salesmanId: options.scene
        })
        wx.setStorageSync('salesmanId', options.scene)
      }
      //分享绑定业务员
      console.log("===绑定业务人员=======" + options.scene + "+============")
      //进入页面获取到业务员id就绑定业务员
      $.http({
        url: wx.getStorageSync('domain') + '/api/PersonCard/bindSalesMan?bindSalesMan=' + options.scene,
        method: 'PUT'
      }).then(res => {
        console.log("===绑定结果=======" + res + "+============")
      }).catch(err => {
        console.log('请求失败请稍候')
      })
    }
  },

  //首页表单信息提交
  saveUserInfo: function (e) {
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

  onHide: function () {
    clearInterval()
  },

  onShow: function () {
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
            wx.setStorageSync('session_key', res.session_key);
            wx.setStorageSync('myuserId', res.userEntity.userId);
            // 是否强制授权
            if (res.openId) {
              $.http({
                url: wx.getStorageSync('domain') + '/api/WXreply/DeceptionType?openId=' + res.openId,
                method: 'POST',
              }).then(res => {
                if (res.msg == 0) {
                  this.setData({
                    openor: false
                  })
                  wx.setStorageSync('openor', false);
                } else {
                  // 调用授权弹窗
                  this.setData({
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
            //首页优惠券
            if (res.userEntity.userId) {
              $.http({
                url: wx.getStorageSync('domain') + '/api/Coupon/getCouponList?userId=' + res.userEntity.userId,
                method: 'GET'
              }).then(res => {
                that.setData({
                  quanList: res.couponList
                })
              }).catch(err => {
                wx.showToast({
                  title: res.msg,
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
    //请求页面数据
    $.http({
      url: wx.getStorageSync('domain') + '/api/index/indexPage',
      method: 'GET'
    }).then(res => {
      that.setData({
        count: res.count,
        swiper: res.jgjMerryGoRoundEntities, //广告轮播
        service: res.jgjServiceEntities, //模块展示
        active: res.jgjActivityEntities, //活动模块
        news: res.jgjTakePartInEntities, //公告列表
      })
      var info = '<p><img src=' + res.afterSale + '><br></p>'
      WxParse.wxParse('article', 'html', info, that, 5);
      var infos = '<p><img src=' + res.enterPrise + '><br></p>'
      WxParse.wxParse('section', 'html', infos, that, 5);
      //全局缓存拨打号码
      wx.setStorageSync('telephone', res.tel);
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
    //请求专题
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/getHotActivity',
      method: 'GET',
    }).then(res => {
      if (res.code == 0) {
        that.setData({
          activity: res.hotActivityEntities
        })
      }
    }).catch(err => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    })
    //请求热门商品
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods/getHotGoodsList',
      method: 'POST'
    }).then(res => {
      that.setData({
        remenList: res.hotGoodsList
      })
    }).catch(err => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    })
    //获取用户正在砍价的数据
    if (wx.getStorageSync('myuserId')) {
      $.http({
        url: wx.getStorageSync('domain') + '/api/jgjgoods/selectJgjBargainGoods',
        method: 'GET',
        data: {
          page: "1",
          userId: wx.getStorageSync('myuserId')
        }
      }).then(res => {
        this.setData({
          userkanList: res.UserBargainGoodsList //用户参与的砍价商品
        })
      }).catch(err => {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
      })
    }
    //获取砍价首页图
    $.http({
      url: wx.getStorageSync('domain') + '/api/WXreply/getPreferentialActivities',
      method: 'GET'
    }).then(res => {
      this.setData({
        kanjia: res.PreferentialActivities.value //用户参砍价首页图
      })
    }).catch(err => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    })
    //请求服务器===是否强制授权
    if (wx.getStorageSync('openId')) {
      $.http({
        url: wx.getStorageSync('domain') + '/api/WXreply/DeceptionType?openId=' + wx.getStorageSync('openId'),
        method: 'POST',
      }).then(res => {
        if (res.msg == 0) {
          this.setData({
            openor: false
          })
          wx.setStorageSync('openor', false);
        } else {
          // 调用授权弹窗
          this.setData({
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
    //再次绑定业务员
    if (this.data.salesmanId) {
      //进入页面获取到业务员id就绑定业务员
      $.http({
        url: wx.getStorageSync('domain') + '/api/PersonCard/bindSalesMan?bindSalesMan=' + this.data.salesmanId,
        method: 'PUT'
      }).then(res => {
        console.log("===绑定结果=======" + res + "+============")
      }).catch(err => {
        console.log('请求失败请稍候')
      })
    }
  },

  // 获取用户信息登录
  getInfo: function (e) {
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
            this.setData({
              getphone: true //打开获取手机号
            })
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

  //获取用户手机号
  getPhone: function (e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      $.http({
        url: wx.getStorageSync('domain') + '/api/index/getUserPhone',
        method: 'GET',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: wx.getStorageSync('session_key'),
          user_id: wx.getStorageSync('myuserId')
        }
      }).then(res => {
        if (res.code == 0) {
          this.onShow()
        }
      }).catch(err => {
        console.log('请求失败请稍候')
      })
    }
  },

  //优惠券详情
  getCoupon: function (e) {
    var that = this;
    that.setData({ //优惠券信息
      openors: !that.data.openors,
      worth: e.currentTarget.dataset.worth,
      content: e.currentTarget.dataset.content,
      threshold: e.currentTarget.dataset.threshold,
      endtime: e.currentTarget.dataset.endtime,
      couponId: e.currentTarget.dataset.id,
    })
  },

  //是否打开优惠券详情
  openModal: function () {
    var that = this;
    that.setData({
      openors: !that.data.openors
    })
  },

  //领取优惠券
  attrcoupon: function (e) {
    if (e.currentTarget.dataset.id) {
      $.http({
        url: wx.getStorageSync('domain') + '/api/Coupon/userGetCoupon?userId=' + wx.getStorageSync('myuserId') + '&couponId=' + e.currentTarget.dataset.id,
        method: 'GET',
      }).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '领取成功',
            duration: 2000
          })
          setTimeout(() => {
            this.onShow()
          }, 2000);
        }
      }).catch(err => {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
      })
    }
  },

  //去砍价
  gotokanjia: function () {
    var that = this;
    if (that.data.userkanList.length > 0) {
      //砍价进行中页面
      wx.navigateTo({
        url: '../discount/ing',
      })
    } else {
      //选择砍价页面
      wx.navigateTo({
        url: '../discount/index',
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log('www')
    }
    return {
      title: "快来佳管家家居服务平台吧~", //分享标题
      imageUrl: "/images/nosar.png",
      path: '/pages/index/index?scene=' + wx.getStorageSync('myuserId'), // 别人点击链接时会得到的数据
      success: function success(res) {
        console.log("分享成功", res);
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function fail(res) {
        console.log("分享失败", res);
      }
    }
  }
})