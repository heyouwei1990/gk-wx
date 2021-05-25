<template>
  <div class="contractPage">
    <van-nav-bar
      title="签署合同"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <van-sticky :offset-top="46">
      <van-tabs v-model="tabId" @change="changeTab">
        <van-tab :name="item.id" v-for="(item,index) in tabbar" :key="index" :title="item.text"></van-tab>
      </van-tabs>
    </van-sticky>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadList"
      >
        <div class="item" v-for="(item,index) in list" :key="index"  @click="goSign(item)">
          <div class="name">{{item.ContractName}}</div>
          <div class="info">合同编号：{{item.ContractName}}</div>
          <div class="info">签约客户：{{item.ContractNum}}</div>
          <div class="info">合同期限：{{item.StartTime}}至{{item.EndTime}}</div>
          <div class="status" v-if="item.SigningProgress==1">{{item.ContractStatusName}}</div>
          <div class="btn-default"  v-if="item.SigningProgress==0">签约</div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import {GetUserContractList,ConvertPDF} from '@/common/api.js'
import { FormatTime } from "@/common/util.js";
import {mapState} from 'vuex'
export default {
  data(){
    return{
      tabbar:[{
        text:'已签约',
        id:1,
      },{
        text:'待签约',
        id:0
      }],
      tabId:1,
      finished:false,
      loading:true,
      list:[],
      pageNo:1,
      pageSize:10,
      refreshing:false,
      keyWord:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    }),
  },
  created(){
    this.changeTab();
  },
  methods: {
    // 切换
    changeTab(){
      this.pageNo=1;
      this.list=[];
      this.loadList();
    },
    //加载列表
    loadList(){
      if(!this.userData){
        return;
      }
      let params={
        signingProgress:this.tabId,
        pageNum:this.pageNo,
        pageSize:this.pageSize,
      }
      if(this.userData.LoginType==2){
        params['loginCompanyId']=this.userData.LoginId;
      }
      if(this.userData.LoginType==1){
        params['loginUserId']=this.userData.LoginId;
      }
      GetUserContractList(params).then(r=>{
        this.loading = false;
        if(r.Result==1){
          let list=r.Data.UserContractList || [];
          if (this.refreshing) {
            this.list = [];
            this.refreshing = false;
          }
          if(this.pageNo==1){
            this.list=list;
          }else{
            this.list=this.list.concat(list);
          }
          
          if(list.length<this.pageSize){
            this.finished=true;
          }else{
            this.pageNo++;
          }
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //下拉刷新
    onRefresh(){
      this.pageNo=1;
      this.finished = false;
      this.loading = true;
      this.loadList();
    },
    goSign(item){
      let _path=item.ContractFileUrl.replace('http://gk-manager.oss-cn-zhangjiakou.aliyuncs.com/', '');
      _path=_path.replace('http://oss.insupai.com/','')
      ConvertPDF({
        filePath:_path,
      }).then(r=>{
        if(r.Result==1){
          var path=encodeURIComponent(r.Data);
          this.$router.push({path:'contractPdf',query:{
            path:path,
            contractTemplateId:item.ContractTemplateId,
            contractId:item.Id,
            type:this.tabId==1?1:2,
          }});
        }else{
          this.$toast(r.Message);
        }
      })
      
    }
  },
}
</script>
<style lang="scss" >
@import '~@/style/_base.scss';
.contractPage{
  padding-top: 46px;
  .van-tabs__line{
    height: 1px;
    width: 60px !important;
  }
  .van-list{
    min-height: 80vh;
  }
  .item{
    @include bb;
    background-color: #fff;
    padding: 10px 15px;
    position: relative;
    &:after{
      padding: 0 15px;
      background-clip: content-box;
    }
    .name{
      font-size: 16px;
      color: #333;
      font-weight: bold;
      line-height: 24px;
      margin-bottom: 5px;
    }
    .info{
      font-size: 14px;
      color: #666;
      line-height: 24px;
    }
    .status{
      font-size: 14px;
      color: $primary;
      line-height: 24px;
      position: absolute;
      right: 15px;
      bottom: 10px;
    }
  }
  .btn-default{
    font-size: 14px;
    color: $primary;
    width: 50px;
    height: 24px;
    border-radius: 50px;
    border: 1px solid $primary;
    text-align: center;
    line-height: 22px;
    background-color: #fff;
    position: absolute;
    right: 15px;
    bottom: 10px;
    &:active{
      background-color: $primary;
      color: #fff;
    }
  }
}
</style>