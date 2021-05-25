<template>
  <div class="userCenter">
    <div class="userinfo-wrapper">
      <div class="userinfo" @click="toDetail" v-if="userData">
        <img :src="userData.HeadImg" alt="" class="avatar">
        <div class="flex1">
          <div class="user-name">{{userData.NickName || userData.LoginName}}</div>
          <div class="user-title">{{userData.RoleName}} <i class="icon-auth" v-if="userData.RealNameStatus"></i></div>
        </div>
      </div>
    </div>
    <ul class="nav-list">
      <li class="nav-cell" @click="$router.push('/balance')">
        <img src="../../assets/center/icon-balance.png" alt="" class="icon">
        <span class="label">余额</span>
        <span class="value price" v-if="userData">￥{{userData.MpValue}}</span>
      </li>
      <li class="nav-cell" @click="$router.push('/companyRealName')" v-if="userData.LoginType==2 && !userData.RealNameStatus">
        <img src="../../assets/center/icon-auth.png" alt="" class="icon">
        <span class="label">企业认证</span>
        <!-- <span class="value auth" v-if="userData && userData.RealNameStatus">已认证</span> -->
      </li>
      <li class="nav-cell" @click="$router.push('/personRealName')" v-if="userData.LoginType==1 && !userData.RealNameStatus">
        <img src="../../assets/center/icon-auth.png" alt="" class="icon">
        <span class="label">实名认证</span>
        <!-- <span class="value auth" v-if="userData">已认证</span> -->
      </li>
      <li class="nav-cell" @click="$router.push('/contract')">
        <img src="../../assets/center/icon-contract.png" alt="" class="icon">
        <span class="label">签署合同</span>
        <span class="value"></span>
      </li>
      <li class="nav-cell" @click="$router.push('/setting')">
        <img src="../../assets/center/icon-setting.png" alt="" class="icon">
        <span class="label">设置</span>
        <span class="value"></span>
      </li>
    </ul>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name:'UserCenter',
  data(){
    return{
      
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
    toDetail(){
      if(this.userData && this.userData.UserId){
        this.$router.push('/userInfo')
      }
      if(this.userData && this.userData.CompanyId){
        this.$router.push('/companyInfo')
      }
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.userCenter{
  min-height: 100vh;
  background-color: #fff;
  .userinfo-wrapper{
    height: 150px;
    width: 100%;
    overflow: hidden;
    position: relative;
    &:before{
      content: "";
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 4000px;
      height: 4000px;
      border-radius: 0 0 50% 50%;
    background:linear-gradient(0deg,rgba(249,249,249,0.99) 0%,#fff 3%);
    }
  }
  .userinfo{
    display: flex;
    padding: 38px 28px 48px 15px;
    align-items: center;
    position: relative;
    z-index: 1;
    .flex1{
      flex: 1;
    }
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
  }
  .avatar{
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #f8f8f8;
    margin-right: 20px;
  }
  .user-name{
    font-size: 19px;
    color: #333;
    line-height: 1.5;
    margin-bottom: 10px;
  }
  .user-title{
    font-size: 13px;
    color: #666;
    line-height: 1.5;
  }
  .icon-auth{
    display: inline-block;
    width: 50px;
    height: 16px;
    @include bg('../../assets/center/icon-realname.png',contain);
    vertical-align: middle;
    margin-left: 6px;
    margin-top: -2px;
  }
  .nav-list{
    margin-top: 20px;
    .nav-cell{
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
    }
    .icon{
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
    .label{
      flex:1;
      font-size: 15px;
      color: #333;
      line-height: 1.5;
    }
    .value{
      font-size: 12px;
      color: #999;
      line-height: 1.5;
    }
    .price{
      font-size: 15px;
      color: #f75959;
      font-family: $number;
    }
    .auth{
      font-size: 13px;
      color: #f75959;
    }
  }
}
</style>