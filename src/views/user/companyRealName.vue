<template>
  <div class="realName">
    <van-nav-bar
      title="实名认证"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <div class="upload-area">
      <van-uploader :after-read="uploadLicense" >
        <div class="file-area">
          <span class="text">上传营业执照</span>
        </div>
        <img :src="form.BusinessLicenseImgPath" v-if="form.BusinessLicenseImgPath" alt="" class="file-img">
      </van-uploader>
    </div>
    <div class="form-item">
      <span class="label">企业名称<i class="required">*</i></span>
      <input class="input" type="text" :readonly="isDisable" v-model.trim="form.CompanyName" placeholder="请输入企业名称">
    </div>
    <div class="form-item">
      <span class="label">企业类型<i class="required">*</i></span>
      <input class="input" type="text" :readonly="isDisable" v-model.trim="form.BusLicenseCompanyType" placeholder="请输入企业类型">
    </div>
    <div class="form-item">
      <span class="label">类型选择<i class="required">*</i></span>
      <div class="picker" @click="showPicker">{{TianWeiYunCompanyType}}</div>
    </div>
    <div class="form-item">
      <span class="label">法人代表<i class="required">*</i></span>
      <input class="input" type="text" :readonly="isDisable" v-model.trim="form.LegalPerson" placeholder="请输入法人代表">
    </div>
    <div class="form-item">
      <span class="label">注册资本<i class="required">*</i></span>
      <input class="input" type="text" :readonly="isDisable" v-model.trim="form.RegisteredCapital" placeholder="请输入注册资本">
    </div>
    <div class="form-item">
      <span class="label">成立日期<i class="required">*</i></span>
      <input class="input" type="text" :readonly="isDisable" v-model.trim="form.EstablishmentDate" placeholder="工商注册成立日期">
    </div>
    <div class="form-item">
      <span class="label">营业期限<i class="required">*</i></span>
      <input class="input" type="text" :readonly="isDisable" v-model.trim="form.BusinessTerm" placeholder="工商注册营业期限">
    </div>
    <div class="form-item">
      <span class="label">地址<i class="required">*</i></span>
      <input class="input" type="text" :readonly="isDisable" v-model.trim="form.RegisterAddress" placeholder="请输入注册地址">
    </div>
    <div class="form-item">
      <span class="label">营业执照编号<i class="required">*</i></span>
      <input class="input" type="text" :readonly="isDisable" v-model.trim="form.BusinessLicense" placeholder="请输入营业执照编号">
    </div>
    <button class="btn-primary" @click="submit">提交认证</button>
    <van-popup v-model="showTypePicker" position="bottom">
      <van-picker 
        :columns="types" 
        show-toolbar 
        value-key="label" 
        @confirm="selectTypes"
        @cancel="showTypePicker=false"
      >
      </van-picker>
    </van-popup>
  </div>
</template>
<script>
import {FileUpload,scanLicense,RealNameEnterpriseAuth} from '@/common/api.js'
import { FormatTime } from "@/common/util.js";
import {mapState} from 'vuex'
export default {
  data(){
    return{
      form:{
        BusinessLicenseImgPath:'',
        CompanyName:'',
        BusinessLicense:'',
        BusLicenseCompanyType:'',
        TianWeiYunCompanyType:'',
        EstablishmentDate:'',
        BusinessTerm:'',
        LegalPerson:'',
        RegisteredCapital:'',
        RegisterAddress:'',
      },
      licenseData:null,
      types:[
        {
          label:'企业（ET_PE）',
          value:'ET_PE',
        },
        {
          label:'个体工商户（ET_SE）',
          value:'ET_SE',
        },
        {
          label:'政府机构/事业单位（ET_OU）',
          value:'ET_OU',
        }
      ],
      showTypePicker:false,
      TianWeiYunCompanyType:'',
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    }),
    isDisable(){
      if(this.form.BusinessLicenseImgPath=='' || this.form.BusinessLicenseImgPath==''){
        return true;
      }
      return false;
    }
  },
  created() {
    
  },
  methods: {
    //上传营业执照
    uploadLicense(file,res){
      let formdata=new FormData();
      formdata.append('file',file.file,file.file.name);
      FileUpload(formdata).then(res=>{
        if(res.Result==1){
          this.form.BusinessLicenseImgPath=res.Data[0].imgUrl;
          scanLicense({
            AI_BUSINESS_LICENSE_IMAGE:this.form.BusinessLicenseImgPath,
            AI_BUSINESS_LICENSE_IMAGE_TYPE:'1',
          }).then(r=>{
            this.licenseData={...r};
            this.form.CompanyName=r.ENTERPRISE_NAME_CH;
            this.form.BusLicenseCompanyType=r.ENTERPRISE_TYPE;
            this.form.EstablishmentDate=r.ENTERPRISE_TIME;
            this.form.LegalPerson=r.ENTERPRISE_OWNER;
            this.form.RegisteredCapital=r.ENTERPRISE_CAPITAL;
            this.form.RegisterAddress=r.ENTERPRISE_REGISTER_ADDRESS;
            this.form.BusinessLicense=r.ENTERPRISE_ID;
            if(r.ENTERPRISE_VALID_DATE_START && r.ENTERPRISE_VALID_DATE_END){
              this.form.BusinessTerm=r.ENTERPRISE_VALID_DATE_START+'至'+r.ENTERPRISE_VALID_DATE_END;
            }
            if(r.ENTERPRISE_VALID_DATE_START){
              this.form.BusinessTerm=r.ENTERPRISE_VALID_DATE_START;
            }
            if(r.ENTERPRISE_VALID_DATE_END){
              this.form.BusinessTerm=r.ENTERPRISE_VALID_DATE_END;
            }
            this.form.TianWeiYunCompanyType=this.types[0].value;
            this.TianWeiYunCompanyType=this.types[0].label;
          })
        }
      })
      
    },
    //打开类型筛选
    showPicker(){
      if(this.isDisable){
        return;
      }
      this.showTypePicker=true
    },
    //类型确认
    selectTypes(data){
      this.form.TianWeiYunCompanyType=data.value;
      this.TianWeiYunCompanyType=data.label;
      if((this.form.TianWeiYunCompanyType=='ET_PE' || this.form.TianWeiYunCompanyType=='ET_SE') && this.licenseData){
        this.form.BusinessLicense=this.licenseData.ENTERPRISE_ID;
      }
      if(this.form.TianWeiYunCompanyType=='ET_OU' && this.licenseData){
        this.form.BusinessLicense=this.licenseData.ENTERPRISE_UNIVERSAL_CREDIT_ID_AGENCY_CODE;
      }
      this.showTypePicker=false;
    },
    submit(){
      if(this.form.BusinessLicenseImgPath==''){
        this.$toast('请上传营业执照');
        return;
      }
      if(this.form.CompanyName==''){
        this.$toast('请输入企业名称');
        return;
      }
      if(this.form.BusLicenseCompanyType==''){
        this.$toast('请输入企业类型');
        return;
      }
      if(this.form.TianWeiYunCompanyType==''){
        this.$toast('请选择企业类型');
        return;
      }
      if(this.form.LegalPerson==''){
        this.$toast('请输入企业法人代表');
        return;
      }
      if(this.form.RegisteredCapital==''){
        this.$toast('请输入注册资本');
        return;
      }
      if(this.form.EstablishmentDate==''){
        this.$toast('请输入企业成立日期');
        return;
      }
      if(this.form.BusinessTerm==''){
        this.$toast('请输入企业营业期限');
        return;
      }
      if(this.form.RegisterAddress==''){
        this.$toast('请输入企业注册地址');
        return;
      }
      if(this.form.BusinessLicense==''){
        this.$toast('请输入营业执照编号');
        return;
      }
      let params={
        ...this.form,
        IsValidPerson:false,
        UserCode:this.userData.UserCode,
      }
      RealNameEnterpriseAuth(params).then(r=>{
        if(r.Result==1){
          let that=this;
          this.$toast({
            message:'认证成功',
            type:'success',
            onOpened(){
              that.$router.go(-1);
            }
          })
        }else{
          this.$toast(r.Message);
        }
      })
    },
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.realName{
  padding-top: 46px;
  background-color: #fff;
  min-height: 100vh;
  .van-uploader{
    width: 100%;
    display: block;
    margin-bottom: 15px;
  }
  .van-uploader__input-wrapper{
    width: 100%;
    display: block;
  }
  .van-uploader__input{
    z-index: 3;
  }
  .upload-area{
    padding: 15px 15px 0;
    overflow: hidden;
    @include bb;
  }
  .file-area{
    display: block;
    width: 100%;
    height: px2rem(400px);
    border: 1px dashed #e5e5e5;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;
    &:after,&:before{
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      background-color: #e5e5e5;
      transform: translate3d(-50%,-50%,0);
    }
    &:after{
      width: 80px;
      height: 4px;
    }
    &:before{
      width: 4px;
      height: 80px;
    }
    .text{
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: 50px;
      font-size: 12px;
      color: #999;
      text-align: center;
      line-height: 2;
      width: 100%;
    }
  }
  .file-img{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    outline: none;
  }
  .form-item{
    display:flex;
    align-items: center;
    width: 100%;
    min-height: 44px;
    justify-content: space-between;
    background-color: #fff;
    @include bb;
    &.readonly{
      background-color: #f8f8f8;
    }
    .label{
      font-size: 14px;
      color: #333;
      line-height: 44px;
      padding-left: 15px;
    }
    .required{
      vertical-align: middle;
    }
    .input{
      font-size: 14px;
      color: #333;
      line-height: 44px;
      text-align: right;
      height: 44px;
      flex:1;
      padding-right: 15px;
      padding-left: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .picker{
      font-size: 14px;
      color: #333;
      line-height: 44px;
      text-align: right;
      height: 44px;
      flex:1;
      padding-right: 30px;
      padding-left: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:after{
        content: "\F00A";
        font-family: 'vant-icon';
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .btn-primary{
    display: block;
    width: 160px;
    height: 40px;
    line-height: 40px;
    margin: 60px auto 40px;
    font-size: 14px;
  }
}
</style>