<template>
  <div class="editUser">
    <van-nav-bar
      title="编辑基本信息"
      left-arrow
      fixed
      class="primary-header"
      right-text="保存"
      @click-left="$router.go(-1)"
      @click-right="save"
    />
    <div class="info-item middle">
      <span class="label">头像</span>
      <van-uploader :after-read="afterRead" :before-read="beforeRead">
        <img :src="form.HeadImg" alt="" class="avatar">
      </van-uploader>
    </div>
    <div class="info-item readonly">
      <span class="label">用户名：</span>
        <input class="input" readonly type="text" v-model="form.NickName" placeholder="">
    </div>
    <div class="info-item readonly">
      <span class="label">注册手机号：</span>
        <input class="input" readonly type="text" v-model="form.Handset" placeholder="">
    </div>
    <div class="info-item readonly">
      <span class="label">用户类型：</span>
        <input class="input" readonly type="text" v-model="form.RoleName" placeholder="">
    </div>
    <!-- <div class="info-item readonly">
      <span class="label">真实姓名：</span>
        <input class="input" readonly type="text" v-model="form.TrueName" placeholder="">
    </div>
    <div class="info-item readonly">
      <span class="label">身份证号：</span>
        <input class="input" readonly type="text" v-model="form.CardID" placeholder="">
    </div> -->
    <div class="info-item readonly">
      <span class="label">所属公司：</span>
        <input class="input" readonly type="text" v-model="form.CompanyName" placeholder="">
    </div>
    <div class="info-item">
      <span class="label">个人所在地：</span>
      <div class="input" @click="setAddress">{{form.FullAddress}}{{form.Address}}</div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {FileUpload,UpdateUserInfo} from '@/common/api.js'
export default {
  name:'EditUser',
  data(){
    return{
      form:{
        UserId:'',
        HeadImg:'',
        NickName:'',
        Handset:'',
        RoleName:'',
        // TrueName:'',
        // CardID:'',
        Address:'',
        FullAddress:'',
        Lng:0,
        Lat:0,
        CityName:'',
      }
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  watch: {
    '$route'(to,from){
      if(to.path=='/editUser' && from.path=='/location'){
        let mapPoint=this.$store.state.mapPoint;
        if(mapPoint){
          this.$set(this.form,'FullAddress',mapPoint.FullAddress);
          this.$set(this.form,'Lat',mapPoint.Lat);
          this.$set(this.form,'Lng',mapPoint.Lng);
          // this.$set(this.form,'ProvinceId',mapPoint.ProvinceID);
          // this.$set(this.form,'CityId',mapPoint.CityID);
          // this.$set(this.form,'XianId',mapPoint.XianID);
          this.$set(this.form,'Address',mapPoint.DetailLocation);
          this.$set(this.form,'CityName',mapPoint.CityName);
        }
      }
    }
  },
  created() {
    this.form={
      ...this.userData
    }
  },
  methods: {
    setAddress(type){
      this.$store.commit('setMapPoint',null);
      this.$router.push({path:'/location'});
    },
    beforeRead(file) {
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
          this.form.HeadImg=r.Data[0].imgUrl;
        }
      })
    },
    save(){
      UpdateUserInfo(this.form).then(r=>{
        this.$toast(r.Message)
        if(r.Result){
          this.$router.go(-1);
        }
      })
    }
  },
}
</script>
<style lang="scss">
.editUser{
  padding-top: 46px;
  .info-item{
    display:flex;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    min-height: 44px;
    justify-content: space-between;
    background-color: #fff;
    &.readonly{
      background-color: #f8f8f8;
    }
    .label{
      font-size: 14px;
      color: #333;
      line-height: 44px;
      padding-left: 15px;
    }
    .avatar{
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: block;
      margin: 8px 15px;
      background-color: #f8f8f8;
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
    .unit{
      font-size: 14px;
      color: #333;
      line-height: 44px;
      padding-right: 15px;
    }
  }
}
</style>