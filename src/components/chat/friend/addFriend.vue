<template>
	<van-dialog title="添加好友" v-model="showAddFriendModal" show-cancel-button @confirm="submitValue" @cancel="showAddFriendModal=false">
		<div class="form-item">
			<span class="label">用户名</span>
			<input class="input"  v-model="form.name" type="text">
		</div>
		<div slot="footer" class="dialog-footer">
			<button @click="showAddFriendModal = false">取 消</button>
			<button @click="submitValue">确 定</button>
		</div>
	</van-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Vue from "vue";

export default{
	data(){
		return {
			form: {
				name: "",
			},
			showAddFriendModal: false
		};
	},
	computed: {
		// ...mapGetters({
		//   contact: "addfirend"
		// }),
	},
	methods: {
		...mapActions(["addfirend"]),
		changeModal(){
			this.$data.showAddFriendModal = !this.$data.showAddFriendModal;
		},
		submitValue(){
			const option = {
				id: this.form.name,
				params: this.$route.query.username
			};
			this.changeModal();
			this.addfirend(option);
			this.$message.success("已发送请求");
			this.$data.form.name =''
		}
	}
};
</script>
