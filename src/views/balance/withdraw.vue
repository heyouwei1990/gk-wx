<template>
  <div class="withdraw">
    <van-nav-bar
      title="退款"
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
      <span class="amount">{{userData.MpValue |formatPrice}}</span>
    </div>
    <p class="tips">注：企业账户退款只能一次性退款至其预留的企业账户。</p>
    <div class="flex">
      <span class="label">收款账号：</span>
      <span class="btn-text" @click="$router.push({path:'/accountManage',query:{type:1}})">更换账号</span>
    </div>
    <div class="info-item">
      <span class="label">收款银行：</span>
      <span class="value">{{bankName}}</span>
    </div>
    <div class="info-item">
      <span class="label">账号：</span>
      <span class="value">{{account}}</span>
    </div>
    <div class="info-item">
      <span class="label">公司名称：</span>
      <span class="value">{{companyName}}</span>
    </div>
    <div class="btn-primary" @click="confirm">确认退款</div>
    <van-popup v-model="showPassword">
      <password-dialog @confirm="submit" @close="showPassword=false"></password-dialog>
    </van-popup>
  </div>
</template>
<script>
import PasswordDialog from '@/components/passwordDialog.vue'
import {mapState} from 'vuex'
import {GetMyCollectionAccount,WithdrawWait} from '@/common/api.js'
export default {
  name:'Withdraw',
  components:{
    PasswordDialog
  },
  data(){
    return{
      showPassword:false,
      companyName:'',
      bankName:'',
      account:'',
      accountId:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
      bankAccount:state=>state.bankAccount,
    })
  },
  watch: {
    '$route'(to,from){
      if(to.path=='/withdraw' && from.path=='/accountManage'){
        if(this.bankAccount){
          this.bankName=this.bankAccount.BankName;
          this.account=this.bankAccount.Account;
          this.accountId=this.bankAccount.ID;
        }
      }
    }
  },
  mounted() {
    this.loadList();
    this.init();
  },
  methods: {
    init(){
      this.$store.dispatch('loadAccountData');
    },
    //获取提现账号
    loadList(){
      let params={
        userInfo:this.userData.CompanyId+'_2',
        ShowTypes:[2]
      }
      GetMyCollectionAccount(params).then(r=>{
        if(r.Result==1){
          let list=r.Data;
          if(list.length>0){
            this.bankName=list[0].BankName;
            this.account=list[0].Account;
            this.accountId=list[0].ID;
          }
        }else{
          this.$toast(r.Message);
        }
      })
    },
    confirm(){
      this.showPassword=true;
    },
    submit(password){
      let params={
        applyAccountID:this.accountId,
        applyMpValue:this.userData.MpValue,
        password:password,
        userInfo:this.userData.CompanyId+'_2'
      }
      WithdrawWait(params).then(r=>{
        if(r.Result==1){
          this.init();
          this.$router.push({path:'/balanceSuccess',query:{type:1}});
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
.withdraw{
  background-color: #fff;
  min-height: 100vh;
  padding-top: 46px;
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
      line-height: 24px;
      font-family: $number;
      font-weight: 500;
    }
    .amount{
      font-size: 30px;
      color: #333;
      font-family: $number;
      font-weight: 500;
      line-height: 30px;
    }
  }
  .tips{
    font-size: 12px;
    color: #666;
    line-height: 20px;
    padding: 10px 15px;
    margin-bottom: 10px;
  }
  .flex{
    @include flex;
    padding: 10px 15px;
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      font-weight: bold;
      flex: 1;
    }
    .btn-text{
      font-size: 14px;
      color: $primary;
      line-height: 24px;
    }
  }
  .info-item{
    display: flex;
    padding: 10px 15px;
    font-size: 14px;
    line-height: 24px;
    color: #333;
    .label{
      min-width: 5em;
      text-align: justify;
    }
  }
  .btn-primary{
    display: block;
    width: 160px;
    margin: 40px auto 20px;
    font-size: 16px;
    line-height: 40px;
    height: 40px;
    text-align: center;
  }
}
</style>