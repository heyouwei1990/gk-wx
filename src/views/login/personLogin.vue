<template>
  <div class="login-page">
    <div class="form">
      <template v-if="isCode">
        <div class="form-item">
          <input class="input" type="tel" v-model.trim="phone" placeholder="请输入手机号" >
        </div>
        <div class="form-item">
          <input class="input" type="text" maxlength="6" v-model="code" placeholder="请输入验证码" >
          <button class="btn-code" :disabled="btnDisabled" @click="getCode">{{codeBtnText}}</button>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <input class="input" type="text" v-model.trim="userName" placeholder="请输入用户名/手机号" >
        </div>
        <div class="form-item">
          <input class="input" type="password" v-model.trim="password" placeholder="请输入登录密码" >
        </div>
      </template>
      <div class="clearfix">
        <label  v-if="!isCode" for="" class="btn-text-white fl frm-checkbox-label" @click="setSaveUserInfo" :class="[isCheckbox?'selected':'']">
          <i class="icon_checkbox"></i>
          <input type="hidden" :value="isCheckbox" id="frm-checkbox"/>记住用户名
        </label>
        <span class="btn-text fr" v-if="!isCode" @click="$router.push({path:'/loginPassword',query:{type:1}})">忘记密码</span>
      </div>
      <button class="btn-primary" @click="login">登录</button>
      <div class="clearfix">
        <span class="btn-text fl" @click="changeLoginType">{{isCode?'密码登录':'手机快捷登录'}}</span>
        <router-link tag="span" class="btn-text-white fr" to="/personRegister">立即注册>></router-link>
      </div>
    </div>
    <div class="third-party-wrapper" v-if="!isH5">
      <div class="title">
        <i class="line"></i>
        <span class="text">第三方登录</span>
        <i class="line"></i>
      </div> 
      <div class="third-party">
        <i class="icon-wx" @click="wxLogin"></i>
        <!-- <i class="icon-qq" @click="qqLogin"></i> -->
      </div>
    </div>
  </div>
</template>
<script>
import validate from '@/common/validate.js'
import {
  Logon,
  FastLogon,
  SendMobileCode,
  GetAccountData,
  GetAccountType,
  Impower,
  WxOffcialAccountLogin
} from '@/common/api.js'
export default {
  name:'PersonLogin',
  data(){
    return{
      userName:'',
      phone:'',
      password:'',
      code:'',
      isCode:false,
      codeBtnText:'获取验证码',
      btnDisabled:false,
      timer:null,
      flag:0,//判断权限和信息是否获取到
      openId:'',
      isCheckbox:false,  //是否记住密码
    }
  },
  watch: {
    flag(value){
      if(value==2){
        if(this.$route.query.type==2){
          this.$router.go(-1);
          return;
        }
        this.$router.push('/');
      }
    }
  },
  computed:{
    isH5(){
      let ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return false;
      }
      return true;
    }
  },
  created() {
    let account=this.$getStorage('personAccount');
    let phone=this.$getStorage('personPhone');
    //如果密码登录且有登录记录
    if(!this.isCode && account){
      account=JSON.parse(account);
      if(account.isCheckbox == 'true' || account.isCheckbox){
        this.isCheckbox = account.isCheckbox;
        this.userName = account.userName;
        this.password = account.pwd;
      }
    }
    //如果验证码登录且有登录记录
    if(this.isCode && phone){
      phone=JSON.parse(phone);
      this.phone=phone.phone;
    }
    this.openId=this.$route.query.wxOfficialAccountOpenId || '';
    this.authLogin();
  },
  methods: {
    // 返回
    back(){
      this.$router.go(-100);
      this.$router.replace('/');
    },
    //切换到企业登录
    checkOther(){
      if(this.$route.query.type==2){
        this.$toast('加入群组只能登录个人账号');
        return;
      }
      this.$router.replace('/login/companyLogin');
    },
    // 切换登录方式
    changeLoginType(){
      // this.userName='';
      // this.phone='';
      // this.password='';
      this.code='';
      this.isCode=!this.isCode;
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
      SendMobileCode({
        phone:this.phone,
        codeType:112,
        imgCode:'',
        imgCodeToken:'',
        mobileMsg:'',
      }).then(r=>{
        if(r.Result==1){
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
        }else if(r.Result==602 ){
          var that=this;
          this.$notify({
            message:r.Message,
            onClose(){
              that.$router.push('/personRegister');
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
    //密码登录
    passwordLogin(){
      if(this.userName===''){
        this.$notify('请输入用户名！');
        return;
      }
      if(this.password===''){
        this.$notify('请输入密码！');
        return;
      }
      if(!validate.password(this.password)){
        this.$notify('密码为6-20位数字字母组合');
        return;
      }
      // let that=this;
      // $.ajax({
      //   type:'POST',
      //   url:'http://tsso.api.gongkongbpo.com/sso/logon',
      //   dataType:'json',
      //   data:{
      //     ClientType:11,
      //     Account:that.userName,
      //     Password:that.password,
      //     AppId:100701,
      //   },
      //   success:function(r) {
      //     if(r.Type==1){
      //       that.$setStorage('personAccount',{
      //         userName:that.userName,
      //       })
      //       if(r.AccountID){
      //         that.getUserInfo(r.AccountID);
      //         that.getPermission(r.AccountID,r.AccessToken);
      //       }
      //     }else{
      //       that.$notify(r.Message);
      //     }
      //   },
      //   error:function(err) {
      //     console.log(err);
      //   }
      // })
      Logon({
        ClientType:11,
        Account:this.userName,
        Password:this.password,
        AppId:100701,
      }).then(r=>{
        if(r.Type==1){
          if(this.isCheckbox){
            this.$setStorage('personAccount',{
              isCheckbox: this.isCheckbox,
              userName:this.userName,
              pwd: this.password
            })
          }else{
            this.$removeStorage('personAccount')
          }
          if(r.AccountID){
            this.getUserInfo(r.AccountID);
            this.getPermission(r.AccountID,r.AccessToken);
          }
        }else{
          this.$notify(r.Message);
        }
      })
    },
    //验证码登录
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
      FastLogon({
        SecurityCode:this.code,
        Account:this.phone,
        SecurityCodeType:112,
        AppId:101001,
      }).then(r=>{
        if(r.Type==1){
          this.$toast.success(r.Message);
          this.$setStorage('personPhone',{
            phone:this.phone,
          })
          if(r.AccountID){
            this.getUserInfo(r.AccountID);
            this.getPermission(r.AccountID,r.AccessToken);
          }
        }else{
          this.$notify(r.Message);
        }
      })
    },
    //获取个人信息
    getUserInfo(id){
      GetAccountData({userId:id}).then(r=>{
        if(r.Result==1){
          this.flag++;
          var obj={...r.Data};
          this.$store.commit('setUserData',obj);
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //获取账户权限
    getPermission(id,token){
        GetAccountType({
          userId:id,
          gkAppLoginToken:token,
        }).then(r=>{
          if(r.Result==1){
            this.flag++;
            this.$store.commit('setPermission',r.Data);
            this.$store.dispatch('hxLogin', {
                username: r.Data.ImUserId,
                password: r.Data.ImUserPassWord,
            });
          }else{
            this.$toast(r.Message);
          }
        })
    },
    //微信登录
    wxLogin(){
      let returnUrl=window.location.href.split('#')[0];
      let path=this.$route.path.substr(1);
      returnUrl+=`?path=${path}`;
      //授权登录
      Impower(returnUrl,2);
    },
    //授权后登录
    authLogin(){
      if(!this.openId){
        return;
      }
      WxOffcialAccountLogin({
        AppId:101001,
        OpenId:this.openId
      }).then(r=>{
        if(r.Result==200){
          this.getUserInfo(r.Data.UserId);
          this.getPermission(r.Data.UserId,r.Data.Token);
        }else if(r.Result==501){
          this.$router.push({path:'/bindAccount',query:{userId:r.Data.UserId}});
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //qq登录
    qqLogin(){
      
    },
    //是否记住账号密码
    setSaveUserInfo(){
      this.isCheckbox = !this.isCheckbox
    },
  },
  beforeDestroy(){
    clearInterval(this.timer);
  }
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
  .third-party-wrapper{
    // position: absolute;
    // width: 100%;
    // max-width: 750px;
    // left: 50%;
    // transform: translateX(-50%);
    // bottom: 20px;
    // z-index: 2;
    margin-top: 40px;
    padding: 0 15px 20px;
    .title{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      display: flex;
      align-items: center;
      .text{
        padding: 0 20px;
      }
    }
    .line{
      width: 100px;
      flex: 1;
      height: 1px;
      background-color: #e5e5e5;
      transform: scaleY(0.5);
    }
  }
  .third-party{
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 10px;
    width: 100%;
    i[class^=icon-]{
      display: block;
      width: 32px;
      height: 32px;
    }
    .icon-wx{
      background: url('../../assets/login/wx.png') no-repeat center / cover;
    }
    .icon-qq{
      background: url('../../assets/login/qq.png') no-repeat center / cover;
    }
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