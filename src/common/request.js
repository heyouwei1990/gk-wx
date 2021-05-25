import axios from 'axios'
// import qs from 'qs'
const MODE = process.env.VUE_APP_MODE;
const IsDev = process.env.NODE_ENV == 'development' ? true : false;
let BASEURL = 'http://api.gongkongbpo.qa';
let wxAuthUrl = 'http://payapi.gongkongbpo.com';
let PersonLogin = 'http://sso.api.gongkongbpo.qa';
let protocol = window.location.protocol;

if (MODE == 'test') {
    BASEURL = protocol + '//test.api.insupai.com';
    wxAuthUrl = 'http://tm.insupai.com';
    PersonLogin = protocol + '//tsso.api.insupai.com';
}
if (MODE == 'production') {
    BASEURL = protocol + '//api.insupai.com';
    wxAuthUrl = 'http://m.insupai.com';
    PersonLogin = protocol + '//sso.api.insupai.com';
}
if (MODE == 'development') {
    BASEURL = 'http://api.gongkongbpo.qa';
    wxAuthUrl = 'http://payapi.gongkongbpo.com';
    PersonLogin = 'http://sso.api.gongkongbpo.qa';
}
import { Toast } from 'vant'
import { Promise } from 'core-js';
let loaddingToast = null;
// axios.defaults.baseURL = BASEURL;
axios.defaults.timeout = 30000;

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
// 添加请求拦截器
axios.interceptors.request.use(config => {
    return config;
});
// 添加响应拦截器   
axios.interceptors.response.use(response => {
    if (loaddingToast) {
        loaddingToast.clear();
    }
    return response.data;
}, error => {
    loaddingToast.clear();
    if (error.message.includes('timeout')) {
        Toast({
            message: '请求超时！',
            type: 'fail'
        });
    }
    return Promise.reject(error)
});

function request(method = 'post', url, params, loading = true) {
    if (loading) {
        loaddingToast = Toast.loading({
            duration: 0,
            message: '请稍候...',
            forbidClick: true
        });
    }
    // let _url = url;
    let baseUrl = BASEURL;
    //M站走PC端接口
    if (params) {
        params['platform'] = 'pcweb';
    } else {
        params = { platform: 'pcweb' }
    }
    //个人用户域名
    if (url && url.indexOf('/personApi/') != -1) {
        baseUrl = PersonLogin;
        if (!IsDev) {
            url = url.replace('/personApi', '');
        }
    }
    // 上传接口的请求头改变成
    if (url && url.indexOf('/api/Upload/UploadImg') != -1) {
        axios.defaults.headers['Content-Type'] = 'multipart/form-data';
    } else {
        axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
    }
    //生产环境加baseURL
    url = IsDev ? url : baseUrl + url;
    return axios({
        url: url,
        method: method,
        data: method == 'post' ? params : null,
        params: method == 'get' ? params : null
    });
}

function ocrScan(method = 'post', url, params, loading = true) {
    if (loading) {
        loaddingToast = Toast.loading({
            duration: 0,
            message: '请稍候...',
            forbidClick: true
        });
        let str = '';
        for (const k in params) {
            str += k + '=' + params[k] + '&'
        }
        params = str;
        return axios({
            url: url,
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Authorization': 'APPCODE 981ec494f9ba46a69ee7af50d429c237'
            },
            data: method == 'post' ? params : null,
            params: method == 'get' ? params : null
        });
    }
}
// function ajax(method = 'post', url, params, loading = true) {
//     if (loading) {
//         loaddingToast = Toast.loading({
//             duration: 0,
//             message: '请稍候...',
//             forbidClick: true
//         });
//     }
//     let baseUrl = '';
//     //个人用户域名
//     if (url && url.indexOf('/personApi/') != -1) {
//         baseUrl = PersonLogin;
//         if (!IsDev) {
//             url = url.replace('/personApi', '');
//         }
//     }
//     //生产环境加baseURL
//     url = IsDev ? url : baseUrl + url;
//     return new Promise((resolve, reject) => {
//         $.ajax({
//             type: method.toUpperCase(),
//             url: url,
//             data: method == 'get' ? params : JSON.stringify(params),
//             dataType: 'json',
//             crossDomain: true == !(document.all),
//             contentType: 'application/json;charset=UTF-8',
//             success(res) {
//                 loaddingToast.clear();
//                 resolve(res);
//             },
//             error(err) {
//                 loaddingToast.clear();
//                 reject(err);
//             }
//         })
//     })
// }
export {
    BASEURL,
    request,
    wxAuthUrl,
    ocrScan,
};