// pages/category/productDetail.js
var $ = require("../../utils/http.js");
var WxParse = require('../wxParse/wxParse.js');
Page({

  data: {
    domain: wx.getStorageSync('domain'),
    telephone: wx.getStorageSync('telephone'),
    id: '', //类别
    jgjGoods: '', //详情数据
  },

  onLoad: function(options) {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods/' + options.id,
      method: 'GET'
    }).then(res => {
      console.log(res)
      that.setData({
        id: options.id,
        jgjGoods: res.jgjGoods
      })
      if (res.jgjGoods.detail != null) {
        WxParse.wxParse('article', 'html', res.jgjGoods.detail, that, 5);
      }
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  // saveInfo: function (e) {
  //   var that = this,
  //     phoneReg = /^(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})$/;
  //   console.log(e.detail.value)
  //   if (e.detail.value.unit == '') {
  //     wx.showToast({
  //       title: '请输入小区名称',
  //       icon: 'none',
  //       duration: 1500
  //     })
  //     return false;
  //   } else if (e.detail.value.telePhone == '') {
  //     wx.showToast({
  //       title: '请输入联系电话',
  //       icon: 'none',
  //       duration: 1500
  //     })
  //     return false;
  //   } else if (!phoneReg.test(e.detail.value.telePhone)) {
  //     wx.showToast({
  //       title: '联系电话输入有误',
  //       icon: 'none',
  //       duration: 1500
  //     })
  //     return false;
  //   } else {
  //     //请求服务器
  //     $.http({
  //       url: wx.getStorageSync('domain') + '/api/index/appointment',
  //       method: 'POST',
  //       data: {
  //         unit: e.detail.value.unit,
  //         mobile: e.detail.value.telePhone
  //       }
  //     }).then(res => {
  //       wx.showToast({
  //         title: '信息提交成功',
  //         icon: 'success',
  //         duration: 1500,
  //       })
  //       //表单提交以后刷新当前页面
  //       setTimeout(() => {
  //         wx.redirectTo({
  //           url: '../category/service?id=' + that.data.id
  //         })
  //       }, 2000);
  //     }).catch(err => {
  //       wx.showToast({
  //         title: err,
  //         icon: 'fail',
  //         duration: 2000,
  //       })
  //     })
  //   }
  // },

  addshopingCart: function() {
    console.log('点击加入购物车')
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods/usersShoppingCart?goodsId=' + that.data.id + '&num=1',
      method: 'POST'
    }).then(res => {
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000,
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  //一键拨打客服电话
  fixedNum: function() {
    var num = wx.getStorageSync("telephone")
    wx.makePhoneCall({
      phoneNumber: num,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },

  chatWei: function() {
    //是否绑定业务员
    console.log('======绑定的业务员聊天======')
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