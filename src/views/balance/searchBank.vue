<template>
  <div class="search-bank">
    <van-search
      v-model.trim="keyword"
      show-action
      placeholder="请输入查询内容"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <ul class="result-list">
      <li v-for="(item,index) in searchResult" :key="index" @click="confirm(item)">
        <van-icon class="icon-search" name="search" />
        {{item.CodeName1}}
      </li>
    </ul>
    <div id="map-container"></div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {CodeLines} from '@/common/api.js'
export default {
  name:'SearchBank',
  data(){
    return{
      keyword:'',
      searchResult:[],
      BankList:[],
    }
  },
  watch: {
    keyword:{
      handler(value){
        if(value){
          this.searchResult=this.BankList.filter(item=>{
            return item.CodeName1.indexOf(value)>-1
          })
        }else{
          this.searchResult=this.BankList;
        }
      },
      immediate:true,
    }
  },
  mounted() {
    this.loadList();
  },
  methods: {
    loadList(){
      CodeLines({
        CodeName:'Bank',
      }).then(r=>{
        if(r.Result==1){
          this.BankList=r.Data.Lines || [];
          this.searchResult=this.BankList;
        }
      })
    },
    onSearch(){
      this.searchResult=this.BankList.filter(item=>{
        return item.CodeName1.indexOf(this.keyword)>-1
      })
    },
    confirm(item){
      this.keyword=item.CodeName1;
      this.$store.commit('setBank',item);
      this.$router.go(-1);
    }
  },
}
</script>
<style lang="scss">
.search-bank{
  padding-top: 46px;
  min-height: calc(100vh - 46px);
  background-color: #fff;
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