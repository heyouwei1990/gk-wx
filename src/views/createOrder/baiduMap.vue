<template>
  <div class="baiduMap">
    <van-nav-bar
      title="选择地址"
      left-arrow
      fixed
      right-text="确定"
      @click-left="$router.go(-1)"
      @click-right="confirmMap"
    />
    <div class="map-container" id="map-container"></div>
    <div class="search-wrapper">
      <div class="flex">
        <span class="label">目标城市:</span>
        <span class="city" @click="$router.push('/cityList')">{{form.CityName}}</span>
        <span class="local" @click="getLocal"><van-icon name="aim" />当前位置</span>
      </div>
      <div class="search-box">
        <van-search
          v-model.trim="keyword"
          shape="round"
          placeholder="输入您想要的具体地址"
          @search="search"
          @focus="openSearch"
        />
      </div>
    </div>
    <ul class="result-list">
      <li :class="{on:checked==index}" v-for="(item,index) in searchResult" :key="index" @click="pick(index)">
        <van-icon v-if="checked==index" class="icon" name="location-o" color="#f75959" />
        <i v-else class="icon icon-radio"></i>
        {{item.title}}
        <div class="desc">{{item.address}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
import {
  GetJobAddressList
} from "@/common/api.js";
import {mapState} from 'vuex'
let BMap=window.BMap;
let map,local;
export default {
  data(){
    return{
      searchResult:[],
      keyword:'',
      localCity:'',
      checked:-1,
      mapPoint:null,
      form:{
        CityName:'',
        FullAddress:'',
        Lat:'',
        Lng:'',
      }
    }
  },
  computed:{
    ...mapState({
      userData:state=>state.userData,
      mapCity:state=>state.mapCity,
    })
  },
  watch:{
    mapCity:{
      handler(value){
        let params=this.$route.query;
        if(params.CityName==this.mapCity){
          if(params.CityName){
            this.keyword=params.FullAddress||'';
          }
          this.form={
            CityName:params.CityName||'',
            FullAddress:params.FullAddress||'',
            Lat:params.Lat||'',
            Lng:params.Lng||'',
          }
        }
        this.form.CityName=value;
        this.$nextTick(()=>{
          this.renderMap();
        })
      },
      immediate:true,
    },
  },
  created() {
    // this.pageInit();
  },
  mounted() {
    // this.renderMap();
  },
  methods: {
    // pageInit(){
      
    // },
    //去搜索页面
    openSearch(){
      this.$router.push({
        name:'SearchAddress',
        params:{
          FullAddress:this.keyword,
          CityName:this.form.CityName
        }
      })
    },
    //渲染地图
    renderMap(){
      let that=this;
      map = new BMap.Map("map-container");
      //地图控制器
      let navigationControl = new BMap.NavigationControl({
          anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 靠左上角位置
          type: window.BMAP_NAVIGATION_CONTROL_LARGE, // LARGE类型
          enableGeolocation: true, // 启用显示定位
      });
      // map.addControl(navigationControl)
      map.enableScrollWheelZoom(true);
      //地图中心为选中的城市或者用户所在城市
      if(that.form.CityName){
        map.centerAndZoom(that.form.CityName, 12);
      }else{
        // let geolocation = new BMap.Geolocation();
        // geolocation.enableSDKLocation();
        // geolocation.getCurrentPosition(function(r) {
        //     if (this.getStatus() == window.BMAP_STATUS_SUCCESS) {
        //         map.centerAndZoom(r.point, 12);
        //     } 
        // });
        let localCity = new BMap.LocalCity();
        localCity.get((r)=>{
          if(r){
            that.form.CityName=r.name;
            that.renderMap();
          }
        })
        // return;
      }
      var location=that.form.CityName;// || map;//如果城市未选择，则参数为地图实例
      local=new BMap.LocalSearch(location,{
        renderOptions:{
          map:map,
          selectFirstResult:false,
        },
        onMarkersSet:function (array) {
          map.clearOverlays();
        },
        onSearchComplete:function(res) {
          var num=res.getCurrentNumPois();
          var arr=[];
          for (let i = 0; i < num; i++) {
            arr.push(res.getPoi(i));
          }
          if(that.form.CityName){
            let city=that.form.CityName.substr(0,2);
            that.searchResult=arr.filter((item)=>{
              let name=item.city || '';
              return name.indexOf(city)!==-1;
            });
          }else{
            that.searchResult=arr;
          }
        }
      });
      if(!that.keyword){
        local.search('厂')
      }else{
        local.search(that.keyword);
      }
      //如果初始化有坐标，加上标识
      that.$nextTick(()=>{
        if(that.form.Lat && that.form.Lng){
          let point={
            lng: Number(that.form.Lng),
            lat:Number(that.form.Lat)
          }
          map.centerAndZoom(point, 15);
          that.setPlace(point);
        }
      })
    },
    //回到坐标点
    getLocal(){
      let that=this;
      this.form={
        CityName:'',
        FullAddress:'',
        Lat:'',
        Lng:''
      }
      this.checked=-1;
      this.keyword='';
      that.renderMap();
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function (r){
        if (this.getStatus() == window.BMAP_STATUS_SUCCESS) {
          let currentLat = r.point.lat;
          let currentLon = r.point.lng;
          let point = new BMap.Point(currentLon,currentLat);
          // local.search('厂')
          that.$nextTick(()=>{
            map.centerAndZoom(point, 12);
            that.setPlace(point);
          })
        }else{
          that.$toast('获取坐标失败');
        }
      });
      let localCity = new BMap.LocalCity();
      localCity.get((r)=>{
        if(r){
          that.form.CityName=r.name;
          that.$store.commit('setMapCity',r.name);
        }
      })
    },
    //搜索
    search(){
      local.search(this.keyword);
    },
    pick(index){
      let that=this;
      this.checked=index;
      let item=this.searchResult[index];
      let geoc = new BMap.Geocoder();
      let point=item.point;
      let pointData={};
      //根据坐标获取地址
      geoc.getLocation(point, function(rs) {
        let addComp = rs.addressComponents;
        pointData={...addComp};
        Object.assign(pointData,point);
        //去掉多余的省市名称
        let addr='';
        if(item.title.indexOf(addComp.province)==0){
          addr=item.title.replace(addComp.province,'');
          if(addr.indexOf(addComp.city)==0){
            addr=addr.replace(addComp.city,'');
          }
        }else if(item.title.indexOf(addComp.city)==0){
          addr=item.title.replace(addComp.city,'');
        }else{
          addr=item.title;
        }
        pointData['address']=addComp.province+addComp.city+addr;
        map.centerAndZoom(point, 18);
        that.keyword=item.title;
        that.setPlace(point);
        that.mapPoint=pointData;
      })
    },
    //指定点加标识
    setPlace(point){
      map.clearOverlays();
      var marker = new BMap.Marker(point); // 创建标注
      map.addOverlay(marker); // 将标注添加到地图中
      marker.setAnimation(window.BMAP_ANIMATION_BOUNCE);
    },
    //确认
    confirmMap(){
      if(!this.mapPoint && (this.form.FullAddress=='' || this.form.Lat==='' || this.form.Lng==='')){
        this.$toast('请输入并选择地址！');
        return;
      }
      let params;
      if(this.mapPoint){
        params={
          CityName:this.mapPoint.city,
          FullAddress:this.mapPoint.address,
          Lat:this.mapPoint.lat,
          Lng:this.mapPoint.lng,
        }
      }else{
        params={
          CityName:this.form.CityName,
          FullAddress:this.form.FullAddress,
          Lat:this.form.Lat,
          Lng:this.form.Lng,
        }
      }
      this.$store.commit('setMapPoint',params);
      this.$router.go(-1);
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.baiduMap{
  padding-top: 46px;
  background-color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .map-container{
    width: 100%;
    height: 340px;
    background-color: #f8f8f8;
  }
  .search-wrapper{
    position: fixed;
    left: 50%;
    top: 50px;
    width: 92%;
    background-color: #fff;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    transform: translateX(-50%);
    .flex{
      display: flex;
      align-items: center;
      padding: 10px 14px 0;
    }
    .label{
      font-size: 14px;
      color: #999;
      line-height: 24px;
    }
    .city{
      padding-right: 15px;
      position: relative;
      margin-left: 6px;
      font-size: 15px;
      color: #333;
      line-height: 24px;
      font-weight: 500;
      white-space: nowrap;
      &:after{
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-top: 6px solid #999;
        margin-top: -4px;
      }
    }
    .local{
      font-size: 12px;
      color: #999;
      line-height: 24px;
      text-align: right;
      flex: 1;
      .van-icon{
        font-size: 18px;
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 4px;
      }
    }
  }
  .result-list{
    flex: 1;
    overflow-y: auto;
    >li{
      padding: 6px 15px 6px 40px;
      position: relative;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
      color: #333;
      line-height: 22px;
      &.on{
        color: $primary;
        .icon{
          color: $primary;
        }
      }
    }
    .icon{
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      color: #999;
    }
    .icon-radio{
      width: 14px;
      height: 14px;
      border: 1px solid #999;
      padding: 3px;
      background-color: #999;
      border-radius: 50%;
      background-clip: content-box;
    }
    .desc{
      font-size: 12px;
      color: #999;
      line-height: 1.5;
    }
  }
}
</style>