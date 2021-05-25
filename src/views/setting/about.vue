<template>
  <div class="aboutPage">
    <van-nav-bar
      title="关于"
      class="primary-header"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <div class="wrapper">
      <div class="logo"></div>
      <div class="version">版本号：{{version}}</div>
      <div class="content">
        工控速派（北京）科技服务有限公司，定位于工业服务“互联网+”，以“设备+服务+资源”的智能服务平台管理模式，建立“物联网IoT”“服务网IoS”“资源网IoP”三网合一架构，提供贯穿设备资产管理，设备运营管理，技术服务管理的全价值链的数字化智能服务。通过物联网的智能传感，数据采集，数据传输，云端存储与分析计算，对设备进行在线监控，远程管理，趋势预测，预警维护，并通过智能化的服务资源调配与管理实现线上线下O2O结合，最终实现覆盖工业领域全生命周期的智能制造服务生态。
      </div>
    </div>
  </div>
</template>
<script>
import {VERSION} from '@/common/util.js'
export default {
  name:'About',
  data(){
    return{
      version:VERSION,
    }
  },
  methods: {

  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.aboutPage{
  padding-top: 46px;
  min-height: calc(100vh - 46px);
  background-color: #fff;
  .wrapper{
    padding: 20px 15px;
    text-align: center;
  }
  .logo{
    width: 117px;
    height: 24px;
    @include bg('../../assets/logo.png');
    margin: 10px auto;
    background-size: contain;
  }
  .version{
    color: $primary;
    font-size: 10px;
    line-height: 20px;
    margin-bottom: 10px;
  }
  .content{
    font-size: 14px;
    color: #333;
    line-height: 24px;
    text-align: justify;
    text-align-last: left;
    text-indent: 2em;
  }
}
</style>