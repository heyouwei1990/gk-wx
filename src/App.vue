<template>
  <div id="app" :class="{'has-navbar':$route.meta.navBar}">
    <!-- <keep-alive :include="keepAlive.join(',')" >
      <router-view></router-view>
    </keep-alive> -->
    <keep-alive >
      <router-view  v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view  v-if="!$route.meta.keepAlive"></router-view>
    <!-- //好友请求 -->
    <get-friend-request></get-friend-request>
    <!-- 视频弹框 -->
    <emedia-dialog ref="emedia" @changeIsVideoState="changeIsVideoState"></emedia-dialog>
    <multi-a-v></multi-a-v>
    <add-a-v-member ref="addAvMember" ></add-a-v-member>
    <van-tabbar v-model="navIndex" v-if="$route.meta.navBar">
      <van-tabbar-item v-for="(item,index) in tabbar" :key="index" :to="item.path">
        <span>{{item.title}}</span>
        <template #icon="props">
          <img :src="props.active ? item.active : item.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
    <van-dialog 
      v-model="isShowAddDesposit" 
      class="desposit-dialog" 
      title="请输入押金" 
      :before-close="confirmDesposit" 
      show-cancel-button
      close-on-click-overlay>
      <div class="form">
        <input class="input" type="number" v-model="despositAdd" placeholder="请输入金额">
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { TraceAddAccountTraceLog,CreatePayOrder } from "@/common/api.js";
import valid from '@/common/validate.js'
import { mapState } from "vuex";
import GetFriendRequest from '@/components/chat/friend/getFriendRequest.vue'
import AddAVMember from '@/components/chat/media/addAVMember.vue'
import EmediaDialog from '@/components/chat/media/index.vue'
import MultiAV from '@/components/chat/media/multiAV.vue'
export default {
  name: "app",
  components:{
    GetFriendRequest,
    AddAVMember,
    EmediaDialog,
    MultiAV
  },
  data(){
    return{
      navIndex:0,
      isLogin:false,
      tabbar:[
        {
          title:'首页',
          active: require('./assets/navbar/icon_home_active.png'),
          inactive: require('./assets/navbar/icon_home.png'),
          path:'/',
        },{
          title:'工单',
          active: require('./assets/navbar/icon_list_active.png'),
          inactive: require('./assets/navbar/icon_list.png'),
          path:'/myOrders',
        },{
          title:'消息',
          active: require('./assets/navbar/icon_msg_active.png'),
          inactive: require('./assets/navbar/icon_msg.png'),
          path:'/messageIndex',
        },{
          title:'我的',
          active: require('./assets/navbar/icon_user_active.png'),
          inactive: require('./assets/navbar/icon_user.png'),
          path:'/userCenter',
        },
      ],
      showAddDesposit:false,//显示追加押金弹框
      despositAdd:'',//追加金额
    }
  },
  computed: {
    ...mapState({
      userData: (state) => state.userData,
      isShowAddDesposit: (state) => state.isShowAddDesposit,
      jobId: (state) => state.jobId,
    }),
    keepAlive(){
      return this.$store.getters.keepAlive;
    },
  },
  watch: {
    userData:{
      handler(value) {
        if (value && value.UserCode) {
          if (value.UserCode.indexOf("e") === 0) {
            this.visit(0, value.CompanyId);
          } else {
            this.visit(value.UserId, 0);
          }
        }
      },
      immediate:true,
    },
    '$route'(to,from) {
      //根据路由判断标签栏的激活状态
      if(to){
        this.setIndex(to.path);
      }
    },
    isShowAddDesposit(value){
      //弹框变化，清空输入框
      if(value){
        this.despositAdd='';
      }
    }
  },
  mounted() {
    this.$store.dispatch('loadAccountData');
    this.$store.dispatch('loadPermission');
    this.setIndex(this.$route.path);
  },
  methods: {
    visit(userId = 0, companyId = 0) {
      TraceAddAccountTraceLog({
        AppId: 100701,
        UserId: userId,
        CompanyId: companyId,
      }).then((r) => {
        //console.log(r)
      });
    },
    //导航栏设置
    setIndex(data){
      let path=data || '';
      switch (path) {
        case '/myOrders':
          this.navIndex=1;
          break;
        case '/messageIndex':
          this.navIndex=2;
          break;
        case '/userCenter':
          this.navIndex=3;
          break;
        default:
          this.navIndex=0;
          break;
      }
    },
    changeIsVideoState(v) {
      // console.log(v);
      // v ? (this.nowIsVideo = true) : (this.nowIsVideo = false);
    },
    //提交追加押金金额
    confirmDesposit(action,done){
      if(action==='confirm'){
        var that=this;
        if(!valid.positiveInt(this.despositAdd)){
            this.$toast('请输入正整数！');
            done(false);
            return;
        }
        CreatePayOrder({
          Amount:this.despositAdd,
          OuterOrderType:1,
          OuterOrderId:this.jobId,
          TradeType:3,
        }).then(r=>{
          done();
          if(r.Result==1){
            this.$router.push({path:'/payDeposit',query:{jobId:this.jobId,payId:r.Data.PayId,from:2}});
            this.$store.commit('triggerDespositDialog',false);
            this.$store.commit('setJobId',0);
          }else{
            this.$toast(r.Message);
          }
        })
      }else{
        done();
        // this.showAddDesposit=false;
        this.$store.commit('triggerDespositDialog',false);
        this.$store.commit('setJobId',0);
      }
    },
  },
};
</script>

<style lang="scss">
@import '~@/style/common.scss';
.has-navbar{
  padding-bottom: 50px;
}
#app {
  .van-tabbar-item__icon img{
    height: 25px;
    widows: 25px;
  }
  .van-tabbar-item__text{
    font-size: 10px;
  }
  .van-tabbar-item--active{
    color: #DE2B2C;
  }
  .van-hairline--top-bottom{
    z-index: 9;
  }
  .desposit-dialog{
    .form{
      padding: 30px 20px;
    }
    .input{
      width: 100%;
      height: 40px;
      line-height: 20px;
      padding: 10px;
      border: 1px solid #e5e5e5;
      font-size: 16px;
      color: #333;
    }
  }
}

</style>
