<template>
  <div class="payDeposit">
    <van-nav-bar
      title="支付"
      left-arrow
      fixed
      :border="false"
      @click-left="back"
    />
    <div class="order-info">
      <div class="page-title"><i class="logo"></i><span>{{from==3?'急单服务费用':'支付'}}</span></div>
      <div class="price"><i class="unit">￥</i>{{pageData.PayAmount | formatPrice}}</div>
      <div class="info-item">工单号：{{pageData.JobNo}}</div>
      <div class="info-item">工单名称：{{pageData.JobTitle}}</div>
    </div>
    <template v-for="(item,index) in paymentRoutes">
      <div :class="['pay-item',{on:index===payType,disabled:item.value===0}]" v-if="item.isShow" :key="'pay'+index" @click="choose(index)">
        <img :src="item.icon" alt="" class="icon">
        <span class="label">{{item.label}}</span>
        <span class="value" v-if="item.value">¥{{item.value | formatPrice}}</span>
        <span class="flex1"></span>
        <span class="btn-text" v-if="index==1" @click="$router.push('/recharge')">去充值</span>
      </div>
    </template>
    <div class="btn-primary" @click="pay">支付</div>
    <van-popup v-model="showPassword">
      <password-dialog @confirm="submit" @close="showPassword=false"></password-dialog>
    </van-popup>
  </div>
</template>
<script>
import {
  GetAccountPayInfo,
  CreatePayOrder,
  BalancePay,
  GetAliPayPara,
  WeiXinPay,
  CreditPay,
  Impower
} from '@/common/api.js'
import {aesEncrypt} from '@/common/aesHelper.js'
import {mapState} from 'vuex'
import PasswordDialog from '@/components/passwordDialog.vue'
import wx from 'weixin-js-sdk'
export default {
  name:'PayDeposit',
  components:{
    PasswordDialog
  },
  data(){
    return{
      payId:'',
      pageData:{
        IsCreditEnterprise: false
      },
      showPassword:false,
      password:'',
      payType:'',
      from:0,//1发单，2工单详情,3急单支付,
      jobId:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData
    }),
    paymentRoutes(){
      let arr=[{
        icon:require('../../assets/payment/payCredit.png'),
        label:'额度',
        isShow:false,
        value:'',
      },{
        icon:require('../../assets/payment/payBalance.png'),
        label:'余额',
        isShow:true,
        value:'',
      },{
        icon:require('../../assets/payment/payAlipay.png'),
        label:'支付宝',
        isShow:false,
        value:'',
      },{
        icon:require('../../assets/payment/weChatPay.png'),
        label:'微信',
        isShow:true,
        value:'',
      }]
      if(this.pageData){
        arr[0].value=this.pageData.CreditLineMpValue;
        arr[0].isShow=this.pageData.IsCreditEnterprise;
        arr[1].isShow=!this.pageData.IsCreditEnterprise;
        arr[1].value=this.pageData.MpValue;
      }
      let ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) != 'micromessenger'){
        arr[3].isShow=false;
      }
      return arr;
    }
  },
  // watch: {
  //   pageData:{
  //     handler(value){
  //       if(value){
  //         this.paymentRoutes[0].value=value.CreditLineMpValue;
  //         this.paymentRoutes[0].isShow=value.IsCreditEnterprise;
  //         this.paymentRoutes[1].isShow=!value.IsCreditEnterprise;
  //         this.paymentRoutes[1].value=value.MpValue;
  //       }
  //     },
  //     deep:true,
  //   }
  // },
  mounted() {
    this.payId=this.$route.query.payId;
    this.jobId=this.$route.query.jobId;
    this.from=Number(this.$route.query.from);
    this.init();
  },
  methods: {
    back(){
      if(this.from==3){
        this.$router.go(-1);
      }else{
        this.$router.replace('/');
      }
    },
    init(){
      if(!this.userData){
        return;
      }
      var params={
        payId:this.payId,
      }
      var text=this.userData.UserCode.substr(0,1);
      if(text=='e'){
        params['loginCompanyId']=this.userData.CompanyId;
      }
      if(text=='p'){
        params['loginUserId']=this.userData.UserId;
      }
      GetAccountPayInfo(params).then(r=>{
        if(r.Result==1){
          this.pageData={...r.Data};
        }else{
          this.$toast(r.Message);
        }
      })
    },
    choose(index){
      this.payType=index;
    },
    //支付
    pay(){
      if(this.payType===''){
        this.$toast('请选择支付方式');
        return;
      }else
      if(this.payType===0){
        //额度支付
        this.showPassword=true;
      }else
      if(this.payType===1){
        //余额支付
        this.showPassword=true;
      }else
      if(this.payType===2){
        //支付宝支付
        this.alipay();
      }else
      if(this.payType===3){
        //微信支付
        this.wxpay();
      }
    },
    //余额支付
    submit(password){
      var params={
        jobId:this.pageData.JobId,
        payId:this.payId,
        payPwd:aesEncrypt(password),
      }
      if(this.userData && (this.userData.UserCode).indexOf('e')===0){
        params['companyId']=this.userData.CompanyId;
      }
      if(this.userData && (this.userData.UserCode).indexOf('p')===0){
        params['userId']=this.userData.UserId;
      }
      if(this.payType==0){
        CreditPay(params).then(r=>{
          if(r.Result==1){
            let startTime=new Date(r.Data.ReleaseDate).getTime();//支付成功时间
            let hour=this.pageData.ResponseTime || 4;//响应时长
            let endTime=startTime+4*60*60*1000;//回应时间
            if(this.from==2){
              this.$router.go(-1);//如果从工单详情进来的，支付成功直接返回
            }else{
              this.$router.replace({path:'/paySuccess',query:{jobId:r.Data.JobId,targetTime:endTime,jobType:this.from==3?1:6}})
            }
          }else{
            this.$toast(r.Message);
          }
        })
      }else{
        BalancePay(params).then(r=>{
          if(r.Result==1){
            let startTime=new Date(r.Data.ReleaseDate).getTime();//支付成功时间
            let hour=this.pageData.ResponseTime || 4;//响应时长
            let endTime=startTime+4*60*60*1000;//回应时间
            if(this.from==2){
              this.$router.go(-1);
            }else{
              this.$router.replace({path:'/paySuccess',query:{jobId:r.Data.JobId,targetTime:endTime,jobType:this.from==3?1:6}})
            }
          }else{
            this.$toast(r.Message);
          }
        })
      }
    },
    wxpay(){
      if(!this.userData.WxOfficialAccOpenId){
        //未授权需先授权
        let path=this.$route.path.substr(1);
        let url=window.location.href.replace('#/'+path,'');
        if(url.indexOf('?')!=-1){
          url+='&path='+path;
        }else{
          url+='?path='+path;
        }
        Impower(url,1,this.userData.UserCode);
        return;
      }
      let params={
        payId:this.payId,
        applicationType:5,
      }
      if(this.userData && (this.userData.UserCode).indexOf('e')===0){
        params['accountId']=this.userData.CompanyId;
        params['accountType']=2;
      }
      if(this.userData && (this.userData.UserCode).indexOf('p')===0){
        params['accountId']=this.userData.UserId;
        params['accountType']=1;
      }
      let that=this;
      WeiXinPay(params).then(r=>{
        if(r.Result==1){
          let data=r.Data;
          wx.config({
            debug: false,
            appId: data.AppId,
            timestamp: data.Timestamp,
            nonceStr: data.NonceStr,
            signature: data.WxPaySign,
            jsApiList: ['chooseWXPay']
          })
          let config={
            timestamp: data.Timestamp,
            nonceStr:data.NonceStr,
            package:`prepay_id=${data.Prepay_Id}`,
            paySign:data.WxPaySign,
            signType:'MD5',
            success(res) {
              that.init();
              if(that.from==2){
                that.$router.go(-1);
              }else{
                that.$router.push({path:'/paySuccess',query:{jobId:that.jobId,jobType:that.from==3?1:6}});
              }
            },
          }
          wx.ready(()=>{
            wx.chooseWXPay(config)
          })
          
        }else{
          this.$toast(r.Message);
        }
      })
    },
    alipay(){
      let params={
        jobId:this.jobId,
        payId:this.payId,
      }
      if(this.userData && (this.userData.UserCode).indexOf('e')===0){
        params['companyId']=this.userData.CompanyId;
      }
      if(this.userData && (this.userData.UserCode).indexOf('p')===0){
        params['userId']=this.userData.UserId;
      }
      GetAliPayPara(params).then(r=>{
        if(r.Result==1){
          console.log(r);
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.payDeposit{
  padding-top: 46px;
  overflow: hidden;
  background-color: #fff;
  .order-info{
    padding: 30px 15px 40px;
    .page-title{
      top: 30px;
      font-size: 18px;
      color: #333;
      line-height: 30px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .logo{
      width: 26px;
      height: 24px;
      background-color: #f5f5f5;
      margin-right: 10px;
      @include bg('~@/assets/logo.png');
      background-position: left center;
      background-size: auto 20px;
    }
    .price{
      font-size: 30px;
      color: #333;
      line-height: 2;
      margin-bottom: 10px;
      text-align: center;
      font-weight: 500;
      font-family: $number;
    }
    .unit{
      font-size: 18px;
      color: #ff3838;
      line-height: 2;
      padding-right: 6px;
    }
    .info-item{
      font-size: 14px;
      color: #333;
      line-height: 24px;
    }
  }
  .pay-item{
    margin: 0 15px 15px;
    border: 1px solid #E3E3E3;
    background-color: #fff;
    display: flex;
    align-items: center;
    height: 44px;
    padding: 10px;
    &.on{
      border-color: $primary;
    }
    &.disabled{
      border-color: #E3E3E3;
      background-color: #f8f8f8;
    }
    .icon{
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
    }
    .value{
      font-size: 14px;
      color: $primary;
      line-height: 24px;
      margin-left: 10px;
    }
    .flex1{
      flex: 1;
    }
    .btn-text{
      font-size: 14px;
      color: $primary;
      line-height: 24px;
    }
  }
  .btn-primary{
    display: block;
    width: 160px;
    margin: 34px auto 26px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 16px;
  }
  
}

</style>