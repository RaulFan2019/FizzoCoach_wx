// courseDetail.js
var moment = require('../../libs/moment/we-moment-with-locales');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      ranking1: '/assets/img/rank1.png',
      ranking2: '/assets/img/rank2.png',
      ranking3: '/assets/img/rank3.png',
      default: '/assets/img/missing_face_all.png'
    },
    groupTraining: {},
    oldgroupTraining: {},
    array: ['点数', '千卡', '强度', '时长'],
    index: 0,
    activeIndex: 0,
    size: 10,
    increment: 20,
    more: true,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
    this.setData({
      id: options.id
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
    this.getGroupTrainingRanking(this.data.id);
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
    this.getGroupTrainingRanking(this.data.id);
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
   * 类型切换
   */
  bindPickerChange: function (e) {
    var __this__ = this;
    __this__.setData({
      index: e.detail.value,
      activeIndex: e.detail.value
    })
    var idx = e.detail.value
    var gt = __this__.data.groupTraining.ranking;

    if (idx == 0) {
      __this__.setData({
        'groupTraining.ranking': gt.sort(function (p, q) {
          return q.effort_point - p.effort_point;
        })
      });
    } else if (idx == 1) {
      __this__.setData({
        'groupTraining.ranking': gt.sort(function (p, q) {
          return q.calorie - p.calorie;
        })
      });
    } else if (idx == 2) {
      __this__.setData({
        'groupTraining.ranking': gt.sort(function (p, q) {
          return q.avg_effort - p.avg_effort;
        })
      });
    } else if (idx == 3) {
      __this__.setData({
        'groupTraining.ranking': gt.sort(function (p, q) {
          return q.minutes - p.minutes;
        })
      });
    }
  },

  /**
   * 获取团课锻炼排名
   */
  getGroupTrainingRanking: function (id) {
    var __this__ = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/Club/getGroupTrainingRanking?id=' + id,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.data.errorcode === 0) {
          var groupTraining = res.data.result;
          groupTraining.ranking && groupTraining.ranking.forEach(function (v, k) {
            v.starttime = moment(v.starttime).format('YYYY.MM.DD HH:mm');
            v.finishtime = moment(v.finishtime).format('HH:mm');
          });
          
          __this__.setData({
            'oldgroupTraining': groupTraining
          });

          if (groupTraining.ranking && groupTraining.ranking.length >= __this__.data.size) {
            groupTraining.ranking.length = __this__.data.size;
          }

          __this__.setData({
            'groupTraining': groupTraining
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
    var groupTraining = __this__.data.oldgroupTraining;
    var size = __this__.data.size + __this__.data.increment;
    wx.showLoading({
      title: '数据加载中',
    });

    setTimeout(function () {
      wx.hideLoading();
      __this__.setData({
        'size': size,
        'groupTraining.ranking': groupTraining.ranking.slice(0, size)
      });
      if (size >= __this__.data.oldgroupTraining.ranking.length) {
        __this__.setData({
          'more': false,
          'size': __this__.data.oldgroupTraining.ranking.length
        });
      }
    }, 1500);
  }
})