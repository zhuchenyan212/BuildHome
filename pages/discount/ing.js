//获取应用实例
var $ = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    daoji: true, //倒计时
    page: 1, //页码
    proList: [], //可砍价的商品
    userkanList: [], //用户正在参与的砍价商品
  },

  //用户发起砍价
  changeurl: function (e) {
    wx.showModal({
      title: '砍价提示',
      content: '您是否确定对此商品进行砍价？',
      success: function (res) {
        if (res.confirm) {
          $.http({
            url: wx.getStorageSync('domain') + '/sys/jgjuserbargain/launchForBargain',
            method: 'GET',
            data: {
              goodsId: e.currentTarget.dataset.id,
              userId: wx.getStorageSync('myuserId')
            }
          }).then(res => {
            if (res.code == 0) {
              wx.showToast({
                title: '您已成功对当前商品发起砍价',
                icon: 'none',
                duration: 2000,
              })
              //跳转至首页
              wx.switchTab({
                url: '../index/index',
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
      fail: function (res) {
        wx.showToast({
          title: '您取消了操作',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },

  //获取砍价商品的数据
  getData: function (page, id) {
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/jgjgoods/selectJgjBargainGoods',
      method: 'GET',
      data: {
        page: page,
        userId: id
      }
    }).then(res => {
      var array = []
      for (var i = 0; i < res.UserBargainGoodsList.length; i++) {
        res.UserBargainGoodsList[i]["day"] = Math.floor(res.UserBargainGoodsList[i].detail.split(":")[0] / 24)//天数
        res.UserBargainGoodsList[i]["hour"] = Math.floor(((((res.UserBargainGoodsList[i].detail.split(":")[0] / 24).toFixed(2)).toString().replace(/\d+\.(\d*)/, "$1") / 100) * 60 + Number(res.UserBargainGoodsList[i].detail.split(":")[1])) / 60) //小时
        res.UserBargainGoodsList[i]["minute"] = ((((((((res.UserBargainGoodsList[i].detail.split(":")[0] / 24).toFixed(2)).toString().replace(/\d+\.(\d*)/, "$1") / 100) * 60 + Number(res.UserBargainGoodsList[i].detail.split(":")[1])) / 60).toFixed(2)).toString().replace(/\d+\.(\d*)/, "$1") / 100) * 60).toFixed(0) //分钟
        array.push(res.UserBargainGoodsList[i])
      } console.log(array)
      this.setData({
        userkanList: array //用户正在参与的砍价商品
      })
      //两个json对象相比较去除相同的
      for (var m in res.userBargainEntity) {
        for (var k in res.JgjBargainGoods) {
          if (res.userBargainEntity[m].bargainGoodsId == res.JgjBargainGoods[k].id) {
            res.JgjBargainGoods.splice(k, 1)
          }
        }
      }
      // console.log(res.JgjBargainGoods);
      this.setData({
        page: page, //当前页码
        proList: this.data.proList.concat(res.JgjBargainGoods), //可砍价的商品
      })
    }).catch(err => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000,
      })
    })
  },

  //砍价时间、
  // countSecondsTime: function (endTime) {
  //   let self = this
  //   self.setData({
  //     timer: setInterval(function () {
  //       var date = new Date();
  //       var now = date.getTime();
  //       var currentY = date.getFullYear()
  //       var currentM = date.getMonth() + 1
  //       var currentD = date.getDate()
  //       var endCutTime = currentY + '-' + currentM + '-' + currentD + ' ' + endTime
  //       var endDate = new Date(endCutTime); //设置截止时间
  //       var end = endDate.getTime();
  //       var leftTime = end - now; //时间差              
  //       let h = Math.floor(leftTime / 1000 / 60 / 60)
  //       let m = Math.floor(leftTime / 1000 / 60 % 60)
  //       let s = Math.floor(leftTime / 1000 % 60)
  //       if (leftTime > 0) {
  //         if (s < 10) {
  //           s = "0" + s;
  //         }
  //         if (m < 10) {
  //           m = "0" + m;
  //         }
  //         if (h < 10) {
  //           h = "0" + h;
  //         }
  //         self.setData({
  //           hour: h,
  //           minute: m,
  //           second: s
  //         })
  //       } else {
  //         clearInterval(self.data.timer)
  //         if (self.data.hour == "00" && self.data.minute == "00" && self.data.second == "00") {
  //           self.onShow()
  //         }
  //       }
  //     }, 1000)
  //   })
  // },

  //进入砍价详情页面
  kanjiadetail: function (e) {
    const {
      id
    } = e.currentTarget.dataset
    console.log(id)
    // 进入砍价详情页面
    wx.navigateTo({
      url: '../discount/detail?id=' + id + '&user=' + wx.getStorageSync('myuserId'),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      id: wx.getStorageSync('myuserId')
    })

    // 请求砍价商品
    if (wx.getStorageSync('myuserId')) {
      this.getData(this.data.page, wx.getStorageSync('myuserId'))
    }
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
    var page = this.data.page
    this.setData({
      page: page + 1,
    })
    this.getData(page + 1, wx.getStorageSync('myuserId'))
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})