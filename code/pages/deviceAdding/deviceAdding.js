// deviceAdding.js
var moment = require('../../libs/moment/we-moment-with-locales');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    tipShowed: true,
    icon: {
      ringIcon: '/assets/img/ring.png',
      searchingIcon: '/assets/img/searching.png'
    },
    hrdevices: [],
    noresult: false,
    btndisabled: true
  },

  /**
   * 监听input事件
   */
  inputTyping: function (e) {
    var __this__ = this;
    if (e.detail.value.length === 4) {
      __this__.setData({
        inputVal: e.detail.value,
        btndisabled: false
      });
    } else {
      __this__.setData({
        btndisabled: true,
        noresult: false,
        tipShowed: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var __this__ = this;

    __this__.setData({
      inputShowed: false,
      inputVal: "",
      tipShowed: true,
      noresult: false,
      btndisabled: true
    });
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
   * 确定按钮
   */
  confirmQuery: function () {
    var __this__ = this;
    wx.showLoading({
      title: '数据加载中',
    });
    this.queryWareHrdevice(__this__.data.inputVal);
  },

  /**
   * 设备库中查询设备
   */
  queryWareHrdevice: function (name) {
    var __this__ = this;
    var app = getApp();

    if (name) {
      wx.request({
        url: app.globalData.host + '/fitness/V2/Club/queryWareHrdevice?devicename=' + name,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          // console.log(JSON.stringify(res.data));
          if (res.data.errorcode === 0) {
            var hrdevices = res.data.result.hrdevices;
            if (hrdevices.length > 0) {
              __this__.setData({
                hrdevices: hrdevices,
                tipShowed: false
              });
            } else {
              __this__.setData({
                tipShowed: false,
                noresult: true
              });
            }
          } else {
            __this__.setData({
              noresult: true
            });
          }
          wx.hideLoading();
        }
      });
    }
  },

  /**
   * 添加到我的设备
   */
  addToMyDevice: function (e) {
    var app = getApp();
    var __this__ = this;

    if (e.currentTarget.id) {
      wx.showModal({
        title: '添加提示',
        content: '将' + __this__.data.inputVal + '手环添加到门店',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.host + '/fitness/V2/Club/addStoreHrdevice?storeid=' + app.globalData.userInfo.storeid + '&deviceid=' + e.currentTarget.id,
              method: 'GET',
              dataType: 'json',
              success: function (res) {
                // console.log(JSON.stringify(res.data));
                if (res.data.errorcode === 0) {
                  wx.navigateTo({
                    url: '../msgSuccess/msgSuccess?devicename=' + __this__.data.inputVal,
                  });
                } else {
                  wx.navigateTo({
                    url: '../msgFail/msgFail?devicename=' + __this__.data.inputVal,
                  });
                }
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }
  }
})