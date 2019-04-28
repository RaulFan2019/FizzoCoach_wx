// report.js
var Utils = require('../../utils/util');
var moment = require('../../libs/moment/we-moment-with-locales');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectedDate: '',//选中的几月几号
        selectedWeek: '',//选中的星期几,
        hasDate: '2017-6-21', //有记录的日期
        curYear: 2017,//当前年份
        curMonth: 0,//当前月份
        daysCountArr: [// 保存各个月份的长度，平年
            31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ],
        weekArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dateList: [],
        calendar: [],
        selectedDayTraining: {},
        styleObj: 'width: 46rpx;height: 46rpx;line-height: 46rpx;border: 1rpx solid #FF4612;border-radius: 50%;'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.showLoading({
        title: '数据加载中',
      });
      var today = new Date();//当前时间
      var y = today.getFullYear();//年
      var mon = today.getMonth() + 1;//月
      var d = today.getDate();//日
      var i = today.getDay();//星期
      this.setData({
        curYear: y,
        curMonth: mon,
        selectedDate: y + '-' + mon + '-' + d,
        selectedWeek: this.data.weekArr[i]
      });

      this.getDateList(y, mon - 1);
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
     
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      var today = new Date();//当前时间
      var y = today.getFullYear();//年
      var mon = today.getMonth() + 1;//月
      var d = today.getDate();//日
      var i = today.getDay();//星期
      this.setData({
        curYear: y,
        curMonth: mon,
        selectedDate: y + '-' + mon + '-' + d,
        selectedWeek: this.data.weekArr[i]
      });

      this.getDateList(y, mon - 1);
    },

    /**
     * 获取团课日历
     */
    getStoreGroupTrainingCalender: function (startDate, endDate, dateList) {
        var __this__ = this;
        var app = getApp();

        wx.request({
            url: app.globalData.host + '/fitness/V2/Club/getStoreGroupTrainingCalender?storeid=' + app.globalData.userInfo.storeid + '&from_day=' + startDate + '&to_day=' + endDate,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                // console.log(res);
                if (res.data.errorcode === 0) {
                    var calendar = res.data.result.calendar;
                    calendar.forEach(function (v, k) {
                        v.grouptrainings.forEach(function (m, n) {
                            m.starttime = moment(m.starttime).format('HH:mm');
                            m.finishtime = moment(m.finishtime).format('HH:mm');
                            m.duration = Utils.timeStamp(m.duration);
                        });

                        if (v.grouptrainings && v.grouptrainings.length>0){
                          dateList.forEach(function (i, j) {
                            i.forEach(function (p, q) {
                              if (v.date_short === p.value){
                                p.has = true;
                              }
                            });
                          });
                        }
                    });
                    
                    var selectedDayTraining = calendar.filter(function (v, i, arr) {
                        return v.date_short == moment().format('YYYY-M-D');
                    });

                    __this__.setData({
                        calendar: calendar,
                        selectedDayTraining: selectedDayTraining,
                        dateList: dateList
                    });
                    wx.hideLoading();
                }
            }
        });
    },
    getDateList: function (y, mon) {
        var vm = this;
        //如果是否闰年，则2月是29日
        var daysCountArr = this.data.daysCountArr;
        if (y % 4 == 0 && y % 100 != 0) {
            this.data.daysCountArr[1] = 29;
            this.setData({
                daysCountArr: daysCountArr
            });
        }
        //第几个月；下标从0开始实际月份还要再+1
        var dateList = [];
        // console.log('本月', vm.data.daysCountArr[mon], '天');
        dateList[0] = [];
        var weekIndex = 0;//第几个星期
        for (var i = 0; i < vm.data.daysCountArr[mon]; i++) {
            var week = new Date(y, mon, (i + 1)).getDay();
            // 如果是新的一周，则新增一周
            if (week == 0) {
                weekIndex++;
                dateList[weekIndex] = [];
            }
            // 如果是第一行，则将该行日期倒序，以便配合样式居右显示
            if (weekIndex == 0) {
                dateList[weekIndex].unshift({
                    value: y + '-' + (mon + 1) + '-' + (i + 1),
                    date: i + 1,
                    week: week
                });
            } else {
                dateList[weekIndex].push({
                    value: y + '-' + (mon + 1) + '-' + (i + 1),
                    date: i + 1,
                    week: week
                });
            }
        }
        // console.log('本月日期', dateList);
        var len = dateList.length,
            lastLen = dateList[len - 1].length,
            start,
            end = dateList[len - 1][lastLen - 1].value;
        // bug: 本月为31天时，dateList[0][0]为空的问题@2017.10.16
        if (dateList[0][0]) {
          start = dateList[0][0].value;
        } else {
          start = dateList[1][0].value;
        }

        vm.getStoreGroupTrainingCalender(start, end, dateList);
    },
    selectDate: function (e) {
        var vm = this;
        // console.log('选中', e.currentTarget.dataset.date.value);

        var selectedDayTraining = vm.data.calendar.filter(function (v, i, arr) {
            return v.date_short == e.currentTarget.dataset.date.value
        });

        vm.setData({
            selectedDate: e.currentTarget.dataset.date.value,
            selectedWeek: vm.data.weekArr[e.currentTarget.dataset.date.week],
            selectedDayTraining: selectedDayTraining
        });
    },
    preMonth: function () {
        // 上个月
        var vm = this;
        var curYear = vm.data.curYear;
        var curMonth = vm.data.curMonth;
        curYear = curMonth - 1 ? curYear : curYear - 1;
        curMonth = curMonth - 1 ? curMonth - 1 : 12;
        // console.log('上个月', curYear, curMonth);
        vm.setData({
            curYear: curYear,
            curMonth: curMonth
        });

        vm.getDateList(curYear, curMonth - 1);
    },
    nextMonth: function () {
        // 下个月
        var vm = this;
        var curYear = vm.data.curYear;
        var curMonth = vm.data.curMonth;
        curYear = curMonth + 1 == 13 ? curYear + 1 : curYear;
        curMonth = curMonth + 1 == 13 ? 1 : curMonth + 1;
        // console.log('下个月', curYear, curMonth);
        vm.setData({
            curYear: curYear,
            curMonth: curMonth
        });

        vm.getDateList(curYear, curMonth - 1);
    }
})