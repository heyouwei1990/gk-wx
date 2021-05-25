<template>
  <label for="uploadFile" @click="clickFile" class="upload">
    <!-- <van-icon name="send-gift-o"  /> -->
		<i class="van-icon">
			<svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2406"><path d="M859.5 193H446.939c-1.851-53.25-45.747-96-99.439-96h-183C109.635 97 65 141.635 65 196.5v632c0 54.864 44.635 99.5 99.5 99.5h695c54.864 0 99.5-44.636 99.5-99.5v-536c0-54.865-44.636-99.5-99.5-99.5z m-695-33h183c20.126 0 36.5 16.374 36.5 36.5v28c0 17.397 14.103 31.5 31.5 31.5h444c20.126 0 36.5 16.374 36.5 36.5V321H128V196.5c0-20.126 16.374-36.5 36.5-36.5z m695 705h-695c-20.126 0-36.5-16.374-36.5-36.5V384h768v444.5c0 20.126-16.374 36.5-36.5 36.5z" p-id="2407"></path></svg>
		</i>
    <input type="file" class="hide" ref="imgDom" @change="fileChange" />
  </label>
</template>

<script>
import { mapActions } from "vuex";
export default{
	data(){
		return {
			file: null
		};
	},
	methods: {
		...mapActions(["sendFileMessage"]),
		clickFile(){
			let img = this.$refs.imgDom;
			img && img.click();
		},
		inputRef(node){
			this.file = node;
		},
		// TODO 当前username、及type不是从pams里取
		fileChange(e){
			let isRoom = this.type == "chatroom" || this.type == "groupchat";
			let file = this.$IM.utils.getFileUrl(e.target);
			if(!file.filename){
				this.$refs.imgDom.value = null;
				return false;
			}

			let obj = {
				chatType: this.type,
				chatId: this.chatId, // TODO 这里在群里面应该取的是ID，后期跟进
				file: file,
				roomType: isRoom,
				callback: () => {
					this.$refs.imgDom.value = null;
				}
			};
			this.sendFileMessage(obj);
		}
	},
	props: [
		"type", // 聊天类型 contact, group, chatroom
		"chatId" // 选中的聊天对象
	]
};
</script>
<style scoped lang="scss">
.upload{
	margin-right: 10px;
	display: block;
}
.van-icon{
	display: block;
	.icon{
		display: block;
	}
}
.hide {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: inherit;
  display: none;
}
</style>
