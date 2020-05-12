var $ = require("../../utils/http.js");
Page({

  data: {
    okpay: false, //是否可以支付
    id: '', //订单详情的id
    address: '', //地址信息
    jgjOrdersGEntities: [], //订单商品信息
    mainOrder: {}, //订单信息
    jgjUsersCouponEntity: {} //订单优惠券
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/ordersDetail?id=' + options.id,
      method: 'GET',
    }).then(res => {
      that.setData({
        id: options.id, //订单详情id
        jgjOrdersGEntities: res.jgjOrdersGEntities, //订单商品信息
        mainOrder: res.mainOrder, //订单信息
      })
      if (res.jgjUsersCouponEntity != undefined) {
        that.setData({
          jgjUsersCouponEntity: res.jgjUsersCouponEntity //订单使用的优惠券
        })
      } else {
        that.setData({
          jgjUsersCouponEntity: {} //订单使用的优惠券
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      address: wx.getStorageSync('address'), //地址数据
    })
    if (this.data.mainOrder.receiveAddress != undefined || wx.getStorageSync('address') != '') {
      this.setData({
        okpay: true  //可以支付
      })
    }
  },

  //付款
  payMoney: function (e) {
    wx.showModal({
      content: '是否确认支付？',
      success(res) {
        if (res.confirm) {
          console.log('用户点确定了')
          // 向后台发送请求获取支付参数
          $.http({
            url: wx.getStorageSync('domain') + '/api/user/getSecondSign?non_str=' + e.currentTarget.dataset.noncestr + '&prepay_id=' + e.currentTarget.dataset.prepayid,
            method: 'GET',
          }).then(res => {
            // 发起微信支付申请
            wx.requestPayment({
              timeStamp: res.timeStamp,
              nonceStr: res.non_str,
              package: res.package,
              signType: 'JSAPI',
              paySign: res.paySign,
              success(res) {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 1500,
                })
                // 微信支付成功修改订单状态==========================
                $.http({
                  url: wx.getStorageSync('domain') + '/api/user/orders?id=' + e.currentTarget.dataset.id + '&status=2',
                  method: 'PUT',
                }).then(res => {
                }).catch(err => {
                  wx.showToast({
                    title: '请求失败请稍候',
                    icon: 'none',
                    duration: '2000',
                  })
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/pages/order/index',
                  })
                }, 2000);
              },
              fail(res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 1500,
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/pages/order/index',
                  })
                }, 2000);
              }
            })
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候',
              icon: 'none',
              duration: '2000',
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.showToast({
            title: '您取消了操作',
            icon: 'none',
            duration: '1500'
          })
        }
      }
    })
  },

  // 确认收货
  sureProduct: function (e) {
    //========确认收货
    wx.showModal({
      content: '是否确认收货？',
      success(res) {
        if (res.confirm) {
          console.log('用户点确定了')
          //请求服务器========确认收货
          $.http({
            url: wx.getStorageSync('domain') + '/api/user/orders?id=' + e.currentTarget.dataset.id + '&status=' + e.currentTarget.dataset.status,
            method: 'PUT',
          }).then(res => {
            wx.showToast({
              title: '确认收货成功',
              icon: 'success',
              duration: '1500',
            })
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候',
              icon: 'none',
              duration: '2000',
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.showToast({
            title: '您取消了操作',
            icon: 'none',
            duration: '1500'
          })
        }
      }
    })
  },

  //用户选择地址
  chooseaddress: function () {
    wx.navigateTo({
      url: '/pages/user/myaddress?type=0&id=' + this.data.id,
    })
  },

  //拼团选择地址以后支付
  pingtuanpay: function (e) {
    //请求服务器========确认收货
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/address',
      method: 'GET',
      data: {
        order_id: this.data.mainOrder.sn,
        address_id: wx.getStorageSync('address').id
      }
    }).then(res => {
      if (res.code == 0) {
        //  支付
        wx.showModal({
          content: '是否确认支付？',
          success(res) {
            if (res.confirm) {
              console.log('用户点确定了')
              // 向后台发送请求获取支付参数
              $.http({
                url: wx.getStorageSync('domain') + '/api/user/getSecondSign?non_str=' + e.currentTarget.dataset.noncestr + '&prepay_id=' + e.currentTarget.dataset.prepayid,
                method: 'GET',
              }).then(res => {
                // 发起微信支付申请
                wx.requestPayment({
                  timeStamp: res.timeStamp,
                  nonceStr: res.non_str,
                  package: res.package,
                  signType: 'JSAPI',
                  paySign: res.paySign,
                  success(res) {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 1500,
                    })
                    // 微信支付成功修改订单状态==========================
                    $.http({
                      url: wx.getStorageSync('domain') + '/api/user/orders?id=' + e.currentTarget.dataset.id + '&status=2',
                      method: 'PUT',
                    }).then(res => {
                    }).catch(err => {
                      wx.showToast({
                        title: '请求失败请稍候',
                        icon: 'none',
                        duration: '2000',
                      })
                    })
                    setTimeout(() => {
                      wx.redirectTo({
                        url: '/pages/order/index',
                      })
                    }, 2000);
                  },
                  fail(res) {
                    wx.showToast({
                      title: '支付失败',
                      icon: 'none',
                      duration: 1500,
                    })
                    setTimeout(() => {
                      wx.redirectTo({
                        url: '/pages/order/index',
                      })
                    }, 2000);
                  }
                })
              }).catch(err => {
                wx.showToast({
                  title: '请求失败请稍候',
                  icon: 'none',
                  duration: '2000',
                })
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              wx.showToast({
                title: '您取消了操作',
                icon: 'none',
                duration: '1500'
              })
            }
          }
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: '2000',
      })
    })
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