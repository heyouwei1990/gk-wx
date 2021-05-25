<template>
  <div class="contractPdf">
    <van-nav-bar
      title="合同"
      left-arrow
      fixed
      class="primary-header"
      :right-text="rightText"
      @click-left="$router.go(-1)"
      @click-right="callSign"
    />
    <iframe :src="path" frameborder="0"></iframe>
    <van-popup v-model="showPrompt">
      <div class="form">
        <div class="form-item">
          <input class="input" type="tel" v-model="phone" readonly>
        </div>
        <div class="form-item">
          <input class="input" type="number" v-model="code" placeholder="验证码">
          <button class="btn-code" :disabled="isDisabled" @click="getCode">{{btnText}}</button>
        </div>
        <button class="btn-primary" @click="sign">确认</button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import {BASEURL} from '@/common/request.js'
import {mapState} from 'vuex'
import {TianWeiSendMobileCode,UserSignContract} from '@/common/api.js'
export default {
  data(){
    return{
      path:'',
      rightText:'签约',
      showPrompt:false,
      btnText:'发送验证码',
      phone:'',
      code:'',
      timer:null,
      isDisabled:false,
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  created() {
    this.rightText=this.$route.query.type==1?'':'签约';
    this.path=BASEURL+'/pdf/web/viewer.html?file='+this.$route.query.path;
    // if(process.env.VUE_APP_MODE=='production'){
    //   this.path=BASEURL+'/pdf/web/viewer.html?file='+this.$route.query.path;
    // }else{
    //   let url=decodeURIComponent(this.$route.query.path);
    //   url=url.replace(BASEURL,'http://api.gongkongbpo.qa');
    //   this.path=http://api.gongkongbpo.qa/pdf/web/viewer.html?file='+encodeURIComponent(url);
    // }
    
  },
  mounted() {
    this.phone=this.userData.Handset;
  },
  methods: {
    callSign(){
      if(this.$route.query.type==1){
        return;
      }
      if(!this.userData.RealNameStatus){
        let that=this;
        this.$toast({
          message:'请先实名认证',
          onOpened(){
            if(that.userData.LoginType==1){
              that.$router.push('/personRealName');
            }
            if(that.userData.LoginType==2){
              that.$router.push('/companyRealName');
            }
          }
        })
        return;
      }
      this.showPrompt=true;
    },
    getCode(){
      var params={
        phone:this.phone,
        codeType:111,
        platform:'pcweb'
      }
      if(this.userData.LoginType==1){
        params['loginUserId']=this.userData.LoginId;
      }
      if(this.userData.LoginType==2){
        params['loginCompanyId']=this.userData.LoginId;
      }
      TianWeiSendMobileCode(params).then(r=>{
        if(r.Result==1){
          this.$toast('发送成功！');
          this.isDiabled=true;
          let sec=60;
          this.timer=setInterval(() => {
            sec--;
            this.btnText=`${sec}s`;
            if(sec<=0){
              clearInterval(this.timer);
              this.btnText='获取验证码';
            }
          }, 1000);
        }else{
          this.$toast(r.Message);
        }
      })
    },
    sign(){
      let params={
        mobileCode:this.code,
        userHandset:this.phone,
        contractId:this.$route.query.contractId,
        contractTemplateId:this.$route.query.contractTemplateId,
        platForm:'pcweb',
      }
      if(this.userData.LoginType==1){
        params['loginUserId']=this.userData.LoginId;
      }
      if(this.userData.LoginType==2){
        params['loginCompanyId']=this.userData.LoginId;
      }
      UserSignContract(params).then(r=>{
        if(r.Result==1){
          this.showprompt=false;
          this.$toast('签约成功');
          let that=this;
          this.$toast({
            type:'success',
            message:'签约成功',
            onOpened(){
              that.$router.go(-1);
            }
          })
          
        }else{
          this.$toast(r.Message);
        }
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer=null;
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.contractPdf{
  padding-top: 46px;
  min-height: 100vh;
  iframe{
    display: block;
    width: 100%;
    height: calc(100vh - 46px);
    background-color: #f8f8f8;
  }
  .form{
    padding: 20px 20px;
    width: px2rem(660px);
    .form-item{
      display: flex;
      margin-bottom: 15px;
      align-items: center;
    }
    .input{
      font-size: 14px;
      color: #333;
      line-height: 22px;
      padding: 6px 10px;
      height: 36px;
      flex:1;
      min-width: 10px;
      border: 1px solid #e5e5e5;
    }
    .btn-code{
      width: 72px;
      font-size: 12px;
      color: #fff;
      background-color: $primary;
      border: 1px solid $primary;
      border-left: 0;
      height: 36px;
      &:disabled{
        background-color: #e5e5e5;
        color: #666;
      }
    }
    .btn-primary{
      width: 100px;
      height: 32px;
      font-size: 14px;
      display: block;
      margin: 30px auto 0;
    }
  }
}
</style>