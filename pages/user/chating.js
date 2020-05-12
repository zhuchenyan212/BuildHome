var $ = require("../../utils/http.js");
var utils = require("../../utils/util.js")

Page({
  data: {
    navMenu: ['发送'],
    date: utils.formatTime(new Date()), //聊天时间
    sendInfo: '', //获取发送的信息
    infoList: [], //获取消息列表
    senMessages: [], //发送消息列表
    historyInfo: [], //历史聊天记录
    user: '', //业务员id
    avatarurl: '', //自己头像
    salesimg: '', //业务员头像
    myuserId: '', //用户自己id
    height: '',
    scrollTop: 0
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      user: options.user
    })
    //建立连接
    wx.connectSocket({
      url: "wss://jgj.jiaguanjiazx.com:8081/websocket/" + wx.getStorageSync('myuserId'),
    })
    //连接成功
    wx.onSocketOpen(function() {
      console.log('连接成功');
    })
    // 监测连接关闭
    wx.onSocketClose(function(res) {
      console.log('WebSocket 已关闭！')
    })
    // 监测连接错误
    wx.onSocketError(function(res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
  },

  //获取发送的信息
  bindChange: function(e) {
    var that = this
    that.setData({
      sendInfo: e.detail.value
    })
  },

  //发送消息
  send: function() {
    var that = this;
    wx.sendSocketMessage({
      data: that.data.sendInfo + '|' + that.data.user
    })
    // 清空输入框
    this.setData({
      sendInfo: ''
    })
    //获取聊天时间
    //获取发送时间
    if (utils.formatTime(new Date())) {
      that.setData({
        date: utils.formatTime(new Date()),
      })
    }
    setTimeout(() => {
      that.applyHistory()
    }, 500);
  },

  onShow: function() {
    var that = this;
    var infoList = [];
    //获取聊天信息
    wx.onSocketMessage(function(res) {
      infoList.push(res.data)
      that.setData({
        infoList: infoList
      })
      console.log("收到服务器内容：" + JSON.stringify(res))
    })
    that.applyHistory()

    that.setData({
      avatarurl: wx.getStorageSync('avatarurl'), //自己头像
      salesimg: wx.getStorageSync('salesimg'), //业务员头像
      myuserId: wx.getStorageSync('myuserId'), //用户自己id
    })
  },

  // 获取历史聊天记录
  applyHistory: function() {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/getChatLog?userId=' + that.data.user,
      method: 'GET'
    }).then(res => {
      // 自动滑动到页面底部
      // 获取当前窗口的高度
      var height = wx.getSystemInfoSync().windowHeight;
      that.setData({
        historyInfo: res.data,
      })
      wx.pageScrollTo({
        'scrollTop': res.data.length * 380,
        'duration': 200
      })
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  //滑动页面
  onPageScroll: function(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },

})