<template>
  <div class="success-page">
    <van-nav-bar
      title="发单成功"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.replace('/')"
    />
    <van-icon class="icon-success" name="checked" />
    <div class="tip">发单成功</div>
    <div class="desc" v-if="jobType!=1">审核结果将以短信通知。<br> 如有疑问，请咨询客服电话<i>400-1100-243</i>。</div>
    <button class="btn-default" @click="toDetail">查看工单</button>
    <div class="warn">线下交易有风险，请谨慎选择！</div>
    <h3 class="promise-title">速派承诺</h3>
    <ul class="promise-list">
      <li>
        <img src="@/assets/createOrder/icon1.png" alt="" class="icon">
        <span class="text">免抽成0元差价</span>
      </li>
      <li>
        <img src="@/assets/createOrder/icon2.png" alt="" class="icon">
        <span class="text">服务流程全程监控</span>
      </li>
      <li>
        <img src="@/assets/createOrder/icon3.png" alt="" class="icon">
        <span class="text">现场配置专业保险</span>
      </li>
      <li>
        <img src="@/assets/createOrder/icon4.png" alt="" class="icon">
        <span class="text">专业客服协调纠纷</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name:'CreateSuccess',
  data(){
    return{
      isShowBtn:true,
      jobType:1,
    }
  },
  mounted() {
    this.jobType=Number(this.$route.query.jobType);
    if(this.$route.query.from=='agency'){
      this.isShowBtn=false;
    }
  },
  methods: {
    toDetail(){
      let id=this.$route.query.jobId;
      this.$router.push({path:'/orderProcess',query:{jobId:id}});
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.success-page{
  background-size: 33px 36px;
  min-height: 100vh;
  padding-top: 46px;
  background-color: #fff;
  .van-nav-bar__left .van-icon{
    color: #333;
    font-size: 20px;
  }
  .icon-success{
    display: block;
    margin: 50px auto 6px;
    width: px2rem(120px);
    font-size: px2rem(120px);
    color: $primary;
  }
  .tip{
    font-size: 16px;
    color: #666;
    font-weight: bold;
    line-height: 2;
    text-align: center;
  }
  .desc{
    font-size: 14px;
    color: #999;
    line-height: 20px;
    text-align: center;
    padding: 0 15px;
  }
  .warn{
    background-color: #f9f9f9;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: $primary;
    font-style: italic;
  }
  .promise-title{
    font-size: 14px;
    font-weight: bold;
    color: #333;
    line-height: 24px;
    margin-bottom: 5px;
    margin-top: 20px;
    text-align: center;
  }
  .promise-list{
    display: flex;
    flex-wrap: wrap;
    padding: 0 34px;
    li{
      min-width: 36%;
      flex: 1;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
    .icon{
      width: px2rem(56px);
      height: px2rem(56px);
      margin-right: 5px;
    }
    .text{
      font-size: 12px;
      color: #333;
      line-height: 24px;
      font-weight: 500;
    }
  }
  .btn-default{
    display: block;
    width: px2rem(220px);
    background-color: #fff;
    height: 34px;
    border: 1px solid #f75959;
    color: #f75959;
    line-height: 32px;
    text-align: center;
    border-radius: 32px;
    margin: 32px auto 32px;
    font-size: 14px;
  }
}
</style>