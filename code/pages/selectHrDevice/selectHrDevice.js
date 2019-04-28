// selectHrDevice.js
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
    more: true,
    size: 10,
    increment: 20,
    moverid: '',
    searching: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
    this.setData({
      moverid: options.moverid,
      nickname: options.nickname
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

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    var __this__ = this;
    this.setData({
      inputVal: "",
      inputShowed: false,
      searching: false,
      hrdevices: __this__.data.oldhrdevices
    });
  },

  clearInput: function () {
    var __this__ = this;
    __this__.setData({
      inputVal: "",
      searching: false,
      hrdevices: __this__.data.oldhrdevices
    });
  },

  inputTyping: function (e) {
    var __this__ = this;
    if (e.detail.value) {
      __this__.setData({
        inputVal: e.detail.value
      });
      __this__.queryWareHrdeviceLocal(e.detail.value);
    } else {
      __this__.setData({
        hrdevices: __this__.data.oldhrdevices.slice(0, 20),
        more: true
      });
    }
  },

  /**
   * 本地查询设备
   */
  queryWareHrdeviceLocal: function (str) {
    var __this__ = this;
    var hrdevices = __this__.data.oldhrdevices;
    var str = str.toLowerCase();
    if (str) {
      var filtered = hrdevices.filter(function (v, k, arr) {
        return v.name.toLowerCase().indexOf(str) > -1 || v.serialno.toLowerCase().indexOf(str) > -1
      });
      __this__.setData({
        'hrdevices': filtered,
        'searching': true
      });
    }
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

          if (hrdevices.length >= __this__.data.size) {
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
  * 手环绑定至
  */
  bindToTrainee: function (e) {
    var __this__ = this;
    var app = getApp();

    wx.showModal({
      title: '绑定提示',
      content: '将' + e.currentTarget.dataset.devicename + '绑定至学员' + __this__.data.nickname + '?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.host + '/fitness/V2/Club/bindStoreHrdevice?storeid=' + app.globalData.userInfo.storeid + '&deviceid=' + e.currentTarget.id + '&moverid=' + __this__.data.moverid,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
              if (res.data.errorcode === 0) {
                wx.showToast({
                  title: '已成功绑定',
                  icon: 'success',
                  duration: 3000,
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      });
                    }, 1000);
                  }
                })
              } else {
                console.log(res.data.errormsg);
                console.log('绑定失败')
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
  }
})