function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function timeStamp(second_time) {

    var time = parseInt(second_time) + "秒";
    if (parseInt(second_time) > 60) {

        var second = parseInt(second_time) % 60;
        var min = parseInt(second_time / 60);
        time = (min == 0 ? '' : min + '分钟') + (second == 0 ? '' : second + '秒');

        if (min > 60) {
            min = parseInt(second_time / 60) % 60;
            var hour = parseInt(parseInt(second_time / 60) / 60);
            time = (hour == 0 ? '' : hour + '小时') + (min == 0 ? '' : min + '分钟') + (second == 0 ? '' : second + '秒');

            if (hour > 24) {
                hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                time = (day == 0 ? '' : day + '天') + (hour == 0 ? '' : hour + '小时') + (min == 0 ? '' : min + '分钟') + (second == 0 ? '' : second + '秒');
            }
        }
    }
    return time;
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

//正则判断
function Regular(str, reg) {
    if (reg.test(str))
        return true;
    return false;
}
//是否为中文
function IsChinese(str) {
    var reg = /^[\u0391-\uFFE5]+$/;
    return Regular(str, reg);
}

//判断是否为手机号码
function IsPhoneNumber(str){
  var reg = /^1[0-9]{10}$/;
  return Regular(str, reg);
}

//判断是否为身份证
// function IsIDcard(str){
//   var reg = /^\d{15}$)|(^\d{17}([0-9]|X)$/;
//   return Regular(str, reg);
// }

module.exports = {
    FormatTime: formatTime,
    Regular: Regular,
    IsChinese: IsChinese,
    timeStamp: timeStamp,
    IsPhoneNumber: IsPhoneNumber
}
