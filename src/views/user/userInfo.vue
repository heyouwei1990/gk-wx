<template>
  <div class="userInfo-page">
    <van-nav-bar
      title="基本信息"
      left-arrow
      fixed
      class="primary-header"
      right-text="编辑"
      @click-left="$router.go(-1)"
      @click-right="edit"
    />
    <div class="info-item middle">
      <span class="label">头像</span>
      <img :src="form.HeadImg" alt="" class="avatar">
    </div>
    <div class="info-item">
      <span class="label">用户名：</span>
      <div class="value">{{form.NickName}}</div>
    </div>
    <div class="info-item">
      <span class="label">注册手机号：</span>
      <div class="value">{{form.Handset}}</div>
    </div>
    <div class="info-item">
      <span class="label">用户类型：</span>
      <div class="value">{{form.RoleName}}</div>
    </div>
    <!-- <div class="info-item">
      <span class="label">真实姓名：</span>
      <div class="value">{{form.TrueName}}</div>
    </div>
    <div class="info-item">
      <span class="label">身份证号：</span>
      <div class="value">{{form.CardID}}</div>
    </div> -->
    <div class="info-item">
      <span class="label">所属公司：</span>
      <div class="value">{{form.CompanyName}}</div>
    </div>
    <div class="info-item">
      <span class="label">个人所在地：</span>
      <div class="value">{{form.FullAddress}}{{form.Address}}</div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name:'UserInfo',
  data(){
    return{
      
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    }),
    form(){
      return {
        ...this.userData
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      this.$store.dispatch('loadAccountData');
    },
    edit(){
      this.$router.push({path:'/editUser'});
    }
  },
}
</script>
<style lang="scss" scoped>
.userInfo-page{
  padding-top: 46px;
  padding-bottom: 50px;
  background-color: #fff;
  .info-item{
    display:flex;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    min-height: 44px;
    justify-content: space-between;
    background-color: #fff;
    &.middle{
      align-items: center;
    }
    .label{
      font-size: 14px;
      color: #333;
      line-height: 44px;
      padding-left: 15px;
    }
    .avatar{
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: block;
      margin: 8px 15px;
      background-color: #f8f8f8;
    }
    .value{
      font-size: 14px;
      color: #333;
      line-height: 20px;
      text-align: right;
      flex:1;
      padding: 12px 15px 12px 6px;
    }
  }
}
</style>