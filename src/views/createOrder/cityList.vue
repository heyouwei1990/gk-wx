<template>
  <div class="cityPage">
    <van-nav-bar  left-arrow fixed @click-left="$router.go(-1)">
      <template #title>
        <van-search
          v-model.trim="keyword"
          shape="round"
          placeholder="搜索"
          @search="onSearch"
        >
          <template #action>
            <div @click="onSearch">搜索</div>
          </template>
        </van-search>
      </template>
    </van-nav-bar>
    <ul class="letters">
      <li 
        v-for="(item,index) in letterList" 
        :class="{on:currentLetter==item}" 
        :key="index"
        @click="tapLetter(item)"
      >{{item}}</li>
    </ul>
    <div class="scroll-inner">
      <div class="location">当前定位城市 {{mapCity}}</div>
      <div class="module-title">常用城市</div>
      <ul class="city-modules">
        <li v-for="(item,index) in usualCityList" :key="index" @click="pickCity(item)">{{item.AreaName}}</li>
      </ul>
      <div class="module-title">热门城市</div>
      <ul class="city-modules">
        <li v-for="(item,index) in hotCityList" :key="index" @click="pickCity(item)">{{item.AreaName}}</li>
      </ul>
      <div class="province-list" v-for="(item,index) in provinceList" :key="index">
        <div class="province-name">
          <i class="letter" :ref="item.Province.FirstLetter">{{item.Province.FirstLetter}}</i>
          {{item.Province.AreaName}}
        </div>
        <ul class="city-list">
          <li v-for="city in item.CityList" :key="city.Id" @click="pickCity(city)">{{city.AreaName}}</li>
        </ul>
      </div>
    </div>
    <div class="result-scroll" v-show="showCityList">
      <ul class="result-list">
        <li v-for="(item,index) in cityResult" :key="index" @click="pickCity(item)">
          <i class="icon-search van-icon van-icon-search"></i>
          <div class="name">{{item.AreaName}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {
  GetSelectCityView
} from "@/common/api.js";
import {mapState} from 'vuex'
export default {
  data(){
    return{
      keyword:'',
      provinceList:[],//省市区列表
      hotCityList:[],//热门城市
      usualCityList:[],//常用地址
      searchResult:[],//搜索结果
      currentLetter:'A',
      showCityList:false,
      localCity:'',
    }
  },
  computed:{
    ...mapState({
      userData:state=>state.userData,
      mapCity:state=>state.mapCity,
    }),
    letterList(){
      //获取省首字母列表
      let arr=[];
      let obj={};
      for (let i = 0; i < this.provinceList.length; i++) {
        if(!obj[this.provinceList[i].Province.FirstLetter]){
          // 去重
          arr.push(this.provinceList[i].Province.FirstLetter);
          obj[this.provinceList[i].Province.FirstLetter]=1;
        }
      }
      return arr;
    },
    cityResult(){
      //根据搜索文字筛选城市名称
      let arr=[];
      for (let i = 0; i < this.provinceList.length; i++) {
        for (let j = 0; j < this.provinceList[i].CityList.length; j++) {
          let name=this.provinceList[i].CityList[j].AreaName;
          if(this.keyword!='' && name.indexOf(this.keyword)!=-1){
            arr.push(this.provinceList[i].CityList[j]);
          }
        }
      }
      return arr;
    },
  },
  watch:{
    keyword(value){
      if(value!=='' && this.cityResult.length>0){
        this.showCityList=true;
      }else{
        this.showCityList=false;
      }
    }
  },
  created() {
    this.getCityList();
  },
  mounted() {
    let that=this;
    window.addEventListener('scroll',()=>{
      that.scroll();
    })
  },
  beforeDestroy() {
    this.scroll=function () {
      
    };
  },
  methods: {
    //省市列表；
    getCityList(){
      let params={};
      if(this.userData && this.userData.UserId){
        params['userID']=this.userData.UserId;
      }else if(this.userData && this.userData.CompanyId){
        params['companyID']=this.userData.CompanyId;
      }else{
        return;
      }
      GetSelectCityView(params).then(r=>{
        if(r.Result==1){
          this.provinceList=r.Data.ProvinceCityList || [];
          this.usualCityList=r.Data.FrequentCityList || [];
          this.hotCityList=r.Data.HotCityList || [];
        }
      })
    },
    //点击字母
    tapLetter (data){
      this.currentLetter=data;
      // document.documentElement.scrollTop=this.$refs[data][0].offsetTop-50;
      this.$refs[data][0].scrollIntoView({
        behavior: "smooth",// 平滑过渡
        block:"center" 
      });
    },
    //选择市
    pickCity(item){
      this.keyword='';//清空城市列表
      this.$store.commit('setMapCity',item.AreaName);
      this.$router.go(-1);
    },
    //
    onSearch(){

    },
    scroll(){
      let s_top=document.documentElement.scrollTop;
      for (let i = 0; i < this.letterList.length; i++) {
        let l_top=this.$refs[this.letterList[i]][0].offsetTop;
        if(s_top>=l_top-window.innerHeight/2){
          this.currentLetter=this.letterList[i];
        }
      }
    },
  },
}
</script>
<style lang="scss">
@import '~@/style/_base.scss';
.cityPage{
  padding-top: 46px;
  background-color: #fff;
  min-height: 100vh;
  .van-search .van-icon{
    color: #ccc;
  }
  .van-nav-bar__content{
    padding-left: 46px;
  }
  .van-nav-bar__title{
    flex: 1;
    max-width: 100%;
  }
  .letters{
    position: fixed;
    right: 6px;
    top:50%;
    transform: translateY(-50%);
    max-height: 80vh;
    overflow-y: auto;
    >li{
      font-size: 14px;
      color: #333;
      line-height: 24px;
      cursor: pointer;
      &.on{
        color: $primary;
      }
    }
  }
  .location{
    font-size: 14px;
    color: #333;
    line-height: 24px;
    // margin-bottom: 10px;
    padding: 10px 15px;
  }
  .module-title{
    font-size: 14px;
    color: #333;
    line-height: 24px;
    padding: 10px 15px;
    // margin-bottom: 10px;
  }
  .city-modules{
    overflow: hidden;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 10px;
    padding-left: 15px;
    >li{
      float: left;
      width: 70px;
      height: 32px;
      line-height: 32px;
      padding: 0 6px;
      background-color: #e5e5e5;
      color: #333;
      font-size: 14px;
      border-radius: 6px;
      text-align: center;
      margin-right: 15px;
      margin-bottom: 15px;
      white-space: nowrap;
      overflow: hidden;
      -webkit-user-select: none;
      &:active{
        background-color: $primary;
        color: #fff;
      }
    }
  }
  .province-list{
    padding-left: 15px;
    .province-name{
      font-size: 16px;
      color: #333;
      line-height: 24px;
      margin-bottom: 10px;
      .letter{
        font-size: 15px;
        color: #999;
        padding-right: 20px;
      }
    }
  }
  .city-list{
    overflow: hidden;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
    margin-bottom: 10px;
    >li{
      float: left;
      font-size: 14px;
      color: #333;
      line-height: 24px;
      cursor: pointer;
      margin-right: 30px;
      margin-bottom: 10px;
      -webkit-user-select: none;
      &:active{
        color: $primary;
      }
    }
  }
  .result-scroll{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    padding-top: 46px;
    z-index: 2;
    background-color: #fff;
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