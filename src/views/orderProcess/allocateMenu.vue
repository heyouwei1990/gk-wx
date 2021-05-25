<template>
  <div class="allocateMenu">
    <van-nav-bar
      title="分配工单"
      class="primary-header"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <ul class="menu-list">
      <li v-for="item in menuList" :key="item.MenuId" @click="$router.push({path:'/allocate',query:{menuId:item.MenuId,jobId}})">{{item.MenuName}}</li>
    </ul>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {
  GetInternalJobAssianMenu
} from '@/common/api.js'
export default {
  name:'AllocateMenu',
  data(){
    return{
      menuList:[],
      jobId:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  created() {
    this.jobId=this.$route.query.jobId;
    this.init();
  },
  methods: {
    init(){
      GetInternalJobAssianMenu({
        UserCode:this.userData.UserCode
      }).then(r=>{
        if(r.Result==1){
          this.menuList=r.Data.Lines;
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
.allocateMenu{
  padding-top: 46px;
  background-color: #fff;
  .menu-list{
    padding: 15px ;
    >li{
      width: 100%;
      height: 40px;
      border: 1px solid #e5e5e5;
      background-color: #fff;
      text-align: center;
      line-height: 38px;
      font-size: 14px;
      color: $primary;
      margin-bottom: 15px;
      &:active{
        background-color: $primary;
        border-color: $primary;
        color: #fff;
      }
    }
  }
}
</style>