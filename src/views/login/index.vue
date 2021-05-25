<template>
  <div class="loginIndex">
    <van-nav-bar
      fixed
      left-arrow
      :border="false"
      @click-left="back"
    >
      <template #title>
        <img class="logo" src="@/assets/login/sp_logo.png" alt="">
      </template>
    </van-nav-bar>
    <img class="head-img" src="static/image/login-bg.png" alt="">
    <ul class="tab-hd">
      <li 
        :class="['tab-item',{on:$route.path==item.path}]" 
        v-for="(item,index) in tabHd" 
        :key="index" 
        @click="tabChange(item.path)"
      >{{item.text}}</li>
    </ul>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data(){
    return{
      tabHd:[{
        text:'个人登录',
        path:'/login/personLogin'
      },{
        text:'企业登录',
        path:'/login/companyLogin'
      }],
    }
  },
  methods: {
    // 返回
    back(){
      this.$router.go(-100);
      this.$router.replace('/');
    },
    tabChange(path){
      this.$router.push(path)
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.loginIndex{
  padding-top: 46px;
  min-height: 100vh;
  background-color: #fff;
  .logo{
    width: 113px;
    height: 23px;
    display: block;
  }
  .head-img{
    display: block;
    width: 100%;
  }
  .tab-hd{
    display: flex;
    justify-content: center;
    align-items: center;
    .tab-item{
      width: px2rem(220px);
      text-align: center;
      color: #333;
      line-height: 30px;
      font-size: 14px;
      &.on{
        font-weight: bold;
        font-size: 18px;
      }
    }
  }
}
</style>