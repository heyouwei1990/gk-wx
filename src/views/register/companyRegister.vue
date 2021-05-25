<template>
  <div class="companyRegister">
    <van-nav-bar
      title="企业注册"
      right-text="个人注册"
      left-arrow
      fixed
      :border="false"
      @click-left="$router.go(-1)"
      @click-right="checkOther"
    />
    <div class="form-item file-item">
      <van-uploader :after-read="upload" :max-count="1">
        <img v-if="form.businessLicense" class="preview" :src="form.businessLicense" alt="">
        <i v-else class="btn-file">上传营业执照<span style="display: block;font-size: 12px;-moz-transform:scale(0.83,0.83);-webkit-transform:scale(0.83,0.83);-o-transform:scale(0.83,0.83);transform: scale(0.83,0.83);">(JPG/PNG/BMP)</span></i>
      </van-uploader>
    </div>
    <div class="form-item" v-show="isItems">
      <label for="">企业名称</label>
      <input type="text" v-model.trim="form.enterpriseNameCh" class="input" placeholder="营业执照的工商注册名称">
    </div>
    <div class="form-item" v-show="isItems">
      <label for="">企业类型</label>
      <input type="text" v-model.trim="form.enterpriseType" class="input" placeholder="工商注册公司类型">
    </div>
    <div class="form-item" v-show="isItems">
      <!-- <van-field
          readonly
          clickable
          label="类型选择"
          :value="value"
          placeholder="选择企业类型"
          input-align="right"
          @click="showPicker = true"
        /> -->
      <label for="">类型选择</label>
      <div class="picker" @click="showPicker=true">{{TianWeiYunCompanyType}}</div>
    </div>
    <div class="form-item" v-show="isItems">
      <label for="">法人代表</label>
      <input type="text" v-model.trim="form.enterpriseOwner" class="input" placeholder="工商注册法人姓名">
    </div>
    <div class="form-item" v-show="isItems">
      <label for="">注册资本</label>
      <input type="text" v-model.trim="form.enterpriseCapital" class="input" placeholder="工商注册资本">
    </div>
    <div class="form-item" v-show="isItems">
      <label for="">成立日期</label>
      <input type="text" v-model.trim="form.enterpriseTime" class="input" placeholder="工商注册成立日期">
    </div>
    <div class="form-item" v-show="isItems">
      <label for="">营业期限</label>
      <input type="text" v-model.trim="form.enterpriseValidDateStartAndEnd" class="input" placeholder="工商注册营业期限">
    </div>
    <div class="form-item" v-show="isItems">
      <label for="">地址</label>
      <input type="text" v-model.trim="form.enterpriseRegisterAddress" class="input" placeholder="工商注册地址">
    </div>
    <div class="form-item" v-show="isItems">
      <label for="">营业执照编号</label>
      <input type="text" v-model.trim="form.enterpriseIdCode" maxlength="30" class="input" placeholder="即三证合一的企业纳税识别号">
    </div>
    <button class="btn-primary" v-show="isItems" @click="next">下一步</button>
    <!-- <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup> -->
    <van-popup v-model="showPicker" position="bottom">
      <van-picker 
        :columns="types" 
        show-toolbar 
        value-key="label" 
        @confirm="onConfirm"
        @cancel="showPicker=false"
      >
      </van-picker>
    </van-popup>
  </div>
</template>
<script>
import {FileUpload,scanLicense,RealNameEnterpriseAuth} from '@/common/api.js'
export default {
  name:'CompanyRegister',
  data(){
    return{
      form:{
        enterpriseNameCh:'',              //营业执照的工商注册名称
        enterpriseType: '',               //工商注册公司类型
        enterpriseOwner: '',              //工商注册法人姓名
        enterpriseCapital: '',            //工商注册资本
        enterpriseTime:'',                //工商注册成立日期
        enterpriseValidDateStartAndEnd:'',//工商注册营业期限
        enterpriseRegisterAddress: '',    //工商注册地址
        enterpriseIdCode:'',              //即三证合一的企业纳税识别号
        businessLicense:'',               //上传营业执照的地址
        indexItem:'',                     //天威企业类型
      },
      ou:'',                              //选择政府机构/事业单位（ET-OU）调用
      peSe: '',                           //选择企业（ET—PE）或个人工商户（ET-SE）调用
      showProtocol:false,
      isItems:false,  //上传完营业执照之后显示
      value: '',
      showPicker:false, //显示下拉
      // columns:['企业(ET_PE)','个体工商户(ET_SE)','政府机构/事业单位(ET_OU)'],
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
      TianWeiYunCompanyType:'',
    }
  },
  methods: {
    checkOther(){
      this.$router.push('/personRegister');
    },
    upload(data){
      let formdata=new FormData();
      formdata.append('file',data.file,data.file.name);
      FileUpload(formdata).then(r=>{
        if(r.Result==1){
          this.form.businessLicense=r.Data[0].imgUrl;
          scanLicense({
            'AI_BUSINESS_LICENSE_IMAGE':r.Data[0].imgUrl,
            'AI_BUSINESS_LICENSE_IMAGE_TYPE':1
          }).then(res=>{
            this.form.enterpriseNameCh = res.ENTERPRISE_NAME_CH;
            this.form.enterpriseType = res.ENTERPRISE_TYPE;
            this.form.enterpriseOwner = res.ENTERPRISE_OWNER;
            this.form.enterpriseCapital = res.ENTERPRISE_CAPITAL;
            this.form.enterpriseTime = res.ENTERPRISE_TIME;
            if(!res.ENTERPRISE_VALID_DATE_END){
              this.form.enterpriseValidDateStartAndEnd = res.ENTERPRISE_VALID_DATE_START;
            }else{
              this.form.enterpriseValidDateStartAndEnd = res.ENTERPRISE_VALID_DATE_START + ' - ' + res.ENTERPRISE_VALID_DATE_END;
            }
            this.form.enterpriseRegisterAddress = res.ENTERPRISE_REGISTER_ADDRESS;
            this.form.enterpriseIdCode = res.ENTERPRISE_ID;
            this.ou = res.ENTERPRISE_UNIVERSAL_CREDIT_ID_AGENCY_CODE;
            this.peSe = res.ENTERPRISE_ID;
            //默认企业类型
            this.form.indexItem=this.types[0].value;
            this.TianWeiYunCompanyType=this.types[0].label;
          })
          this.isItems = true;
        }
      })
    },
    next(){
      if(!this.form.indexItem){
        this.$toast("请选择企业类型");
        return;
      }
      var data = {
          IsValidPerson: false,
          BusinessLicenseImgPath: this.form.businessLicense,
          CompanyName: this.form.enterpriseNameCh,                                        //企业名称
          BusinessLicense: this.form.enterpriseIdCode,                                    //营业执照编号
          BusLicenseCompanyType: this.form.enterpriseType,                                //营业执照企业类型
          TianWeiYunCompanyType: this.form.indexItem,                                     //天威云企业类型
          EstablishmentDate: this.form.enterpriseTime,                                    //企业成立日期
          BusinessTerm: this.form.enterpriseValidDateStartAndEnd,                         //营业期限
          LegalPerson: this.form.enterpriseOwner,                                         //企业法人
          RegisteredCapital: this.form.enterpriseCapital,                                 //注册资本
          RegisterAddress: this.form.enterpriseRegisterAddress,                           //注册地址
          UserCode: 'e0',                                                                 //用户id
          platform: 'pcweb'
      }
      console.log(data)
      RealNameEnterpriseAuth(data).then(res=>{
        if (res.Result == 1) {
              if (res.Data) {
                  this.$toast("验证成功!");
                  this.$router.push({path:'/companyRegisterNext',query:{...this.form}})
              } else {
                this.$toast(res.Message);
              }
          } else {
            this.$toast(res.Message);
          }
      })
      // this.$router.push({path:'/companyRegisterNext',query:{...this.form}})
    },
    onConfirm(data) {
      this.form.indexItem=data.value;
      this.TianWeiYunCompanyType=data.label;
      if(this.form.indexItem=='ET_PE' || this.form.indexItem=='ET_SE'){
        this.form.BusinessLicense=this.peSe;
      }
      if(this.form.indexItem=='ET_OU'){
        this.form.BusinessLicense=this.ou;
      }
      this.showPicker=false;
    },
  },
}
</script>
<style lang="scss" >
.companyRegister{
  padding: 50px 0 20px;
  background-color: #fff;
  .form{
    width: 100%;
    margin: 0 auto;
  }
  .form-item{
    padding: 0 15px;
    width: 100%;
    position: relative;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #d5d5d5;
    border-bottom: none;
    label {
      font-size:14px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:30px;
    }
    .picker{
      font-size: 14px;
      color: #333;
      line-height: 44px;
      text-align: right;
      height: 44px;
      flex:1;
      padding-right: 10px;
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
  .input{
    // width: 100%;
    min-width: 100px;
    height: 44px;
    line-height: 24px;
    font-size: 14px;
    color: #333;
    // border: 1px solid #d5d5d5;
    text-align: right;
    padding-left: 20px;
  }
  .btn-primary{
    display: block;
    width: 50%;
    margin: 60px auto 0;
    text-align: center;
    line-height: 44px;
    height: 44px;
    background-color: #f75959;
    color: #fff;
    font-size: 14px;
  }
  .form-item.file-item{
    border-top: none;
    height: 200px;
  }
  .van-uploader,.van-uploader__wrapper{
    display: block;
    width: 100%;
  }
  .preview{
    display: block;
    width: 100%;
    height: 180px;
  }
  .btn-file{
    display: block;
    width: 100%;
    height: 180px;
    border: 1px solid #d5d5d5;
    padding-top: 130px;
    text-align: center;
    font-size: 14px;
    color: #999;
    line-height: 1.5;
    &:before,&:after{
      content:'';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      background-color: #d5d5d5;
      margin-top: -20px;
    }
    &:before{
      width: 80px;
      height: 4px;
    }
    &:after{
      height: 80px;
      width: 4px;
    }
  }
}
.van-cell {
  padding: 0;
}
</style>