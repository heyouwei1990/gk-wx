<template>
  <div class="searchOrder">
    <div class="van-nav-bar primary-header van-nav-bar--fixed" style="z-index: 10;">
      <div class="van-nav-bar__content">
        <div class="van-nav-bar__left" @click="back">
          <i class="van-icon van-icon-arrow-left van-nav-bar__arrow"><!----></i>
        </div>
        <van-search
          v-model.trim="keyword"
          show-action
          shape="round"
          placeholder="请输入您要查询的内容"
          @search="search"
        >
          <template #action>
            <div @click="search(null)">搜索</div>
          </template>
        </van-search>
      </div>
    </div>
    <section class="history" v-if="history.length">
      <div class="flex">
        <h3 class="title">历史搜索</h3>
        <span class="btn-clear" @click="clear">清空</span>
      </div>
      <div class="word-list">
        <span class="word" v-for="(item,index) in history" :key="index" @click="search(item)">{{item}}</span>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name:'SearchOrder',
  data(){
    return{
      keyword:'',
      history:[],
    }
  },
  created() {
    let history=this.$getStorage('searchOrder');
    if(history){
      this.history=history.split('&');
    }
  },
  methods: {
    back(){
      this.$store.commit('setSearchOrderWord',null);
      this.$router.go(-1);
    },
    search(item){
      let keyword=item?item:this.keyword;
      if(keyword==''){
        return;
      }
      if(this.history.includes(keyword)){
        var index=this.history.indexOf(keyword);
        this.history.splice(index,1);
        this.history.unshift(keyword);
      }else{
        this.history.unshift(keyword);
        if(this.history.length>10){
          this.history.splice(9,1);
        }
      }
      this.$setStorage('searchOrder',this.history.join('&'));
      this.$store.commit('setSearchOrderWord',keyword);
      this.$router.go(-1);
    },
    clear(){
      this.history=[];
      this.$removeStorage('searchOrder');
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~@/style/_base.scss';
.searchOrder{
  padding-top: 46px;
  overflow: hidden;
  .van-nav-bar__left{
    position: static;
  }
  .van-search{
    background-color: $primary;
    padding: 6px 0px;
    flex: 1;
  }
  .van-icon-search{
    color: #999 !important;
  }
  .van-icon-clear{
    color: #999 !important;
  }
  .van-search__action{
    color: #fff;
    &:active{
      background-color: $active;
    }
  }
  .history{
    padding: 20px 15px;
    background-color: #fff;
    .flex{
      @include flex;
      margin-bottom: 10px;
    }
    .title{
      font-size: 14px;
      color: #333;
      line-height: 24px;
    }
    .btn-clear{
      font-size: 12px;
      color: #666;
      line-height: 24px;
    }
    .word-list{
      display: flex;
      flex-wrap:wrap;
      .word{
        padding: 0 8px;
        height: 24px;
        line-height: 22px;
        font-size: 14px;
        color: #666;
        border: 1px solid #e5e5e5;
        background-color: #fff;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 2px;
      }
    }
  }
}
</style>