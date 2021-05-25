import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import store from '@/store/index.js'
import '@/common/flexible.js'
import Vant, { Lazyload } from 'vant'
import WebIM from '@/common/WebIM.js';
import VueCookies from 'vue-cookies'
// import VConsole from 'vconsole'
import 'vant/lib/index.css'
import 'vant/lib/icon/local.css'
import { FormatTime, SetStorage, GetStorage, RemoveStorage } from '@/common/util.js'
import { config, share } from '@/common/wxSDK.js'
Vue.use(Lazyload, {
    lazyComponent: true,
});
Vue.use(Vant);
Vue.use(WebIM);
Vue.use(VueCookies);

Vue.config.productionTip = false
Vue.prototype.$formatTime = FormatTime;
Vue.prototype.$setStorage = SetStorage;
Vue.prototype.$getStorage = GetStorage;
Vue.prototype.$removeStorage = RemoveStorage;
Vue.prototype.$IM = WebIM;
// if (process.env.VUE_APP_MODE === 'test') {
//     let v_console = new VConsole();
// }

function _dealWxShareData(data) {
    let newData = {
        title: data.title || document.title,
        imgUrl: data.imgUrl || '',
        link: data.link || location.href,
        desc: data.desc || '全国性、跨区域的配电及自动化工业服务平台',
    }
    return newData
}
Vue.prototype.wxShare = function(data) {
    let isWeixin = /MicroMessenger/.test(window.navigator.userAgent);
    if (!isWeixin) {
        //this.$notify('请在微信环境打开');
        return
    }
    config(function() {
        share(_dealWxShareData(data))
    })
}
Vue.filter('formatPrice', function(value) {
    //格式化价格
    var num = 0;
    if (!isNaN(Number(value))) {
        num = Number(value);
    }
    return num.toFixed(2);
});

router.beforeEach((to, from, next) => {
    Vue.prototype.$page = to;
    if (from.path == '/orderList') {
        //从工单详情返回列表，列表应该缓存
        if (to.path == '/orderDetail') {
            from.meta.keepAlive = true;
        }
        //从搜索返回列表，列表不缓存
        if (to.path == '/searchOrder') {
            from.meta.keepAlive = true;
        }
        //从搜索返回列表，列表不缓存
        if (to.path == '/') {
            from.meta.keepAlive = false;
        }
    }
    if (to.matched.some(res => res.meta.isLogin)) {
        //判断是否需要登录
        if (GetStorage('userData')) {
            next();
        } else {
            next({
                path: "/login/companyLogin",
            });
        }
    } else {
        next()
    }
});


new Vue({
    render: h => h(App),
    store,
    router
}).$mount('#app')