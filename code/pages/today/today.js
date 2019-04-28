// today.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      ingIcon: '/assets/img/ing.png',
      rankingIcon: '/assets/img/ranking.png',
      ranking1: '/assets/img/rank1.png',
      ranking2: '/assets/img/rank2.png',
      ranking3: '/assets/img/rank3.png',
      default: '/assets/img/missing_face_all.png'
    },
    club: null,
    movercount: 0,
    calorie: 0,
    points: 0,
    trainee: {
      ing: [],
      ranking: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
    var __this__ = this;
    __this__.authentication();
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
    this.getStoreTodayRanking();
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
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getStoreTodayRanking();
  },

  /**
   * 查看详情
   */
  checkDetail: function (e) {
    var app = getApp();
    wx.navigateTo({
      url: '../todayRanking/todayRanking?storeid=' + app.globalData.userInfo.storeid
    })
  },

  /**
   * 获取今日动态
   */
  getStoreTodayRanking: function () {
    var __this__ = this;
    var app = getApp();
    var userInfo = app.globalData.userInfo;

    if (userInfo && userInfo.storeid) {
      wx.request({
        url: app.globalData.host + '/fitness/V2/Club/getStoreTodayDynamic?storeid=' + userInfo.storeid,
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          if (res.data.errorcode === 0) {
            __this__.setData({
              'club': res.data.result.store,
              'movercount': res.data.result.movercount,
              'calorie': res.data.result.calorie,
              'points': res.data.result.points,
              'trainee.ing': res.data.result.movingmovers,
              'trainee.ranking': res.data.result.ranking
            });
            wx.hideLoading();
          }
        }
      });
    }
  },

  /**
  * 鉴权
  */
  authentication: function () {
    var __this__ = this;
    var app = getApp();
    var userInfo = app.globalData.userInfo;
    var resData = app.globalData.resData;
    var t = null;

    if (userInfo && userInfo.storeid) {
      clearTimeout(t);
      if (userInfo.role == 2 || userInfo.role == 3) {
        console.log('this user has been authed');
        __this__.getStoreTodayRanking();
      } else {
        console.log('this user has not been authed');
        wx.showModal({
          title: '提示',
          content: '您没有管理权限，请联系管理员',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../noAuth/noAuth'
              });
            }
          }
        });
      }
    } else {
      if (resData && resData.errorcode === 105) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '您没有管理权限，请联系管理员',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../noAuth/noAuth'
              });
            }
          }
        });
      } else {
        t = setTimeout(function () {
          wx.reLaunch({
            url: '../today/today'
          });
        }, 3000);
      }
    }
  }
})