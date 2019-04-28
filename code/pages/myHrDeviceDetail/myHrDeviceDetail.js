// myHrDeviceDetail.js
var moment = require('../../libs/moment/we-moment-with-locales');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      ring: '/assets/img/ring-half.png',
      ringIcon: '/assets/img/ring.png',
      default: '/assets/img/missing_face_all.png'
    },
    device: {},
    deviceId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
    this.setData({
      deviceId: options.deviceid
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
    this.getBindingDevice(this.data.deviceId);
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
   * 获取设备
   */
  getBindingDevice: function (deviceId) {
    var app = getApp();
    var __this__ = this;
    
    wx.request({
      url: app.globalData.host + '/fitness/V2/Club/getStoreHrdeviceList?storeid=' + app.globalData.userInfo.storeid,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        // console.log(JSON.stringify(res.data));
        if (res.data.errorcode === 0) {

          var devices = res.data.result.hrdevices.filter(function(v, k) {
            return v.id == deviceId;
          });

          devices.forEach(function (v, k) {
            v.setuptime = moment(v.setuptime).format('YYYY.MM.DD HH:mm');
            if (v.binduser.bindingtime) {
              v.binduser.bindingtime = moment(v.binduser.bindingtime).format('YYYY.MM.DD HH:mm');
              v.binded = true;
            } else {
              v.binded = false;
            }
          });

          __this__.setData({
            device: devices[0]
          });
          wx.hideLoading();
        }
      }
    });
  },

  /**
   * 绑定设备
   */
  bindingToTrainee: function () {
    wx.navigateTo({
      url: '../deviceBinding/deviceBinding?deviceid=' + this.data.device.id + '&devicename=' + this.data.device.name
    });
  },

  /**
   * 解除绑定
   */
  clearBinding: function () {
    var __this__ = this;
    var app = getApp();

    wx.showModal({
      title: '确认解除绑定',
      content: '解除绑定会解除该设备和学员的绑定关系',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.host + '/fitness/V2/Club/unbindStoreHrdevice?storeid=' + app.globalData.userInfo.storeid + '&deviceid=' + __this__.data.device.id,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
              if (res.data.errorcode === 0) {
                wx.showToast({
                  title: '已成功解除绑定',
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    __this__.setData({
                      'device.binded': false
                    });
                  }
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },

  /**
   * 删除设备
   */
  deleteDevice: function () {
    var __this__ = this;
    var app = getApp();

    wx.showModal({
      title: '确认删除设备',
      content: __this__.data.device.binded ? '删除设备会解除该设备和学员的绑定关系' : '',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.host + '/fitness/V2/Club/removeStoreHrdevice?storeid=' + app.globalData.userInfo.storeid + '&deviceid=' + __this__.data.device.id,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
              if (res.data.errorcode === 0) {
                wx.removeStorage({
                  key: 'device',
                  success: function (res) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  }

})