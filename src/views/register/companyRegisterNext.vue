<template>
  <div class="companyRegister">
    <van-nav-bar title="企业注册" left-arrow fixed :border="false" @click-left="$router.go(-1)" />
    <div class="form-item form-items">
      <label for="">企业登录账号</label>
      <input type="text" class="input" v-model.trim="form.enterpriseAccount" placeholder="请输入企业登录账号" />
    </div>
    <div class="form-item form-items">
      <label for="">密码</label>
      <input
        type="password"
        v-model="form.password"
        @blur="checkPassword"
        class="input"
        maxlength="20"
        placeholder="请输入密码"
      />
    </div>
    <div class="form-item form-items">
      <label for="">再次输入密码</label>
      <input
        type="password"
        v-model="password"
        class="input"
        maxlength="20"
        @blur="checkPassword"
        placeholder="请再次输入登录密码"
      />
    </div>
    <div class="form-item form-items">
      <label for="">联系人</label>
      <input type="text" v-model.trim="form.LinkMan" class="input" placeholder="请输入联系人姓名" />
    </div>
    <div class="form-item form-items">
      <label for="">联系人手机号</label>
      <input type="text" v-model.trim="form.linkPhone" maxlength="11" class="input" placeholder="请输入联系人手机号" />
    </div>
    <div class="form-item form-items">
      <label for="">联系人职位</label>
      <div class="input is-link" @click="showStation=true">
        <span class="placeholder" v-if="form.LinkManPost==''">请选择联系人职位</span>
        {{stationName}}
      </div>
    </div>
    <!-- <div class="form-item">
      <input type="text" v-model.trim="imgCode" maxlength="6" class="input" placeholder="验证码">
      <div class="img-btn" @click="getImgCode">
        <img :src="imgCodeUrl" alt="" class="img-code">
      </div>
    </div> -->
    <div class="form-item form-items">
      <label for="">验证码</label>
      <button class="btn-code" :disabled="btnDisabled" @click="getCode">{{codeBtnText}}</button>
    </div>
    <div class="form-item form-items">
      <input type="text" v-model.trim="form.validateCode" maxlength="6" class="input" placeholder="请输入验证码" />
    </div>
    <van-checkbox shape="square" checked-color="#FF3838" v-model="form.IsAgree">
      <span class="agree">我已阅读并同意</span>
      <span class="protocol">《工业速派使用协议》、《工业速派 私隐权条款》</span>
      <span class="agree">，用户名一经注册，不可更改。</span>
    </van-checkbox>
    <button class="btn-primary" @click="submit">立即注册</button>
    <div id="captcha"></div>
    <!-- 服务类型 -->
    <van-popup position="bottom" v-model="showStation">
      <van-picker 
        :columns="station" 
        value-key="CodeName1" 
        :show-toolbar="true"
        @confirm="confirmStation"
        @cancel="showStation=false"
      >
      </van-picker>
    </van-popup>
  </div>
</template>
<script>
import { 
  SendMobileCode, 
  CompanyRegister,
  GetImageCode,
  CompanyLogin,
  GetAccountData,
  GetAccountType,
  CodeLines,
} from "@/common/api.js";
import validate from "@/common/validate.js";
export default {
  name:'CompanyRegisterNext',
  data() {
    return {
      form: {
        enterpriseAccount:'',     //企业账号
        password: "",
        linkPhone: "",
        LinkManPost:'',
        LinkMan: "",
        validateCode: ""
      },
      stationName:'',
      password: "",
      showProtocol: false,
      codeBtnText: "获取验证码",
      btnDisabled: false,
      timer: null,
      imgCodeToken:'',
      flag:0,
      showStation:false,
      station:[],
    };
  },
  created() {
    this.pageInit();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    pageInit(){
      CodeLines({
        CodeName:'LinkManPost',
        platform:'pcweb',
      }).then(r=>{
        if(r.Result==1){
          this.station=r.Data.Lines || [];
        }
      })
    },
    confirmStation(data){
      this.stationName=data.CodeName1;
      this.form.LinkManPost=data.CodeValue;
      this.showStation=false;
    },
    //获取验证码
    getCode() {
      var self = this;
      if (this.form.linkPhone === "") {
        this.$toast("请输入手机号！");
        return;
      }
      if (
        this.form.linkPhone !== "" &&
        !validate.phone(this.form.linkPhone)
      ) {
        this.$toast("手机号格式不正确");
        return;
      }
      var myCaptcha = window._dx.Captcha(document.getElementById('captcha'), {
          appId: 'e8941fd8bdcac157c64dedb50d13d1f7', //appId，在控制台中“应用管理”或“应用配置”模块获取
          style: 'popup',
          success: function (token) {
            console.log('token:', token)
            SendMobileCode({
              phone: self.form.linkPhone,
              codeType:105,
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
                self.$toast.success(r.Message);
              }
            });
          },
          fail:function(err){
            console.log(err)
          }
      })
      myCaptcha.show()


      // SendMobileCode({
      //   phone: this.form.linkPhone,
      //   codeType:105,
      //   imgCode:this.imgCode,
      //   imgCodeToken:this.imgCodeToken,
      // }).then(r => {
      //   if (r.Result == 1) {
      //     this.$toast.success(r.Message);
      //     let time = 60;
      //     this.btnDisabled = true;
      //     this.timer = setInterval(() => {
      //       time--;
      //       this.codeBtnText = time + "s";
      //       if (time <= 0) {
      //         time = 60;
      //         this.btnDisabled = false;
      //         this.codeBtnText = "获取验证码";
      //         clearInterval(this.timer);
      //       }
      //     }, 1000);
      //   } else {
      //     let that=this;
      //     this.$toast({
      //       message:r.Message,
      //       onOpened(){
      //         that.getImgCode();
      //       }
      //     });
      //   }
      // });
    },
    checkPassword() {
      if (this.form.password == "") {
        return;
      }
      if (this.password == "") {
        return;
      }
      if(!validate.password(this.form.password)){
        this.$notify('密码为6-14位数字字母组合');
        return;
      }
      if (this.password != this.form.password) {
        this.$toast("密码不一致，请重新输入！");
        this.password = "";
        return;
      }
    },
    submit() {
      let params = { ...this.$route.query };
      if (!params.enterpriseNameCh) {
        this.$toast("第一步保存失效，请重新输入！");
        this.$router.go(-1);
      }
      if(!this.form.enterpriseAccount){
        this.$notify('请输入企业账号！');
        return;
      }
      if(!validate.password(this.form.password)){
        this.$notify('密码为6-20位数字字母组合');
        return;
      }
      if (this.password != this.form.password) {
        this.$toast("密码不一致，请重新输入！");
        return;
      }
      if (this.form.linkPhone === "") {
        this.$toast("请输入手机号！");
        return;
      }
      if (
        this.form.linkPhone !== "" &&
        !validate.phone(this.form.linkPhone)
      ) {
        this.$toast("手机号格式不正确");
        return;
      }
      if (this.form.LinkMan === "") {
        this.$toast("请输入联系人姓名！");
        return;
      }
      if (this.form.validateCode === "") {
        this.$toast("请输入手机验证码！");
        return;
      }
      if (!this.form.IsAgree) {
        this.$toast("请阅读协议并同意！");
        return;
      }
      // let aseKey = "48c1f0c2cea944e19257c50fd770be87";
      // let obj = {
      //   AppId:101001,
      //   ...params,
      //   ...this.form
      // };
      let obj = {
        AppId: 101001,
        userName: this.form.enterpriseAccount,        //企业登录账号
        companyName: params.enterpriseNameCh,         //企业名称
        password: this.form.password,
        linkPhone: this.form.linkPhone,
        validateCode: this.form.validateCode,
        businessLicense: params.businessLicense,
        isAgree: 1,
        LinkMan: this.form.LinkMan,
        LinkManPost:this.form.LinkManPost,
        EnterpriseLicenseNumber: params.enterpriseIdCode,
        BusLicenseCompanyType: params.enterpriseType,
        TianWeiYunCompanyType: params.indexItem,
        RegisteredCapital: params.enterpriseCapital,
        EstablishmentDate: params.enterpriseTime,
        BusinessTerm: params.enterpriseValidDateStartAndEnd,
        RegisterAddress: params.enterpriseRegisterAddress,
        LegalPerson: params.enterpriseOwner,
      }
      obj.isAgree = this.form.IsAgree ? 1 : 0;
      CompanyRegister(obj).then(r => {
        if(r.Result==1){
          this.$toast.success(r.Message);
          CompanyLogin({
            loginName:this.form.enterpriseAccount,
            password:this.form.password,
            AppId:101001,
          }).then(r=>{
            if(r.Result==1){
              let data=r.Data;
              //获取账户信息
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
                  if(this.flag==2){
                    this.$router.push('/');
                  }
                }else{
                  this.$toast(r2.Message);
                }
              })
              this.$toast.success(r.Message);
            }else{
              this.$notify(r.Message);
            }
          })
        }else{
          this.$toast(r.Message);
        }
      });
    }
  }
};
</script>
<style lang="scss" >
.companyRegister {
  padding: 50px 0 20px;
  background-color: #fff;
  
  .form {
    width: 100%;
    margin: 0 auto;
  }
  .form-item {
    padding: 0 15px;
    width: 100%;
    position: relative;
    min-height: 44px;
    // margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    label {
      font-size:14px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:30px;
    }
  }
  .form-items {
    border-bottom: 1px solid #d5d5d5 !important;
    border-top: none !important;
  }
  .input {
    height: 44px;
    line-height: 24px;
    font-size: 14px;
    color: #333;
    // border: 1px solid #d5d5d5;
    flex:1;
    min-width: 100px;
    text-align: right;
  }
  .is-link{
    min-width: 100px;
    height: 44px;
    color: #333;
    line-height: 44px;
    font-size: 14px;
    position: relative;
    padding-right: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: -10px;
    &:after{
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-50%);
      content:"\F00A";
      font-family: 'vant-icon';
      font-size: 16px;
      color: #333;
    }
  }
  .btn-code {
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
  .van-checkbox {
    align-items: flex-start;
    margin-top: 24px;
    width: 100%;
  }
  .agree {
    color: #666;
    font-size: 14px;
  }
  .protocol {
    font-size: 14px;
    color: #ff3838;
  }
  .btn-primary {
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