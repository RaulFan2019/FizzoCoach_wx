// traineeProfileEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeid: '',
    moverid: '',
    trainee: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
    this.getMoverInfo(options.moverid);
    var app = getApp();

    this.setData({
      moverid: options.moverid,
      storeid: app.globalData.userInfo.storeid
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
    this.getMoverInfo(this.data.moverid);
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
   * 从localStorage读取trainee信息
   */
  getTraineeInfo: function () {
    var __this__ = this;
    wx.getStorage({
      key: 'trainee',
      success: function (res) {
        __this__.setData({
          'trainee': res.data
        });
      },
      fail: function () {
        //如果localStorage中没有信息，则从后台API获取

      }
    })
  },

  /**
   * 获取学员信息
   */
  getMoverInfo: function (moverid) {
    var __this__ = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/Club/getStoreMoverTodayDynamic?storeid=' + app.globalData.userInfo.storeid + '&moverid=' + moverid,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.data.errorcode === 0) {
          var trainee = res.data.result;
          __this__.setData({
            'trainee': trainee
          });
          wx.hideLoading();
        }
      }
    });
  }
})