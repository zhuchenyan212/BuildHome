//获取应用实例
var $ = require("../../utils/http.js");

Page({
  data: {
    domain: wx.getStorageSync('domain'),
    swiper: [], //轮播图
    service: [], //服务类目
    active: [], //优惠活动
    news: [], //无缝滚动
    count: '', //参与人数
    enterPrise: '',
    afterSale: '',
  },

  onLoad: function() {
    var that = this;
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/index/indexPage',
      method: 'GET'
    }).then(res => {
      console.log(res)
      that.setData({
        count: res.count,
        swiper: res.jgjMerryGoRoundEntities,
        service: res.jgjServiceEntities,
        active: res.jgjActivityEntities,
        news: res.jgjTakePartInEntities,
        enterPrise: res.enterPrise,
        afterSale: res.afterSale
      })
      //全局缓存拨打号码
      wx.setStorageSync('telephone', res.tel);
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  }

})