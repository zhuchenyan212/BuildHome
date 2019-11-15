var $ = require("../../utils/http.js");
Page({
  data: {
    currentTab: 0,
    jgjOrdersEntities: [], //订单数据
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      currentTab: options.currentTab
    })
  },

  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  orderDetail: function(e) {
    wx.navigateTo({
      url: '/pages/order/detail?id=' + e.currentTarget.dataset.id,
    })
  },

  onShow: function() {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/orders',
      method: 'GET',
    }).then(res => {
      that.setData({
        jgjOrdersEntities: res.jgjOrdersEntities
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  // 付款
  payMoney: function(e) {
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
                  wx.showToast({
                    title: '订单支付成功',
                    icon: 'none',
                    duration: '2000',
                  })
                  wx.navigateTo({
                    url: '../order/index',
                  })
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
  sureProduct: function(e) {
    //========确认收货
    wx.showModal({
      content: '是否确认收货？',
      success(res) {
        if (res.confirm) {
          console.log('用户点确定了')
          //请求服务器========确认收货
          $.http({
            url: wx.getStorageSync('domain') + '/api/user/orders?id=' + e.currentTarget.dataset.id + '&status=4',
            method: 'PUT',
          }).then(res => {
            wx.showToast({
              title: '确认收货成功',
              icon: 'success',
              duration: 1500,
            })
            wx.navigateTo({
              url: '../order/index',
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

  // 取消订单
  cancelOrder: function(e) {
    wx.showModal({
      content: '是否取消订单？',
      success(res) {
        if (res.confirm) {
          console.log('用户点确定了')
          $.http({
            url: wx.getStorageSync('domain') + '/api/user/order?id=' + e.currentTarget.dataset.id + '&token=' + wx.getStorageSync('user'),
            method: 'DELETE'
          }).then(res => {
            wx.showToast({
              title: '取消订单成功',
              icon: 'success',
              duration: 1500,
            })
            wx.navigateTo({
              url: '../order/index',
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