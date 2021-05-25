<template>
  <div class="passwordManage">
    <van-nav-bar
      title="账户安全"
      class="primary-header"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <div class="cell" @click="$router.push('/loginPassword')">
      <div class="flex">
        <span class="label">登录密码</span>
        <van-icon name="arrow" />
      </div>
      <div class="desc">存在被盗风险，建议定期更新密码以保护账号安全。</div>
    </div>
    <div class="cell" @click="$router.push('/bindPhone')">
      <div class="flex">
        <span class="label">手机绑定</span>
        <van-icon name="arrow" />
      </div>
      <div class="desc">已绑定手机{{info.Handset}}，若已丢失或停用，请立即更换。</div>
    </div>
    <div class="cell" @click="$router.push('/payPassword')" v-if="info.IsSetPayPwd">
      <div class="flex">
        <span class="label">支付密码</span>
        <van-icon name="arrow" />
      </div>
      <div class="desc">用于支付工单服务费和提现，请谨慎保管。</div>
    </div>
  </div>
</template>
<script>
import {GetAccountSecurityInfo} from '@/common/api.js'
import {mapState} from 'vuex'
export default {
  name:'PasswordManage',
  data(){
    return{
      info:{
        UserId: '',
        IsSetPayPwd: 0,
        Handset: "",
        IsBindQQ: 0,
        IsBindWeiXin: 0,
      }
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData
    })
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      let params={};
      if(this.userData && this.userData.UserId){
        params['userId']=this.userData.UserId;
      }
      if(this.userData && this.userData.CompanyId){
        params['companyId']=this.userData.CompanyId;
      }
      GetAccountSecurityInfo(params).then(r=>{
        if(r.Result==1){
          this.info=r.Data;
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
.passwordManage{
  padding-top: 46px;
  min-height: calc(100vh - 46px);
  background-color: #fff;
  .cell{
    @include bb;
    padding: 10px 15px;
    background-color: #fff;
    &:active{
      background-color: #f8f8f8;
    }
    .flex{
      @include flex;
      margin-bottom: 6px;
    }
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
    }
    .van-icon-arrow{
      font-size: 16px;
      color: #999;
    }
    .desc{
      font-size: 12px;
      color: #999;
      line-height: 1.5;
    }
  }
}
</style>