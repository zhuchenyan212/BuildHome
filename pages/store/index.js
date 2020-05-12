//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    curNav: wx.getStorageInfoSync('curNav'),
    type: '', //类型id
    activity: [], //商品类目
    rightbrand: [], //商品类型品牌
    openor: true, //是否打开强制授权
    getphone: false, //是否显示获取手机号
    salesmanId: '', //业务员id
  },

  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id;
    // index = parseInt(e.target.dataset.index)
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      rightbrand: [] //切换类型清空商品类型品牌
    })
    this.getdata(id)

    //设置锚点缓存
    wx.setStorageSync('curNav', id);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //根据用户分享获取绑定上别人的id
    if (options.scene) {
      that.setData({
        salesmanId: options.scene
      })
      wx.setStorageSync('salesmanId', options.scene)
      //分享绑定业务员
      console.log("===绑定业务人员=======" + options.scene + "+============")
      if (options.scene) {
        //进入页面获取到业务员id就绑定业务员
        $.http({
          url: wx.getStorageSync('domain') + '/api/PersonCard/bindSalesMan?bindSalesMan=' + options.scene,
          method: 'PUT'
        }).then(res => {
          console.log("===绑定结果=======" + res + "+============")
        }).catch(err => {
          console.log('请求失败请稍候')
        })
      }
    }

    //请求商品类别以及品牌
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods',
      method: 'GET'
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          leftmenu: res.jgjGoodsTypeEntities, //商品类目
          rightbrand: res.JgjGoodsBrandList, //商品品牌
          // curNav: res.goodsType //商品当前类目
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //请求广告图
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/getHotActivity',
      method: 'GET',
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          activity: res.hotActivityEntities
        })
      }
    }).catch(err => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    })
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
            wx.setStorageSync('session_key', res.session_key);
            wx.setStorageSync('myuserId', res.userEntity.userId);
            // 是否强制授权
            if (res.openId) {
              $.http({
                url: wx.getStorageSync('domain') + '/api/WXreply/DeceptionType?openId=' + res.openId,
                method: 'POST',
              }).then(res => {
                if (res.msg == 0) {
                  this.setData({
                    openor: false
                  })
                  wx.setStorageSync('openor', false);
                } else {
                  // 调用授权弹窗
                  this.setData({
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
    //请求服务器===是否强制授权
    if (wx.getStorageSync('openId')) {
      $.http({
        url: wx.getStorageSync('domain') + '/api/WXreply/DeceptionType?openId=' + wx.getStorageSync('openId'),
        method: 'POST',
      }).then(res => {
        if (res.msg == 0) {
          this.setData({
            openor: false
          })
          wx.setStorageSync('openor', false);
        } else {
          // 调用授权弹窗
          this.setData({
            openor: true
          })
          wx.setStorageSync('openor', true);
        }
      }).catch(err => {
        wx.showToast({
          title: '请求失败请稍候5',
          icon: 'none',
          duration: 2000,
        })
      })
    }
    //再次绑定业务员
    if (this.data.salesmanId) {
      //进入页面获取到业务员id就绑定业务员
      $.http({
        url: wx.getStorageSync('domain') + '/api/PersonCard/bindSalesMan?bindSalesMan=' + this.data.salesmanId,
        method: 'PUT'
      }).then(res => {
        console.log("===绑定结果=======" + res + "+============")
      }).catch(err => {
        console.log('请求失败请稍候')
      })
    }
  },

  // 获取用户信息登录
  getInfo: function (e) {
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
            this.setData({
              getphone: true //打开获取手机号
            })
          }).catch(err => {
            wx.showToast({
              title: '请求失败请稍候4',
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

  //获取用户手机号
  getPhone: function (e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      $.http({
        url: wx.getStorageSync('domain') + '/api/index/getUserPhone',
        method: 'GET',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: wx.getStorageSync('session_key'),
          user_id: wx.getStorageSync('myuserId')
        }
      }).then(res => {
        if (res.code == 0) {
          this.onShow()
        }
      }).catch(err => {
        console.log('请求失败请稍候')
      })
    }
  },

  //获取数据
  getdata: function (type) {
    //请求商品类别以及品牌
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods/getBrandList',
      method: 'GET',
      data: {
        typeId: type,
      }
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          type: type, //类型id
          rightbrand: res.JgjGoodsBrandList //商品品牌
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

  //品牌商品
  navigate: function (e) {
    const {
      id,
      type
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/store/detail?id=' + id + '&type=' + type,
    })
  },

  //搜索
  click: function () {
    wx.navigateTo({
      url: '/pages/store/detail'
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log('www')
    }
    return {
      title: "快来佳管家家居服务平台吧~", //分享标题
      imageUrl: "/images/nosar.png",
      path: '/pages/store/index?scene=' + wx.getStorageSync('myuserId'), // 别人点击链接时会得到的数据
      success: function success(res) {
        console.log("分享成功", res);
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function fail(res) {
        console.log("分享失败", res);
      }
    }
  }
})