<template>
  <div class="register-success-page">
    <van-nav-bar
      title="企业登录"
      left-text="×"
      fixed
      z-index="10"
      :border="false"
      @click-left="closePage"
    />
    <div class="icon-success">
      <i class="van-icon van-icon-success"></i>
    </div>
    <p class="desc">您的注册申请已提交，请耐心等候速派后台审核。 <br>如有问题，请联系速派客户400-1100-243</p>
  </div>
</template>
<script>
export default {
  name:'RegisterSuccess',
  data(){
    return{

    }
  },
  methods: {
    closePage(){
      this.$router.replace('/');
    }
  },
}
</script>
<style lang="scss" scoped>
body{
  background-color: #fff;
}
.register-success-page{
  .van-nav-bar{
    background-color: #f75959;
  }
  .van-nav-bar__title{
    color: #fff;
  }
  .van-nav-bar__text{
    color: #fff;
    font-size: 28px;
  }
  .van-nav-bar__text:active{
    background-color: transparent;
  }
  .icon-success{
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #32B16C;
    margin: 90px auto 50px;
    text-align: center;
    font-size: 50px;
    line-height: 60px;
    color: #fff;
  }
  .van-icon-success{
    height: 60px;
    line-height: 60px;
  }
  .desc{
    text-align: center;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
}
</style>