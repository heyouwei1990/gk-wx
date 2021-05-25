<template>
  <div class="receivedOrders">
    <van-sticky :offset-top="46">
      <ul class="tab-hd">
        <li 
          :class="['tab-hd-item',{on:tabIndex==index}]" 
          v-for="(item,index) in tabbar" 
          :key="index" 
          @click="tabChange(index)">{{item}}</li>
      </ul>
    </van-sticky>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadList"
    >
      <div class="order-item" v-for="(item,index) in orderList" :key="index" @click="toDetail(item.JobId)">
        <div class="flex">
          <div class="name flex-item">{{item.JobTitle}}</div>
          <div :class="['mark',{'mark1':item.PlatformType==5,'mark2':item.PlatformType==1,'mark3':item.PlatformType==6,}]">{{item.PlatformName}}</div>
        </div>
        <div class="flex">
          <div class="city flex-item"><i class="van-icon van-icon-location"></i>{{item.ProviceName}}·{{item.CityName}}</div>
          <div class="price">¥{{item.JobStepAmount}}</div>
        </div>
        <div class="flex">
          <div class="info-item" v-if="item.ProductCategoryName">
            <span class="label">产品：</span>
            <span class="value">{{item.ProductCategoryName}}</span>
          </div>
          <div class="info-item" v-if="item.BrandName">
            <span class="label">品牌：</span>
            <span class="value">{{item.BrandName}}</span>
          </div>
          <div class="info-item" v-if="item.ServiceStageName">
            <span class="label">服务类型：</span>
            <span class="value">{{item.ServiceStageName}}</span>
          </div>
        </div>
        <div class="flex">
          <div class="info-item flex-item">
            <span class="label">执行时间：</span>
            <span class="value">{{item.ExecStartDate}}至{{item.ExecEndDate}}</span>
          </div>
          <div class="time" v-if="item.CreateTimeRemark">8天前</div>
        </div>
      </div>
    </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import {GetMyPickJobList} from '@/common/api.js'
import {mapState} from 'vuex'
export default {
  name:'ReceiveOrders',
  data(){
    return{
      tabbar:['全部','待承接','已投标','服务中','已完成'],
      tabIndex:0,
      finished:false,
      loading:true,
      refreshing:false,
      orderList:[],
      pageNo:1,
      pageSize:10,
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData
    })
  },
  mounted() {
    this.loadList();
  },
  methods: {
    //tab切换
    tabChange(index){
      this.tabIndex=index;
      this.orderList=[];
      this.pageNo=1;
      this.finished=false;
      this.loading=true;
      this.loadList();
    },
    //下拉刷新
    onRefresh(){
      this.pageNo=1;
      this.finished = false;
      this.loading = true;
      this.loadList();
    },
    //加载列表
    loadList(){
      if(!this.userData){
        return;
      }
      let params={
        jobStep:this.tabIndex,
        pageSize:this.pageSize,
        pageNum:this.pageNo
      }
      if(this.userData.UserCode.substr(0,1)=='e'){
        params['loginCompanyId']=this.userData.CompanyId;
      }else{
        params['loginUserId']=this.userData.UserId;
      }
      GetMyPickJobList(params).then(r=>{
        this.loading = false;
        let list=r.Data.jobList || [];
        if(r.Result==1){
          if (this.refreshing) {
            this.orderList = [];
            this.refreshing = false;
          }
          if (this.pageNo==1) {
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
      })
    },
    //查看详情
    toDetail(data){
      this.$router.push({path:'/orderDetail',query:{jobId:data}});
    }
  },
}
</script>
<style lang="scss">
.receivedOrders{
  .tab-hd{
    width: 100%;
    height: 40px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: relative;
    padding-left: 15px;
    padding-right: 15px;
    background-color: #fff;
    &:after{
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: #e5e5e5;
      transform: scaleY(0.5);
      padding-left: 15px;
      padding-right: 15px;
      background-clip: content-box;
    }
  }
  .tab-hd-item{
    font-size: 14px;
    color: #666;
    line-height: 30px;
    padding-left: 8px;
    padding-right: 8px;
    position: relative;
    &:after{
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      z-index: 2;
      width: 0;
      height: 1px;
      background-color: #f75959;
      transform: translateX(-50%);
      transition: width 0.2s;
    }
    &.on:after{
      width: 100%;
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
    }
    .mark1{
      background-color: #1CB766;
    }
    .mark2{
      background-color: #FD8F28;
    }
    .mark3{
      background-color: #598df7;
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