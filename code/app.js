//app.js
var promise = require('./utils/promise');

var loginPromisify = promise.wxPromisify(wx.login);
var requestPromisify = promise.wxPromisify(wx.request);
var getUserInfoPromisify = promise.wxPromisify(wx.getUserInfo);

App({
  onLaunch: function (options) {
    var __this__ = this;
    __this__.getUserInfo(function () {
      __this__.getClubInfo();
    });
  },
  onShow: function (options) {

  },
  onHide: function () {

  },
  onError: function (msg) {

  },
  getUserInfo: function (cb) {
    var __this__ = this;
    var code = '',
      iv = '',
      encrypted = '';

    loginPromisify()
      .then(res => {
        code = res.code;
        return getUserInfoPromisify()
      })
      .then(res => {
        iv = res.iv;
        encrypted = res.encryptedData;
        return requestPromisify({
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          url: __this__.globalData.host + '/fitness/V2/Account/getWXAAccountInfo',
          method: 'POST',
          dateType: 'json',
          data: {
            code: code,
            iv: iv,
            encrypted: encrypted
          }
        });
      })
      .then(res => {
        console.log("res.data.errorcode:" + res.data.errorcode);
        console.log(JSON.stringify(res.data));
        if (res.data.errorcode === 0){
          __this__.globalData.userInfo = res.data.result;
          console.log(JSON.stringify(res.data.result));
        }

        if (res.data.errorcode === 105) {
          __this__.globalData.resData = res.data;
        }
        
        typeof cb == "function" && cb(__this__.globalData.userInfo);
      })
      .catch(error => {
        console.log(error)
      });
  },
  getClubInfo: function (cb) {
    var __this__ = this;
    requestPromisify({
      url: __this__.globalData.host + '/fitness/V2/Club/getStoreInfo?storeid=' + __this__.globalData.userInfo.storeid,
      method: 'GET',
      dataType: 'json'
    }).then(res => {
      if (res.data.errorcode === 0) {
        __this__.globalData.club = res.data.result;
      }
      typeof cb == "function" && cb(__this__.globalData.club);
    });
  },
  globalData: {
    host: 'https://www.123yd.cn',
    userInfo: {},
    club: {}
  }
})