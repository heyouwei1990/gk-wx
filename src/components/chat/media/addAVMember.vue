<template>
	<van-dialog title="链接成员" :value="addAVMemberModalVisible" show-cancel-button @confirm="startConference" @cancel="onClosed">
		<div class="inner">
				<van-checkbox-group v-model="checkList" :max="6">
					<van-cell-group>
						<van-cell
							v-for="(item,index) in groupMembers"
							:key="item.member"
							clickable
							:title="item.DisplayName || item.member||item.owner"
							@click="toggle(index,item)"
						>
							<template #right-icon>
								<van-checkbox :name="item.member||item.owner" ref="checkboxes" :disabled="item.member == username || item.owner == username?true:false" />
							</template>
						</van-cell>
					</van-cell-group>
				</van-checkbox-group>
			</div>
	</van-dialog>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
import Bus from '@/common/bus.js'
export default{
	data(){
		return {
			dialogVisible: false,
			checkList: [],
			to:{},
		};
	},
	computed: {
		groupMembers(){
			return this.$store.state.emedia.groupMembers;
		},
		multiAVModalVisible(){
			return this.$store.state.emedia.multiAVModalVisible;
		},
		confr(){
			return this.$store.state.emedia.confr;
		},
		addAVMemberModalVisible(){
			return this.$store.state.emedia.addAVMemberModalVisible;
		},
		username(){
			return this.$store.state.hxLoginId;
		}
	},
	created() {
		Bus.$on('showVideo',data=>{
			if(data){
				this.to=data;
				this.show()
			}
		})
	},
	methods: {
		...mapActions([
			"showMultiAVModal",
			"hideMultiAVModal",
			"setConfr",
			"setAVMemeberModalVisible"
		]),
		toggle(index,item) {
			if(item.member == this.username || item.owner == this.username){
				return false;
			}
			this.$refs.checkboxes[index].toggle();
    },
		show(){
			this.$data.checkList = [this.username];
			// this.$data.dialogVisible = true
			this.setAVMemeberModalVisible({ addAVMemberModalVisible: true });
		},
		hide(){
			// this.$data.dialogVisible = false
			this.setAVMemeberModalVisible({ addAVMemberModalVisible: false });
		},
		onClosed(){
			this.$data.checkList = [this.username];
			this.hide();
		},
		startConference(){
			const me = this;
			let pwd = Math.random().toString(36).substr(2);
			if(me.multiAVModalVisible){
				// 发送邀请
				const appkey = this.$IM.config.appkey;
				const spHost = this.$IM.config.Host;
				const { confrId, password } = me.confr;
				const gid = me.to.groupid;
				let jids = [];

				for(let elem of me.$data.checkList){
					if(elem != me.$data.username){
						jids.push(appkey + "_" + elem + "@" + spHost);
					}
				}
				for(let jid of jids){
					this.$IM.call.inviteConference(confrId, password, jid, gid);
				}

				return this.hide();
			}
			this.showMultiAVModal();
			
			pwd = "";
			const videoSetting = JSON.parse(localStorage.getItem("videoSetting"));
			const recMerge = videoSetting && videoSetting.recMerge || false;
			const rec = (videoSetting && videoSetting.rec) || false;
			me.$IM.EMedia.mgr.createConference(me.$IM.EMedia.mgr.ConfrType.COMMUNICATION_MIX, pwd, rec, recMerge).then(function(confr){
				console.log("%c会议的信息", "color: red", confr); // 可以在这里拿到会议id confrId 来查服务端录制
				confr.type=10;//
				me.setConfr({ confr });
				const tkt = confr.ticket;
				me.$IM.EMService.joined(confr.confrId) || me.$IM.EMService.joinConferenceWithTicket(confr.confrId, tkt, "user ext field").then(function(){
					me.$IM.EMService.publish({ audio: true, video: true }, "user ext field")["catch"](function(e){
						console.error(e);
					});
				})["catch"](function(e){
					console.error(e);
				});

				// 发送邀请
				const appkey = me.$IM.config.appkey;
				const spHost = me.$IM.config.Host;
				const { confrId, password } = confr;
				const gid = me.to.groupid;
				let jids = [];
				for(let elem of me.$data.checkList){
					if(elem != me.$data.username){
						jids.push(appkey + "_" + elem + "@" + spHost);
					}
				}
				//发送会议邀请消息到群里
				let msgid=me.$IM.conn.getUniqueId();
				let msg=new me.$IM.message('txt',msgid);
				msg.set({
					msg:`邀请你加入会议,请点击加入:${confrId}`,
					to:gid,
					chatType:'groupChat',
					ext:{
						conferenceId:confrId,
						msg_extension:`{"inviter":${me.username},"group_id":${gid}`,
						password:password,
						groupId:gid,
						inviter:me.username,
					},
					roomType:false,
					success(id,serviceMsgId){
						console.log(id,serviceMsgId);
					},
					fail(){
						console.log('自定义消息发送失败');
					}
				})
				me.$IM.conn.send(msg.body);
				for(let jid of jids){
					me.$IM.call.inviteConference(confrId, password, jid, gid);
				}
			});
			return this.hide();
		}
	},
};
</script>

<style scoped lang="scss">
    .checkboxGroup{
        overflow: scroll;
        height: 150px;
    }
    .checkbox{
        display: block;
    }
		.inner{
			max-height: 50vh;
			overflow-y: auto;
		}
</style>
