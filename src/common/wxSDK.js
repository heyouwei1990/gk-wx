import wx from 'weixin-js-sdk'
import { GetWxJsSdkConfigPara } from './api.js'

let jsApiList = [
    'updateAppMessageShareData',
    'updateTimelineShareData',
    'onMenuShareWeibo',
    'onMenuShareQQ',
    'onMenuShareQZone',
    'hideMenuItems',
    'showMenuItems',
    'chooseWXPay',
]
let userAgent = navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
let isWeixin = userAgent && userAgent[0] === 'micromessenger';
let url = window.location.href.split('#')[0];
export function config(callback) {
    GetWxJsSdkConfigPara({ url: encodeURIComponent(url) }).then(r => {
        if (r.suc == 1) {
            let data = r.data;
            wx.config({
                debug: false,
                appId: data.AppId,
                timestamp: data.TimeStamp,
                nonceStr: data.NonceStr,
                signature: data.SignaTure,
                jsApiList: jsApiList,
            });
            wx.ready(function() {
                callback && callback()
            })
            wx.error(function(res) {
                // console.log('weixin:' + r.msg)
            })
        }
    })
}

export function share(data) {
    isWeixin && wx && wx.checkJsApi && wx.checkJsApi({
        jsApiList: jsApiList,
        success: function(res) {
            res.checkResult.updateAppMessageShareData && wx.updateAppMessageShareData({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接
                imgUrl: data.imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    data.success && data.success('朋友')
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                    data.cancel && data.cancel('朋友')
                }
            })

            res.checkResult.updateTimelineShareData && wx.updateTimelineShareData({
                title: data.title, // 分享标题
                link: data.link, // 分享链接
                imgUrl: data.imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    data.success && data.success('朋友圈')
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                    data.cancel && data.cancel('朋友圈')
                }
            })

            res.checkResult.onMenuShareQQ && wx.onMenuShareQQ({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接
                imgUrl: data.imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    data.success && data.success('QQ')
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                    data.cancel && data.cancel('QQ')
                }
            })

            res.checkResult.onMenuShareQZone && wx.onMenuShareQZone({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接
                imgUrl: data.imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    data.success && data.success('QQ')
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                    data.cancel && data.cancel('QQ')
                }
            })

            res.checkResult.onMenuShareWeibo && wx.onMenuShareWeibo({
                title: data.title, // 分享标题
                desc: data.desc, // 分享描述
                link: data.link, // 分享链接
                imgUrl: data.imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    data.success && data.success('微博')
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                    data.cancel && data.cancel('微博')
                }
            })
        }
    })
}