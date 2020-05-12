//app.js
var $ = require("utils/http.js");
App({
  data: {
    host: '',
    toolips: {
      title: '',
      hideToolips: true, //提示框先设置隐藏
    },
    loading: {
      loadingHidden: false, // loading
      content: '加载中...'
    },
  },

  onLaunch: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) { })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showToast({
        title: '新版本下载失败',
        icon: 'none',
        duration: 2000,
      })
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
          title: '请求失败请稍候',
          icon: 'none',
          duration: 2000,
        })
      })
    }
  },

  onShow: function () {
    wx.setStorageSync('domain', 'https://jgj.jiaguanjiazx.com:8081');
  },

  //提示框弹窗
  showMsg: function (that, title, time) {
    var _time = time || 2000
    that.setData({
      toolips: {
        hideToolips: false,
        title: title
      }
    });
    setTimeout(() => {
      that.setData({
        toolips: {
          hideToolips: true,
          title: ""
        }
      })
    }, _time);
  },

  showToast: function (that, content, time) {
    var _time = time || 2000
    that.setData({
      loading: {
        loadingHidden: false,
        content: content
      }
    });
    setTimeout(() => {
      that.setData({
        loading: {
          loadingHidden: true,
          content: ""
        }
      })
    }, _time);
  },

  //防止多次点击
  buttonClicked: function (that) {
    that.setData({
      buttonClicked: true
    })
    setTimeout(() => {
      that.setData({
        buttonClicked: false
      })
    }, 1000)
  },

  //复制文本到剪切板
  setClipboard: function (self, text) {
    var that = this;
    wx.setClipboardData({
      data: text,
      success: function () {
        wx.getClipboardData({
          success: function (res) {
            that.showMsg(self, "文本已复制", 1200);
          }
        })
      }
    })
  },

  //多选框选中事件
  checkboxChange: function (that, index) {
    let listArr = that.data.list,
      n = parseInt(0); //选中的初始值;//当前对象索引值
    listArr[index].checked = !listArr[index].checked;
    for (var i = 0; i < listArr.length; i++) {
      if (listArr[i].checked) n++;
    }
    if (n == listArr.length) {
      that.data.selectedAllStatus = true;
    } else {
      that.data.selectedAllStatus = false;
    }
    that.setData({
      selectedAllStatus: that.data.selectedAllStatus,
      list: listArr
    });
  },

  //全选框点击事件
  bindSelectAll: function (that) {
    let selectedAllStatus = that.data.selectedAllStatus,
      listArr = that.data.list;
    selectedAllStatus = !selectedAllStatus;
    for (var i = 0; i < listArr.length; i++) {
      listArr[i].checked = selectedAllStatus
    }
    that.setData({
      selectedAllStatus: selectedAllStatus,
      list: listArr
    })
  },

  //计算浮点数相乘的方法
  //浮点数相乘
  mul: function (a, b) {
    var c = 0,
      d = a.toString(),
      e = b.toString();
    try {
      c += d.split(".")[1].length;
    } catch (f) { }
    try {
      c += e.split(".")[1].length;
    } catch (f) { }
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
  }
})
// "pagePath": "pages/category/index",