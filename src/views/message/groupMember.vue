<template>
  <div class="groupMember">
    <van-nav-bar
      title="群成员"
      left-arrow
      class="primary-header"
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    >
      <template #right>
        <!-- <van-icon name="ellipsis" size="18" @click="showCtrl=true" /> -->
      </template>
    </van-nav-bar>
    <ul class="member-list">
      <!-- <li class="item" v-if="groupinfoList.admin">
        <img class="avatar" src="@/assets/home/person-avatar.png" alt="">
				<div class="name">{{groupinfoList.admin}} </div>
        <van-icon name="manager-o" />
      </li>
      <li class="item" v-for="(item,index) in groupinfoList.members.filter((i)=>{if(!i.owner){return i}})" :key="index">
        <img class="avatar" src="@/assets/home/person-avatar.png" alt="">
        <span v-if="!item.owner" class="name">{{item.member}}</span>
        <van-icon name="setting-o" v-show="!item.owner && (adminList.includes(userId) || groupinfoList.admin == userId) && userId != item.member" />
      </li> -->
      <li class="item" v-for="(item,index) in groupinfoList.members" :key="index">
        <img class="avatar" v-if="item.PhotoUrl" :src="item.PhotoUrl" alt="">
        <img class="avatar" v-else src="@/assets/home/person-avatar.png" alt="">
        <span class="name">{{item.DisplayName}}</span>
      </li>
    </ul>
    <div class="footer">
      <button class="btn-primary" @click="invite">邀请群成员</button>
    </div>
    <!-- <van-action-sheet v-model="showCtrl" :actions="userCtrl" @select="selectUserCtrl" /> -->
    <van-dialog v-model="showInvite" title="邀请群成员" @confirm="share">
      <div class="qrcode-wrapper">
        <img class="qrcode" id="qrcode" :src="qrcode" alt="">
        <span class="tips">请截图转发好友，扫码进群。该二维码24小时内有效，若失效请重新邀请。</span>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
import QRCode from 'qrcode';
export default {
  data(){
    return{
      showCtrl:false,
      userCtrl:[{
        name:'邀请群成员',
        id:1,
      }],
      showInvite:false,
      qrcode:'',
    }
  },
  computed: {
    groupinfoList(){
			return this.$store.state.group.groupInfo;
    },
		adminList(){
			return this.$store.state.group.adminList;
		},
    userId(){
      return this.$store.state.hxLoginId;
    }
  },
  watch: {
    userId:{
      handler(value){
        if(value){
          this.onGetGroupinfo({select_groupid:this.$route.query.groupId});
        }
      },
      immediate:true,
    }
  },
  created() {
    this.onGetGroupinfo({select_groupid:this.$route.query.groupId});
  },
  methods: {
		...mapActions([
			"onGetGroupinfo",
			"onSetAdmin",
			"onRemoveAdmin",
			"getGroupAdmin",
			"getMuted",
			"onAddMute",
			"onRemoveMute",
			"onAddGroupBlack",
      "onRemoveGroupUser",
      "onInviteGroup"
    ]),
    //选择命令
    selectUserCtrl(item){
      this.showCtrl=false;
      if(item.id==1){
        this.showInvite=true;
      }
    },
    //邀请群成员
    share(){
      // window.open(`${window.location.origin}#/inviteMember?groupId=${this.$route.query.groupId}&time=${new Date().getTime()}&inviter=${this.userId}&groupName=${this.groupinfoList.name}&members=${this.groupinfoList.members.length}`);
    },
    invite(){
        this.showInvite=true;
      var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.3,
        margin: 1,
        color: {
          dark:"#000000",
          light:"#ffffff"
        }
      }
      var that=this;
      let inviter='';
      for (let i = 0; i < this.groupinfoList.members.length; i++) {
        if(this.userId== this.groupinfoList.members[i].EasemobUserName){
          inviter=this.groupinfoList.members[i].DisplayName;
        }
      }
      QRCode.toDataURL( `${window.location.origin}/#/inviteMember?groupId=${this.$route.query.groupId}&time=${new Date().getTime()}&inviter=${encodeURIComponent(inviter)}&groupName=${this.groupinfoList.name}&members=${this.groupinfoList.members.length}`, opts, function (err, url) {
        if (err) throw err
        that.qrcode=url;
        })
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.groupMember{
  padding-top: 46px;
  .member-list{
    >li{
      @include bb;
      background-color: #fff;
      padding: 10px 15px;
      display: flex;
      align-items: center;
    }
    .avatar{
      width: 40px;
      height: 40px;
      display: block;
      margin-right: 10px;
      border-radius: 50%;
    }
    .name{
      font-size: 16px;
      color: #333;
      line-height: 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    .van-icon{
      font-size: 18px;
      color: #999;
    }
  }
  .btn-primary{
    display: block;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
  }
  .qrcode-wrapper{
    padding: 20px;
    .qrcode{
      display: block;
      width: 200px;
      height: 200px;
      margin: 0px auto 10px;
    }
    .tips{
      font-size: 12px;
      color: #999;
      line-height: 22px;
    }
  }
  .van-popup--bottom.van-popup--round{
    border-radius: 0;
  }
}
</style>