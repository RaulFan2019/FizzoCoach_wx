// myHrDevice.js
var moment = require('../../libs/moment/we-moment-with-locales');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      ringIcon: '/assets/img/ring.png',
      default: '/assets/img/missing_face_all.png'
    },
    hrdevices: [],
    oldhrdevices: [],
    more: true,
    size: 10,
    increment: 20
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getStoreHrdeviceList();
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
    this.getStoreHrdeviceList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.more) {
      this.loadMore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取设备列表
   */
  getStoreHrdeviceList: function () {
    var app = getApp();
    var __this__ = this;

    wx.request({
      url: app.globalData.host + '/fitness/V2/Club/getStoreHrdeviceList?storeid=' + app.globalData.userInfo.storeid,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        // console.log(JSON.stringify(res.data));
        if (res.data.errorcode === 0) {
          var hrdevices = res.data.result.hrdevices;
          hrdevices.forEach(function (v, k) {
            v.setuptime = moment(v.setuptime).format('YYYY.MM.DD HH:mm');
            if (v.binduser.bindingtime) {
              v.binduser.bindingtime = moment(v.binduser.bindingtime).format('YYYY.MM.DD HH:mm');
              v.binded = true;
            } else {
              v.binded = false;
            }
          });

          __this__.setData({
            'oldhrdevices': hrdevices
          });

          if (hrdevices.length >= __this__.data.size){
            hrdevices.length = __this__.data.size;
          }

          __this__.setData({
            'hrdevices': hrdevices
          });
          wx.hideLoading();
        }
      }
    });
  },
  
  /**
   * 设备搜索
   */
  deviceSearching: function () {
    wx.navigateTo({
      url: '../deviceSearching/deviceSearching'
    })
  },

  /**
   * 添加设备
   */
  deviceAdding: function () {
    wx.navigateTo({
      url: '../deviceAdding/deviceAdding'
    })
  },

  /**
   * 查看更多
   */
  loadMore: function (e) {
    var __this__ = this;
    var hrdevices = __this__.data.oldhrdevices;
    var size = __this__.data.size + __this__.data.increment;
    wx.showLoading({
        title: '数据加载中',
    });

    setTimeout(function () {
        wx.hideLoading();
        __this__.setData({
            'size': size,
            'hrdevices': hrdevices.slice(0, size)
        });
        if (size >= __this__.data.hrdevices.length) {
            __this__.setData({
                'more': false,
                'size': __this__.data.hrdevices.length
            });
        }
    }, 1500);
  },

  /**
   * 解绑全部
   */
  clearBindingAll(e) {
    var app = getApp();
    var __this__ = this;

    wx.request({
      url: app.globalData.host + '/fitness/V2/Club/unbindStoreAllHrdevice?storeid=' + app.globalData.userInfo.storeid,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        if (res.data.errorcode === 0) {
          let hrdevices = __this__.data.hrdevices;
          let oldhrdevices = __this__.data.oldhrdevices;
          hrdevices.map(item => item.binded = false);
          oldhrdevices.map(item => item.binded = false);
          __this__.setData({
            'hrdevices': hrdevices,
            'oldhrdevices': oldhrdevices
          });
        }
      }
    });
  }
})