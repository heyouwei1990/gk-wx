<template>
  <div class="locationPage">
    <van-nav-bar
      :title="title"
      class="primary-header"
      left-arrow
      fixed
      right-text="保存"
      :border="false"
      @click-left="$router.go(-1)"
      @click-right="save"
    />
    <div class="info-item">
      <span class="label">选择地址</span>
      <div class="input" @click="openMap">{{form.FullAddress}}</div>
    </div>
    <div class="info-item">
      <span class="label">门牌号</span>
      <input class="input" type="text" v-model="form.DetailLocation" placeholder="">
    </div>
  </div>
</template>
<script>
import {
  GetAreas,
} from "@/common/api.js";
import {mapState} from 'vuex'
export default {
  name:'Location',
  data(){
    return{
      title:'所在地',
      showCityPicker:false,
      provinceList:[],
      form:{
        ProvinceID:0,
        CityID:0,
        Lat:'',
        Lng:'',
        FullAddress:'',
        CityName:'',
        DetailLocation:'',
      },
      type:'',
    }
  },
  computed: {
    ...mapState({
      pickedAddress:state=>state.pickedAddress,
    })
  },
  watch: {
    '$route'(to,from){
      if(to.path=='/location' && (from.path=='/searchAddress' || from.path=='/baiduMap')){
        if(this.$store.state.mapPoint){
          var mapPoint=this.$store.state.mapPoint;
          // this.form.FullAddress=mapPoint.fullAddress;
          this.$set(this.form,'FullAddress',mapPoint.fullAddress);
          console.log(mapPoint);
        }
      }
    }
  },
  created() {
    this.type=Number(this.$route.query.type);
    // this.init();
  },
  mounted() {
    let mapPoint=this.$store.state.mapPoint;
    if(mapPoint){
      this.form.FullAddress=mapPoint.FullAddress;
      this.form.Lat=mapPoint.Lat;
      this.form.Lng=mapPoint.Lng;
      this.form.CityName=mapPoint.CityName;
    }
  },
  // activated() {
  //   this.type=Number(this.$route.query.type);
  //   this.form.DetailLocation='';
  // },
  methods: {
    // init(){
    //   GetAreas().then(r=>{
    //     if(r.Result==1){
    //       this.provinceList=r.Data.province || [];
    //     }else{
    //       this.$toast(r.Message);
    //     }
    //   });
    // },
    //省市区联动
    // districtChange(picker,values,index){
    //   picker.setColumnValues(1, values[0].cityList);
    //   if(index==0){
    //     picker.setColumnValues(2, values[0].cityList[0].xianList);
    //   }
    //   if(index==1){
    //     picker.setColumnValues(2, values[1].xianList);
    //   }
    // },
    //确认省市区
    // pickDistrict(values){
    //   this.$store.commit('setPickedAddress',null);
    //   // this.form.ProvinceID=values[0].ID;
    //   // this.form.CityID=values[1].ID;
    //   // this.form.XianID=values[2].ID;
    //   let obj={
    //     province:values[0].name,
    //     city:values[1].name,
    //     district:values[2].name,
    //     fullAddress:this.form.FullAddress,
    //     lat:this.form.Lat,
    //     lng:this.form.Lng,
    //     ProvinceID:values[0].ID,
    //     CityID:values[1].ID,
    //     XianID:values[2].ID,
    //     addressType:this.type,
    //   }
    //   this.showCityPicker=false;
    //   // this.$store.commit('setPickedAddress',obj);
    //   this.$nextTick(()=>{
    //     this.$router.push({name:'SearchAddress',params:obj});
    //   })
    // },
    
    //打开地图
    openMap(){
      let obj={
        CityName:this.form.CityName,
        Lat:this.form.Lat,
        Lng:this.form.Lng,
        FullAddress:this.form.FullAddress,
      }
      this.$store.commit('setMapCity',obj.CityName);
      this.$router.push({path:'/baiduMap',query:obj})
    },
    //保存
    save(){
      let obj={addressType:this.type};
      Object.assign(obj,this.form,this.$store.state.mapPoint);//this.$store.state.pickedAddress,
      this.$store.commit('setMapPoint',obj);
      this.$router.go(-1);
    }
  },
}
</script>
<style lang="scss" scoped>
.locationPage{
  padding-top: 46px;
  .info-item{
    display:flex;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    min-height: 44px;
    justify-content: space-between;
    background-color: #fff;
    .label{
      font-size: 14px;
      color: #333;
      line-height: 44px;
      padding-left: 15px;
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
    }
  }
}
</style>