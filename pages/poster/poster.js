//获取应用实例
var $ = require("../../utils/http.js");
Page({

  data: {
    imageList: '/images/addImg.png',
  },

  //添加图片
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['orignal', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        let tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://jgj.jiaguanjiazx.com:8081/api/file/reciveIMG',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          success: function(res) {
            var obj = JSON.parse(res.data)
            that.setData({
              imageList: obj.data //用户头像
            })
          },
          fail: function() {
            console.log("fail");
          }
        });
      },
      fail: function() {
        console.log("fail");
      },
      complete: function() {
        console.log("complete");
      }
    })
  },

  //点击保存图片
  saveAll: function(e) {
    var that = this;
    var info = e.detail.value
    //请求服务器
    $.http({
      url: wx.getStorageSync('domain') + '/api/PersonCard/getCustomPoster?posterIMGURL=' + that.data.imageList + '&content=' + info.info,
      method: 'GET'
    }).then(res => {
      if (res.code == 0) {
        //保存图片
        that.setData({
          imgUrl: res.data
        })
        //若二维码未加载完毕，加个动画提高用户体验
        wx.showToast({
          icon: 'loading',
          title: '正在保存图片',
          duration: 1000
        })
        //判断用户是否授权"保存到相册"
        wx.getSetting({
          success(res) {
            //没有权限，发起授权
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() { //用户允许授权，保存图片到相册
                  that.savePhoto();
                },
                fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
                  wx.openSetting({
                    success() {
                      wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                          that.savePhoto();
                        }
                      })
                    }
                  })
                }
              })
            } else { //用户已授权，保存到相册
              that.savePhoto()
            }
          }
        })
      } else if (res.code == 500) {
        if (res.msg == "为保证合成效果,图片宽度不得低于500") {
          wx.showToast({
            icon: 'none',
            title: '图片宽度不得低于500',
          })
        }
      }
    }).catch(err => {
      wx.showToast({
        title: '请求失败请稍候',
        icon: 'none',
        duration: 2000,
      })
    })
  },

  //保存图片到相册，提示保存成功
  savePhoto() {
    let that = this
    wx.downloadFile({
      url: that.data.imgUrl,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: "success",
              duration: 1000
            })
            wx.navigateBack({
              delat: 1
            })
          }
        })
      }
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