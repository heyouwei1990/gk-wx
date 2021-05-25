<template>
    <Draggable v-if="multiAVModalVisible" id="drag3">
        <div class="multiAVModal" v-show="multiAVModalVisible">
            <span class="title">{{groupname}}</span>
            <!-- <div>时间</div> -->
            <van-row type="flex" class="row-bg" justify="space-around">
                <van-col :span="6"><div class="grid-content bg-purple videoBox">
                    <video class="video" autoPlay playsInline muted ref="rv_local"/>
                    <div class="tools">
                        <span>{{rv_local.nickName}}</span>
                    </div>
                </div></van-col>
                <van-col :span="6"><div class="grid-content bg-purple-light videoBox">
                    <video class="video" autoPlay playsInline ref="rv_0"/>
                    <div class="tools">
                        <span>{{rv[0].nickName}}</span>
                        <i class="van-icon van-icon-video-o red" @click="controlRemoteVideo(0)"></i>
                    </div>
                </div></van-col>
                <van-col :span="6"><div class="grid-content bg-purple videoBox">
                    <video class="video" autoPlay playsInline ref="rv_1"/>
                    <div class="tools">
                        <span>{{rv[1].nickName}}</span>
                        <i class="van-icon van-icon-video-o red" @click="controlRemoteVideo(1)"></i>
                    </div>
                </div></van-col>
            </van-row>
            <van-row type="flex" class="row-bg" justify="space-around">
                <van-col :span="6"><div class="grid-content bg-purple videoBox">
                    <video class="video" autoPlay playsInline ref="rv_2"/>
                    <div class="tools">
                        <span>{{rv[2].nickName}}</span>
                        <i class="van-icon van-icon-video-o red" @click="controlRemoteVideo(2)"></i>
                    </div>
                </div></van-col>
                <van-col :span="6"><div class="grid-content bg-purple-light videoBox">
                    <video class="video" autoPlay playsInline ref="rv_3"/>
                    <div class="tools">
                        <span>{{rv[3].nickName}}</span>
                        <i class="van-icon van-icon-video-o red" @click="controlRemoteVideo(3)"></i>
                    </div>
                </div></van-col>
                <van-col :span="6"><div class="grid-content bg-purple videoBox">
                    <video class="video" autoPlay playsInline ref="rv_4"/>
                    <div class="tools">
                        <span>{{rv[4].nickName}}</span>
                        <i class="van-icon van-icon-video-o red" @click="controlRemoteVideo(4)"></i>
                    </div>
                </div></van-col>
            </van-row>
            <div class="toolsBox">
                <van-col :span="3">
									<van-icon name="add-o" class="toolBtn" @click="invite"/>
								</van-col>
                <!-- <el-col :span="3"><i class="el-icon-phone-outline toolBtn"></i></el-col> -->
                <van-col :span="3">
									<i :class="rv_local.openAudio?'toolBtn':' active'" @click="controlLocalMic">
										<svg class="icon" style="width: 1.001953125em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1986"><path d="M240.023158 329.356725H144.719298c-8.819774 0-15.968811 7.149037-15.968811 15.968811v328.358675c0 8.819774 7.149037 15.968811 15.968811 15.96881h193.621833c0 0.07685 0.036928 0.149708 0.099805 0.195618l182.323898 133.236772a7.984405 7.984405 0 0 0 12.695205-6.446409V622.793606l64.374269 64.374269v240.995306c0 8.819774-7.149037 15.968811-15.968811 15.968811a15.968811 15.968811 0 0 1-9.422596-3.075992L320.078799 756.605255a15.968811 15.968811 0 0 0-9.422596-3.07699H128.750487c-35.277099 0-63.875244-28.598144-63.875243-63.875244V329.356725c0-35.277099 28.598144-63.875244 63.875243-63.875244h47.397427l63.875244 63.875244zM533.460039 442.126472V203.34584a7.984405 7.984405 0 0 0-12.695205-6.446409l-134.351594 98.180242-45.171774-45.171774L572.443899 80.92694c7.120094-5.204834 17.110581-3.650869 22.314417 3.469224A15.968811 15.968811 0 0 1 597.834308 93.816764v412.683977l-64.374269-64.374269z m336.776234 336.776234l-43.516008-43.51501C873.074729 672.799938 896.251462 598.005021 896.251462 511.001949c0-138.745014-58.939883-246.440671-176.820647-323.088967A47.906433 47.906433 0 0 1 697.639376 147.751423V144.717349c0-14.036585 11.378776-25.415361 25.415361-25.415361 4.359485 0 8.644117 1.120811 12.445692 3.255642C885.249949 206.655376 960.126706 336.137481 960.126706 511.001949c0 114.37062-40.59671 203.053411-89.890433 267.900757z m-90.129965 90.537169C737.183142 902.479345 702.280312 917.638737 697.639376 916.210526c-12.974659-3.992203-19.961014-16.269224-19.961013-34.931774 0-11.10531 5.301645-21.265466 15.903937-30.480467a45.910331 45.910331 0 0 1 6.746823-4.863501c11.948663-7.066199 23.35239-14.421832 34.208187-22.063907l45.568998 45.568998z m0.504016-180.163119l-47.753731-47.753731C755.502363 603.286706 768.500975 558.661864 768.500975 511.001949c0-88.404335-44.723649-166.363072-112.779727-212.48499-15.968811-11.078363-33.933723-31.039376-29.941521-48.006238s17.964912-29.94152 29.941521-25.916382C760.489622 277.271454 832.376218 385.741598 832.376218 511.001949c0 67.674823-18.361138 128.419181-51.765894 178.274807zM688.117973 777.45154A323.332491 323.332491 0 0 1 664.703704 790.45614c-13.97271 4.895439-24.951267 4.990253-36.927876-14.97076-9.769918-16.283197-1.60786-29.909583 15.275166-43.100819l45.066979 45.065981zM90.7537 90.752749c12.472639-12.472639 32.694144-12.472639 45.166783 0L936.922027 891.753294c12.472639 12.472639 12.472639 32.694144 0 45.166784s-32.694144 12.472639-45.166783 0L90.754698 135.918534c-12.472639-12.472639-12.472639-32.694144 0-45.166784z" p-id="1987"></path></svg>
									</i>
								</van-col>
                <van-col :span="3">
									<i :class="rv_local.openVideo?' toolBtn':' active'" @click="controlLocalVideo">
										<svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10410"><path d="M876.5 306.5c-5.2-12.3-11-24.3-17.4-35.9-8.9-16.3-31.1-19.4-44.3-6.3-8.8 8.8-10.7 22.3-4.8 33.2 27 49.2 41.4 104.8 41.4 162.5 0 90.4-35.2 175.4-99.1 239.3-63.9 63.9-148.9 99.1-239.3 99.1-57.7 0-113.2-14.4-162.5-41.4-10.9-6-24.4-4-33.2 4.8-13.2 13.2-10.1 35.3 6.3 44.3 11.6 6.4 23.6 12.2 35.9 17.4 40.1 16.9 82.2 27 125.5 30v49.3H268.9c-15.5 0-28 12.5-28 28s12.5 28 28 28h488.5c15.5 0 28-12.5 28-28s-12.5-28-28-28H541.1v-49.3c43.3-3 85.5-13.1 125.5-30 47-19.9 89.1-48.3 125.3-84.5s64.6-78.4 84.5-125.3c20.6-48.6 31-100.3 31-153.5s-10.3-105-30.9-153.7zM174.8 460.1c0-104.8 47.3-202.3 131.9-268.2 47.4-36.9 104-60.3 163.6-67.6 73-8.9 144.1 5.1 205.5 38.8 10.9 6 24.4 4 33.1-4.8 13.2-13.2 10.1-35.3-6.3-44.3-11.6-6.4-23.6-12.2-35.9-17.4-48.6-20.6-100.3-31-153.5-31S408.3 76 359.7 96.6c-47 19.9-89.1 48.3-125.3 84.5s-64.6 78.4-84.5 125.3c-20.6 48.6-31 100.3-31 153.5s10.4 104.9 31 153.5c5.2 12.3 11 24.3 17.4 35.9 8.9 16.3 31.1 19.4 44.3 6.3 8.8-8.8 10.7-22.3 4.8-33.2-27.3-49.1-41.6-104.6-41.6-162.3z" fill="" p-id="10411"></path><path d="M352 299c-43 43-66.7 100.2-66.7 161.1 0 18.8 2.3 37.3 6.7 55.1 5.2 21.1 31.6 28.3 47 12.9 6.9-6.9 9.8-17 7.4-26.5-3.7-14.9-5.5-30.5-5-46.6 2.6-90.6 76.1-164.1 166.7-166.7 16.1-0.5 31.7 1.3 46.6 5 9.5 2.4 19.6-0.5 26.5-7.4 15.4-15.4 8.2-41.8-12.9-47-17.8-4.4-36.3-6.7-55.1-6.7-60.9 0.1-118.1 23.7-161.2 66.8zM684.9 465.1c-2.6 90.6-76.1 164.1-166.7 166.7-16.1 0.5-31.7-1.3-46.6-5-9.5-2.4-19.6 0.5-26.5 7.4-15.4 15.4-8.2 41.8 12.9 47 17.8 4.4 36.3 6.7 55.1 6.7 60.9 0 118.1-23.7 161.1-66.7s66.7-100.2 66.7-161.1c0-18.8-2.3-37.3-6.7-55.1-5.2-21.1-31.6-28.3-47-12.9-6.9 6.9-9.8 17-7.4 26.5 3.8 14.8 5.5 30.4 5.1 46.5zM151.5 821.7c-10.9-10.9-10.9-28.7 0-39.6L835.2 98.4c10.9-10.9 28.7-10.9 39.6 0 10.9 10.9 10.9 28.7 0 39.6L191.1 821.7c-11 11-28.7 11-39.6 0z" fill="" p-id="10412"></path></svg>
									</i>
								</van-col>
								<van-button type="danger" size="mini" plain @click="closeModal">挂断</van-button>
            </div>
        </div>
    </Draggable>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Draggable from "@/components/chat/draggable.vue";
import Bus from '@/common/bus.js'
export default{
	data(){
		return {
			// emediaModalVisible: false
			rv_local: {
				nickName: "",
				streamId: "",
				openAudio: false,
				openVideo: false,
				video: <div className="default"></div>
			},
			rv: new Array(5).fill({
				nickName: "",
				streamId: "",
				openVideo: false,
				video: <div className="default"></div>
			}),
			rvCount: 0,
			groupname:''
		};
	},
	computed: {
		multiAVModalVisible(){
			return this.$store.state.emedia.multiAVModalVisible;
		},
		addAVMemberModalVisible(){
			return this.$store.state.emedia.addAVMemberModalVisible;
		}
	},
	created() {
		Bus.$on('showVideo',data=>{
			if(data){
				this.groupname=data.groupname;
			}
		})
	},
	mounted(){
		this.initEmedia();
	},
	methods: {
		...mapActions([
			"showMultiAVModal",
			"hideMultiAVModal",
			"setConfr",
			"setAVMemeberModalVisible"
		]),
		initEmedia(){
			let me = this;
			this.$IM.EMService = this.$IM.EMedia.mgr;
			this.$IM.EMService.onConferenceExit = function(reason, failed){
				reason = reason || 0;
				switch(reason){
				case 0:
					reason = "正常挂断";
					break;
				case 1:
					reason = "没响应";
					break;
				case 2:
					reason = "服务器拒绝";
					break;
				case 3:
					reason = "对方忙";
					break;
				case 4:
					reason = "失败,可能是网络或服务器拒绝";
					if(failed === -9527){
						reason = "失败,网络原因";
					}
					if(failed === -500){
						reason = "Ticket失效";
					}
					if(failed === -502){
						reason = "Ticket过期";
					}
					if(failed === -504){
						reason = "链接已失效";
					}
					if(failed === -508){
						reason = "会议无效";
					}
					break;
				case 5:
					reason = "不支持";
					break;
				case 10:
					reason = "其他设备登录";
					break;
				case 11:
					reason = "会议关闭";
					break;
				default:
					break;
				}
				console.log("Hangup reason " + (reason || 0));
			};

			this.$IM.EMService.onMemberJoined = function(member){
				me.$toast.success(member.name + " 加入群聊.");
				// me.props.setJoinedMembers(member)
			};
			this.$IM.EMService.onMemberExited = function(member, reason){
				// me.removeVideo(member.name)

				// 用户主动挂断时，不提示退出群聊
				if(reason !== undefined){
					me.$toast(member.name + " 退出群聊.");
				}
				// me.props.updateJoinedMembers(member)
			};

			this.$IM.EMService.onRoleChanged = function(role){ // emedia.mgr.Role
				// TODO 在直播模式下，如果变为主播，请上麦 publish stream
			};
			this.$IM.EMService.onStreamAdded = function(member, stream){
				const located = stream.located();
				console.log("来流了", stream.located());
				console.log(member);
				let index;
				if(located){
					let localVideo = me.$refs.rv_local;
					const nickName = member.name;
					let lv = {
						nickName,
						stream: stream,
						localStreamId: stream.id,
						openVideo: true,
						openAudio: true,
					};
					console.log(lv);
					me.$data.rv_local = lv;
					me.$IM.EMedia.mgr.onMediaChanaged(localVideo, function(constaints){
						let lv = {
							nickName,
							stream: stream,
							localStreamId: stream.id,
							openVideo: constaints.video,
							openAudio: constaints.audio,
						};
						me.$data.rv_local = lv;
						console.log(lv);
						// console.warn(stream.id, "voff:", this.getAttribute("voff"));
						// console.warn(stream.id, "aoff:", this.getAttribute("aoff"));
					});
					me.$IM.EMedia.mgr.streamBindVideo(stream, localVideo);

				}
				else{
					let rv = me.$data.rv, rvCount = me.$data.rvCount;
					const nickName = member.name,
						streamId = stream.id;
					const contains = (nickName, arr) => {
						for(let [ index, elem ] of arr.entries()){
							if(elem.nickName === nickName){
								return index;
							}
						}
						return false;
					};

					const ifContain = contains(nickName, rv);
					if(ifContain === false){
						
						// 从0～5看哪个位置空着，就往哪里添加
						for(let i = 0; i < 5; i++){
							if(rv[i].nickName == ""){
								index = i;
								if(index || index == 0){
									break;
								}
							}
						}
						rvCount++;
						let video = me.$refs["rv_" + index];

						console.log("别人的video标签", video, index);
						const elem = {
							nickName: nickName,
							streamId: streamId,
							openVideo: true,
							video: rv[index].video
						};
						rv[index] = elem;
						me.$data.rv = rv;
						me.$data.rvCount = rvCount;

						me.$IM.EMedia.mgr.onMediaChanaged(video, function(constaints){
							
							const elem = {
								nickName: nickName,
								streamId: streamId,
								openVideo: constaints.video,
								video: rv[index].video
							};
							rv[index] = elem;
							me.$data.rv = rv;
							// console.log("别人的video ++++", elem);
							// console.log(rv);
							// console.warn(streamId, "voff:", me.getAttribute("voff"));
							// console.warn(streamId, "aoff:", me.getAttribute("aoff"));
						});
						me.$forceUpdate();
						me.$IM.EMedia.mgr.streamBindVideo(stream, video);
						me.$IM.EMedia.mgr.subscribe(member, stream, true, true, video);
					}
				}
			};
			this.$IM.EMService.onStreamRemoved = function(member, stream){
			};
		},
		closeModal(){
			// clearInterval(this.state.interval)
			this.$IM.EMService.exitConference();
			this.hideMultiAVModal();
			this.setConfr("");
			this.$data.rv_local = {
				nickName: "",
				streamId: "",
				openAudio: false,
				openVideo: false,
				video: <div className="default"></div>
			};
			this.$data.rv = new Array(5).fill({
				nickName: "",
				streamId: "",
				openVideo: false,
				video: <div className="default"></div>
			});
			this.$data.rvCount = 0;
			// this.props.resetConfr()
		},
        
		controlRemoteVideo(id){
			// let rv = _.cloneDeep(this.state.rv)
			let rv = this.$data.rv;
			let elem = rv[id];
			if(elem.streamId === ""){
				return;
			}
			let video = this.$refs["rv_" + id];
			if(elem.openVideo){
				this.$IM.EMedia.mgr.triggerPauseVideo(video);
			}
			else{
				this.$IM.EMedia.mgr.triggerResumeVideo(video);
			}
		},
		controlLocalVideo(){
			let localVideo = this.$refs.rv_local;
			let { stream, localStreamId, openAudio, openVideo } = this.$data.rv_local;
			if(openVideo){
				this.$IM.EMedia.mgr.triggerPauseVideo(localVideo);
			}
			else{
				this.$IM.EMedia.mgr.triggerResumeVideo(localVideo);
			}
		},
		controlLocalMic(){
			let localVideo = this.$refs.rv_local;
			let { stream, localStreamId, openAudio, openVideo } = this.$data.rv_local;
			if(openAudio){
				this.$IM.EMedia.mgr.triggerPauseAudio(localVideo);
			}
			else{
				this.$IM.EMedia.mgr.triggerResumeAudio(localVideo);
			}
		},
		invite(){
			this.setAVMemeberModalVisible({ addAVMemberModalVisible: true });
		}

	},

	components: {
		Draggable
	},
};
</script>
<style scoped lang="scss">
@import "./index.scss";
    .multiAVModal{
        width: 100%;
        height: 450px;
        position: relative;
        background: #fff;
		right: 10px;
        top: 0;
        padding: 16px;
        box-shadow: 0 0 10px #ADB9C1;
    }

    .van-row {
    margin-bottom: 20px;
    /* &:last-child {
      margin-bottom: 0;
    } */
  }
  .van-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 140px;
  }
  .row-bg {
    padding: 5px 0;
    background-color: #f9fafc;
  }
  .video{
    height: 139px;
    width: 100%;
    border-radius: 2px;
  }
  /* .hangup{
         width: 50px;
        height: 30px;
        text-align: center;
        padding: 0;
  } */
  .red{
    color: red;
    margin-right: 6px;
  }
  .videoBox{
      position: relative;
  }
.tools{
	position: absolute;
	width: 100%;
	bottom: 0;
	display: flex;
	align-items: center;
	span{
		font-size: 12px;
		flex: 1;
		color: #fff;
	}
}
.toolsBox{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	justify-content: space-between;
}
.title{
	font-size: 14px;
	color: #333;
	line-height:24px;
	font-weight: 400;
	display: block;
	text-align: start;
	padding: 5px 12px;
	box-sizing: border-box
}
.active{
	color: rgba(83, 90, 93, 1);
	font-size: 32px;
}
.toolBtn{
		color: rgba(83, 90, 93, 0.6);
		font-size: 32px;
}
svg{
	display: block;
	color: inherit;
}
</style>
