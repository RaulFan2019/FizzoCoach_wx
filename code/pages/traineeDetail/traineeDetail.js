// traineeDetail.js
var moment = require('../../libs/moment/we-moment-with-locales');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: [
      '/assets/img/户外跑步@2x.png',
      '/assets/img/室内健身@2x.png',
      '/assets/img/记录来自HUB_icon@2x.png',
      '/assets/img/跑步机@2x.png',
      '/assets/img/爬楼机@2x.png',
      '/assets/img/动感单车@2x.png',
      '/assets/img/椭圆机@2x.png',
      '/assets/img/划船机@2x.png',
      '/assets/img/小器械@2x.png',
    ],
    userDefault: {
      nickname: '--',
      avatar: '../../assets/img/missing_face_all.png',
    },
    trainee: {},
    moverid: '',
    oldtrainee: {},
    more: true,
    size: 10,
    increment: 20,
    binded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
    this.setData({
      moverid: options.moverid
    });
    this.getMoverInfo(options.moverid);
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
 * 查看更多
 */
  loadMore: function (e) {
    var __this__ = this;
    var todayworkouts = __this__.data.oldtrainee.todayworkouts;
    var size = __this__.data.size + __this__.data.increment;
    wx.showLoading({
      title: '数据加载中',
    });

    setTimeout(function () {
      wx.hideLoading();
      __this__.setData({
        'size': size,
        'trainee.todayworkouts': todayworkouts.slice(0, size)
      });
      if (size >= __this__.data.oldtrainee.todayworkouts.length) {
        __this__.setData({
          'more': false,
          'size': __this__.data.oldtrainee.todayworkouts.length
        });
      }
    }, 1500);
  },

  /**
   * 查看详细信息
   */
  checkDetail: function () {
    var moverid = this.data.moverid;
    wx.navigateTo({
      url: '../traineeProfileEdit/traineeProfileEdit?moverid=' + moverid,
    });
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
          
          if (trainee.hrdevice && trainee.hrdevice.deviceid) {
            __this__.setData({
              'binded': true
            });
          } else {
            __this__.setData({
              'binded': false
            });
          }

          trainee.todayworkouts.forEach(function (v, k) {
            v.starttime = moment(v.starttime).format('YYYY.MM.DD HH:mm');
            v.endtime = moment(v.endtime).format('HH:mm');
          });

          __this__.setData({
            'oldtrainee': trainee
          });

          if (trainee.todayworkouts.length >= __this__.data.size) {
            trainee.todayworkouts.length = __this__.data.size;
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
            url: app.globalData.host + '/fitness/V2/Club/unbindStoreHrdevice?storeid=' + app.globalData.userInfo.storeid + '&deviceid=' + __this__.data.trainee.hrdevice.deviceid,
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
                      'binded': false
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
   * 去绑定设备
   */
  bindDevice: function() {
    var moverid = this.data.moverid;
    var nickname = this.data.trainee.nickname;
    wx.navigateTo({
      url: '../selectHrDevice/selectHrDevice?moverid=' + moverid + '&nickname=' + nickname,
    });
  }
})