<template>
  <div class="search-address">
    <van-search
      v-model.trim="keyword"
      show-action
      placeholder="请输入搜索地址"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <ul class="result-list">
      <li v-for="(item,index) in searchResult" :key="index" @click="confirm(item)">
        <van-icon class="icon-search" name="search" />
        {{item.title}}
        <div class="desc">{{item.address}}</div>
      </li>
    </ul>
    <div id="map-container"></div>
  </div>
</template>
<script>
let BMap=window.BMap;
let Map=null,Local=null;
import {mapState} from 'vuex'
export default {
  name:'SearchAddress',
  data(){
    return{
      keyword:'',
      searchResult:[],
    }
  },
  watch: {
    keyword(value){
      if(value){
        // if(this.$route.params.CityName){
        //   value=this.$route.params.CityName+value;
        // }
        Local.search(value);
      }else{
        this.searchResult=[];
      }
    }
  },
  created() {
    if(!this.$route.params.CityName){
      this.$router.go(-1);
    }
  },
  mounted() {
    this.ready();
    if(this.$route.params.FullAddress){
      this.keyword=this.$route.params.FullAddress;
      Local.search(this.keyword);
    }else{
      Local.search('厂');
    }
  },
  methods: {
    ready(){
      let that=this;
      Map = new BMap.Map("map-container");
      //搜索范围，如果有城市则搜索区域为该市，否则搜索地区不限
      let location=Map;
      if(that.$route.params.CityName){
        location=that.$route.params.CityName;
      }
      Local=new BMap.LocalSearch(location,{
        renderOptions:{
          map:Map,
          selectFirstResult:false,
        },
        onMarkersSet:function (array) {
          //清除地址标识
          Map.clearOverlays();
        },
        onSearchComplete:function(res) {
          var num=res.getCurrentNumPois();
          var arr=[];
          for (let i = 0; i < num; i++) {
            arr.push(res.getPoi(i));
          }//过滤掉没有城市名的数据 
          arr=arr.filter(item=>{
            return item.city
          })
          that.searchResult=arr;
          //过滤掉搜索的外地地址
          // if(that.$route.params.CityName){
          //   that.searchResult=arr.filter((item)=>{
          //     var city=item.city || '';
          //     return city.substr(0,2)==that.$route.params.CityName.substr(0,2);
          //   });
          // }else{
          //   that.searchResult=arr;
          // }
        }
      })
    },
    onSearch(){
      Local.search(this.keyword);
    },
    confirm(item){
      let that=this;
      let geoc = new BMap.Geocoder();
      let point=item.point;
      let pointData={};
      //根据坐标获取地址
      geoc.getLocation(point, function(rs) {
        let addComp = rs.addressComponents;
        // pointData={...addComp};
        pointData=Object.assign({},that.$route.params,addComp,point);
        // pointData['FullAddress']=addComp.province+addComp.city+addComp.district+item.title;
        that.keyword=item.title;
        let params={
          FullAddress:addComp.province+addComp.city+addComp.district+item.title,
          CityName:pointData.city || pointData.CityName,
          Lng:pointData.lng,
          Lat:pointData.lat,
        }
        // that.$store.commit('setMapCity',pointData.city);
        that.$store.commit('setMapPoint',params);
        that.$router.go(-2);
      })
    }
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.search-address{
  padding-top: 44px;
  .van-search{
    background-color: #f75959;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 44px;
    padding: 5px 0px 5px 12px;
  }
  .van-search__content{
    border-radius: 40px;
  }
  .van-search__action{
    color: #fff;
    &:active{
      background-color: transparent;
    }
  }
  .result-list{
    >li{
      padding: 6px 15px 6px 40px;
      position: relative;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
      color: #666;
      line-height: 22px;
    }
    .icon-search{
      position: absolute;
      left: 10px;
      top: 9px;
      font-size: 16px;
      color: #999;
    }
    .desc{
      font-size: 12px;
      color: #999;
      line-height: 1.5;
    }
  }
}
</style>