// trainingDetail.js
var wxCharts = require('../../libs/wxcharts-min');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    chartTitle: '锻炼详情',
    isMainChartDisplay: true,
    workout: {},
    efforts: {},
    workoutid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    });
    wx.setNavigationBarTitle({
      title: options.time
    })
    // 4168836
    this.setData({
      workoutid: options.workoutid
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getWorkoutInfo(this.data.workoutid);
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
   * 获取锻炼记录
   */
  getWorkoutInfo: function (id) {
    var __this__ = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/Workout/getWorkoutInfo?workoutid=' + id,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.data.errorcode === 0) {
          var workout = res.data.result;
          
          var maxHr = workout.max_hr;
          workout.hr50 = parseInt(maxHr * 0.5);
          workout.hr60 = parseInt(maxHr * 0.6);
          workout.hr70 = parseInt(maxHr * 0.7);
          workout.hr80 = parseInt(maxHr * 0.8);
          workout.hr90 = parseInt(maxHr * 0.9);
          workout.hr100 = maxHr;

          workout.hr_zones.forEach(function (v, k) {
            if (v.hr_zone == 0) {
              v.hrrange = '<' + workout.hr50;
            }

            if (v.hr_zone == 1) {
              v.hrrange = workout.hr50 + '~' + workout.hr60
            }

            if (v.hr_zone == 2) {
              v.hrrange = workout.hr60 + '~' + workout.hr70
            }

            if (v.hr_zone == 3) {
              v.hrrange = workout.hr70 + '~' + workout.hr80
            }

            if (v.hr_zone == 4) {
              v.hrrange = workout.hr80 + '~' + workout.hr90
            }

            if (v.hr_zone == 5) {
              v.hrrange = workout.hr90 + '~' + maxHr
            }
          });

          __this__.setData({
            'workout': workout,
            'efforts': workout.efforts
          });

          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }

          var avgEffort = [];
          var timr = [];

          var efforts = __this__.data.efforts;

          efforts.forEach(function (v, i) {
            timr.push('');
            avgEffort.push(v.avg_effort);
          });
        
          new wxCharts({
            canvasId: 'barChart',
            type: 'column',
            categories: timr,
            series: [{
              name: '强度',
              data: avgEffort
            }],
            xAxis: {
              gridColor: '#E5E5E5',
              disableGrid: true
            },
            yAxis: {
              disabled: false,
              format: function () {
                return ''
              }
            },
            width: 290,
            height: 177,
            legend: false,
            dataLabel: false
          });

          new wxCharts({
            canvasId: 'ringChart',
            type: 'ring',
            series: [{
              name: '非锻炼区',
              color: '#CFCFCF',
              data: __this__.data.workout.hr_zones[0].minutes,
            }, {
              name: '热身',
              color: '#00DEBF',
              data: __this__.data.workout.hr_zones[1].minutes,
            }, {
              name: '有氧减脂',
              color: '#98E961',
              data: __this__.data.workout.hr_zones[2].minutes,
            }, {
              name: '增强心肺',
              color: '#F5AB00',
              data: __this__.data.workout.hr_zones[3].minutes,
            }, {
              name: '提升耐力',
              color: '#F47002',
              data: __this__.data.workout.hr_zones[4].minutes,
            }, {
              name: '竞技训练',
              color: '#F5452D',
              data: __this__.data.workout.hr_zones[5].minutes,
            }],
            width: 177,
            height: 225,
            dataLabel: false,
            legend: false,
            disablePieStroke: true,
            extra: {
              ringWidth: 18
            }
          });

          wx.hideLoading();
        }
      }
    });
  }
})