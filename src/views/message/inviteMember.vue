<template>
  <div class="inviteMember">
    <div class="title">{{inviter}}邀请您加入群聊</div>
    <div class="group-name">{{groupName}}</div>
    <div class="number">（共{{memberNum}}人）</div>
    <div class="btn-primary" @click="join">加入群聊</div>
  </div>
</template>
<script>
import { getQueryString } from '@/common/util.js'
import {mapState} from 'vuex'
import {AddGroupMember} from '@/common/api.js'
export default {
  data(){
    return{
      groupId:'',
      groupName:'',
      memberNum:0,
      inviter:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData
    })
  },
  created() {
    this.groupId=getQueryString('groupId');
    this.groupName=decodeURIComponent(getQueryString('groupName'));
    this.memberNum=getQueryString('members');
    this.inviter=decodeURIComponent(getQueryString('inviter'));
    // this.onGetGroupinfo({select_groupid:this.groupId});
  },
  methods: {
    join(){
      let st=getQueryString('time')
      let time=Number(st.substr(0,10));
      let now=Math.round(new Date().getTime()/1000);
      if(now>time+24*60*60){
        this.$toast('链接已失效！');
        return;
      }
      if(this.userData && this.userData.LoginType==2){
        this.$store.commit('setUserData',null);
        this.$store.commit('setPermission',null);
        this.$store.commit('setHxLoginId','');
        this.$store.commit('setHxLoginStatus',false);
        this.$router.push({path:'/login/personLogin',query:{type:2}});
        return;
      }
      if(!this.userData){
        this.$router.push({path:'/login/personLogin',query:{type:2}});
        return;
      }
      AddGroupMember({
        UserCode:this.userData.UserCode,
        GroupId:this.groupId
      }).then(r=>{
        if(r.Result==1){
          this.$toast('加入成功');
        }else{
          this.$toast(r.Message);
        }
        this.$router.push({path:'/messageIndex'});
      })
      let userId='sp-'+this.userData.UserCode;
      this.$store.dispatch('onInviteGroup',{
        select_groupid:this.groupId,
        users:[userId]
      })
    }
  },
}
</script>
<style lang="scss">
.inviteMember{
  padding: 40px 15px 0;
  text-align: center;
  background-color: #fff;
  height: 100vh;
  .title{
    font-size: 16px;
    color: #333;
    line-height: 2;
  }
  .group-name{
    font-size: 18px;
    color: #333;
    line-height: 2;
  }
  .number{
    font-size: 14px;
    color: #666;
    line-height: 2;
  }
  .btn-primary{
    width: 160px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin: 40px auto;
    border-radius: 4px;
    font-size: 14px;
  }
}
</style>