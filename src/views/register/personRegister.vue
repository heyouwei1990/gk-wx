<template>
  <div class="personRegister">
    <van-nav-bar
      title="个人注册"
      right-text="企业注册"
      left-arrow
      fixed
      :border="false"
      @click-left="back"
      @click-right="checkOther"
    />
    <div class="form-item">
      <label for="">手机号</label>
      <input type="text" v-model.trim="form.Account" maxlength="11" class="input" placeholder="请输入手机号">
    </div>
    <!-- <div class="form-item">
      <input type="text" v-model.trim="imgCode" maxlength="6" class="input" placeholder="验证码">
      <div class="img-btn" @click="getImgCode">
        <img :src="imgCodeUrl" alt="" class="img-code">
      </div>
    </div> -->
    <div class="form-item">
      <label for="">验证码</label>
      <button class="btn-code" :disabled="btnDisabled" @click="getCode">{{codeBtnText}}</button>
    </div>
    <div class="form-item">
      <input type="text" v-model.trim="form.ValidateCode" maxlength="6" class="input" placeholder="请输入验证码">
    </div>
    <div class="form-item">
      <label for="">密码</label>
      <input type="password" v-model="form.Password" @blur="checkPassword" maxlength="20" class="input" placeholder="请输入密码">
    </div>
    <div class="form-item">
      <label for="">再次输入密码</label>
      <input type="password" v-model="password" @blur="checkPassword" maxlength="20" class="input" placeholder="请再次输入密码">
    </div>
    <van-checkbox shape="square" checked-color="#FF3838" v-model="form.IsAgree">
      <span class="agree">我已阅读并同意</span>
      <span class="protocol" @click.stop="showProtocol=true">《工业速派使用协议》、《工业速派 私隐权条款》</span>
      <span class="agree">，用户名一经注册，不可更改。</span>
    </van-checkbox>
    <button class="btn-primary" @click="submit">立即注册</button>
    <div id="captcha"></div>
  </div>
</template>
<script>
import { SendMobileCode, Signup, GetAccountData, GetAccountType } from "@/common/api.js";
import validate from "@/common/validate.js";
export default {
  name:'PersonRegister',
  data(){
    return{
      form:{
        Account:'',
        Password:'',
        ValidateCode:'',
        IsAgree:false,
      },
      password:'',
      showProtocol:false,
      codeBtnText:'获取验证码',
      btnDisabled: false,
      timer: null,
      imgCodeUrl:'',
      imgCode:'',
      imgCodeToken:'',
      flag: 0,
    }
  },
  created() {
    // this.getImgCode();
  },
  mounted(){
    
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    back(){
      this.$router.go(-1);
    },
    checkOther(){
      this.$router.push('/companyRegister');
    },
    //获取图片验证码
    // getImgCode(){
    //   GetImageCode().then(r=>{
    //     if(r.Result==1){
    //       this.imgCodeUrl=r.Data.ImgCodeUrl;
    //       this.imgCodeToken=r.Data.ImgCodeToken;
    //     }
    //   })
    // },
    //获取验证码
    getCode() {
      var self = this;
      if (this.form.Account === "") {
        this.$toast("请输入手机号！");
        return;
      }
      if (
        this.form.Account !== "" &&
        !validate.phone(this.form.Account)
      ) {
        this.$toast("手机号格式不正确");
        return;
      }
      let widths=document.querySelector('.form-item').getBoundingClientRect().width;
      var myCaptcha = window._dx.Captcha(document.getElementById('captcha'), {
          appId: 'e8941fd8bdcac157c64dedb50d13d1f7', //appId，在控制台中“应用管理”或“应用配置”模块获取
          width: widths,
          style: 'popup',
          success: function (token) {
            console.log('token:', token)
            SendMobileCode({
              phone: self.form.Account,
              codeType:104,
              imgCodeToken:token,
            }).then(r => {
              myCaptcha.hide()
              if (r.Result == 1) {
                let time = 60;
                self.btnDisabled = true;
                self.timer = setInterval(() => {
                  time--;
                  self.codeBtnText = time + "s";
                  if (time <= 0) {
                    time = 60;
                    self.btnDisabled = false;
                    self.codeBtnText = "获取验证码";
                    clearInterval(self.timer);
                  }
                }, 1000);
                self.$toast.success(r.Message);
              } else {
                // self.$toast({
                //   message:r.Message,
                //   onOpened(){
                //     self.getImgCode();
                //   }
                // });
                self.$toast.success(r.Message);
              }
            });
          },
          fail:function(err){
            console.log(err)
          }
      })
      myCaptcha.show()
    },
    //验证密码是否相等
    checkPassword() {
      if (this.form.Password == "") {
        return;
      }
      if (this.password == "") {
        return;
      }
      if(!validate.password(this.form.Password)){
        this.$toast('密码为6-14位数字字母组合');
        return;
      }
      if (this.password != this.form.Password) {
        this.$toast("密码不一致，请重新输入！");
        this.password = "";
        return;
      }
    },
    //提交
    submit(){
      if (this.form.Account === "") {
        this.$toast("请输入手机号！");
        return;
      }
      if (
        this.form.Account !== "" &&
        !validate.phone(this.form.Account)
      ) {
        this.$toast("手机号格式不正确");
        return;
      }
      if(!validate.password(this.form.Password)){
        this.$toast('密码为6-20位数字字母组合');
        return;
      }
      if (this.password != this.form.Password) {
        this.$toast("密码不一致，请重新输入！");
        return;
      }
      if (this.form.ValidateCode === "") {
        this.$toast("请输入手机验证码！");
        return;
      }
      if (!this.form.IsAgree) {
        this.$toast("请阅读协议并同意！");
        return;
      }
      Signup({
        Account:this.form.Account,
        Password:this.form.Password,
        ValidateCode:this.form.ValidateCode,
        AppId:101001,
      }).then(r=>{
        if(r.Type==1){
          this.$toast.success(r.Message);
          if(r.AccountID){
            this.getUserInfo(r.AccountID);
            this.getPermission(r.AccountID,r.AccessToken);
          }
        }else{
          this.$toast(r.Message);
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
        if(this.flag==2){
          this.$router.push('/');
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
          }else{
            this.$toast(r.Message);
          }
          if(this.flag==2){
            this.$router.push('/');
          }
        })
    },
  },
}
</script>
<style lang="scss" >
.personRegister{
  padding: 50px 0 20px;
  background-color: #fff;
  
  .form{
    width: 100%;
    margin: 0 auto;
  }
  .form-item{
    padding: 0 15px;
    width: 100%;
    position: relative;
    min-height: 44px;
    // margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #d5d5d5;
    label {
      font-size:14px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:30px;
    }
  }
  .input{
    height: 44px;
    line-height: 24px;
    font-size: 14px;
    color: #333;
    // border: 1px solid #d5d5d5;
    flex:1;
    min-width: 100px;
    text-align: right;
  }
  .btn-code{
    width: 80px;
    height: 28px;
    text-align: center;
    line-height: 26px;
    background: none;
    color: #666;
    font-size: 12px;
    border: 1px solid #f75959;
    border-radius:28px;
    color: #f75959;
  }
  .van-checkbox {
    padding: 0 15px;
  }
  .img-btn{
    width: 120px;
    height: 44px;
    border: 1px solid #d5d5d5;
    border-left: 0;
  }
  .img-code{
    display: block;
    width: 100%;
    height: 100%;
  }
  .van-checkbox{
    align-items:flex-start;
    margin-top: 24px;
    width: 100%;
  }
  .agree{
    color: #666;
    font-size: 14px;
  }
  .protocol{
    font-size: 14px;
    color: #ff3838;
  }
  .btn-primary{
    display: block;
    width: 50%;
    margin: 60px auto 0;
    text-align: center;
    line-height: 44px;
    height: 44px;
    background-color: #f75959;
    color: #fff;
    font-size: 14px;
  }
}

</style>