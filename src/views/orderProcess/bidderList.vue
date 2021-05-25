<template>
  <div class="bidderList">
    <van-nav-bar
      title="投标人"
      class="primary-header"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <ul class="bidder-list">
      <li v-for="item in bidderList" :key="item.AccountId" @click="look(item)">
        <div class="flex">
          <div class="name">{{item.AccountName}}</div>
          <span class="price">￥{{item.TenderAmount | formatPrice}}</span>
        </div>
        <div class="flex">
          <div class="location">
            <van-icon name="location" />
            <span>{{item.ProvinceName}}·{{item.CityName}} | 距离{{item.JobDistance}}km</span>
          </div>
          <mark :class="['title-mark',{'mark1':item.AccountType ==1,'mark2':item.AccountType ==2}]">{{item.RoleName}}</mark>
        </div>
        <div class="flex align-right">
          <!-- <div class="create-time">
            投标时间：<time class="time">{{item.TenderTime}}</time>
          </div> -->
          <button class="btn-default" v-if="item.TenderEasemobSessionId" @click.stop="chat(item)">
            <i class="icon-chat"></i>
            <span>在线联系</span>
          </button>
          <button class="btn-default" @click.stop="call(item.HandSet)">
            <van-icon name="phone" />
            <span>电话联系</span>
          </button>
        </div>
      </li>
    </ul>
    <van-dialog v-model="showPrompt" class="prompt-call" :before-close="confirmCall" close-on-click-overlay>
      <div class="tel-form">
        <van-icon name="phone-o" />
        <input class="input" type="tel" v-model="contacts" placeholder="请输入您的联系方式">
      </div>
    </van-dialog>
  </div>
</template>
<script>
import {
  GetTenderList,
  AxbBindPhone,
} from '@/common/api.js'
import {mapState} from 'vuex'
import valid from '@/common/validate.js'
export default {
  name:'BidderList',
  data(){
    return{
      bidderList:[],
      jobNo:'',
      showPrompt:false,
      contacts:'',
      phone:'',
    }
  },
  created() {
    this.jobNo=this.$route.query.jobNo;
    this.loadList();
  },
  methods: {
    loadList(){
      GetTenderList({
        JobNo:this.jobNo,
      }).then(r=>{
        if(r.Result==1){
          this.bidderList=r.Data;
        }else{
          this.$toast(r.Message);
        }
      })
    },
    look(item){
      this.$router.push({path:'/bidderPlan',query:{
        orderId:item.JobApplyOrderId ,
        accountType:item.AccountType,
        accountId:item.AccountId,
      }})
    },//提交电话
    call(contacts){
      this.phone=contacts;
      this.showPrompt=true;
    },
    //单聊
    chat(item){
      this.$store.dispatch('getSingleList');
      setTimeout(() => {
        this.$router.push({
          path:'/chat',
          query:{
            chatId:item.TenderEasemobSessionId,
            type:'contact',
            nickname:item.AccountName
          }
        })
      }, 600);      
    },
    //三方联系接单人
    confirmCall(action,done){
      if(action==='confirm'){
        var that=this;
        if(!valid.link(this.contacts)){
            this.$toast('请输入正确的电话号码或者手机号！');
            done(false);
            return;
        }
        // if(!valid.link(this.phone)){
        //     this.$toast('对方电话有误，请联系速派400-1100-243！');
        //     done(false);
        //     return;
        // }
        AxbBindPhone({
          jobId:0,
          isLongTime:false,
          aNumber:this.contacts,
          bNumber:this.phone,
          platform:'pcweb'
        }).then(r=>{
            if(r.Result==1){
                // this.$toast('拨打成功！');
                window.location.href='tel:'+r.Data.PrivateNumber;
            }else{
                this.$toast(r.Message);
            }
            done();
            this.showPrompt=false;
        })
      }
      done();
    },
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.bidderList{
  padding-top: 46px;
  .bidder-list{
    padding: 0 15px;
    background-color: #fff;
    >li{
      padding: 10px 0;
      @include bb;
    }
    .flex{
      @include flex;
      line-height: 24px;
      &.align-right{
        justify-content: flex-end;
        margin-top: 6px;
      }
    }
    .name{
      font-size: 15px;
      font-weight: bold;
      color: #333;
    }
    .price{
      font-size: 16px;
      color: $primary;
      font-family: $number;
      font-weight: 500;
    }
    .location{
      font-size: 12px;
      color: #666;
      display: flex;
      align-items: center;
    }
    .van-icon-location{
      font-size: 14px;
      margin-right: 6px;
      color: $primary;
    }
    .title-mark{
      font-size: 9px;
      padding: 0 3px;
      height: 16px;
      line-height: 16px;
      color: #fff;
      &.mark1{
        background-color: #FD8F28;
      }
      &.mark2{
        background-color: #027B21;
      }
    }
    .create-time{
      font-size: 12px;
      color: #999;
      .time{
        color: #666;
      }
    }
    .btn-default{
      @include flex;
      width: 80px;
      height: 24px;
      border: 1px solid $primary;
      color: #333;
      font-size: 12px;
      background-color: #fff;
      border-radius: 24px;
      justify-content: center;
      margin-left: 10px;
      &:active{
        color: $primary;
      }
    }
    .icon-chat{
      width: 16px;
      height: 16px;
      background:url('~@/assets/orderProcess/icon-chat.png') no-repeat center;
      background-size: contain;
      margin-right: 2px;
    }
    .van-icon-phone{
      color: $primary;
      margin-left: 6px;
      font-size: 16px;
      margin-right: 2px;
    }

  }
}
</style>