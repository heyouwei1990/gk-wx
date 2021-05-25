<template>
  <div class="personWithdraw">
    <van-nav-bar
      title="退款"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <div class="module-item">
      <div class="label">提现渠道</div>
      <div class="flex">
        <div class="amount" :class="{on:type==1}" @click="type=1">余额：￥{{userData.MpValue | formatPrice}}</div>
        <div class="amount" :class="{on:type==2}" @click="type=2">佣金：￥{{userData.Commission | formatPrice}}</div>
      </div>
    </div>
    <div class="module-item">
      <div class="label">提现金额</div>
      <div class="input-box">
        <i class="unit">￥</i>
        <input type="text" class="input" v-model.number="amount" >
      </div>
    </div>
    <div class="module-item">
      <div class="label">提现方式</div>
      <ul class="account-list" >
        <li v-for="(item,index) in accountList" :key="item.ID" :class="{'on':defaultIndex==index}" @click="choose(index)">
          <div class="account-dl">
            <div class="account-dt" :style="{'background-image':'url('+item.BankImage+')'}"></div>
            <div class="account-dd">{{item.DisplayAccount}}</div>
          </div>
        </li>
      </ul>
      <div class="btn-add" @click="$router.push('/addAccount')">
        <van-icon name="plus" />
        新增账户
      </div>
    </div>
    <div class="tip-wrapper">
      <h4 class="title">温馨提示：</h4>
      <p class="desc">1.提现金额输入值必须是不小于100且不大于20000的正整数；如有问题，请咨询客服；</p>
      <p class="desc">2.提现完成后，您可以进入账户提现记录页面进行查看提现状态。</p>
    </div>
    <button class="btn-primary" @click="confirm">下一步</button>
    <van-popup v-model="showPassword">
      <password-dialog @confirm="submit" @close="showPassword=false"></password-dialog>
    </van-popup>
  </div>
</template>
<script>
import PasswordDialog from '@/components/passwordDialog.vue'
import {mapState} from 'vuex'
import {GetMyCollectionAccount,SubmitPersonWithDrawApply} from '@/common/api.js'
export default {
  name:'PersonWithdraw',
  components:{
    PasswordDialog
  },
  data(){
    return{
      amount:'',
      accountList:[],
      showPassword:false,
      balance:0,
      commission:0,
      type:1,
      defaultIndex:0
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
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
        userInfo:this.userData.UserId+'_1',
        ShowTypes:[1,2]
      }
      GetMyCollectionAccount(params).then(r=>{
        if(r.Result==1){
          this.accountList=r.Data;
        }else{
          this.$toast(r.Message);
        }
      })
    },
    choose(index){
      this.defaultIndex=index;
    },
    confirm(){
      if(this.amount===''){
        this.$toast('请输入提现金额！');
        return;
      }
      if(this.amount % 100!==0 || this.amount<100 || this.amount>20000){
        this.$toast('金额请输入100~20000之间的100的整数倍！');
        return;
      }
      this.showPassword=true;
    },
    submit(password){
      SubmitPersonWithDrawApply({
        UserId:this.userData.UserId,
        WidthDrawAmount:this.amount,
        WithDrawChannel:this.type,
        PayPassword:password,
        CollectionAccountId:this.accountList[this.defaultIndex].ID,
      }).then(r=>{
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
.personWithdraw{
  padding-top: 46px;
  background-color: #fff;
  min-height: 100vh;
  .module-item{
    padding: 10px 15px 0;
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      margin-bottom: 10px;
    }
  }
  .flex{
    @include flex;
  }
  .amount{
    width: 48%;
    height: 44px;
    border: 1px solid #e5e5e5;
    font-size: 14px;
    line-height: 42px;
    background-color: #fff;
    color: #666;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    &.on{
      border-color: $primary;
      color: $primary;
    }
  }
  .input-box{
    position: relative;
    .unit{
      position: absolute;
      left: 6px;
      top: 0;
      font-size: 16px;
      color: $primary;
      line-height: 44px;
    }
    .input{
      border: 1px solid #e5e5e5;
      line-height: 22px;
      height: 44px;
      color: #333;
      font-size: 20px;
      padding: 10px;
      padding-left: 30px;
      text-align: right;
      font-family:$number;
      width: 100%;
    }
  }
  
  .account-list{
    >li{
      border: 1px solid #e5e5e5;
      margin-bottom: 15px;
      &.on{
        border-color: $primary;
      }
    }
    .account-dl{
      @include flex;
      padding: 0px 4px;
      height: 44px;
      background-color: #fff;
    }
    .account-dt{
      width: 80px;
      height: 40px;
      margin-right: 10px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }
    .account-dd{
      flex: 1;
      min-width: 10px;
      font-size: 13px;
      color: #999;
      line-height: 24px;
    }
  }
  .btn-add{
    height: 44px;
    background-color: #fff;
    padding-left: 10px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    border: 1px solid #e5e5e5;
    .van-icon-plus{
      font-size: 20px;
      color: #999;
      margin-right: 10px;
    }
  }
  .tip-wrapper{
    padding: 20px 15px;
    .title{
      font-size: 14px;
      color: #333;
      line-height: 24px;
    }
    .desc{
      font-size: 14px;
      color: #666;
      line-height: 22px;
    }
  }
  .btn-primary{
    width: 160px;
    height: 40px;
    line-height: 40px;
    display: block;
    margin: 40px auto 20px;
    font-size: 16px;
  }
}
</style>