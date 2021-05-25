<template>
  <div class="orderlist-page">
    <div class="van-nav-bar van-nav-bar--fixed" style="z-index: 10;">
      <div class="van-nav-bar__left" @click="$router.go(-1)">
        <i class="van-icon van-icon-arrow-left van-nav-bar__arrow"><!----></i>
      </div>
      <div class="van-nav-bar__title van-ellipsis">
        <ul class="nav-tab-hd">
          <li v-for="(item,index) in navTab" :class="{active:tabIndex==index}" :key="index" @click="tabSwitch(index)">{{item}}</li>
        </ul>
      </div>
      <div class="van-nav-bar__right" @click="toSearch">
        <i class="van-icon van-icon-search"></i>
      </div>
    </div>
    <van-pull-refresh
      v-model="loading"
      success-text="刷新成功"
      @refresh="refresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadList"
      >
        <div class="order-item" v-for="(item,index) in orderList" :key="index" @click="toDetail(item.JobId)">
          <div class="flex">
            <div class="name flex-item">{{item.JobTitle}}</div>
            <div :class="['mark',{'mark1':item.JobType==6,'mark2':item.JobType==8}]" >{{item.JobTypeStr}}</div>
          </div>
          <div class="flex">
            <div class="city flex-item"><i class="van-icon van-icon-location"></i>{{item.Province}}·{{item.City}}</div>
            <div class="price" v-if="tabIndex===0">¥{{item.MinAmount}}-{{item.MaxAmount}}</div>
            <div class="price" v-if="tabIndex===1 && item.Amount>0">¥{{item.Amount}}</div>
          </div>
          <div class="product-list">
            <div class="product-item" v-for="(product,idx) in item.ProductTrees" :key="'product'+idx">
              {{product.ProductDomainName}}—{{product.ProductName}}—{{product.BrandName}}
              <span v-if="product.SerialName">—{{product.SerialName}}</span>
            </div>
          </div>
          <div class="flex">
            <div class="info-item flex-item">
              <span class="label">执行时间：</span>
              <span class="value">{{item.ExecuteStartDtStr}}至{{item.ExecuteEndDtStr}}</span>
            </div>
            <div class="bidder" v-if="item.TenderNum"><i class="van-icon van-icon-friends"></i>{{item.TenderNum}}人已投标</div>
          </div>
          <!-- <div class="stamp stamp1" v-if="item.JobStatusStr=='已完成'"></div>
          <div class="stamp stamp2" v-if="item.JobStatusStr=='已签约'"></div>
          <div class="stamp stamp3" v-if="item.JobStatusStr=='投标中'"></div>
          <div class="stamp stamp4" v-if="item.JobStatusStr=='服务中'"></div> -->
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import {GetJobsInIndex} from '@/common/api.js'
import {mapState} from 'vuex'
export default {
  name:'OrderList',
  data(){
    return{
      navTab:['工单列表','成功案例'],
      tabIndex:0,
      finished:false,
      loading:true,
      orderList:[],
      pageNo:1,
      pageSize:10,
      jobTitle:null,
    }
  },
  watch: {
    $route(to,from){
      if(to.path=='/orderList' && from.path=='/searchOrder'){
        this.jobTitle=this.searchOrderWord;
        this.pageNo=1;
        this.loadList();
      }
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
      searchOrderWord:state=>state.searchOrderWord,
    })
  },
  created() {
    this.tabIndex=this.$route.meta.tabIndex;
  },
  mounted() {
    this.loadList();
  },
  methods: {
    //切换tab
    tabSwitch(index){
      this.tabIndex=index;
      this.pageNo=1;
      this.jobTitle=null;
      this.orderList=[];
      this.loadList();
      this.$route.meta.tabIndex=this.tabIndex;
      document.documentElement.scrollTop=0
    },
    //刷新
    refresh(){
      this.jobTitle=null;
      this.pageNo=1;
      this.loadList();
      document.documentElement.scrollTop=0
    },
    //加载
    loadList(){
      let params={
        UserCode:this.userData.UserCode,
        TenderState:this.tabIndex===0?1:0,
        PageSize:this.pageSize,
        PageNo:this.pageNo,
        JobTitle:this.jobTitle,
        JobProgressType: this.tabIndex===0?2:1
      }
      GetJobsInIndex(params).then(r=>{
        this.loading = false;
        let list=r.Data.Lines || [];
        if(r.Result==1){
          if(this.pageNo==1){
            this.orderList=list;
          }else{
            this.orderList=this.orderList.concat(list);
          }
          if(list.length<this.pageSize){
            this.finished=true;
          }else{
            this.pageNo++;
          }
        }
        // orderList
      })
    },
    //去详情
    toDetail(data){
      this.$router.push({path:'/orderDetail',query:{jobId:data}});
    },
    toSearch(){
      this.$router.push('/searchOrder');
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.orderlist-page{
  padding-top: 46px;
  .van-nav-bar{
    background-color: #fff;
  }
  .van-nav-bar__title{
    color: #333;
  }
  .van-nav-bar .van-icon{
    color: #333;
    font-size: 20px;
  }
  .van-nav-bar__text{
    color: #333;
  }
  .van-nav-bar__text:active{
    background-color: transparent;
  }
  .nav-tab-hd{
    width: 200px;
    height: 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >li{
      font-size: 15px;
      color: #666;
      line-height: 30px;
      position: relative;
      &:after{
        content: '';
        display: block;
        position: absolute;
        left: 50%;
        bottom: 0;
        height: 1px;
        width: 0;
        transform: translateX(-50%);
        background-color: #f75959;
        transition: all 0.2s;
      }
    }
    >.active{
      color: #333;
      font-size: 17px;
      &:after{
        width: 40px;
      }
    }
  }
  .van-list{
    min-height: calc(100vh - 46px);
  }
  .product-list{
    .product-item{
      font-size: 12px;
      line-height: 20px;
      color: #666;
      margin-bottom: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .order-item{
    padding: 15px 15px 10px;
    background-color: #fff;
    position: relative;
    &:after{
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      height: 1px;
      width: 100%;
      background-color: #e5e5e5;
      background-clip: content-box;
      padding: 0 15px;
      transform: scaleY(0.5);
      box-sizing: border-box;
    }
    .name{
      font-size: 15px;
      color: #333;
      line-height: 1.5;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 100px;
    }
    .mark{
      margin-left: 10px;
      height: 16px;
      line-height: 16px;
      font-size: 9px;
      padding: 0 3px;
      border-radius: 2px;
      color: #fff;
      background-color: #FD8F28;
    }
    .mark1{
      background-color: #00B1E4;
    }
    .mark2{
      background-color: #598DF7;
    }
    .city{
      font-size: 12px;
      color: #666;
      line-height: 20px;
      font-weight: 500;
    }
    .van-icon-location{
      color: #f75959;
      font-size: 14px;
      vertical-align: middle;
      margin-top: -3px;
      margin-right: 4px;
    }
    .price{
      font-size: 16px;
      color: #f75959;
      line-height: 20px;
      font-weight: 500;
    }
    .flex-item{
      flex:1;
    }
    .info-item{
      font-size: 12px;
      line-height: 16px;
      margin-right: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 30%;
    }
    .label{
      color: #999;
    }
    .value{
      color: #666;
    }
    .van-icon-friends{
      font-size: 14px;
      color: #f75959;
      vertical-align: middle;
      margin-top: -3px;
      margin-right: 3px;
    }
    .bidder{
      font-size: 12px;
      line-height: 16px;
      color: #666;
    }
    .stamp{
      position: absolute;
      right: 100px;
      top: 28px;
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
  }
  .flex{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
}
</style>