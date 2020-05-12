// pages/store/detail.js
var $ = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', //品牌id
    type: '',
    page: 1, //当前页码
    JgjGoodsBrandList: [],
    goodsList: [],
    searchkey: '' //搜索关键字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id && options.type) {
      this.setData({
        id: options.id,
        type: options.type
      })
      this.getData(options.id, options.type, this.data.page)
    }
  },

  getData: function (id, type, page) {
    //请求商品类别以及品牌
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods/getGoodsList',
      method: 'GET',
      data: {
        page: page,
        nramdId: id,
        typeId: type,
      }
    }).then(res => {
      if (res.code == 0) {
        //对应品牌
        var JgjGoodsBrandList = res.JgjGoodsBrandList.filter(item => item.nramdId == id)
        this.setData({
          JgjGoodsBrandList: JgjGoodsBrandList,
          goodsList: this.data.goodsList.concat(res.goodsList)
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

  //搜索关键字
  getsearchkey: function (e) {
    this.setData({
      searchkey: e.detail.value
    })
  },

  //搜索
  click: function () {
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods/selectJgjGoodsList',
      method: 'GET',
      data: {
        content: this.data.searchkey,
      }
    }).then(res => {
      if (res.code == 0) {
        console.log(res)
        this.setData({
          goodsList: res.goodsList
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

  //去商品详情页
  gotodetail: function (e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/category/productDetail?id=' + id,
    })
  },

  //加入购物车
  addshopingCart: function (e) {
    const {
      id
    } = e.currentTarget.dataset
    console.log('点击加入购物车')
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods/usersShoppingCart?goodsId=' + id + '&num=1',
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var page = that.data.page;
    var id = that.data.id;
    var type = that.data.type;
    if (id && type) {
      this.setData({
        page: page + 1
      })
      this.getData(id, type, page + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})