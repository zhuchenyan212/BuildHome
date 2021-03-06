//获取应用实例
var $ = require("../../utils/http.js");
Page({
  data: {
    type: '', //type类型
    jgjAddressEntities: [], //地址列表
  },

  //勾选事件处理函数  
  switchSelect: function (e) {
    var that = this;
    for (let i = 0; i < that.data.jgjAddressEntities.length; i++) {
      if (that.data.jgjAddressEntities[i].id == e.currentTarget.dataset.id) {
        that.data.jgjAddressEntities[i].isSelect = !that.data.jgjAddressEntities[i].isSelect
        that.setData({
          jgjAddressEntities: this.data.jgjAddressEntities
        })
        //获取选中地址数据存入缓存
        wx.setStorageSync('address', that.data.jgjAddressEntities[i]);
        if (wx.getStorageSync('address') != '' || wx.getStorageSync('address') != null || wx.getStorageSync('address') != undefined) {
          if (this.data.type == 0) {//拼团单
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/order/detail?id=' + this.data.id
              })
            }, 500);
          } else { //如果来源是确认订单
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/mine/confirmOrder'
              })
            }, 500);
          }
        }
      }
    }
  },

  addAddress: function () {
    wx.navigateTo({
      url: '../user/addAddress',
    })
  },

  editAddress: function (e) {
    wx.navigateTo({
      url: '../user/EditAddress?addressMsg=' + JSON.stringify(e.currentTarget.dataset),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      id: options.id
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
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/userAddress',
      method: 'GET'
    }).then(res => {
      const array = [];
      for (let i = 0; i < res.jgjAddressEntities.length; i++) {
        res.jgjAddressEntities[i]["isSelect"] = false
        array.push(res.jgjAddressEntities[i])
      }
      that.setData({
        jgjAddressEntities: array
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
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