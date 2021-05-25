/**
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
//Format("2016-10-04 8:9:4.423","yyyy-MM-dd hh:mm:ss.S") ==> 2016-10-04 08:09:04.423
// Format("1507353913000","yyyy-M-d h:m:s.S")      ==> 2017-10-7 13:25:13.0
 */

export const TEL = '400-1100-243';
export const VERSION = '1.0.0';
export function FormatTime(datetime, fmt = 'yyyy-MM-dd hh:mm:ss') {
    if (!datetime || datetime == "") {
        return "";
    }

    if (parseInt(datetime) == datetime) {
        if (datetime.length == 10) {
            datetime = parseInt(datetime) * 1000;
        } else if (datetime.length == 13) {
            datetime = parseInt(datetime);
        }
    }
    datetime = new Date(datetime);
    var o = {
        "M+": datetime.getMonth() + 1, //月份   
        "d+": datetime.getDate(), //日   
        "h+": datetime.getHours(), //小时   
        "m+": datetime.getMinutes(), //分   
        "s+": datetime.getSeconds(), //秒   
        "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度   
        "S": datetime.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/**
 * 存储localStorage
 */
export function SetStorage(name, content) {
    if (!localStorage) { return; }
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export function GetStorage(name) {
    if (!localStorage) { return; }
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export function RemoveStorage(name) {
    if (!localStorage) { return; }
    if (!name) {
        window.localStorage.clear();
        return
    }
    window.localStorage.removeItem(name);
}
// 合并对象
export function extend(target, source) {
    var obj = target || {}
    for (var key in source) {
        // obj[key] = source[key];
        if (typeof source[key] === "object" && source[key]) {
            obj[key] = (source[key].constructor === Array) ? [] : {};
            extend(obj[key], source[key])
        } else {
            obj[key] = source[key];
        }
    }
    return obj;
}

//获取当前url中  key=value
export function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var query = window.location.search.substr(1) || window.location.hash.substr(window.location.hash.indexOf('?') + 1);
    var r = query.match(reg);
    if (r != null) {
        return (r[2]);
    } else {
        return null;
    }
}