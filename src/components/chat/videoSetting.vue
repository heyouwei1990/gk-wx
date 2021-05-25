<template>
	<van-dialog title="音视频录制" v-model="recModalVisible">
		<van-checkbox-group v-model="checkList" @change="onChange">
			<van-checkbox name="rec">启用录制</van-checkbox>
			<van-checkbox name="recMerge">启用合并</van-checkbox>
		</van-checkbox-group>
	</van-dialog>
</template>

<script>
export default{
	data(){
		return {
			recModalVisible: false,
			checkList: []
		};
	},
	methods: {
		onChange(checkedList){
			this.$data.checkList = checkedList;
			const videoSettingObj = {
				recMerge: checkedList.indexOf("recMerge") != -1,
				rec: checkedList.indexOf("rec") != -1,
			};
			localStorage.setItem("videoSetting", JSON.stringify(videoSettingObj));
		},
		show(){
			const videoSetting = JSON.parse(localStorage.getItem("videoSetting"));
			let checkedList = [];
			if(videoSetting){
				checkedList = Object.keys(videoSetting).filter((key) => {
					if(videoSetting[key]){
						return key;
					}
				});
			}
			this.$data.checkList = checkedList;
			this.$data.recModalVisible = true;
		},
		hide(){
			this.$data.recModalVisible = false;
		},
	}
};
</script>

<style  lang="scss">
	.checkbox{
		display: block;
		margin-top: 6px;
	}
</style>
