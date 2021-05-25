<template>
  <div class="detail-page">
    <van-nav-bar
      title="工单详情"
      left-arrow
      class="primary-header"
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <section class="section">
      <div class="name-wrapper">
        <div class="name">{{item.JobTitle}}</div>
        <div :class="['mark',{'mark1':item.JobType==6,'mark2':item.JobType==8}]" >{{item.JobTypeStr}}</div>
      </div>
      <div class="city flex-item"><i class="van-icon van-icon-location"></i>{{item.Province}}·{{item.City}}</div>
      <div class="info-item">
        <span class="label">工单号：</span>
        <span class="value">{{item.JobNo}}</span>
      </div>
      <div class="info-item">
        <span class="label">现场联系人：</span>
        <span class="value">{{item.ContactP }}</span>
      </div>
      <div class="info-item">
        <span class="label">联系电话：</span>
        <span class="value">{{item.ContactPhone}}</span>
      </div>
      <div class="stamp stamp1" v-if="item.JobStatusStr=='已完成'"></div>
      <div class="stamp stamp2" v-if="item.JobStatusStr=='已签约'"></div>
      <div class="stamp stamp3" v-if="item.JobStatusStr=='投标中'"></div>
      <div class="stamp stamp4" v-if="item.JobStatusStr=='服务中'"></div>
    </section>
    <div class="spacing"></div>
    <section class="section">
      <div class="info-item">
        <span class="label">执行时间：</span>
        <span class="value">{{item.ExecuteStartDtStr}}至{{item.ExecuteEndDtStr}}</span>
      </div>
      <div class="info-item">
        <span class="label">发单时间：</span>
        <span class="value">{{item.PubDtStr}}</span>
      </div>
      <div class="info-item" v-if="item.TendPeriod > 0">
        <span class="label">投标有效期：</span>
        <span class="value" >{{item.TendPeriod}}天</span>
      </div>
      <div class="info-item">
        <span class="label">预算范围：</span>
        <span class="value price">¥{{item.MinAmount}}-{{item.MaxAmount}}</span>
      </div>
    </section>
    <div class="spacing"></div>
    <section class="section">
      <div class="info-item">
        <span class="label">服务类型：</span>
        <span class="value">{{item.ServiceTypeStr}}</span>
      </div>
      <div class="info-item">
        <span class="label">所属行业：</span>
        <span class="value">{{item.IndustryStr}}</span>
      </div>
      <div v-for="(product,index) in item.ProductTrees" :key="'product'+index" class="product-item">
        <div class="flex">
          <div class="title">产品信息（{{index+1}}）</div>
          <div class="amount" v-if="product.DeviceCount">数量：{{product.DeviceCount }}</div>
        </div>
        <div class="product-name">
          {{product.ProductDomainName}}—{{product.ProductName}}—{{product.BrandName}}
          <span v-if="product.SerialName">—{{product.SerialName}}</span>
        </div>
      </div>
      <div class="info-item">
        <span class="label">服务需求描述：</span>
        <span class="value">{{item.ServiceDescription}}</span>
      </div>
      <div class="info-item">
        <span class="label">现场资料：</span>
        <ul class="file-list">
          <li v-for="(doc,index) in item.SendReplenishFiles" :key="'doc'+index">
            <img class="pic" :src="doc.IconUrl" v-if="doc.FileType==1" alt="">
            <img class="pic" :src="doc.FileUrl" v-else @click="preview(doc.FileUrl)" alt="">
          </li>
        </ul>
      </div>
      <div class="info-item">
        <span class="label">特殊说明：</span>
        <ul class="special-list">
          <template v-for="(special,index) in item.SpecialRemarks">
            <li v-if="index<6 && special.SelectStatus!=0" :key="'special'+index">
              <div class="desc">{{special.Name}}</div>
              <div class="remark">{{special.Remark}}</div>
            </li>
            <li v-if="index>=6 && special.SelectStatus!=1" :key="'special'+index">
              <div class="desc">{{special.Name}}</div>
              <div class="remark">{{special.Remark}}</div>
            </li>
          </template>
        </ul>
      </div>
    </section>
    <!-- <div class="footer">
      <button class="btn-primary flex1" v-if="item.JobStatusStr=='投标中' && !item.isTake" @click="$router.push({path:'/'})">确认投标</button>
      <button class="btn-primary flex1" disabled v-if="item.JobStatusStr=='投标中' && item.isTake">已投标</button>
    </div> -->
  </div>
</template>
<script>
import {GetJobDetailIndex} from '@/common/api.js'
import {mapState} from 'vuex'
import { ImagePreview } from 'vant';
export default {
  name:'OrderDetail',
  data(){
    return{
      jobId:'',
      item:{},
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  created() {
    this.jobId=this.$route.query.jobId;
    this.loadOrderDetail();
  },
  methods: {
    loadOrderDetail(){
      GetJobDetailIndex({
        UserCode:this.userData.UserCode,
        JobId:this.jobId,
      }).then(r=>{
        if(r.Result==1){
          this.item=r.Data;
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
.detail-page{
  padding-top: 46px;
  // padding-bottom: 50px;
  background-color: #fff;
  min-height: 100vh;
  .section{
    background-color: #fff;
    padding: 10px 15px;
    position: relative;
    &:nth-of-type(3){
      .label{
        font-weight: bold;
      }
    }
  }
  .name-wrapper{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .name{
    font-size: 18px;
    color: #333;
    line-height: 1.5;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 100px;
  }
  .mark{
    display: inline-block;
    margin-left: 10px;
    height: 16px;
    line-height: 16px;
    font-size: 9px;
    padding: 0 3px;
    border-radius: 2px;
    color: #fff;
    white-space: nowrap;
    background-color: #FD8F28;
  }
  .mark1{
    background-color: #00B1E4;
  }
  .mark2{
    background-color: #598DF7;
  }
  .city{
    font-size: 14px;
    color: #666;
    line-height: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .van-icon-location{
    color: $primary;
    font-size: 18px;
    vertical-align: middle;
    margin-top: -3px;
    margin-right: 4px;
  }
  .price{
    font-size: 16px;
    color: $primary !important;
    font-weight: 500;
  }
  .flex-item{
    flex:1;
  }
  .info-item{
    font-size: 14px;
    line-height: 24px;
    display: flex;
    margin-bottom: 4px;
    flex-wrap: wrap;
  }
  .label{
    color: #333;
    white-space: nowrap;
  }
  .value{
    color: #333;
    word-break: break-all;
  }

  .stamp{
    position: absolute;
    right: 38px;
    top: 68px;
    z-index: 2;
    width: 57px;
    height: 52px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .stamp1{
    background-image: url('~static/image/status/stamp1.png');
  }
  .stamp2{
    background-image: url('~static/image/status/stamp2.png');
  }
  .stamp3{
    background-image: url('~static/image/status/stamp3.png');
  }
  .stamp4{
    background-image: url('~static/image/status/stamp4.png');
  }
  .product-item{
    background-color: #fff;
    border:1px solid rgba(249,249,249,1);
    box-shadow:0px 2px 10px 0px rgba(0, 0, 0, 0.1);
    @include radius;
    padding: 10px 8px;
    margin-bottom: 15px;
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
  .file-list{
    width: 100%;
    overflow: hidden;
    margin-top: 6px;
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
  .special-list{
    width: 100%;
    overflow: hidden;
    >li{
      @include bb;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .desc{
      font-size: 14px;
      color: #333;
      line-height: 1.5;
      margin-bottom: 6px;
    }
    .remark{
      font-size: 14px;
      color: #999;
      line-height: 1.5;
    }
  }
  .btn-primary{
    display: block;
    text-align: center;
    width: 100%;
    font-size: 16px;
    line-height: 50px;
    height: 50px;
    &:disabled{
      background-color: #e5e5e5;
    }
  }
  .flex1{
    flex: 1;
  }
}
</style>