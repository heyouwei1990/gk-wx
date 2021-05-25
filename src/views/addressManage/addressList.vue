<template>
  <div class="addressList">
    <van-nav-bar
      title="基本信息"
      left-arrow
      fixed
      right-text="新增"
      @click-left="$router.go(-1)"
      @click-right="edit()"
    />
    <ul class="address-list">
      <li v-for="(item,index) in addressList" :key="index" @click="pickAddress(item)">
        <div class="flex">
          <span class="name">{{item.ContactsName}}</span>
          <span class="phone">{{item.ContactsPhone}}</span>
          <i class="van-icon van-icon-edit" @click.stop="edit(item)"></i>
        </div>
        <div class="detail">{{item.FullAddress}}{{item.Address}}</div>
      </li>
      <li class="no-data" v-if="addressList.length==0">快去添加地址吧</li>
    </ul>
  </div>
</template>
<script>
import {
  GetJobAddressList
} from "@/common/api.js";
import {mapState} from 'vuex'
export default {
  data(){
    return{
      addressList:[],
    }
  },
  computed:{
    ...mapState({
      userData:state=>state.userData,
    })
  },
  created() {
    this.$store.commit('setPickedAddress',null);
    this.getAddressList();
  },
  methods: {
    //
    edit(data){
      if(data){
        this.$router.push({name:'AddressEdit',params:data});
      }else{
        this.$router.push({name:'AddressEdit'});
      }
    },
    //选择地址
    pickAddress(item){
      this.$store.commit('setPickedAddress',item);
      this.$router.go(-1);
    },
    //常用地址列表；
    getAddressList(){
      let params={};
      if(this.userData && this.userData.UserId){
        params['userID']=this.userData.UserId;
      }else if(this.userData && this.userData.CompanyId){
        params['companyID']=this.userData.CompanyId;
      }else{
        return;
      }
      GetJobAddressList(params).then(r=>{
        if(r.Result==1){
          this.addressList=r.Data || [];
        }else{
          this.$toast(r.Message);
        }
        
      })
    },
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.addressList{
  padding-top: 46px;
  background-color: #fff;
  min-height: 100vh;
  .address-list{
    // width: 90vw;
    >li{
      padding: 10px 15px;
      background-color: #fff;
      border-bottom: 1px solid #d5d5d5;
    }
    .flex{
      display: flex;
      margin-bottom: 5px;
    }
    .name{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      font-weight: 500;
      min-width: 60px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .phone{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      margin-left: 20px;
      flex:1;
    }
    .van-icon-edit{
      font-size: 18px;
      color: #666;
    }
    .detail{
      font-size: 14px;
      color: #999;
      line-height: 1.5;
      word-break: break-all;
    }
  }
}
</style>