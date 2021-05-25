<template>
  <div class="settingPage">
    <van-nav-bar
      title="设置"
      class="primary-header"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <van-cell title="账户安全" is-link  @click="$router.push('/passwordManage')" />
    <van-cell title="关于" is-link  @click="$router.push('/about')" :value="version"/>
    <button class="btn-exit" @click="exit">退出登录</button>
  </div>
</template>
<script>
import {VERSION} from '@/common/util.js'
export default {
  name:'Setting',
  data(){
    return{
      version:VERSION
    }
  },
  methods: {
    exit(){
      this.$dialog.confirm({
        message:'您确定要退出本次登录？'
      }).then(r=>{
        this.$store.commit('setUserData',null);
        this.$store.commit('setPermission',null);
        this.$store.dispatch('hxLogout');
        this.$router.replace('/login/companyLogin');
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.settingPage{
  padding-top: 56px;
  min-height: calc(100vh - 46px);
  .btn-exit{
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    font-size: 16px;
    font-weight: 500;
    color: #f75959;
    margin-top: 20px;
  }
}
</style>