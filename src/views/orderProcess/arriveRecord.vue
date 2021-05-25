<template>
  <div class="arriveRecord">
    <van-nav-bar
      title="到场确认"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <template v-if="arriveData">
      <div class="flex-item">
        <span class="label">确认服务信息</span>
        <div v-for="(product,index) in arriveData.JobProductLineList " :key="'product'+index" class="product-item">
          <div class="flex">
            <div class="title">产品信息（{{index+1}}）</div>
            <div class="amount" v-if="product.DeviceCount">数量：{{product.DeviceCount}}</div>
          </div>
          <div class="product-name">
            {{product.ProductCateAreaName}}/{{product.ServiceStageName}}/{{product.ProductCategoryName}}/{{product.BrandName}}
            <span v-if="product.SerialName">/{{product.SeriesName}}</span>
          </div>
        </div>
      </div>
      <div class="flex-item">
        <span class="label">现场自拍：</span>
        <ul class="doc-list">
          <li v-for="(item,index) in arriveData.SceneEngineerImgList" :key="index">
            <img class="pic" :src="item.IconUrl" v-if="item.FileType==1" alt="">
            <img class="pic" :src="item.FileUrl" v-else @click="preview(item.FileUrl)" alt="">
          </li>
        </ul>
      </div>
      <div class="flex-item">
        <span class="label">现场照片：</span>
        <ul class="doc-list">
          <li v-for="(item,index) in arriveData.SceneImgList" :key="index">
            <img class="pic" :src="item.IconUrl" v-if="item.FileType==1" alt="">
            <img class="pic" :src="item.FileUrl" v-else @click="preview(item.FileUrl)" alt="">
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
<script>
import {GetConfirmJobTaskInfo} from '@/common/api.js'
import { ImagePreview } from 'vant';
export default {
  name:'EngineerReport',
  data(){
    return{
      arriveData:null
    }
  },
  created() {
    this.init();
  },
  methods: {
    init(){
      GetConfirmJobTaskInfo({
        jobId:Number(this.$route.query.jobId),
        progressId:Number(this.$route.query.process),
        platform:'pcweb'
      }).then(r=>{
        if(r.Result==1){
          this.arriveData=r.Data;
          this.showArrive=true;
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
.arriveRecord{
  overflow: hidden;
  padding-top: 46px;
  min-height:100vh;
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
  .product-item{
    background-color: #fff;
    border:1px solid rgba(249,249,249,1);
    box-shadow:0px 2px 10px 0px rgba(0, 0, 0, 0.1);
    @include radius;
    padding: 10px 8px;
    margin-bottom: 15px;
    width: 100%;
    .flex{
      @include flex;
      margin-bottom: 10px;
    }
    .title{
      font-size: 14px;
      color: #333;
      line-height: 1.5;
      font-weight: bold;
    }
    .amount{
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
    .product-name{
      font-size: 14px;
      color: #333;
      line-height: 1.5;
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