<template>
  <div class="createdOrders">
    <van-sticky :offset-top="46">
      <!-- <ul class="tab-hd">
        <li 
          :class="['tab-hd-item',{on:tabIndex==index}]" 
          v-for="(item,index) in tabbar" 
          :key="index" 
          @click="tabChange(index)">{{item}}</li>
      </ul> -->
      <van-tabs v-model="tabCode" @change="tabChange">
        <van-tab :name="item.JobStatusVO" :badge="item.JobCount>0?item.JobCount:''" v-for="(item,index) in tabbar" :key="index" :title="item.JobStatusName"></van-tab>
      </van-tabs>
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
          <div class="name flex-item"><i class="urgent" v-if="item.IsUrgent"></i>{{item.Title}}</div>
          <div :class="['mark',{'mark1':item.JobType==6,'mark2':item.JobType==1,'mark3':item.JobType==8,}]">{{item.JobTypeName}}</div>
        </div>
        <div class="flex">
          <div class="city flex-item"><i class="van-icon van-icon-location"></i>{{item.ProvinceName}}·{{item.CityName}}</div>
          <div class="price">¥{{item.JobStepAmount}}</div>
        </div>
        <div class="flex-end">
          <div class="product-list">
            <div class="product-item" v-for="(product,idx) in item.ListProduct" :key="'product'+idx">
              {{product.DomainName}}—{{product.ProductName}}—{{product.BrandName}}
              <span v-if="product.SerialName">—{{product.SerialName}}</span>
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="info-item flex-item">
            <span class="label">上门时间：</span>
            <span class="value">{{item.ExecStartDate}}至{{item.ExecEndDate}}</span>
          </div>
          <div class="status">{{item.JobStepName}}</div>
        </div>
        <div class="btn-group">
          <div class="btn-default" v-if="item.IsShowAdditionalDeposit" @click.stop="addDesposit(item.JobId)">追加押金</div>
          <div class="btn-default" @click.stop="toPublish(item.JobId,item.JobType)">再来一单</div>
          <div class="btn-chat" v-if="item.EasemobGroupId" @click.stop="toChat(item.EasemobGroupId)">
            <i class="icon-chat"></i>
            <span>群聊</span>
          </div>
        </div>
        <div 
          :class="['stamp',{
            'stamp5':item.JobStatusVO==10,
            'stamp6':item.JobStatusVO==40,
          } ]"
        ></div>
      </div>
    </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import {ListSendJob,GetSendJobSummary} from '@/common/api.js'
import {mapState} from 'vuex'
export default {
  name:'CreatedOrders',
  data(){
    return{
      tabbar:[],
      tabCode:0,
      finished:false,
      loading:true,
      orderList:[],
      pageNo:1,
      pageSize:10,
      refreshing:false,
      keyWord:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
      searchOrderWord:state=>state.searchOrderWord,
    })
  },
  watch: {
    '$route'(to,from){
      if(to.path=='/myOrders' && from.path=='/searchOrder'){
        this.pageNo=1;
        this.keyWord=this.searchOrderWord;
        this.finished = false;
        this.loading = true;
        this.loadList();
      }
    },
    tabbar:{
      handler(value,old){
        if(value.length!=old.length){
          this.tabChange(this.tabCode);
          return;
        }
        let isSame=true;
        for (let i = 0; i < value.length; i++) {
          for (let k in value[i]) {
            if (value[i][k]!==old[i][k]) {
              isSame=false;
            }
          }
        }
        if(!isSame){
          this.tabChange(this.tabCode);
        }
      },
      deep:true,
    }
  },
  created(){
    this.init();
  },
  activated(){
    this.init();
  },
  methods: {
    init(){
      let params={};
      if(this.userData && this.userData.CompanyId){
        params['CompanyId']=this.userData.CompanyId;
      }
      if(this.userData && this.userData.UserId){
        params['UserId']=this.userData.UserId;
      }
      GetSendJobSummary(params).then(r=>{
        if(r.Result==1){
          let isCreate=true;
          if(this.tabbar.length>0){
            isCreate=false;
          }
          this.tabbar=r.Data.JobSummaryList||[];
          if(!isCreate){
            return;
          }
          this.tabCode=0;
          for (let i = 0; i < this.tabbar.length; i++) {
            if(this.tabbar[i].JobStatusVO==10 && this.tabbar[i].JobCount>0){
              this.tabCode=10;
              break;
            }
            if(this.tabbar[i].JobStatusVO==40 && this.tabbar[i].JobCount>0){
              this.tabCode=40;
              break;
            }
          }
          this.timerAlert(r.Data.SettlePopDto);
          this.tabChange(this.tabCode);
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //tab切换
    tabChange(index){
      this.tabCode=index;
      this.orderList=[];
      this.pageNo=1;
      this.finished=false;
      this.loading=true;
      this.loadList();
    },
    //下拉刷新
    onRefresh(){
      this.pageNo=1;
      this.keyWord='';
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
        JobStatusVO:this.tabCode,
        PageSize:this.pageSize,
        PageIndex:this.pageNo,
        SearchCondition:this.keyWord,
      }
      if(this.userData.UserCode.substr(0,1)=='e'){
        params['CompanyId']=this.userData.CompanyId;
      }else{
        params['UserId']=this.userData.UserId;
      }
      ListSendJob(params).then(r=>{
        this.loading = false;
        let list=r.Data.JobList || [];
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
    //每周弹框
    timerAlert(data){
      if(!data.IsExist){
        return;
      }
      let msg='';
      if(data.DifferStatus==2){
        msg='工单已完成请支付工单费用，因你的支付金额不足未完成支付，请及时完成支付';
      }else{
        msg='工单已完成请支付工单费用，如14天后工单金额支付未完成系统自动扣除工单费用';
      }
      var lastTime=Number(this.$getStorage('orderListViewTime'));
      var today=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime();
      this.$setStorage('orderListViewTime',today);
      if(today-lastTime>=7*24*60*60*1000){
        this.$dialog.confirm({
          message:msg
        }).then(()=>{
          this.toDetail(data.JobId);
        })
      }
    },
    //查看详情
    toDetail(data){
      this.$router.push({path:'/orderProcess',query:{jobId:data}});
    },
    //追加押金
    addDesposit(jobId){
      this.$store.commit('setJobId',jobId);
      this.$store.commit('triggerDespositDialog',true);
    },
    //去聊天
    toChat(groupId){
      this.$router.push({path:'/chat',query:{chatId:groupId,type:'group'}});
    },
    //再发单
    toPublish(id,jobType){
      this.$router.push({path:'/createOrder',query:{jobId:id,jobType:jobType}});
    },
  },
}
</script>
<style lang="scss" >
@import '~@/style/_base.scss';
.createdOrders{
  // .tab-hd{
  //   width: 100%;
  //   height: 40px;
  //   display: flex;
  //   align-items: flex-end;
  //   justify-content: space-between;
  //   position: relative;
  //   padding-left: 15px;
  //   padding-right: 15px;
  //   background-color: #fff;
  //   &:after{
  //     content: '';
  //     position: absolute;
  //     left: 0;
  //     bottom: 0;
  //     width: 100%;
  //     height: 1px;
  //     background-color: #e5e5e5;
  //     transform: scaleY(0.5);
  //     padding-left: 15px;
  //     padding-right: 15px;
  //     background-clip: content-box;
  //   }
  // }
  // .tab-hd-item{
  //   font-size: 14px;
  //   color: #666;
  //   line-height: 30px;
  //   padding-left: 8px;
  //   padding-right: 8px;
  //   position: relative;
  //   &:after{
  //     content: '';
  //     position: absolute;
  //     left: 50%;
  //     bottom: 0;
  //     z-index: 2;
  //     width: 0;
  //     height: 1px;
  //     background-color: #f75959;
  //     transform: translateX(-50%);
  //     transition: width 0.2s;
  //   }
  //   &.on:after{
  //     width: 100%;
  //   }
  // }
  .van-tabs__line{
    height: 1px;
  }
  .van-list{
    min-height: 80vh;
  }
  .flex-end{
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
  }
  .product-list{
    flex: 1;
    width: 100px;
    .product-item{
      font-size: 12px;
      line-height: 20px;
      color: #666;
      margin-bottom: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
  .btn-group{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .btn-default{
      width: 70px;
      height: 24px;
      border: 1px solid #e5e5e5;
      text-align: center;
      font-size: 12px;
      color: #666;
      line-height: 22px;
      border-radius: 24px;
      margin-left: 10px;
      &:active{
        background-color: $primary;
        color: #fff;
        border-color: $primary;
      }
    }
    .btn-chat{
      width: 70px;
      height: 24px;
      border: 1px solid #e5e5e5;
      border-radius: 24px;
      font-size: 12px;
      color: #666;
      line-height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      .icon-chat{
        width: 16px;
        height: 16px;
        background:url('~@/assets/orderProcess/icon-chat.png') no-repeat center;
        background-size: contain;
        margin-right: 4px;
      }
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
    .urgent{
      display: inline-block;
      vertical-align: middle;
      margin-top: -3px;
      width: 28px;
      height: 12px;
      background: url('~@/assets/workOrder/icon-urgent.png') no-repeat center;
      background-size: contain;
      margin-right: 3px;
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
      background-color: #00B1E4;
    }
    .mark2{
      background-color: #FD8F28;
    }
    .mark3{
      background-color:#598DF7;
    }
    .city{
      font-size: 12px;
      color: #666;
      line-height: 20px;
      font-weight: 500;
    }
    .van-icon-location{
      color: $primary;
      font-size: 14px;
      vertical-align: middle;
      margin-top: -3px;
      margin-right: 4px;
    }
    .price{
      font-size: 16px;
      color: #333;
      line-height: 20px;
      font-weight: 500;
      font-family: $number;
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
      min-width: 30%;
    }
    .label{
      color: #999;
    }
    .value{
      color: #666;
    }
    .van-icon-friends{
      font-size: 14px;
      color: $primary;
      vertical-align: middle;
      margin-top: -3px;
      margin-right: 3px;
    }
    .status{
      font-size: 12px;
      line-height: 16px;
      color: $primary;
    }
    .stamp{
      position: absolute;
      right: 100px;
      top: 10px;
      z-index: 2;
      width: 57px;
      height: 52px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }
    // .stamp-close{
    //   background-image: url('~static/image/status/stamp-close.png');
    // }
    // .stamp-cancel{
    //   background-image: url('~static/image/status/stamp-cancel.png');
    // }
    // .stamp-stop{
    //   background-image: url('~static/image/status/stamp-stop.png');
    // }
    // .stamp-finish{
    //   background-image: url('~static/image/status/stamp-finish.png');
    // }
    .stamp5{
      background-image: url('~static/image/status/stamp5.png');
    }
    .stamp6{
      background-image: url('~static/image/status/stamp6.png');
    }
  }
  .flex{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>