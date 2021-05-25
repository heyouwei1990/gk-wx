<template>
	<div class="recorder-wrapper">
		<i class="icon-recorder" @click="recoderVisible=true">
			<svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4935"><path d="M824.579127 326.59943c-15.449487 0-27.950707 12.501732-27.950707 27.949562 0 1.692548-0.026607 140.841725-0.054237 144.716986-2.457059 149.794631-127.828461 271.638677-279.45693 271.638677-152.256804 0-277.628207-122.390491-279.483537-272.757151-0.02763-4.066619-0.02763-142.342916-0.02763-143.598512 0-15.448854-12.501221-27.949562-27.950707-27.949562-15.449487 0-27.950707 12.501732-27.950707 27.949562 0 1.283226 0 143.216819 0.026607 144.225799 2.123447 171.57468 137.606553 312.77354 307.457781 326.855256-0.00921 0.300852-0.022514 0.599657-0.022514 0.902556l0 75.744101L362.102525 902.276704c-15.449487 0-27.950707 12.500709-27.950707 27.949562 0 15.44783 12.502244 27.949562 27.950707 27.949562l310.028432 0c15.448463 0 27.950707-12.502755 27.950707-27.949562 0-15.449877-12.503267-27.949562-27.950707-27.949562L545.06796 902.276704l0-75.744101c0-0.303922-0.013304-0.604774-0.022514-0.906649C714.216148 811.553447 849.654226 670.981874 852.475597 500.19514c0.026607-1.720178 0.054237-143.92597 0.054237-145.646148C852.529834 339.100138 840.028614 326.59943 824.579127 326.59943zM517.116229 687.60139c106.345314 0 192.873492-85.761246 192.873492-191.146435L709.989721 254.92297c0-105.385189-86.528178-191.146435-192.873492-191.146435s-192.873492 85.761246-192.873492 191.146435l0 241.531985C324.243761 601.841168 410.770915 687.60139 517.116229 687.60139zM380.145176 254.92297c0-74.569346 61.442845-135.246287 136.971053-135.246287 75.528209 0 136.971053 60.676941 136.971053 135.246287l0 241.531985c0 74.570369-61.442845 135.246287-136.971053 135.246287-75.528209 0-136.971053-60.675918-136.971053-135.246287L380.145176 254.92297z" p-id="4936"></path></svg>
		</i>
		<van-popup v-model="recoderVisible">
			<div class="recoder">
				<div class="sound-waves">
					<div
						v-for="(iheight, index) in randomheight"
						:key="index"
						class="wavesItem"
						:style="{'height': iheight + 'px'}"
					></div>
				</div>
				<div class="tipText">按住开始录音</div>
				<button
					type="primary"
					class="holdBtn"
					@touchstart="mouseStart"
					@touchend="mouseEnd('audio')"
					@mousedown.prevent="mouseStart"
					@mouseup.prevent="mouseEnd('audio')"
				>
					<svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4935"><path d="M824.579127 326.59943c-15.449487 0-27.950707 12.501732-27.950707 27.949562 0 1.692548-0.026607 140.841725-0.054237 144.716986-2.457059 149.794631-127.828461 271.638677-279.45693 271.638677-152.256804 0-277.628207-122.390491-279.483537-272.757151-0.02763-4.066619-0.02763-142.342916-0.02763-143.598512 0-15.448854-12.501221-27.949562-27.950707-27.949562-15.449487 0-27.950707 12.501732-27.950707 27.949562 0 1.283226 0 143.216819 0.026607 144.225799 2.123447 171.57468 137.606553 312.77354 307.457781 326.855256-0.00921 0.300852-0.022514 0.599657-0.022514 0.902556l0 75.744101L362.102525 902.276704c-15.449487 0-27.950707 12.500709-27.950707 27.949562 0 15.44783 12.502244 27.949562 27.950707 27.949562l310.028432 0c15.448463 0 27.950707-12.502755 27.950707-27.949562 0-15.449877-12.503267-27.949562-27.950707-27.949562L545.06796 902.276704l0-75.744101c0-0.303922-0.013304-0.604774-0.022514-0.906649C714.216148 811.553447 849.654226 670.981874 852.475597 500.19514c0.026607-1.720178 0.054237-143.92597 0.054237-145.646148C852.529834 339.100138 840.028614 326.59943 824.579127 326.59943zM517.116229 687.60139c106.345314 0 192.873492-85.761246 192.873492-191.146435L709.989721 254.92297c0-105.385189-86.528178-191.146435-192.873492-191.146435s-192.873492 85.761246-192.873492 191.146435l0 241.531985C324.243761 601.841168 410.770915 687.60139 517.116229 687.60139zM380.145176 254.92297c0-74.569346 61.442845-135.246287 136.971053-135.246287 75.528209 0 136.971053 60.676941 136.971053 135.246287l0 241.531985c0 74.570369-61.442845 135.246287-136.971053 135.246287-75.528209 0-136.971053-60.675918-136.971053-135.246287L380.145176 254.92297z" p-id="4936"></path></svg>
				</button>
			</div>
		</van-popup>
	</div>
</template>

<script>
import recording from "./recordAudio.js";
import { mapActions } from "vuex";
export default{
	data(){
		return {
			form: {
				time: "按住说话(60秒)",
				audioUrl: ""
			},
			num: 60, // 按住说话时间
			recorder: null,
			interval: "",
			audioFileList: [], // 上传语音列表
			startTime: "", // 语音开始时间
			endTime: "", // 语音结束
			audioSrc: "",

			randomheight: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
			runAnimation: false,
			recoderVisible: false
		};
	},
	methods: {
		...mapActions(["sendRecorder"]),
		// 清除定时器
		clearTimer(){
			if(this.interval){
				this.num = 60;
				clearInterval(this.interval);
			}
		},
		onRandom(){
			let me = this;
			let _randomheight = this.randomheight.concat([]);
			let i = 0;
			this.$data.randomheight = _randomheight;
			if(this.runAnimation){
				for(i; i < this.randomheight.length; i++){
					_randomheight[i] = (60 * Math.random().toFixed(2)) + 10;
				}
				setTimeout(function(){me.onRandom(); }, 500);
			}
		},
		hide(){
			this.recoderVisible = false;
		},
		show(){
			this.recoderVisible = true;
		},
		// 长按说话
		mouseStart(e){
			e.preventDefault();
			this.$data.runAnimation = true;
			this.onRandom();
			this.clearTimer();
			this.startTime = new Date().getTime();
      
			recording.get(rec => {
				// 当首次按下时，要获取浏览器的麦克风权限，所以这时要做一个判断处理
				if(rec){
					// 首次按下，只调用一次
					if(this.flag){
						this.mouseEnd();
						this.flag = false;
					}
					else{
						this.recorder = rec;
						this.interval = setInterval(() => {
							if(this.num <= 0){
								this.recorder.stop();
								this.num = 60;
								this.clearTimer();
							}
							else{
								this.num--;
								this.time = "松开结束（" + this.num + "秒）";
								this.recorder.start();
							}
						}, 1000);
					}
				}
			});
		},

		// 松开时上传语音
		mouseEnd(type){
			this.$data.runAnimation = false;
			this.$data.randomheight = this.randomheight.map(i => i = 30);
			this.hide();
			this.clearTimer();
			this.endTime = new Date().getTime();
			if(this.recorder){
				this.recorder.stop();
				// 重置说话时间
				this.num = 60;
				this.time = "按住说话（" + this.num + "秒）";
				// 获取语音二进制文件
				let blob = this.recorder.getBlob();
				// 发送语音功能
				if(type === "audio"){
					this.$data.audioSrc = this.$IM.utils.parseDownloadResponse.call(this.$IM.conn, blob);
					const { name, params } = JSON.parse(this.$getStorage('route'));
					let uri = {
						url: this.$IM.utils.parseDownloadResponse.call(this.$IM.conn, blob),
						filename: "audio",
						filetype: "audio",
						data: blob
					};
					this.sendRecorder({
						type: name,
						useId: params.id,
						file: uri
					});
				}

				// 语音识别功能
				// if(type === "turnText"){
				// 	const apiURL = `https://mproxy.microduino.cn/baidu/asr`;
				// 	let formData = new FormData();
				// 	formData.append("file", bold);
				// 	formData.append("format", "wav");
				// 	formData.append("rate", 16000);

				// 	let audioApi = fetch(apiURL, { method: "POST", body: formData })
				// 	.then(response => {
				// 		return response.json().then(json => ({ json, response }));
				// 	})
				// 	.then(({ json, response }) => {
				// 		if(!response.ok){
				// 			return Promise.reject(json);
				// 		}
				// 		return json;
				// 	});
				// 	audioApi
				// 	.then(res => {
				// 		console.log("res>>>", res);
				// 		let txt = JSON.stringify(res);
				// 		console.log("txt=", txt);
				// 	})
				// 	["catch"](err => {
				// 		console.error("baidu api err = ", err);
				// 	});
				// }
			}
		}
	}
};
</script>

<style scoped lang="scss">
.recorder-wrapper{
	.icon-recorder{
		display: block;
		.icon{
			display: block;
		}
	}
	.van-popup{
		background-color: transparent;
	}
}
	.recoder{
		position: relative;
		box-shadow: 0 0 32px rgba(0, 0, 0, 0.15);
		width: 200px;
		height: 200px;
		background: #fff;
		border-radius: 4px;
	}
	.sound-waves{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 70px;
	}
	.wavesItem{
		border: 1px solid #f2f2f2;
		width: 4px;
		background: green;
		margin: 2px;
	}
	.tipText{
		text-align: center;
		font-size: 14px;
		position: absolute;
		bottom: 70px;
		width: 100%;
	}
	.holdBtn{
		width: 50px;
		height: 50px;
		border-radius: 25px;
		text-align: center;
		padding: 0;
		position: absolute;
		bottom: 10px;
		left: calc(50% - 25px);
		background: green;
		color: #fff;
	}
</style>