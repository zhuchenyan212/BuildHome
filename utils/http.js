export function http({
  url,
  method,
  data,
}) {
  const promise = new Promise(function(resolve, reject) {
    wx.hideLoading();
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('user'),
      },
      url: url,
      method,
      data,
      success: (res) => {
        wx.hideLoading();
        resolve(res.data);
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
  return promise;
}