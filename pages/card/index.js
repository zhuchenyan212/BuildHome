//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    domain: wx.getStorageSync('domain'),
    identity: '', //用户身份1为普通 2为业务员
    userEntity: '', //名片
    mobile: '', //拨打号码
    decoration: '', //装修案例
    constructionSite: '', //装修工地
    active: '', //活动广告
    openors: false, //是否打开名片二维码
    salesmanimg: '', //业务员的二维码
    avatarurl: '',
    salesman: '', //null没绑定业务员 有值为已绑定业务员
    openor: '', //是否打开强制授权
    salesmanId: '' //业务员id
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      salesmanId: options.myuserId
    })
    wx.setStorageSync('salesmanId', options.myuserId)
    //分享绑定业务员
    console.log("===绑定业务人员=======" + options.myuserId + "+============")
    if (options.myuserId) {
      //进入页面获取到业务员id就绑定业务员
      $.http({
        url: wx.getStorageSync('domain') + '/api/PersonCard/bindSalesMan?bindSalesMan=' + options.myuserId,
        method: 'PUT'
      }).then(res => {
        console.log("===绑定结果=======" + res + "+============")
      }).catch(err => {
        console.log('请求失败请稍候')
      })
    }
  },

  //是否打开名片二维码
  openModal: function() {
    var that = this;
    that.setData({
      openors: !that.data.openors
    })
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
      that.setData({
        identity: wx.getStorageSync('identity'),
        avatarurl: wx.getStorageSync('avatarurl'),
        salesman: wx.getStorageSync('salesman'),
        mobile: res.userEntity.mobile,
        userEntity: res.userEntity,
        decoration: res.decoration,
        constructionSite: res.constructionSite,
        active: res.activityEntities
      })
      if (wx.getStorageSync('identity') == 1 && wx.getStorageSync('salesman') != null) {
        wx.setStorageSync('salesimg', res.userEntity.avatarurl);
        wx.setStorageSync('salesuserId', res.userEntity.userId);
      }
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
    if (wx.getStorageSync('identity') == 2) {
      //获取业务员二维码
      $.http({
        url: wx.getStorageSync('domain') + '/api/PersonCard/getSalesManQrCode',
        method: 'GET'
      }).then(res => {
        console.log(res)
        that.setData({
          salesmanimg: res.data
        })
      }).catch(err => {
        wx.showToast({
          title: '请求失败请稍候',
          icon: 'none',
          duration: 2000,
        })
      })
    }

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

    //进入页面获取到业务员id就绑定业务员
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/bindSalesMan?bindSalesMan=' + that.data.salesmanId,
      method: 'PUT'
    }).then(res => {
      console.log("===绑定结果=======" + res + "+============")
    }).catch(err => {
      console.log('请求失败请稍候')
    })

    if (wx.getStorageSync('salesmanId')) {
      //进入页面获取到业务员id就绑定业务员
      $.http({
        url: wx.getStorageSync('domain') + '/api/PersonCard/bindSalesMan?bindSalesMan=' + wx.getStorageSync('salesmanId'),
        method: 'PUT'
      }).then(res => {
        console.log("===绑定结果=======" + res + "+============")
      }).catch(err => {
        console.log('请求失败请稍候')
      })
    }
  },

  edit: function() {
    wx.navigateTo({
      url: '../card/Edit',
    })
  },

  chatWei: function() {
    console.log('======与绑定的业务员聊天======')
    wx.navigateTo({
      url: '../user/chating?user=' + wx.getStorageSync('salesuserId'),
    })
  },

  //一键拨打客服电话
  fixedNum: function() {
    // var num = wx.getStorageSync("telephone")
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.mobile,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },

  // // 分享名片
  // shareCard: function(res) {
  //   console.log('===分享名片=' + res + '==')
  //   return {
  //     title: "快来佳管家家居服务平台吧~", //分享标题
  //     imageUrl: "/images/nosar.png",
  //     path: '/pages/card/index?myuserId=' + wx.getStorageSync('myuserId'), // 别人点击链接时会得到的数据
  //     success: function success(res) {
  //       console.log("分享成功", res);
  //       wx.showShareMenu({
  //         //要求小程序返回分享目标信息
  //         withShareTicket: true
  //       });
  //     },
  //     fail: function fail(res) {
  //       console.log("分享失败", res);
  //     }
  //   }
  // },

  //在线沟通服务提醒
  getNumSuccess: function(e) {
    var arr = [];
    arr.push(e.detail.formId)
    console.log(arr)
    $.http({
      url: wx.getStorageSync('domain') + '/api/WXreply/setButtKey',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('myuserId'),
        buttKeyList: arr
      }
    }).then(res => {}).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  // 更多案例
  more: function(e) {
    console.log()
    wx.navigateTo({
      url: '../card/more?type=' + e.currentTarget.dataset.type,
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

  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      console.log('www')
    }
    console.log('===分享名片=' + res + '==')
    return {
      title: "快来佳管家家居服务平台吧~", //分享标题
      imageUrl: "/images/nosar.png",
      path: '/pages/card/index?myuserId=' + wx.getStorageSync('myuserId'), // 别人点击链接时会得到的数据
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
  },

  //黄龙植 铁憨憨 性格火爆 内心纯情 热情如火 直白 英勇 贴心 正义 可爱 执行力强 男子气概 守护 不放弃 触动 善良 仗义
  //山茶 宇宙无敌温柔大姐姐 勇敢 坚强 坚定 坚持 守护 底线 防守 清纯 善良 美丽 可爱 随和 反击 镇定 感动 温柔 识时务

})