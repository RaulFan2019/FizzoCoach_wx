// changeStoreName.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        store: {
            storeid: '',
            name: '',
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options);
        this.setData({
            'store.storeid': options.storeid,
            'store.name': options.name
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
            'store.name': e.detail.value
        })
    },

    /**
     * 提交名称
     */
    changeStoreName: function () {
        var __this__ = this;
        var app = getApp();

        if (__this__.data.store.name) {
            wx.request({
                url: app.globalData.host + '/fitness/V2/Club/updateStoreInfo?storeid=' + __this__.data.store.storeid + '&name=' + __this__.data.store.name,
                method: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (res.data.errorcode === 0) {
                        // console.log(res);
                        wx.showToast({
                            title: '修改成功',
                            icon: 'success',
                            duration: 2000,
                            success: function () {
                                wx.navigateBack({
                                    delta: 1
                                });
                                // wx.switchTab({
                                //   url: '../store/store',
                                //   success: function (){

                                //   }
                                // })
                            }
                        });
                    }
                }
            });
        } else {
            wx.showToast({
                title: '请输入名称',
                icon: 'loading',
                duration: 2000
            });
        }
    }
})