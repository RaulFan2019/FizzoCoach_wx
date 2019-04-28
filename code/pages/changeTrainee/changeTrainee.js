// changeTrainee.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        storeid: '',
        moverid: '',
        typename: '',
        key: '',
        value: '',
        unit: '',
        inputtype: 'digit',
        maxlength: 5
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            'storeid': options.storeid,
            'moverid': options.moverid,
            'typename': options.typename,
            'key': options.key,
            'value': options.value,
            'unit': options.unit,
        });
        //设置标题
        wx.setNavigationBarTitle({
            title: options.typename
        })
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
     * 监听输入
     */
    bindKeyInput: function (e) {
        this.setData({
            'value': e.detail.value
        })
    },

    /**
     * 保存
     */
    saveChanges: function () {
        var storeid = this.data.storeid,
            moverid = this.data.moverid,
            key = this.data.key,
            value = this.data.value;
        var app = getApp();

        wx.request({
            url: app.globalData.host + '/fitness/V2/Club/updateStoreMoverInfo?storeid=' + storeid + '&moverid=' + moverid + '&' + key + '=' + value,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                // console.log(JSON.stringify(res.data));
                if (res.data.errorcode === 0) {
                    wx.showToast({
                        title: '设置成功',
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                          wx.navigateBack({
                            delta: 1
                          });
                        }
                    });
                } else {
                    wx.showToast({
                        title: '设置失败',
                        icon: 'loading',
                        duration: 2000
                    });
                }
            }
        });
    }
})