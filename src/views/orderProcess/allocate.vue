<template>
  <div class="allocate">
    <van-nav-bar
      title="分配工单"
      class="primary-header"
      left-arrow
      fixed
      right-text="确认"
      :border="false"
      @click-left="$router.go(-1)"
      @click-right="confirm"
    />
    <!-- 工程师 -->
    <div v-if="menuId==1">
      <ul class="menu-list">
        <li v-for="(item,index) in menuList" :key="item.UserCode" :class="{'on':item.checked}" @click="choose(index)">
          {{item.UserName}}&emsp;{{item.Phone}}
        </li>
      </ul>
      <span class="empty" v-if="menuList.length==0">没有所属工程师</span>
    </div>
    <!-- 子公司 -->
    <div v-if="menuId==2">
      <ul class="menu-list" >
        <li v-for="(item,index) in menuList" :key="item.UserCode" :class="{'on':item.checked}" @click="choose(index)">
          {{item.UserName}}
        </li>
      </ul>
      <span class="empty" v-if="menuList.length==0">没有子公司</span>
    </div>
    <!-- 兄弟公司 -->
    <div v-if="menuId==3">
      <ul class="menu-list">
        <li v-for="(item,index) in menuList" :key="item.UserCode" :class="{'on':item.checked}" @click="choose(index)">
          {{item.UserName}}
        </li>
      </ul>
      <span class="empty" v-if="menuList.length==0">没有兄弟公司</span>
    </div>
    <!-- 总公司 -->
    <div v-if="menuId==4">
      <ul class="menu-list">
        <li v-for="(item,index) in menuList" :key="item.UserCode" :class="{'on':item.checked}" @click="choose(index)">
          {{item.UserName}}
        </li>
      </ul>
      <span class="empty" v-if="menuList.length==0">没有总公司</span>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {
  GetInternalJobAssianUsersSelect,
  ConfirmInternalJobAssign
} from '@/common/api.js'
export default {
  name:'Allocate',
  data(){
    return{
      menuList:[],
      menuId:'',
      jobId:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  created() {
    this.menuId=Number(this.$route.query.menuId);
    this.jobId=Number(this.$route.query.jobId);
    this.init();
  },
  methods: {
    init(){
      GetInternalJobAssianUsersSelect({
        UserCode:this.userData.UserCode,
        MenuId:this.menuId
      }).then(r=>{
        if(r.Result==1){
          var list=r.Data.Lines||[];
          for (let i = 0; i < list.length; i++) {
            list[i]['checked']=false;
          }
          this.menuList=list;
        }else{
          this.$toast(r.Message);
        }
      })
    },
    //选择
    choose(index){
      for (let i = 0; i < this.menuList.length; i++) {
        if(this.menuId===1){
          if(index==i){
            this.menuList[i].checked=!this.menuList[i].checked;
          }
        }else{
          this.menuList[i].checked=false;
          if(index==i){
            this.menuList[i].checked=!this.menuList[i].checked;
          }
        }
      }
    },
    //确认分配
    confirm(){
      let str="";
      let target=[];
      this.menuList.forEach((item,i)=>{
        if(this.menuId!==1 && item.checked){
          str=item.UserName;
          target.push(item.UserCode);
        }
        if(this.menuId===1 && item.checked){
          target.push(item.UserCode);
          if(i==0){
            str+=item.UserName;
          }else{
            str+='、'+item.UserName;
          }
        }
        
      })
      if(str==''){
        this.$toast('请选择分配工程师或公司');
        return;
      }
      this.$dialog.confirm({
        message:'是否将工单分配给'+str+'？',
      }).then(r=>{
        ConfirmInternalJobAssign({
          UserCode:this.userData.UserCode,
          AssignUsers:target,
          JobId:this.jobId,
        }).then(r=>{
          if(r.Result==1){
            this.$router.go(-2);
          }else{
            this.$toast(r.Message);
          }
        })
      })
      
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.allocate{
  padding-top: 46px;
  background-color: #fff;
  .menu-list{
    padding: 15px ;
    >li{
      width: 100%;
      height: 40px;
      border: 1px solid #f8f8f8;
      background-color: #f8f8f8;
      text-align: center;
      line-height: 38px;
      font-size: 14px;
      color: #333;
      margin-bottom: 15px;
      &.on{
        border-color: $primary;
      }
    }
  }
  .empty{
    display: block;
    padding: 10px 15px;
    text-align: center;
    font-size: 14px;
    color: #999;
    line-height: 20px;
    background-color: #fff;
  }
}
</style>