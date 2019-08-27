// pages/mine/shoppingCart.js
Page({

  data: {
    isAllSelect: false,
    totalMoney: 0,
    //商品详情介绍
    carts: [{
        pic: "/images/mt.png",
        name: "日本资生堂洗颜日本资生堂洗颜日本资生堂洗颜",
        price: 200,
        isSelect: false,
        count: {
          quantity: 2,
          min: 1,
          max: 20
        },
      },
      {
        pic: '/images/mt.png',
        name: "倩碧焕妍活力精华露日本资生堂洗颜日本资生堂洗颜日",
        price: 340,
        isSelect: false,
        count: {
          quantity: 1,
          min: 1,
          max: 20
        },
      },
      {
        pic: "/images/mt.png",
        name: "LANCOME兰蔻小黑瓶精华日本资生堂洗颜",
        price: 230,
        isSelect: false,
        count: {
          quantity: 1,
          min: 1,
          max: 20
        },
      },
    ],
  },

  onShow: function() {},

  //勾选事件处理函数  
  switchSelect: function(e) {
    // 获取item项的id，和数组的下标值  
    var Allprice = 0,
      i = 0;
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    this.data.carts[index].isSelect = !this.data.carts[index].isSelect;
    //价钱统计
    if (this.data.carts[index].isSelect) {
      this.data.totalMoney = this.data.totalMoney + this.data.carts[index].price;
    } else {
      this.data.totalMoney = this.data.totalMoney - this.data.carts[index].price;
    }
    //是否全选判断
    for (i = 0; i < this.data.carts.length; i++) {
      Allprice = Allprice + this.data.carts[i].price;
    }
    if (Allprice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    } else {
      this.data.isAllSelect = false;
    }
    this.setData({
      carts: this.data.carts,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect,
    })
  },

  //全选
  allSelect: function(e) {
    //处理全选逻辑
    let i = 0;
    if (!this.data.isAllSelect) {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = true;
        this.data.totalMoney = this.data.totalMoney + this.data.carts[i].price;
      }
    } else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = false;
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney,
    })
  },

  /* 减数 */
  delCount: function(e) {
    console.log(e.target.dataset.num)
  },
  /* 加数 */
  addCount: function(e) {
    console.log(e.target.dataset.num)

  },
  /* 删除item */
  delGoods: function(e) {
    console.log(e)
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