<template>
  <div class="order-component" :style="{height:isShow?'auto':'330px'}" v-if="productInfo.JobId">
    <section class="sec1">
      <h2 class="order-title">{{productInfo.JobTitle}}</h2>
      <div class="location">
        <van-icon name="location" />
        <span>{{productInfo.Address}}</span>
      </div>
      <div class=" base-info" v-for="(item,index) in productInfo.BaseInfo" :key="'base'+index">
        <span class="label">{{item.Name}}：</span>
        <span class="value" @click="call(item.PhoneNum)">{{item.Value}}<van-icon name="phone" v-if="item.IsShowPhone" /></span>
      </div>
    </section>
    <section class="sec2">
      <div class=" info-item" v-for="(item,index) in productInfo.DetailInfo1" :key="'detail1'+index">
        <span class="label">{{item.Name}}：</span>
        <span class="value">{{item.Value}}</span>
      </div>
      <div class="product-item" v-for="(item,index) in productInfo.JobProLineList" :key="'product'+index">
        <div class="flex">
          <div class="product-name">产品信息（{{index + 1}}）</div>
          <span class="amount" v-if="item.DeviceCount">数量：<i>{{item.DeviceCount}}</i></span>
        </div>
        <div class="product-desc">{{item.JobProductLineStr}}</div>
      </div>
      <div class=" info-item" v-for="(item,index) in productInfo.DetailInfo2" :key="'detail2'+index">
        <span class="label">{{item.Name}}：</span>
        <span class="value">{{item.Value}}</span>
      </div>
    </section>
    <section class="sec3" v-if="productInfo.JobFileList && productInfo.JobFileList.length">
      <div class=" info-item">
        <span class="label">现场资料：</span>
        <ul class="doc-list">
          <li v-for="item in productInfo.JobFileList" :key="item.Id">
            <img v-if="item.FileType ==2" class="pic" :src="item.FileUrl" @click="preview(item.FileUrl)" alt="">
            <img v-if="item.FileType ==1" class="pic" :src="item.IconUrl" alt="">
          </li>
        </ul>
      </div>
    </section>
    <section class="sec4" v-if="productInfo.DetailInfo3.length">
      <div class=" info-item" v-for="(item,index) in productInfo.DetailInfo3" :key="'detail3'+index">
        <span class="label">{{item.Name}}：</span>
        <span class="value">{{item.Value}}</span>
      </div>
    </section>
    <section class="sec5" v-if="productInfo.SpecialRemarkList.length">
      <div class=" info-item">
        <span class="label">特殊说明：</span>
        <ul class="special-list">
          <li v-for="item in productInfo.SpecialRemarkList" :key="item.ID">
            <div class="desc">{{item.Name}}</div>
            <div class="remark">{{item.Remark}}</div>
          </li>
        </ul>
      </div>
    </section>
    <div class="btn-wrap">
      <div class="btn-drop" @click="toggle">
        <span>{{isShow?'收起':'展开'}}</span>
        <van-icon :name="isShow?'arrow-up':'arrow-down'" />
      </div>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from 'vant';
import valid from '@/common/validate.js'
import {
  AxbBindPhone,
} from '@/common/api.js'
export default {
  data(){
    return{
      isShow:false,
    }
  },
  props:{
    productInfo:{
      type:Object,
      default(){
        return{}
      }
    }
  },
  watch: {
    productInfo(value){
      if(value.IsOpen){
        this.isShow=true;
      }
    },
  },
  methods: {
    //展开收起
    toggle(){
      this.isShow=!this.isShow;
    },
    //预览图片
    preview(url){
      ImagePreview([url]);
    },
    //提交电话
    call(contacts){
      if(contacts){
        this.$emit('call',contacts);
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.order-component{
  position: relative;
  overflow: hidden;
  padding-bottom: 40px;
  section{
    background-color: #fff;
    padding: 10px 15px 10px;
    margin-bottom: 10px;
  }
  section:nth-last-of-type(1){
    margin-bottom: 0;
  }
  .sec1{
    padding-top: px2rem(100px);
    .order-title{
      font-size: 18px;
      color: #333;
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: 15px;
    }
    .location{
      display: flex;
      line-height: 24px;
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    .van-icon-location{
      color: #f75959;
      font-size: 18px;
      line-height: 24px;
      margin-right: 6px;
    }
    .base-info{
      display: flex;
      font-size: 14px;
      line-height: 24px;
      margin-bottom: 10px;
    }
    .label{
      color: #999;
    }
    .value{
      color: #333;
      flex: 1;
      width: 100px;
      word-break: break-all;
    }
    .van-icon-phone{
      color: #f75959;
      display: inline-block;
      vertical-align: middle;
      margin-top: -3px;
      margin-left: 6px;
      font-size: 16px;
    }
  }
  .info-item{
    font-size: 14px;
    color: #333;
    line-height: 24px;
    margin-bottom: 10px;
    .label{
      font-weight: bold;
    }
    .value{
      flex: 1;
      width: 100px;
      word-break: break-all;
    }
  }
  .product-item{
    width: 100%;
    padding: 10px 10px;
    @include radius;
    background-color: #fff;
    box-shadow:-1px 4px 20px 0px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
    .flex{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .product-name{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      font-weight: bold;
    }
    .amount{
      font-size: 14px;
      color: #666;
      line-height: 24px;
      i{
        color: #333;
      }
    }
    .product-desc{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      margin-top: 10px;
      word-break: break-all;
    }
  }
  .doc-list{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    margin-bottom: -10px;
    >li{
      width:px2rem(188px);
      height: px2rem(188px);
      margin-bottom: 10px;
      margin-right: px2rem(62px);
      &:nth-child(3n){
        margin-right: 0;
      }
    }
    .pic{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .special-list{
    >li{
      @include bb;
      padding: 10px 0;
      &:last-child{
        &:after{
          display: none;
        }
      }
    }
    .desc{
      color: #333;
      font-size: 14px;
      line-height: 24px;
      word-break: break-all;
    }
    .remark{
      color: #999;
      margin-top: 10px;
      font-size: 14px;
      line-height: 24px;
      word-break: break-all;
    }
  }
  .btn-wrap{
    position: absolute;
    left: 50%;
    bottom: 0px;
    transform: translateX(-50%);
    background-color: #fff;
    text-align: center;
    width: 100%;
    padding-bottom: 16px;
    .btn-drop{
      @include flex(center,center);
      width: 80px;
      height: 24px;
      border: 1px solid #e5e5e5;
      border-radius: 24px;
      background-color: #fff;
      text-align: center;
      line-height: 22px;
      font-size: 12px;
      color: #999;
      margin: 0 auto;
    }
    .van-icon{
      margin-left: 4px;
    }
  }
}
</style>