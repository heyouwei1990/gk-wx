<template>
  <div class="balanceBill">
    <van-nav-bar
      title="余额明细"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <van-sticky :offset-top="46" z-index="10" >
      <div class="fixed-head">
        <span class="btn-text" @click="showPicker=true">{{month}}<van-icon name="arrow-down" /></span>
      </div>
    </van-sticky>
    <ul class="list">
      <li v-for="(item,index) in billList" :key="index">
        <div class="flex">
          <div class="name">{{item.TradeType}}/{{item.PayStatus}}</div>
          <div class="amount">{{item.Money | formatPrice}}</div>
        </div>
        <div class="desc">{{item.Title}}</div>
        <div class="order-no"><span v-if="item.JobNo">工单号：</span>{{item.JobNo}}</div>
        <time class="time">{{item.TradeDate}} {{item.TradeTime}}</time>
      </li>
    </ul>
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="confirm"
      />
    </van-popup>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {ListTradeRecordByUser} from '@/common/api.js'
import {FormatTime} from '@/common/util.js'
export default {
  name:'BalanceBill',
  data(){
    return{
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(2025, 11, 1),
      currentDate: new Date(),
      showPicker:false,
      month:'',
      startTime:'',
      endTime:'',
      billList:[],
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  created() {
    this.confirm();
  },
  methods: {
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      }
      return val;
    },
    confirm(){
      let year=new Date(this.currentDate).getFullYear();
      let month=new Date(this.currentDate).getMonth();
      this.month=year+'年'+(month+1)+'月';
        this.startTime=FormatTime(new Date(year,month,1),'yyyy-MM-dd');
      if(month==11){
        this.endTime=FormatTime(new Date(year+1,0,1),'yyyy-MM-dd');
      }else{
        this.endTime=FormatTime(new Date(year,month+1,1),'yyyy-MM-dd');
      }
      this.loadList();
      this.showPicker=false;
      document.documentElement.scrollTop=0;//滚动条到顶部
    },
    loadList(){
      ListTradeRecordByUser({
        UserCode:this.userData.UserCode,
        StartTime:this.startTime,
        EndTime:this.endTime
      }).then(r=>{
        if(r.Result==1){
          this.billList=r.Data;
        }else{
          this.$toast(r.Message);
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.balanceBill{
  padding-top: 46px;
  background-color: #fff;
  min-height: 100vh;
  .fixed-head{
    background-color: #f9f9f9;
    padding: 0 15px;
    height: 44px;
  }
  .btn-text{
    font-size: 14px;
    color: #333;
    line-height: 44px;
  }
  .van-icon-arrow-down{
    margin-left: 10px;
  }
  .list{
    padding: 0 15px;
    >li{
      @include bb;
      padding-top: 10px;
      padding-bottom: 10px;
      line-height: 24px;
    }
    .flex{
      @include flex;
      margin-bottom: 6px;
    }
    .name{
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }
    .amount{
      font-family:$number;
      color: $primary;
      font-size: 16px;
      font-weight: 500;
    }
    .desc{
      font-size: 14px;
      color: #666;
      font-weight: 500;
      min-height: 24px;
    }
    .order-no{
      font-size: 14px;
      color: #666;
      min-height: 24px;
    }
    .time{
      font-size: 14px;
      color: #666;
    }
  }
}
</style>