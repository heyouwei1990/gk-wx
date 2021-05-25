<template>
  <div class="editComapny">
    <van-nav-bar
      title="编辑基本信息"
      class="primary-header"
      left-arrow
      fixed
      right-text="保存"
      :border="false"
      @click-left="$router.go(-1)"
      @click-right="save"
    />
    <div class="info-item">
        <span class="label">LOGO</span>
        <van-uploader :after-read="afterRead" :before-read="beforeRead">
          <img :src="form.Logo" alt="" class="avatar">
        </van-uploader>
      </div>
      <div class="info-item readonly">
        <span class="label">企业名称：</span>
        <input class="input" readonly type="text" v-model="form.CompanyName" placeholder="">
      </div>
      <div class="info-item readonly">
        <span class="label">企业类型：</span>
        <input class="input" readonly type="text" v-model="form.CompanyType" placeholder="">
      </div>
      <div class="info-item readonly">
        <span class="label">企业账号：</span>
        <input class="input" readonly type="text" v-model="form.LoginName" placeholder="">
      </div>
      <div class="info-item readonly">
        <span class="label">联系人：</span>
        <input class="input" readonly type="text" v-model="form.LinkMan" placeholder="">
      </div>
      <div class="info-item readonly">
        <span class="label">联系方式：</span>
        <input class="input" readonly type="text" v-model="form.HandSet" placeholder="">
      </div>
      <div class="info-item readonly">
        <span class="label">联系人职位：</span>
        <input class="input" readonly type="text" v-model="form.LinkManPostName" placeholder="">
      </div>
      <div class="info-item">
        <span class="label">企业所在地：</span>
        <div class="input" @click="setAddress(1)">{{form.Fulladdress}}{{form.DetailLocation}}</div>
      </div>
      <div class="info-item">
        <span class="label">所属大区：</span>
        <div class="input" @click="showArea=true">{{form.AreaCategoryName}}</div>
      </div>
      <div class="info-item">
        <span class="label">所属行业：</span>
        <div class="input" @click="showIndustry=true">{{form.IndustryName}}</div>
      </div>
      <div class="info-item">
        <span class="label">成立时间：</span>
        <div class="input" @click="showDatePicker">{{form.EstablishmentTime}}</div>
      </div>
      <div class="info-item">
        <span class="label">固定电话：</span>
        <input class="input" type="text" v-model="form.Tel" placeholder="">
      </div>
      <div class="info-item">
        <span class="label">企业规模：</span>
        <div class="input" @click="showScale=true">{{scaleName}}</div>
      </div>
      <div class="info-item readonly">
        <span class="label">注册资本：</span>
        <input class="input" readonly type="text" v-model="form.BusLicenseRegisteredCapital" placeholder="">
        <!-- <span class="unit">万</span> -->
      </div>
      <div class="info-item readonly">
        <span class="label">企业注册地：</span>
        <div class="input">{{form.RegisterAddress}}</div>
      </div>
      <!-- 行业弹框 -->
      <van-popup position="bottom" v-model="showIndustry">
        <van-picker 
          :columns="industryList" 
          value-key="name" 
          :show-toolbar="true"
          @confirm="pickIndustry"
          @cancel="showIndustry=false"
        ></van-picker>
      </van-popup>
      <!-- 规模 -->
      <van-popup position="bottom" v-model="showScale">
        <van-picker 
          :columns="scaleList" 
          value-key="name" 
          :show-toolbar="true"
          @confirm="pickScale"
          @cancel="showScale=false"
        ></van-picker>
      </van-popup>
      <!-- 选择大区 -->
      <van-popup position="bottom" v-model="showArea">
        <van-picker 
          :columns="areaList" 
          value-key="name" 
          :show-toolbar="true"
          @confirm="pickArea"
          @cancel="showArea=false"
        ></van-picker>
      </van-popup>
      <!-- 选择日期 -->
      <van-popup position="bottom" v-model="showDate">
        <van-datetime-picker
          v-model="defaultDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          @confirm="pickDate"
          @cancel="showDate=false"
        />
      </van-popup>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import { FormatTime } from '@/common/util.js';
import {GetCompanyInfo,GetIndustry,EditCompanyInfo,FileUpload} from '@/common/api.js'
export default {
  name:'EditCompany',
  data(){
    return{
      form:{
        Logo:'',
        CompanyName:'',
        LoginName:'',
        CompanyType:'',
        LinkMan:'',
        HandSet:'',
        LinkManPostName:'',
        IndustryName:'',
        EstablishmentTime:'',
        Tel:'',
        Scale:'',
        RegisterAddress:'',
        AreaCategoryName:'',
        AreaCategory:'',
        IndustryID:'',
        ProvinceID:'',
        CityID:'',
        CountryID:'',
        RegisterProvinceID:'',
        RegisterCityID:'',
        DetailLocation:'',
        Fulladdress:'',
        Lng:'',
        Lat:'',
      },
      industryList:[],
      showIndustry:false,
      scaleList:[
        {
          id:1,
          name:'大型企业（3亿以上）'
        },
        {
          id:2,
          name:'中型企业（3000-30000万）'
        },
        {
          id:3,
          name:'小型企业（3000万以下）'
        }
      ],
      areaList:[{
        name:'华中地区',
        id:1
      },{
        name:'华北地区',
        id:2
      },{
        name:'华东地区',
        id:3
      },{
        name:'华南地区',
        id:4
      },{
        name:'西北地区',
        id:5
      },{
        name:'东北地区',
        id:6
      },{
        name:'西南地区',
        id:7
      },{
        name:'华北东北',
        id:8
      },{
        name:'华东华中',
        id:9
      },{
        name:'华南西部',
        id:10
      },{
        name:'港澳台',
        id:11
      },{
        name:'境外',
        id:12
      },],
      showScale:false,
      showArea:false,
      scaleName:'',
      minDate:new Date(1900,0,1),
      maxDate:new Date(2100,11,31),
      showDate:false,
      defaultDate:'',
    }
  },
  watch: {
    '$route'(to,from){
      if(to.path=='/editCompany' && from.path=='/location'){
        let mapPoint=this.$store.state.mapPoint;
        if(mapPoint){
          if(mapPoint.addressType==1){
            //企业所在地
            this.$set(this.form,'Fulladdress',mapPoint.FullAddress);
            this.$set(this.form,'Lat',mapPoint.Lat);
            this.$set(this.form,'Lng',mapPoint.Lng);
            // this.$set(this.form,'ProvinceID',mapPoint.ProvinceID);
            // this.$set(this.form,'CityID',mapPoint.CityID);
            // this.$set(this.form,'CountyID',mapPoint.XianID);
            this.$set(this.form,'DetailLocation',mapPoint.DetailLocation);
          }
          if(mapPoint.addressType==2){
            this.$set(this.form,'RegisterAddress',mapPoint.FullAddress + mapPoint.DetailLocation);
            // this.$set(this.form,'RegisterProvinceID',mapPoint.ProvinceID);
            // this.$set(this.form,'RegisterCityID',mapPoint.CityID);
            // this.$set(this.form,'RegisterCountryID',mapPoint.XianID);
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      userData:state=>state.userData,
    })
  },
  mounted() {
    this.init();
  },
  activated() {
    if(!this.form.CompanyName){
      this.init();
    }
  },
  methods: {
    init(){
      GetCompanyInfo({CompanyId:this.userData.CompanyId}).then(r=>{
        if(r.Result==1){
          this.form={...r.Data};
          switch (this.form.Scale) {
            case 1:
              this.scaleName='大型企业（3亿以上）'
              break;
            case 2:
              this.scaleName='中型企业（3000-30000万）'
              break;
            case 3:
              this.scaleName='小型企业（3000万以下）'
              break;
          }
          this.form['CountyID']=this.form.CountryID;
        }else{
          this.$toast(r.Message);
        }
      })
      // 行业列表
      GetIndustry({
        parentID: 0
      }).then(r=>{
        if(r.Result==1){
          this.industryList=r.Data;
        }
      })
    },
    //选择行业
    pickIndustry(data){
      this.form.IndustryName=data.name;
      this.form.IndustryId=data.id;
      this.showIndustry=false;
    },
    //选择规模
    pickScale(data){
      this.scaleName=data.name;
      this.form.Scale=data.id;
      this.showScale=false;
    },
    //选择大区
    pickArea(data){
      this.form.AreaCategoryName=data.name;
      this.form.AreaCategory=data.id;
      this.showArea=false;
    },
    //格式化时间弹框
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      }else if (type === 'day') {
        return `${val}日`;
      }
      return val;
    },
    showDatePicker(){
      if(this.form.EstablishmentTime){
        let arr=this.form.EstablishmentTime.split('-');
        this.defaultDate=new Date(arr[0],arr[1]-1,arr[2]);
      }else{
        this.defaultDate=new Date();
      }
      this.showDate=true;
    },
    //确认
    pickDate(date){
      this.form.EstablishmentTime=FormatTime(date,'yyyy-MM-dd');
      this.showDate=false;
    },
    //
    setAddress(type){
      this.$store.commit('setMapPoint',null);
      let obj={
        addressType:type
      }
      this.$router.push({path:'/location',query:{type}})
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
          this.form.Logo=r.Data[0].imgUrl;
        }
      })
    },
    save(){
      EditCompanyInfo({
        ...this.form,
        CompanyId:this.userData.CompanyId
      }).then(r=>{
        this.$toast(r.Message);
        if(r.Result==1){
          this.$router.go(-1);
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.editComapny{
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