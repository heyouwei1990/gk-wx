<template>
  <div class="industry-search">
    <van-search
      v-model.trim="keyword"
      show-action
      placeholder="请输入行业"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <ul class="result-list">
      <li v-for="(item,index) in industryList" :key="index" @click="pick(item)">
        <van-icon class="icon-search" name="search" />
        <span class="parent" v-html="item.parentName"></span>
        <span class="child" v-html="item.childName"></span>
      </li>
    </ul>
  </div>
</template>
<script>
import {
  GetDropDownIndustryList
} from '@/common/api.js'
import {mapState} from 'vuex'
export default {
  data(){
    return{
      keyword:'',
      industryList:[],
    }
  },
  computed:{
    ...mapState({
      userData:state=>state.userData,
      industryData:state=>state.industryData,
    }),
  },
  watch:{
    keyword(){
      this.loadIndustry();
    }
  },
  created() {
    this.loadIndustry();
  },
  methods: {
    onSearch(){
      this.loadIndustry();
    },
      // 行业列表
    loadIndustry(){
      GetDropDownIndustryList({
        platform:'pcweb',
        IndustryName:this.keyword
      }).then(r=>{
        if(r.Result==1){
          let list=r.Data ||[];
          list.map(item=>{
            if(this.keyword!==''&& item.FirstLevelIndustryName.indexOf(this.keyword)!=-1){
              item['parentName']=item.FirstLevelIndustryName.replace(this.keyword,`<i>${this.keyword}</i>`);
            }else{
              item['parentName']=item.FirstLevelIndustryName;
            }
            if(this.keyword!==''&& item.SecondIndustryName.indexOf(this.keyword)!=-1){
              item['childName']=item.SecondIndustryName.replace(this.keyword,`<i>${this.keyword}</i>`);
            }else{
              item['childName']=item.SecondIndustryName;
            }
          })
          this.industryList=list;
        }
      })
    },
    pick(item){
      this.$store.commit('setIndustryData',item);
      this.$router.back(1);
    }
  },
}
</script>
<style lang="scss">
.industry-search{
  padding-top: 44px;
  .van-search{
    background-color: #f75959;
    position: fixed;
    left: 50%;
    top: 0;
    z-index: 2;
    width: 100%;
    max-width: 750px;
    height: 44px;
    padding: 5px 0px 5px 12px;
    transform: translateX(-50%);
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
      min-height: 34px;
    }
    .icon-search{
      position: absolute;
      left: 10px;
      top: 9px;
      font-size: 16px;
      color: #999;
    }
    .parent{
      font-size: 14px;
      i{
        color: #f75959;
      }
    }
    .child{
      font-size: 12px;
      padding-left: 10px;
      i{
        color: #f75959;
      }
    }
  }
}
</style>