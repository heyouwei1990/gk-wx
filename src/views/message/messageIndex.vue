<template>
  <div class="messageIndex">
    <van-nav-bar
      title="我的消息"
      class="primary-header"
      fixed
      :border="false"
    />
    <div class="item-dl contact" @click="toSingleList">
      <img class="avatar" src="@/assets/home/person-avatar.png" alt="">
      <div class="item-dd">
        <div class="flex">
          <span class="name">限时私聊</span>
        </div>
      </div>
    </div>
    <ul class="chat-list">
      <li class="item" v-for="item in hxChatList" :key="item.groupid" @click="toChat(item)">
        <div class="item-dl">
          <img class="avatar" src="@/assets/home/person-avatar.png" alt="">
          <div class="item-dd">
            <div class="flex">
              <span class="name">{{resetName(item.groupname)}}</span>
              <time class="time">{{item.msgTime}}</time>
            </div>
            <div class="flex">
              <p class="desc">{{item.lastMsg}}</p>
              <span class="unread" v-if="item.unReadNum">{{item.unReadNum}}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="no-data" v-if="hxChatList.length==0">暂无消息</div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {GetUserSingleChats} from '@/common/api.js'
export default {
  data(){
    return{
      finished:false,
      loading:true,
      pageNo:1,
      pageSize:10,
      refreshing:false,
      hxChatList:[],
    }
  },
  computed: {
    ...mapGetters({
      group:'onGetGroupUserList',
    }),
    hxIsLogin() {
      return this.$store.state.hxIsLogin;
    },
    chatList() {
      return this.$store.state.chat.msgList;
    },
  },
  watch: {
    hxIsLogin:{
      handler(value){
        if(value && this.group.length==0){
          this.$store.dispatch('onGetGroupUserList');
        }
      },
      immediate:true,
    },
    chatList:{
      handler(value){
        if(value){
          this.getHxChatList();
        }
      },
    },
  },
  mounted() {
    if(this.hxIsLogin){
      this.$store.dispatch('onGetGroupUserList');
    }
  },
  methods: {
    //去聊天页面
    toChat(item){
      this.$router.push({path:'/chat',query:{type:'group',chatId:item.groupid,nickname:item.groupname}})
    },
    //格式化群名称
    resetName(value){
      let str='';
      if(value){
        let arr=value.split('-');
        arr.splice(0,1);
        str=arr.join('-');
      }
      return str;
    },
    getHxChatList(){
      let arr=[];
      for (let i = 0; i < this.group.length; i++) {
        let lastMsg=this.getLastMsg(this.group[i]);
        let obj={
          ...this.group[i],
          ...lastMsg,
        }
        obj['unReadNum']=this.getUnreadNum(this.group[i]);
        arr.push(obj);
      }
      arr.sort((a,b)=>{
        return b.timeStamp-a.timeStamp;
      });
      this.hxChatList=arr;
      this.$forceUpdate();
    },
    getUnreadNum(item) {
      const chatList = this.chatList.group;
      let userId = item.groupid;
      const currentMsgs = chatList[userId] || [];
      let unReadNum = 0;
      currentMsgs.forEach(msg => {
        if (msg.status !== "read" && msg.status !== "recall" && !msg.bySelf) {
          unReadNum++;
        }
      });
      return unReadNum;
    },
    getLastMsg(item) {
      const chatList = this.chatList.group;
      let userId = item.groupid;
      const currentMsgs = chatList[userId] || [];
      let lastMsg = "";
      let lastType =currentMsgs.length && currentMsgs[currentMsgs.length - 1].type;
      if (currentMsgs.length) {
        if (lastType === "img") {
          lastMsg = "[image]";
        } else if (lastType === "file") {
          lastMsg = currentMsgs[currentMsgs.length - 1].filename;
        } else if (lastType === "audio") {
          lastMsg = "[audio]";
        } else if (lastType === "vidio") {
          lastMsg = "[vidio]";
        } else {
          lastMsg = currentMsgs[currentMsgs.length - 1].msg;
        }
      }
      let timeStamp=0;
      if(currentMsgs.length){
        timeStamp=currentMsgs[currentMsgs.length - 1].time || new Date().getTime();
      }
      let msgTime = currentMsgs.length? this.renderTime(currentMsgs[currentMsgs.length - 1].time): "";
      return {
        lastMsg,
        msgTime,
        timeStamp
      };
    },
    renderTime(time) {
      let nowStr = new Date();
      let localStr = time ? new Date(time) : nowStr;
      let localMoment ='';
      if(this.$formatTime(localStr,'yyy-MM-dd')==this.$formatTime(nowStr,'yyy-MM-dd')){
        localMoment = this.$formatTime(localStr,'hh:mm');
      }else{
        localMoment = this.$formatTime(localStr,'MM/dd hh:mm');
      }
      return localMoment;
    },
    toSingleList(){
      // let userCode=this.$store.state.userData.UserCode;
      // GetUserSingleChats({
      //   PageSize:999,
      //   PageNo:1,
      //   UserCode:userCode
      // }).then(r=>{
      //   if(r.Result==1){
      //     this.$store.commit('setSingleChatList',r.Data.Lines);
      //   }
      // })
      this.$router.push('/contactList');
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.messageIndex{
  padding-top: 46px;
  min-height: 100vh;
  box-sizing: border-box;
  .item-dl{
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background-color: #fff;
    .avatar{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .item-dd{
      flex: 1;
      width: 100px;
    }
  }
  .contact{
    @include bb;
    .name{
      font-size: 16px;
      color: #333;
    }
  }
  .chat-list{
    .item{
      @include bb;
    }
    .flex{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .name{
      font-size: 14px;
      color:#333;
      line-height: 24px;
      flex: 1;
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .time{
      font-size: 12px;
      line-height: 24px;
      color: #999;
      margin-left: 10px;
    }
    .desc{
      font-size: 14px;
      color:#999;
      line-height: 24px;
      height: 24px;
      flex: 1;
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .unread{
      font-size: 10px;
      color: #fff;
      line-height: 18px;
      width: 18px;
      height: 18px;
      border-radius: 18px;
      background-color: #ff3838;
      text-align: center;
    }
  }
}
</style>