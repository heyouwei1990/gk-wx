<template>
  <div class="loginPassword">
    <van-nav-bar
      title="修改登录密码"
      left-arrow
      fixed
      class="primary-header"
      :border="false"
      @click-left="$router.go(-1)"
    />
    <div class="tip-msg">为了您的账户安全，变更信息请先验证身份</div>
    <div class="form-item">
      <input type="text" class="input" v-model="phone" maxlength="11" :readonly="readOnly" placeholder="请输入绑定手机号">
    </div>
    <div class="form-item">
      <input type="text" class="input" v-model="code" maxlength="6" placeholder="请输入验证码">
      <button :disabled="btnDisabled" class="btn-code" @click="getCode">{{codeBtnText}}</button>
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
import { SendValidCode, Binduserinfo,CheckValidCode} from "@/common/api.js";
import validate from "@/common/validate.js";
import {TEL} from '@/common/util.js'
import {mapState} from 'vuex'
export default {
  name:'BindPassword',
  data(){
    return{
      phone:'',
      code:'',
      codeBtnText:'获取验证码',
      btnDisabled: false,
      timer: null,
      tel:TEL,
      readOnly:false,
      type:0,
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData
    })
  },
  created() {
    this.type=this.$route.query.type;
    if(this.userData && this.userData.Handset){
      this.readOnly=true;
      let phone=this.userData.Handset;
      if(phone.length==11){
        this.phone=phone.substr(0,3)+'****'+phone.substr(-4,4);
      }
    }
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
    checkOther(){
      this.$router.push('/bindAccount');
    },
    //获取验证码
    getCode() {
      let phone;
      if(this.readOnly){
        phone=this.userData.Handset;
      }else{
        phone=this.phone;
      }
      this.validPhone(phone);
      SendValidCode({
        phone: phone,
        codeType:1
      }).then(r => {
        if (r.Type == 1) {
          this.$toast.success(r.Message);
        } else {
          this.$toast(r.Message);
        }
      });
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
    },
    validPhone(phone){
      if (phone.trim() === "") {
        this.$toast("请输入手机号！");
        return false;
      }
      if (
        phone.trim() !== "" &&
        !validate.phone(phone)
      ) {
        this.$toast("手机号格式不正确");
        return false;
      }
      return true;
    },
    submit(){
      let phone;
      if(this.readOnly){
        phone=this.userData.Handset;
      }else{
        phone=this.phone;
      }
      this.validPhone(phone);
      if (this.code === "") {
        this.$toast("请输入手机验证码！");
        return;
      }
      CheckValidCode({
        CodeType:1,
        ValidateCode:this.code,
        Phone:phone
      }).then(r=>{
        if(r.Result==1){
          this.$router.push({path:'/resetPassword',query:{phone,type:this.type}})
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
.loginPassword{
  padding: 46px 15px 20px;
  background-color: #fff;
  min-height: calc(100vh - 46px);
  .tip-msg{
    font-size: 14px;
    color: #999;
    line-height: 24px;
    margin-top: 10px;
    margin-bottom: -10px;
  }
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
    width: 100%;
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
    &:read-only{
      background-color: #e5e5e5;
    }
  }
  .btn-primary{
    display: block;
    width: 100%;
    margin: 60px auto 0;
    text-align: center;
    line-height: 44px;
    height: 44px;
    background-color:$primary;
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