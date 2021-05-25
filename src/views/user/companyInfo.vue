<template>
  <div class="userInfo-page">
    <van-nav-bar
      title="基本信息"
      class="primary-header"
      left-arrow
      fixed
      right-text="编辑"
      :border="false"
      @click-left="$router.go(-1)"
      @click-right="edit"
    />
      <div class="info-item middle">
        <span class="label">LOGO</span>
        <img :src="form.Logo" alt="" class="avatar">
      </div>
      <div class="info-item">
        <span class="label">企业名称：</span>
        <div class="value">{{form.CompanyName}}</div>
      </div>
      <div class="info-item">
        <span class="label">企业类型：</span>
        <div class="value">{{form.CompanyType}}</div>
      </div>
      <div class="info-item">
        <span class="label">企业账号：</span>
        <div class="value">{{form.LoginName}}</div>
      </div>
      <div class="info-item">
        <span class="label">联系人：</span>
        <div class="value">{{form.LinkMan}}</div>
      </div>
      <div class="info-item">
        <span class="label">联系方式：</span>
        <div class="value">{{form.HandSet}}</div>
      </div>
      <div class="info-item">
        <span class="label">联系人职位：</span>
        <div class="value">{{form.LinkManPostName}}</div>
      </div>
      <div class="info-item">
        <span class="label">企业所在地：</span>
        <div class="value">{{form.Fulladdress}}{{form.DetailLocation}}</div>
      </div>
      <div class="info-item">
        <span class="label">所属大区：</span>
        <div class="value">{{form.AreaCategoryName}}</div>
      </div>
      <div class="info-item">
        <span class="label">所属行业：</span>
        <div class="value">{{form.IndustryName}}</div>
      </div>
      <div class="info-item">
        <span class="label">成立时间：</span>
        <div class="value">{{form.EstablishmentTime}}</div>
      </div>
      <div class="info-item">
        <span class="label">固定电话：</span>
        <div class="value">{{form.Tel}}</div>
      </div>
      <div class="info-item">
        <span class="label">企业规模：</span>
        <div class="value">{{form.Scale | formatScale}}</div>
      </div>
      <div class="info-item">
        <span class="label">注册资本：</span>
        <div class="value">{{form.BusLicenseRegisteredCapital}}</div>
      </div>
      <div class="info-item">
        <span class="label">企业注册地：</span>
        <div class="value">{{form.RegisterAddress}}</div>
      </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {GetCompanyInfo} from '@/common/api.js'
export default {
  name:'CompanyInfo',
  data(){
    return{
      form:{},
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  filters:{
    formatScale(value){
      let str='';
      switch (value) {
        case 1:
          str='大型企业（3亿以上）'
          break;
        case 2:
          str='中型企业（3000-30000万）'
          break;
        case 3:
          str='小型企业（3000万以下）'
          break;
      }
      return str;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      GetCompanyInfo({CompanyId:this.userData.CompanyId}).then(r=>{
        if(r.Result==1){
          this.form=r.Data;
        }else{
          this.$toast(r.Message);
        }
      })
    },
    edit(){
      this.$router.push({path:'/editCompany'})
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