<template>
  <div class="bindWechat">
    <van-nav-bar
      title="绑定通知"
      fixed
      :border="false"
    />
    <div class="desc">绑定微信账号<br>从此不再错过任何一个工单信息</div>
    <ul class="tab-hd">
      <li v-for="(item,index) in tabHd" :key="index" :class="{on:tabIndex==index}" @click="tabChange(index)">
        <img v-show="tabIndex!=index" class="icon" :src="item.icon" alt="">
        <img v-show="tabIndex==index" class="icon" :src="item.activeIcon" alt="">
        <span class="label">{{item.text}}</span>
      </li>
    </ul>
    <div class="form" v-if="!(tabIndex===0 && bindUser) && !(tabIndex===1 && bindCompany)">
      <div class="form-item">
        <input type="tel" class="input" v-model.trim="phone" maxlength="11" placeholder="请输入手机号">
      </div>
      <div class="form-item">
        <input type="text" class="input" v-model.trim="code" maxlength="6" placeholder="验证码">
        <button class="btn-code" @click="getCode" :disabled="btnDisabled">{{codeBtnText}}</button>
      </div>
      <button class="btn-primary" @click="submit">确定</button>
    </div>
    <div class="account" v-if="tabIndex==0 && bindUser">
      <span class="tip">您已成功绑定个人账号</span>
      <span class="account-name">{{bindUser.TrueName}}</span>
    </div>
    <div class="account" v-if="tabIndex==1 && bindCompany">
      <span class="tip">您已成功绑定企业账号</span>
      <span class="account-name">{{bindCompany.companyName}}</span>
    </div>
  </div>
</template>
<script>
import { SendValidCode, BindThirdAccount2,GetWxOfficialAccountInfo } from "@/common/api.js";
import validate from "@/common/validate.js";
import {mapState} from 'vuex'
export default {
  name:'BindWechat',
  data(){
    return{
      tabHd:[{
        icon:require('@/assets/bind/icon-person.png'),
        activeIcon:require('@/assets/bind/icon-person-active.png'),
        text:'个人用户'
      },{
        icon:require('@/assets/bind/icon-company.png'),
        activeIcon:require('@/assets/bind/icon-company-active.png'),
        text:'企业用户'
      }],
      tabIndex:0,
      phone:'',
      code:'',
      codeBtnText:'获取验证码',
      timer: null,
      btnDisabled:false,
      accountName:'',
      bindUser:null,//绑定的个人信息
      bindCompany:null,//绑定的公司信息
      openId:'',
    }
  },
  created() {
    this.openId=this.$route.query.wxOfficialAccountOpenId;
    this.getWxAccountInfo(0);
  },
  methods: {
    tabChange(index){
      this.tabIndex=index;
      clearInterval(this.timer);
      this.code='';
      this.phone='';
      this.btnDisabled=false;
      this.codeBtnText='获取验证码';
    },
    getWxAccountInfo(type){
      //type==1表示绑定成功回调
      GetWxOfficialAccountInfo({
        WxOfficialAccOpenId:this.openId,
      }).then(r=>{
        if(r.Result==1){
          this.bindCompany=r.Data.CompanyLoginInfo;
          this.bindUser=r.Data.UserLoginInfo;
          if(type==1 && this.tabIndex==0){
            this.bindUser['UserId']=this.bindUser.UserID;
            this.$store.commit('setUserData',this.bindUser);
          }else if(type==1 && this.tabIndex==1){
            this.bindCompany['CompanyId']=this.bindCompany.companyId;
            this.$store.commit('setUserData',this.bindCompany);
          }
          this.$nextTick(()=>{
            this.$store.dispatch('loadAccountData');
            this.$store.dispatch('loadPermission');
          })
        }
      })
    },
    //获取验证码
    getCode() {
      if(!this.validPhone()){
        return;
      }
      let params={
        phone: this.phone,
        codeType:106,
        // imgCode:this.imgCode,
        // imgCodeToken:this.imgCodeToken,
      }
      // if(this.tabIndex==1){
      //   params['codeType']=107;//企业
      // }else{
      //   params['codeType']=106;
      // }
      SendValidCode(params).then(r => {
        if (r.Result == 1) {
          this.$toast.success(r.Message);
          let time = 120;
          this.btnDisabled = true;
          this.timer = setInterval(() => {
            time--;
            this.codeBtnText = time + "s";
            if (time <= 0) {
              time = 120;
              this.btnDisabled = false;
              this.codeBtnText = "获取验证码";
              clearInterval(this.timer);
            }
          }, 1000);
        } else {
          this.$toast(r.Message);
        }
      });
      
    },
    //验证手机号
    validPhone(){
      if (this.phone === "") {
        this.$toast("请输入手机号！");
        return false;
      }
      if (
        this.phone !== "" &&
        !validate.phone(this.phone)
      ) {
        this.$toast("手机号格式不正确");
        return false;
      }
      return true;
    },
    //绑定
    submit(){
      if(!this.validPhone()){
        return;
      }
      if (this.code === "") {
        this.$toast("请输入手机验证码！");
        return;
      }
      BindThirdAccount2({
        HandSet:this.phone,
        AccountType:this.tabIndex==1?2:1,//1:个人，2：企业
        ValidCode:this.code,
        AppId:101001,
        WxOfficialAccOpenId:this.openId,
        ThirdAccountType:6,//公众号
        ValidateCodeType:106,//绑定第三方账号
      }).then(r=>{
        if(r.Result==1){
          this.getWxAccountInfo(1);
          this.$router.push('/bindSuccess');
        }else if(r.Result==603){
          window.location.href='http://m.gongkongbpo.com/download/download';
        }else{
          this.$toast(r.Message);
        }
      })
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.bindWechat{
  min-height: 100vh;
  background-color: #fff;
  padding-top: 100px;
  @include bg('~static/image/bind-bg.png');
  background-size: contain;
  background-position: center bottom;
  .desc{
    font-size: 15px;
    color: #333;
    line-height: 24px;
    text-align: center;
    margin-bottom: 30px;
    font-weight: 500;
  }
  .tab-hd{
    @include flex;
    width: px2rem(400px);
    margin: 0 auto;
    >li{
      text-align: center;
      width: 75px;
      &.on .label{
        font-size: 18px;
        font-weight: bold;
      }
    }
    .icon{
      width: px2rem(128px);
      height: px2rem(128px);
      display: block;
      margin: 0 auto 12px;
    }
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      white-space: nowrap;
    }
  }
  .form{
    width: px2rem(600px);
    margin: 0 auto;
  }
  .form-item{
    width: 100%;
    height: 44px;
    margin-top: 24px;
    display: flex;
  }
  .input{
    min-width: 100px;
    flex: 1;
    height: 44px;
    padding: 10px;
    line-height: 24px;
    font-size: 14px;
    color: #333;
    border: 1px solid #d5d5d5;
    &:focus{
      border-color: $primary;
    }
  }
  .btn-primary{
    display: block;
    width: 100%;
    margin: 60px auto 0;
    text-align: center;
    line-height: 44px;
    height: 44px;
    background-color: #f75959;
    color: #fff;
    font-size: 16px;
  }
  .btn-code{
    width: 100px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    background-color: #e5e5e5;
    color: #666;
    font-size: 14px;
    &:disabled{
      background-color: #f8f8f8;
    }
  }
  .account{
    text-align: center;
    padding: 60px 20px 10px;
    .tip{
      font-size: 15px;
      color: #333;
      display: block;
      line-height: 24px;
      margin-bottom: 12px;
    }
    .account-name{
      font-size: 18px;
      color: #333;
      line-height: 24px;
      font-weight: bold;
    }
  }
}
</style>