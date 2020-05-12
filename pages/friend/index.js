// pages/friend/index.js
var $ = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '', //我的现金收益
    friendList: []
  },


  //跳转详情页
  changedetail: function() {
    wx.navigateTo({
      url: '../friend/detail',
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
    //我的现金总收益
    if (wx.getStorageSync('myuserId')) {
      $.http({
        url: wx.getStorageSync('domain') + '/sys/jgjprofit/loginMyFriend',
        method: 'GET',
        data: {
          user_Id: wx.getStorageSync('myuserId'),
        }
      }).then(res => {
        this.setData({
          money: res.JgjProfitEntity.profitMoney / 100 //我的现金收益
        })
      }).catch(err => {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
      })
    }
    //获取我的好友数据列表
    if (wx.getStorageSync('myuserId')) {
      $.http({
        url: wx.getStorageSync('domain') + '/sys/jgjprofit/getMyFriendList',
        method: 'GET',
        data: {
          user_id: wx.getStorageSync('myuserId')
        }
      }).then(res => {
        if (res.code == 0) {
          this.setData({
            friendList: res.UserList
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

  //修改用户好友的备注信息
  changeBezhu: function(e) {
    const {
      userid
    } = e.currentTarget.dataset
    // console.log(e.detail.value)
    // console.log(userid)
    $.http({
      url: wx.getStorageSync('domain') + '/api/user/updateUserRemarks',
      method: 'GET',
      data: {
        user_id: userid,
        remarks: e.detail.value
      }
    }).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '好友备注修改成功',
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