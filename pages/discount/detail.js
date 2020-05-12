var $ = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '', //砍价活动id
    height: 445,
    userEntity: {}, //砍价发起人信息
    goodsdetail: {}, //砍价的商品信息
    friendList: [], //帮忙砍价的好友信息
    friendNum: {}, //目前砍价人数
    process: '', //目前砍价进度
    discountOr: true //是否是砍价主人默认是的
  },

  //点击展开更多
  more: function(e) {
    const {
      height
    } = e.currentTarget.dataset
    this.setData({
      height: height + 88
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //存储砍价主人的id
    console.log(options.user)
    // 渲染砍价页面
    if (options.id) {
      //邀请砍价页面
      $.http({
        url: wx.getStorageSync('domain') + '/sys/jgjuserbargain/lognBargain',
        method: 'GET',
        data: {
          bargain_id: options.id
        }
      }).then(res => {
        if (res.code == 0) {
          this.setData({
            activityId: options.id, //砍价活动id
            userEntity: res.userEntity, //砍价发起人信息
            goodsdetail: res.JgjGoodsEntity, //砍价的商品信息
            friendList: res.userList, //帮忙砍价的好友信息
            friendNum: res.JgjUserBargainEntity, //目前砍价人数
            process: Math.round((res.JgjUserBargainEntity.bargainUsersNumber / res.JgjGoodsEntity.goodsBargainNumber) * 100)
          })
        }
      }).catch(err => {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
      })
    }
    //判断是否是新用户
    if (wx.getStorageSync('myuserId')) {
      console.log('如果页面缓存了用户id则不需要登录')
    } else {
      //用户进入砍价页面如果没有用户的id就调用登录缓存用户id
      wx.login({
        success: res => {
          if (res.errMsg == "login:ok") {
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
    }
    //判断当前页面是需要邀请还是帮忙
    if (wx.getStorageSync('myuserId') && options.user) {
      if (options.user == wx.getStorageSync('myuserId')) {
        this.setData({
          discountOr: true
        })
      } else {
        this.setData({
          discountOr: false
        })
      }
    }
  },

  //分享小程序+邀请好友砍价
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      console.log('www')
    }
    console.log('===分享名片=' + res + '==')
    return {
      title: "快来佳管家家居服务平台帮我砍价吧~", //分享标题
      imageUrl: "/images/nosar.png",
      path: '/pages/discount/detail?id=' + this.data.activityId, // 别人点击链接时会得到的数据
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

  //帮助好友砍价
  helpdiscount: function() {
    console.log(this.data.activityId) //当前活动id
    console.log(wx.getStorageSync('myuserId')) //当前用户id
    if (wx.getStorageSync('myuserId')) {
      $.http({
        url: wx.getStorageSync('domain') + '/sys/jgjuserbargain/giveMeBargain',
        method: 'GET',
        data: {
          bargain_id: this.data.activityId,
          bargainUserId: wx.getStorageSync('myuserId')
        },
      }).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '帮助好友砍价成功',
            icon: 'success',
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
    }
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