//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    phone: '',
    userEntity: '', //用户信息
    unReadMessageCount: '', //未读消息
    identity: '', //用户身份1为普通 2为业务员
    salesman: '', //业务员
    openor: true, //是否打开强制授权
    getphone: false, //是否显示获取手机号
    text: '谷拜科技提供技术支持 \n Goobye谷拜 © 技术支持电话：15927199466'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      identity: wx.getStorageSync('identity'), //用户身份1为普通 2为业务员
      salesman: wx.getStorageSync('salesman') //业务员
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //在线沟通服务提醒
  getNumSuccess: function (e) {
    var arr = [];
    arr.push(e.detail.formId)
    $.http({
      url: wx.getStorageSync('domain') + '/api/WXreply/setButtKey',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('myuserId'),
        buttKeyList: arr
      }
    }).then(res => { }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/indexPage',
      method: 'GET'
    }).then(res => {
      that.setData({
        userEntity: res.userEntity,
        unReadMessageCount: res.unReadMessageCount,
        phone: res.userEntity.mobile,
        identity: res.userEntity.identity, //用户身份1为普通 2为业务员
        salesman: res.userEntity.salesman //业务员
      })
      // 缓存用户信息
      wx.setStorageSync('identity', res.userEntity.identity);
      wx.setStorageSync('salesman', res.userEntity.salesman);
      wx.setStorageSync('myuserId', res.userEntity.userId);
      wx.setStorageSync('avatarurl', res.userEntity.avatarurl);
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
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
            // 缓存后台返回的用户token
            wx.setStorageSync('user', res.token);
            wx.setStorageSync('openId', res.openId);
            wx.setStorageSync('session_key', res.session_key);
            wx.setStorageSync('myuserId', res.userEntity.userId);
            // 是否强制授权
            if(res.openId){
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
          title: '请求失败请稍候5',
          icon: 'none',
          duration: 2000,
        })
      })
    }
  },

  showInfo: function () {
    wx.navigateTo({
      url: '../user/infoList',
    })
  },

  blur: function (e) {
    var that = this,
      phoneReg = /^(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})$/;
    if (phoneReg.test(e.detail.value)) {
      //请求服务器
      $.http({
        url: wx.getStorageSync('domain') + '/api/PersonCard/card?mobile=' + e.detail.value,
        method: 'PUT'
      }).then(res => {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000,
        })
      }).catch(err => {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
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