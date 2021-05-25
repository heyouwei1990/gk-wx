<template>
  <div class="login-page">
    <div class="form">
      <template v-if="isCode">
        <div class="form-item">
          <input class="input" type="tel" v-model.trim="phone" placeholder="请输入注册时填写的手机号" >
        </div>
        <div class="form-item">
          <input class="input" type="text" maxlength="6" v-model="code" placeholder="请输入验证码" >
          <button class="btn-code" :disabled="btnDisabled" @click="getCode">{{codeBtnText}}</button>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <input class="input" type="text" v-model="userName" placeholder="企业登录账号" >
        </div>
        <div class="form-item">
          <input class="input" type="password" v-model="password" placeholder="请输入登录密码" >
        </div>
      </template>
      <div class="clearfix">
        <label  v-if="!isCode" for="" class="btn-text-white fl frm-checkbox-label" @click="setSaveUserInfo" :class="[isCheckbox?'selected':'']">
          <i class="icon_checkbox"></i>
          <input type="hidden" :value="isCheckbox" id="frm-checkbox"/>记住用户名
        </label>
        <span class="btn-text fr" v-if="!isCode" @click="$router.push({path:'/loginPassword',query:{type:2}})">忘记密码</span>
      </div>
      <button class="btn-primary" @click="login">登录</button>
      <div class="clearfix">
        <span class="btn-text fl" @click="changeLoginType">{{isCode?'密码登录':'手机快捷登录'}}</span>
        <router-link tag="span" class="btn-text-white fr" to="/companyRegister">立即注册>></router-link>
      </div>
    </div>
  </div>
</template>
<script>
import {CompanyLogin,GetAccountData,GetAccountType,SendValidCode,CompanyMobileLogin} from '@/common/api.js'
import validate from '@/common/validate.js'
export default {
  name:'CompanyLogin',
  data(){
    return{
      userName:'',
      password:'',
      flag:0,

      phone:'',
      code:'',
      codeBtnText:'获取验证码',
      btnDisabled:false,
      timer:null,
      isCode:false,
      isCheckbox:false,  //是否记住密码
    }
  },
  created() {
    let account=this.$getStorage('companyAccount');
    if(!this.isCode && account){
      account=JSON.parse(account);
      if(account.isCheckbox == 'true' || account.isCheckbox){
        this.isCheckbox = account.isCheckbox;
        this.userName = account.userName;
        this.password = account.pwd;
      }
    }
  },
  methods: {
    // 返回
    back(){
      this.$router.go(-100);
      this.$router.replace('/');
    },
    //获取验证码
    getCode(){
      if(this.phone.trim()===''){
        this.$notify('请输入手机号！');
        return;
      }
      if(this.phone.trim()!=='' && !validate.phone(this.phone)){
        this.$notify('手机号格式不正确');
        return;
      }
      SendValidCode({
        phone:this.phone,
        codeType:108,
      }).then(r=>{
        if(r.Result ==1){
          this.$toast.success(r.Message);
          let time=60;
          this.btnDisabled=true;
          this.timer=setInterval(() => {
            time--;
            this.codeBtnText=time+'s';
            if(time<=0){
              time=60;
              this.btnDisabled=false;
              this.codeBtnText='获取验证码';
              clearInterval(this.timer);
            }
          }, 1000);
        }else if(r.Result ==603){
          var that=this;
          this.$notify({
            message:r.Message,
            onClose(){
              that.$router.push('/companyRegister');
            }
          });
        }else{
          this.$notify(r.Message);
        }
      })
    },
    //登录
    login(){
      if(this.isCode){
        this.codeLogin();
      }else{
        this.passwordLogin();
      }
    },
    //账号密码登录
    passwordLogin(){
      if(this.userName==''){
        this.$notify('请输入账号名称');
        return;
      }
      if(this.password==''){
        this.$notify('请输入账号密码');
        return;
      }
      if(!validate.password(this.password)){
        this.$notify('密码为6-20位数字字母组合');
        return;
      }
      // let account={
      //   userName:this.userName,
      // }
      
      CompanyLogin({
        loginName:this.userName,
        password:this.password,
        AppId:101001,
      }).then(r=>{
        if(r.Result==1){
          if(this.isCheckbox){
            this.$setStorage('companyAccount',{
              isCheckbox: this.isCheckbox,
              userName:this.userName,
              pwd: this.password
            });
          }else{
            this.$removeStorage('companyAccount')
          }
          let data=r.Data;
          this.afterLogin(data);
          this.$toast.success(r.Message);
        }else{
          this.$notify(r.Message);
        }
      })
    },
    //手机号登录
    codeLogin(){
      if(this.phone.trim()===''){
        this.$notify('请输入手机号！');
        return;
      }
      if(this.phone.trim()!=='' && !validate.phone(this.phone)){
        this.$notify('手机号格式不正确');
        return;
      }
      if(this.code.trim()===''){
        this.$notify('请输入验证码！');
        return;
      }
      CompanyMobileLogin({
        AppId: 200101,
        Handset: this.phone,
        ValidateCode: this.code,
        ValidateCodeType: 108
      }).then(r => {
        if(r.Result == 1){
          this.$setStorage('companyPhone',{
            phone:this.phone,
          })
          let data=r.Data;
          //获取账户信息
          this.afterLogin(data);
          this.$toast.success(r.Message);
        }else{
          this.$notify(r.Message);
        }
      })
    },
    // 切换登录方式
    changeLoginType(){
      // this.userName='';
      // this.phone='';
      // this.password='';
      this.code='';
      this.isCode=!this.isCode;
      let phone=this.$getStorage('companyPhone');
      //如果验证码登录且有登录记录
      if(this.isCode && phone){
        phone=JSON.parse(phone);
        this.phone=phone.phone;
      }
    },
    //是否记住账号密码
    setSaveUserInfo(){
      this.isCheckbox = !this.isCheckbox
    },
    afterLogin(data){
      GetAccountData({
        accessToken:data.accessToken,
        companyId:data.companyId,
      }).then(r1=>{
        if(r1.Result==1){
          this.flag++;
          let obj={...r1.Data};
          this.$store.commit('setUserData',obj);
          if(this.flag==2){
            this.$router.push('/');
          }
        }else{
          this.$toast(r1.Message);
        }
      })
      //获取账户权限
      GetAccountType({
        companyId:data.companyId,
      }).then(r2=>{
        if(r2.Result==1){
          this.flag++;
          this.$store.commit('setPermission',r2.Data);
          this.$store.dispatch('hxLogin',{
            username:r2.Data.ImUserId,
            password:r2.Data.ImUserPassWord,
          })
          if(this.flag==2){
            this.$router.push('/');
          }
        }else{
          this.$toast(r2.Message);
        }
      })
    }
  },
}
</script>
<style lang="scss" >
.login-page{
  .form{
    width: 80%;
    margin: 0 auto;
  }
  .form-item{
    width: 100%;
    position: relative;
    height: 44px;
    margin-top: 30px;
  }
  .input{
    display: block;
    width: 100%;
    height: 44px;
    padding: 10px;
    line-height: 24px;
    font-size: 14px;
    color: #333;
    border: 1px solid #e5e5e5;
    &:focus{
      border-color: #F75959;
    }
  }
  .btn-code{
    width: 100px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    background-color: #d5d5d5;
    color: #333;
    font-size: 14px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }
  .btn-text{
    font-size: 14px;
    color: #F75959;
    line-height: 24px;
    margin-top: 10px;
  }
  .btn-text-white{
    font-size: 14px;
    color: #333;
    line-height: 24px;
    margin-top: 10px;
  }
  .btn-primary{
    display: block;
    height: 44px;
    width: 100%;
    font-size: 16px;
    background-color: #F75959;
    color: #fff;
    border: 0;
    border-radius: 0;
    margin-top: 20px;
  }
}
.frm-checkbox-label {
  .icon_checkbox {
    display: inline-block;
    vertical-align: middle;
    width: 16px;
    height: 16px;
    margin-right: 3px;
    margin-top: -2px;
    *margin-top: 0;
    background-image: url('../../assets/login/icon-min.png');
    background-position: -17px 0;
  }
}
.selected {
  .icon_checkbox {
    background-position: 0 0;
  }
}
</style>