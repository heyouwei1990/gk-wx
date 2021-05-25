<template>
  <div class="accountManage">
    <van-nav-bar
      title="收款账号"
      left-arrow
      fixed
      right-text="添加"
      @click-left="$router.go(-1)"
      @click-right="$router.push('/addAccount')"
    />
    <ul class="card-list" v-if="accountType==2">
      <li v-for="item in cardList" :key="item.ID">
        <van-swipe-cell>
          <div class="card-dl" @click="setDefault(item)">
            <i class="card-dt"></i>
            <div class="card-dd">
              <div class="card-name">{{item.BankName}} <span class="mark">{{item.AccountProperty==1?'借记卡':'信用卡'}}</span></div>
              <div class="card-no">{{item.DisplayAccount}}</div>
              <div class="btn-text">{{item.IsDefault?'默认账号':'设为默认'}}</div>
            </div>
          </div>
          <template #right>
            <van-button square icon="delete" type="danger" class="delete-button" @click="removeCard(item.ID)" />
          </template>
        </van-swipe-cell>
      </li>
    </ul>
    <ul class="account-list" v-if="accountType==1">
      <li v-for="item in cardList" :key="item.ID">
        <van-swipe-cell>
          <div class="account-dl">
            <div class="account-dt" :style="{'background-image':'url('+item.BankImage+')'}"></div>
            <div class="account-dd">账号：{{item.DisplayAccount}}</div>
            <span class="mark" v-if="item.IsDefault">默认</span>
          </div>
          <template #right>
            <van-button square text="设为默认" type="primary" class="delete-button" @click="setDefault(item)" />
            <van-button square text="删除" type="danger" class="delete-button" @click="removeCard(item.ID)" />
          </template>
        </van-swipe-cell>
      </li>
    </ul>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {GetMyCollectionAccount,DeleteCollectionAccount,SetDefaultCollectionAccount} from '@/common/api.js'
export default {
  name:'AccountManage',
  data(){
    return{
      cardList:[],
      userInfo:'',
      accountType:1,//1:个人，2:企业
      type:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  mounted() {
    if(this.userData && this.userData.UserCode){
      if(this.userData.UserCode.indexOf('e')===0){
        this.userInfo=this.userData.CompanyId+'_2';
        this.accountType=2;
      }else{
        this.userInfo=this.userData.UserId+'_1'
        this.accountType=1;
      }
    }
    this.type=this.$route.query.type;
    this.loadList();
  },
  methods: {
    //获取列表
    loadList(){
      let params={
        userInfo:this.userInfo,
      }
      if(this.accountType==1){
        params['ShowTypes']=[1,2];
      }else{
        params['ShowTypes']=[2];
      }
      GetMyCollectionAccount(params).then(r=>{
        if(r.Result==1){
          this.cardList=r.Data;
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //设置默认账号
    setDefault(item){
      //如果是提现页面进入本页，则点击选中
      if(this.type==1){
        this.$store.commit('setBankAccount',item);
        this.$router.go(-1);
        return;
      }
      let params={
        id:item.ID,
        userInfo:this.userInfo
      }
      SetDefaultCollectionAccount(params).then(r=>{
        if(r.Result==1){
          this.loadList();
        }
        this.$toast(r.Message);
      })
    },
    //删除账号
    removeCard(id){
      let params={
        id:id,
        userInfo:this.userInfo
      }
      this.$dialog.confirm({
        message: '确定删除吗？',
      }).then(() => {
        DeleteCollectionAccount(params).then(r=>{
          if(r.Result==1){
            this.loadList();
          }
          this.$toast(r.Message);
        })
      });
      
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.accountManage{
  padding-top: 46px;
  background-color: #fff;
  min-height: 100vh;
  .card-list{
    padding: 20px 0;
    li{
      margin-bottom: 10px;
      overflow: hidden;
    }
  }
  .card-dl{
    margin: 0 15px;
    background: linear-gradient(to right, #e85c65,#e9507f);
    border-radius:8px;
    height: 100px;
    display: flex;
    align-items: center;
    padding: 10px 10px 10px 30px;
    position: relative;
  }
  .card-dt{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    @include bg('~@/assets/center/icon-card.png',70%);
    background-color: rgba(255,255,255,0.8);
  }
  .card-name{
    font-size: 16px;
    color: #fff;
    line-height: 24px;
    .mark{
      font-size: 12px;
      color: #e5e5e5;
      padding-left: 10px;
    }
  }
  .card-no{
    font-size: 18px;
    color: #fff;
    line-height: 30px;
    margin-top: 10px;
  }
  .btn-text{
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #fff;
    line-height: 24px;
  }
  .delete-button{
    height: 100%;
  }
  .account-list{
    >li{
      @include bb;
    }
    .account-dl{
      @include flex;
      padding: 10px 15px;
      background-color: #fff;
    }
    .account-dt{
      width: 80px;
      height: 40px;
      margin-right: 10px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }
    .account-dd{
      flex: 1;
      min-width: 10px;
      font-size: 13px;
      color: #999;
      line-height: 24px;
    }
    .mark{
      background-color: $primary;
      font-size: 10px;
      color: #fff;
      height: 16px;
      line-height: 16px;
      border-radius: 2px;
      width: 40px;
      text-align: center;
    }
  }
}
</style>