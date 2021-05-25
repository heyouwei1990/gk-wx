import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);
export default new Router({
    // mode: 'history',
    routes: [{
        path: '/',
        name: 'Home',
        component: resolve => require(['@/views/home/home.vue'], resolve),
        meta: {
            navBar: true,
        }
    }, {
        path: '/undefined', //undefined显示首页
        name: 'undefined',
        redirect: '/',
    }, {
        path: '/messageIndex',
        name: 'MessageIndex',
        component: resolve => require(['@/views/message/messageIndex.vue'], resolve),
        meta: {
            isLogin: true,
            navBar: true,
        }
    }, {
        path: '/chat',
        name: 'Chat',
        component: resolve => require(['@/views/message/chat.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/contactList',
        name: 'ContactList',
        component: resolve => require(['@/views/message/contactList.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/groupMember',
        name: 'GroupMember',
        component: resolve => require(['@/views/message/groupMember.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/inviteMember',
        name: 'InviteMember',
        component: resolve => require(['@/views/message/inviteMember.vue'], resolve),
    }, {
        path: '/createOrder',
        name: 'CreateOrder',
        component: resolve => require(['@/views/createOrder/createOrder.vue'], resolve),
        meta: {
            keepAlive: true,
            isLogin: true
        }
    }, {
        path: '/createOrder2',
        name: 'CreateOrder2',
        component: resolve => require(['@/views/createOrder/createOrder2.vue'], resolve),
        meta: {
            keepAlive: true,
            isLogin: true
        }
    }, {
        path: '/createOrder3',
        name: 'CreateOrder3',
        component: resolve => require(['@/views/createOrder/createOrder3.vue'], resolve),
        meta: {
            keepAlive: true,
            isLogin: true
        }
    }, {
        path: '/searchAddress',
        name: 'SearchAddress',
        component: resolve => require(['@/views/createOrder/searchAddress.vue'], resolve),
    }, {
        path: '/searchIndustry',
        name: 'SearchIndustry',
        component: resolve => require(['@/views/createOrder/searchIndustry.vue'], resolve),
    }, {
        path: '/searchProduction',
        name: 'SearchProduction',
        component: resolve => require(['@/views/createOrder/searchProduction.vue'], resolve),
    }, {
        path: '/createOrderProtocol',
        name: 'CreateOrderProtocol',
        component: resolve => require(['@/views/createOrder/createOrderProtocol.vue'], resolve),
        meta: {
            isLogin: true
        }
    }, {
        path: '/createSuccess',
        name: 'CreateSuccess',
        component: resolve => require(['@/views/createOrder/createSuccess.vue'], resolve),
        meta: {
            // isLogin: true
        }
    }, {
        path: '/payDeposit',
        name: 'PayDeposit',
        component: resolve => require(['@/views/payment/payDeposit.vue'], resolve),
        meta: {
            isLogin: true
        }
    }, {
        path: '/paySuccess',
        name: 'PaySuccess',
        component: resolve => require(['@/views/payment/paySuccess.vue'], resolve),
        meta: {
            isLogin: true
        }
    }, {
        path: '/orderProcess',
        name: 'OrderProcess',
        component: resolve => require(['@/views/orderProcess/orderProcess.vue'], resolve),
        meta: {
            isLogin: true
        }
    }, {
        path: '/bidderList',
        name: 'BidderList',
        component: resolve => require(['@/views/orderProcess/bidderList.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/bidderPlan',
        name: 'BidderPlan',
        component: resolve => require(['@/views/orderProcess/bidderPlan.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/engineerReport',
        name: 'EngineerReport',
        component: resolve => require(['@/views/orderProcess/engineerReport.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/evaluate',
        name: 'Evaluate',
        component: resolve => require(['@/views/orderProcess/evaluate.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/allocate',
        name: 'Allocate',
        component: resolve => require(['@/views/orderProcess/allocate.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/allocateMenu',
        name: 'AllocateMenu',
        component: resolve => require(['@/views/orderProcess/allocateMenu.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/login',
        name: 'Login',
        component: resolve => require(['@/views/login/index.vue'], resolve),
        children: [{
                path: 'personLogin',
                name: 'PersonLogin',
                component: resolve => require(['@/views/login/personLogin.vue'], resolve)
            },
            {
                path: 'companyLogin',
                name: 'CompanyLogin',
                component: resolve => require(['@/views/login/companyLogin.vue'], resolve)
            }
        ]
    }, {
        path: '/personRegister',
        name: 'PersonRegister',
        component: resolve => require(['@/views/register/personRegister.vue'], resolve)
    }, {
        path: '/companyRegister',
        name: 'CompanyRegister',
        component: resolve => require(['@/views/register/companyRegister.vue'], resolve)
    }, {
        path: '/companyRegisterNext',
        name: 'CompanyRegisterNext',
        component: resolve => require(['@/views/register/companyRegisterNext.vue'], resolve)
    }, {
        path: '/registerSuccess',
        name: 'RegisterSuccess',
        component: resolve => require(['@/views/register/registerSuccess.vue'], resolve)
    }, {
        path: '/orderList',
        name: 'OrderList',
        component: resolve => require(['@/views/workOrder/orderList.vue'], resolve),
        meta: {
            keepAlive: true,
            tabIndex: 1,
            //isLogin: true
        }
    }, {
        path: '/orderDetail',
        name: 'OrderDetail',
        component: resolve => require(['@/views/workOrder/orderDetail.vue'], resolve),
        meta: {
            //isLogin: true
        }
    }, {
        path: '/searchOrder',
        name: 'SearchOrder',
        component: resolve => require(['@/views/workOrder/searchOrder.vue'], resolve),
        meta: {
            //isLogin: true
        }
    }, {
        path: '/myOrders',
        name: 'MyOrders',
        component: resolve => require(['@/views/workOrder/myOrders.vue'], resolve),
        meta: {
            isLogin: true,
            keepAlive: true,
            navBar: true,
        }
    }, {
        path: '/userCenter',
        name: 'UserCenter',
        component: resolve => require(['@/views/user/userCenter.vue'], resolve),
        meta: {
            isLogin: true,
            navBar: true,
        }
    }, {
        path: '/userInfo',
        name: 'UserInfo',
        component: resolve => require(['@/views/user/userInfo.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/companyInfo',
        name: 'CompanyInfo',
        component: resolve => require(['@/views/user/companyInfo.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/editUser',
        name: 'EditUser',
        component: resolve => require(['@/views/user/editUser.vue'], resolve),
        meta: {
            isLogin: true,
            keepAlive: true,
        }
    }, {
        path: '/editCompany',
        name: 'EditCompany',
        component: resolve => require(['@/views/user/editCompany.vue'], resolve),
        meta: {
            isLogin: true,
            keepAlive: true,
        }
    }, {
        path: '/location',
        name: 'Location',
        component: resolve => require(['@/views/user/location.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/setting',
        name: 'Setting',
        component: resolve => require(['@/views/setting/setting.vue'], resolve),
        meta: {
            // isLogin: true,
        }
    }, {
        path: '/about',
        name: 'About',
        component: resolve => require(['@/views/setting/about.vue'], resolve),
        meta: {
            // isLogin: true,
        }
    }, {
        path: '/passwordManage',
        name: 'PasswordManage',
        component: resolve => require(['@/views/setting/passwordManage.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/bindPhone',
        name: 'BindPhone',
        component: resolve => require(['@/views/setting/bindPhone.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/bindAccount',
        name: 'BindAccount',
        component: resolve => require(['@/views/setting/bindAccount.vue'], resolve),
    }, {
        path: '/loginPassword',
        name: 'LoginPassword',
        component: resolve => require(['@/views/setting/loginPassword.vue'], resolve),

    }, {
        path: '/payPassword',
        name: 'PayPassword',
        component: resolve => require(['@/views/setting/payPassword.vue'], resolve),

    }, {
        path: '/resetPassword',
        name: 'resetPassword',
        component: resolve => require(['@/views/setting/resetPassword.vue'], resolve),

    }, {
        path: '/balance',
        name: 'Balance',
        component: resolve => require(['@/views/balance/balance.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/recharge',
        name: 'Recharge',
        component: resolve => require(['@/views/balance/recharge.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/withdraw',
        name: 'Withdraw',
        component: resolve => require(['@/views/balance/withdraw.vue'], resolve),
        meta: {
            isLogin: true,
            keepAlive: true,
        }
    }, {
        path: '/personWithdraw',
        name: 'PersonWithdraw',
        component: resolve => require(['@/views/balance/personWithdraw.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/balanceBill',
        name: 'BalanceBill',
        component: resolve => require(['@/views/balance/balanceBill.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/accountManage',
        name: 'AccountManage',
        component: resolve => require(['@/views/balance/accountManage.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/addAccount',
        name: 'AddAccount',
        component: resolve => require(['@/views/balance/addAccount.vue'], resolve),
        meta: {
            isLogin: true,
            keepAlive: true,
        }
    }, {
        path: '/searchBank',
        name: 'SearchBank',
        component: resolve => require(['@/views/balance/searchBank.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/remittance',
        name: 'Remittance',
        component: resolve => require(['@/views/balance/remittance.vue'], resolve),
        meta: {
            isLogin: true,
            keepAlive: true,
        }
    }, {
        path: '/balanceSuccess',
        name: 'BalanceSuccess',
        component: resolve => require(['@/views/balance/balanceSuccess.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/bidding',
        name: 'Bidding',
        component: resolve => require(['@/views/workOrder/bidding.vue'], resolve),
        meta: {
            isLogin: true,
            keepAlive: true,
        }
    }, {
        path: '/contract',
        name: 'Contract',
        component: resolve => require(['@/views/user/contract.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/contractPdf',
        name: 'ContractPdf',
        component: resolve => require(['@/views/user/contractPdf.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/companyRealName',
        name: 'CompanyRealName',
        component: resolve => require(['@/views/user/companyRealName.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/personRealName',
        name: 'PersonRealName',
        component: resolve => require(['@/views/user/personRealName.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/agencyCreateOrder',
        name: 'AgencyCreateOrder',
        component: resolve => require(['@/views/createOrder/agencyCreateOrder.vue'], resolve),
        meta: {
            keepAlive: true,
        }
    }, {
        path: '/agencyCreateOrder2',
        name: 'AgencyCreateOrder2',
        component: resolve => require(['@/views/createOrder/agencyCreateOrder2.vue'], resolve),
        meta: {
            keepAlive: true,
        }
    }, {
        path: '/agencyCreateOrder3',
        name: 'AgencyCreateOrder3',
        component: resolve => require(['@/views/createOrder/agencyCreateOrder3.vue'], resolve),
        meta: {
            keepAlive: true,
        }
    }, {
        path: '/leaveRecord',
        name: 'LeaveRecord',
        component: resolve => require(['@/views/orderProcess/leaveRecord.vue'], resolve),
        meta: {}
    }, {
        path: '/arriveRecord',
        name: 'ArriveRecord',
        component: resolve => require(['@/views/orderProcess/arriveRecord.vue'], resolve),
        meta: {}
    }, {
        path: '/urgentRule',
        name: 'UrgentRule',
        component: resolve => require(['@/views/createOrder/urgentRule.vue'], resolve),
        meta: {}
    }, {
        path: '/addressList',
        name: 'AddressList',
        component: resolve => require(['@/views/addressManage/addressList.vue'], resolve),
        meta: {
            isLogin: true,
        }
    }, {
        path: '/addressEdit',
        name: 'AddressEdit',
        component: resolve => require(['@/views/addressManage/addressEdit.vue'], resolve),
        meta: {
            isLogin: true,
            keepAlive: true,
        }
    }, {
        path: '/cityList',
        name: 'CityList',
        component: resolve => require(['@/views/createOrder/cityList.vue'], resolve),
    }, {
        path: '/baiduMap',
        name: 'BaiduMap',
        component: resolve => require(['@/views/createOrder/baiduMap.vue'], resolve),
    }, {
        path: '/shareOrderDetail',
        name: 'shareOrderDetail',
        component: resolve => require(['@/views/share/shareOrderDetail.vue'], resolve),
    }, {
        path: '/bindWechat',
        name: 'BindWechat',
        component: resolve => require(['@/views/bind/bindWechat.vue'], resolve),
    }, {
        path: '/bindSuccess',
        name: 'BindSuccess',
        component: resolve => require(['@/views/bind/bindSuccess.vue'], resolve),
    }, {
        path: '/couponRule',
        name: 'CouponRule',
        component: resolve => require(['@/views/h5/couponRule.vue'], resolve),
    }, ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 }
        }
    }
})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}