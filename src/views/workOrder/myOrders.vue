<template>
  <div class="myOrders">
    <div class="van-nav-bar van-nav-bar--fixed primary-header" style="z-index: 10;">
      <div class="van-nav-bar__content">
        <div class="van-nav-bar__left"></div>
        <div class="van-nav-bar__title van-ellipsis">
          已发工单
          <!-- <ul class="nav-tab-hd">
            <li v-for="(item,index) in navTab" :class="{active:navIndex==index}" :key="index" @click="navSwitch(index)">{{item}}</li>
          </ul> -->
        </div>
        <div class="van-nav-bar__right" @click="$router.push('/searchOrder')">
          <i class="van-icon van-icon-search"></i>
        </div>
      </div>
    </div>
    <!-- <received-orders v-show="navIndex==0"></received-orders> -->
    <created-orders></created-orders>
  </div>
</template>
<script>
import CreatedOrders from '@/views/workOrder/createdOrders.vue'
// import ReceivedOrders from '@/views/workOrder/receivedOrders.vue'
export default {
  name:'MyOrders',
  components:{
    CreatedOrders,
    // ReceivedOrders
  },
  data(){
    return{
      navTab:['承接工单','已发工单'],
      navIndex:1,
    }
  },
  methods: {
    navSwitch(index){
      this.navIndex=index;
    },
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.myOrders{
  padding-top: 46px;
  min-height: calc(100vh - 96px);
  .nav-tab-hd{
    width: 200px;
    height: 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >li{
      font-size: 15px;
      color: #fff;
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
        background-color: #fff;
        transition: all 0.2s;
      }
    }
    >.active{
      color: #fff;
      &:after{
        width: 40px;
      }
    }
  }
  .van-icon-search{
    font-size: 20px;
  }
  
}
</style>