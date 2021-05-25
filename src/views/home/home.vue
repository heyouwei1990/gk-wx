<template>
  <div class="homePage">
    <van-sticky>
      <div class="home-header">
        <img class="logo-img" src="../../assets/logo.png" alt="工业速派" />
        <span class="phone-size">客服：400-1100-243</span>
        <div class="login-success" v-if="userData">
          <img
            v-if="userData.HeadImg"
            class="head-portrait"
            :src="userData.HeadImg"
            alt
            @click="alertMenu"
          />
          <img
            v-if="userData.RoleCode==1 && !userData.HeadImg"
            class="head-portrait"
            src="../../assets/home/person-avatar.png"
            alt
            @click="alertMenu"
          />
          <img
            v-if="userData.RoleCode!=1 && !userData.HeadImg"
            class="head-portrait"
            src="../../assets/home/company-avatar.png"
            alt
            @click="alertMenu"
          />
        </div>
        <!-- 未登录 -->
        <div class="link-wrap" v-else>
          <router-link to="/login/companyLogin" class="link">登录</router-link>
        </div>
      </div>
    </van-sticky>
    <div class="home-content-2">
      <div class="customer-item" v-if="commonServiceConfig.ProductID" @click="popularTap(commonServiceConfig)">
        <span class="mark">常用</span>
        <div class="title">{{commonServiceConfig.ProductName}}-{{commonServiceConfig.BrandName}}</div>
        <div class="flex">
          <span class="desc">{{commonServiceConfig.ServiceStageName}}</span>
          <div class="btn-text">快速发单</div>
        </div>
      </div>
      <div v-for="(item,index)  in hotServiceConfigList" :key="index" :class="['module-dl',{'hide':index>3}]" @click="hotTap(item.SendJobConfig)">
        <img class="dt" :src="item.iconUrl" alt="">
        <div class="dd">
          <div class="title">{{item.Title}}</div>
          <div class="flex">
            <span class="desc">{{item.SubTitle}}</span>
            <div class="productions">
              <span v-for="(tag,idx) in item.TagList" :key="idx" @click.stop="hotTap(tag.SendJobConfig)">{{tag.IndexShowName}}</span>
            </div>
          </div>
        </div>
      </div>
      <ul class="other-list">
        <li v-for="(item,index)  in otherServiceConfig" :key="index" @click="otherTap(item.SendJobConfig)">
          <img class="icon" v-if="index===0" src="../../assets/home/icon_service1.png" alt="">
          <img class="icon" v-if="index===1" src="../../assets/home/icon_service2.png" alt="">
          <img class="icon" v-if="index===2" src="../../assets/home/icon_service3.png" alt="">
          <div class="desc">{{item.IndexShowName}}</div>
        </li>
      </ul>
    </div>
    <div class="home-content-3">
      <div class="sec-hd">
        <h2 class="lable-title">成功案例</h2>
        <span class="more-link" @click="toOrderList">更多</span>
      </div>
      <div class="padding-all-wrap">
        <div class="scroll-wrap">
          <ul class="success-list" :style="{width:scrollerWidth}">
            <li
              class="item"
              v-for="(item,index) in successList"
              :key="index"
              @click="$router.push({path:'/orderDetail',query:{jobId:item.JobId}})"
            >
              <van-image width="135" height="90" fit="cover" :src="item.ImgUrl" lazy-load class="img" />
              <h2 class="success-title van-ellipsis">{{item.JobTitle}}</h2>
              <p class="address-tips">
                <van-icon name="location" />
                {{item.ProvinceName}}&nbsp;·&nbsp;{{item.CityName}}
              </p>
              <!-- <p class="money-tips">
                <i>￥{{item.MaxPrice}}</i>
              </p> -->
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="home-content-6">
      <div class="sec-hd">
        <h2 class="lable-title">合作伙伴</h2>
      </div>
      <div class="padding-all-wrap">
        <loop :list="logoList"></loop>
      </div>
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      :description="name"
      :round="false"
    />
    <!-- <div class="buoy" @click="openAppFun">
      <img src="../../assets/open-app-buoy.png" alt="打开app" />
    </div> -->
    <van-popup v-model="showEnter" class="enter-dialog" closeable>
      <div class="enter-inner">
        <div class="title">请选择您要发布的工单类型</div>
        <div class="btn-group">
          <button 
            class="btn-default" 
            v-for="(item,index) in enterBtns" 
            :key="index"
            @click="$router.push({path:'/createOrder',query:{jobType:item.jobType,...defaultParams}})"
          >{{item.jobName}}</button>
        </div>
      </div>
    </van-popup>
    <van-popup class="tips-dialog" v-model="isShowTips">
      <div class="tips-inner">
        <h3 class="title">温馨提示</h3>
        <div class="desc">使用工业速派APP下单，还可以享受优惠券折扣哦！</div>
        <div class="btn-group">
          <button class="btn-primary" @click="closeTip(true)">去下载</button>
          <button class="btn-default" @click="closeTip(false)">不了，谢谢</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { GetAdvertise, GetAppHomeData,GetIndexSendJobConfig} from "@/common/api.js";
import { mapState } from "vuex";
import Loop from "@/components/loop.vue";
export default {
  name:'Home',
  components: {
    Loop
  },
  data() {
    return {
      value: 2,
      banners: [], //轮播
      newsList: [], //资讯
      show: false,
      name: "",
      actions: [{ name: "退出" }],
      successList: [], //成功案例
      animate: false,
      workOrderList: [], //工单列表
      logoList: [
        require('../../assets/home/friends-logo1.png'),
        require('../../assets/home/friends-logo2.png'),
        require('../../assets/home/friends-logo3.png'),
        require('../../assets/home/friends-logo4.png'),
        require('../../assets/home/friends-logo5.png'),
        require('../../assets/home/friends-logo6.png'),
      ], //合作伙伴
      initLeft: "",
      enterBtns:[],
      showEnter:false,//
      defaultParams:{},//去发单的默认参数
      commonServiceConfig:{},
      hotServiceConfigList:[],
      otherServiceConfig:[],
      isShowTips:false,
    };
  },
  computed: {
    scrollerWidth: function() {
      //宽135 margin 10 => 145
      return this.successList.length * 145 + "px";
    },
    partnerWidth: function() {
      //宽110 margin 10 => 120
      return this.logoList.length * 120 * 2 + "px";
    },
    ...mapState({
      userData: state => state.userData,
      permission: state => state.permission
    })
  },
  created() {
    if(this.$cookies.get('couponTip')!='1'){
      this.isShowTips=true;
    }
    this.resetPath();
  },
  mounted() {
    this.pageInit();
    setInterval(this.showMarquee, 3000);
    // console.log(navigator.userAgent);
    // this.logoMarquee();
  },
  methods: {
    pageInit() {
      let params={
        IsM:true,
      }
      if(this.userData && this.userData.LoginType==1){
        params['UserId']=this.userData.LoginId;
      }else if(this.userData && this.userData.LoginType==2){
        params['CompanyId']=this.userData.LoginId;
      }
      GetIndexSendJobConfig(params).then(r=>{
        if(r.Result==1){
          this.commonServiceConfig=r.Data.CommonServiceConfig;
          this.hotServiceConfigList=r.Data.HotServiceConfigList || [];
          this.hotServiceConfigList.map((item,i)=>{
            let srcArr=[
              require(`../../assets/home/icon_radius1.png`),
              require(`../../assets/home/icon_radius2.png`),
              require(`../../assets/home/icon_radius3.png`),
              require(`../../assets/home/icon_radius4.png`),
            ]
            if(i<4){
              item.iconUrl=srcArr[i];
            }
          })
          this.otherServiceConfig=r.Data.OtherServiceConfig.TagList || [];
          this.$forceUpdate()
        }
      })
      //获取首页的轮播，新闻和底部的广告数据
      GetAdvertise().then(r => {
        if (r.Result == 1) {
          this.banners = r.Data.adverList || [];
          this.info = r.Data.bottomObj || {};
        }
      });
      //获取经纬度再调取首页数据
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            let longitude = position.coords.longitude;
            let latitude = position.coords.latitude;
            this.loadData(longitude, latitude);
          },
          err => {
            this.$toast("获取经纬度失败，当前使用上海市坐标");
            this.loadData();
          }
        );
      } else {
        this.$toast("获取经纬度失败，当前使用上海市坐标");
        this.loadData();
      }
    },
    //获取首页数据
    loadData(longitude =0, latitude = 0) {
      GetAppHomeData({
        lat: latitude,
        lng: longitude
      }).then(r => {
        if (r.Result == 1) {
          this.newsList = r.Data.BpoNewList || [];
          this.successList = r.Data.SuccessCaseList || [];
          this.workOrderList = r.Data.InviteJobList || [];
          // this.logoList = r.Data.BpoIconList || [];
        }
      });
    },
    alertMenu() {
      this.name = this.userData.LoginName;
      this.show = true;
    },
    //退出
    onSelect(item) {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确认退出？"
        })
        .then(() => {
          this.$store.commit('setUserData',null);
          this.$store.commit('setPermission',null);
          this.$store.dispatch('hxLogout');
          this.show = false;
        })
        .catch(() => {
          this.show = true;
        });
    },
    //工单列表动画
    showMarquee() {
      this.animate = true;
      setTimeout(() => {
        this.workOrderList.push(this.workOrderList[0]);
        this.workOrderList.shift();
        this.animate = false;
      }, 500);
    },
    //常用工单发单
    popularTap(data){
      this.defaultParams=data;
      this.toCreateOrder();
    },
    //热门工单发单
    hotTap(data){
      this.defaultParams=data;
      this.toCreateOrder();
    },
    //其他服务
    otherTap(data){
      this.defaultParams=data;
      this.toCreateOrder();
    },
    //快速发单
    toCreateOrder(data) {
      if (this.permission && this.permission.RoleData) {
        let arr = this.permission.RoleData || [];
        let hasPermission = false;
        let list=[];
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].JurisdictionType == 1 && arr[i].IsOpen) {
            hasPermission = true;
            let obj={...arr[i]};
            if(arr[i].JurisdictionsCode==1001){
              obj['jobType']=1;
              obj['jobName']='自由平台';
            }
            if(arr[i].JurisdictionsCode==1003){
              obj['jobType']=6;
              obj['jobName']='B2B平台';
            }
            if(arr[i].JurisdictionsCode==1005){
              obj['jobType']=8;
              obj['jobName']='内部工单';
            }
            list.push(obj);
          }
        }
        this.enterBtns=list;//发单按钮集合
        if(list.length==1){
          this.defaultParams['jobType']=list[0].jobType;
          this.$router.push({
            path:'/createOrder',
            query:{
              ...this.defaultParams,
            }
          });
          return;
        }
        if (hasPermission) {
          this.showEnter=true;
        } else {
          this.$toast("您没有发单权限，请联系速派客服");
        }
      } else {
        this.$router.push({ path: "/login/personLogin" });
      }
    },
    toOrderList(){
      this.$router.push('/orderList');
      for (let i = 0; i < this.$router.options.routes.length; i++) {
        let route = this.$router.options.routes[i];
        if(route.path=='/orderList'){
          route.meta.tabIndex=1;
        }
      }
    },
    openAppFun() {
      window.location.href = "http://m.gongkongbpo.com/html/recommendOpenApp.html?type=0";
    },
    //认证返回后路由重定向
    resetPath(){
      //http://wx.insupai.com/index.html?path=recharge&UserCode=e59054&CmdId=1&response_type=code&scope=snsapi_userinfo&status=1#wechat_redirect
      var path=window.location.href;
      let index_1=path.indexOf('?');
      let index_2=path.indexOf('#');
      let query=this.getQueryString();
      if(index_1>0 && index_1<index_2){
        //根据?和#的位置判断是否 是微信返回的链接
        let hash=`#/${query.path}?`;
        window.location.href=path.split('?').join(hash);
      }
    },
    //获取url参数
    getQueryString(name) {
        let search = window.location.search.substr(1);
        let arr=search.split('&');
        let query={};
        for (let i = 0; i < arr.length; i++) {
          let obj = arr[i].split('=');
          query[obj[0]]=obj[1];
        }
        if(name){
          return query[name];
        }else{
          return query;
        }
    },
    //弹出下载提示
    closeTip(data){
      this.$cookies.set('couponTip','1','6h');//6小时每次
      this.isShowTips=false;
      if(data){
        window.location.href='http://m.gongkongbpo.com/download/download';
      }
    }
  }
};
</script>
<style lang="scss" >
@import '~@/style/_base.scss';
.homePage{
  background-color: #fff;
  .home-header {
    background: #fff;
    padding: 0 15px;
    height: 40px;
    display: flex;
    align-items: center;
    .logo-img {
      display: block;
      width:116px;
      height:24px;
    }
    .phone-size {
      font-size: 10px;
      height: 40px;
      line-height: 40px;
      padding-left: 6px;
      color: rgba(102, 102, 102, 1);
      flex: 1;
      min-width: 10px;
    }
    .banner-link {
      min-height: 100px;
      display: block;
      width: 100%;
    }
    .link-wrap {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #f75959;
      text-align: right;
      min-width: 44px;
      .link {
        color: #f75959;
      }
    }
    .login-success {
      text-align: right;
      line-height: 36px;
      height: 40px;
      .head-portrait {
        vertical-align: middle;
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
    }
  }
  .padding-all-wrap {
    padding: 0 15px;
  }
  .home-content-1 {
    img {
      display: block;
    }
  }
  .home-content-2 {
    position: relative;
    // height: px2rem(1260px);
    padding: px2rem(249px) px2rem(28px) px2rem(65px);
    background: url('../../assets/home/bg.png') no-repeat center top;
    background-size: cover;
    // margin-bottom: 40px;
    .customer-item{
      border-radius: 12px;
      background-color: #fff;
      padding: 10px 16px;
      position: relative;
      overflow: hidden;
      margin-bottom: 12px;
      .mark{
        position: absolute;
        right: -30px;
        top: -30px;
        width: 60px;
        height: 60px;
        background-color: #f75959;
        color: #fff;
        font-size: 12px;
        line-height: 100px;
        text-align: center;
        transform: rotate(45deg);
      }
      .title{
        font-size: 15px;
        color: #333;
        line-height: 24px;
        font-weight: 600;
        font-family: "仿宋";
        margin-bottom: 4px;
      }
      .flex{
        @include flex;
      }
      .desc{
        font-size: 14px;
        color: #666;
        line-height: 24px;
        font-weight: 500;
      }
      .btn-text{
        font-size: 14px;
        color: $primary;
        line-height: 24px;
        font-weight: 500;
        padding-right: 10px;
        position: relative;
        &:after{
          content: "";
          position: absolute;
          right: -5px;
          top: 50%;
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border-left: 6px solid $primary;
          margin-top: -5px;
        }
      }
    }
    .module-dl{
      @include flex;
      width: 100%;
      border-radius: 12px;
      background-color: #fff;
      padding: 10px 16px;
      position: relative;
      overflow: hidden;
      margin-bottom: 12px;
      &.hide{
        display: none;
      }
      .dt{
        width: px2rem(72px);
        height: px2rem(72px);
        margin-right: 12px;
      }
      .dd{
        flex:1;
      }
      .title{
        font-size: 15px;
        color: #333;
        line-height: 24px;
        font-weight: 600;
        font-family: "仿宋";
        margin-bottom: 4px;
      }
      .flex{
        @include flex;
      }
      .desc{
        font-size: 14px;
        color: #666;
        line-height: 24px;
        font-weight: 500;
      }
      .productions{
        font-size: 13px;
        color: #999;
        height: 24px;
        font-weight: 500;
        @include flex;
        flex: 1;
        justify-content: flex-end;
        >span{
          border-right: 1px solid #999;
          padding-right: 3px;
          margin-right: 3px;
          line-height: 1;
          &:last-child{
            border-right: 0;
            margin-right: 0;
            padding-right: 0;
          }
        }
      }
    }
    .other-list{
      @include flex;
      width: 100%;
      >li{
        width: px2rem(220px);
        border-radius: 12px;
        background-color: #fff;
        padding: 6px 4px;
        overflow: hidden;
        text-align: center;
      }
      .icon{
        width: px2rem(48px);
        height: px2rem(48px);
      }
      .desc{
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
        white-space: nowrap;
      }
    }
  }
  .address-tips {
    font-size: 12px;
    margin: 0;
    color: #666;
    .van-icon-location {
      display: inline-block;
      vertical-align: middle;
      color: #f75959;
      font-size: 18px;
      margin-top: -3px;
    }
  }
  .sec-hd{
    @include flex;
    padding: 0 15px;
    min-height: 40px;
    margin-top: 10px;
    margin-bottom: 10px;
    .lable-title {
      font-size: 18px;
      font-family: "Jcusong";
      font-weight: 600;
      color: rgba(68, 68, 68, 1);
      line-height: 24px;
      flex: 1;
    }
    .more-link {
      text-align: center;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      color: rgba(68, 68, 68, 1);
      line-height: 24px;
    }
  }
  .home-content-3 {
    .scroll-wrap {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
    }
    .success-list {
      .item {
        display: inline-block;
        vertical-align: top;
        width: 135px;
        min-height: 90px;
        margin-right: 10px;
        .img {
          display: block;
        }
        .success-title {
          display: block;
          font-size: 14px;
          font-family: "Source Han Sans CN";
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          margin-top: 10px;
          margin-bottom: 5px;
        }
        .address-tips,
        .money-tips {
          line-height: 22px;
        }
        .money-tips {
          margin: 0;
          font-size: 14px;
          i {
            color: #f75959;
            font-style: normal;
            font-weight: 500;
          }
        }
      }
    }
  }
  .home-content-4 {
    .service-box {
      position: relative;
      img {
        display: block;
        height: auto;
        box-shadow: 0px 5px 10px rgba(8, 1, 3, 0.2);
        border-radius: 2px;
      }
      .join-sp-btn {
        position: absolute;
        left: 6%;
        bottom: 26%;
        width: 100px;
        height: 32px;
        background: rgba(247, 89, 89, 1);
        border-radius: 32px;
        line-height: 30px;
        font-size: 14px;
        color: #fff;
        text-align: center;
        > * {
          display: inline-block;
          vertical-align: middle;
          font-size: 14px;
          margin-top: -3px;
        }
      }
    }
  }
  .home-content-5 {
    .scroll-box {
      max-height: 220px;
      overflow: hidden;
    }
    ul {
      li {
        overflow: hidden;
      }
    }
    .item-content {
      line-height: 24px;
      margin-bottom: 7px;
      h2 {
        margin: 0;
        font-size: 16px;
        font-family: "Source Han Sans CN";
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
      i {
        text-align: right;
        font-size: 14px;
        color: #f75959;
        font-style: normal;
      }
    }
  }
  .marquee_top {
    transition: all 0.5s;
    margin-top: -58px;
  }

  .home-content-7 {
    ul {
      li {
        min-height: 90px;
        margin-bottom: 20px;
      }
    }
    .news-list {
      .news-img {
        width: 100%;
        height: 90px;
        position: relative;
        overflow: hidden;
        img {
          display: block;
          max-width: 100%;
          height: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .news-title {
      font-size: 14px;
      font-family: "Source Han Sans CN";
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      margin-bottom: 10px;
    }
    .news-tips {
      font-size: 12px;
      font-family: "Source Han Sans CN";
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 18px;
    }
  }
  .buoy {
    position: fixed;
    bottom: 20%;
    right: 0;
    width: 76px;
    height: 34px;
    border-radius: 34px 0 0 34px;
    overflow: hidden;
    box-shadow: 0px 5px 10px rgba(8, 1, 3, 0.2);
    img {
      display: block;
      max-width: 100%;
      height: auto;
    }
  }
  .enter-dialog{
    width: 300px;
    border-radius: 10px;
    overflow: hidden;
    padding: 20px 10px;
    .title{
      font-size: 16px;
      color: #333;
      line-height: 24px;
      text-align: center;
      padding: 15px 0;
    }
    .btn-group{
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 10px;
      .btn-default{
        padding: 0 10px;
        height: 32px;
        border-radius: 32px;
        line-height: 30px;
        border: 1px solid #f75959;
        color: #f75959;
        font-size: 14px;
        background-color: #fff;
        &:active{
          background-color: #f75959;
          color: #fff;
        }
      }
    }
  }
  .tips-dialog{
    z-index: 999;
    width: 260px;
    border-radius: 10px;
    padding: 10px 0 15px;
    .title{
      font-size: 16px;
      color: #333;
      line-height: 32px;
      text-align: center;
    }
    .desc{
      font-size: 14px;
      color: #666;
      line-height: 24px;
      padding: 10px 20px;
    }
    .btn-group{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 10px;
    }
    .btn-primary{
      width: 100px;
      height: 30px;
      border-radius: 30px;
    }
    .btn-default{
      width: 100px;
      height: 30px;
      border-radius: 30px;
      background-color: #e5e5e5;
      color: #333;
    }
  }
}
</style>