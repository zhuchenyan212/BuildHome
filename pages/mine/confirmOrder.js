var $ = require("../../utils/http.js");
Page({

  data: {
    jgjShopcartEntities: '', //下单数据
    address: '', //地址数据
    coupon: '', //优惠券数据
    len: 0, //可使用优惠券张数
    money: 0, //商品总金额
    id: '' //支付成功后修改订单状态id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  // 选择地址
  chooseAddress: function() {
    wx.navigateTo({
      url: '/pages/user/myaddress',
    })
  },

  // 选择优惠券
  choosequan: function() {
    wx.navigateTo({
      url: '/pages/mine/choosequan',
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
    var that = this;
    //请求服务器可用优惠券
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/usersCoupons?available=1',
      method: 'GET',
    }).then(res => {
      var money = 0; //计算总金额
      for (var j = 0; j < wx.getStorageSync('buyInfo').length; j++) {
        money += wx.getStorageSync('buyInfo')[j].price * wx.getStorageSync('buyInfo')[j].num
      }
      var newArr = res.jgjUsersCouponEntities.filter(item => item.threshold <= money) //可使用优惠券数量
      console.log(money)
      that.setData({
        len: newArr.length, //优惠券长度
        money: money, //商品总金额
        jgjShopcartEntities: wx.getStorageSync('buyInfo'), //下单数据
        address: wx.getStorageSync('address'), //地址数据
        coupon: wx.getStorageSync('coupon'), //优惠券数据
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
    that.setData({
      jgjShopcartEntities: wx.getStorageSync('buyInfo'), //下单数据
      address: wx.getStorageSync('address'), //地址数据
      coupon: wx.getStorageSync('coupon'), //优惠券数据
    })
  },

  //微信支付
  weiPay: function() {
    var that = this;
    var couponId = wx.getStorageSync('coupon').id //优惠券id
    var addressId = wx.getStorageSync('address').id //地址id
    let total_fee = 0; //订单总价
    if (wx.getStorageSync('coupon').worth != '' && wx.getStorageSync('coupon').worth != undefined) {
      total_fee = that.data.money - wx.getStorageSync('coupon').worth
    } else {
      total_fee = that.data.money
    }
    var arr = []; //确认商品数据
    for (let i in wx.getStorageSync('buyInfo')) {
      arr.push(wx.getStorageSync('buyInfo')[i].id)
    }
    //将数组转换为字符串
    // console.log(arr.toString())
    if (addressId == undefined) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 2000,
      })
      return false
    } else if (couponId == undefined) {
      //请求服务器创建订单===无优惠券
      $.http({
        url: wx.getStorageSync('domain') + '/api/user/orders?ids=' + arr.toString() + '&addressId=' + addressId + '&total_fee=' + (total_fee).toFixed(2),
        method: 'POST',
      }).then(res => {
        console.log(res)
        that.setData({
          id: res.jgjOrdersEntity.id //支付成功后修改订单状态id
        })
        //清除订单缓存
        wx.removeStorageSync('coupon');
        wx.removeStorageSync('buyInfo');
        wx.removeStorageSync('address');
        // 向后台发送请求获取支付参数
        $.http({
          url: wx.getStorageSync('domain') + '/api/user/getSecondSign?non_str=' + res.jgjOrdersEntity.nonceStr + '&prepay_id=' + res.jgjOrdersEntity.prepayId,
          method: 'GET',
        }).then(res => {
          console.log(res)
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
                url: wx.getStorageSync('domain') + '/api/user/orders?id=' + that.data.id + '&status=2',
                method: 'PUT',
              }).then(res => {
                console.log(res)
                if (res.code == 0) {
                  setTimeout(() => {
                    wx.redirectTo({
                      url: '/pages/order/index',
                    })
                  }, 2000);
                }
              }).catch(err => {
                wx.showToast({
                  title: '请求失败请稍候',
                  icon: 'none',
                  duration: '2000',
                })
              })
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
      }).catch(err => {
        wx.showToast({
          title: '请求失败请稍候',
          icon: 'none',
          duration: 2000,
        })
      })
    } else {
      //请求服务器创建订单==有优惠券
      $.http({
        url: wx.getStorageSync('domain') + '/api/user/orders?ids=' + arr.toString() + '&couponId=' + couponId + '&addressId=' + addressId + '&total_fee=' + (total_fee).toFixed(2),
        method: 'POST',
      }).then(res => {
        console.log(res)
        //清除订单缓存
        wx.removeStorageSync('coupon');
        wx.removeStorageSync('buyInfo');
        wx.removeStorageSync('address');
        // 向后台发送请求获取支付参数
        $.http({
          url: wx.getStorageSync('domain') + '/api/user/getSecondSign?non_str=' + res.jgjOrdersEntity.nonceStr + '&prepay_id=' + res.jgjOrdersEntity.prepayId,
          method: 'GET',
        }).then(res => {
          console.log(res)
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
                url: wx.getStorageSync('domain') + '/api/user/orders?id=' + that.data.id + '&status=2',
                method: 'PUT',
              }).then(res => {
                console.log(res)
                if (res.code == 0) {
                  setTimeout(() => {
                    wx.redirectTo({
                      url: '/pages/order/index',
                    })
                  }, 2000);
                }
              }).catch(err => {
                wx.showToast({
                  title: '请求失败请稍候',
                  icon: 'none',
                  duration: '2000',
                })
              })
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
      }).catch(err => {
        wx.showToast({
          title: '请求失败请稍候',
          icon: 'none',
          duration: 2000,
        })
      })
    }
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