//获取应用实例
var $ = require("../../utils/http.js");
Page({
  data: {
    curNav: 0,
    curIndex: 0,
    jgjGoodsTypeEntities: [],
    id: '', //类别
    pageNo: 1, //页码
    limit: 15, //显示数据数量
    products: [], //商品容器
    openor: '', //是否打开强制授权
  },

  onShow: function() {
    var that = this;
    // 调用登录
    wx.login({
      success: res => {
        if (res.errMsg == "login:ok") {
          //请求服务器
          $.http({
            url: wx.getStorageSync('domain') + '/api/index/login',
            method: 'GET',
            data: {
              code: res.code,
            },
          }).then(res => {
            console.log('=====获取到用户的token========');
            // 缓存后台返回的用户token
            wx.setStorageSync('user', res.token);
            wx.setStorageSync('openId', res.openId);
            wx.setStorageSync('myuserId', res.userEntity.userId);
            //请求服务器===是否强制授权
            if (res.openId) {
              $.http({
                url: wx.getStorageSync('domain') + '/api/WXreply/DeceptionType?openId=' + res.openId,
                method: 'POST',
              }).then(res => {
                if (res.msg == 0) {
                  that.setData({
                    openor: false
                  })
                  wx.setStorageSync('openor', false);
                } else {
                  // 调用授权弹窗
                  that.setData({
                    openor: true
                  })
                  wx.setStorageSync('openor', true);
                }
              }).catch(err => {
                wx.showToast({
                  title: '请求失败请稍候',
                  icon: 'none',
                  duration: 2000,
                })
              })
            }
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候',
              icon: 'none',
              duration: 2000,
            })
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

  onLoad() {
    var that = this,
      pageNo = that.data.pageNo,
      limit = that.data.limit;
    this.getProductData(pageNo, limit);
  },

  //请求货品信息
  getProductData: function(pageNo, limit, id, products) {
    var that = this,
      id = that.data.id;
    that.setData({
      id: id
    })
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods?page=' + pageNo + '&limit=' + limit,
      method: 'GET'
    }).then(res => {
      if (res.page.totalPage > 0 && res.page.currPage <= res.page.totalPage) {
        that.setData({
          pageNo: pageNo + 1,
          products: res.page.list,
          jgjGoodsTypeEntities: res.jgjGoodsTypeEntities
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

  //事件处理函数  
  switchRightTab: function(e) {
    var that = this,
      index = parseInt(e.target.dataset.index),
      id = e.target.dataset.id,
      pageNo = 1,
      limit = 15,
      products = [];
    wx.setStorageSync("id", e.target.dataset.id); //缓存id便于分页请求
    this.setData({
      curNav: id,
      curIndex: index,
      id: id
    })
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods?page=' + pageNo + '&limit=' + limit + '&type=' + e.target.dataset.id,
      method: 'GET'
    }).then(res => {
      that.setData({
        pageNo: pageNo + 1,
        products: res.page.list,
        jgjGoodsTypeEntities: res.jgjGoodsTypeEntities
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  //上拉加载更多事件
  onReachBottom: function(e) {
    var that = this,
      id = wx.getStorageSync("id"), //获取当前选中分类id
      pageNo = this.data.pageNo,
      limit = 15,
      products = this.data.products;

    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods?page=' + pageNo + '&limit=' + limit + '&type=' + id,
      method: 'GET'
    }).then(res => {
      if (res.page.totalPage > 0 && res.page.currPage <= res.page.totalPage) {
        that.setData({
          pageNo: pageNo + 1,
          products: that.data.products.concat(res.page.list),
          jgjGoodsTypeEntities: res.jgjGoodsTypeEntities
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

  //清除页面缓存id
  onHide: function() {
    wx.removeStorage({
      key: "id",
      success: function(res) {
        console.log("清除id成功")
      }
    })
  },

  // 获取用户信息登录
  getInfo: function(e) {
    wx.login({
      success: res => {
        if (res.errMsg == "login:ok") {
          //请求服务器
          $.http({
            url: wx.getStorageSync('domain') + '/api/index/login',
            method: 'GET',
            data: {
              code: res.code,
              nickName: e.detail.userInfo.nickName,
              avatarUrl: e.detail.userInfo.avatarUrl,
            },
          }).then(res => {
            console.log('=====获取到用户的token========');
            // 缓存后台返回的用户token
            wx.setStorageSync('user', res.token);
            wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
            wx.setStorageSync('myuserId', res.userEntity.userId);
            wx.showToast({
              title: '获取用户token成功',
              icon: 'success',
              duration: 2000,
            })
            this.onShow()
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候',
              icon: 'none',
              duration: 2000,
            })
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

})