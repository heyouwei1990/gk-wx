<template>
  <div class="bindPhone">
    <van-nav-bar
      title="修改绑定手机号"
      left-arrow
      fixed
      class="primary-header"
      :border="false"
      @click-left="$router.go(-1)"
    />
    <div class="form-item">
      <input type="tel" class="input" v-model.trim="phone" maxlength="11" placeholder="请输入手机号">
    </div>
    <div class="form-item">
      <input type="text" v-model.trim="imgCode" maxlength="6" class="input" placeholder="验证码">
      <div class="img-btn" @click="getImgCode">
        <img :src="imgCodeUrl" alt="" class="img-code">
      </div>
    </div>
    <div class="form-item">
      <input type="text" class="input" v-model.trim="code" maxlength="6" placeholder="验证码">
      <button class="btn-code" @click="getCode" :disabled="btnDisabled">{{codeBtnText}}</button>
    </div>
    <button class="btn-primary" @click="submit">确定</button>
    <div class="tip">
      如有任何问题请拨打客服电话：
      <div class="hot" @click="callService">
        <span>{{tel}}</span>
        <van-icon name="phone" />
      </div>
    </div>
  </div>
</template>
<script>
import { SendMobileCode, UpdateBindPhoneNumber,GetImageCode } from "@/common/api.js";
import validate from "@/common/validate.js";
import {mapState} from 'vuex'
import {TEL} from '@/common/util.js'
export default {
  name:'BindPhone',
  data(){
    return{
      phone:'',
      code:'',
      codeBtnText:'获取验证码',
      timer: null,
      btnDisabled:false,
      tel:TEL,
      imgCodeUrl:'',
      imgCode:'',
      imgCodeToken:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData
    })
  },
  created() {
    this.getImgCode();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    //联系客服
    callService(){
      this.$dialog.confirm({
        message:'立即联系 速派客服',
        confirmButtonText:'立即联系',
        cancelButtonText:'暂不联系'
      }).then(()=>{
        window.location.href='tel:'+TEL;
      })
    },
    //获取图片验证码
    getImgCode(){
      GetImageCode().then(r=>{
        if(r.Result==1){
          this.imgCodeUrl=r.Data.ImgCodeUrl;
          this.imgCodeToken=r.Data.ImgCodeToken;
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
        imgCode:this.imgCode,
        imgCodeToken:this.imgCodeToken,
      }
      if(this.userData && this.userData.LoginType==1){
        params['codeType']=106;
      }
      if(this.userData && this.userData.LoginType==2){
        params['codeType']=107;
      }
      SendMobileCode(params).then(r => {
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
          this.getImgCode();
          this.$toast(r.Message);
        }
      });
      
    },
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
    submit(){
      if(!this.validPhone()){
        return;
      }
      if (this.code === "") {
        this.$toast("请输入手机验证码！");
        return;
      }
      UpdateBindPhoneNumber({
        PhoneNumber:this.phone,
        UserCode:this.userData.UserCode,
        ValidateCode:this.code,
      }).then(r=>{
        if(r.Result==1){
          this.$router.replace('/login/companyLogin');
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
.bindPhone{
  padding: 46px 15px 20px;
  background-color: #fff;
  min-height: calc(100vh - 46px);
  .form{
    width: 100%;
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
    font-size: 14px;
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
  .tip{
    font-size: 14px;
    color: #999;
    line-height: 24px;
    margin-top: 10px;
    display: flex;
    .hot{
      display: flex;
      align-items: center;
      color: $primary;
      span{
        text-decoration: underline;
      }
      .van-icon{
        font-size: 20px;
      }
    }
  }
}

</style>