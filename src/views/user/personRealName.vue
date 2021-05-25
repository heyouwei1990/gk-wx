<template>
  <div class="realName">
    <van-nav-bar
      title="实名认证"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <div class="tips">实名认证用于认证您的真实身份并在<br>您提现时确保是本人操作</div>
    <div class="upload-area">
      <van-uploader :after-read="uploadIDFace" accept="image/*" :max-size="1024*1024*10" max-count="1" @oversize="$toast('图片不能超过10M')">
        <div class="file-area">
          <span class="text">身份证正面（人像）</span>
        </div>
        <img :src="form.IdCardFrontImg" v-if="form.IdCardFrontImg" alt="" class="file-img">
      </van-uploader>
      <van-uploader :after-read="uploadIDBack" accept="image/*" :max-size="1024*1024*10" max-count="1" @oversize="$toast('图片不能超过10M')">
        <div class="file-area">
          <span class="text">身份证反面（国徽）</span>
        </div>
        <img :src="form.IdCardBackImg" v-if="form.IdCardBackImg" alt="" class="file-img">
      </van-uploader>
    </div>
    <div class="form-item">
      <span class="label">用户名<i class="required">*</i></span>
      <input class="input" type="text" v-model.trim="form.TrueName" placeholder="请输入真实姓名">
    </div>
    <div class="form-item">
      <span class="label">性别<i class="required">*</i></span>
      <van-radio-group v-model="form.Sex" direction="horizontal">
        <van-radio :name="1">男</van-radio>
        <van-radio :name="2">女</van-radio>
      </van-radio-group>
    </div>
    <div class="form-item">
      <span class="label">出生日期<i class="required">*</i></span>
      <button class="picker" @click="showBirthday=true">{{form.Birthday}}</button>
    </div>
    <div class="form-item">
      <span class="label">身份证号<i class="required">*</i></span>
      <input class="input" type="text" v-model.trim="form.IdCardNo" placeholder="请输入身份证号">
    </div>
    <div class="form-item">
      <span class="label">居住地址<i class="required">*</i></span>
      <input class="input" type="text" v-model.trim="form.FamilyAddress" placeholder="请输入地址">
    </div>
    <div class="form-item" >
      <span class="label">有效期<i class="required">*</i></span>
      <button class="picker" @click="showStartDate=true">
        {{form.IdCardStartDt}}
        <template v-if="form.IdCardEndDt">
          ~
        </template>
        {{form.IdCardEndDt}}
      </button>
    </div>
    <div class="upload-area">
      <van-uploader :after-read="uploadPhote" accept="image/*" :max-size="1024*1024*10" max-count="1">
        <div class="file-area">
          <span class="text">本人近期照片</span>
        </div>
        <img :src="form.PhotoUrl" v-if="form.PhotoUrl" alt="" class="file-img">
      </van-uploader>
    </div>
    <div class="btn-group">
      <button class="btn-primary" @click="validate">提交认证</button>
      <van-uploader ref="uploadVideo" :after-read="uploadVideo" accept="video/*" capture="user" :max-size="1024*1024*3" max-count="1" @oversize="$toast('视频不能超过3M')">
        <div></div>
      </van-uploader>
    </div>
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        v-model="birthday"
        type="date"
        :formatter="formatter"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="pickBirthday"
        @cancel="showBirthday=false"
      />
    </van-popup>
    <van-popup v-model="showStartDate" position="bottom">
      <van-datetime-picker
        v-model="startDate"
        type="date"
        :formatter="formatter"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="pickStartDate"
        @cancel="showStartDate=false"
      />
    </van-popup>
    <van-popup v-model="showEndDate" position="bottom">
      <van-datetime-picker
        class="end-picker"
        v-model="endDate"
        type="date"
        cancel-button-text="长期"
        :formatter="formatter"
        :min-date="startDate"
        :max-date="maxDate"
        @confirm="pickEndDate"
        @cancel="checkLongterm"
      />
    </van-popup>
  </div>
</template>
<script>
import {FileUpload,scanID,RealNamePersonAuth,scanFace,AddErrorLog} from '@/common/api.js'
import { FormatTime } from "@/common/util.js";
import {mapState} from 'vuex'
export default {
  data(){
    return{
      form:{
        Birthday:'',
        TrueName:'',
        Sex:'',
        IdCardNo:'',
        FamilyAddress:'',
        IdCardFrontImg:'',
        IdCardBackImg:'',
        IdCardStartDt:'',
        IdCardEndDt:'',
        PhotoUrl:'',
      },
      items:[{value:1,text:'男'},{value:2,text:'女'}],
      expiryDate:'',
      showBirthday:false,
      showStartDate:false,
      showEndDate:false,
      birthday:new Date(),
      startDate:new Date(),
      endDate:new Date(),
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    }),
    minDate(){
      return new Date(1900, 0, 1);
    },
    maxDate(){
      return new Date(2099,11,31);
    },
    isDisable(){
      if(this.form.IdCardFrontImg=='' || this.form.IdCardBackImg==''){
        return true;
      }
      return false;
    }
  },
  created() {
    AddErrorLog();
    //企业认证进入个人认证，页面刷新导致数据清空，返回验证营业执照
    if(this.userData.LoginType==2 && this.$route.params.IsValidPerson!==true){
      this.$router.go(-1);
    }
  },
  methods: {
    // 上传身份证正面
    uploadIDFace(file,res){
      let formdata=new FormData();
      formdata.append('file',file.file,file.file.name);
      FileUpload(formdata).then(res=>{
        if(res.Result==1){
          this.form.IdCardFrontImg=res.Data[0].imgUrl;
          scanID({
            AI_IDCARD_IMAGE:this.form.IdCardFrontImg,
            AI_IDCARD_IMAGE_TYPE:'1',
            AI_IDCARD_SIDE:'FRONT'
          }).then(r=>{
            if(r.PERSON_ID_SIDE_ENTITY.PERSON_ID_FRONT_SIDE_AMOUNT==1){
              this.form.TrueName=r.PERSON_ID_ENTITY.PERSON_NAME;
              this.form.Sex=r.PERSON_ID_ENTITY.PERSON_SEX=='男'?1:2;
              this.form.IdCardNo=r.PERSON_ID_ENTITY.PERSON_ID;
              this.form.FamilyAddress=r.PERSON_ID_ENTITY.PERSON_ADDRESS;
              let birthday=r.PERSON_ID_ENTITY.PERSON_BIRTH.replace('年','-').replace('月','-').replace('日','');
              let arr=birthday.split('-');
              let month=arr[1]>9?arr[1]:'0'+arr[1];
              let date=arr[2]>9?arr[2]:'0'+arr[2];
              this.form.Birthday=arr[0]+'-'+month+'-'+date;
              this.birthday=new Date(this.form.Birthday);
            }
          })
        }
      })
    },
    // 上传身份证反面
    uploadIDBack(file,res){
      let formdata=new FormData();
      formdata.append('file',file.file,file.file.name);
      FileUpload(formdata).then(res=>{
        if(res.Result==1){
          this.form.IdCardBackImg=res.Data[0].imgUrl;
          scanID({
            AI_IDCARD_IMAGE:this.form.IdCardBackImg,
            AI_IDCARD_IMAGE_TYPE:'1',
            AI_IDCARD_SIDE:'BACK'
          }).then(r=>{
            if(r.PERSON_ID_SIDE_ENTITY.PERSON_ID_BACK_SIDE_AMOUNT==1){
              let time=r.PERSON_ID_ENTITY.TIME_ZONE;
              let arr=time.split('-');
              this.form.IdCardStartDt=arr[0].replace(/\./g,'-');
              this.form.IdCardEndDt=arr[1].replace(/\./g,'-');
              this.startDate=new Date(this.form.IdCardStartDt);
              this.endDate=new Date(this.form.IdCardEndDt);
            }
          })
        }
      })
    },
    uploadPhote(file,res){
      let formdata=new FormData();
      formdata.append('file',file.file,file.file.name);
      FileUpload(formdata).then(res=>{
        if(res.Result==1){
          this.form.PhotoUrl=res.Data[0].imgUrl;
        }
      })
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`;
      }
      return val;
    },
    //选择生日
    pickBirthday(){
      this.form.Birthday=FormatTime(this.birthday,'yyyy-MM-dd');
      this.showBirthday=false;
    },
    //选择有效时间
    pickStartDate(){
      this.showStartDate=false;
      this.showEndDate=true;
    },
    //选择有效时间
    pickEndDate(){
      this.form.IdCardStartDt=FormatTime(this.startDate,'yyyy-MM-dd');
      this.form.IdCardEndDt=FormatTime(this.endDate,'yyyy-MM-dd');
      this.showEndDate=false;
    },
    //选择长期
    checkLongterm(){
      this.form.IdCardStartDt=FormatTime(this.startDate,'yyyy-MM-dd');
      this.endDate='长期';
      this.form.IdCardEndDt='长期';
      this.showEndDate=false;
    },
    //上传视频人脸识别
    uploadVideo(file,res){
      // console.log(file.content);
      var base64=file.content.split(',')[1];
      scanFace({
        name:this.form.TrueName,
        idnumber:this.form.IdCardNo,
        videoFile:base64,
        orderNo:123,
      }).then(r=>{
        if(r.Result==1){
          let that=this;
          this.$toast({
            message:r.Data.message,
            type:'success',
            onOpened(){
              that.submit();
            }
          })
        }else{
          this.$toast(r.Data.message);
        }
      }).catch(err=>{
        console.log(err);
        // this.$dialog.alert(err);
      })
    },
    validate(){
      if(this.form.IdCardFrontImg==''){
        this.$toast('请上传身份证正面照片');
        return false;
      }
      if(this.form.IdCardBackImg==''){
        this.$toast('请上传身份证反面照片');
        return false;
      }
      if(this.form.TrueName==''){
        this.$toast('请输入真实姓名');
        return false;
      }
      if(this.form.Sex==''){
        this.$toast('请选择性别');
        return false;
      }
      if(this.form.Birthday==''){
        this.$toast('请选择出生日期');
        return false;
      }
      if(this.form.IdCardNo==''){
        this.$toast('请输入身份证号码');
        return false;
      }
      if(this.form.FamilyAddress==''){
        this.$toast('请输入居住地址');
        return false;
      }
      if(this.form.IdCardStartDt=='' || this.form.IdCardEndDt==''){
        this.$toast('请选择身份证有效期');
        return false;
      }
      if(this.form.PhotoUrl==''){
        this.$toast('请上传近期照片');
        return false;
      }
      this.$refs.uploadVideo.chooseFile();
    },
    // 提交认证
    submit(){
      let params={}
      params={
        ...this.form,
        UserCode:this.userData.UserCode
      }
      RealNamePersonAuth(params).then(r=>{
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
      
    }
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
  .end-picker{
    .van-picker__cancel{
      color: blue;
    }
  }
  .tips{
    background-color: #f9f9f9;
    padding: 6px 15px;
    text-align: center;
    font-size: 13px;
    color: #333;
    line-height: 20px;
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
  .file-photo{
    width: 100px;
    height: 100px;
    margin-left: 15px;
    margin-top: 15px;
    overflow: hidden;
    .file-area{
      height: 100px;
      &:before{
        height: 40px;
      }
      &:after{
        width: 40px;
      }
    }
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
      display: block;
      background-color: #fff;
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
    .unit{
      font-size: 14px;
      color: #333;
      line-height: 44px;
      padding-right: 15px;
    }
    .van-radio{
      font-size: 14px;
    }
    .van-icon-success{
        width: 16px;
        height: 16px;
        margin-top: 2px;
    }
    .van-radio__icon--checked{
      .van-icon-success{
        background-color: $primary;
        border-color: $primary;
        padding: 3px;
        background-clip: content-box;
        &:before{
          content: "";
        }
      }
    }
    
  }
  .btn-group{
    display: block;
    margin: 60px auto 40px;
    text-align: center;
    .van-uploader{
      display: inline-block;
      width: auto;
    }
    .btn-primary{
      width: 160px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
    }
  }
}
</style>