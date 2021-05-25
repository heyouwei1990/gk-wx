<template>
  <div class="resetPassword">
    <van-nav-bar
      title="修改登录密码"
      left-arrow
      fixed
      class="primary-header"
      :border="false"
      @click-left="$router.go(-1)"
    />
    <div class="form-item">
      <input type="password" class="input" v-model.trim="password" maxlength="20" placeholder="请输入新登录密码，6-20位数字字母组合">
    </div>
    <div class="form-item">
      <input type="password" class="input" v-model.trim="password2" maxlength="20" placeholder="请再输一次">
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
import { ResetPwd } from "@/common/api.js";
import {mapState} from 'vuex'
import validate from "@/common/validate.js";
import {TEL} from '@/common/util.js'
export default {
  name:'ResetPassword',
  data(){
    return{
      phone:'',
      tel:TEL,
      password:'',
      password2:'',
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
    this.phone=this.$route.query.phone;
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
    //确认
    submit(){
      if (this.password === "") {
        this.$toast("请输入密码");
        return;
      }
      if (this.password !== "" && !validate.password(this.password)) {
        this.$toast("密码应为6-20位数字字母组合");
        return;
      }
      if (this.password2 === "") {
        this.$toast("请再输入一次");
        return;
      }
      if (this.password2 !== this.password) {
        this.$toast("密码不一致，请确认密码");
        return;
      }
      let userCode='';
      if(this.userData){
        userCode=this.userData.UserCode;
      }else{
        if(this.type==1){
          userCode='p'+this.phone;
        }
        if(this.type==2){
          userCode='e'+this.phone;
        }
      }
      ResetPwd({
        ValidCodePhoneNumber:this.phone,
        UserCode:userCode,
        Password:this.password,
      }).then(r=>{
        if(r.Result==1){
          if(userCode.indexOf('e')!=-1){
            this.$router.replace('/login/companyLogin');
          }else{
            this.$router.replace('/login/personLogin');
          }
        }else{
          this.$toast(r.Message);
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.resetPassword{
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