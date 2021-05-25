<template>
  <div class="chatPage">
    <van-nav-bar
      :title="chatName"
      left-arrow
      class="primary-header"
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    >
      <template #right>
        <van-icon name="friends-o" size="18" @click="lookMembers" v-show="$route.query.type=='group'" />
      </template>
    </van-nav-bar>
    <div class="message-wrapper">
      <div class="message-content" ref="msgContent">
        <van-pull-refresh v-model="isLoading" @refresh="loadMoreMsgs">
          <ul class="message-list">
            <li :class="['message-item',{'self':item.bySelf}]" v-for="(item,i) in msgList" :key="i">
              <div class="owner-dl" v-show="item.status !== 'recall'">
                <div class="owner-dt">
                  <img class="avatar" v-if="item.PhotoUrl" :src="item.PhotoUrl" alt="">
                  <img class="avatar" v-else-if="!item.PhotoUrl && item.bySelf" :src="userData.HeadImg" alt="">
                  <img class="avatar" v-else src="@/assets/home/person-avatar.png" alt="">
                </div>
                <div class="owner-dd">
                  <span class="nickname">{{item.DisplayName || item.from}}</span>
                  <div v-if="item.status !== 'recall'" class="time-style">{{renderTime(item.time)}}</div>
                </div>
              </div>
              
              <!-- 撤回消息 -->
              <div v-if="item.status == 'recall'" class="recall-msg">{{item.msg}}</div>
              <div v-if="item.status == 'recall'" class="recall-msg">{{renderTime(item.time)}}</div>
              <!-- 撤回消息 end -->
              <div class="message-box" v-if="item.type === 'img'">
                <img
                  :key="item.msg"
                  :src="item.msg?item.msg:''"
                  class="img-style"
                  @click="preview(item.msg)"
                />
              </div>
              <!-- 文件card -->
              <div class="message-box" v-else-if="item.type==='file'">
                <a class="file-style" :href="item.msg" :download="item.filename">
                  <h3 class="file-hd">文件</h3>
                  <div class="file-name">{{item.filename}}</div>
                  <div class="flex">
                    <span class="size">{{readablizeBytes(item.file_length)}}</span>
                    <span class="btn-text">下载</span>
                  </div>
                </a>
              </div>
              <!-- 音频消息 -->
              <div class="message-box" v-else-if="item.type==='audio'">
                <audio :src="item.msg" controls></audio>
              </div>
              <!-- 视频消息 -->
              <div class="message-box" v-else-if="item.type==='video'">
                <video :src="item.msg" width="100%" controls></video>
              </div>
              <!-- 投标消息 -->
              <div class="tender-box" v-else-if="item.ext && item.ext.chat_sp_type==10001">
                <h3 class="title">我的投标方案</h3>
                <div class="item">
                  <div class="label">解决方案</div>
                  <div class="desc">{{JSON.parse(item.msg).solution}}</div>
                </div>
                <div class="item">
                  <div class="label">服务报价</div>
                  <div class="price">￥{{JSON.parse(item.msg).price | formatPrice}}</div>
                </div>
                <div class="item">
                  <div class="flex1"></div>
                  <span class="more" v-if="!item.bySelf" @click="tenderDetail(item)">更多>></span>
                </div>
              </div>
              <!-- 聊天消息 -->
              <div class="message-box" v-else>
                <p
                  v-html="renderTxt(item.msg)"
                  v-if="item.status != 'recall'"
                  :class="['text-msg',{ 'byself': item.bySelf}]"
                />
              </div>
            </li>
          </ul>
        </van-pull-refresh>
      </div>
      <div class="message-footer van-hairline--top" v-if="disabledChat">
        <div class="tool-bar">
          <van-icon name="smile-o" @click="showEmoji=true" />
          <upload-image :type="$route.query.type" :chatId="$route.query.chatId"></upload-image>
          <upload-file :type="$route.query.type" :chatId="$route.query.chatId"></upload-file>
          <!-- <recorder v-show="isHttps"></recorder> -->
          <van-icon 
            name="phone-o" 
            @click="callVoice"
            v-show=" isHttps && $route.query.type == 'contact'"
          />
          <van-icon
            @click="callVideo"
            name="video-o"
          ></van-icon>
            <!-- v-show="isHttps" -->
        </div>
        <div class="input-box">
          <textarea 
            class="textarea" 
            v-model="message" 
            @keydown.enter="onSendTextMsg" 
            placeholder="请输入"
            ref="txtDom"
          ></textarea>
          <button class="btn-send" @click="onSendTextMsg">发送</button>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="showEmoji">
      <div class="emoji-wrapper">
        <img
          v-for="(v,i) in emojiList"
          :src="require(`@/assets/faces/${v}`)"
          :key="i"
          @click="selectEmoji(i)"
          class="emoji"
        />
      </div>
    </van-action-sheet>
    <video-setting ref="videoSetting"></video-setting>
  </div>
</template>
<script>

// import Draggable from "@/components/chat/draggable";
import {mapState,mapGetters,mapActions} from 'vuex'
import UploadImage from '@/components/chat/uploadImage.vue'
import UploadFile from '@/components/chat/uploadFile.vue'
// import Recorder from '@/components/chat/recorder/recorder.vue'
import VideoSetting from '@/components/chat/videoSetting.vue'
import Bus from '@/common/bus.js'
import {IsRedirectBpoApplyOrder} from '@/common/api.js'
import { ImagePreview } from 'vant';
export default {
  name:'Chat',
  components:{
    UploadImage,
    UploadFile,
    // Recorder,
    VideoSetting,
    // Draggable,
  },
  data(){
    return{
      message: "",
      isHttps: window.location.protocol === "https:",
      status: {
        sending: "发送中",
        sent: "已发送",
        read: "已读"
      },
      nowIsVideo: false,
      isLoading:false,
      emojiList: this.$IM.Emoji.map,
      showEmoji: false,
      currentEmoji: "",
      target:{
        groupid:'',
        groupname:''
      }
    }
  },
  computed: {
    ...mapGetters({
      msgList: "onGetCurrentChatObjMsg",
      contactList:'onGetContactUserList',
    }),
    ...mapState(['hxIsLogin','userData']),
    chatName(){
      if(this.$route.query.type=='group'){
        let str=this.$route.query.nickname || this.$store.state.group.groupInfo.name;
        let arr=str.split('-');
        arr.splice(0,1);
        let name=arr.join('-');
        return name;
      }else{
        return this.$route.query.nickname;
      }
    },
    disabledChat(){
      let flag=true;
      for (let i = 0; i < this.contactList.length; i++) {
        const element = this.contactList[i];
        if(this.$route.query.type=='contact' && this.$route.query.chatId==this.contactList[i].name){
          flag=this.contactList[i].IsAvailable;
        }
      }
      return flag;
    },
    members(){
      return this.$store.state.group.groupInfo.members ||[];
    }
  },
  watch: {
    chatName(value){
      if(this.$route.query.type=='group' && value){
        this.target.groupname=this.$store.state.group.groupInfo.name;
        this.target.groupid=this.$store.state.group.groupInfo.gid;
      }
    },
    msgList(value){
      if(value){
        if(!this.isLoading){
          this.scrollBottom();
        }
        this.isLoading=false;
      }
    },
    hxIsLogin:{
      handler(value){
        if(value){
          if(this.$route.query.type=='group'){
            this.onGetGroupinfo({
              select_groupid:this.$route.query.chatId,
            })
          }
        }
      },
      immediate:true,
    },
    members:{
      handler(value){
        if(value.length){
          let list=this.msgList || [];
          for (let i = 0; i < list.length; i++) {
            this.$store.commit('updateMsgList',list[i]);
          }
        }
      },
      deep:true,
    },
    contactList:{
      handler(value){
        if(value.length && this.$route.query.nickname){
          this.getCurrentMsg();
          this.loadMoreMsgs();
        }
      },
      deep:true
    },
  },
  mounted() {
    this.scrollBottom();
    this.getCurrentMsg();
    this.loadMoreMsgs();
  },
  methods: {
    ...mapActions([
      "onGetContactUserList",
      "onGetGroupUserList",
      "onGetChatroomUserList",
      "onGetCurrentChatObjMsg",
      "onSendText",
      "onCallVideo",
      "onCallVoice",
      "getGroupMembers",
      "getHistoryMessage",
      "onAddBlack",
      "onDelteFirend",
      "onGetGroupinfo",
      "recallMessage",
      "onGetGroupBlack",
    ]),
    // 查看群成员
    lookMembers(){
      this.$router.push({path:'/groupMember',query:{groupId:this.$route.query.chatId}})
    },
    //查看当前聊天对getCurrentMsg象消息
    getCurrentMsg() {
      this.onGetCurrentChatObjMsg({
        type: this.$route.query.type,
        id: this.$route.query.chatId
      });
    },
    //获取历史消息
    loadMoreMsgs() {
      this.getHistoryMessage({
        name:this.$route.query.chatId,
        isGroup:this.$route.query.type=='group',
      });
      setTimeout(() => {
        this.isLoading=false;
      }, 2000);
    },
    //发送文字消息
    onSendTextMsg() {
      if (this.message == "" || this.message == "\n") {
        this.message = "";
        return;
      }
      this.onSendText({
        chatType: this.$route.query.type,
        chatId: this.$route.query.chatId,
        message: this.message
      });
      this.message = "";
    },
    //选中emoji
    selectEmoji(v) {
      this.message+=v;
      this.showEmoji=false;
      this.$refs.txtDom.focus();
    },
    //渲染表情图片
    customEmoji(value) {
      var str='';
      Object.keys(this.$IM.Emoji.map).map((item,index)=>{
        if(item==value){
          let url=this.$IM.Emoji.imgs[index].path;
          str=`<img src="${url}" style="width:20px"/>`
        }
      })
      return str;
    },
    //渲染消息文字和表情图片
    renderTxt(txt = "") {
      let rnTxt = [];
      let match = null;
      const regex = /(\[.*?\])/g;
      let start = 0;
      let index = 0;
      while ((match = regex.exec(txt))) {
        index = match.index;
        if (index > start) {
          rnTxt.push(txt.substring(start, index));
        }
        if (match[1] in this.$IM.Emoji.map) {
          rnTxt.push(this.customEmoji(match[1]));
        } else {
          rnTxt.push(match[1]);
        }
        start = index + match[1].length;
      }
      rnTxt.push(txt.substring(start, txt.length));
      return rnTxt.join('');//.replace(/,/g, "")
    },

    callVideo() {
      if (this.$route.query.type == "contact") {
        // this.$refs.emedia.showEmediaModal();
        // this.$refs.emedia.showCallerWait(
        //   this.$route.query.chatId
        // );
        Bus.$emit('showEmedia',this.$route.query.chatId);
        const videoSetting = JSON.parse(localStorage.getItem("videoSetting"));
        const recMerge = (videoSetting && videoSetting.recMerge) || false;
        const rec = (videoSetting && videoSetting.rec) || false;
        this.onCallVideo({
          chatType:this.$route.query.type,
          to: this.$route.query.chatId,
          rec,
          recMerge
        });
      } else if (this.$route.query.type == "group") {
        this.getGroupMembers(this.$route.query.chatId);
        // this.$refs.addAvMember.show();
        Bus.$emit('showVideo',this.target);
      }
    },
    callVoice() {
      // this.$refs.emedia.showEmediaModal();
      // this.$refs.emedia.showCallerWait(
      //   this.$route.query.chatId
      // );
      Bus.$emit('showEmedia',this.$route.query.chatId);
      return;
      const videoSetting = JSON.parse(localStorage.getItem("videoSetting"));
      const recMerge = (videoSetting && videoSetting.recMerge) || false;
      const rec = (videoSetting && videoSetting.rec) || false;
      this.onCallVoice({
        chatType: this.$route.query.type,
        to: this.$route.query.chatId,
        rec,
        recMerge
      });
    },
    //格式化大小
    readablizeBytes(value) {
      let s = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
      let e = Math.floor(Math.log(value) / Math.log(1024));
      return (value / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    },
    // 格式化时间
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
    //滚动到底部
    scrollBottom() {
      setTimeout(() => {
        const dom = this.$refs.msgContent;
        if (!dom) return;
        dom.scrollTop = dom.scrollHeight;
      }, 10);
    },
    //预览图片
    preview(url){
      ImagePreview([url]);
    },
    //查看投标
    tenderDetail(item){
      let obj=JSON.parse(item.msg);
      IsRedirectBpoApplyOrder({
        JobId:obj.jobApplyOrderId,
        UserCode:this.userData.UserCode
      }).then(r=>{
        if(r.Result==1 && r.Data.IsRedirect){
          this.$router.push({
            path:'/bidderPlan',
            query:{
              orderId:obj.jobApplyOrderId,
              accountType:obj.accountType,
              accountId:obj.accountId
            }
          })
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
.chatPage{
  padding-top: 46px;
  height: 100vh;
  .message-wrapper{
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
  .message-content{
    flex: 1;
    overscroll-behavior-y: auto;
    height: 100px;
    overflow-x: hidden;
  }
  .message-list{
    min-height: calc(100vh - 190px);
    padding-top: 15px;
    // overflow-y: auto;
    // overflow-x: hidden;
  }
  .message-item{
    margin-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    &.self{
      .owner-dl{
        flex-direction: row-reverse;
      }
      .owner-dd{
        margin-left: 0;
        margin-right: 10px;
      }
      .nickname{
        display: none;
      }
      .message-box{
        text-align: right;
        .text-msg{
          text-align: left;
        }
      }
      .time-style{
        text-align: right;
      }
    }
    .time-style{
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
    .owner-dl{
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      .owner-dt{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      .avatar{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .owner-dd{
        flex: 1;
        margin-left: 10px;
      }
      .nickname{
        font-size: 12px;
        color: #333;
        line-height: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .message-box{
      margin-left: 40px;
      margin-right: 40px;
      .img-style{
        display: inline-block;
        max-width: 100%;
        border-radius: 2px;
      }
      audio{
        max-width: 100%;
      }
      video{
        max-width: 100%;
      }
      .file-style{
        display: inline-block;
        color: inherit;
        width: 200px;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        background-color: #fff;
        padding-bottom: 10px;
        text-align: left;
        text-decoration: none;
        .file-hd{
          font-size: 16px;
          color:#333;
          line-height: 30px;
          padding:0 10px;
          @include bb;
        }
        .file-name{
          font-size: 14px;
          color: #333;
          line-height: 20px;
          word-break: break-all;
          padding: 10px;
        }
        .flex{
          display: flex;
          align-items: center;
          padding: 0 10px;
          justify-content: space-between;
        }
        .size{
          font-size: 12px;
          color: #999;
          line-height: 20px;
        }
        .btn-text{
          font-size: 12px;
          color: #f75959;
          line-height: 20px;
        }
      }
      .text-msg{
        display: inline-block;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        line-height: 20px;
      }
    }
    .recall-msg{
      text-align: center;
      font-size: 12px;
      color: #999;
      line-height: 24px;
    }
    
  .tender-box{
      border-radius: 4px;
      border: 1px solid #e5e5e5;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      background-color: #fff;
      padding: 10px;
      width: 100%;
      .title{
        font-size: 16px;
        text-align: center;
        line-height: 24px;
        margin-bottom: 10px;
      }
      .item{
        display: flex;
        margin-bottom: 10px;
      }
      .label{
        font-size: 14px;
        color: #333;
        line-height: 24px;
        margin-right: 10px;
        min-width: 60px;
      }
      .desc{
        font-size: 14px;
        color: #999;
        line-height: 24px;
        word-break: break-all;
        flex: 1;
      }
      .price{
        font-size: 14px;
        color: #f75959;
        line-height: 24px;
      }
      .flex1{
        flex: 1;
      }
      .more{
        font-size: 14px;
        color: #999999;
        text-decoration: none;
        &:active{
          color: #f75959;
        }
      }
    }
  }
  .message-footer{
    background-color: #fff;
    .tool-bar{
      padding: 10px 10px 0;
      display: flex;
      align-items: center;
    }
    .van-icon{
      font-size: 20px;
      color: #999;
      display: block;
    }
    .recorder-wrapper{
      display: block;
      font-size: 20px;
      color: #999;
      margin-right: 10px;
    }
    .van-icon-smile-o,
    .van-icon-video-o,
    .van-icon-phone-o{
      margin-right: 10px;
    }
    .input-box{
      width: 100%;
      display: flex;
      align-items: flex-end;
    }
    .textarea{
      padding: 6px 10px;
      height: 60px;
      font-size: 14px;
      color: #333;
      line-height: 22px;
      display: block;
      flex: 1;
      width: 100px;
    }
    .btn-send{
      font-size: 14px;
      color: #fff;
      height: 30px;
      background-color: $primary;
      width: 44px;
      margin-right: 4px;
      margin-bottom: 4px;
      border-radius: 2px;
    }
  }
  .van-popup--bottom.van-popup--round{
    border-radius: 0;
  }
  .emoji-wrapper{
    padding: 10px 0 0 10px;
    .emoji{
      float: left;
      width: 30px;
      height: 30px;
      margin-right: 8px;
      margin-bottom: 10px;
    }
  }
}
</style>