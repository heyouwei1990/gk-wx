<template>
  <div class="balance-page">
    <van-nav-bar
      title="余额"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <div class="main">
      <div class="inner">
        <div class="company-module" v-if="isCompany">
          <div class="label">速派余额</div>
          <div class="balance">¥{{userData.MpValue | formatPrice}}</div>
        </div>
        <div class="personal-module" v-if="!isCompany">
          <div class="balance">¥{{userData.MpValue | formatPrice}}</div>
          <div class="label">速派余额</div>
        </div>
        <div class="personal-module" v-if="!isCompany">
          <div class="balance">¥{{userData.Commission  | formatPrice}}</div>
          <div class="label">佣金</div>
        </div>
      </div>
    </div>
    <ul class="nav-list">
      <li class="nav-cell" @click="$router.push('/recharge')"><span class="label">充值</span></li>
      <li class="nav-cell" @click="toWithdraw"><span class="label">提现</span></li>
      <li class="nav-cell" @click="$router.push('/balanceBill')"><span class="label">收支明细</span></li>
      <li class="nav-cell" @click="$router.push('/accountManage')"><span class="label">收款账号</span></li>
    </ul>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name:'Balance',
  data(){
    return{
      isCompany:true,
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  mounted() {
    if(this.userData && this.userData.LoginType==2){
      this.isCompany=true;
    }
    if(this.userData && this.userData.LoginType==1){
      this.isCompany=false;
    }
    this.init();
  },
  methods: {
    init(){
      this.$store.dispatch('loadAccountData');
    },
    toWithdraw(){
      if(this.isCompany){
        this.$router.push('/withdraw');
      }else{
        this.$router.push('/personWithdraw');
      }
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.balance-page{
  padding-top: 45px;
  min-height: calc(100vh - 46px);
  background-color: #fff;
  .main{
    background: url('../../assets/center/balance-bg.png') no-repeat center top /cover;
    width: 100%;
    height: 111px;
    .inner{
      width: 86%;
      height: 100px;
      position: relative;
      top: 40px;
      z-index: 2;
      box-shadow:0px 5px 15px 0px rgba(33,23,20,0.1);
      border-radius:10px;
      background-color: #fff;
      margin: 0px auto;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .company-module{
      display: flex;
      align-items: flex-end;
      justify-content: center;
      .label{
        margin-right: 20px;
      }
    }
    .personal-module{
      text-align: center;
      padding-left: 10px;
      padding-right: 10px;
      min-width: 50%;
      border-right: 1px solid #e5e5e5;
      &:last-child{
        border-right: 0;
      }
    }
    .label{
      font-size: 13px;
      color: #333;
      line-height: 30px;
    }
    .balance{
      font-size: 24px;
      color:#f75959;
      line-height: 40px;
      text-align: center;
      font-family: $number;
      font-weight: 500;
    }
  }
  
  .nav-list{
    margin-top: 44px;
    .nav-cell{
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      width: 100%;
      height: 44px;
      padding-left: 15px;
      padding-right: 28px;
      position: relative;
      &:after{
        content:"\F00A";
        font-family: "vant-icon";
        font-size: 16px;
        color: #666;
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
      }
      &:active{
        background-color: #f9f9f9;
      }
    }
    .label{
      flex:1;
      font-size: 15px;
      color: #333;
      line-height: 1.5;
    }
  }
}
</style>