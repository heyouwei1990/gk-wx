import { request, BASEURL, wxAuthUrl, ocrScan } from './request.js';
import { GetStorage } from '@/common/util.js'
//微信授权
export function Impower(url, id = 1, usercode) {
    let path = encodeURIComponent(url);
    window.location.href = `${wxAuthUrl}/WxOfficialAccount/WxOfficialAccountAuth?FromUrl=${path}&UserCode=${usercode}&CmdId=${id}`;
}
export function AddErrorLog(api = '', msg = '') {
    let u = window.navigator.userAgent,
        version = '';
    if (u.indexOf('Mac OS X') > -1) {
        // ios
        let regStr_saf = /OS [\d._]*/gi
        let verinfo = u.match(regStr_saf)
        version = 'IOS' + (verinfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.')
    } else if (u.indexOf('Android') > -1 ||
        u.indexOf('Linux') > -1) {
        // android
        version = 'Android' + u.substr(u.indexOf('Android') + 8, u.indexOf(';', u.indexOf('Android')) - u.indexOf('Android') - 8)
    } else if (u.indexOf('BB10') > -1) {
        // 黑莓bb10系统
        version = 'blackberry' + u.substr(u.indexOf('BB10') + 5, u.indexOf(';', u.indexOf('BB10')) - u.indexOf('BB10') - 5)
    } else if (u.indexOf('IEMobile') > -1) {
        // windows phone
        version = 'winphone' + u.substr(u.indexOf('IEMobile') + 9, u.indexOf(';', u.indexOf('IEMobile')) - u.indexOf('IEMobile') - 9)
    } else {
        var userAgent = navigator.userAgent.toLowerCase()
        if (userAgent.indexOf('windows nt 5.0') > -1) {
            version = 'Windows 2000'
        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
            version = 'Windows XP'
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
            version = 'Windows Vista'
        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
            version = 'Windows 7'
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
            version = 'Windows 8'
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
            version = 'Windows 8.1'
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
            version = 'Windows 10'
        } else {
            version = 'Unknown'
        }
    }
    let userDataStr = GetStorage('userData');
    let userData = '';
    if (userDataStr) {
        userData = JSON.parse(userDataStr);
    }
    let params = {
        PhoneEdition: version,
        PhoneType: u,
        InterfaceName: api,
        ErrorLog: msg,
        UserCode: userData.UserCode,
        PageName: window.location.href,
        Referrer: 5,
    }
    return request('post', '/api/Log/AddErrorLog', params, false);
}
//获取省市区
export function GetAreas(params) {
    return request('post', '/api/BpoServiceUser/GetAreas', params);
}
//获取工单配置
export function GetAccountJobConfig(params) {
    return request('post', '/api/UserCenter/GetAccountJobConfig', params);
}
//获取领域
export function ProductDomains(params) {
    return request('post', '/api/Code/ProductDomains', params);
}
//服务类型
export function ServiceStagesByDomain(params) {
    return request('post', '/api/Code/ServiceStagesByDomain', params);
}
//服务类型标签
export function ServiceStageTags(params) {
    return request('post', '/api/Code/ServiceStageTags', params);
}
//发布工单第一步
export function AddJobBase(params) {
    return request('post', '/api/JobWorkflow/AddJob/AddJobBase', params);
}
//常用地址列表
export function GetJobAddressList(params) {
    return request('post', '/api/BpoJobAddress/GetJobAddressList', params);
}
//服务类型
export function ServiceStages(params) {
    return request('post', '/api/Code/ServiceStages', params);
}
//获取产品品牌-新接口
export function ProductBrands(params) {
    return request('post', '/api/Code/ProductBrands ', params);
}
//押金明细
export function GetJobDepositDetail(params) {
    return request('post', '/api/JobWorkflow/AddJob/GetJobDepositDetail', params);
}
//获取所属行业列表
export function GetIndustry(params) {
    return request('get', '/api/BpoJob/GetIndustry', params);
}
export function GetDropDownIndustryList(params) {
    return request('post', '/api/Code/GetDropDownIndustryList', params, false);
}
//发单第二步提交
export function AddJobDetail(params) {
    return request('post', '/api/JobWorkflow/AddJob/AddJobDetail', params);
}
//企业登录
export function CompanyLogin(params) {
    return request('post', '/api/AppCompany/CompanyLogin', params);
}
//获取用户信息
export function GetAccountData(params) {
    return request('post', '/api/UserCenter/GetAccountData', params);
}
//编辑用户信息
export function UpdateUserInfo(params) {
    return request('post', '/api/UserCenter/UpdateUserInfo', params);
}
//获取企业用户信息
export function GetCompanyInfo(params) {
    return request('get', '/api/AppCompany/GetCompanyInfo', params);
}
//编辑企业用户信息
export function EditCompanyInfo(params) {
    return request('post', '/api/AppCompany/EditCompanyInfo', params);
}
//获取企业用户权限
export function GetAccountType(params) {
    return request('post', '/api/AppCompany/GetAccountType', params);
}
//个人密码登录
export function Logon(params) {
    return request('post', '/personApi/sso/logon', params);
}
//个人验证码登录
export function FastLogon(params) {
    return request('post', '/personApi/sso/fastlogon', params);
}
// 上传文件
export function FileUpload(params) {
    return request('post', '/api/Upload/UploadImg', params);
}
//工单列表
export function GetJobsInIndex(params) {
    return request('post', '/api/BpoJob/GetJobsInIndex', params, false);
}
//工单详情
export function GetJobDetailIndex(params) {
    return request('post', '/api/BpoJob/GetJobDetailIndex', params);
}
//是否选择了企业性质
export function IsShowChooseCompanyNature(params) {
    return request('post', '/api/BpoServiceUser/IsShowChooseCompanyNature', params);
}
//验证投标权限
export function VerifyAuthorization(params) {
    return request('post', '/JobWorkflow/PickJob/VerifyAuthorization', params);
}
//投标工单最高价和最低价
export function GetPickMarketJobPara(params) {
    return request('post', '/JobWorkflow/PickJob/GetPickMarketJobPara', params);
}
//确认投标
export function PickMarketJob(params) {
    return request('post', '/JobWorkflow/PickJob/PickMarketJob', params);
}
//验证有无此账号
// export function existaccount(params) {
//     return request('post', '/personApi/register/existaccount', params);
// }
//图片验证码
export function GetImageCode(params) {
    return request('post', '/ChuJu/HYCommon/GetImageCode', params, false);
}
//手机验证码
export function SendMobileCode(params) {
    return request('post', '/ChuJu/HYCommon/SendMobileCode', params);
}
//企业注册
export function CompanyRegister(params) {
    return request('post', '/api/AppCompany/CompanyRegister', params);
}
//个人注册
export function Signup(params) {
    return request('post', '/personApi/register/signup', params);
}
//绑定手机号
export function Binduserinfo(params) {
    return request('get', '/personApi/sso/binduserinfo', params);
}
//首页
export function GetAppHomeData(params) {
    return request('post', '/api/BpoServiceUser/GetAppHomeData', params);
}
//首页轮播
export function GetAdvertise(params) {
    return request('post', '/api/BpoServiceUser/GetAdvertise', params);
}
//微信分享
export function GetWxJsSdkConfigPara(params) {
    return request('post', '/shareApi/Shared/GetWxJsSdkConfigPara', params);
}
//工单支付信息
export function GetAccountPayInfo(params) {
    return request('post', '/api/BpoJobPay/GetAccountPayInfo', params);
}
//创建支付订单
export function CreatePayOrder(params) {
    return request('post', '/api/BpoJobPay/CreatePayOrder', params);
}
//统计活跃用户
export function TraceAddAccountTraceLog(params) {
    return request('post', '/api/Trace/AddAccountTraceLog', params);
}
//我的承接工单列表
export function GetMyPickJobList(params) {
    return request('post', '/JobWorkflow/PickJobCenter/GetMyPickJobList', params, false);
}
//我的已发工单列表
export function ListSendJob(params) {
    return request('post', '/api/Job/Job/ListSendJob', params, false);
}
//我的已发工单tab
export function GetSendJobSummary(params) {
    return request('post', '/api/Job/Job/GetSendJobSummary', params, false);
}
//工单流程
export function GetAppSendJobViewInfo(params) {
    return request('post', '/api/JobWorkflow/AddJob/GetAppSendJobViewInfo', params, false);
}
//取消工单
export function CancelJob(params) {
    return request('post', '/api/JobWorkflow/AddJob/CancelJob', params, false);
}
//取消工单原因
export function GetOperationReason(params) {
    return request('post', '/JobWorkflow/PickJob/GetOperationReason', params, false);
}
//免费呼叫接口 
export function FreeCallPhone(params) {
    return request('post', '/JobWorkflow/PickJob/ThreePartyCall', params)
}
//推荐接单人列表 
export function GetJobRecommendReceiverList(params) {
    return request('post', '/api/JobWorkflow/AddJob/GetJobRecommendReceiverList', params)
}
//邀请接单人 
export function InviteJob(params) {
    return request('post', '/api/JobWorkflow/AddJob/InviteJob', params)
}
//提交发单方评价 
export function SubmitJobServiceCommend(params) {
    return request('post', '/api/JobWorkflow/AddJob/SubmitJobServiceCommend', params)
}
//获取投标人列表 
export function GetTenderList(params) {
    return request('post', '/api/JobWorkflow/AddJob/GetTenderList', params)
}
//获取投标人服务方案 
export function GetMarketJobTenderInfo(params) {
    return request('post', '/JobWorkflow/PickJob/GetMarketJobTenderInfo', params)
}
//获取服务站信息 
export function GetServiceSiteInfo(params) {
    return request('post', '/api/BpoCompanyService/GetServiceSiteInfo', params)
}
//获取工程师信息 
export function GetUserEngineerInfo(params) {
    return request('post', '/api/UserCenter/GetUserEngineerInfo', params)
}
//获取工程师报告 
export function GetEngineerReportInfo(params) {
    return request('post', '/JobWorkflow/PickJobCenter/GetEngineerReportInfo', params)
}
//下载服务单 
export function GetJobZipFileInfo(params) {
    return request('post', '/JobWorkflow/PickJobCenter/GetJobZipFileInfo', params);
}
//确认内部工单服务报告
export function ConfirmInternalJobServiceReport(params) {
    return request('post', '/api/JobWorkflow/AddJob/ConfirmInternalJobServiceReport', params);
}
//获取分配工程师 
export function GetInternalJobAssianUsersSelect(params) {
    return request('post', '/api/BpoJob/GetInternalJobAssianUsersSelect', params);
}
//获取分配菜单 
export function GetInternalJobAssianMenu(params) {
    return request('post', '/api/BpoJob/GetInternalJobAssianMenu', params);
}
//确认分配 
export function ConfirmInternalJobAssign(params) {
    return request('post', '/api/BpoJob/ConfirmInternalJobAssign', params);
}
//同意付款
export function JobAgreePay(params) {
    return request('post', '/JobWorkflow/AddJobCenter/JobAgreePay', params)
}
//额度支付 
export function CreditPay(params) {
    return request('post', '/api/BpoJobPay/CreditPay', params)
}
//余额支付 
export function BalancePay(params) {
    return request('post', '/api/BpoJobPay/BalancePay', params)
}
//微信支付 
export function WeiXinPay(params) {
    return request('post', '/api/BpoJobPay/WeiXinPay', params)
}
//支付宝参数 
export function GetAliPayPara(params) {
    return request('post', '/api/BpoJobPay/GetAliPayPara', params)
}
//账户安全信息 
export function GetAccountSecurityInfo(params) {
    return request('post', '/api/AccountSecurity/GetAccountSecurityInfo', params)
}
//获取验证码 
export function SendValidCode(params) {
    return request('post', '/ChuJu/HYCommon/SendValidCode', params)
}
//校验验证码 
export function CheckValidCode(params) {
    return request('post', '/ChuJu/HYCommon/CheckValidCode', params)
}
//重置登录密码
export function ResetPwd(params) {
    return request('post', '/api/AccountSecurity/ResetPwd', params)
}
// 修改绑定手机号
export function UpdateBindPhoneNumber(params) {
    return request('post', '/api/AccountSecurity/UpdateBindPhoneNumber', params)
}
// 修改支付密码
export function UpdatePayPwd(params) {
    return request('post', '/api/AccountSecurity/UpdatePayPwd', params)
}
// 银行列表
export function CodeLines(params) {
    return request('post', '/api/Code/CodeLines', params)
}
// 提交转账凭证
export function ConfirmRechargeBank(params) {
    return request('post', '/api/Finance/ConfirmRechargeBank', params)
}
// 余额明细列表
export function ListTradeRecordByUser(params) {
    return request('post', '/api/Finance/ListTradeRecordByUser', params)
}
// 收款账号
export function GetMyCollectionAccount(params) {
    return request('post', '/api/Finance/GetMyCollectionAccount', params)
}
// 设为默认收款账号
export function SetDefaultCollectionAccount(params) {
    return request('post', '/api/Finance/SetDefaultCollectionAccount', params)
}
// 删除收款账号
export function DeleteCollectionAccount(params) {
    return request('post', '/api/Finance/DeleteCollectionAccount', params)
}
// 添加企业收款账号
export function AddCompanyBankCardInfo(params) {
    return request('post', '/api/Finance/AddCompanyBankCardInfo', params)
}
// 添加个人收款账号
export function AddCollectionAccount(params) {
    return request('post', '/api/Finance/AddCollectionAccount', params)
}
// 确认添加银行卡账号
export function SureAddBankAccount(params) {
    return request('post', '/api/Finance/SureAddBankAccount', params)
}
// 提交个人提现申请
export function SubmitPersonWithDrawApply(params) {
    return request('post', '/api/Finance/SubmitPersonWithDrawApply', params)
}
// 提交企业提现申请
export function WithdrawWait(params) {
    return request('post', '/api/Finance/WithdrawWait', params)
}
// 提交企业提现申请
export function WeixinUnifiedorderRechargeByApp(params) {
    return request('post', '/api/BpoPay/WeixinUnifiedorderRechargeByApp', params)
}
// 微信公众号登录
export function WxOffcialAccountLogin(params) {
    return request('post', '/personApi/Third/WxOffcialAccountLogin', params)
}
// 绑定第三方账号
export function BindThirdAccount(params) {
    return request('post', '/personApi/Third/BindThirdAccount', params)
}

// 企业手机号登录
export function CompanyMobileLogin(params) {
    return request('post', '/api/Account/AccountAuth/CompanyMobileLogin', params)
}
//个人实名认证
export function RealNamePersonAuth(params) {
    return request('post', '/api/User/RealNamePersonAuth', params);
}
//企业实名认证
export function RealNameEnterpriseAuth(params) {
    return request('post', '/api/User/RealNameEnterpriseAuth', params);
}
//ocr文字识别身份证
export function scanID(params) {
    let url = window.location.protocol + '//personcard.market.alicloudapi.com/ai-market/ocr/personid'
    return ocrScan('post', url, params);
}
//ocr文字识别营业执照
export function scanLicense(params) {
    let url = window.location.protocol + '//blicence.market.alicloudapi.com/ai_business_license';
    return ocrScan('post', url, params);
}
//天威云人脸识别
export function scanFace(params) {
    return request('post', '/api/BpoContract/H5portraitAuth', params);
}
//用户合同列表
export function GetUserContractList(params) {
    return request('post', '/api/BpoContract/GetUserContractList', params);
}
//用户签约合同
export function UserSignContract(params) {
    return request('post', '/api/BpoContract/UserSignContract', params);
}
//获取pdf地址
export function ConvertPDF(params) {
    return request('post', '/api/BpoContract/ConvertPDF', params);
}
//签约时发送验证码
export function TianWeiSendMobileCode(params) {
    return request('post', '/ChuJu/HYCommon/TianWeiSendMobileCode', params);
}
//代发单二维码
export function CreateReplaceSendJobQrCode(params) {
    return request('post', '/api/JobWorkflow/AddJob/CreateReplaceSendJobQrCode', params)
}
//代发单信息
export function GetReplaceSendJob(params) {
    return request('post', '/api/JobWorkflow/AddJob/GetReplaceSendJob', params)
}

//服务流程
export function GetServiceProcessView(params) {
    return request('post', '/api/JobWorkflow/AddJob/GetServiceProcessView', params)
}
//到场确认数据
export function GetConfirmJobTaskInfo(params) {
    return request('post', '/JobWorkflow/PickJob/GetConfirmJobTaskInfo', params)
}
//离场确认数据
export function GetLeaveConfirmInfo(params) {
    return request('post', '/JobWorkflow/PickJob/GetLeaveConfirmInfo', params)
}
//电话外呼
export function AXBindPhone(params) {
    return request('post', '/api/BpoPrivateNumber/AXBindPhone', params)
}
//电话外呼2
export function AxbBindPhone(params) {
    return request('post', '/api/BpoPrivateNumber/AxbBindPhone', params)
}
//工单群详情
export function GetJobGroupInfo(params) {
    return request('post', '/api/Im/GetJobGroupInfo', params, false)
}
//加群
export function AddGroupMember(params) {
    return request('post', '/api/Im/AddGroupMember', params, false)
}
//单聊列表
export function GetUserSingleChats(params) {
    return request('post', '/api/Im/GetUserSingleChats', params)
}
//群聊列表
export function GetJointGroups(params) {
    return request('post', '/api/Im/GetJointGroups', params)
}
//用户信息
export function GetUserImInfo(params) {
    return request('post', '/api/Im/GetUserImInfo', params)
}
//再发一单
export function GetRepublishSendJob(params) {
    return request('post', '/api/JobWorkflow/AddJob/GetRepublishSendJob', params)
}
//城市列表
export function GetSelectCityView(params) {
    return request('post', '/api/Account/AccountAddress/GetSelectCityView', params)
}
//发单地址列表
export function ListJobAddress(params) {
    return request('post', '/api/Account/AccountAddress/ListJobAddress', params)
}
//添加发单地址
export function AddJobAddress(params) {
    return request('post', '/api/Account/AccountAddress/AddJobAddress', params)
}
//修改发单地址
export function UpdateJobAddress(params) {
    return request('post', '/api/Account/AccountAddress/UpdateJobAddress', params)
}
//删除发单地址
export function DeleteJobAddress(params) {
    return request('post', '/api/Account/AccountAddress/DeleteJobAddress', params)
}
//设置默认发单地址
export function SetDefaultJobAddress(params) {
    return request('post', '/api/Account/AccountAddress/SetDefaultJobAddress', params)
}
//发单方发送消息后
export function AddIMMessage(params) {
    return request('post', '/api/Im/AddIMMessage', params, false)
}
//私聊判断是否可打开投标详情
export function IsRedirectBpoApplyOrder(params) {
    return request('post', '/api/JobApplyOrder/IsRedirectBpoApplyOrder', params)
}
//绑定微信号
export function BindThirdAccount2(params) {
    return request('post', '/api/Account/AccountAuth/BindThirdAccount', params)
}
//微信号绑定的账号
export function GetWxOfficialAccountInfo(params) {
    return request('post', '/api/Account/AccountAuth/GetWxOfficialAccountInfo', params)
}
//获取首页发单配置
export function GetIndexSendJobConfig(params) {
    return request('post', '/api/JobWorkflow/AddJob/GetIndexSendJobConfig', params)
}