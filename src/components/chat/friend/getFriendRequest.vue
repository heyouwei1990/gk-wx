<template>
  <van-dialog 
    title="请求添加好友" 
    v-model="isShowFriendRequest" 
    show-cancel-button 
    cancelButtonText="拒绝" 
    confirmButtonText="接受" 
    @confirm="acceptSubmit"
    @cancel="refusedClick"
  >
    <p  class="msg">{{this.$store.state.friendModule.friendRequest.status}}</p>
  </van-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      showRequestFriendModal: this.$store.state.friendModule.friendRequest.isShow
    };
  },
  computed: {
    isShowFriendRequest() {
      return this.$store.state.friendModule.friendRequest.isShow;
    }
  },

  methods: {
    ...mapActions(["acceptSubscribe", "declineSubscribe"]),
    changeModal() {
      let obj={...this.$store.state.friendModule.friendRequest};
      obj.isShow=!this.$store.state.friendModule.friendRequest.isShow;
      this.$store.commit('changeFriendRequestState',obj)
      // this.$store.state.friendModule.friendRequest.isShow = !this.$store.state.friendModule.friendRequest.isShow;
    },
    acceptSubmit() {
      const id = this.$store.state.friendModule.friendRequest.from;
      this.acceptSubscribe(id);
      this.changeModal();
    },
    refusedClick() {
      const options = {
        id: this.$store.state.friendModule.friendRequest.from,
        params: this.$route.query.username
      };
      this.declineSubscribe(options);
      this.changeModal();
    }
  }
};
</script>
<style lang="scss">
.msg {
  text-align: center;
  font-size: 14px;
  color: #666;
  padding: 20px 10px;
}
</style>
