// todayRanking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["千卡", "点数", "分钟"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: 96,
    icon: {
      ranking1: '/assets/img/rank1.png',
      ranking2: '/assets/img/rank2.png',
      ranking3: '/assets/img/rank3.png',
      default: '/assets/img/missing_face_all.png'
    },
    ranking: [],
    oldranking: [],
    size: 10,
    increment: 20,
    more: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
    var __this__ = this;
    wx.getSystemInfo({
      success: function (res) {
        __this__.setData({
          sliderLeft: (res.windowWidth / __this__.data.tabs.length - __this__.data.sliderWidth) / 2,
          sliderOffset: res.windowWidth / __this__.data.tabs.length * __this__.data.activeIndex
        });
      }
    });
    this.getStoreTodayRanking(options.storeid);
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
    this.getStoreTodayRanking(this.data.storeid);
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
    this.getStoreTodayRanking(this.data.storeid);
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
   * 切换tab
   */
  tabClick: function (e) {
    var __this__ = this;
    __this__.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    var id = e.currentTarget.id;
    var rank = __this__.data.ranking;

    if (id == 0) {
      __this__.setData({
        'ranking': rank.sort(function (p, q) {
          return q.calorie - p.calorie;
        })
      });
    } else if (id == 1) {
      __this__.setData({
        'ranking': rank.sort(function (p, q) {
          return q.effort_point - p.effort_point;
        })
      });
    } else if (id == 2) {
      __this__.setData({
        'ranking': rank.sort(function (p, q) {
          return q.minutes - p.minutes;
        })
      });
    }
  },

  /**
   * 获取今日排行
   */
  getStoreTodayRanking: function (storeid) {
    var __this__ = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/Club/getStoreTodayRanking?storeid=' + storeid,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.data.errorcode === 0) {
          // console.log(JSON.stringify(res.data.result.ranking));
          var ranking = res.data.result.ranking;
          __this__.setData({
            'oldranking': ranking
          });

          if (ranking.length >= 10) {
            ranking.length = __this__.data.size;
          }

          __this__.setData({
            'ranking': ranking
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
    var ranking = __this__.data.oldranking;
    var size = __this__.data.size + __this__.data.increment;
    wx.showLoading({
      title: '数据加载中',
    });

    setTimeout(function () {
      wx.hideLoading();
      __this__.setData({
        'size': size,
        'ranking': ranking.slice(0, size)
      });
      if (size >= __this__.data.ranking.length) {
        __this__.setData({
          'more': false,
          'size': __this__.data.ranking.length
        });
      }
    }, 1500);
  }
})