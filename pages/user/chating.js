var $ = require("../../utils/http.js");
var utils = require("../../utils/util.js")

Page({
  data: {
    date: '', //聊天时间
    sendInfo: '', //获取发送的信息
    infoList: [], //获取消息列表
    senMessages: [], //发送消息列表
    user: '', //业务员
    avatarurl: wx.getStorageSync('avatarurl'), //自己头像
    salesimg: wx.getStorageSync('salesimg'), //业务员头像
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      user: options.user
    })
    //建立连接
    wx.connectSocket({
      url: "wss://jgj.jiaguanjiazx.com:8081/websocket/" + options.user,
    })
    //连接成功
    wx.onSocketOpen(function() {
      console.log('连接成功');
    })
    // 监测连接关闭
    wx.onSocketClose(function(res) {
      console.log(res)
      console.log('WebSocket 已关闭！')
    })
    // 监测连接错误
    wx.onSocketError(function(res) {
      console.log(res)
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

    // 将用户发送的消息凭借数组
    var senMessages = that.data.senMessages;
    senMessages.push(that.data.sendInfo)
    that.setData({
      senMessages: senMessages
    })

    // 清空输入框
    this.setData({
      sendInfo: ''
    })

    // 获取聊天时间
    //获取发送时间
    if (utils.formatTime(new Date())) {
      that.setData({
        date: utils.formatTime(new Date()),
      })
    }

    // 关闭
    // wx.closeSocket()
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
  }
})