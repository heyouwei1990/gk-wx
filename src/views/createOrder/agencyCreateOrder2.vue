<template>
  <div class="createOrder2" ref="wrapper">
    <van-nav-bar
      title="特殊需求"
      left-arrow
      fixed
      :z-index="10"
      @click-left="$router.go(-1)"
    />
    <template  v-for="(item,index) in specialList">
      <div class="form-item" v-if="item.DisplayStatus!=0" :key="'special'+index">
        <div class="label" v-if="item.SelectStatus!=2">{{item.Name}}<i class="required" v-if="item.DisplayStatus==1">*</i></div>
        <van-radio-group class="primary-radio" v-model="item.SelectStatus" v-if="item.DisplayStatus!=0 && item.SelectStatus!=2">
          <van-radio :name="1">是</van-radio>
          <van-radio :name="0">否</van-radio>
        </van-radio-group>
        <textarea class="textarea" v-model="item.Remark" placeholder="请输入备注" v-if="item.SelectStatus==1 && item.Default==0"></textarea>
        <textarea class="textarea" v-model="item.Remark" placeholder="请输入备注" v-if="item.SelectStatus==0 && item.Default==1"></textarea>
        <textarea class="textarea" style="height:80px;padding-top:10px;" v-model="item.Remark" placeholder="其他说明备注" v-if="item.SelectStatus==2"></textarea>
      </div>
    </template>
    <div class="btn-box">
      <button class="btn-primary" @click="submit">下一步</button>
    </div>
  </div>
</template>
<script>
import {
  AddJobDetail,
} from '@/common/api.js'
import {mapState} from 'vuex'
export default {
  name:'CreateOrder2',
  data(){
    return{
      showItems:'',
      jobType:1,//1:自由工单，6:B2B工单，8:内部工单
      specialList:[],//特殊需求
      isShowSpecial:false,
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
      createConfig:state=>state.createConfig,
    }),
  },
  created() {
    //如果没有发单配置返回上一页
    this.pageInit();
  },
  activated() {
    let query=JSON.parse(this.$route.query.params);
  },
  methods: {
    pageInit(){
      //特殊需求
      if(this.createConfig==null){
        this.$router.go(-1);
        return;
      }
      this.specialList=this.createConfig.SpecialRemarkList;
      this.specialList.map((item)=>{
        item['Remark']='';
        item['Default']=0;
        //后面三条默认是
        if(item.RemarkType==7 || item.RemarkType==8 || item.RemarkType==9){
          item['Default']=1;
        }
        if(item.DisplayStatus>0){
          this.isShowSpecial=true;
        }
      })
    },
    // 验证特殊需求
    validSpecial(){
      for (let i = 0; i < this.specialList.length; i++) {
        if(
          this.specialList[i].DisplayStatus!=0 && 
          this.specialList[i].Default!==this.specialList[i].SelectStatus && 
          this.specialList[i].RemarkType!=10 &&
          this.specialList[i].Remark==''
        ){
          this.$toast('请输入'+this.specialList[i].Name);
          return false;
        }
        if(this.specialList[i].DisplayStatus==1 && this.specialList[i].RemarkType==10 &&this.specialList[i].Remark==''){
          this.$toast('请输入'+this.specialList[i].Name);
          return false;
        }
      }
      return true;
    },
    //下一步
    submit(){
      if(!this.validSpecial()){
        return;
      }
      let query=JSON.parse(this.$route.query.params);
      let params={
        ...query
      }
      params['SpecialRemarkList']=this.specialList;
      AddJobDetail(params).then(r=>{
        if(r.Result==1){
          let data=r.Data;
          this.$router.push({
            path:"/agencyCreateOrder3",
            query:{
              jobId:r.Data.JobId,
              jobType:params.JobType,
              userCode:params.UserCode,
              jobTitle:params.orderName,
              isProject:r.Data.IsB2BProjectJob,
            }
          });
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
.createOrder2{
  background-color: #f9f9f9;
  padding-top: 56px;
  min-height: 100vh;
  // -webkit-overflow-scrolling: touch;
	// overflow-y: scroll;
  
  .form-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background-color: #fff;
    padding-left: 15px;
    border-bottom: 1px solid #e5e5e5;
    position: relative;
    .label{
      font-size: 14px;
      color: #333;
      line-height: 44px;
    }
    .textarea{
      width: 100%;
      padding-right: 15px;
      color: #333;
      height: 40px;
      line-height: 20px;
      font-size: 14px;
      margin-bottom: 15px;
      &.with-marks{
        margin-bottom: 4px;
      }
    }
  }
  .primary-radio{
    display: flex;
    height: 44px;
    align-items: center;
    font-size: 14px;
    flex: 1;
    justify-content: flex-end;
    .van-radio{
      margin-right: 10px;
    }
    .van-radio__icon{
      border: 1px solid #e5e5e5;
      border-radius: 50%;
      width: 14px;
      height: 14px;
      background-color: #fff;
      padding: 2px;
      background-clip: content-box;
    }
    .van-radio__icon--checked{
      border-color: #f75959;
      background-color: #f75959;
    }
    .van-icon{
      display: none;
    }
  }
  .btn-box{
    margin-top: 10px;
    padding: 15px 15px 32px;
    background-color: #fff;
    .btn-primary{
      text-align: center;
      line-height: 44px;
      font-size: 14px;
      width: 100%;
      height: 44px;
    }
  }
  .no-border{
    border-bottom:0 !important;
  }
}
</style>