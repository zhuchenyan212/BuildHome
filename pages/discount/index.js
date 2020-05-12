var $ = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0, //页码
    proList: [], //可砍价的商品
    userkanList: [] //用户正在参与的砍价商品
  },

  //用户发起砍价
  changeurl: function(e) {
    $.http({
      url: wx.getStorageSync('domain') + '/sys/jgjuserbargain/launchForBargain',
      method: 'GET',
      data: {
        goodsId: e.currentTarget.dataset.id,
        userId: wx.getStorageSync('myuserId')
      }
    }).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '您已成功对当前商品发起砍价',
          icon: 'none',
          duration: 2000,
        })
      }
    }).catch(err => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    })
  },

  getData: function(page, id) {
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods/selectJgjBargainGoods',
      method: 'GET',
      data: {
        page: page,
        userId: id
      }
    }).then(res => {
      this.setData({
        page: page, //当前页码
        proList: this.data.proList.concat(res.JgjBargainGoods), //可砍价的商品
        userkanList: res.UserBargainGoodsList //用户参与的砍价商品
      })
    }).catch(err => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.setData({
      id: wx.getStorageSync('myuserId')
    })

    // 请求砍价商品
    if (wx.getStorageSync('myuserId')) {
      this.getData(this.data.page, wx.getStorageSync('myuserId'))
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var page = this.data.page
    this.setData({
      page: page + 1,
    })
    this.getData(page + 1, wx.getStorageSync('myuserId'))
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})