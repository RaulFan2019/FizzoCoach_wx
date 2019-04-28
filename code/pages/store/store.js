// store.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        store: {
            logo: '',
            name: '',
            hubcount: 0,
            hrdevicecount: 0
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
        this.getStoreInfo();
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
      this.getStoreInfo();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.getStoreInfo();
    },

    /**
     * 获取门店信息
     */
    getStoreInfo: function () {
        var __this__ = this;
        var app = getApp();

        wx.request({
            url: app.globalData.host + '/fitness/V2/Club/getStoreInfo?storeid=' + app.globalData.userInfo.storeid,
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                // console.log(res.data.result);
                if (res.data.errorcode === 0) {
                    __this__.setData({
                        'store.logo': res.data.result.logo,
                        'store.name': res.data.result.name,
                        'store.hubcount': res.data.result.hubcount,
                        'store.hrdevicecount': res.data.result.hrdevicecount
                    });
                    wx.hideLoading();
                }
            }
        });
    },

    /**
     * 选择图片
     */
    chooseImage: function (e) {
        var __this__ = this;
        // initQiniu();
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                __this__.changeStoreLogo(res.tempFilePaths[0]);
            }
        });
    },

    /**
     * 修改logo
     */
    changeStoreLogo: function (file) {
        var __this__ = this;
        var app = getApp();

        wx.uploadFile({
          url: app.globalData.host +'/fitness/V2/Avatar/upload',
            filePath: file,
            name: 'upload',
            header: {
                'content-type': 'multipart/form-data'
            },
            success: function (res) {
                var data = JSON.parse(res.data);
                if (data.errorcode === 0) {
                    wx.request({
                        url: app.globalData.host + '/fitness/V2/Club/updateStoreInfo?storeid=' + app.globalData.userInfo.storeid + '&logo=' + encodeURIComponent(data.result.url),
                        method: 'GET',
                        dataType: 'json',
                        success: function (res) {
                            // console.log(res);
                            if (res.data.errorcode === 0) {
                                __this__.setData({
                                    'store.logo': res.data.result.logo
                                });
                            }
                        }
                    });
                }
            },
            fail: function (res) {
                // console.log('-------fail-------');
                // console.log(res);
            },
            complete: function (res) {
                // console.log('-------complete-------');
                // console.log(res);
            }
        });
    },

    /**
     * 修改名称
     */
    changeStoreName: function () {
        var app = getApp();

        wx.navigateTo({
            url: '../changeStoreName/changeStoreName?storeid=' + app.globalData.userInfo.storeid + '&name=' + this.data.store.name
        })
    }
})