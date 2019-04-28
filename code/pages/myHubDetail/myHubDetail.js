// myHubDetail.js
var moment = require('../../libs/moment/we-moment-with-locales');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      hub: '/assets/img/hub.png',
      hubbg: '/assets/img/hub_bg.png'
    },
    hub: {
      hubid: '',
      hubname: '',
      hrmode: '',
      serialno: '',
      registertime: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
    this.setData({
      'hub.hubid': options.hubid
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
    this.getStoreHubList(this.data.hub.hubid);
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
   * 修改hub名称
   */
  changeHubName: function () {
    var __this__ = this;

    wx.navigateTo({
      url: '../changeHubName/changeHubName?hubid=' + __this__.data.hub.hubid + '&hubname=' + __this__.data.hub.hubname + '&hrmode=' + __this__.data.hub.hrmode + '&serialno=' + __this__.data.hub.serialno + '&registertime=' + __this__.data.hub.registertime
    });
  },

  /**
   * 修改hub心率模式
   */
  changeHubHrMode: function () {
    var __this__ = this;

    wx.navigateTo({
      url: '../changeHubHrMode/changeHubHrMode?hubid=' + __this__.data.hub.hubid + '&hubname=' + __this__.data.hub.hubname + '&hrmode=' + __this__.data.hub.hrmode + '&serialno=' + __this__.data.hub.serialno + '&registertime=' + __this__.data.hub.registertime
    });
  },

  /**
   * 获取hub详细
   */
  getStoreHubList: function (hubid) {
    var __this__ = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/Club/getStoreHubList?storeid=' + app.globalData.userInfo.storeid,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        // console.log(res.data.result);
        if (res.data.errorcode === 0) {
          var hubs = res.data.result.hubs.filter(function (v, k) {
            return v.id == hubid;
          });
          
          hubs.forEach(function (v, k) {
            v.registertime = moment(v.registertime).format('YYYY.MM.DD');
            if (v.name == v.serialno){
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
            'hub.hubname': hubs[0].name,
            'hub.hrmode': hubs[0].hrmode,
            'hub.serialno': hubs[0].serialno,
            'hub.registertime': hubs[0].registertime
          });
          wx.hideLoading();
        }
      }
    });
  },
})