<template>
  <div class="remittancePage">
    <van-nav-bar
      title="充值"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
    />
    <div class="form-item">
      <span class="label">选择银行</span>
      <div class="picker" @click="$router.push('/searchBank')">
        <span class="placeholder" v-if="!bankName">请选择银行</span>
        {{bankName}}
      </div>
    </div>
    <div class="form-item">
      <span class="label">回执上传</span>
      <van-uploader v-model="previewList" :after-read="afterRead" :before-read="beforeRead" :max-count="3" :max-size="10 * 1024 * 1024">
          
      </van-uploader>
      <p class="tips">注：请上传转账回执照片或将网银支付的截图上传。最多可添加3张图片，每张图片不超过10MB。</p>
    </div>
    <div class="form-item">
      <span class="label">账户信息</span>
      <div class="info-item">公司名称：工控速派（北京）科技服务有限公司</div>
      <div class="info-item">开户银行：上海浦东发展银行北京紫竹院支行</div>
      <div class="info-item">账&emsp;&emsp;号：91260154800008799</div>
    </div>
    <div class="btn-primary" @click="submit">提交</div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {ConfirmRechargeBank,FileUpload} from '@/common/api.js'
export default {
  name:'Remittance',
  data(){
    return{
      bankName:'',
      bankId:'',
      fileList:[],
      previewList:[],
      amount:'',
    }
  },
  computed: {
    ...mapState({
      bank:state=>state.bank,
      userData:state=>state.userData,
    }),
  },
  watch: {
    '$route'(to,from){
      if(to.path=='/remittance' && from.path=='/searchBank'){
        if(this.bank){
          this.bankName=this.bank.CodeName1;
          this.bankId=this.bank.CodeValue;
        }
      }
      if(to.path=='/remittance' && from.path=='/recharge'){
        if(this.bankId){
          this.$router.go(0);
        }
      }
    }
  },
  mounted() {
    this.amount=Number(this.$route.query.amount);
  },
  methods: {
    beforeRead(file) {
      if(this.fileList.length>=3){
        return false;
      }
      var limit=['jpg','jpeg','gif','png','JPG','JPEG','GIF','PNG'];
      let arr=file.name.split('.');
      var index=limit.indexOf(arr[arr.length-1]);
      if(index==-1){
        this.$toast('上传文件格式不正确！');
        return false;
      }
      return true;
    },
    afterRead(file){
      let formdata=new FormData();
      formdata.append('file',file.file,file.file.name);
      FileUpload(formdata).then(r=>{
        if(r.Result==1){
          this.fileList.push(r.Data[0].imgUrl);
        }
      })
    },
    submit(){
      if(this.bankId==''){
        this.$toast('请选择银行！');
        return;
      }
      if(this.fileList.length==0){
        this.$toast('请上传转账凭证！');
        return;
      }
      ConfirmRechargeBank({
        Attachments:this.fileList,
        Money:this.amount,
        BankName:this.bankName,
        BankId:this.bankId,
        UserCode:this.userData.UserCode
      }).then(r=>{
        if(r.Result==1){
          this.$router.replace({path:'/balanceSuccess',query:{type:1}})
        }else{
          this.$toast(r.Message);
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.remittancePage{
  padding-top: 66px;
  min-height: calc(100vh - 46px);
  background-color: #fff;
  .form-item{
    padding: 10px 15px;
    .label{
      display: block;
      margin-bottom: 20px;
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
    .picker{
      width: 100%;
      height: 40px;
      border: 1px solid #e5e5e5;
      position: relative;
      padding: 8px 40px 8px 10px;
      font-size: 14px;
      color: #333;
      line-height: 22px;
      @extend .ellipsis;
      &:after{
        content:"";
        position: absolute;
        right: 10px;
        top: 50%;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-top: 8px solid #e5e5e5;
        margin-top: -3px;
      }
    }
    .tips{
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
    .info-item{
      font-size: 12px;
      color: #666;
      line-height: 24px;
      margin-bottom: 10px;
    }
  }
  .btn-primary{
    display: block;
    width: 60%;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin: 30px auto;
  }
}
</style>