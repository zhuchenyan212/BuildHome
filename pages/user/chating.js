var $ = require("../../utils/http.js");
var utils = require("../../utils/util.js")

Page({
  data: {
    sendInfo: '', //获取发送的信息
    infoList: [], //获取消息列表
    senMessage: [] //发送消息列表
  },

  onLoad: function(options) {
    console.log(options.user)
    //建立连接
    wx.connectSocket({
      url: "wss://jgj.jiaguanjiazx.com:8081/websocket/" + options.user,
    })
    //连接成功
    wx.onSocketOpen(function() {
      console.log('连接成功');
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
    console.log(that.data.sendInfo)
    wx.sendSocketMessage({
      data: that.data.sendInfo
    });
    var senMessages = [];
    senMessages.push(that.data.sendInfo)
    console.log(senMessages)
    that.setData({
      senMessage: senMessages
    })
  },
  onShow: function() {
    var that = this;
    var infoList = [];
    //获取聊天信息
    wx.onSocketMessage(function(res) {
      console.log(res.data)
      infoList.push(res.data)
      that.setData({
        infoList: infoList
      })
      console.log("收到服务器内容：" + JSON.stringify(res))
    })
  }
})