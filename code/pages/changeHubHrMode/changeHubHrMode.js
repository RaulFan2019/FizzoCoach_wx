// changeHubHrMode.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        radioItems: [
            {name: '随门店设置', value: '0'},
            {name: '最大心率模式', value: '1'},
            {name: '目标心率模式', value: '2'}
        ],
        storeid: '',
        hubid: '',
        hubname: '',
        hrmode: '',
        serialno: '',
        registertime: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var __this__ = this;
        var app = getApp();

        __this__.setData({
            'storeid': app.globalData.userInfo.storeid,
            'hubid': options.hubid,
            'hubname': options.hubname,
            'hrmode': options.hrmode,
            'serialno': options.serialno,
            'registertime': options.registertime
        });

        var radioItems = __this__.data.radioItems;
        if (__this__.data.hrmode == '随门店设置') {
            __this__.setData({
                'hrmode': 0,
                'radioItems[0].checked': true
            });
        } else if (__this__.data.hrmode == '最大心率模式') {
            __this__.setData({
                'hrmode': 1,
                'radioItems[1].checked': true
            });
        } else if (__this__.data.hrmode == '目标心率模式') {
            __this__.setData({
                'hrmode': 2,
                'radioItems[2].checked': true
            });
        }
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
     * 切换模式
     */
    radioChange: function (e) {
        var __this__ = this;
        var app = getApp();
        // console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = __this__.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        __this__.setData({
            'radioItems': radioItems,
            'hrmode': e.detail.value
        });

        wx.request({
            url: app.globalData.host + '/fitness/V2/Club/updateStoreHub?storeid=' + __this__.data.storeid + '&hubid=' + __this__.data.hubid + '&name=' + __this__.data.hubname + '&hrmode=' + __this__.data.hrmode,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.data.errorcode === 0) {
                    // console.log(res);
                    wx.showToast({
                        title: '设置成功',
                        icon: 'success',
                        duration: 3000,
                        success: function () {
                            if (__this__.data.hrmode == 0) {
                                __this__.setData({
                                    'hrmode': '随门店设置'
                                });
                            } else if (__this__.data.hrmode == 1) {
                                __this__.setData({
                                    'hrmode': '最大心率模式'
                                });
                            } else if (__this__.data.hrmode == 2) {
                                __this__.setData({
                                    'hrmode': '目标心率模式'
                                });
                            }

                            wx.navigateBack({
                              delta: 1
                            });
                        }
                    });
                }
            }
        });

    }
})