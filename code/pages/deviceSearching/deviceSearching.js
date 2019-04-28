// deviceSearching.js
var moment = require('../../libs/moment/we-moment-with-locales');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: true,
        tipShowed: true,
        inputVal: "",
        icon: {
            ringIcon: '/assets/img/ring.png',
            searchingIcon: '/assets/img/searching.png'
        },
        hrdevices: [],
        oldhrdevices: []
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
            tipShowed: true
        });
        wx.navigateBack({
            delta: 1
        });
    },

    clearInput: function () {
        this.setData({
            inputVal: "",
            tipShowed: true
        });
    },

    inputTyping: function (e) {
        // console.log(e.detail.value);
        if (e.detail.value) {
            this.setData({
                inputVal: e.detail.value,
                tipShowed: false
            });
            this.queryWareHrdeviceLocal(e.detail.value);
        } else {
            this.setData({
                tipShowed: true
            });
        }
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
                // console.log(JSON.stringify(res.data));
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
                        hrdevices: hrdevices,
                        oldhrdevices: hrdevices
                    });
                    wx.hideLoading();
                }
            }
        });
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
                hrdevices: filtered
            });
        }
    },

    /**
     * 设备库中查询设备
     */
    queryWareHrdevice: function (name) {
        var __this__ = this;
        var app = getApp();

        if (name) {
            wx.request({
                url: app.globalData.host + '/fitness/V2/Club/queryWareHrdevice?devicename=' + name,
                method: 'GET',
                dataType: 'json',
                success: function (res) {
                    // console.log(JSON.stringify(res.data));
                    if (res.data.errorcode === 0) {
                        var hrdevices = res.data.result.hrdevices;
                        hrdevices.forEach(function (v, k) {
                            v.setuptime = moment(v.setuptime).format('YYYY.MM.DD HH:mm');
                            if (v.binduser && v.binduser.bindingtime) {
                                v.binduser.bindingtime = moment(v.binduser.bindingtime).format('YYYY.MM.DD HH:mm');
                                v.binded = true;
                            } else {
                                v.binded = false;
                            }
                        });
                        __this__.setData({
                            hrdevices: hrdevices
                        });
                    }
                }
            });
        }
    },

    /**
     * 查看设备明细
     */
    checkDeviceDetail: function (e) {
        var item = this.data.hrdevices[e.currentTarget.id];
        wx.setStorage({
            key: "device",
            data: item,
            success: function () {
                wx.navigateTo({
                    url: '../myHrDeviceDetail/myHrDeviceDetail'
                });
            }
        });
    },
})