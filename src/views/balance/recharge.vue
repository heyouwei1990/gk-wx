<template>
  <div class="rechargePage">
    <van-nav-bar
      title="充值"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <div class="title">
      <i class="logo"></i>
      <span>充值金额</span>
    </div>
    <div class="input-box">
      <span class="unit">￥</span>
      <input type="number" class="input" v-model.number="amount">
    </div>
    <div class="balance-item">
      <span class="label">账户余额：</span>
      <div class="value price" v-if="userData">￥{{userData.MpValue | formatPrice}}</div>
    </div>
    <div class="balance-item">
      <span class="label">充值方式：</span>
    </div>
    <template v-for="(item,index) in paymentRoutes">
      <div :class="['pay-item',{on:index===payType,disabled:item.value===0}]" v-if="item.isShow" :key="'pay'+index" @click="choose(index)">
        <img :src="item.icon" alt="" class="icon">
        <span class="label">{{item.label}}</span>
        <span class="value" v-if="item.value">¥{{item.value | formatPrice}}</span>
      </div>
    </template>
    <div class="tip-msg">
      <span class="tip">温馨提示：</span>
      <p>1、选择支付宝/微信充值将实时到账，选择银行汇款方式需速派 财务确认 ；</p>
      <p>2、充值成功后，余额可能存在延迟现象，一般1到5分钟内到账， 如有问题，请咨询客服400-1100243；</p>
      <p>3、充值完成后，您可以进入账户充值记录页面进行查看余额充 值状态。</p>
    </div>
    <div class="btn-primary" @click="next">下一步</div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {WeixinUnifiedorderRechargeByApp,Impower} from '@/common/api.js'
import wx from 'weixin-js-sdk'
export default {
  name:'Recharge',
  data(){
    return{
      payId:'',
      paymentRoutes:[{
        icon:require('../../assets/payment/payCredit.png'),
        label:'额度',
        isShow:false,
        value:'',
      },{
        icon:require('../../assets/payment/payBalance.png'),
        label:'余额',
        isShow:false,
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
      },{
        icon:require('../../assets/payment/payRemittance.png'),
        label:'银行汇款',
        isShow:true,
        value:'',
      }],
      payType:'',
      amount:'',
      balance:0
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      this.$store.dispatch('loadAccountData');
    },
    choose(index){
      this.payType=index;
      // this.$router.push('/remittance')
    },
    //下一步
    next(){
      if(this.amount==''){
        this.$toast('请输入充值金额！');
        return;
      }
      if(this.payType==''){
        this.$toast('请选择充值方式！');
        return;
      }
      if(this.payType==4){
        this.$router.push({path:'/remittance',query:{amount:this.amount}})
      }
      if(this.payType==3){
        this.wxPay();
      }
    },
    wxPay(){
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
      let that=this;
      WeixinUnifiedorderRechargeByApp({
        UserCode:this.userData.UserCode,
        Money:this.amount,
        Ip:'1.1.1.1',
        platform2:'jsapi'
      }).then(r=>{
        if(r.Result==1){
          let data=r.Data;
          wx.config({
            debug: false,
            appId: data.appid,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.sign,
            jsApiList: ['chooseWXPay']
          })
          let config={
            timestamp: data.timestamp,
            nonceStr:data.noncestr,
            package:`prepay_id=${data.prepayid}`,
            paySign:data.sign,
            signType:'MD5',
            success(res) {
              that.init();
              that.$router.push({path:'/balanceSuccess',query:{type:1}});
            },
          }
          wx.ready(()=>{
            wx.chooseWXPay(config)
          })
          
        }else{
          this.$toast(r.Message);
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.rechargePage{
  padding-top: 46px;
  min-height: 100vh;
  background-color: #fff;
  .title{
    padding: 20px 15px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
    line-height: 24px;
    .logo{
      width: 28px;
      height: 21px;
      @include bg('~@/assets/logo.png');
      background-position: left center;
      background-size: 104px 21px;
      margin-right: 8px;
    }
  }
  .input-box{
    width: 160px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin:20px auto;
    .unit{
      color: $primary;
      font-size: 18px;
      line-height: 30px;
      font-family: $number;
      font-weight: 500;
    }
    .input{
      width: 100px;
      flex: 1;
      height: 40px;
      border: 1px solid #e5e5e5;
      font-size: 30px;
      color: #333;
      font-family: $number;
      font-weight: 500;
      padding: 4px 10px;
      line-height: 30px;
      &:focus{
        border-color: $primary;
      }
    }
  }
  .balance-item{
    @include flex;
    padding: 10px 15px;
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      flex: 1;
      width: 100px;
    }
    .value{
      font-size: 14px;
      color: $primary;
      line-height: 24px;
      &.price{
        font-family: $number;
        font-weight: 500;
      }
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
      flex: 1;
      width: 100px;
    }
    .value{
      font-size: 14px;
      color: #f75959;
      line-height: 24px;
    }
  }
  .tip-msg{
    margin-top: 20px;
    padding: 0 15px;
    .tip{
      font-size: 12px;
      color: #666;
      line-height: 24px;
    }
    p{
      font-size: 12px;
      color: #666;
      line-height: 20px;
    }
  }
  .btn-primary{
    display: block;
    width: 50%;
    margin: 34px auto 26px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 16px;
  }
}
</style>