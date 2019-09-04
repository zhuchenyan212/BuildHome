var $ = require("../../utils/http.js");
Page({

  data: {
    isAllSelect: true,
    totalMoney: 0,
    //商品详情介绍
    jgjShopcartEntities: [],
  },

  onShow: function() {
    this.applyData()
  },

  applyData: function() {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/usersShoppingCart',
      method: 'GET',
    }).then(res => {
      console.log(res)
      that.setData({
        jgjShopcartEntities: res.jgjShopcartEntities
      })
      var money = 0;
      for (var i = 0; i < res.jgjShopcartEntities.length; i++) {
        money += res.jgjShopcartEntities[i].price
        that.setData({
          totalMoney: money
        })
        // 删除数量为0的商品
        if (res.jgjShopcartEntities[i].num == 0) {
          //请求服务器
          $.http({
            url: wx.getStorageSync('domain') + '/api/user/usersShoppingCart?id=' + res.jgjShopcartEntities[i].id,
            method: 'DELETE',
          }).then(res => {
            console.log(res)
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候',
              icon: 'none',
              duration: 2000,
            })
          })
        }
      }

    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  //勾选事件处理函数  
  switchSelect: function(e) {
    // 获取item项的id，和数组的下标值  
    var Allprice = 0,
      i = 0;
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    this.data.jgjShopcartEntities[index].selected = !this.data.jgjShopcartEntities[index].selected;
    //价钱统计
    if (this.data.jgjShopcartEntities[index].selected) {
      this.data.totalMoney = this.data.totalMoney + this.data.jgjShopcartEntities[index].price;
    } else {
      this.data.totalMoney = this.data.totalMoney - this.data.jgjShopcartEntities[index].price;
    }
    //是否全选判断
    for (i = 0; i < this.data.jgjShopcartEntities.length; i++) {
      Allprice = Allprice + this.data.jgjShopcartEntities[i].price;
    }
    if (Allprice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    } else {
      this.data.isAllSelect = false;
    }
    this.setData({
      jgjShopcartEntities: this.data.jgjShopcartEntities,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect,
    })
  },

  //全选
  allSelect: function(e) {
    //处理全选逻辑
    let i = 0;
    if (!this.data.isAllSelect) {
      for (i = 0; i < this.data.jgjShopcartEntities.length; i++) {
        this.data.jgjShopcartEntities[i].selected = true;
        this.data.totalMoney = this.data.totalMoney + this.data.jgjShopcartEntities[i].price;
      }
    } else {
      for (i = 0; i < this.data.jgjShopcartEntities.length; i++) {
        this.data.jgjShopcartEntities[i].selected = false;
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      jgjShopcartEntities: this.data.jgjShopcartEntities,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney,
    })
  },

  /* 减数 */
  delCount: function(e) {
    var that = this;
    var num = 0;
    num = e.target.dataset.num - 1;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/usersShoppingCart?id=' + e.target.dataset.id + '&num=' + num + '&selected=true',
      method: 'PUT',
    }).then(res => {
      console.log(res)
      that.applyData()
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  /* 加数 */
  addCount: function(e) {
    var that = this;
    var num = 0;
    num = e.target.dataset.num + 1;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/usersShoppingCart?id=' + e.target.dataset.id + '&num=' + num + '&selected=true',
      method: 'PUT',
    }).then(res => {
      console.log(res)
      that.applyData()
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  /* 删除item */
  delGoods: function(e) {
    console.log(e.currentTarget.dataset.id)
    var that = this
    wx.showModal({
      content: '确认删除当前商品？',
      success(res) {
        if (res.confirm) {
          console.log('用户点确定了')
          //请求服务器
          $.http({
            url: wx.getStorageSync('domain') + '/api/user/usersShoppingCart?id=' + e.currentTarget.dataset.id,
            method: 'DELETE',
          }).then(res => {
            console.log(res)
            that.applyData()
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

  // 去结算
  toBuy() {
    wx.showToast({
      title: '去结算',
      icon: 'success',
      duration: 3000
    });
    wx.navigateTo({
      url: '/pages/mine/confirmOrder',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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