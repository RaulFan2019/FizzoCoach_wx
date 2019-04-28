// myHub.js
var moment = require('../../libs/moment/we-moment-with-locales');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      hubIcon: '/assets/img/hub.png',
    },
    hub: [],
    oldhub: [],
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
    this.getStoreHubList();
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
    this.getStoreHubList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.more){
      this.loadMore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取门店HUB列表
   */
  getStoreHubList: function () {
    var __this__ = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/Club/getStoreHubList?storeid=' + app.globalData.userInfo.storeid,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        // console.log(res.data.result);
        if (res.data.errorcode === 0) {
          var hubs = res.data.result.hubs.reverse();
          hubs.forEach(function (v, k) {
            v.registertime = moment(v.registertime).format('YYYY.MM.DD');
            if (v.name == v.serialno) {
              v.name = 'HUB ' + v.serialno.substring(v.serialno.length - 4);
            }
            if (v.hrmode == 0) {
              v.hrmode = '随门店设置';
            } else if (v.hrmode == 1) {
              v.hrmode = '最大心率模式';
            } else if (v.hrmode == 2) {
              v.hrmode = '目标心率模式';
            }
          });
          
          __this__.setData({
            'oldhub': hubs
          });

          if (hubs.length >= 10) {
            hubs.length = __this__.data.size;
          }

          __this__.setData({
            'hub': hubs
          });
          wx.hideLoading();
        }
      }
    });
  },

  /**
   * 查看更多
   */
  loadMore: function (e) {
    var __this__ = this;
    var hub = __this__.data.oldhub;
    var size = __this__.data.size + __this__.data.increment;
    wx.showLoading({
        title: '数据加载中',
    });

    setTimeout(function () {
        wx.hideLoading();
        __this__.setData({
            'size': size,
            'hub': hub.slice(0, size)
        });

        if (size >= __this__.data.oldhub.length) {
            __this__.setData({
                'more': false,
                'size': __this__.data.oldhub.length
            });
        }
    }, 1500);
  },
})