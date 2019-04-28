// deviceBinding.js
var moment = require('../../libs/moment/we-moment-with-locales');
var Utils = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    userDefault: {
      nickname: '--',
      avatar: '/assets/img/missing_face_all.png',
    },
    trainee: [],
    oldtrainee: [],
    searching: false,
    more: true,
    size: 10,
    increment: 20,
    device: {
      name: '',
      id: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
    this.getStoreMoverList();
    this.setData({
      'device.name': options.devicename,
      'device.id': options.deviceid
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 获取待绑定设备
   */
  getBindingDevice: function () {
    var __this__ = this;
    wx.getStorage({
      key: 'device',
      success: function (res) {
        __this__.setData({
          'device': res.data
        });
      }
    });
  },

  /**
   * 获取门店学员列表
   */
  getStoreMoverList: function () {
    var __this__ = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/Club/getStoreMoverList?storeid=' + app.globalData.userInfo.storeid,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        if (data.errorcode === 0) {
          var trainee = data.result.movers.reverse();
          trainee.forEach(function (v, k) {
            v.mobile = Utils.IsPhoneNumber(v.mobile) ? v.mobile : '';
            v.jointime = moment(v.jointime).format('YYYY.MM.DD');
          });
          __this__.setData({
            'oldtrainee': trainee
          });

          if (trainee.length >= __this__.data.size) {
            trainee.length = __this__.data.size;
          }

          __this__.setData({
            'trainee': trainee
          });
          wx.hideLoading();
        }
      }
    });
  },

  /**
   *  本地查询学员
   */
  queryMoverListLocal: function (str) {
    var __this__ = this;
    var trainee = __this__.data.oldtrainee;
    var str = str.toLowerCase();
    if (str) {
      var filtered = trainee.filter(function (v, k, arr) {
        return v.nickname.toLowerCase().indexOf(str) > -1 || v.mobile.toLowerCase().indexOf(str) > -1
      });
      __this__.setData({
        'trainee': filtered,
        'searching': true
      });
    }
  },

  /**
   * 查看更多
   */
  loadMore: function (e) {
    var __this__ = this;
    var trainee = __this__.data.oldtrainee;
    var size = __this__.data.size + __this__.data.increment;
    wx.showLoading({
      title: '数据加载中',
    });

    setTimeout(function () {
      wx.hideLoading();
      if (size <= __this__.data.oldtrainee.length) {
        __this__.setData({
          'size': size,
          'trainee': trainee.slice(0, size)
        });
      } else {
        __this__.setData({
          'more': false,
          'size': __this__.data.oldtrainee.length
        });
      }
    }, 1500);
  },

  /**
   * 图片加载错误
   */
  imageError: function (e) {
    // console.log(e);
    var __this__ = this;
    if (e.detail.errMsg) {
      var trainee = __this__.data.oldtrainee;
      var idx = e.target.id;
      trainee.forEach(function (v, k) {
        if (k == idx) {
          v.avatar = __this__.data.userDefault.avatar;
        }
      });

      __this__.setData({
        'trainee': trainee,
        'oldtrainee': trainee
      });
    }
  },

  /**
   * 手环绑定至
   */
  bindToTrainee: function (e) {
    var __this__ = this;
    var app = getApp();
    // console.log(e.currentTarget.id);
    wx.showModal({
      title: '绑定提示',
      content: '将' + __this__.data.device.name + '绑定至健身学员' + e.currentTarget.dataset.nickname,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.host + '/fitness/V2/Club/bindStoreHrdevice?storeid=' + app.globalData.userInfo.storeid + '&deviceid=' + __this__.data.device.id + '&moverid=' + e.currentTarget.id,
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

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      trainee: __this__.data.oldtrainee
    });
  },

  clearInput: function () {
    var __this__ = this;
    __this__.setData({
      inputVal: "",
      trainee: __this__.data.oldtrainee
    });
  },

  inputTyping: function (e) {
    var __this__ = this;
    if (e.detail.value) {
      __this__.setData({
        inputVal: e.detail.value
      });
      __this__.queryMoverListLocal(e.detail.value);
    } else {
      __this__.setData({
        trainee: __this__.data.oldtrainee.slice(0, 20),
        more: true
      });
    }
  }
})