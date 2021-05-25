import Vue from 'vue'
import Vuex from 'vuex'
import WebIM from '@/common/WebIM.js';
import { GetStorage, SetStorage, RemoveStorage } from '@/common/util.js'
import {
    GetAccountData,
    GetAccountType,
} from '@/common/api.js'
Vue.use(Vuex);
import Chat from "./module/chat";
import FriendModule from "./module/friendModule";
import Group from "./module/group";
import Emedia from "./module/emedia";
import router from '@/router/index.js'
export default new Vuex.Store({
    state: {
        userData: GetStorage('userData') ? JSON.parse(GetStorage('userData')) : '',
        permission: GetStorage('permission') ? JSON.parse(GetStorage('permission')) : '',
        hxLoginId: GetStorage('hxLoginId') ? GetStorage('hxLoginId') : '',
        hxIsLogin: false,
        pickedAddress: null,
        mapPoint: null,
        productPicker: null,
        searchOrderWord: null,
        bank: null,
        bankAccount: null,
        productions: JSON.parse(GetStorage('productions')) || [],
        publishAgain: null, //上一单的数据
        createConfig: null, //发单配置
        mapCity: '', //地图默认城市
        isShowAddDesposit: false, //显示追加押金弹框
        jobId: 0, //当前工单id
        industryData: null, //选取的行业
    },
    getters: {
        keepAlive(state) {
            if (state.userData) {
                let arr = [];
                let routes = router.options.routes;
                for (let i = 0; i < routes.length; i++) {
                    if (routes[i].meta && routes[i].meta.keepAlive) {
                        arr.push(routes[i].name);
                    }

                }
                return arr;
            } else {
                return ['OrderList'];
            }
        }
    },
    mutations: {
        setUserData(state, value) {
            if (!value) {
                //值为空
                state.userData = value;
            }
            if (value && Object.prototype.toString.call(value) == '[object Object]') {
                //企业用户
                if (value.CompanyId > 0) {
                    value['LoginId'] = value.CompanyId;
                    value['UserCode'] = 'e' + value.CompanyId;
                    value['LoginType'] = 2;
                }
                //个人用户
                if (value.UserId > 0) {
                    value['LoginId'] = value.UserId;
                    value['UserCode'] = 'p' + value.UserId;
                    value['LoginType'] = 1;
                }
                state.userData = value;
                SetStorage('userData', value);
            }
            if (!value) {
                //退出登录
                RemoveStorage('userData');
                RemoveStorage('permission');
            }
        },
        setPermission(state, value) {
            state.permission = value;
            if (value && Object.prototype.toString.call(value) == '[object Object]') {
                SetStorage('permission', value);
            }
        },
        setPickedAddress(state, value) {
            state.pickedAddress = value;
        },
        setMapPoint(state, value) {
            state.mapPoint = value;
        },
        setProductPicker(state, value) {
            state.productPicker = value;
        },
        setProductions(state, value) {
            SetStorage('productions', value);
            state.productions = value;
        },
        setSearchOrderWord(state, value) {
            state.searchOrderWord = value;
        },
        setBank(state, value) {
            state.bank = value;
        },
        setBankAccount(state, value) {
            state.bankAccount = value;
        },
        setHxLoginId(state, value) {
            state.hxLoginId = value;
            if (value) {
                SetStorage('hxLoginId', value);
            }
        },
        setHxLoginStatus(state, value) {
            state.hxIsLogin = value;
        },
        setPublishAgain(state, value) {
            state.publishAgain = value;
        },
        setCreateConfig(state, value) {
            state.createConfig = value;
        },
        setMapCity(state, value) {
            state.mapCity = value;
        },
        triggerDespositDialog(state, value) {
            state.isShowAddDesposit = value;
        },
        setJobId(state, value) {
            state.jobId = value || 0;
        },
        setIndustryData(state, value) {
            state.industryData = value;
        },
    },
    actions: {
        //获取个人账号信息
        loadAccountData(context) {
            let data = context.state.userData;
            let params = {};
            if (!data) {
                return;
            }
            if (data.LoginType == 1) {
                params['userId'] = data.UserId;
            }
            if (data.LoginType == 2) {
                params['companyId'] = data.CompanyId;
            }
            GetAccountData(params).then(r => {
                if (r.Result == 1) {
                    context.commit('setUserData', r.Data);
                }
            })
        },
        //获取个人权限
        loadPermission(context) {
            let data = context.state.userData;
            let params = {};
            if (!data) {
                return;
            }
            if (data.LoginType == 1) {
                params['userId'] = data.UserId;
            }
            if (data.LoginType == 2) {
                params['companyId'] = data.CompanyId;
            }
            GetAccountType(params).then(r => {
                if (r.Result == 1) {
                    context.commit('setPermission', r.Data);
                    context.dispatch('hxLogin', {
                        username: r.Data.ImUserId,
                        password: r.Data.ImUserPassWord,
                    })
                }
            })
        },
        //环信登录
        hxLogin(context, payload) {
            var options = {
                apiUrl: WebIM.config.apiURL,
                user: payload.username,
                pwd: payload.password,
                appKey: WebIM.config.appkey
            };
            WebIM.conn.open(options);
            context.commit('setHxLoginId', payload.username);
        },
        //环信退出登录
        hxLogout(context) {
            WebIM.conn.close();
        },
    },
    modules: {
        chat: Chat,
        friendModule: FriendModule,
        group: Group,
        emedia: Emedia,
    }
})