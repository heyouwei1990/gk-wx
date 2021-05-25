<template>
  <div class="leaveReport">
    <van-nav-bar
      title="工程师日志"
      class="primary-header"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <template v-if="leaveData">
      <div class="flex-item">
        <span class="label">服务后现场照片：</span>
        <ul class="doc-list">
          <li v-for="(item,index) in leaveData.SceneImgList" :key="index">
            <img class="pic" :src="item.IconUrl" v-if="item.FileType==1" alt="">
            <img class="pic" :src="item.FileUrl" v-else @click="preview(item.FileUrl)" alt="">
          </li>
        </ul>
      </div>
      <div class="flex-item" >
        <span class="label">服务日志:</span>
        <div class="btn-switch">
          <!-- <span :class="{on:!isDuration}">时段</span>（时长） -->
        </div>
        <div class="time-table"  v-for="(item,index) in leaveData.WorkLogList" :key="'report'+index">
          <div class="tr">
            <span class="text">工程师</span>
            <time class="time">{{item.UserName}}</time>
          </div>
          <div class="tr">
            <span class="text">日期</span>
            <time class="time">{{item.WorkLogDate}}</time>
          </div>
          <div class="tr">
            <span class="text">时间属性</span>
            <time class="time">{{item.DateType}}</time>
          </div>
          <div class="tr">
            <span class="text">出发时间</span>
            <time class="time">{{item.GoTime}}</time>
          </div>
          <div class="tr">
            <span class="text">工作时间</span>
            <time class="time">{{item.WorkTime}}</time>
          </div>
          <div class="tr">
            <span class="text">返程时间</span>
            <time class="time">{{item.BackTime }}</time>
          </div>
        </div>
      </div>
      <div class="flex-item">
        <span class="label">现场客户签字：</span>
        <ul class="doc-list">
          <li v-for="(item,index) in leaveData.SignatureImgList" :key="index">
            <img class="pic" :src="item.FileUrl" @click="preview(item.FileUrl)" alt="">
          </li>
        </ul>
      </div>
      <div class="flex-item">
        <span class="label">联系方式：</span>
        <span class="value">{{leaveData.Handset}}</span>
      </div>
    </template>
  </div>
</template>
<script>
import {GetLeaveConfirmInfo} from '@/common/api.js'
import { ImagePreview } from 'vant';
export default {
  name:'leaveReport',
  data(){
    return{
      isDuration:false,//默认时段
      leaveData:null
    }
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      GetLeaveConfirmInfo({
        jobId:Number(this.$route.query.jobId),
        progressId:Number(this.$route.query.process),
        platform:'pcweb'
      }).then(r=>{
        if(r.Result==1){
          this.leaveData=r.Data;
          this.showLeave=true;
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //预览图片
    preview(url){
      ImagePreview([url]);
    },
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.leaveReport{
  padding-top: 46px;
  min-height:100vh;
  overflow: hidden;
  .flex-item{
    @include flex;
    flex-wrap: wrap;
    padding: 12px 15px;
    margin-bottom: 10px;
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      font-weight: 600;
      flex: 1;
    }
    .name{
      font-size: 16px;
      color: #333;
      line-height: 24px;
      font-weight: 600;
    }
    .btn-switch{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      .on{
        color: $primary;
      }
    }
  }
  .time-table{
    width: 100%;
    margin-top: 10px;
    background-color: #fff;
    box-shadow:0px 3px 8px 0px rgba(0, 0, 0, 0.12);
    @include radius;
    margin-bottom: 10px;
    padding: 4px 10px;
    .tr{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      margin-bottom: 6px;
      @include flex;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
  .doc-list{
    width: 100%;
    overflow: hidden;
    margin-top: 10px;
    >li{
      width: px2rem(160px);
      height: px2rem(160px);
      float: left;
      margin-right: 10px;
      margin-bottom: 10px;
      &:nth-child(4n){
        margin-right: 0;
      }
    }
    .pic{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>