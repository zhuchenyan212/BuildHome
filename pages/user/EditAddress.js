//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    isChecked: '',
    id: '',
    region: [], //用户选择收货地址点击选择省市区
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      id: JSON.parse(options.addressMsg).id,
      receiver: JSON.parse(options.addressMsg).receiver,
      mobile: JSON.parse(options.addressMsg).mobile,
      region: JSON.parse(options.addressMsg).address,
      addressDetail: JSON.parse(options.addressMsg).addressdetail,
      isChecked: JSON.parse(options.addressMsg).defaultaddress
    })
  },

  //选择省市区函数
  bindRegionChange: function(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      region: e.detail.value
    })
  },

  //是否是默认收货地址
  changeSwitch: function() {
    var that = this;
    that.setData({
      isChecked: !that.data.isChecked
    })
  },

  //编辑收货地址
  addAddress: function(e) {
    var that = this,
      phoneReg = /^(^(\d{3,4}-)?\d{7,8})$|(1[0-9]{10})$/;
    console.log(that.data.isChecked)
    if (e.detail.value.receiver == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (e.detail.value.mobile == '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!phoneReg.test(e.detail.value.mobile)) {
      wx.showToast({
        title: '手机号码输入有误',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (that.data.region == null) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (e.detail.value.addressDetail == '') {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else {
      //请求服务器
      $.http({
        url: wx.getStorageSync('domain') + '/api/user/userAddress?id=' + that.data.id + '&receiver=' + e.detail.value.receiver + '&mobile=' + e.detail.value.mobile + '&address=' + that.data.region + '&addressDetail=' + e.detail.value.addressDetail + '&defaultAddress=' + that.data.isChecked,
        method: 'PUT'
      }).then(res => {
        wx.showToast({
          title: '信息提交成功',
          icon: 'success',
          duration: 1500,
        })
        //表单提交以后刷新当前页面
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      }).catch(err => {
        wx.showToast({
          title: '请求失败请稍候',
          icon: 'none',
          duration: 2000,
        })
      })
    }
  },


  // 删除收货地址
  deletItme: function(e) {
    console.log(e.currentTarget.dataset.id)
    wx.showModal({
      content: '确认删除当前收货地址？',
      success(res) {
        if (res.confirm) {
          console.log('用户点确定了')
          //请求服务器
          $.http({
            url: wx.getStorageSync('domain') + '/api/user/userAddress?id=' + e.currentTarget.dataset.id,
            method: 'DELETE'
          }).then(res => {
            wx.showToast({
              title: '删除地址成功',
              icon: 'success',
              duration: 1500,
            })
            //表单提交以后刷新当前页面
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500);
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候',
              icon: 'none',
              duration: 2000,
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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