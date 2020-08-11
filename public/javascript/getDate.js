// 時間換算
function getDate(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;

    var sTime = new Date(dateTimeStamp).getTime(); //把時間轉為時間戳
    var now = new Date().getTime(); //當前時間
    var diffValue = now - sTime;
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 12) {
        return dateTimeStamp
    } else if (monthC >= 1) {
        return parseInt(monthC) + "個月前"
    } else if (weekC >= 1) {
        return parseInt(weekC) + "周前"
    } else if (dayC >= 1) {
        return parseInt(dayC) + "天前"
    } else if (hourC >= 1) {
        return parseInt(hourC) + "小時前"
    } else if (minC >= 1) {
        return parseInt(minC) + "分鐘前"
    } else {
        return "剛剛"
    }
}