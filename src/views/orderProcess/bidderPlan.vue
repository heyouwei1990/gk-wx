<template>
  <div class="bidderPlan">
    <van-nav-bar
      title="服务方案"
      class="primary-header"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    
    <section class="sec1" v-if="servicePlan">
      <div class="receiver">
        <div class="flex" @click="call(servicePlan.TenderHandSetForCall)">
          <span class="name">{{servicePlan.TenderLinkMan}}</span>
          <span :class="['role',{company:servicePlan.TenderUserType==2}]">{{servicePlan.TenderRoleCodeName}}</span>
        </div>
        <div class="location">
          <van-icon name="location" />
          <span>{{servicePlan.AddressVO.ProvinceName+'·'+servicePlan.AddressVO.CityName}}| 距离{{servicePlan.AddressVO.JobDistance}}km</span>
        </div>
      </div>
      <div class="btn-group">
        <button class="btn-default" v-if="servicePlan.TenderEasemobSessionId" @click="chat">
          <i class="icon-chat"></i>
          <span>在线联系</span>
        </button>
        <button class="btn-default" @click="call(servicePlan.TenderHandSetForCall)">
          <van-icon name="phone" />
          <span>电话联系</span>
        </button>
      </div>
      <!-- 投标内容信息 -->
      <div class="plan-info">
        <div class="module-hd">
          <h3>服务报价：</h3>
          <div class="btn-tax" @click="hasTax=!hasTax">
            <span :class="{on:hasTax}">含税</span>/
            <span :class="{on:!hasTax}">不含税</span>
          </div>
        </div>
        <ul class="info-list">
          <li>
            <span class="label">预计服务天数：</span>
            <div class="value">{{servicePlan.WorkLogDayCount}}</div>
          </li>
          <li>
            <span class="label">服务报价：</span>
            <div class="value">￥{{hasTax?servicePlan.WorkLogAmountTax:servicePlan.WorkLogAmount | formatPrice}}</div>
          </li>
          <li>
            <span class="label">交通费用：</span>
            <div class="value">￥{{hasTax?servicePlan.TrafficAmountTax:servicePlan.TrafficAmount | formatPrice}}</div>
          </li>
          <li>
            <span class="label">住宿费用：</span>
            <div class="value">￥{{hasTax?servicePlan.HousingAmountTax:servicePlan.HousingAmount | formatPrice}}</div>
          </li>
          <li>
            <span class="label">总费用：</span>
            <div class="value">￥{{hasTax?servicePlan.TotalAmountTax:servicePlan.TotalAmount | formatPrice}}</div>
          </li>
        </ul>
        <div class="module-hd">
          <h3>解决方案：</h3>
        </div>
        <div class="desc">{{servicePlan.Solution}}</div>
        <div class="module-hd">
          <h3>补充文档：</h3>
        </div>
        <ul class="doc-list" v-if="servicePlan.FileList">
          <li v-for="(item,index) in servicePlan.FileList" :key="index">
            <img v-if="item.FileType==1" class="pic" :src="item.IconUrl" alt="">
            <img v-if="item.FileType==2" class="pic" :src="item.FileUrl" alt="">
          </li>
        </ul>
      </div>
      <!-- 投标内容信息 end -->
    </section>
    <section class="sec2" v-if="receiverInfo">
      <div class="auth-item">
        <span class="label">安全培训与服务规范认证：</span>
        <div class="value">
          <span :style="{color:receiverInfo.IsExistSafeTrain?'#4BCE54':'#999'}">
            {{receiverInfo.IsExistSafeTrain?'已通过':'未通过'}}
          </span>
          <van-icon name="checked" size="18" :color="receiverInfo.IsExistSafeTrain?'#4BCE54':'#E5E5E5'" />
        </div>
      </div>
      <div class="auth-item">
        <span class="label">产品级认证：</span>
        <span :class="['btn-drop',{'drop':isDrop}]" @click="isDrop=!isDrop">{{isDrop?'收起':'展开'}}</span>
      </div>
      <div class="auth-info" :style="{'height':isDrop?'auto':'140px'}">
        <template v-for="(item,index) in receiverInfo.ProductAuthList" >
          <div 
            :key="item.AuthType" 
            v-if="item.AuthNameList.length"
            :class="{'original':item.AuthType==1,'operation':item.AuthType==4,'low-class':item.AuthType==2,'high-class':item.AuthType==8}">
            <div class="auth-sample" v-if="item.AuthType">
              <van-icon name="completed" />
              <span class="auth">{{item.AuthTypeName}}</span>
            </div>
            <ul class="product-list" :key="'productAuth'+index">
              <li  v-for="(product,idx) in item.AuthNameList" :key="'product'+index+idx">{{product}}</li>
            </ul>
          </div>
        </template>
      </div>
      <div class="auth-item ">
        <span class="label">服务类型认证：</span>
      </div>
      <div class="auth-info">
        <template v-for="(item,index) in receiverInfo.ServiceTypeAuthList" >
          <div 
            :key="item.AuthType" 
            v-if="item.AuthNameList.length"
            :class="{'original':item.AuthType==1,'operation':item.AuthType==4,'low-class':item.AuthType==2,'high-class':item.AuthType==8}">
            <div class="auth-sample" v-if="item.AuthType">
              <van-icon name="completed" />
              <span class="auth">{{item.AuthTypeName}}</span>
            </div>
            <ul class="service-list" :key="'productAuth'+index">
              <li  v-for="(product,idx) in item.AuthNameList" :key="'product'+index+idx">{{product}}</li>
            </ul>
          </div>
        </template>
      </div>
    </section>
    <footer class="footer">
      <div class="text">总计：<i class="price" v-if="servicePlan">￥{{servicePlan.TotalAmountTax | formatPrice}}</i></div>
      <button class="btn-primary" @click="pay">支付并选为中标人</button>
    </footer>
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
  GetMarketJobTenderInfo,
  GetServiceSiteInfo,
  GetUserEngineerInfo,
  AxbBindPhone,
  CreatePayOrder,
  AXBindPhone
} from '@/common/api.js'
import { ImagePreview } from 'vant';
import {mapState} from 'vuex'
import valid from '@/common/validate.js'
export default {
  name:'BidderPlan',
  data(){
    return{
      servicePlan:null,
      receiverInfo:null,
      orderId:'',
      accountId:'',
      accountType:'',
      contacts:'',
      phone:'',
      showPrompt:false,
      isDrop:false,
      hasTax:true,//含税
    }
  },
  created() {
    this.orderId=Number(this.$route.query.orderId);
    this.accountId=Number(this.$route.query.accountId);
    this.accountType=Number(this.$route.query.accountType);
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      //获取服务方案
      GetMarketJobTenderInfo({
        JobApplyOrderId:this.orderId,
      }).then(r=>{
        if(r.Result==1){
          this.servicePlan=r.Data;
        }else{
          this.$toast(r.Message);
        }
      });
      if(this.accountType==1){
        //获取工程师信息
        GetUserEngineerInfo({
          UserID:this.accountId
        }).then(r=>{
          if(r.Result==1){
            this.receiverInfo=r.Data;
          }else{
            this.$toast(r.Message);
          }
        })
      }else{
        // 获取服务站信息
        GetServiceSiteInfo({
          CompanyID:this.accountId
        }).then(r=>{
          if(r.Result==1){
            this.receiverInfo=r.Data;
          }else{
            this.$toast(r.Message);
          }
        })
      }
    },
    //提交电话
    call(contacts){
      this.phone=contacts;
      this.showPrompt=true;
      // if(!contacts){
      //     this.$toast('对方电话有误，请联系速派400-1100-243！')
      //     return;
      // }
      // AXBindPhone({
      //     orgNumber:contacts,
      //     platform:'pcweb'
      // }).then(r=>{
      //     if(r.Result==1){
      //       window.location.href='tel:'+r.Data.PrivateNumber;
      //     }else{
      //         this.$toast(r.Message);
      //     }
      // })
    },
    //单聊
    chat(){
      this.$store.dispatch('getSingleList');
      setTimeout(() => {
        this.$router.push({
          path:'/chat',
          query:{
            chatId:this.servicePlan.TenderEasemobSessionId,
            type:'contact',
            nickname:this.servicePlan.TenderLinkMan
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
    pay(){
      CreatePayOrder({
        Amount:this.servicePlan.TotalAmountTax,
        OuterOrderType:2,
        OuterOrderId:this.orderId,
        TradeType:2,
      }).then(r=>{
        if(r.Result==1){
          this.$router.push({path:'/payDeposit',query:{jobId:this.orderId,payId:r.Data.PayId}});
        }else{
          this.$toast(r.Message);
        }
      })
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.bidderPlan{
  padding-top: 46px;
  padding-bottom: 50px;
  .sec1{
    margin-bottom: 10px;
  }
  .receiver{
    padding: 15px 15px;
    width: 100%;
    background-color: #fff;
    margin-bottom: 5px;
    .flex{
      @include flex;
    }
    .name{
      font-size: 16px;
      color: #333;
      font-weight: 600;
      line-height: 20px;
      flex: 1;
      width: 80%;
      @extend .ellipsis;
    }
    .location{
      font-size: 14px;
      color: #666;
      line-height: 24px;
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
    .van-icon-location{
      font-size: 20px;
      margin-right: 6px;
      color: $primary;
    }
    .role{
      display: inline-block;
      padding: 0 4px;
      height: 20px;
      line-height: 20px;
      color: #fff;
      background-color: #FD8F28;
      font-size: 12px;
      &.company{
        background-color: #027B21;
      }
    }
  }
  .btn-group{
    @include flex;
    padding: 8px 20px;
    background-color: #fff;
    margin-bottom: 5px;
    justify-content: space-around;
    line-height: 1;
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
  .plan-info{
    .desc{
      font-size: 14px;
      color: #999;
      line-height: 22px;
      background-color: #fff;
      padding: 0 15px;
    }
  }
  .module-hd{
    @include flex;
    background-color: #fff;
    padding: 10px 15px;
    h3{
      font-weight: bold;
      font-size:18px;
      color: #333;
      line-height: 24px;
    }
    .btn-tax{
      font-size: 13px;
      color: #666;
      .on{
        color: $primary;
      }
    }
  }
  .info-list{
    >li{
      display: flex;
      padding: 10px 15px;
      background-color: #fff;
      font-size:14px;
      color: #333;
      line-height: 20px;
      border-bottom: 1px solid #e5e5e5;
      &:last-of-type{
        margin-bottom: 10px;
        border-bottom: 0;
      }
    }
    .label{
      min-width: 70px;
      font-weight: 600;
    }
    .value{
      flex: 1;
      text-align: right;
    }
  }
  .doc-list{
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    padding: 0 15px;
    >li{
      float: left;
      width: px2rem(188px);
      height: px2rem(188px);
      margin-right: px2rem(63px);
      margin-bottom: 10px;
      &:nth-child(3n){
        margin-right: 0;
      }
    }
    .pic{
      display: block;
      width: 100%;
      height: 100%;
      background-color: #f8f8f8;
    }
  }
  .auth-item{
    @include flex;
    padding: 10px 15px;
    background-color: #fff;
    .label{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      font-weight: bold;
    }
    .value{
      font-size: 13px;
      line-height: 24px;
      display: flex;
      align-items: center;
    }
    .van-icon-checked{
      margin-left: 4px;
      font-size: 16px;
    }
    .btn-drop{
      float: right;
      font-size: 12px;
      color: #999;
      line-height: 20px;
      padding-right: 15px;
      position: relative;
      &:after{
        content: "";
        position: absolute;
        right:0;
        top: 50%;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-top: 6px solid #ccc;
        transition: all linear 0.2s;
      }
      &.drop{
        &:after{
          transform:translateY(-6px) rotate(-180deg);
          transform-origin: center;
        }
      }
    }
  }
  .auth-info{
    padding-left: 15px;
    padding-right: 15px;
    background-color: #fff;
    overflow: hidden;
    transition: all 0.2s linear;
    .auth-sample{
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      font-size: 12px;
      line-height: 20px;
    }
    .auth{
      margin-left: 3px;
    }
    .low-class{
      .auth-sample{
        color: #FD8F28;
      }
      .product-list li{
        border-color: #FD8F28;
      }
      .service-list li{
        border-color: #FD8F28;
      }
    }
    .high-class{
      .auth-sample{
        color: #B348CB;
      }
      .product-list li{
        border-color: #B348CB;
      }
      .service-list li{
        border-color: #B348CB;
      }
    }
    .operation{
      .auth-sample{
        color: #76CC7C;
      }
      .product-list li{
        border-color: #76CC7C;
      }
      .service-list li{
        border-color: #76CC7C;
      }
    }
    .original{
      .auth-sample{
        color: #0068B7;
      }
      .product-list li{
        border-color: #0068B7;
      }
      .service-list li{
        border-color: #0068B7;
      }
    }
  }
  .product-list{
    overflow: hidden;
    >li{
      height: 28px;
      width: 100%;
      border: 1px solid #e5e5e5;
      padding: 0 8px;
      line-height: 26px;
      font-size: 12px;
      color: #333;
      margin-bottom: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .service-list{
    overflow: hidden;
    width: 103%;
    box-sizing: content-box;
    >li{
      float: left;
      height: 24px;
      border: 1px solid #e5e5e5;
      padding: 0 10px;
      line-height: 22px;
      font-size: 12px;
      color: #333;
      margin-bottom: 10px;
      margin-right: 10px;
      &.operation{
        border-color: #76CC7C;
      }
      &.supai{
        border-color: #56B1FF;
      }
    }
  }
  .footer{
    box-shadow:0px 5px 20px 0px rgba(34,23,20,0.1);
    @include flex;
    .text{
      flex: 1;
      text-align: right;
      padding-right: 12px;
      font-size: 12px;
      color: #333;
    }
    .price{
      font-size: 18px;
      color: $primary;
      font-weight: 500;
      font-family: $number;
    }
    .btn-primary{
      width: px2rem(300px);
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      color: #fff;
      &:active{
        background-color: $active;
      }
    }
  }
  
  
}
</style>