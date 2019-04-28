// changeHubName.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeid: '',
    hubid: '',
    hubname: '',
    hrmode: '',
    serialno: '',
    registertime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();

    this.setData({
      'storeid': app.globalData.userInfo.storeid,
      'hubid': options.hubid,
      'hubname': options.hubname,
      'hrmode': options.hrmode,
      'serialno': options.serialno,
      'registertime': options.registertime
    });

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 监听输入
   */
  bindKeyInput: function (e) {
    this.setData({
      'hubname': e.detail.value
    })
  },

  /**
   * 提交名称
   */
  changeHubName: function () {
    var __this__ = this;
    var app = getApp();

    if (__this__.data.hrmode == '随门店设置') {
      __this__.setData({
        'hrmode': 0
      });
    } else if (__this__.data.hrmode == '最大心率模式') {
      __this__.setData({
        'hrmode': 1
      });
    } else if (__this__.data.hrmode == '目标心率模式') {
      __this__.setData({
        'hrmode': 2
      });
    }

    if (__this__.data.hubname) {
      wx.request({
        url: app.globalData.host + '/fitness/V2/Club/updateStoreHub?storeid=' + __this__.data.storeid + '&hubid=' + __this__.data.hubid + '&name=' + __this__.data.hubname + '&hrmode=' + __this__.data.hrmode,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          if (res.data.errorcode === 0) {
            // console.log(res);
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 3000,
              success: function () {
                if (__this__.data.hrmode == 0) {
                  __this__.setData({
                    'hrmode': '随门店设置'
                  });
                } else if (__this__.data.hrmode == 1) {
                  __this__.setData({
                    'hrmode': '最大心率模式'
                  });
                } else if (__this__.data.hrmode == 2) {
                  __this__.setData({
                    'hrmode': '目标心率模式'
                  });
                }
                wx.navigateBack({
                  delta: 1
                });
              }
            });
          }
        }
      });
    } else {
      wx.showToast({
        title: '请输入名称',
        icon: 'loading',
        duration: 2000
      });
    }
  }
})