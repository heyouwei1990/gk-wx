<template>
  <div class="pay-dialog">
    <div class="title">支付密码</div>
    <van-icon name="cross" @click="close" />
    <pay-password class="pay-password" v-model="password"></pay-password>
    <p class="tips">温馨提示：为了您的资金安全，请勿线下交易！</p>
    <div class="btn-group">
      <div class="btn-primary" @click="submit">支付</div>
      <span class="btn-forget" @click="$router.push('/payPassword')">忘记密码</span>
    </div>
  </div>
</template>
<script>
import PayPassword from '@/components/payPassword.vue'
import {aesEncrypt} from '@/common/aesHelper.js'
export default {
  components:{
    PayPassword
  },
  data(){
    return{
      password:'',
    }
  },
  methods: {
    submit(){
      if(this.password.length!=6){
        this.$toast('请输入密码！');
        return;
      }
      this.$emit('confirm',this.password)
    },
    close(){
      this.$emit('close')
    }
  },
}
</script>
<style lang="scss" scoped>
.pay-dialog{
  width: 80vw;
  max-width: 300px;
  margin: 0 auto;
  .title{
    background-color: #f75959;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #fff;
    padding-left: 10px;
    padding-right: 50px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .van-icon-cross{
    font-size: 16px;
    color: #fff;
    position: absolute;
    right: 0;
    top: 5px;
    z-index: 3;
    width: 30px;
    line-height: 30px;
    text-align: center;
  }
  .pay-password{
    margin-top: 40px;
    margin-bottom: 20px;
  }
  .tips{
    font-size: 12px;
    color: #999;
    width: 260px;
    margin: 10px auto;
  }
  .btn-group{
    position: relative;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
  }
  .btn-primary{
    width: 100px;
    text-align: center;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    font-size: 14px;
  }
  .btn-forget{
    font-size: 14px;
    color: #f75959;
    line-height: 30px;
    position: absolute;
    left: 50%;
    top: 0;
    margin-left: 60px;
  }
}
</style>