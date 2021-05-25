<template>
  <div class="paySuccess">
    <van-nav-bar
      title="支付成功"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.replace('/')"
    />
    <div class="content">
      <van-icon name="checked" size="62" />
      <div class="tips">发单成功！</div>
      <div class="count-down-wrapper" v-if="time && jobType!=1" >
        <span class="label">倒计时</span>
        <van-count-down :time="time">
          <template v-slot="timeData">
            <span class="block">{{ timeData.hours>9?timeData.hours:'0'+timeData.hours }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.minutes>9?timeData.minutes:'0'+timeData.minutes }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.seconds>9?timeData.seconds:'0'+timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>
      <p class="desc" v-if="jobType!=1">恭喜您发单成功！速派承诺B2B成功发单后，<br>4小时响应时间，请您耐心等候。</p>
      <p class="remark" v-if="jobType!=1">备注：4小时响应：早上8点至晚8点结束（含周末，不含法定节假日） </p>
      <button class="btn-primary" @click="$router.replace({path:'/orderProcess',query:{jobId:jobId}})">查看工单</button>
    </div>
  </div>
</template>
<script>
export default {
  name:'PaySuccess',
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
.paySuccess{
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
  .count-down-wrapper{
    margin-top: 30px;
    .label{
      font-size: 16px;
    }
  }
  .desc{
    font-size: 14px;
    color: #666;
    line-height: 24px;
    margin: 30px auto 10px;
  }
  .remark{
    font-size: 12px;
    color: #999;
    line-height: 24px;
    text-align: left;
    margin: 0px auto;
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