<template>
  <div class="bindSuccess">
    <van-nav-bar
      title="绑定成功"
      left-arrow
      fixed
      :border="false"
      @click-left="window.close()"
    />
    <div class="content">
      <van-icon name="checked" size="62" />
      <div class="tips">绑定成功！</div>
      <button class="btn-primary" @click="$router.replace('/')">首页</button>
    </div>
  </div>
</template>
<script>
export default {
  name:'BindSuccess',
  data(){
    return{
      time: 0,
      jobId:0,
      jobType:0,
    }
  },
  created() {
    this.jobId=this.$route.query.jobId;
    this.jobType=Number(this.$route.query.jobType);
    let now=new Date().getTime();
    let long=this.$route.query.targetTime - now;
    if(long>0){
      this.time=long;
    }
  },
}
</script>
<style lang="scss" scoped>
.bindSuccess{
  padding-top: 46px;
  min-height: 100vh;
  background-color: #fff;
  .content{
    padding: 0 15px;
    overflow: hidden;
    text-align: center;
  }
  .van-icon-checked{
    color: #f75959;
    display: block;
    margin: 36px auto 12px;
  }
  .tips{
    font-size: 16px;
    color: #666;
    font-weight: bold;
    line-height: 1.5;
  }
  .btn-primary{
    font-size:14px;
    color: #fff;
    line-height: 34px;
    width: 116px;
    height: 34px;
    text-align: center;
    margin: 70px auto 20px;
  }
}
</style>