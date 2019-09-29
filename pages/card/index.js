//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    domain: wx.getStorageSync('domain'),
    identity: wx.getStorageSync('identity'), //用户身份1为普通 2为业务员
    userEntity: '', //名片
    decoration: '', //装修案例
    constructionSite: '', //装修工地
    active: '', //活动广告
    openor: false, //是否打开名片二维码
    salesmanimg: '', //业务员的二维码
    avatarurl: wx.getStorageSync('avatarurl'),
    salesman: wx.getStorageSync('salesman') //null没绑定业务员 有值为已绑定业务员
  },

  onLoad: function(options) {
    console.log(options.scene)
    if (options.scene != undefined) {
      //进入页面获取到业务员id就绑定业务员
      $.http({
        url: wx.getStorageSync('domain') + '/api/PersonCard/bindSalesMan?bindSalesMan=' + options.scene,
        method: 'PUT'
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

  },

  //是否打开名片二维码
  openModal: function() {
    var that = this;
    // that.data.openor == !that.data.openor
    that.setData({
      openor: !that.data.openor
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  onShow: function() {
    var that = this;
    //请求服务器
    //请求页面信息
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/indexPage',
      method: 'GET'
    }).then(res => {
      console.log(res)
      that.setData({
        userEntity: res.userEntity,
        decoration: res.decoration,
        constructionSite: res.constructionSite,
        active: res.activityEntities
      })
      if (wx.getStorageSync('identity') == 1 && wx.getStorageSync('salesman') != null) {
        wx.setStorageSync('salesimg', res.userEntity.avatarurl);
        wx.setStorageSync('userId', res.userEntity.userId);
      }
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })

    //获取业务员二维码
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/getSalesManQrCode',
      method: 'GET'
    }).then(res => {
      console.log(res)
      that.setData({
        salesmanimg: res.data
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  edit: function() {
    wx.navigateTo({
      url: '../card/Edit',
    })
  },

  chatWei: function() {
    console.log('======与绑定的业务员聊天======')
    wx.navigateTo({
      url: '../user/chating?user=' + wx.getStorageSync('userId'),
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

  // 分享名片
  shareCard: function() {
    return {
      title: "快来佳管家家居服务平台吧~", //分享标题
      imageUrl: "/images/nosar.png",
      query: "salesmanid=" + wx.getStorageSync('userId'), // 别人点击链接时会得到的数据
      success: function success(res) {
        console.log("分享成功", res);
        wx.showShareMenu({
          //要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function fail(res) {
        console.log("分享失败", res);
      }
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

  onShareAppMessage: function() {
    return {
      title: "快来佳管家家居服务平台吧~", //分享标题
      imageUrl: "/images/nosar.png",
      query: "", // 别人点击链接时会得到的数据
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
  },

})