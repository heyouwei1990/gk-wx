<template>
	<van-dialog title="黑名单" v-model="showBlackModel" >
		<ul class="black-name">
				<li v-for="item in fidendList" :key="item.name">
				{{item.name}}
				<label class="icon-x" @click="select(item)" >
					<i class="el-icon-remove-outline"></i>
				</label>
			</li>
		</ul>
	</van-dialog>
</template>
<script>
import { mapActions } from "vuex";
export default{
	data(){
		return {
			showBlackModel: false
		};
	},
	computed: {
		fidendList(){
			return this.$store.state.friendModule.blackList;
		}
	},
	methods: {
		...mapActions(["onGetFirendBlack", "onRemoveBlack"]),
		changModel(){
			this.$data.showBlackModel = !this.$data.showBlackModel;
		},
		select(key){
			let removeName = key.name;
			this.onRemoveBlack({ removeName: removeName });
			this.onGetFirendBlack();
		}
	}
};
</script>
<style scoped lang="scss">
@import "./firend.scss";
</style>
